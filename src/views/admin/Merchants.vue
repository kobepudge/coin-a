<template>
  <div>
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">商家管理</h1>
      <n-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        新增商家
      </n-button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg mr-3">
            <n-icon size="24" color="#3b82f6"><BusinessOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">总商家数</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg mr-3">
            <n-icon size="24" color="#10b981"><ArrowUpOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">出货商家</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.sellers }}</p>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg mr-3">
            <n-icon size="24" color="#8b5cf6"><ArrowDownOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">收购商家</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.buyers }}</p>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-emerald-100 rounded-lg mr-3">
            <n-icon size="24" color="#059669"><CheckmarkCircleOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">在线商家</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.online }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="card p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <n-input
            v-model:value="searchQuery"
            placeholder="搜索商家名称..."
            clearable
            @input="debouncedSearch"
          >
            <template #prefix>
              <n-icon><SearchOutline /></n-icon>
            </template>
          </n-input>
        </div>
        <div class="flex gap-2">
          <n-select
            v-model:value="filterType"
            placeholder="商家类型"
            clearable
            style="width: 120px"
            :options="typeOptions"
            @update:value="loadMerchants"
          />
          <n-select
            v-model:value="filterStatus"
            placeholder="商家状态"
            clearable
            style="width: 120px"
            :options="statusOptions"
            @update:value="loadMerchants"
          />
          <n-button @click="resetFilters">重置</n-button>
        </div>
      </div>
    </div>

    <!-- 商家表格 -->
    <div class="card">
      <n-data-table
        :columns="columns"
        :data="merchants"
        :loading="loading"
        :pagination="paginationReactive"
        :row-key="(row: Merchant) => row.id"
        @update:checked-row-keys="handleCheck"
      />
    </div>

    <!-- 批量操作 -->
    <div v-if="checkedRowKeys.length > 0" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div class="bg-white rounded-lg shadow-lg border px-4 py-3 flex items-center gap-4">
        <span class="text-sm text-gray-600">已选择 {{ checkedRowKeys.length }} 个商家</span>
        <n-button size="small" @click="batchUpdateStatus('online')">批量上线</n-button>
        <n-button size="small" @click="batchUpdateStatus('offline')">批量下线</n-button>
        <n-button size="small" type="error" @click="batchDelete">批量删除</n-button>
      </div>
    </div>

    <!-- 新增/编辑商家弹窗 -->
    <n-modal
      v-model:show="showCreateModal"
      preset="card"
      title="新增商家"
      class="merchant-modal"
      :style="modalStyle"
    >
      <merchant-form
        :merchant="editingMerchant"
        mode="create"
        @submit="handleSubmit"
        @cancel="showCreateModal = false"
      />
    </n-modal>

    <n-modal
      v-model:show="showEditModal"
      preset="card"
      title="编辑商家"
      class="merchant-modal"
      :style="modalStyle"
    >
      <merchant-form
        :merchant="editingMerchant"
        mode="edit"
        @submit="handleSubmit"
        @cancel="showEditModal = false"
      />
    </n-modal>

    <!-- 二维码预览弹窗 -->
    <n-modal
      v-model:show="showQrPreview"
      preset="card"
      title="收款二维码预览"
      class="qr-preview-modal"
      :style="qrModalStyle"
    >
      <div class="flex flex-col items-center p-4">
        <img
          :src="previewQrUrl"
          alt="收款二维码"
          class="max-w-xs max-h-xs border rounded-lg shadow-sm"
          @error="message.error('二维码加载失败')"
        />
        <div class="mt-4 text-sm text-gray-500 text-center">
          点击右键可保存二维码图片
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
import { 
  NButton, NDataTable, NModal, NInput, NSelect, NIcon, useMessage, useDialog,
  type DataTableColumns, type PaginationProps
} from 'naive-ui'
import { 
  AddOutline, BusinessOutline, ArrowUpOutline, ArrowDownOutline, 
  CheckmarkCircleOutline, SearchOutline, CreateOutline, TrashOutline 
} from '@vicons/ionicons5'
import type { Merchant } from '@/types'
import { getMerchants, getMerchantStats, updateMerchant, deleteMerchant, 
         createMerchant, batchUpdateMerchantStatus, setCurrentSeller } from '@/api/merchant'
import { debounce } from 'lodash-es'
import MerchantForm from '@/components/MerchantForm.vue'

const message = useMessage()
const dialog = useDialog()

// 数据状态
const merchants = ref<Merchant[]>([])
const loading = ref(false)
const searchQuery = ref('')
const filterType = ref<'seller' | 'buyer' | null>(null)
const filterStatus = ref<'online' | 'offline' | null>(null)
const checkedRowKeys = ref<number[]>([])

// 弹窗状态
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showQrPreview = ref(false)
const previewQrUrl = ref('')
const editingMerchant = ref<Partial<Merchant>>({})

// 响应式样式
const modalStyle = computed(() => {
  const width = window.innerWidth
  if (width < 640) {
    // 移动端：几乎全屏
    return {
      width: '95vw',
      maxWidth: '95vw',
      margin: '10px'
    }
  } else if (width < 1024) {
    // 平板：适中宽度
    return {
      width: '80vw',
      maxWidth: '700px'
    }
  } else {
    // 桌面：固定宽度
    return {
      width: '600px',
      maxWidth: '90vw'
    }
  }
})

const qrModalStyle = computed(() => {
  const width = window.innerWidth
  if (width < 640) {
    return {
      width: '90vw',
      maxWidth: '90vw'
    }
  } else {
    return {
      width: '400px',
      maxWidth: '90vw'
    }
  }
})

// 统计数据
const stats = ref({
  total: 0,
  sellers: 0,
  buyers: 0,
  online: 0,
  offline: 0
})

// 分页配置
const paginationReactive = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    paginationReactive.page = page
    loadMerchants()
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    loadMerchants()
  }
})

// 选项配置
const typeOptions = [
  { label: '出货商家', value: 'seller' },
  { label: '收购商家', value: 'buyer' }
]

const statusOptions = [
  { label: '在线', value: 'online' },
  { label: '离线', value: 'offline' }
]

// 表格列配置
const columns: DataTableColumns<Merchant> = [
  {
    type: 'selection'
  },
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '商家名称',
    key: 'name',
    minWidth: 150
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
    render(row) {
      return h('span', {
        class: `px-2 py-1 rounded-full text-xs font-medium ${
          row.type === 'seller' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
        }`
      }, row.type === 'seller' ? '出货' : '收购')
    }
  },
  {
    title: '价格',
    key: 'price',
    width: 100
  },
  {
    title: '交易方式',
    key: 'trade_method',
    width: 120
  },
  {
    title: '库存/需求',
    key: 'stock_or_demand',
    width: 120
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h('span', {
        class: `px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`
      }, row.status === 'online' ? '在线' : '离线')
    }
  },
  {
    title: '收款二维码',
    key: 'payment_qr',
    width: 120,
    render(row) {
      if (row.type === 'buyer' || !row.payment_qr) return ''

      const qrUrls = row.payment_qr.split(',').filter(url => url.trim())
      if (qrUrls.length === 0) return ''

      return h('div', { class: 'flex flex-wrap gap-1' },
        qrUrls.slice(0, 3).map((url, index) =>
          h(NButton, {
            size: 'tiny',
            tertiary: true,
            type: 'info',
            onClick: () => handlePreviewQr(url.trim())
          }, { default: () => `二维码${index + 1}` })
        ).concat(
          qrUrls.length > 3 ? [
            h('span', { class: 'text-xs text-gray-500' }, `+${qrUrls.length - 3}`)
          ] : []
        )
      )
    }
  },
  {
    title: '当前出货',
    key: 'is_current_seller',
    width: 100,
    render(row) {
      if (row.type === 'buyer') return ''
      return row.is_current_seller
        ? h('span', { class: 'text-green-600 font-medium' }, '是')
        : h(NButton, {
            size: 'small',
            tertiary: true,
            type: 'primary',
            onClick: () => handleSetCurrentSeller(row)
          }, { default: () => '设为当前' })
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return h('div', { class: 'flex gap-2' }, [
        h(NButton, {
          size: 'small',
          tertiary: true,
          type: 'primary',
          onClick: () => handleEdit(row)
        }, { default: () => h(NIcon, null, { default: () => h(CreateOutline) }) }),
        h(NButton, {
          size: 'small',
          tertiary: true,
          type: 'error',
          onClick: () => handleDelete(row)
        }, { default: () => h(NIcon, null, { default: () => h(TrashOutline) }) })
      ])
    }
  }
]

// 防抖搜索
const debouncedSearch = debounce(() => {
  paginationReactive.page = 1
  loadMerchants()
}, 300)

// 加载商家数据
const loadMerchants = async () => {
  try {
    loading.value = true
    
    const params = {
      type: filterType.value || undefined,
      status: filterStatus.value || undefined,
      search: searchQuery.value || undefined,
      page: paginationReactive.page,
      limit: paginationReactive.pageSize
    }

    const response = await getMerchants(params)
    merchants.value = response.data.merchants
    paginationReactive.itemCount = response.data.total
    
  } catch (error: any) {
    message.error(error?.response?.data?.message || '加载商家列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await getMerchantStats()
    stats.value = response.data
  } catch (error: any) {
    console.error('加载统计数据失败:', error)
  }
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  filterType.value = null
  filterStatus.value = null
  paginationReactive.page = 1
  loadMerchants()
}

// 处理选择
const handleCheck = (rowKeys: number[]) => {
  checkedRowKeys.value = rowKeys
}

// 处理编辑
const handleEdit = (merchant: Merchant) => {
  editingMerchant.value = { ...merchant }
  showEditModal.value = true
}

// 处理删除
const handleDelete = (merchant: Merchant) => {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除商家"${merchant.name}"吗？此操作不可恢复。`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteMerchant(merchant.id)
        message.success('删除成功')
        loadMerchants()
        loadStats()
      } catch (error: any) {
        message.error(error?.response?.data?.message || '删除失败')
      }
    }
  })
}

// 处理设置当前出货商家
// 预览二维码
const handlePreviewQr = (url: string) => {
  previewQrUrl.value = url
  showQrPreview.value = true
}

const handleSetCurrentSeller = async (merchant: Merchant) => {
  try {
    await setCurrentSeller(merchant.id)
    message.success('设置当前出货商家成功')
    loadMerchants()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '设置失败')
  }
}

// 处理表单提交
const handleSubmit = async (data: Partial<Merchant>) => {
  try {
    if (editingMerchant.value.id) {
      await updateMerchant(editingMerchant.value.id, data)
      message.success('更新成功')
    } else {
      await createMerchant(data)
      message.success('创建成功')
    }
    
    showCreateModal.value = false
    showEditModal.value = false
    loadMerchants()
    loadStats()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '操作失败')
  }
}

// 批量更新状态
const batchUpdateStatus = async (status: 'online' | 'offline') => {
  try {
    await batchUpdateMerchantStatus(checkedRowKeys.value, status)
    message.success(`批量${status === 'online' ? '上线' : '下线'}成功`)
    checkedRowKeys.value = []
    loadMerchants()
    loadStats()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '批量操作失败')
  }
}

// 批量删除
const batchDelete = () => {
  dialog.warning({
    title: '确认批量删除',
    content: `确定要删除选中的 ${checkedRowKeys.value.length} 个商家吗？此操作不可恢复。`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await Promise.all(checkedRowKeys.value.map(id => deleteMerchant(id)))
        message.success('批量删除成功')
        checkedRowKeys.value = []
        loadMerchants()
        loadStats()
      } catch (error: any) {
        message.error(error?.response?.data?.message || '批量删除失败')
      }
    }
  })
}

onMounted(() => {
  loadMerchants()
  loadStats()
})
</script>

<style scoped>
/* 响应式弹窗样式 */
:deep(.merchant-modal .n-card) {
  margin: 10px;
}

:deep(.qr-preview-modal .n-card) {
  margin: 10px;
}

/* 移动端优化 */
@media (max-width: 640px) {
  :deep(.merchant-modal .n-card) {
    margin: 5px;
    border-radius: 8px;
  }

  :deep(.qr-preview-modal .n-card) {
    margin: 5px;
    border-radius: 8px;
  }

  /* 表格在移动端的优化 */
  :deep(.n-data-table) {
    font-size: 14px;
  }

  :deep(.n-data-table .n-data-table-th) {
    padding: 8px 4px;
  }

  :deep(.n-data-table .n-data-table-td) {
    padding: 8px 4px;
  }
}

/* 平板端优化 */
@media (min-width: 641px) and (max-width: 1024px) {
  :deep(.merchant-modal .n-card) {
    margin: 20px;
  }
}
</style>