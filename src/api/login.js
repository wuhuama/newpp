import $http from '@/utils/request'
import qs from 'qs'

export function login (username, password, authcode) {
  return $http({
    url: '/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      username,
      password,
      authcode
    })
  })
}

export function getUserInfo () {
  return $http({
    url: '/getLoginUser',
    method: 'get'
  })
}

// updSysUserPwd
export function updSysUserPwd (data) {
  return $http({
    url: '/updSysUserPwd',
    method: 'put',
    data: data
  })
}
// updLoginUserPwd
export function updLoginUserPwd (data) {
  return $http({
    url: '/updLoginUserPwd',
    method: 'put',
    data: data
  })
}
export function logout () {
  return $http({
    url: '/logout',
    method: 'get'
  })
}
