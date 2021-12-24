import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, CancelTokenSource } from 'axios'
import { ref } from 'vue'

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
    get<T = unknown>(url: string | number = '', config?: AxiosRequestConfig): AxiosPromise<T> {
      const cancelToken = getCancelToken()

      return instance
        .get<T>(joinUrls([baseUrl, url.toString()]), {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    post<T = unknown>(data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
      const cancelToken = getCancelToken()
      const url = joinUrls([baseUrl, config?.url || ''])

      return instance
        .post<T>(url, data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    put<T = unknown>(
      url: string | number = '',
      data: any,
      config?: AxiosRequestConfig
    ): AxiosPromise<T> {
      const cancelToken = getCancelToken()

      return instance
        .put<T>(joinUrls([baseUrl, url.toString()]), data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    patch<T = unknown>(
      url: string | number = '',
      data: any,
      config?: AxiosRequestConfig
    ): AxiosPromise<T> {
      const cancelToken = getCancelToken()

      return instance
        .patch<T>(joinUrls([baseUrl, url.toString()]), data, {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    },

    delete<T = unknown>(url: string | number, config?: AxiosRequestConfig): AxiosPromise<T> {
      const cancelToken = getCancelToken()

      return instance
        .delete<T>(joinUrls([baseUrl, url.toString()]), {
          ...config,
          cancelToken: cancelToken.token
        })
        .finally(() => cancelTokens.delete(cancelToken))
    }
  }
}

export const cancelPendingRequests = () =>
  cancelTokens.forEach((cancelToken) => cancelToken.cancel())

export const useApi = <T = unknown>(apiFunction: () => AxiosPromise<T>, immediate = true) => {
  const loading = ref(false)
  const data = ref<T>()

  function call() {
    loading.value = true
    return apiFunction()
      .then((res) => {
        if (res?.data) data.value = res.data
        loading.value = false

        return res
      })
      .finally(() => (loading.value = false))
  }

  immediate && call()

  return {
    loading,
    data,
    call
  }
}
