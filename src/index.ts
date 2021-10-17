import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, CancelTokenSource } from 'axios'

const cancelTokens = new Map()

function joinUrls(urls: string[]) {
  const separator = '/'
  const replace = new RegExp(separator + '{1,}', 'g')

  return urls.join(separator).replace(replace, separator)
}

function getCancelToken() {
  const cancelToken: CancelTokenSource = axios.CancelToken.source()

  cancelTokens.set(cancelToken.token, cancelToken)

  return cancelToken.token
}

export function api(baseUrl: string, instance: AxiosInstance) {
  return {
    get: (url: string | number = '', config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(joinUrls([baseUrl, url.toString()]), {
        method: 'GET',
        cancelToken,
        ...config
      }).finally(() => cancelTokens.delete(cancelToken))
    },

    post: (data: any, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(baseUrl, { method: 'POST', data, cancelToken, ...config }).finally(() =>
        cancelTokens.delete(cancelToken)
      )
    },

    put: (url: string | number, data: any, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(joinUrls([baseUrl, url.toString()]), {
        method: 'POST',
        data,
        cancelToken,
        ...config
      }).finally(() => cancelTokens.delete(cancelToken))
    },

    patch: (url: string | number, data: any, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(joinUrls([baseUrl, url.toString()]), {
        method: 'PATCH',
        data,
        cancelToken,
        ...config
      }).finally(() => cancelTokens.delete(cancelToken))
    },

    delete: (url: string | number, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(joinUrls([baseUrl, url.toString()]), {
        method: 'DELETE',
        cancelToken,
        ...config
      }).finally(() => cancelTokens.delete(cancelToken))
    }
  }
}

export const cancelPendingRequests = () =>
  cancelTokens.forEach((cancelToken) => cancelToken.cancel())
