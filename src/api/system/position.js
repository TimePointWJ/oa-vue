/**
 * Created by OneDream on 2018/2/12.
 */
import request from '@/utils/request'

//分页显示
export function getList(data) {
  return request({
    url: '/service/position/pageList',
    method: 'post',
    data
  })
}
//新增或修改
export function insertOrUpdate(data) {
  return request({
    url: '/service/position/add',
    method: 'post',
    data
  })
}
//删除
export function deleteType(data) {
  return request({
    url: '/service/position/delete',
    method: 'post',
    data
  })
}

//批量删除
export function delList(data) {
  return request({
    url: '/service/position/delList',
    method: 'post',
    data
  })
}
//类别列表
export function typeList(data) {
  return request({
    url: '/service/position/listType',
    method: 'post',
    data
  })
}
