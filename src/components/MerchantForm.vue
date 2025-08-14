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

    <n-form-item label="收款二维码" path="payment_qr">
      <n-input
        v-model:value="formData.payment_qr"
        placeholder="请输入收款二维码URL（可选）"
        clearable
      />
    </n-form-item>

    <n-form-item label="游戏ID" path="transfer_game_id">
      <n-input
        v-model:value="formData.transfer_game_id"
        placeholder="请输入转账游戏ID（可选）"
        clearable
      />
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
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { NForm, NFormItem, NInput, NSelect, NInputNumber, type FormInst, type FormRules } from 'naive-ui'
import type { Merchant, CreateMerchantData, UpdateMerchantData } from '@/types'

interface Props {
  merchant?: Merchant | null
  mode: 'create' | 'edit'
}

interface Emits {
  (e: 'submit', data: CreateMerchantData | UpdateMerchantData): void
}

const props = withDefaults(defineProps<Props>(), {
  merchant: null,
  mode: 'create'
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInst | null>(null)

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
