import request from '@/utils/request'

const api_prefix = '/api/teacher/course'

// 获取该讲师在草稿箱的课程
export function getDraft() {
  return request({
    url: `${api_prefix}/draft`,
    method: 'get'
  })
}

// 提交审核
export function submitIt(id) {
  return request({
    url: `${api_prefix}/submit/${id}`,
    method: 'post'
  })
}

// 获取详情
export function getInfo(id) {
  return request({
    url: `${api_prefix}/info/${id}`,
    method: 'get'
  })
}

// 获取列表
export function list(data) {
  return request({
    url: `${api_prefix}/list`,
    method: 'post',
    data
  })
}

// 获取所有id与标题
export function listAll() {
  return request({
    url: `${api_prefix}/list/all`,
    method: 'get'
  })
}

// 创建课程
export function createIt(data) {
  return request({
    url: `${api_prefix}/create`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
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

// 上传图片
export function uploadPic(data) {
  return request({
    url: `${api_prefix}/upload/pic`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 修改信息
export function updateIt(data) {
  return request({
    url: `${api_prefix}/update`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 修改章节与视频信息
export function updateCV(courseId) {
  return request({
    url: `${api_prefix}/update/${courseId}`,
    method: 'post'
  })
}

