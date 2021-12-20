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
      const url = joinUrls([baseUrl, config?.url || ''])

      return instance
        .post(url, data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    put: (url: string | number = '', data: any, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance
        .put(joinUrls([baseUrl, url.toString()]), data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    patch: (url: string | number = '', data: any, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance
        .patch(joinUrls([baseUrl, url.toString()]), data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    delete: (url: string | number, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance
        .delete(joinUrls([baseUrl, url.toString()]), {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    }
  }
}

export const cancelPendingRequests = () =>
  cancelTokens.forEach((cancelToken) => cancelToken.cancel())
