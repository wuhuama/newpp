import { login, logout, getUserInfo } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'
const menuData = require('../../menu.json')

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    // menus: menuData.topMenuList,
    menus: [],
    projects:[],
    sidemenus: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_PROJECTS: (state, projects) => {
      state.projects = projects
    },
    SET_SIDEMENUS: (state, menus) => {
      state.sidemenus = menus
    }
  },

  actions: {
    // 登录
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.authcode).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息, 姓名,状态,用户名,部门, 角色
    // 获取用户对应的菜单，用户的菜单的name对应相同name的路由
    GetUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data
          if (data.topMenuList && data.topMenuList.length > 0) {
            commit('SET_MENUS', data.topMenuList)
            window.localStorage.setItem('menus', JSON.stringify(data.topMenuList))
            // 
            if (data.topMenuList[0].children) {
              console.log(data.topMenuList[0].children);
              window.localStorage.setItem('sidemenus', data.topMenuList[0].children)
            }
          }
          if (data.project && data.project.length > 0){
            commit('SET_PROJECTS', data.project)
            window.localStorage.setItem('project', JSON.stringify(data.project))
          }
          commit('SET_NAME', data.user.userName)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_MENUS', [])
          // 清楚cookie/localStorage
          window.localStorage.removeItem('menus')
          window.localStorage.removeItem('sidemenus')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_MENUS', [])
        window.localStorage.removeItem('sidemenus')
        resolve()
      })
    }
  }
}

export default user
