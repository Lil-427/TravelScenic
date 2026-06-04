import Mock from 'mockjs'

// 模拟数据库 - 10条用户数据
const userList = [
  {
    id: 1,
    username: 'zhangsan',
    nickname: '张三',
    phone: '13800138001',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    user_type: 1,
    status: 1,
    create_time: '2026-01-15 10:30:00'
  },
  {
    id: 2,
    username: 'lisi',
    nickname: '李四',
    phone: '13800138002',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    user_type: 1,
    status: 1,
    create_time: '2026-01-20 14:22:00'
  },
  {
    id: 3,
    username: 'wangwu',
    nickname: '王五',
    phone: '13800138003',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    user_type: 1,
    status: 0,
    create_time: '2026-02-08 09:15:00'
  },
  {
    id: 4,
    username: 'zhaoliu',
    nickname: '赵六',
    phone: '13800138004',
    avatar: 'https://randomuser.me/api/portraits/women/16.jpg',
    user_type: 1,
    status: 1,
    create_time: '2026-02-14 16:45:00'
  },
  {
    id: 5,
    username: 'sunqi',
    nickname: '孙七',
    phone: '13800138005',
    avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
    user_type: 1,
    status: 0,
    create_time: '2026-02-20 11:08:00'
  },
  {
    id: 6,
    username: 'zhouba',
    nickname: '周八',
    phone: '13800138006',
    avatar: 'https://randomuser.me/api/portraits/women/18.jpg',
    user_type: 1,
    status: 1,
    create_time: '2026-03-01 08:30:00'
  },
  {
    id: 7,
    username: 'wujiu',
    nickname: '吴九',
    phone: '13800138007',
    avatar: 'https://randomuser.me/api/portraits/men/19.jpg',
    user_type: 1,
    status: 1,
    create_time: '2026-03-05 13:55:00'
  },
  {
    id: 8,
    username: 'zhengshi',
    nickname: '郑十',
    phone: '13800138008',
    avatar: 'https://randomuser.me/api/portraits/women/20.jpg',
    user_type: 1,
    status: 0,
    create_time: '2026-03-10 17:20:00'
  },
  {
    id: 9,
    username: 'chenyi',
    nickname: '陈一',
    phone: '13800138009',
    avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
    user_type: 1,
    status: 1,
    create_time: '2026-03-15 10:10:00'
  },
  {
    id: 10,
    username: 'admin',
    nickname: '系统管理员',
    phone: '13800138000',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    user_type: 2,
    status: 1,
    create_time: '2026-01-01 00:00:00'
  }
]

/**
 * 获取用户列表（支持分页、用户名筛选、手机号筛选）
 * GET /admin/user/list
 */
Mock.mock(/\/admin\/user\/list(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')

  const username = url.searchParams.get('username')
  const phone = url.searchParams.get('phone')
  const status = url.searchParams.get('status')
  const page = Number(url.searchParams.get('page')) || 1
  const size = Number(url.searchParams.get('size')) || 10

  let list = [...userList]

  // 用户名 / 手机号筛选（OR 逻辑，任一匹配即可）
  if (username || phone) {
    list = list.filter((item) => {
      let match = true
      if (username) {
        const kw = username.toLowerCase()
        match = item.username.toLowerCase().includes(kw) || item.nickname.toLowerCase().includes(kw)
      }
      if (phone) {
        match = match || item.phone.includes(phone)
      }
      return match
    })
  }

  // 状态筛选
  if (status !== null && status !== '') {
    list = list.filter((item) => item.status === Number(status))
  }

  // 分页
  const total = list.length
  const start = (page - 1) * size
  const end = start + size
  const pageList = list.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list: pageList,
      total,
      page,
      size
    }
  }
})

/**
 * 更新用户状态
 * PUT /admin/user/update/status
 */
Mock.mock(/\/admin\/user\/update\/status$/, 'put', (options) => {
  const body = JSON.parse(options.body)
  const { id, status } = body

  const index = userList.findIndex((item) => item.id === id)

  if (index !== -1) {
    userList[index].status = status
    return {
      code: 200,
      message: '状态更新成功',
      data: null
    }
  }

  return {
    code: 404,
    message: '用户不存在'
  }
})

