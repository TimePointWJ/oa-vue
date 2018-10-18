import request from '@/utils/request'
//分页显示
export function getList(data) {
    return request({
      url: '/service/attendanceRecord/pageList',
      method: 'post',
      data
    })
  }
  
//分页显示
export function excelImport(data) {
  return request({
    url: '/service/attendanceRecord/excelImport',
    method: 'post',
    data
  })
}