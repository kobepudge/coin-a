<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <div id="app" class="min-h-screen bg-gray-50">
            <router-view v-if="mounted" />
            <div v-else class="flex items-center justify-center min-h-screen">
              <div class="text-center">
                <div class="text-lg">正在加载管理系统...</div>
              </div>
            </div>
          </div>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { 
  NConfigProvider, 
  NMessageProvider, 
  NDialogProvider, 
  NNotificationProvider,
  lightTheme
} from 'naive-ui'

const authStore = useAuthStore()
const mounted = ref(false)
const theme = ref(lightTheme)

onMounted(async () => {
  try {
    console.log('管理端应用启动')
    
    // 应用启动时检查登录状态（非阻塞）
    authStore.checkAuthStatus().catch(err => {
      console.warn('认证状态检查失败:', err)
    })
    
    mounted.value = true
  } catch (error) {
    console.error('管理端应用启动错误:', error)
    mounted.value = true
  }
})
</script>
