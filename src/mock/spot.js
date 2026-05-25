// src/mock/spot.js

import Mock from 'mockjs'

const scenicList = [
  {
    id: 1,
    scenic_name: '九寨沟',
    category_id: 1,
    category_name: '自然风光',
    cover_image: 'https://picsum.photos/300/200?1',
    location: '四川 阿坝',
    price: 299,
    status: 1,
    create_time: '2026-05-01 10:00:00'
  },
  {
    id: 2,
    scenic_name: '故宫',
    category_id: 2,
    category_name: '历史古迹',
    cover_image: 'https://picsum.photos/300/200?2',
    location: '北京',
    price: 60,
    status: 1,
    create_time: '2026-05-02 10:00:00'
  },
  {
    id: 3,
    scenic_name: '上海迪士尼',
    category_id: 3,
    category_name: '主题乐园',
    cover_image: 'https://picsum.photos/300/200?3',
    location: '上海',
    price: 499,
    status: 0,
    create_time: '2026-05-03 10:00:00'
  },
  {
    id: 4,
    scenic_name: '西湖',
    category_id: 1,
    category_name: '自然风光',
    cover_image: 'https://picsum.photos/300/200?4',
    location: '浙江 杭州',
    price: 0,
    status: 1,
    create_time: '2026-05-04 10:00:00'
  },
  {
    id: 5,
    scenic_name: '东方明珠',
    category_id: 4,
    category_name: '城市地标',
    cover_image: 'https://picsum.photos/300/200?5',
    location: '上海',
    price: 199,
    status: 2,
    create_time: '2026-05-05 10:00:00'
  }
]

/**
 * 获取景区列表
 */
Mock.mock(/\/admin\/scenic\/list(\?.*)?$/, 'get', (options) => {
  // 获取url参数
  const url = new URL(options.url, 'http://localhost')

  // 参数
  const categoryId = url.searchParams.get('category_id')

  const keyword = url.searchParams.get('keyword')

  const status = url.searchParams.get('status')

  const page = Number(url.searchParams.get('page')) || 1

  const size = Number(url.searchParams.get('size')) || 10

  let list = [...scenicList]

  // 分类筛选
  if (categoryId) {
    list = list.filter((item) => item.category_id === Number(categoryId))
  }

  // 搜索
  if (keyword) {
    list = list.filter((item) => item.scenic_name.includes(keyword))
  }

  // 状态筛选
  if (status !== null && status !== '') {
    list = list.filter((item) => item.status === Number(status))
  }

  // 分页
  const start = (page - 1) * size
  const end = start + size

  const pageList = list.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list: pageList,
      total: list.length,
      page,
      size
    }
  }
})

/**
 * 获取景区详情
 */
Mock.mock(/\/admin\/scenic\/detail\/\d+$/, 'get', (options) => {
  const id = Number(options.url.match(/\/detail\/(\d+)/)[1])
  const item = scenicList.find((s) => s.id === id)
  return {
    code: 200,
    message: 'success',
    data: item || null
  }
})

/**
 * 新增景区
 */
Mock.mock(/\/admin\/scenic\/add$/, 'post', (options) => {
  const body = JSON.parse(options.body)
  const newId = scenicList.length > 0 ? Math.max(...scenicList.map((s) => s.id)) + 1 : 1
  const newItem = {
    id: newId,
    scenic_name: body.scenic_name,
    category_id: body.category_id || 0,
    category_name: body.category_name || '',
    cover_image: body.cover_image || '',
    location: body.location,
    price: body.price,
    status: body.status,
    create_time: new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
  scenicList.push(newItem)
  return {
    code: 200,
    message: 'success',
    data: newItem
  }
})

/**
 * 更新景区
 */
Mock.mock(/\/admin\/scenic\/update\/\d+$/, 'put', (options) => {
  const id = Number(options.url.match(/\/update\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const index = scenicList.findIndex((s) => s.id === id)
  if (index !== -1) {
    scenicList[index] = { ...scenicList[index], ...body }
    return { code: 200, message: 'success', data: scenicList[index] }
  }
  return { code: 404, message: '景区不存在' }
})

/**
 * 删除景区
 */
Mock.mock(/\/admin\/scenic\/delete\/\d+$/, 'delete', (options) => {
  const id = Number(options.url.match(/\/delete\/(\d+)/)[1])
  const index = scenicList.findIndex((s) => s.id === id)
  if (index !== -1) {
    scenicList.splice(index, 1)
    return { code: 200, message: '删除成功' }
  }
  return { code: 404, message: '景区不存在' }
})
