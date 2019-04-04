import $http from '@/utils/request'

// 获取用户列表
export function userList (query) {
  return $http({
    url: '/getSysUser',
    method: 'post',
    data: query
  })
}
// 根据id查询用户信息
export function getSysUserInfo (id) {
  return $http({
    url: '/getSysUser/' + id,
    method: 'get'
  })
}
// 删除用户
export function delSysUser (id) {
  return $http({
    url: '/delSysUser/' + id,
    method: 'delete'
  })
}
// 修改用户信息
export function updSysUser (param) {
  return $http({
    url: '/updSysUser',
    method: 'put',
    data: param
  })
}
// 新增用户
export function addSysUser (data) {
  return $http({
    url: '/addSysUser',
    method: 'post',
    data: data
  })
}
// 查询用户角色
export function getSysUserRole (id) {
  return $http({
    url: '/getSysUserRole/' + id,
    method: 'get'
  })
}
// 保存用户角色
export function addSysUserRole (data) {
  return $http({
    url: '/addSysUserRole',
    method: 'post',
    data: data
  })
}
// 获取角色列表
export function roleList (query) {
  return $http({
    url: '/getSysRole',
    method: 'post',
    data: query
  })
}
// 根据id查询角色信息
export function getRoleInfo (id) {
  return $http({
    url: '/getSysRole/' + id,
    method: 'get'
  })
}
// 删除角色
export function delRole (id) {
  return $http({
    url: '/delSysRole/' + id,
    method: 'delete'
  })
}
// 修改角色信息
export function updSysRole (data) {
  return $http({
    url: '/updSysRole',
    method: 'put',
    data: data
  })
}
// 新增角色
export function addSysRole (data) {
  return $http({
    url: '/addSysRole',
    method: 'post',
    data: data
  })
}
// 根据角色查询菜单
export function getSysRoleMenu (id) {
  return $http({
    url: '/getSysRoleMenu/' + id,
    method: 'get'
  })
}
// 保存角色菜单权限
export function addSysRoleMenu (data) {
  return $http({
    url: '/addSysRoleMenu',
    method: 'put',
    data: data
  })
}

// 菜单管理
export function getSysMenu () {
  return $http({
    url: '/getAllMenu',
    method: 'get'
  })
}
// 根据id获取菜单信息
export function getSysMenuBy (id) {
  return $http({
    url: '/getSysMenu/' + id,
    method: 'get'
  })
}
// 删除单个菜单节点确认
export function delSysMenuCheck (id) {
  return $http({
    url: '/delSysMenuCheck' + id,
    method: 'get'
  })
}
// 删除单个菜单节点
export function delSysMenu (id) {
  return $http({
    url: '/delSysMenu/' + id,
    method: 'delete'
  })
}
// 修改菜单信息
export function updSysMenu (data) {
  return $http({
    url: '/updSysMenu',
    method: 'put',
    data: data
  })
}
// 新增菜单
export function addSysMenu (data) {
  return $http({
    url: '/addSysMenu',
    method: 'post',
    data: data
  })
}

// 获取日志列表
export function getSysLog (query) {
  return $http({
    url: '/getSysLog',
    method: 'POST',
    data: query
  })
}
