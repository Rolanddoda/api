import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  // AxiosResponse,
  CancelTokenSource
} from 'axios'

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

// function getVars() {
//   return {
//     loading: ref(false),
//     data: shallowRef<any>(),
//     response: shallowRef<AxiosResponse>()
//   }
// }

// function request(baseUrl: string, instance: AxiosInstance, type: 'GET' | 'POST') {
//   const { loading, data, response } = getVars()
//   let cancelToken: CancelTokenSource
//   let requestFinished = false
//
//   return {
//     data,
//     loading,
//     response,
//     abort(msg?: string) {
//       if (requestFinished || !loading.value) return
//
//       cancelToken?.cancel(msg)
//       loading.value = false
//       requestFinished = true
//     },
//     exec(config: AxiosRequestConfig = {}) {
//       cancelToken = getCancelToken()
//       loading.value = true
//       requestFinished = false
//
//       return instance({
//         ...config,
//         method: type,
//         cancelToken: cancelToken.token,
//         url: joinUrls([baseUrl, config.url || ''])
//       })
//         .then((res) => {
//           data.value = res.data
//           response.value = res
//
//           return res
//         })
//         .finally(() => {
//           cancelTokens.delete(cancelToken)
//           loading.value = false
//           requestFinished = true
//         })
//     }
//   }
// }

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
