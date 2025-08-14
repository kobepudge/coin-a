import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 管理端路由 - 只包含管理相关页面
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin/login'
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/Login.vue'),
    meta: {
      title: '管理员登录',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayoutWrapper.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        redirect: { name: 'admin-dashboard' }
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: {
          title: '管理面板',
          requiresAuth: true
        }
      },
      {
        path: 'merchants',
        name: 'admin-merchants',
        component: () => import('@/views/admin/Merchants.vue'),
        meta: {
          title: '商家管理',
          requiresAuth: true,
          permission: 'merchant_manage'
        }
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/admin/Orders.vue'),
        meta: {
          title: '订单管理',
          requiresAuth: true,
          permission: 'order_manage'
        }
      },
      {
        path: 'admins',
        name: 'admin-admins',
        component: () => import('@/views/admin/Admins.vue'),
        meta: {
          title: '管理员管理',
          requiresAuth: true,
          permission: 'admin_manage'
        }
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('@/views/admin/Profile.vue'),
        meta: {
          title: '个人设置',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

// 创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    // 检查登录状态
    if (!authStore.isAuthenticated) {
      await authStore.checkAuthStatus()
    }

    if (!authStore.isAuthenticated) {
      // 未登录，跳转到登录页
      next({
        name: 'admin-login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 检查权限
    if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
      // 无权限，跳转到仪表板
      next({ name: 'admin-dashboard' })
      return
    }
  }

  // 已登录用户访问登录页，跳转到仪表板
  if (to.meta.hideForAuth && authStore.isAuthenticated) {
    next({ name: 'admin-dashboard' })
    return
  }

  next()
})

export default router
