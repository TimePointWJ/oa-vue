import request from '@/utils/request'
//后台账号一览
export function pagination(data) {
  return request({
    url: '/service/user/userList',
    method: 'post',
    data
  })
}

//后台账号详情
export function accountDetails(data) {
  return request({
    url: '/service/user/userDetail',
    method: 'post',
    data
  })
}

//后台账号添加
export function accountAdd(data) {
  return request({
    url: '/service/user/userAdd',
    method: 'post',
    data
  })
}

//后台账号更新
export function accountUpdate(data) {
  return request({
    url: '/service/user/userUpdate',
    method: 'post',
    data
  })
}

//后台账号删除
export function accountDelete(data) {
  return request({
    url: '/service/user/userDelete',
    method: 'post',
    data
  })
}

//后台账号批量删除
export function accountDeletList(data) {
  return request({
    url: '/service/user/deleteList',
    method: 'post',
    data
  })
}
//数据字典
export function dictionaryList(data) {
  return request({
    url: '/common/dictionaryList?codeType='+data,
    method: 'post',
  })
}
//校址人员
export function listSchoolStaff(data) {
  return request({
    url: '/common/listSchoolStaff',
    method: 'post',
  })
}
//角色
export function listSystemRole(data) {
  return request({
    url: '/common/listSystemRole',
    method: 'post',
  })
}
//查询用户
export function getUser(data) {
  return request({
    url: '/service/user/getUser',
    method: 'post',
    data
  })
}
//修改用户
export function updateUser(data) {
  return request({
    url: '/service/user/updateUser',
    method: 'post',
    data
  })
}