// src/utils/request.js
import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  // ============================================
  // 当前使用 Mock 地址（后端开发好后改成真实地址）
  // ============================================

  // Mock 地址（你现在用的）
  baseURL: 'https://m1.apifoxmock.com/m1/8319784-8083579-default',

  // 真实后端地址（后端开发好后，把上面这行注释，取消下面这行的注释）
  // baseURL: 'http://localhost:8080/api/v1',

  timeout: 15000, // 请求超时时间：15秒

  headers: {
    'Content-Type': 'application/json'
  }
})

// ============================================
// 请求拦截器（在发送请求前自动执行）
// ============================================
request.interceptors.request.use(
  (config) => {
    // 如果有 token，自动添加到请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============================================
// 响应拦截器（在收到响应后自动执行）
// ============================================
request.interceptors.response.use(
  (response) => {
    // 直接返回 response.data，组件里不用再写 .data
    return response.data
  },
  (error) => {
    // 统一处理错误
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        console.error('未授权，请重新登录')
        // 跳转到登录页
      } else if (status === 403) {
        console.error('没有权限')
      } else if (status === 404) {
        console.error('接口不存在')
      } else if (status >= 500) {
        console.error('服务器错误')
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('请求超时')
    } else if (error.message.includes('Network Error')) {
      console.error('网络错误，请检查网络连接')
    } else {
      console.error('请求失败：', error.message)
    }

    return Promise.reject(error)
  }
)

export default request
