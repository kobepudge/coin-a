// 管理端常量定义

// 状态文本映射
export const STATUS_TEXT = {
  // 管理员角色
  super_admin: '超级管理员',
  admin: '管理员',
  
  // 管理员状态
  active: '活跃',
  inactive: '禁用',
  
  // 商家类型
  seller: '卖家',
  buyer: '买家',
  
  // 商家状态
  online: '在线',
  offline: '离线',
  
  // 订单状态
  pending: '待处理',
  completed: '已完成',
  failed: '失败',
  rejected: '已拒绝'
} as const

// 权限文本映射
export const PERMISSION_TEXT = {
  merchant_manage: '商家管理',
  order_manage: '订单管理',
  admin_manage: '管理员管理',
  system_config: '系统配置'
} as const

// 菜单配置
export const MENU_ITEMS = [
  {
    key: 'admin-dashboard',
    label: '管理面板',
    icon: 'dashboard',
    path: '/admin/dashboard'
  },
  {
    key: 'admin-merchants',
    label: '商家管理',
    icon: 'business',
    path: '/admin/merchants',
    permission: 'merchant_manage'
  },
  {
    key: 'admin-orders',
    label: '订单管理',
    icon: 'receipt',
    path: '/admin/orders',
    permission: 'order_manage'
  },
  {
    key: 'admin-admins',
    label: '管理员管理',
    icon: 'people',
    path: '/admin/admins',
    permission: 'admin_manage'
  },
  {
    key: 'admin-profile',
    label: '个人设置',
    icon: 'person',
    path: '/admin/profile'
  }
] as const

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizes: [10, 20, 50, 100],
  showSizePicker: true,
  showQuickJumper: true
} as const

// 表格配置
export const TABLE_CONFIG = {
  striped: true,
  bordered: false,
  singleLine: false,
  size: 'medium'
} as const

// 上传配置
export const UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  acceptExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
} as const

// API配置
export const API_CONFIG = {
  timeout: 30000,
  retryTimes: 3,
  retryDelay: 1000
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'admin_token',
  USER_INFO: 'admin_user_info',
  THEME: 'admin_theme',
  SIDEBAR_COLLAPSED: 'admin_sidebar_collapsed'
} as const

// 主题配置
export const THEME_CONFIG = {
  light: {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937'
  },
  dark: {
    primaryColor: '#60a5fa',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb'
  }
} as const

// 验证规则
export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  password: {
    minLength: 6,
    maxLength: 50,
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/
  }
} as const

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '权限不足，无法执行此操作',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  VALIDATION_ERROR: '数据验证失败，请检查输入内容'
} as const

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
  SAVE_SUCCESS: '保存成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功',
  CREATE_SUCCESS: '创建成功'
} as const
