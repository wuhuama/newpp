import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'

// 创建axios实例
const $http = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000
})

// request 请求拦截器
$http.interceptors.request.use(config => {
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone 响应拦截器
$http.interceptors.response.use(
  /**
   * 以下是通过自定义code来表示请求状态
   */
  response => {
    const res = response.data
    if (res.code !== 1) {
      message(res.msg, 'error')
      return Promise.reject(res)
    }
    return res
  },
  error => {
    const res = error.response
    if (res && res.status) {
      switch (res.status) {
        // 401: 未登录
        // 未登录则跳转登录页面,并携带当前页面的路径,登录成功后返回当前页面,这一步需要在登录页操作
        case 401:
          message(res.status + '： 请登录', 'error')
          toLogin()
          break
        case 403:
          message(res.status + '： 登录过期,请重新登录', 'error')
          // 清除token
          // localStorage.removeItem('token')
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            toLogin()
          }, 1000)
          break
        case 500 || 504:
          message(res.status + '：服务器错误', 'error')
          break
        // case 504:
        //   message(res.status + '：服务器错误 Time-out ', 'error')
        //   break
        default:
          message(res.status + '： ' + res.msg, 'error')
          break
      }
    }
    console.log('err' + error) // for debug
    return Promise.reject(error)
  })
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    // query: {
    //   redirect: router.currentRoute.fullPath
    // }
  })
}

export function message (text, type) {
  Message({
    message: text,
    type: type,
    duration: 5 * 1000
  })
}

export default $http
