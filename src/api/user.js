import request from '@/utils/request'

const api_prefix = '/api/teacher/user'

// 登录
export function login(data) {
  return request({
    url: `${api_prefix}/login`,
    method: 'post',
    data
  })
}

// 注销登录
export function logout() {
  return request({
    url: `${api_prefix}/logout`,
    method: 'post'
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: `${api_prefix}/info`,
    method: 'get'
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: `${api_prefix}/update/password`,
    method: 'post',
    data
  })
}

