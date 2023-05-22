import request from '@/utils/request'

const api_prefix = '/api/teacher/message'

// 检查是否有未读消息
export function getNotReadMessageCount() {
  return request({
    url: `${api_prefix}/check`,
    method: 'get'
  })
}

// 标记消息为已读
export function markAsRead() {
  return request({
    url: `${api_prefix}/read`,
    method: 'get'
  })
}

// 获取所有消息
export function listMessages(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// 删除单条消息
export function deleteMessage(id) {
  return request({
    url: `${api_prefix}/delete/${id}`,
    method: 'delete'
  })
}

// 清空所有消息
export function clearMessages() {
  return request({
    url: `${api_prefix}/clear`,
    method: 'delete'
  })
}
