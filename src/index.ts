import axios, { AxiosPromise, AxiosRequestConfig, AxiosInstance, CancelTokenSource } from 'axios'

const cancelTokens = new Map()

export function api(url: string, config: AxiosRequestConfig = {}, instance: AxiosInstance): AxiosPromise {
  const cancelToken: CancelTokenSource = axios.CancelToken.source()

  cancelTokens.set(cancelToken.token, cancelToken)

  return instance(url, { ...config, cancelToken: cancelToken.token }).finally(() =>
    cancelTokens.delete(cancelToken.token)
  )
}

export const cancelAllPendingRequests = () => cancelTokens.forEach((cancelToken) => cancelToken.cancel())

export const define = (instance: AxiosInstance) => ({
  get: (url: string, config?: AxiosRequestConfig) => api(url, { method: 'GET', ...config }, instance),

  post: (url: string, data: unknown, config?: AxiosRequestConfig) => {
    return api(url, { method: 'POST', data, ...config }, instance)
  },

  put: (url: string, data: unknown, config?: AxiosRequestConfig) => {
    return api(url, { method: 'PUT', data, ...config }, instance)
  },

  patch: (url: string, data: unknown, config?: AxiosRequestConfig) => {
    return api(url, { method: 'PATCH', data, ...config }, instance)
  },

  delete: (url: string, config?: AxiosRequestConfig) => api(url, { method: 'DELETE', ...config }, instance)
})
