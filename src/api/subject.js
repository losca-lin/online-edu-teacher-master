import request from '@/utils/request'

const api_prefix = '/api/teacher/subject'

// 获取信息
export function getSubject() {
  return request({
    url: `${api_prefix}/get`,
    method: 'get'
  })
}

