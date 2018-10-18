import request from '@/utils/request'

export function submitNotice(data) { // 发布公告
  return request({
    url: '/service/notice/submitNotice',
    method: 'post',
    data
  })
}

export function pagination(data) { // 查询公告列表
  return request({
    url: '/service/notice/pagination',
    method: 'post',
    data
  })
}
export function deleteNotice(data) { // 删除公告
  return request({
    url: '/service/notice/deleteNotice',
    method: 'post',
    data
  })
}

export function lookOneNotice(data) { // 删除公告
  return request({
    url: '/service/notice/lookOneNotice',
    method: 'post',
    data
  })
}
export function personalNotice(data) { // 个人公告
  return request({
    url: '/service/notice/personalNotice',
    method: 'post',
    data
  })
}
export function reviewNotice(data) { // 审核公告
  return request({
    url: '/service/notice/reviewNotice',
    method: 'post',
    data
  })
}
export function listAuthor(data) { // 作者列表
  return request({
    url: '/service/notice/listAuthor',
    method: 'post',
    data
  })
}
export function submitResponse(data) { // 回复
  return request({
    url: '/service/notice/submitResponse',
    method: 'post',
    data
  })
}
export function deleteResponse(data) { // 删除回复
  return request({
    url: '/service/notice/deleteResponse',
    method: 'post',
    data
  })
}
export function pageResponse(data) { // 分页评论
  return request({
    url: '/service/notice/pageResponse',
    method: 'post',
    data
  })
}
export function reviewPersonList(data) { // 作者列表
  return request({
    url: '/service/notice/listReviewPerson',
    method: 'post',
    data
  })
}
export function getEditData(data) { // 获取编辑时需要的初始数据
  return request({
    url: '/service/notice/getEditData',
    method: 'post',
    data
  })
}
export function getNoticeCount(data) { // 获取编辑时需要的初始数据
  return request({
    url: '/service/notice/getNoticeCount',
    method: 'post',
    data
  })
}

