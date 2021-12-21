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

*In the file above we export a `defineApi` function which will be used to define APIs.
If you use multiple axios instances, it would be useful to name this function related to the instance.*

> **Step2: Modules**

Inside `api` folder, create a `modules` folder. In this folder we are going to create individual modules for each API.

Let's start by creating a module for `/posts` API.

**modules/posts.js**

```js
import { defineApi } from '../api'

const posts = defineApi('/posts')

export const getPosts = () => posts.get()
export const getPost = id => posts.get(id)
export const putPost = (id, data) => posts.put(id, data)
export const deletePost = id => posts.delete(id)
```
