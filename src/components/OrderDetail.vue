<template>
  <div class="order-detail">
    <n-descriptions
      :column="2"
      label-placement="left"
      bordered
      size="medium"
    >
      <n-descriptions-item label="订单ID">
        {{ order.id }}
      </n-descriptions-item>
      
      <n-descriptions-item label="订单状态">
        <n-tag
          :type="getStatusType(order.status)"
          size="small"
        >
          {{ getStatusText(order.status) }}
        </n-tag>
      </n-descriptions-item>
      
      <n-descriptions-item label="商家信息">
        <div v-if="order.merchant">
          <div class="font-medium">{{ order.merchant.name }}</div>
          <div class="text-sm text-gray-500">
            {{ order.merchant.type === 'seller' ? '卖家' : '买家' }}
          </div>
        </div>
        <span v-else class="text-gray-400">商家信息不可用</span>
      </n-descriptions-item>
      
      <n-descriptions-item label="玩家游戏ID">
        {{ order.player_game_id }}
      </n-descriptions-item>
      
      <n-descriptions-item label="收款二维码" v-if="order.payment_qr_url">
        <n-image
          :src="order.payment_qr_url"
          width="100"
          height="100"
          object-fit="cover"
          preview-disabled
        />
      </n-descriptions-item>

      <n-descriptions-item label="转账截图" v-if="order.transfer_screenshot_url">
        <n-image
          :src="order.transfer_screenshot_url"
          width="120"
          height="120"
          object-fit="cover"
          preview-disabled
        />
      </n-descriptions-item>

      <n-descriptions-item label="转账截图" v-else>
        <span class="text-gray-400">未上传</span>
      </n-descriptions-item>
      
      <n-descriptions-item label="创建时间">
        {{ formatDate(order.created_at) }}
      </n-descriptions-item>
      
      <n-descriptions-item label="更新时间">
        {{ formatDate(order.updated_at) }}
      </n-descriptions-item>
      
      <n-descriptions-item label="管理员备注" v-if="order.admin_notes">
        <div class="whitespace-pre-wrap">{{ order.admin_notes }}</div>
      </n-descriptions-item>
    </n-descriptions>

    <!-- 商家详细信息 -->
    <div v-if="order.merchant" class="mt-6">
      <n-divider title-placement="left">
        <span class="text-lg font-medium">商家详细信息</span>
      </n-divider>
      
      <n-descriptions
        :column="2"
        label-placement="left"
        bordered
        size="medium"
      >
        <n-descriptions-item label="价格">
          {{ order.merchant.price }}
        </n-descriptions-item>
        
        <n-descriptions-item label="交易方式">
          {{ order.merchant.trade_method }}
        </n-descriptions-item>
        
        <n-descriptions-item label="库存/需求">
          {{ order.merchant.stock_or_demand }}
        </n-descriptions-item>
        
        <n-descriptions-item label="交易速度">
          {{ order.merchant.speed }}
        </n-descriptions-item>
        
        <n-descriptions-item label="保障信息" v-if="order.merchant.guarantee">
          {{ order.merchant.guarantee }}
        </n-descriptions-item>
        
        <n-descriptions-item label="转账游戏ID" v-if="order.merchant.transfer_game_id">
          {{ order.merchant.transfer_game_id }}
        </n-descriptions-item>
      </n-descriptions>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-6 flex gap-3">
      <n-button
        v-if="order.status === 'pending'"
        type="success"
        @click="$emit('updateStatus', order.id, 'completed')"
      >
        标记为已完成
      </n-button>
      
      <n-button
        v-if="order.status === 'pending'"
        type="error"
        @click="$emit('updateStatus', order.id, 'failed')"
      >
        标记为失败
      </n-button>
      
      <n-button
        v-if="order.status === 'pending'"
        type="warning"
        @click="$emit('updateStatus', order.id, 'rejected')"
      >
        拒绝订单
      </n-button>
      
      <n-button
        type="primary"
        @click="$emit('editNotes', order)"
      >
        编辑备注
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NTag, NImage, NDivider, NButton } from 'naive-ui'
import type { Order, OrderStatus } from '@/types'
import { format } from 'date-fns'

interface Props {
  order: Order
}

interface Emits {
  (e: 'updateStatus', orderId: number, status: OrderStatus): void
  (e: 'editNotes', order: Order): void
}

defineProps<Props>()
defineEmits<Emits>()

const getStatusType = (status: OrderStatus) => {
  const typeMap = {
    pending: 'warning',
    completed: 'success',
    failed: 'error',
    rejected: 'error'
  }
  return typeMap[status] as 'warning' | 'success' | 'error'
}

const getStatusText = (status: OrderStatus) => {
  const textMap = {
    pending: '待处理',
    completed: '已完成',
    failed: '失败',
    rejected: '已拒绝'
  }
  return textMap[status]
}

const formatDate = (date: Date | string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
}
</script>

<style scoped>
.order-detail {
  padding: 1rem;
}
</style>
