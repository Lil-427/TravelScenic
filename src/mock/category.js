import Mock from 'mockjs'

// 模拟数据库 - 15条数据
let categoryList = [
  {
    id: 1,
    category_name: '自然景观',
    description: '山川湖海、森林草原等自然风光',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    sort_order: 1,
    status: 1
  },
  {
    id: 2,
    category_name: '历史古迹',
    description: '文化遗产、古建筑、历史遗址',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2231/2231430.png',
    sort_order: 2,
    status: 1
  },
  {
    id: 3,
    category_name: '主题乐园',
    description: '游乐园、水上乐园、亲子乐园',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2948/2948552.png',
    sort_order: 3,
    status: 1
  },
  {
    id: 4,
    category_name: '博物馆',
    description: '艺术博物馆、科技馆、纪念馆',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2648/2648765.png',
    sort_order: 4,
    status: 1
  },
  {
    id: 5,
    category_name: '宗教圣地',
    description: '寺庙、教堂、道观等宗教场所',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3125/3125788.png',
    sort_order: 5,
    status: 0
  },
  {
    id: 6,
    category_name: '城市风光',
    description: '城市地标、夜景、商业街区',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2982/2982488.png',
    sort_order: 6,
    status: 1
  },
  {
    id: 7,
    category_name: '海滨度假',
    description: '沙滩、海岛、海滨浴场',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/1077/1077034.png',
    sort_order: 7,
    status: 1
  },
  {
    id: 8,
    category_name: '温泉养生',
    description: '温泉度假村、SPA会所',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2998/2998196.png',
    sort_order: 8,
    status: 0
  },
  {
    id: 9,
    category_name: '滑雪场',
    description: '冬季运动、滑雪度假村',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3050/3050165.png',
    sort_order: 9,
    status: 1
  },
  {
    id: 10,
    category_name: '古镇村落',
    description: '古镇、民俗村、特色小镇',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2672/2672671.png',
    sort_order: 10,
    status: 1
  },
  {
    id: 11,
    category_name: '动物园',
    description: '野生动物园、水族馆',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3835/3835686.png',
    sort_order: 11,
    status: 1
  },
  {
    id: 12,
    category_name: '植物园',
    description: '植物观赏、花卉展览',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2524/2524942.png',
    sort_order: 12,
    status: 0
  },
  {
    id: 13,
    category_name: '峡谷探险',
    description: '峡谷、瀑布、徒步路线',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3469/3469225.png',
    sort_order: 13,
    status: 1
  },
  {
    id: 14,
    category_name: '露营基地',
    description: '户外露营、帐篷酒店',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2885/2885456.png',
    sort_order: 14,
    status: 1
  },
  {
    id: 15,
    category_name: '摄影基地',
    description: '网红打卡地、摄影外景',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2695/2695919.png',
    sort_order: 15,
    status: 1
  }
]

/**
 * 获取列表（支持分页、搜索、状态筛选）
 */
Mock.mock(/\/admin\/category\/list/, 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: categoryList
  }
})
/**
 * 获取详情
 */
Mock.mock(/\/admin\/category\/detail\/\d+/, 'get', (options) => {
  const id = Number(options.url.split('/').pop())

  const detail = categoryList.find((item) => item.id === id)

  if (detail) {
    return {
      code: 200,
      message: 'success',
      data: detail
    }
  } else {
    return {
      code: 404,
      message: '分类不存在'
    }
  }
})

/**
 * 添加分类
 */
Mock.mock(/\/admin\/category\/add/, 'post', (options) => {
  const body = JSON.parse(options.body)

  // 获取最大 sort_order
  const maxSort = Math.max(...categoryList.map((item) => item.sort_order), 0)

  const newItem = {
    id: Date.now(),
    category_name: body.category_name,
    description: body.description || '',
    icon_url: body.icon_url || '',
    sort_order: body.sort_order || maxSort + 1,
    status: body.status !== undefined ? body.status : 1
  }

  categoryList.push(newItem)

  return {
    code: 200,
    message: '添加成功',
    data: {
      id: newItem.id
    }
  }
})

/**
 * 编辑分类
 */
Mock.mock(/\/admin\/category\/update\/\d+/, 'put', (options) => {
  const id = Number(options.url.split('/').pop())
  const body = JSON.parse(options.body)

  const index = categoryList.findIndex((item) => item.id === id)

  if (index !== -1) {
    categoryList[index] = {
      ...categoryList[index],
      ...body
    }
    return {
      code: 200,
      message: '修改成功'
    }
  } else {
    return {
      code: 404,
      message: '分类不存在'
    }
  }
})

/**
 * 删除分类
 */
Mock.mock(/\/admin\/category\/delete\/\d+/, 'delete', (options) => {
  const id = Number(options.url.split('/').pop())

  const index = categoryList.findIndex((item) => item.id === id)

  if (index !== -1) {
    categoryList.splice(index, 1)
    return {
      code: 200,
      message: '删除成功'
    }
  } else {
    return {
      code: 404,
      message: '分类不存在'
    }
  }
})
