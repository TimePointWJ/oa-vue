import request from '@/utils/request'

//查询部门信息列表
export function pagination(data) {
  return request({
    url: '/service/dept/pagination',
    method: 'post',
    data
  })
}
//查询部门信息列表
export function insertDept(data) {
  return request({
    url: '/service/dept/insertDept',
    method: 'post',
    data
  })
}
//查询部门信息列表
export function updateDept(data) {
  return request({
    url: '/service/dept/updateDept',
    method: 'post',
    data
  })
}
//查询部门信息列表
export function deleteDept(data) {
  return request({
    url: '/service/dept/deleteDept',
    method: 'post',
    data
  })
}