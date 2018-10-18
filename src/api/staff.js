import request from '@/utils/request'

//查询员工信息列表
export function pagination(data) {
  return request({
    url: '/service/user/pagination',
    method: 'post',
    data
  })
}
//添加员工(员工自己注册)
export function insertStaff(data) {
  return request({
    url: '/service/user/insertStaff',
    method: 'post',
    data
  })
}
//添加员工(管理员直接添加)
export function addStaff(data) {
  return request({
    url: '/service/user/addStaff',
    method: 'post',
    data
  })
}
//修改员工信息
export function updateStaff(data) {
  return request({
    url: '/service/user/updateStaff',
    method: 'post',
    data
  })
}
//删除员工信息
export function deleteStaff(data) {
  return request({
    url: '/service/user/deleteStaff',
    method: 'post',
    data
  })
}
//根据id查询员工信息
export function selectStaffById(data) {
  return request({
    url: '/service/user/selectStaffById?id='+data,
    method: 'post',
  })
}
//修改员工密码
export function updateUserPwd(data) {
  return request({
    url: '/service/user/updateUserPwd',
    method: 'post',
    data
  })
}
//查询部门经理，副经理
export function getStaffByPositionId(data) {
  return request({
    url: '/service/user/getStaffByPositionId?positionId='+data,
    method: 'post',
  })
}
//查询员工
export function selectStaffByQuery(data) {
  return request({
    url: '/service/user/selectStaffByQuery',
    method: 'post',
    data
  })
}
