import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import Utils from '@/utils/util.js'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/modifypwd', '/404'] // no redirect whitelist

// permission judge function
function hasPermission (router, accessRoutes) {
  if (whiteList.indexOf(router.name) !== -1) {
    return true
  }
  if (accessRoutes.indexOf(router.name) !== -1) {
    return true
  }
  return false
}
// 路由的全局钩子
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  
  if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    next()
  } else {
    if (store.getters.menus.length === 0) {
      store.dispatch('GetUserInfo').then(res => { // 拉取user_info
        const menus = res.data.topMenuList
        
        let accessRoutes = Utils.authRoutes(menus)
        // console.log('accessRoutes', accessRoutes)

        if (hasPermission(to, accessRoutes)) {
          next()
        } else {
          next({
            path: '/404'
          })
        }
      }).catch((err) => {
        NProgress.done() // finish progress bar
        next({
          path: '/login'
        })
      })
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
