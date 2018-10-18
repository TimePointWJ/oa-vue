import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/service/user/info',
    method: 'get',
    params: { token }
  })
}
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

