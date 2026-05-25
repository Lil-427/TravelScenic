import request from '@/utils/request'

/**
 * 获取列表
 */
export const getSpotList = (params) => {
  return request({
    url: '/admin/scenic/list',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export const getSpotDetail = (id) => {
  return request({
    url: `/admin/scenic/detail/${id}`,
    method: 'get'
  })
}

/**
 * 添加景区
 */
export const addSpot = (data) => {
  return request({
    url: '/admin/scenic/add',
    method: 'post',
    data
  })
}

/**
 * 更新景区
 */
export const updateSpot = (id, data) => {
  return request({
    url: `/admin/scenic/update/${id}`,
    method: 'put',
    data
  })
}

/**
 * 更新状态
 */
export const updateSpotStatus = (id, status) => {
  return request({
    url: `/admin/scenic/update/status/${id}`,
    method: 'put',
    data: {
      status
    }
  })
}

/**
 * 删除景区
 */
export const deleteSpot = (id) => {
  return request({
    url: `/admin/scenic/delete/${id}`,
    method: 'delete'
  })
}
