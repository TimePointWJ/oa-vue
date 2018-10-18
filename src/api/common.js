import request from '@/utils/request'

// 数据词典
export function dictionaryList(data) {
  return request({
    url: '/common/dictionaryList?codeType=' + data,
    method: 'post'
  })
}
// 查询部门列表
export function departmentList(data) {
  return request({
    url: '/common/departmentList',
    method: 'post',
    data
  })
}
// 查询项目列表
export function projectList(data) {
  return request({
    url: '/common/projectList',
    method: 'post',
    data
  })
}

// 查询职位列表
export function positionList(data) {
  return request({
    url: '/common/positionList',
    method: 'post',
    data
  })
}
// 查询地区列表
export function listAreDate(data) {
  return request({
    url: '/common/listAreDate',
    method: 'post',
    data
  })
}
// 查询地区列表
export function staffList(data) {
  return request({
    url: '/common/listStaff',
    method: 'post',
    data
  })
}
