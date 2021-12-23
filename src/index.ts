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
    get<D = unknown>(url: string | number = '', config?: AxiosRequestConfig): AxiosPromise<D> {
      const cancelToken = getCancelToken()

      return instance
        .get<D>(joinUrls([baseUrl, url.toString()]), {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    post<D = unknown>(data?: D, config?: AxiosRequestConfig): AxiosPromise<D> {
      const cancelToken = getCancelToken()
      const url = joinUrls([baseUrl, config?.url || ''])

      return instance
        .post<D>(url, data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    put<D = unknown>(
      url: string | number = '',
      data: D,
      config?: AxiosRequestConfig
    ): AxiosPromise<D> {
      const cancelToken = getCancelToken()

      return instance
        .put<D>(joinUrls([baseUrl, url.toString()]), data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    patch<D = unknown>(
      url: string | number = '',
      data: D,
      config?: AxiosRequestConfig
    ): AxiosPromise<D> {
      const cancelToken = getCancelToken()

      return instance
        .patch<D>(joinUrls([baseUrl, url.toString()]), data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    delete<D = unknown>(url: string | number, config?: AxiosRequestConfig): AxiosPromise<D> {
      const cancelToken = getCancelToken()

      return instance
        .delete<D>(joinUrls([baseUrl, url.toString()]), {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    }
  }
}

export const cancelPendingRequests = () =>
  cancelTokens.forEach((cancelToken) => cancelToken.cancel())
