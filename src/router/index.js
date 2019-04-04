import Vue from 'vue'
import Router from 'vue-router'
import ProLayout from '@/views/layout/ProLayout'
import Layout from '@/views/layout/Layout'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index'),
      hidden: true
    }, {
      path: '/',
      component: ProLayout,
      redirect: 'dashboard',
      children:[{
        path: 'dashboard',
        name: 'home',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: 'dashboard',
          icon: 'dashboard'
        }
      }]
    }, {
      path: '/homework',
      component: ProLayout,
      redirect: {name: 'homework'},
      children: [{
        path: 'index',
        name: 'homework',
        component: () => import('@/views/cityhomework/index'),
        meta: {
          title: '城市职住平衡分析',
          icon: 'aa'
        }
      }]
    }, {
      path: '/tripod',
      component: ProLayout,
      redirect: {
        name: 'tripod'
      },
      children: [{
        path: 'index',
        name: 'tripod',
        component: () => import('@/views/tripod/index'),
        meta: {
          title: '出行OD分析',
          icon: 'aa'
        }
      }]
    }, {
      path: '/areapeople',
      component: ProLayout,
      redirect: {
        name: 'areapeople'
      },
      children: [{
        path: 'index',
        name: 'areapeople',
        component: () => import('@/views/areapeople/index'),
        meta: {
          title: '区域人口分析',
          icon: 'aa'
        }
      }]
    }, {
      path: '/screenline',
      component: ProLayout,
      redirect: {
        name: 'screenline'
      },
      children: [{
        path: 'index',
        name: 'screenline',
        component: () => import('@/views/screenline/index'),
        meta: {
          title: '查核线分析',
          icon: 'aa'
        }
      }]
    }, {
      path: '/base',
      name:'base',
      component: ProLayout,
      redirect: 'trainparam',
      children: [{
        path: 'trainparam',
        component: () => import('@/views/basicsetting/trainingParams'),
        name: 'trainparam',
        meta: {
          title: '参数训练',
          icon: 'setting'
        }
      }]
    }, {
      path: '/system',
      name: 'system',
      component: Layout,
      redirect: '/system/index',
      meta: {
        title: '系统管理',
        icon: 'sys'
      },
      children: [{
        path: 'index',
        name: 'systemIndex',
        component: () => import('@/views/system/index'),
        hidden: true
      }, {
        path: 'userlist',
        name: 'userlist',
        component: () => import('@/views/system/userList'),
        meta: {
          title: '用户管理',
          icon: 'sys-user'
        }
      }, {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/roleList'),
        meta: {
          title: '角色管理',
          icon: 'sys-user'
        }
      }, {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/system/menuList'),
        meta: {
          title: '菜单管理',
          icon: 'sys-menu'
        }
      }, {
        path: 'project',
        name: 'project',
        component: () => import('@/views/system/projectList'),
        meta: {
          title: '项目管理',
          icon: 'sys-proj'
        }
      }, {
        path: 'regional',
        name: 'regional',
        component: () => import('@/views/system/regionalReview'),
        meta: {
          title: '区域审核',
          icon: 'sys-proj'
        }
      }, {
        path: 'log',
        name: 'log',
        component: () => import('@/views/system/logList'),
        meta: {
          title: '日志管理',
          icon: 'sys-depart'
        }
      }]
    }, {
      path: '/404',
      name: '404',
      component: () => import('@/views/404'),
      hidden: true
    }
  ]
})
