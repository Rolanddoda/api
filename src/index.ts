import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, CancelTokenSource } from 'axios'

const cancelTokens = new Map()

function joinUrls(urls: string[]) {
  const separator = '/'
  const replacer = new RegExp(separator + '{1,}', 'g')

  return urls.join(separator).replace(replacer, separator)
}

function getCancelToken() {
  const cancelToken: CancelTokenSource = axios.CancelToken.source()

  cancelTokens.set(cancelToken.token, cancelToken)

  return cancelToken
}

export function api(baseUrl: string, instance: AxiosInstance) {
  return {
    get(url: string | number = '', config?: AxiosRequestConfig) {
      const cancelToken = getCancelToken()

      return instance
        .get(joinUrls([baseUrl, url.toString()]), {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    post(data?: any, config?: AxiosRequestConfig) {
      const cancelToken = getCancelToken()

      return instance
        .post(baseUrl, data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    put: (url: string | number, data: any, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(joinUrls([baseUrl, url.toString()]), {
        method: 'POST',
        data,
        cancelToken: cancelToken.token,
        ...config
      }).finally(() => cancelTokens.delete(cancelToken))
    },

    patch: (url: string | number, data: any, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(joinUrls([baseUrl, url.toString()]), {
        method: 'PATCH',
        data,
        cancelToken: cancelToken.token,
        ...config
      }).finally(() => cancelTokens.delete(cancelToken))
    },

    delete: (url: string | number, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(joinUrls([baseUrl, url.toString()]), {
        method: 'DELETE',
        cancelToken: cancelToken.token,
        ...config
      }).finally(() => cancelTokens.delete(cancelToken))
    }
  }
}

export const cancelPendingRequests = () =>
  cancelTokens.forEach((cancelToken) => cancelToken.cancel())
