import request from '@/utils/request'

//角色一览
export function pagination(data) {
  return request({
    url: '/service/role/roleList',
    method: 'post',
    data
  })
}

//后台角色详情
export function roleDetails(data) {
  return request({
    url: '/service/role/roleDetail',
    method: 'post',
    data
  })
}

//后台角色添加
export function roleAdd(data) {
  return request({
    url: '/service/role/roleAdd',
    method: 'post',
    data
  })
}

//后台角色更新
export function roleUpdate(data) {
  return request({
    url: '/service/role/roleUpdate',
    method: 'post',
    data
  })
}

//后台角色删除
export function roleDelete(data) {
  return request({
    url: '/service/role/roleDelete',
    method: 'post',
    data
  })
}

//后台角色批量删除
export function roleDeletList(data) {
  return request({
    url: '/service/role/deleteList',
    method: 'post',
    data
  })
}
//获取后台角色类型
export function listRoleType(data) {
  return request({
    url: '/common/dictionaryList?codeType='+data,
    method: 'post',
    data
  })
}

//获取后台角色类型
export function menuList(data) {
  return request({
    url: '/service/role/menuList',
    method: 'post',
    data
  })
}

// 保存选中角色赋予的权限
export function saveAuth(data) {
  return request({
    url: '/service/role/saveAuth',
    method: 'post',
    data
  })
}
export function getRole(data) {
  return request({
    url: '/service/role/getRole',
    method: 'post',
    data
  })
}