import request from '@/utils/request'

// 获取攻略列表
export const getStrategyList = (params) => {
  return request({
    url: '/admin/strategy/list',
    method: 'get',
    params
  })
}

// 获取攻略详情
export const getStrategyDetail = (id) => {
  return request({
    url: `/admin/strategy/detail/${id}`,
    method: 'get'
  })
}

// 添加攻略
export const addStrategy = (data) => {
  return request({
    url: '/admin/strategy/add',
    method: 'post',
    data
  })
}

// 更新攻略
export const updateStrategy = (id, data) => {
  return request({
    url: `/admin/strategy/update/${id}`,
    method: 'put',
    data
  })
}

// 发布/下架攻略
export const publishStrategy = (id, status) => {
  return request({
    url: `/admin/strategy/publish/${id}`,
    method: 'put',
    data: { status }
  })
}

// 删除攻略
export const deleteStrategy = (id) => {
  return request({
    url: `/admin/strategy/delete/${id}`,
    method: 'delete'
  })
}
