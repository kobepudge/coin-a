<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="商家名称" path="name">
      <n-input
        v-model:value="formData.name"
        placeholder="请输入商家名称"
        clearable
      />
    </n-form-item>

    <n-form-item label="商家类型" path="type">
      <n-select
        v-model:value="formData.type"
        placeholder="请选择商家类型"
        :options="typeOptions"
      />
    </n-form-item>

    <n-form-item label="价格" path="price">
      <n-input
        v-model:value="formData.price"
        placeholder="请输入价格"
        clearable
      />
    </n-form-item>

    <n-form-item label="交易方式" path="trade_method">
      <n-input
        v-model:value="formData.trade_method"
        placeholder="请输入交易方式"
        clearable
      />
    </n-form-item>

    <n-form-item label="库存/需求" path="stock_or_demand">
      <n-input
        v-model:value="formData.stock_or_demand"
        placeholder="请输入库存或需求"
        clearable
      />
    </n-form-item>

    <n-form-item label="速度" path="speed">
      <n-input
        v-model:value="formData.speed"
        placeholder="请输入交易速度"
        clearable
      />
    </n-form-item>

    <n-form-item label="保障" path="guarantee">
      <n-input
        v-model:value="formData.guarantee"
        placeholder="请输入保障信息（可选）"
        clearable
      />
    </n-form-item>

    <n-form-item
      label="收款二维码"
      path="payment_qr"
    >
      <div class="space-y-4">
        <!-- 上传区域 -->
        <n-upload
          v-model:file-list="paymentQrFiles"
          :max="5"
          accept="image/*"
          list-type="image-card"
          @change="handleQrUpload"
          @remove="handleQrRemove"
        >
          <n-button v-if="paymentQrFiles.length < 5">
            <template #icon>
              <n-icon><CloudUploadOutline /></n-icon>
            </template>
            上传收款二维码
          </n-button>
        </n-upload>

        <!-- 排序区域 -->
        <div v-if="paymentQrFiles.length > 1" class="space-y-2">
          <div class="text-sm font-medium text-gray-700">二维码显示顺序（拖拽调整）：</div>
          <div class="grid grid-cols-1 gap-2">
            <div
              v-for="(file, index) in paymentQrFiles"
              :key="file.id"
              class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-move"
              draggable="true"
              @dragstart="handleDragStart(index)"
              @dragover.prevent
              @drop="handleDrop(index)"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-600">{{ index + 1 }}.</span>
                <img
                  :src="file.url"
                  alt="二维码预览"
                  class="w-12 h-12 object-cover rounded border"
                />
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium">{{ file.name }}</div>
                <div class="text-xs text-gray-500">
                  {{ index === 0 ? '（前端显示）' : '（备用）' }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <n-button
                  v-if="index > 0"
                  size="small"
                  @click="moveQrUp(index)"
                >
                  ↑
                </n-button>
                <n-button
                  v-if="index < paymentQrFiles.length - 1"
                  size="small"
                  @click="moveQrDown(index)"
                >
                  ↓
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-xs text-gray-500 mt-2">
        <p>• 支持上传多个支付宝/微信收款二维码</p>
        <p>• 建议上传清晰的二维码图片，最多5张</p>
        <p>• 支持 JPG、PNG 格式，单张不超过5MB</p>
        <p>• <strong>第一个二维码将在前端显示，其他作为备用</strong></p>
      </div>
    </n-form-item>

    <n-form-item
      v-if="formData.type === 'buyer'"
      label="中转游戏ID"
      path="transfer_game_id"
    >
      <n-input
        v-model:value="formData.transfer_game_id"
        placeholder="请输入中转游戏ID（收货商家专用）"
        clearable
      />
      <div class="text-xs text-gray-500 mt-1">
        用于接收玩家转入的金币
      </div>
    </n-form-item>

    <n-form-item label="排序" path="sort_order">
      <n-input-number
        v-model:value="formData.sort_order"
        placeholder="排序权重"
        :min="0"
        :max="999"
      />
    </n-form-item>
  </n-form>

  <!-- 操作按钮 -->
  <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
    <n-button @click="handleCancel">取消</n-button>
    <n-button type="primary" :loading="submitting" @click="handleSubmit">
      {{ mode === 'create' ? '创建' : '更新' }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  NForm, NFormItem, NInput, NSelect, NInputNumber, NUpload, NIcon, NButton,
  useMessage, type FormInst, type FormRules
} from 'naive-ui'
import { CloudUploadOutline } from '@vicons/ionicons5'
import type { Merchant, CreateMerchantData, UpdateMerchantData } from '@/types'
import { uploadPaymentQr } from '@/api/upload'

interface Props {
  merchant?: Merchant | null
  mode: 'create' | 'edit'
}

interface Emits {
  (e: 'submit', data: CreateMerchantData | UpdateMerchantData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  merchant: null,
  mode: 'create'
})

const emit = defineEmits<Emits>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const paymentQrFiles = ref<any[]>([])
const uploading = ref(false)
const submitting = ref(false)
const draggedIndex = ref<number | null>(null)

const formData = reactive<CreateMerchantData>({
  name: '',
  type: 'seller',
  price: '',
  trade_method: '',
  stock_or_demand: '',
  speed: '',
  guarantee: '',
  payment_qr: '',
  transfer_game_id: '',
  sort_order: 0
})

const typeOptions = [
  { label: '卖家', value: 'seller' },
  { label: '买家', value: 'buyer' }
]

const rules: FormRules = {
  name: [
    { required: true, message: '请输入商家名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择商家类型', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  trade_method: [
    { required: true, message: '请输入交易方式', trigger: 'blur' }
  ],
  stock_or_demand: [
    { required: true, message: '请输入库存或需求', trigger: 'blur' }
  ],
  speed: [
    { required: true, message: '请输入交易速度', trigger: 'blur' }
  ]
}

// 处理二维码上传
const handleQrUpload = async ({ file }: any) => {
  if (!file) return

  uploading.value = true
  try {
    const response = await uploadPaymentQr(file.file)

    // 更新文件对象的URL
    const fileIndex = paymentQrFiles.value.findIndex(f => f.id === file.id)
    if (fileIndex !== -1) {
      paymentQrFiles.value[fileIndex].url = response.data.url
      paymentQrFiles.value[fileIndex].status = 'finished'
    }

    // 更新payment_qr字符串
    updatePaymentQrString()

    message.success('收款二维码上传成功')
  } catch (error: any) {
    message.error(error?.response?.data?.message || '二维码上传失败')
    // 移除失败的文件
    paymentQrFiles.value = paymentQrFiles.value.filter(f => f.id !== file.id)
  } finally {
    uploading.value = false
  }
}

// 处理二维码删除
const handleQrRemove = ({ file }: any) => {
  console.log('删除文件:', file)
  console.log('删除前文件列表:', paymentQrFiles.value)

  // 从文件列表中移除 - 使用多种方式确保能正确匹配
  paymentQrFiles.value = paymentQrFiles.value.filter(f => {
    // 优先使用 id 匹配
    if (f.id && file.id && f.id === file.id) {
      return false
    }
    // 如果 id 不匹配，尝试使用 url 匹配
    if (f.url && file.url && f.url === file.url) {
      return false
    }
    // 如果都没有，使用 name 匹配
    if (f.name && file.name && f.name === file.name) {
      return false
    }
    return true
  })

  console.log('删除后文件列表:', paymentQrFiles.value)

  // 更新payment_qr字符串
  updatePaymentQrString()
}

// 拖拽开始
const handleDragStart = (index: number) => {
  draggedIndex.value = index
}

// 拖拽放置
const handleDrop = (targetIndex: number) => {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return

  const files = [...paymentQrFiles.value]
  const draggedFile = files[draggedIndex.value]

  // 移除被拖拽的项
  files.splice(draggedIndex.value, 1)
  // 插入到目标位置
  files.splice(targetIndex, 0, draggedFile)

  paymentQrFiles.value = files
  updatePaymentQrString()
  draggedIndex.value = null
}

// 向上移动二维码
const moveQrUp = (index: number) => {
  if (index <= 0) return
  const files = [...paymentQrFiles.value]
  ;[files[index - 1], files[index]] = [files[index], files[index - 1]]
  paymentQrFiles.value = files
  updatePaymentQrString()
}

// 向下移动二维码
const moveQrDown = (index: number) => {
  if (index >= paymentQrFiles.value.length - 1) return
  const files = [...paymentQrFiles.value]
  ;[files[index], files[index + 1]] = [files[index + 1], files[index]]
  paymentQrFiles.value = files
  updatePaymentQrString()
}

// 更新payment_qr字符串
const updatePaymentQrString = () => {
  console.log('更新前 paymentQrFiles:', paymentQrFiles.value)

  const urls = paymentQrFiles.value
    .filter(file => file.url && file.url.trim()) // 确保有有效的URL
    .map(file => file.url.trim()) // 去除空格
    .filter(url => url.length > 0) // 再次确保不是空字符串

  console.log('提取的URLs:', urls)

  formData.payment_qr = urls.join(',')

  console.log('更新后 payment_qr:', formData.payment_qr)
}

// 监听merchant变化，更新表单数据
watch(() => props.merchant, (newMerchant) => {
  if (newMerchant) {
    Object.assign(formData, {
      name: newMerchant.name,
      type: newMerchant.type,
      price: newMerchant.price,
      trade_method: newMerchant.trade_method,
      stock_or_demand: newMerchant.stock_or_demand,
      speed: newMerchant.speed,
      guarantee: newMerchant.guarantee || '',
      payment_qr: newMerchant.payment_qr || '',
      transfer_game_id: newMerchant.transfer_game_id || '',
      sort_order: newMerchant.sort_order || 0
    })

    // 如果有支付二维码，设置文件列表
    if (newMerchant.payment_qr) {
      const qrUrls = newMerchant.payment_qr.split(',').filter(url => url.trim())
      paymentQrFiles.value = qrUrls.map((url, index) => ({
        id: `existing-${index}`,
        name: `收款二维码${index + 1}`,
        status: 'finished',
        url: url.trim()
      }))
    } else {
      paymentQrFiles.value = []
    }
  } else {
    // 重置表单
    Object.assign(formData, {
      name: '',
      type: 'seller',
      price: '',
      trade_method: '',
      stock_or_demand: '',
      speed: '',
      guarantee: '',
      payment_qr: '',
      transfer_game_id: '',
      sort_order: 0
    })
    paymentQrFiles.value = []
  }
}, { immediate: true })

// 验证表单
const validate = async (): Promise<boolean> => {
  try {
    await formRef.value?.validate()
    return true
  } catch {
    return false
  }
}

// 提交表单
const submit = async () => {
  if (await validate()) {
    emit('submit', { ...formData })
  }
}

// 处理提交按钮点击
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true
    emit('submit', { ...formData })
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

// 处理取消按钮点击
const handleCancel = () => {
  emit('cancel')
}

// 重置表单
const reset = () => {
  formRef.value?.restoreValidation()
  if (props.merchant) {
    Object.assign(formData, props.merchant)
  } else {
    Object.assign(formData, {
      name: '',
      type: 'seller',
      price: '',
      trade_method: '',
      stock_or_demand: '',
      speed: '',
      guarantee: '',
      payment_qr: '',
      transfer_game_id: '',
      sort_order: 0
    })
  }
}

// 暴露方法给父组件
defineExpose({
  validate,
  submit,
  reset
})
</script>
