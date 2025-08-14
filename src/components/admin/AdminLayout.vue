<template>
  <div class="min-h-screen bg-gray-50">
    <n-layout has-sider>
      <!-- 侧边栏 -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
        :native-scrollbar="false"
        class="admin-sidebar"
      >
        <div class="p-4">
          <!-- Logo -->
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">币</span>
            </div>
            <div v-if="!collapsed" class="text-lg font-bold text-gray-900">
              管理后台
            </div>
          </div>

          <!-- 菜单 -->
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="20"
            :options="menuOptions"
            :value="activeMenuKey"
            @update:value="handleMenuSelect"
          />
        </div>
      </n-layout-sider>

      <!-- 主内容区域 -->
      <n-layout>
        <!-- 顶部导航栏 -->
        <n-layout-header bordered class="bg-white px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <h1 class="text-xl font-semibold text-gray-900">
                {{ currentPageTitle }}
              </h1>
            </div>

            <!-- 用户信息和操作 -->
            <div class="flex items-center space-x-4">
              <!-- 通知 -->
              <n-badge :value="pendingOrdersCount" :max="99">
                <n-button quaternary circle>
                  <template #icon>
                    <n-icon size="18">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                      </svg>
                    </n-icon>
                  </template>
                </n-button>
              </n-badge>

              <!-- 用户菜单 -->
              <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
                <div class="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100">
                  <n-avatar round size="small" :src="userAvatar">
                    {{ authStore.currentAdmin?.real_name?.charAt(0) || 'A' }}
                  </n-avatar>
                  <div v-if="authStore.currentAdmin" class="text-sm">
                    <div class="font-medium text-gray-900">
                      {{ authStore.currentAdmin.real_name }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ roleText }}
                    </div>
                  </div>
                  <n-icon size="14" class="text-gray-400">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </n-icon>
                </div>
              </n-dropdown>
            </div>
          </div>
        </n-layout-header>

        <!-- 页面内容 -->
        <n-layout-content class="p-6">
          <div class="max-w-7xl mx-auto">
            <slot />
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, 
  NMenu, NDropdown, NAvatar, NBadge, NButton, NIcon,
  useMessage, useDialog
} from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { STATUS_TEXT } from '@/constants'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const dialog = useDialog()
const authStore = useAuthStore()

const collapsed = ref(false)
const pendingOrdersCount = ref(5) // TODO: 从API获取
const userAvatar = ref('')

// 当前页面标题
const currentPageTitle = computed(() => {
  const routeMeta = route.meta
  return (routeMeta?.title as string)?.replace(' - 游戏金币交易平台', '') || '管理面板'
})

// 角色文本
const roleText = computed(() => {
  if (!authStore.currentAdmin) return ''
  return STATUS_TEXT[authStore.currentAdmin.role] || authStore.currentAdmin.role
})

// 当前选中的菜单项
const activeMenuKey = computed(() => {
  return route.name as string
})

// 菜单选项
const menuOptions = computed(() => {
  const baseOptions = [
    {
      label: '仪表板',
      key: 'admin-dashboard',
      icon: '📊'
    }
  ]

  // 根据权限显示菜单
  if (authStore.hasPermission('merchant_manage')) {
    baseOptions.push({
      label: '商家管理',
      key: 'admin-merchants',
      icon: '🏪'
    })
  }

  if (authStore.hasPermission('order_manage')) {
    baseOptions.push({
      label: '订单管理',
      key: 'admin-orders',
      icon: '📋'
    })
  }

  if (authStore.hasPermission('admin_manage')) {
    baseOptions.push({
      label: '管理员管理',
      key: 'admin-admins',
      icon: '👥'
    })
  }

  baseOptions.push({
    label: '个人设置',
    key: 'admin-profile',
    icon: '⚙️'
  })

  return baseOptions
})

// 用户菜单选项
const userMenuOptions = [
  {
    label: '个人设置',
    key: 'profile',
    icon: '⚙️'
  },
  {
    label: '修改密码',
    key: 'change-password',
    icon: '🔑'
  },
  {
    type: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: '🚪'
  }
]

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  router.push({ name: key })
}

// 处理用户菜单选择
const handleUserMenuSelect = async (key: string) => {
  switch (key) {
    case 'profile':
      await router.push({ name: 'admin-profile' })
      break
    case 'change-password':
      // TODO: 打开修改密码对话框
      message.info('修改密码功能开发中')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理登出
const handleLogout = () => {
  dialog.warning({
    title: '确认退出',
    content: '确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await authStore.logout()
        message.success('已安全退出')
        await router.push('/admin/login')
      } catch (error: any) {
        message.error(error.message || '退出失败')
      }
    }
  })
}

onMounted(() => {
  // 检查认证状态
  if (!authStore.isAuthenticated) {
    router.push('/admin/login')
  }
})
</script>

<style scoped>
.admin-sidebar {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

:deep(.n-layout-sider-scroll-container) {
  display: flex;
  flex-direction: column;
}
</style>