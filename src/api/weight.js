import request from '@/utils/requests'

export function apiWeight(data) {
  return request({
    url: '/api/weight',
    method: 'post',
    data
  })
}
export function weightQuery(data) {
  return request({
    url: '/api/weightQuery',
    method: 'post',
    data
  })
}
export function updateWeight(data) {
  return request({
    url: '/api/updateWeight',
    method: 'post',
    data
  })
}
export function deleteWeight(data) {
  return request({
    url: '/api/deleteWeight',
    method: 'post',
    data
  })
}
export function subWeight(data) {
  return request({
    url: '/api/subWeight',
    method: 'post',
    data
  })
}
export function deletesubWeight(data) {
  return request({
    url: '/api/deletesubWeight',
    method: 'post',
    data
  })
}
export function updateubWeight(data) {
  return request({
    url: '/api/updateubWeight',
    method: 'post',
    data
  })
}
// 查询公司
export function apiRead(data) {
  return request({
    url: '/api/read',
    method: 'post',
    data
  })
}
export function updateubcompany(data) {
  return request({
    url: '/api/updateubcompany',
    method: 'post',
    data
  })
}




