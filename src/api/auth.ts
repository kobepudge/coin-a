import { api } from '@/api'
import type { Admin, LoginCredentials } from '@/types'

// 登录响应类型
export interface LoginResponse {
  token: string
  admin: Admin
  expires_in: number
}

// 认证API
export const authApi = {
  // 管理员登录
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<{ data: LoginResponse }>('/auth/login', credentials)
    return response.data
  },

  // 登出
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  // 获取当前用户信息
  getProfile: async (): Promise<Admin> => {
    const response = await api.get<{ data: Admin }>('/auth/profile')
    return response.data
  },

  // 更新个人信息
  updateProfile: async (profileData: Partial<Admin>): Promise<Admin> => {
    const response = await api.put<{ data: Admin }>('/auth/profile', profileData)
    return response.data
  },

  // 修改密码
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword
    })
  },

  // 刷新token
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post<{ data: LoginResponse }>('/auth/refresh')
    return response.data
  }
}