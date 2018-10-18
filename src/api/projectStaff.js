import request from '@/utils/request'

//修改项目员工信息
export function updateProjectStaff(data) {
  return request({
    url: '/service/projectStaff/updateProjectStaff',
    method: 'post',
    data
  })
}
//查询项目经理，副经理列表
export function getProjectStaffByPositionId(data) {
  return request({
    url: '/service/projectStaff/getProjectStaffByPositionId?positionId='+data,
    method: 'post',
  })
}
//从项目删除员工
export function deleteProjectStaff(data) {
  return request({
    url: '/service/projectStaff/deleteProjectStaff',
    method: 'post',
    data
  })
}



