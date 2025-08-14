import { api } from './index'
import type { Order, OrderStatus } from '@/types'

export interface OrderQueryParams {
  status?: OrderStatus
  merchant_id?: number
  player_game_id?: string
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export interface OrderListResponse {
  success: boolean
  data: {
    orders: Order[]
    total: number
    page: number
    limit: number
  }
}

export interface CreateOrderRequest {
  merchant_id: number
  player_game_id: string
  payment_qr_url: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  admin_note?: string
}

// ===== 公开API =====

// 提交订单 (公开)
export const createOrder = async (data: CreateOrderRequest): Promise<{ success: boolean; data: Order }> => {
  return api.post('/public/orders', data)
}

// ===== 管理员API (需要认证) =====

// 获取订单列表 (管理员)
export const getOrders = async (params?: OrderQueryParams): Promise<OrderListResponse> => {
  return api.get('/orders', { params })
}

// 获取单个订单 (管理员)
export const getOrder = async (id: number): Promise<{ success: boolean; data: Order }> => {
  return api.get(`/orders/${id}`)
}

// 更新订单状态 (管理员)
export const updateOrderStatus = async (
  id: number, 
  data: UpdateOrderStatusRequest
): Promise<{ success: boolean; data: Order }> => {
  return api.put(`/orders/${id}/status`, data)
}

// 批量更新订单状态 (管理员)
export const batchUpdateOrderStatus = async (
  ids: number[],
  status: OrderStatus,
  admin_note?: string
): Promise<{ success: boolean; data: { updated: number } }> => {
  return api.post('/orders/batch-status', { ids, status, admin_note })
}

// 获取订单统计 (管理员)
export const getOrderStats = async (date?: string): Promise<{
  success: boolean
  data: {
    total: number
    pending: number
    completed: number
    failed: number
    rejected: number
    today_total: number
    today_completed: number
    revenue: number
  }
}> => {
  return api.get('/orders/stats', { params: { date } })
}

// 获取订单操作日志 (管理员)
export const getOrderLogs = async (orderId: number): Promise<{
  success: boolean
  data: Array<{
    id: number
    order_id: number
    operation: string
    old_status?: string
    new_status?: string
    admin_note?: string
    operator_id: number
    operator_name: string
    ip_address?: string
    user_agent?: string
    created_at: Date
  }>
}> => {
  return api.get(`/orders/${orderId}/logs`)
}

// 导出订单数据 (管理员)
export const exportOrders = async (params?: OrderQueryParams): Promise<Blob> => {
  const response = await api.get('/orders/export', { 
    params,
    responseType: 'blob'
  })
  return response as unknown as Blob
}