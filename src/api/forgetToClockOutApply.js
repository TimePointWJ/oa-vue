import request from '@/utils/request'
//分页显示
export function getList(data) {
    return request({
      url: '/service/forget/pageList',
      method: 'post',
      data
    })
  }