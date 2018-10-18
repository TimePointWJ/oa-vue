/**
 * Created by OneDream on 2018/2/12.
 */
import request from '@/utils/request'

//分页显示
export function getList(data) {
  return request({
    url: '/service/noticeType/pageList',
    method: 'post',
    data
  })
}
//新增或修改
export function insertOrUpdate(data) {
  return request({
    url: '/service/noticeType/add',
    method: 'post',
    data
  })
}
//删除
export function deleteType(data) {
  return request({
    url: '/service/noticeType/delete',
    method: 'post',
    data
  })
}

//批量删除
export function delList(data) {
  return request({
    url: '/service/noticeType/delList',
    method: 'post',
    data
  })
}
//类别列表
export function typeList(data) {
  return request({
    url: '/service/noticeType/listType',
    method: 'post',
    data
  })
}
