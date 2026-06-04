import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {Object} params - { username, phone, page, size }
 */
export const getUserList = (params) => {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params
  })
}

/**
 * 更新用户状态
 * @param {Object} data - { id, status }  status: 0-冻结, 1-正常
 */
export const updateUserStatus = (data) => {
  return request({
    url: '/admin/user/update/status',
    method: 'put',
    data
  })
}

