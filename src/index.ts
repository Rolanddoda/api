import axios, { AxiosPromise, AxiosRequestConfig, AxiosInstance, CancelTokenSource } from 'axios'

const cancelTokens = new Map()

export function api(url: string, config: AxiosRequestConfig = {}, instance: AxiosInstance) {
  const cancelToken: CancelTokenSource = axios.CancelToken.source()

  return {
    exec: (): AxiosPromise => {
      cancelTokens.set(cancelToken.token, cancelToken)
      return instance(url, { ...config, cancelToken: cancelToken.token }).finally(() =>
        cancelTokens.delete(cancelToken.token)
      )
    },
    cancel: (message?: string) => cancelToken.cancel(message)
  }
}

export const cancelAllPendingRequests = () => cancelTokens.forEach((cancelToken) => cancelToken.cancel())
