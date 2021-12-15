import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource
} from 'axios'
import { ref, shallowRef } from 'vue'

const cancelTokens = new Map()

function joinUrls(urls: string[]) {
  const separator = '/'
  const replace = new RegExp(separator + '{1,}', 'g')

  return urls.join(separator).replace(replace, separator)
}

function getCancelToken() {
  const cancelToken: CancelTokenSource = axios.CancelToken.source()

  cancelTokens.set(cancelToken.token, cancelToken)

  return cancelToken
}

export function api(baseUrl: string, instance: AxiosInstance) {
  return {
    get: (url: string | number = '', config?: AxiosRequestConfig) => {
      const loading = ref(false)
      const cancelToken = getCancelToken()
      const data = shallowRef<any>()
      const response = shallowRef<AxiosResponse>()
      let requestFinished = false

      return {
        data,
        loading,
        response,
        abort(msg?: string) {
          if (requestFinished || !loading.value) return

          cancelToken.cancel(msg)
          loading.value = false
          requestFinished = true
        },
        request() {
          loading.value = true

          return instance(joinUrls([baseUrl, url.toString()]), {
            method: 'GET',
            cancelToken: cancelToken.token,
            ...config
          })
            .then((res) => {
              data.value = res.data
              response.value = res

              return res
            })
            .finally(() => {
              cancelTokens.delete(cancelToken)
              loading.value = false
              requestFinished = true
            })
        }
      }
    },

    post: (data: any, config?: AxiosRequestConfig): AxiosPromise => {
      const cancelToken = getCancelToken()

      return instance(baseUrl, { method: 'POST', data, cancelToken: cancelToken.token, ...config }).finally(() =>
        cancelTokens.delete(cancelToken)
      )
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
