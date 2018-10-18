/**
 * Created by OneDream on 2018/2/12.
 */
import request from '@/utils/request'

//分页显示
export function getList(data) {
  return request({
    url: '/service/leave/pageList',
    method: 'post',
    data
  })
}
//新增或修改
export function insertOrUpdate(data) {
  return request({
    url: '/service/leave/add',
    method: 'post',
    data
  })
}
//删除
export function deleteLeave(data) {
  return request({
    url: '/service/leave/delete',
    method: 'post',
    data
  })
}

//批量删除
export function delList(data) {
  return request({
    url: '/service/leave/delList',
    method: 'post',
    data
  })
}

