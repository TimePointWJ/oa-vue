import request from '@/utils/request'

//查询公共通讯录信息列表
export function paginationPublic(data) {
  return request({
    url: '/service/address/paginationPublic',
    method: 'post',
    data
  })
}
//查询私有通讯录信息列表
export function paginationPrivate(data) {
  return request({
    url: '/service/address/paginationPrivate',
    method: 'post',
    data
  })
}
//添加到我的私有通讯录
export function addToPrivate(data) {
  return request({
    url: '/service/address/addToPrivate',
    method: 'post',
    data
  })
}
//从我的私有通讯录移出
export function moveFormPrivate(data) {
  return request({
    url: '/service/address/moveFormPrivate',
    method: 'post',
    data
  })
}