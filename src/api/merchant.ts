import { api } from './index'
import type { Merchant } from '@/types'

export interface MerchantQueryParams {
  type?: 'seller' | 'buyer'
  status?: 'online' | 'offline'
  page?: number
  limit?: number
  search?: string
}

export interface MerchantListResponse {
  success: boolean
  data: {
    merchants: Merchant[]
    total: number
    page: number
    limit: number
  }
}

export interface CurrentSellerResponse {
  success: boolean
  data: {
    merchant: Merchant | null
  }
}

// 获取公开商家列表
export const getPublicMerchants = async (type: 'seller' | 'buyer'): Promise<MerchantListResponse> => {
  return api.get(`/public/merchants/${type}`)
}

// 获取当前出货商家
export const getCurrentSeller = async (): Promise<CurrentSellerResponse> => {
  return api.get('/public/current-seller')
}

// ===== 管理员API (需要认证) =====

// 获取商家列表 (管理员)
export const getMerchants = async (params?: MerchantQueryParams): Promise<MerchantListResponse> => {
  return api.get('/merchants', { params })
}

// 创建商家 (管理员)
export const createMerchant = async (data: Partial<Merchant>): Promise<{ success: boolean; data: Merchant }> => {
  return api.post('/merchants', data)
}

// 更新商家 (管理员)
export const updateMerchant = async (id: number, data: Partial<Merchant>): Promise<{ success: boolean; data: Merchant }> => {
  return api.put(`/merchants/${id}`, data)
}

// 删除商家 (管理员)
export const deleteMerchant = async (id: number): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/merchants/${id}`)
}

// 批量更新商家状态 (管理员)
export const batchUpdateMerchantStatus = async (
  ids: number[], 
  status: 'online' | 'offline'
): Promise<{ success: boolean; data: { updated: number } }> => {
  return api.post('/merchants/batch-status', { ids, status })
}

// 设置当前出货商家 (管理员)
export const setCurrentSeller = async (id: number): Promise<{ success: boolean; data: Merchant }> => {
  return api.post(`/merchants/${id}/set-current`)
}

// 获取商家统计 (管理员)
export const getMerchantStats = async (): Promise<{
  success: boolean
  data: {
    total: number
    sellers: number
    buyers: number
    online: number
    offline: number
  }
}> => {
  return api.get('/merchants/stats')
}