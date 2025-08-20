import { api } from './index'

export interface UploadResponse {
  success: boolean
  data: {
    filename: string
    original_name: string
    size: number
    mime_type: string
    url: string
  }
}

// 上传图片文件
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('image', file)
  
  return api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传支付二维码
export const uploadPaymentQr = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('qr', file)

  return api.post('/upload/payment-qr', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传转账截图
export const uploadTransferScreenshot = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('screenshot', file)

  return api.post('/upload/transfer-screenshot', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}