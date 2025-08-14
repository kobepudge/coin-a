<template>
  <ResponsiveLayout>
    <!-- 统计卡片 -->
    <ResponsiveGrid 
      :cols="{ xs: 1, sm: 2, lg: 4 }"
      gap="md"
      class="mb-8"
    >
        <n-card>
          <n-statistic label="总订单数" value="128">
            <template #prefix>
              <n-icon size="24" color="#3b82f6">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </n-icon>
            </template>
          </n-statistic>
        </n-card>

        <n-card>
          <n-statistic label="待处理订单" value="5">
            <template #prefix>
              <n-icon size="24" color="#f59e0b">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </n-icon>
            </template>
          </n-statistic>
        </n-card>

        <n-card>
          <n-statistic label="在线商家" value="8">
            <template #prefix>
              <n-icon size="24" color="#10b981">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </n-icon>
            </template>
          </n-statistic>
        </n-card>

        <n-card>
          <n-statistic label="今日交易额" value="2,580" prefix="¥">
            <template #prefix>
              <n-icon size="24" color="#8b5cf6">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </n-icon>
            </template>
          </n-statistic>
        </n-card>
    </ResponsiveGrid>

    <!-- 快捷操作 -->
    <n-card title="快捷操作" class="mb-6">
      <ResponsiveGrid 
        :cols="{ xs: 2, md: 4 }"
        gap="sm"
      >
          <router-link
            v-if="authStore.hasPermission('merchant_manage')"
            to="/admin/merchants"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <n-icon size="32" class="mb-2 text-blue-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </n-icon>
            <span class="text-sm font-medium">商家管理</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('order_manage')"
            to="/admin/orders"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <n-icon size="32" class="mb-2 text-green-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </n-icon>
            <span class="text-sm font-medium">订单管理</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('admin_manage')"
            to="/admin/admins"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <n-icon size="32" class="mb-2 text-purple-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V18h2v-4h3v4h4v2H0v-2h4z"/>
              </svg>
            </n-icon>
            <span class="text-sm font-medium">管理员</span>
          </router-link>

          <router-link
            to="/admin/profile"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <n-icon size="32" class="mb-2 text-gray-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </n-icon>
            <span class="text-sm font-medium">个人设置</span>
          </router-link>
      </ResponsiveGrid>
    </n-card>

    <!-- 最近活动 -->
    <n-card title="最近活动">
      <n-empty description="暂无最近活动" />
    </n-card>
  </ResponsiveLayout>
</template>

<script setup lang="ts">
import { NCard, NStatistic, NIcon, NEmpty } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import ResponsiveLayout from '@/components/common/ResponsiveLayout.vue'
import ResponsiveGrid from '@/components/common/ResponsiveGrid.vue'

const authStore = useAuthStore()
</script>