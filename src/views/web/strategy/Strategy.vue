<!-- views/web/strategy/strategy.vue -->
<template>
  <div class="strategy-page">
    <div class="page-container" :style="{ backgroundImage: 'url(' + bgImage + ')' }">
      <div class="page-header">
        <div class="title-section">
          <div class="title-with-bar">
            <span class="vertical-bar"></span>
            <h1>旅游攻略</h1>
          </div>
          <p>发现旅行灵感，让每一次出发都更有意义</p>
        </div>

        <div class="header-search">
          <el-icon class="search-icon"><Search /></el-icon>
          <input
            type="text"
            placeholder="搜索攻略、目的地或关键词..."
            v-model="keyword"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch">搜索</button>
        </div>
      </div>

      <div class="main-content">
        <aside class="sidebar">
          <div class="category-list">
            <div
              v-for="cat in categories"
              :key="cat.id"
              :class="['category-item', { active: currentCategory === cat.id }]"
              @click="handleCategoryChange(cat.id)"
            >
              <div class="cat-left">
                <el-icon
                  class="cat-icon"
                  :style="{ color: currentCategory === cat.id ? '#1ec58b' : cat.color }"
                >
                  <component :is="cat.icon" />
                </el-icon>
                <span class="cat-name">{{ cat.name }}</span>
              </div>
              <span class="cat-count">{{ cat.count }}</span>
            </div>
          </div>
        </aside>

        <div class="right-panel">
          <div class="sort-header">
            <div class="sort-tabs">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                :class="['sort-tab', { active: currentSort === option.value }]"
                @click="handleSortChange(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
            <div class="total-count-pill">
              <el-icon><Document /></el-icon>
              共 {{ totalCount }} 篇攻略
            </div>
          </div>

          <!-- 使用攻略列表组件 -->
          <StrategyList :strategies="paginatedStrategies" />

          <div class="pagination-wrapper" v-if="totalPages > 1">
            <button class="page-btn prev" :disabled="currentPage === 1" @click="currentPage--">
              <el-icon><ArrowLeft /></el-icon>
            </button>

            <button
              v-if="totalPages > 5 && currentPage > 3"
              class="page-btn"
              @click="currentPage = 1"
            >
              1
            </button>
            <button v-if="totalPages > 5 && currentPage > 4" class="page-btn-dots">...</button>

            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['page-btn', { active: currentPage === page }]"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button v-if="totalPages > 5 && currentPage < totalPages - 3" class="page-btn-dots">
              ...
            </button>
            <button
              v-if="totalPages > 5 && currentPage < totalPages - 2"
              class="page-btn"
              @click="currentPage = totalPages"
            >
              {{ totalPages }}
            </button>

            <button
              class="page-btn next"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>

            <div class="page-size-selector">
              {{ pageSize }}条/页 <el-icon><ArrowDown /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Search,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Document,
  Menu,
  MapLocation,
  Sunny,
  Dessert,
  Flag,
  Coffee
} from '@element-plus/icons-vue'
import bgImage from '@/assets/categoriy-bg.png'
import StrategyList from '@/components/strategy/StrategyList.vue'

const currentCategory = ref('all')
const currentSort = ref('hot')
const keyword = ref('')
const currentPage = ref(1)
const pageSize = 6

// 分类数据
const categories = ref([
  { id: 'all', name: '全部攻略', icon: Menu, color: '#1ec58b', count: 24 },
  { id: 'destination', name: '目的地', icon: MapLocation, color: '#2196f3', count: 8 },
  { id: 'food', name: '美食', icon: Dessert, color: '#ff9800', count: 5 },
  { id: 'route', name: '路线规划', icon: Flag, color: '#4caf50', count: 6 },
  { id: 'tips', name: '实用贴士', icon: Sunny, color: '#f44336', count: 3 },
  { id: 'culture', name: '文化体验', icon: Coffee, color: '#9c27b0', count: 2 }
])

// 排序选项
const sortOptions = [
  { value: 'hot', label: '热门推荐' },
  { value: 'new', label: '最新发布' },
  { value: 'views', label: '最多阅读' },
  { value: 'likes', label: '最多点赞' }
]

// 攻略数据（丰富到24篇）
const strategies = ref([
  {
    id: 1,
    title: '九寨沟四季游玩全攻略，每个季节都有不同的美',
    summary:
      '九寨沟被誉为"人间仙境"，四季景色各异。春季山花烂漫，夏季绿树成荫，秋季彩林斑斓，冬季银装素裹...',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format',
    category: 'destination',
    categoryName: '目的地',
    views: 23456,
    likes: 1890,
    comments: 234,
    createTime: '2025-01-15'
  },
  {
    id: 2,
    title: '杭州西湖三日游最佳路线，看完这篇就够了',
    summary:
      '西湖、灵隐寺、宋城、龙井村...三天时间怎么玩最合理？这份攻略带你深度游杭州，不走回头路...',
    cover: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format',
    category: 'route',
    categoryName: '路线规划',
    views: 18920,
    likes: 1560,
    comments: 189,
    createTime: '2025-01-10'
  },
  {
    id: 3,
    title: '张家界自由行攻略，门票交通住宿全解析',
    summary:
      '张家界国家森林公园、天门山、大峡谷玻璃桥...详细的门票价格、交通方式、住宿推荐，一篇搞定...',
    cover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format',
    category: 'tips',
    categoryName: '实用贴士',
    views: 31200,
    likes: 2780,
    comments: 456,
    createTime: '2025-01-05'
  },
  {
    id: 4,
    title: '北京必吃美食清单，从宫廷菜到胡同小吃',
    summary:
      '烤鸭、涮羊肉、炸酱面、豆汁焦圈...这份北京美食地图带你吃遍京城，本地人推荐的宝藏店铺...',
    cover: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=600&auto=format',
    category: 'food',
    categoryName: '美食',
    views: 45678,
    likes: 4230,
    comments: 567,
    createTime: '2024-12-28'
  },
  {
    id: 5,
    title: '乌镇深度游攻略，感受江南水乡的慢生活',
    summary: '东栅看人文，西栅赏夜景，住进百年老宅，体验蓝印花布制作，清晨的小桥流水最治愈...',
    cover: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=600&auto=format',
    category: 'destination',
    categoryName: '目的地',
    views: 21000,
    likes: 1980,
    comments: 234,
    createTime: '2024-12-20'
  },
  {
    id: 6,
    title: '云南丽江大理七天环线攻略，自由行必备',
    summary: '丽江古城、玉龙雪山、大理洱海、喜洲古镇、双廊...详细的环线规划，交通住宿美食全包含...',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format',
    category: 'route',
    categoryName: '路线规划',
    views: 34560,
    likes: 2890,
    comments: 345,
    createTime: '2024-12-15'
  },
  {
    id: 7,
    title: '故宫600年历史文化之旅，这些细节别错过',
    summary: '除了中轴线，故宫还有哪些隐秘的角落？了解背后的历史故事，让参观更有意义...',
    cover: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=600&auto=format',
    category: 'culture',
    categoryName: '文化体验',
    views: 27890,
    likes: 2340,
    comments: 234,
    createTime: '2024-12-10'
  },
  {
    id: 8,
    title: '三亚亚龙湾度假攻略，阳光沙滩比基尼',
    summary: '天下第一湾，七千米银白色沙滩，碧海蓝天椰风海韵，周边酒店和美食推荐...',
    cover: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600&auto=format',
    category: 'destination',
    categoryName: '目的地',
    views: 19876,
    likes: 1650,
    comments: 189,
    createTime: '2024-12-05'
  },
  {
    id: 9,
    title: '成都美食地图，本地人推荐的20家苍蝇馆子',
    summary: '火锅、串串、担担面、夫妻肺片...跟着本地人吃遍成都，这些藏在巷子里的美食才是精髓...',
    cover: 'https://images.unsplash.com/photo-1505751172876-fa1f2c8f6c8c?q=80&w=600&auto=format',
    category: 'food',
    categoryName: '美食',
    views: 38900,
    likes: 3450,
    comments: 678,
    createTime: '2024-11-28'
  },
  {
    id: 10,
    title: '黄山看日出攻略，最佳观景点和住宿推荐',
    summary:
      '黄山日出被誉为天下第一奇观，光明顶、始信峰、排云亭...哪个观景点最好？这篇攻略告诉你...',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format',
    category: 'tips',
    categoryName: '实用贴士',
    views: 26780,
    likes: 2100,
    comments: 267,
    createTime: '2024-11-20'
  },
  {
    id: 11,
    title: '厦门鼓浪屿两天一夜，文艺小资必去',
    summary:
      '鼓浪屿、曾厝垵、环岛路、厦门大学...两天时间如何玩转厦门？这篇攻略带你打卡所有精华景点...',
    cover: 'https://images.unsplash.com/photo-1558611848-73f7f5f33e2e?q=80&w=600&auto=format',
    category: 'destination',
    categoryName: '目的地',
    views: 22340,
    likes: 1870,
    comments: 198,
    createTime: '2024-11-15'
  },
  {
    id: 12,
    title: '西藏高原旅行注意事项，第一次进藏必读',
    summary: '高原反应怎么办？需要准备什么？哪些地方值得去？这篇攻略帮你做好充分的进藏准备...',
    cover: 'https://images.unsplash.com/photo-1468413253725-8c4c5f1e9a8e?q=80&w=600&auto=format',
    category: 'tips',
    categoryName: '实用贴士',
    views: 45600,
    likes: 3890,
    comments: 523,
    createTime: '2024-11-10'
  },
  {
    id: 13,
    title: '桂林阳朔自由行，山水甲天下深度游',
    summary: '漓江竹筏、遇龙河漂流、西街夜市、银子岩溶洞...桂林阳朔三天两晚详细行程...',
    cover: 'https://images.unsplash.com/photo-1551634979-2b11f8c946fe?q=80&w=600&auto=format',
    category: 'route',
    categoryName: '路线规划',
    views: 18900,
    likes: 1560,
    comments: 189,
    createTime: '2024-11-05'
  },
  {
    id: 14,
    title: '西安历史文化之旅，穿越十三朝古都',
    summary: '兵马俑、大雁塔、回民街、古城墙...感受千年古都的魅力，这份攻略带你玩转西安...',
    cover: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=600&auto=format',
    category: 'culture',
    categoryName: '文化体验',
    views: 23450,
    likes: 1980,
    comments: 234,
    createTime: '2024-10-28'
  },
  {
    id: 15,
    title: '青岛啤酒海鲜攻略，夏天就该去海边',
    summary:
      '栈桥、八大关、崂山、金沙滩...青岛的美食美景，喝啤酒吃蛤蜊，这才是夏天的正确打开方式...',
    cover: 'https://images.unsplash.com/photo-1559827260-4c9777f4e9b3?q=80&w=600&auto=format',
    category: 'food',
    categoryName: '美食',
    views: 21230,
    likes: 1760,
    comments: 212,
    createTime: '2024-10-20'
  },
  {
    id: 16,
    title: '新疆自驾游攻略，独库公路全记录',
    summary:
      '独库公路、那拉提草原、赛里木湖、喀纳斯...新疆最美的风景都在路上，这份自驾攻略请收好...',
    cover: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?q=80&w=600&auto=format',
    category: 'route',
    categoryName: '路线规划',
    views: 56700,
    likes: 4980,
    comments: 678,
    createTime: '2024-10-15'
  },
  {
    id: 17,
    title: '日本关西七日游，大阪京都奈良全攻略',
    summary: '环球影城、心斋桥、清水寺、伏见稻荷大社、奈良小鹿...第一次去关西看这篇就够了...',
    cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format',
    category: 'destination',
    categoryName: '目的地',
    views: 78900,
    likes: 6540,
    comments: 789,
    createTime: '2024-10-10'
  },
  {
    id: 18,
    title: '省钱旅游攻略，学生党也能玩得嗨',
    summary: '青旅住宿、淡季出行、特价机票、穷游神器...教你用最少的钱看最美的风景...',
    cover: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=600&auto=format',
    category: 'tips',
    categoryName: '实用贴士',
    views: 34560,
    likes: 2890,
    comments: 456,
    createTime: '2024-10-05'
  },
  {
    id: 19,
    title: '冬季滑雪攻略，国内最佳滑雪场推荐',
    summary: '长白山、亚布力、崇礼、神农架...国内顶级滑雪场对比，新手入门到高手进阶全都有...',
    cover: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=600&auto=format',
    category: 'destination',
    categoryName: '目的地',
    views: 19870,
    likes: 1650,
    comments: 198,
    createTime: '2024-09-28'
  },
  {
    id: 20,
    title: '泰国海岛攻略，普吉苏梅甲米怎么选',
    summary: '普吉岛热闹、苏梅岛高端、甲米宁静...哪个海岛最适合你？这篇攻略帮你做选择...',
    cover: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=600&auto=format',
    category: 'destination',
    categoryName: '目的地',
    views: 45670,
    likes: 3980,
    comments: 567,
    createTime: '2024-09-20'
  }
])

// 筛选逻辑
const filteredStrategies = computed(() => {
  let result = [...strategies.value]

  // 分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter((item) => item.category === currentCategory.value)
  }

  // 关键词搜索
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    result = result.filter(
      (item) => item.title.toLowerCase().includes(kw) || item.summary.toLowerCase().includes(kw)
    )
  }

  // 排序
  switch (currentSort.value) {
    case 'new':
      result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      break
    case 'views':
      result.sort((a, b) => b.views - a.views)
      break
    case 'likes':
      result.sort((a, b) => b.likes - a.likes)
      break
    case 'hot':
    default:
      result.sort((a, b) => b.views - a.views)
      break
  }

  return result
})

// 更新各分类的数量
const updateCategoryCounts = () => {
  const allStrategies = strategies.value
  categories.value.forEach((cat) => {
    if (cat.id === 'all') {
      cat.count = allStrategies.length
    } else {
      cat.count = allStrategies.filter((s) => s.category === cat.id).length
    }
  })
}
updateCategoryCounts()

const totalCount = computed(() => filteredStrategies.value.length)
const totalPages = computed(() => Math.ceil(filteredStrategies.value.length / pageSize))

const paginatedStrategies = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredStrategies.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i)
    }
  }
  return pages
})

const handleCategoryChange = (id) => {
  currentCategory.value = id
  currentPage.value = 1
}

const handleSortChange = (value) => {
  currentSort.value = value
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}
</script>

<style scoped>
.strategy-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7f9;
}

.page-container {
  width: 100%;
  min-height: 100vh;
  background-image: v-bind('`url(${bgImage})`');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: scroll;
  padding-top: 20px;
  padding-bottom: 60px;
}

.page-header {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 40px 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.title-section {
  display: flex;
  flex-direction: column;
}

.title-with-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vertical-bar {
  width: 6px;
  height: 24px;
  background-color: #1ec58b;
  border-radius: 4px;
}

.title-with-bar h1 {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.title-section p {
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 18px;
}

.header-search {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 10px;
  width: 440px;
  height: 48px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.search-icon {
  margin-left: 16px;
  margin-right: 12px;
  color: #999;
  font-size: 18px;
}

.header-search input {
  flex: 1;
  border: none;
  outline: none;
  height: 100%;
  font-size: 14px;
  background: transparent;
}

.header-search input::placeholder {
  color: #b8c5d0;
}

.header-search button {
  height: 100%;
  padding: 0 32px;
  background-color: #1ec58b;
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.main-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  gap: 24px;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
  height: fit-content;
}

.category-list {
  display: flex;
  flex-direction: column;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  margin-bottom: 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: #f5f7f9;
}

.category-item.active {
  background: #f0fdf6;
}

.cat-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cat-icon {
  font-size: 18px;
}

.cat-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.category-item.active .cat-name {
  color: #1ec58b;
}

.cat-count {
  font-size: 14px;
  color: #999;
}

.right-panel {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
}

.sort-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.sort-tabs {
  display: flex;
  gap: 32px;
}

.sort-tab {
  background: none;
  border: none;
  font-size: 15px;
  color: #555;
  cursor: pointer;
  padding: 6px 0;
  position: relative;
  transition: color 0.3s;
}

.sort-tab:hover {
  color: #1ec58b;
}

.sort-tab.active {
  color: #1ec58b;
  font-weight: 600;
}

.sort-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 20%;
  width: 60%;
  height: 3px;
  background-color: #1ec58b;
  border-radius: 2px;
}

.total-count-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf6;
  color: #1ec58b;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  gap: 8px;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 38px;
  height: 38px;
  background: white;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: #1ec58b;
  color: #1ec58b;
}

.page-btn.active {
  background: #1ec58b;
  border-color: #1ec58b;
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn-dots {
  background: transparent;
  border: none;
  color: #999;
  font-weight: bold;
  padding: 0 4px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  margin-left: 8px;
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  .header-search {
    width: 100%;
  }
  .sort-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
