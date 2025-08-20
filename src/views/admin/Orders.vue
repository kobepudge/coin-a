<template>
  <div>
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">订单管理</h1>
      <div class="flex gap-2">
        <n-button @click="exportOrders" :loading="exporting">
          <template #icon>
            <n-icon><DownloadOutline /></n-icon>
          </template>
          导出订单
        </n-button>
        <n-button type="primary" @click="loadOrders">
          <template #icon>
            <n-icon><RefreshOutline /></n-icon>
          </template>
          刷新
        </n-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg mr-3">
            <n-icon size="24" color="#3b82f6"><DocumentTextOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">总订单</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg mr-3">
            <n-icon size="24" color="#f59e0b"><TimeOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">待处理</p>
            <p class="text-xl font-bold text-yellow-600">{{ stats.pending }}</p>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg mr-3">
            <n-icon size="24" color="#10b981"><CheckmarkCircleOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">已完成</p>
            <p class="text-xl font-bold text-green-600">{{ stats.completed }}</p>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg mr-3">
            <n-icon size="24" color="#ef4444"><CloseCircleOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">失败</p>
            <p class="text-xl font-bold text-red-600">{{ stats.failed }}</p>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg mr-3">
            <n-icon size="24" color="#8b5cf6"><StatsChartOutline /></n-icon>
          </div>
          <div>
            <p class="text-sm text-gray-600">今日完成</p>
            <p class="text-xl font-bold text-purple-600">{{ stats.today_completed }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="card p-4 mb-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <n-input
            v-model:value="searchQuery"
            placeholder="搜索游戏ID或商家..."
            clearable
            @input="debouncedSearch"
          >
            <template #prefix>
              <n-icon><SearchOutline /></n-icon>
            </template>
          </n-input>
        </div>
        <div class="flex gap-2 flex-wrap">
          <n-select
            v-model:value="filterStatus"
            placeholder="订单状态"
            clearable
            style="width: 120px"
            :options="statusOptions"
            @update:value="loadOrders"
          />
          <n-select
            v-model:value="filterMerchant"
            placeholder="商家"
            clearable
            style="width: 140px"
            :options="merchantOptions"
            @update:value="loadOrders"
          />
          <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            clearable
            placeholder="选择日期范围"
            @update:value="loadOrders"
          />
          <n-button @click="resetFilters">重置</n-button>
        </div>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="card">
      <n-data-table
        :columns="columns"
        :data="orders"
        :loading="loading"
        :pagination="paginationReactive"
        :row-key="(row: Order) => row.id"
        @update:checked-row-keys="handleCheck"
      />
    </div>

    <!-- 批量操作 -->
    <div v-if="checkedRowKeys.length > 0" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div class="bg-white rounded-lg shadow-lg border px-4 py-3 flex items-center gap-4">
        <span class="text-sm text-gray-600">已选择 {{ checkedRowKeys.length }} 个订单</span>
        <n-button size="small" type="success" @click="batchUpdateStatus('completed')">批量完成</n-button>
        <n-button size="small" type="warning" @click="batchUpdateStatus('failed')">批量失败</n-button>
        <n-button size="small" type="error" @click="batchUpdateStatus('rejected')">批量拒绝</n-button>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <n-modal v-model:show="showDetailModal" preset="card" style="width: 700px">
      <template #header>
        <span>订单详情 #{{ selectedOrder?.id }}</span>
      </template>
      <order-detail
        v-if="selectedOrder"
        :order="selectedOrder"
        @update-status="handleUpdateOrderStatus"
        @edit-notes="handleEditNotes"
        @close="showDetailModal = false"
      />
    </n-modal>

    <!-- 批量操作确认弹窗 -->
    <n-modal v-model:show="showBatchModal" preset="dialog" title="批量操作">
      <div class="space-y-4">
        <p>确定要将选中的 {{ checkedRowKeys.length }} 个订单状态更新为 <strong>{{ batchStatusText }}</strong> 吗？</p>
        <n-input
          v-model:value="batchNote"
          type="textarea"
          placeholder="请输入操作备注（可选）"
          :rows="3"
        />
      </div>
      <template #action>
        <div class="flex gap-2">
          <n-button @click="showBatchModal = false">取消</n-button>
          <n-button type="primary" :loading="batchSubmitting" @click="confirmBatchUpdate">
            确认
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- 编辑备注弹窗 -->
    <n-modal v-model:show="showEditNotesModal" preset="dialog" title="编辑订单备注">
      <div class="space-y-4">
        <p>订单 #{{ editingOrder?.id }} - {{ editingOrder?.player_game_id }}</p>
        <n-input
          v-model:value="editingNotes"
          type="textarea"
          placeholder="请输入管理员备注..."
          :rows="4"
          maxlength="1000"
          show-count
        />
      </div>
      <template #action>
        <div class="flex gap-2">
          <n-button @click="showEditNotesModal = false">取消</n-button>
          <n-button type="primary" :loading="notesSubmitting" @click="confirmUpdateNotes">
            保存
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- 转账截图查看弹窗 -->
    <n-modal v-model:show="showScreenshotModal" preset="card" style="width: 600px" title="转账截图">
      <div class="text-center">
        <img
          v-if="currentScreenshotUrl"
          :src="currentScreenshotUrl"
          alt="转账截图"
          class="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
          @error="handleImageError"
        />
        <div v-else class="text-gray-500 py-8">
          图片加载失败
        </div>
      </div>
      <template #action>
        <div class="flex justify-center">
          <n-button @click="showScreenshotModal = false">关闭</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
import { 
  NButton, NDataTable, NModal, NInput, NSelect, NDatePicker, NIcon, 
  useMessage, useDialog, type DataTableColumns, type PaginationProps
} from 'naive-ui'
import {
  DownloadOutline, RefreshOutline, DocumentTextOutline, TimeOutline,
  CheckmarkCircleOutline, CloseCircleOutline, StatsChartOutline,
  SearchOutline, EyeOutline, ImageOutline
} from '@vicons/ionicons5'
import type { Order, OrderStatus } from '@/types'
import { getOrders, getOrderStats, updateOrderStatus, batchUpdateOrderStatus, exportOrders as exportOrdersAPI } from '@/api/order'
import { getMerchants } from '@/api/merchant'
import { debounce } from 'lodash-es'
import OrderDetail from '@/components/OrderDetail.vue'
import { format } from 'date-fns'

const message = useMessage()
const dialog = useDialog()

// 数据状态
const orders = ref<Order[]>([])
const loading = ref(false)
const exporting = ref(false)
const searchQuery = ref('')
const filterStatus = ref<OrderStatus | null>(null)
const filterMerchant = ref<number | null>(null)
const dateRange = ref<[number, number] | null>(null)
const checkedRowKeys = ref<number[]>([])
const merchantOptions = ref<Array<{ label: string; value: number }>>([])

// 弹窗状态
const showDetailModal = ref(false)
const showBatchModal = ref(false)
const showEditNotesModal = ref(false)
const showScreenshotModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const editingOrder = ref<Order | null>(null)
const currentScreenshotUrl = ref<string>('')
const editingNotes = ref('')
const batchStatus = ref<OrderStatus>('completed')
const batchNote = ref('')
const batchSubmitting = ref(false)
const notesSubmitting = ref(false)

// 统计数据
const stats = ref({
  total: 0,
  pending: 0,
  completed: 0,
  failed: 0,
  rejected: 0,
  today_total: 0,
  today_completed: 0,
  revenue: 0
})

// 分页配置
const paginationReactive = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    paginationReactive.page = page
    loadOrders()
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    loadOrders()
  }
})

// 选项配置
const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '已完成', value: 'completed' },
  { label: '失败', value: 'failed' },
  { label: '已拒绝', value: 'rejected' }
]

// 计算属性
const batchStatusText = computed(() => {
  const option = statusOptions.find(s => s.value === batchStatus.value)
  return option?.label || ''
})

// 状态标签样式
const getStatusTag = (status: OrderStatus) => {
  const statusMap = {
    pending: { text: '待处理', class: 'bg-yellow-100 text-yellow-700' },
    completed: { text: '已完成', class: 'bg-green-100 text-green-700' },
    failed: { text: '失败', class: 'bg-red-100 text-red-700' },
    rejected: { text: '已拒绝', class: 'bg-gray-100 text-gray-700' }
  }
  return statusMap[status] || statusMap.pending
}

// 表格列配置
const columns: DataTableColumns<Order> = [
  {
    type: 'selection'
  },
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '商家',
    key: 'merchant_name',
    width: 120,
    render(row) {
      return h('span', { class: 'font-medium' }, row.merchant?.name || '-')
    }
  },
  {
    title: '游戏ID',
    key: 'player_game_id',
    width: 120
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      const tag = getStatusTag(row.status)
      return h('span', {
        class: `px-2 py-1 rounded-full text-xs font-medium ${tag.class}`
      }, tag.text)
    }
  },
  {
    title: '转账截图',
    key: 'transfer_screenshot',
    width: 100,
    align: 'center',
    render(row) {
      if (row.transfer_screenshot_url) {
        return h(NButton, {
          size: 'small',
          tertiary: true,
          type: 'info',
          onClick: () => handleViewScreenshot(row.transfer_screenshot_url)
        }, { default: () => h(NIcon, null, { default: () => h(ImageOutline) }) })
      } else {
        return h('span', { class: 'text-gray-400 text-xs' }, '无')
      }
    }
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 150,
    render(row) {
      return format(new Date(row.created_at), 'yyyy-MM-dd HH:mm')
    }
  },
  {
    title: '更新时间',
    key: 'updated_at',
    width: 150,
    render(row) {
      return format(new Date(row.updated_at), 'yyyy-MM-dd HH:mm')
    }
  },
  {
    title: '备注',
    key: 'admin_note',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row) {
      return h(NButton, {
        size: 'small',
        tertiary: true,
        type: 'primary',
        onClick: () => handleViewDetail(row)
      }, { default: () => h(NIcon, null, { default: () => h(EyeOutline) }) })
    }
  }
]

// 防抖搜索
const debouncedSearch = debounce(() => {
  paginationReactive.page = 1
  loadOrders()
}, 300)

// 加载订单数据
const loadOrders = async () => {
  try {
    loading.value = true
    
    const params = {
      status: filterStatus.value || undefined,
      merchant_id: filterMerchant.value || undefined,
      player_game_id: searchQuery.value || undefined,
      start_date: dateRange.value ? format(new Date(dateRange.value[0]), 'yyyy-MM-dd') : undefined,
      end_date: dateRange.value ? format(new Date(dateRange.value[1]), 'yyyy-MM-dd') : undefined,
      page: paginationReactive.page,
      limit: paginationReactive.pageSize
    }

    const response = await getOrders(params)
    orders.value = response.data.orders
    paginationReactive.itemCount = response.data.total
    
  } catch (error: any) {
    message.error(error?.response?.data?.message || '加载订单列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await getOrderStats()
    stats.value = response.data
  } catch (error: any) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载商家选项
const loadMerchantOptions = async () => {
  try {
    const response = await getMerchants({ limit: 100 })
    merchantOptions.value = response.data.merchants.map(m => ({
      label: m.name,
      value: m.id
    }))
  } catch (error: any) {
    console.error('加载商家选项失败:', error)
  }
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = null
  filterMerchant.value = null
  dateRange.value = null
  paginationReactive.page = 1
  loadOrders()
}

// 处理选择
const handleCheck = (rowKeys: number[]) => {
  checkedRowKeys.value = rowKeys
}

// 查看订单详情
const handleViewDetail = (order: Order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

// 更新订单状态
const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus, note: string) => {
  try {
    await updateOrderStatus(orderId, { status, admin_note: note })
    message.success('订单状态更新成功')
    loadOrders()
    loadStats()
    showDetailModal.value = false
  } catch (error: any) {
    message.error(error?.response?.data?.message || '更新失败')
  }
}

// 编辑备注
const handleEditNotes = (order: Order) => {
  editingOrder.value = order
  editingNotes.value = order.admin_notes || ''
  showEditNotesModal.value = true
}

// 查看转账截图
const handleViewScreenshot = (screenshotUrl: string) => {
  currentScreenshotUrl.value = screenshotUrl
  showScreenshotModal.value = true
}

// 处理图片加载错误
const handleImageError = () => {
  message.error('图片加载失败')
}

// 确认更新备注
const confirmUpdateNotes = async () => {
  if (!editingOrder.value) return

  try {
    notesSubmitting.value = true
    await updateOrderStatus(editingOrder.value.id, {
      status: editingOrder.value.status,
      admin_note: editingNotes.value
    })
    message.success('备注更新成功')
    loadOrders()
    loadStats()
    showEditNotesModal.value = false
    // 如果详情弹窗还开着，也需要更新
    if (selectedOrder.value && selectedOrder.value.id === editingOrder.value.id) {
      selectedOrder.value.admin_notes = editingNotes.value
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '更新失败')
  } finally {
    notesSubmitting.value = false
  }
}

// 批量更新状态
const batchUpdateStatus = (status: OrderStatus) => {
  batchStatus.value = status
  batchNote.value = ''
  showBatchModal.value = true
}

// 确认批量更新
const confirmBatchUpdate = async () => {
  try {
    batchSubmitting.value = true
    await batchUpdateOrderStatus(checkedRowKeys.value, batchStatus.value, batchNote.value)
    message.success('批量操作成功')
    checkedRowKeys.value = []
    showBatchModal.value = false
    loadOrders()
    loadStats()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '批量操作失败')
  } finally {
    batchSubmitting.value = false
  }
}

// 导出订单
const exportOrders = async () => {
  try {
    exporting.value = true
    const blob = await exportOrdersAPI({
      status: filterStatus.value || undefined,
      merchant_id: filterMerchant.value || undefined,
      player_game_id: searchQuery.value || undefined,
      start_date: dateRange.value ? format(new Date(dateRange.value[0]), 'yyyy-MM-dd') : undefined,
      end_date: dateRange.value ? format(new Date(dateRange.value[1]), 'yyyy-MM-dd') : undefined
    })
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    message.success('订单导出成功')
  } catch (error: any) {
    message.error(error?.response?.data?.message || '导出失败')
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  loadOrders()
  loadStats()
  loadMerchantOptions()
})
</script>