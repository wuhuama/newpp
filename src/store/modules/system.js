// import { userList, delUser, getUserInfo } from '@/api/system'
import * as sysApi from '@/api/system'
// import { getToken, setToken, removeToken } from '@/utils/auth'

const system = {
  namespaces: true,
  state: {
    userlist: [],
    rolelist: [],
    menulist: [],
    loglist: []
  },
  getters: {
    userlist (state) {
      return state.userlist
    }
  },

  mutations: {
    SET_USERLIST: (state, list) => {
      state.userlist = list
    },
    SET_ROLELIST: (state, list) => {
      state.rolelist = list
    },
    SET_MENULIST: (state, list) => {
      state.menulist = list
    },
    SET_LOGLIST: (state, list) => {
      state.loglist = list
    }
  },

  actions: {
    // 用户列表
    GetUserList ({ commit }, param) {
      return new Promise((resolve, reject) => {
        sysApi.userList(param).then(response => {
          const data = response
          commit('SET_USERLIST', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 删除用户
    delSysUser ({ commit }, param) {
      return new Promise((resolve, reject) => {
        sysApi.delSysUser(param).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getSysUserInfo ({ commit }, param) {
      return new Promise((resolve, reject) => {
        sysApi.getSysUserInfo(param).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 新增用户
    addSysUser (param) {
      return new Promise((resolve, reject) => {
        sysApi.addSysUser(param).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 角色列表
    GetRoleList ({ commit }, param) {
      return new Promise((resolve, reject) => {
        sysApi.userList(param).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取角色信息
    GetRoleInfo ({commit}, param) {
      return new Promise((resolve, reject) => {
        sysApi.getRoleInfo(param).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 删除角色
    DelRole ({ commit }, param) {
      return new Promise((resolve, reject) => {
        sysApi.delRole(param).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取菜单
    // GetMenuList: async ({ commit }, params) => {
    //   const res = await sysApi.getSysMenu(params)
    //   return commit('MENU_LIST', res)
    // },
    GetMenuList ({ commit }, param) {
      return new Promise((resolve, reject) => {
        sysApi.getSysMenu(param).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 日志列表
    GetSysLogList ({ commit }, param) {
      return new Promise((resolve, reject) => {
        sysApi.getSysLog(param).then(response => {
          const data = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default system
