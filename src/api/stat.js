import request from '@/utils/request'

const api_prefix = '/api/teacher/stat'

export function getStat() {
  return request({
    url: `${api_prefix}/get/common`,
    method: 'get'
  })
}

