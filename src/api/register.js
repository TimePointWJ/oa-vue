import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/service/user/register',
    method: 'post',
    params: data
  })
}