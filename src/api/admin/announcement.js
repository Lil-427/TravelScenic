import request from '@/utils/request'

// 用户端：获取公告列表
export function getAnnouncementList(params) {
  return request({
    url: '/api/v1/announcement/list',  // 用户端接口
    method: 'get',
    params
  })
}

// 用户端：获取公告详情
export function getAnnouncementDetail(id) {
  return request({
    url: `/api/v1/announcement/detail/${id}`,  // 用户端接口
    method: 'get'
  })
}