import { baseUrl } from './config'

interface IResult<T = any> {
  code: number
  data: T
  [key: string]: any
}

class XlRequest {
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  request<T = IResult>(options: WechatMiniprogram.RequestOption) {
    const { url } = options

    return new Promise<T>((resolve, reject) => {
      wx.request<T>({
        ...options,
        url: this.baseUrl + url,
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          console.log('requestErr: ', err)
          reject(err)
        }
      })
    })
  }

  get<T = IResult>(options: WechatMiniprogram.RequestOption) {
    return this.request<T>({ ...options, method: 'GET' })
  }

  post<T = IResult>(options: WechatMiniprogram.RequestOption) {
    return this.request<T>({ ...options, method: 'POST' })
  }
}

export const xlRequest = new XlRequest(baseUrl)
