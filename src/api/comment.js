import request from '@/utils/request'

const api_prefix = '/api/teacher/comment'

// 获取列表信息
export function list(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// 创建
export function createIt(data) {
  return request({
    url: `${api_prefix}/create`,
    method: 'post',
    data
  })
}

// 更新
export function updateIt(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}

// 删除
export function deleteIt(id) {
  return request({
    url: `${api_prefix}/delete/${id}`,
    method: 'post'
  })
}

