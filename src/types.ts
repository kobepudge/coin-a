// 管理端类型定义

// 基础类型
export type ID = number
export type Timestamp = Date

// 管理员相关类型
export interface Admin {
  id: ID
  username: string
  password?: string
  real_name: string
  email?: string
  role: 'super_admin' | 'admin'
  permissions: AdminPermissions
  parent_id?: ID
  status: 'active' | 'inactive'
  last_login_at?: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
}

export interface AdminPermissions {
  merchant_manage: boolean
  order_manage: boolean
  admin_manage: boolean
  system_config: boolean
  [key: string]: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface CreateAdminData {
  username: string
  password: string
  real_name: string
  email?: string
  permissions: AdminPermissions
}

export interface UpdateAdminData {
  real_name?: string
  email?: string
  permissions?: AdminPermissions
  status?: 'active' | 'inactive'
}

// 商家相关类型
export interface Merchant {
  id: ID
  name: string
  type: 'seller' | 'buyer'
  price: string
  trade_method: string
  stock_or_demand: string
  speed: string
  guarantee?: string
  alipay_account?: string // 支付宝账号
  payment_qr?: string
  transfer_game_id?: string
  is_current_seller: boolean
  status: 'online' | 'offline'
  sort_order: number
  created_at: Timestamp
  updated_at: Timestamp
}

export interface CreateMerchantData {
  name: string
  type: 'seller' | 'buyer'
  price: string
  trade_method: string
  stock_or_demand: string
  speed: string
  guarantee?: string
  alipay_account?: string // 支付宝账号
  payment_qr?: string
  transfer_game_id?: string
  sort_order?: number
}

export interface UpdateMerchantData {
  name?: string
  price?: string
  trade_method?: string
  stock_or_demand?: string
  speed?: string
  guarantee?: string
  alipay_account?: string // 支付宝账号
  payment_qr?: string
  transfer_game_id?: string
  status?: 'online' | 'offline'
  sort_order?: number
}

// 订单相关类型
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'rejected'

export interface Order {
  id: ID
  merchant_id: ID
  player_game_id: string
  payment_qr_url?: string
  transfer_screenshot_url?: string
  status: OrderStatus
  admin_notes?: string
  created_at: Timestamp
  updated_at: Timestamp
  merchant?: Merchant
}

export interface CreateOrderData {
  merchant_id: ID
  player_game_id: string
  payment_qr_url?: string
  transfer_screenshot_url?: string
}

export interface UpdateOrderData {
  status?: OrderStatus
  admin_notes?: string
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 统计数据类型
export interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  onlineMerchants: number
  dailyRevenue: number
  weeklyStats?: {
    date: string
    orders: number
    revenue: number
  }[]
}

// 错误类型
export interface ApiError {
  message: string
  code?: string
  field?: string
  details?: any
}

// 文件上传类型
export interface UploadResponse {
  url: string
  filename: string
  size: number
}

// 工具类型
export type WithTimestamps<T> = T & {
  created_at: Timestamp
  updated_at: Timestamp
}

export type WithId<T> = T & {
  id: ID
}

export type CreateData<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>
export type UpdateData<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>

// 表单验证错误类型
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationErrors {
  [key: string]: string[]
}
