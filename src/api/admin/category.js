import request from '@/utils/request'

//获取分类列表
export const getCategoryList = (params) => {
  return request({
    url: '/admin/category/list',
    method: 'get',
    params
  })
}

//获取分类详情
export const getCategoryDetail = (id) => {
  return request({
    url: `/admin/category/detail/${id}`,
    method: 'get'
  })
}

//添加分类
export const addCategory = (data) => {
  return request({
    url: '/admin/category/add',
    method: 'post',
    data
  })
}
