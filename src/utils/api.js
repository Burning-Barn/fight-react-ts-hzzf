import axios from 'axios'
import { getToken, setToken, removeToken, isAuth } from '../utils/auth'

// 创建axios示例
const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
})

API.interceptors.request.use((config) => {
    const { url } = config
    if(
      url.startsWith('/user') &&
      !url.startsWith('/user/login') &&
      !url.startsWith('/user/registered')) {
        // 添加请求头
        config.headers.Authorization = getToken()
    }
    return config
})

API.interceptors.response.use((response) => {
  // console.log(response)
  const { status } = response.data
  if (status === 400) {
    // 此时，说明 token 失效，直接移除 token 即可
    removeToken()
  }

  return response
})

export { API }
