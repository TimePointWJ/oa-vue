import request from '@/utils/request'

//查询信息列表
export function paginationMessage(data) {
  return request({
    url: '/service/message/pagination',
    method: 'post',
    data
  })
}
//发送消息
export function sendMessage(data) {
  return request({
    url: '/service/message/sendMessage',
    method: 'post',
    data
  })
}
//删除此条消息
export function deleteMessage(data) {
  return request({
    url: '/service/message/deleteMessage',
    method: 'post',
    data
  })
}
//删除全部消息
export function deleteAllMessage(data) {
  return request({
    url: '/service/message/deleteAllMessage',
    method: 'post',
    data
  })
}
