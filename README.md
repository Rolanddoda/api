### A simple axios wrapper

The purpose of this package is to provide ease of defining and using REST APIs.
If you structure backend APIs in a modular way, you might want to use this package.

### Installation

**Make sure you have axios installed**

```shell
npm install @roland1993/api
```

### How to use

I am going to describe how I use this package along with creating a modular structure for APIs.

> **Step1: api folder**

Inside `src` directory of your project, create an `api` folder.
Inside, create an `index.js` file with the following content:

```js
import axios from 'axios'
import { api } from '@roland1993/api'

// Create your axios instance
const instance = axios.create({
  baseURL: "process.env.API_URL",
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

export const defineApi = (url) => api(url, instance)
```

`api` function is a factory function that returns an object with methods to make requests.
Specifically it returns:

```js
{
  get: (url: string | number = '', config?: AxiosRequestConfig): AxiosPromise,
  post: (data?: any, config?: AxiosRequestConfig): AxiosPromise,
  put: (url: string | number = '', data: any, config?: AxiosRequestConfig): AxiosPromise,
  patch: (url: string | number = '', data: any, config?: AxiosRequestConfig): AxiosPromise
  delete: (url: string | number, config?: AxiosRequestConfig): AxiosPromise
}
```

*In the file above we export a `defineApi` function which will be used to define APIs.
If you use multiple axios instances, it would be useful to name this function related to the instance.*

> **Step2: Modules**

Inside `api` folder, create a `modules` folder. In this folder we are going to create individual modules for each API.

Let's start by creating a module for `/posts` API.

**modules/posts.js**

```js
import { defineApi } from '@api'

const posts = defineApi('/posts')

export const getPosts = () => posts.get()
export const getPost = id => posts.get(id)
export const putPost = (id, data) => posts.put(id, data)
```

> **Step3: How to use**

You either import the APIs from each file:

```js
import { getPosts } from '@api/modules/posts'

getPosts()
  .then()
  .catch()
  .finally()
```

or export them in `@api/index.js` file and import them from there:

**@api/index.js**
```js
// ...

export * from './modules/posts'
```

Then you can use it in your app:

```js
import * as request from '@api'

request.getPosts()
  .then()
  .catch()
  .finally()
```

------------------

### Typing APIs

#### Typescript

Typing with typescript is easy. You just pass a generic type to the request method.
So the `modules/posts.ts` will look like this:

```ts
import { defineApi } from '@api'

interface Post {
  id: number
  title: string
  body: string
  createdAt: string
}

interface NewPost {
  title: string
  body: string
}

const posts = defineApi('posts')

export const getPosts = () => posts.get<Post[]>()
export const getPost = (id: string) => posts.get<Post>(id)
export const putPost = (id: string, data: NewPost) => posts.put<Post>(id, data)
```

#### Javascript

Even if you don't use typescript, you can still type APIs by using JSDoc:

```js
import { defineApi } from '@api'

const posts = defineApi('posts')

/**
 * @typedef Post
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {string} createdAt
 */

/**
 * @typedef NewPost
 * @property {string} title
 * @property {string} body
 */

/**
 * @description GET /posts
 * @returns {AxiosPromise<Post[]>}
 */
export const getPosts = () => posts.get()

/**
 * @description GET /posts/{param}
 * @param {string | number} id
 * @returns {AxiosPromise<Post>}
 */
export const getPost = (id) => posts.get(id)

/**
 * @description PUT /posts/id
 * @param {string | number} id
 * @param {NewPost} data
 * @returns {AxiosPromise<Post>}
 */
export const putPost = (id, data) => posts.put(id, data)
```
### Cancel pending requests

If you want to cancel all pending requests, you can use `cancelPendingRequests` function:

```js
import { cancelPendingRequests } from '@roland1993/api'

cancelPendingRequests()
```
