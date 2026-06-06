import request from '@/utils/request'

// 用户端：获取公告列表
export function getAnnouncementList(params) {
  return request({
    url: '/announcement/list',
    method: 'get',
    params
  })
}

// 用户端：获取公告详情
export function getAnnouncementDetail(id) {
  return request({
    url: `/announcement/detail/${id}`,
    method: 'get'
  })
}