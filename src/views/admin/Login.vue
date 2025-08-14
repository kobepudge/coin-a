<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
    <div class="card max-w-md w-full p-8 animate-fade-in">
      <!-- Logo和标题 -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl">币</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">管理员登录</h1>
        <p class="text-gray-600">游戏金币交易平台管理系统</p>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            用户名
          </label>
          <n-input
            v-model:value="loginForm.username"
            size="large"
            placeholder="请输入管理员用户名"
            :disabled="loading"
            clearable
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            密码
          </label>
          <n-input
            v-model:value="loginForm.password"
            type="password"
            size="large"
            placeholder="请输入登录密码"
            :disabled="loading"
            show-password-on="click"
            @keyup.enter="handleLogin"
          />
        </div>

        <!-- 记住登录 -->
        <div class="flex items-center justify-between">
          <n-checkbox v-model:checked="loginForm.remember">
            7天内免登录
          </n-checkbox>
          <div class="text-sm">
            <a href="#" class="text-primary-600 hover:text-primary-500">
              忘记密码？
            </a>
          </div>
        </div>

        <!-- 错误信息 -->
        <n-alert
          v-if="errorMessage"
          type="error"
          :title="errorMessage"
          show-icon
          closable
          @close="errorMessage = ''"
        />

        <!-- 登录按钮 -->
        <n-button
          type="primary"
          size="large"
          block
          :loading="loading"
          attr-type="submit"
          strong
        >
          {{ loading ? '登录中...' : '登录管理系统' }}
        </n-button>
      </form>

      <!-- 底部信息 -->
      <div class="mt-8 text-center">
        <div class="text-xs text-gray-500 space-y-1">
          <p>© 2024 游戏金币交易平台</p>
          <p>仅授权管理员可访问此系统</p>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/20 rounded-full blur-2xl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NInput, NButton, NCheckbox, NAlert, useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const authStore = useAuthStore()

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 状态
const loading = ref(false)
const errorMessage = ref('')

// 处理登录
const handleLogin = async () => {
  // 表单验证
  if (!loginForm.username.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }
  
  if (!loginForm.password.trim()) {
    errorMessage.value = '请输入密码'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    // 调用登录API
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    message.success('登录成功！')

    // 跳转到目标页面或仪表板
    const redirect = route.query.redirect as string
    await router.push(redirect || '/admin/dashboard')

  } catch (error: any) {
    console.error('登录失败:', error)
    errorMessage.value = error.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

// 清空错误信息
const clearError = () => {
  errorMessage.value = ''
}
</script>

<style scoped>
/* 登录页面特殊样式 */
.card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 背景动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>