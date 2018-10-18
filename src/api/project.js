import request from '@/utils/request'

//查询部门信息列表
export function pagination(data) {
  return request({
    url: '/service/project/pagination',
    method: 'post',
    data
  })
}
//查询部门信息列表
export function insertProject(data) {
  return request({
    url: '/service/project/insertProject',
    method: 'post',
    data
  })
}
//查询部门信息列表
export function updateProject(data) {
  return request({
    url: '/service/project/updateProject',
    method: 'post',
    data
  })
}
//查询部门信息列表
export function deleteProject(data) {
  return request({
    url: '/service/project/deleteProject',
    method: 'post',
    data
  })
}
//添加员工到项目
export function addStaffToProject(data) {
  return request({
    url: '/service/project/addStaffToProject',
    method: 'post',
    data
  })
}
