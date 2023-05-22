import request from '@/utils/request'

const api_prefix = '/api/teacher/chapter'

// 获取章节列表信息
export function list(courseId) {
  return request({
    url: `${api_prefix}/list/${courseId}`,
    method: 'get'
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

// 创建
export function updateIt(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    data
  })
}

// 删除
export function deleteIt(chapterId) {
  return request({
    url: `${api_prefix}/delete/${chapterId}`,
    method: 'post'
  })
}

