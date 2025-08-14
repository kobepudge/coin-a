import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { Admin, LoginCredentials, AdminPermissions } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const currentAdmin = ref<Admin | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth-token'))
  const loading = ref(false)
  const error = ref<string>('')

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!currentAdmin.value)
  
  const permissions = computed((): AdminPermissions => {
    return currentAdmin.value?.permissions || {
      merchant_manage: false,
      order_manage: false,
      admin_manage: false,
      system_config: false
    }
  })

  // 检查是否为超级管理员
  const isSuperAdmin = computed(() => currentAdmin.value?.role === 'super_admin')

  // 检查权限
  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (isSuperAdmin.value) return true
    return permissions.value[permission] || false
  }

  // 登录
  const login = async (credentials: LoginCredentials): Promise<void> => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await authApi.login(credentials)
      
      // 保存token和用户信息
      token.value = response.token
      currentAdmin.value = response.admin
      
      // 保存到本地存储
      localStorage.setItem('auth-token', response.token)
      localStorage.setItem('admin-info', JSON.stringify(response.admin))
      
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async (): Promise<void> => {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('登出API调用失败:', err)
    } finally {
      // 清空状态
      currentAdmin.value = null
      token.value = null
      error.value = ''
      
      // 清空本地存储
      localStorage.removeItem('auth-token')
      localStorage.removeItem('admin-info')
    }
  }

  // 检查登录状态
  const checkAuthStatus = async (): Promise<void> => {
    const savedToken = localStorage.getItem('auth-token')
    const savedAdmin = localStorage.getItem('admin-info')
    
    if (!savedToken || !savedAdmin) {
      // 静默清空，不调用logout API
      currentAdmin.value = null
      token.value = null
      error.value = ''
      localStorage.removeItem('auth-token')
      localStorage.removeItem('admin-info')
      return
    }

    try {
      // 先恢复本地状态
      token.value = savedToken
      currentAdmin.value = JSON.parse(savedAdmin)
      
      // 然后验证token有效性（异步）
      const adminInfo = await authApi.getProfile()
      currentAdmin.value = adminInfo
      
    } catch (err) {
      // token无效，清空登录状态
      console.warn('Token验证失败，清空登录状态')
      currentAdmin.value = null
      token.value = null
      error.value = ''
      localStorage.removeItem('auth-token')
      localStorage.removeItem('admin-info')
    }
  }

  // 更新个人信息
  const updateProfile = async (profileData: Partial<Admin>): Promise<void> => {
    loading.value = true
    error.value = ''
    
    try {
      const updatedAdmin = await authApi.updateProfile(profileData)
      currentAdmin.value = updatedAdmin
      
      // 更新本地存储
      localStorage.setItem('admin-info', JSON.stringify(updatedAdmin))
      
    } catch (err: any) {
      error.value = err.message || '更新失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    loading.value = true
    error.value = ''
    
    try {
      await authApi.changePassword(oldPassword, newPassword)
    } catch (err: any) {
      error.value = err.message || '密码修改失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 清空错误信息
  const clearError = (): void => {
    error.value = ''
  }

  return {
    // 状态
    currentAdmin,
    token,
    loading,
    error,
    
    // 计算属性
    isAuthenticated,
    permissions,
    isSuperAdmin,
    
    // 方法
    hasPermission,
    login,
    logout,
    checkAuthStatus,
    updateProfile,
    changePassword,
    clearError
  }
})