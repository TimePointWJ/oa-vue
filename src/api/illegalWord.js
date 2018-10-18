import request from '@/utils/request'

export function addWord(data) { // 添加关键字
  return request({
    url: '/service/illegalWord/addWord',
    method: 'post',
    data
  })
}
export function editWord(data) { // 编辑关键字
  return request({
    url: '/service/illegalWord/editWord',
    method: 'post',
    data
  })
}
export function pagination(data) { // 查询关键字列表
  return request({
    url: '/service/illegalWord/pagination',
    method: 'post',
    data
  })
}
export function deleteWord(data) { // 删除关键字
  return request({
    url: '/service/illegalWord/deleteWord',
    method: 'post',
    data
  })
}
export function listPerson(data) { // 发布人列表
  return request({
    url: '/service/illegalWord/listPerson',
    method: 'post',
    data
  })
}
export function listIllegalWord(data) { // 所有非法关键字
  return request({
    url: '/service/illegalWord/listIllegalWord',
    method: 'post',
    data
  })
}
export function getIllegalWordFromJava(data) { // 所有非法关键字
  return request({
    url: '/service/illegalWord/getIllegalWord',
    method: 'post',
    data
  })
}

