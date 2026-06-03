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

/**
 * 新增用户
 * @param {Object} data - { username, nickname, phone, user_type, status }
 */
export const addUser = (data) => {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data
  })
}

/**
 * 更新用户信息
 * @param {number} id - 用户ID
 * @param {Object} data - { username, nickname, phone, user_type, status }
 */
export const updateUser = (id, data) => {
  return request({
    url: `/admin/user/update/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {number} id - 用户ID
 */
export const deleteUser = (id) => {
  return request({
    url: `/admin/user/delete/${id}`,
    method: 'delete'
  })
}
