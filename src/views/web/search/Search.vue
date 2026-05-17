<!-- views/web/search/Search.vue -->
<template>
  <div class="search-page-container">
    <!-- 顶部 Hero 区域 -->
    <section class="hero-section">
      <h1 class="hero-title">遇见美好，探索世界</h1>
      <p class="hero-subtitle">搜索景点或攻略，开启你的旅行灵感</p>

      <div class="search-bar-wrap">
        <el-input
          v-model="searchKey"
          placeholder="搜索景点或攻略..."
          class="capsule-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
        </el-input>
        <button class="hero-search-btn" @click="handleSearch">搜索</button>
      </div>
    </section>

    <!-- 主体布局区域 -->
    <div class="main-layout">
      <!-- 左侧：侧边栏 -->
      <aside class="sidebar">
        <div class="side-card">
          <div class="card-header">
            <span class="title">搜索历史</span>
            <span class="action" @click="clearHistory">
              <el-icon><Delete /></el-icon> 清空
            </span>
          </div>
          <ul class="history-list">
            <li v-for="h in searchHistory" :key="h" @click="handleHistoryClick(h)">
              <div class="left">
                <el-icon><Clock /></el-icon> {{ h }}
              </div>
              <el-icon class="close-x" @click.stop="removeHistory(h)"><Close /></el-icon>
            </li>
            <li v-if="searchHistory.length === 0" class="empty-history">暂无搜索历史</li>
          </ul>
        </div>

        <div class="side-card mt-20">
          <div class="card-header">
            <span class="title">热门搜索</span>
          </div>
          <div class="hot-tags">
            <span v-for="tag in hotTags" :key="tag" class="tag-pill" @click="handleTagClick(tag)">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="reserved-banner-area mt-20">
          <img :src="searchImage" alt="search" class="banner-image" />
        </div>
      </aside>

      <!-- 右侧：主结果卡片 -->
      <main class="content-card">
        <div class="content-header">
          <div class="tabs">
            <span
              :class="['tab-item', { active: activeTab === 'spot' }]"
              @click="handleTabChange('spot')"
            >
              景点
              <span class="tab-count">{{ spotTotal }}</span>
            </span>
            <span
              :class="['tab-item', { active: activeTab === 'strategy' }]"
              @click="handleTabChange('strategy')"
            >
              攻略
              <span class="tab-count">{{ strategyTotal }}</span>
            </span>
          </div>
        </div>

        <div class="result-stats-bar">
          <span class="stats-text">
            为您找到 {{ currentTotal }} 个相关{{ activeTab === 'spot' ? '景点' : '攻略' }}
          </span>
          <div class="sort-dropdown" @click="toggleSort">
            综合排序 <el-icon><ArrowDown /></el-icon>
          </div>
        </div>

        <!-- 景点列表 - 一行3个 -->
        <div class="spot-grid" v-if="activeTab === 'spot'">
          <SpotCard v-for="item in paginatedSpots" :key="item.id" :data="item" />
          <div v-if="paginatedSpots.length === 0" class="empty-state">
            <div class="empty-icon">🏝️</div>
            <p>暂无相关景点</p>
          </div>
        </div>

        <!-- 攻略列表 - 一行3个 -->
        <div class="strategy-grid" v-if="activeTab === 'strategy'">
          <StrategyCard v-for="item in paginatedStrategies" :key="item.id" :data="item" />
          <div v-if="paginatedStrategies.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <p>暂无相关攻略</p>
          </div>
        </div>

        <!-- 优雅的分页组件 -->
        <div class="pagination-wrapper" v-if="currentTotal > pageSize">
          <button class="page-btn prev" :disabled="currentPage === 1" @click="currentPage--">
            <el-icon><ArrowLeft /></el-icon>
          </button>

          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['page-num', { active: currentPage === page }]"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="page-btn next"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <el-icon><ArrowRight /></el-icon>
          </button>

          <div class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Search,
  Delete,
  Clock,
  Close,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
import searchImage from '@/assets/search.png'
import SpotCard from '@/components/spot/SpotCard.vue'
import StrategyCard from '@/components/strategy/StrategyCard.vue'

// 搜索关键词
const searchKey = ref('')
const activeTab = ref('spot')
const currentPage = ref(1)
const pageSize = 6 // 一行3个，共两行 = 6个

// 搜索历史
const searchHistory = ref(['三亚', '九寨沟', '西湖', '张家界', '故宫'])

// 热门搜索标签
const hotTags = ref([
  '九寨沟',
  '张家界',
  '西湖',
  '三亚',
  '桂林',
  '故宫',
  '黄山',
  '丽江',
  '成都',
  '厦门',
  '大理',
  '哈尔滨'
])

// ==================== 景点原始数据 ====================
const spotsRawData = ref([
  {
    id: 1,
    name: '三亚亚龙湾',
    image: 'https://picsum.photos/400/300?random=1',
    rating: 4.7,
    province: '海南',
    city: '三亚',
    description: '碧海蓝天，细沙白浪，度假天堂。',
    minPrice: 399
  },
  {
    id: 2,
    name: '九寨沟',
    image: 'https://picsum.photos/400/300?random=2',
    rating: 4.9,
    province: '四川',
    city: '阿坝',
    description: '人间仙境，童话世界，四季皆美。',
    minPrice: 580
  },
  {
    id: 3,
    name: '西湖',
    image: 'https://picsum.photos/400/300?random=3',
    rating: 4.6,
    province: '浙江',
    city: '杭州',
    description: '欲把西湖比西子，淡妆浓抹总相宜。',
    minPrice: 0
  },
  {
    id: 4,
    name: '张家界',
    image: 'https://picsum.photos/400/300?random=4',
    rating: 4.8,
    province: '湖南',
    city: '张家界',
    description: '奇峰三千，秀水八百，阿凡达取景地。',
    minPrice: 450
  },
  {
    id: 5,
    name: '故宫博物院',
    image: 'https://picsum.photos/400/300?random=5',
    rating: 4.8,
    province: '北京',
    city: '北京',
    description: '皇家宫殿，六百年历史，世界文化遗产。',
    minPrice: 60
  },
  {
    id: 6,
    name: '桂林漓江',
    image: 'https://picsum.photos/400/300?random=6',
    rating: 4.7,
    province: '广西',
    city: '桂林',
    description: '桂林山水甲天下，漓江山水甲桂林。',
    minPrice: 220
  },
  {
    id: 7,
    name: '黄山',
    image: 'https://picsum.photos/400/300?random=7',
    rating: 4.9,
    province: '安徽',
    city: '黄山',
    description: '五岳归来不看山，黄山归来不看岳。',
    minPrice: 190
  },
  {
    id: 8,
    name: '丽江古城',
    image: 'https://picsum.photos/400/300?random=8',
    rating: 4.5,
    province: '云南',
    city: '丽江',
    description: '小桥流水，纳西文化，艳遇之都。',
    minPrice: 0
  },
  {
    id: 9,
    name: '成都大熊猫基地',
    image: 'https://picsum.photos/400/300?random=9',
    rating: 4.8,
    province: '四川',
    city: '成都',
    description: '看国宝大熊猫，萌化你的心。',
    minPrice: 55
  },
  {
    id: 10,
    name: '厦门鼓浪屿',
    image: 'https://picsum.photos/400/300?random=10',
    rating: 4.6,
    province: '福建',
    city: '厦门',
    description: '万国建筑博览，文艺小清新圣地。',
    minPrice: 35
  },
  {
    id: 11,
    name: '大理洱海',
    image: 'https://picsum.photos/400/300?random=11',
    rating: 4.7,
    province: '云南',
    city: '大理',
    description: '苍山洱海，风花雪月。',
    minPrice: 0
  },
  {
    id: 12,
    name: '哈尔滨冰雪大世界',
    image: 'https://picsum.photos/400/300?random=12',
    rating: 4.7,
    province: '黑龙江',
    city: '哈尔滨',
    description: '冰雪奇缘，童话世界。',
    minPrice: 330
  }
])

// ==================== 攻略原始数据 ====================
const strategiesRawData = ref([
  {
    id: 1,
    title: '九寨沟四季游玩全攻略，每个季节都有不同的美',
    summary: '九寨沟被誉为"人间仙境"，四季景色各异...',
    cover: 'https://picsum.photos/400/300?random=101',
    categoryName: '目的地',
    views: 23456,
    likes: 1890,
    favorites: 234,
    createTime: '2025-01-15'
  },
  {
    id: 2,
    title: '杭州西湖三日游最佳路线，看完这篇就够了',
    summary: '西湖、灵隐寺、宋城、龙井村...三天时间怎么玩最合理？',
    cover: 'https://picsum.photos/400/300?random=102',
    categoryName: '路线规划',
    views: 18920,
    likes: 1560,
    favorites: 189,
    createTime: '2025-01-10'
  },
  {
    id: 3,
    title: '张家界自由行攻略，门票交通住宿全解析',
    summary: '张家界国家森林公园、天门山、大峡谷玻璃桥...',
    cover: 'https://picsum.photos/400/300?random=103',
    categoryName: '实用贴士',
    views: 31200,
    likes: 2780,
    favorites: 456,
    createTime: '2025-01-05'
  },
  {
    id: 4,
    title: '北京必吃美食清单，从宫廷菜到胡同小吃',
    summary: '烤鸭、涮羊肉、炸酱面、豆汁焦圈...',
    cover: 'https://picsum.photos/400/300?random=104',
    categoryName: '美食',
    views: 45678,
    likes: 4230,
    favorites: 567,
    createTime: '2024-12-28'
  },
  {
    id: 5,
    title: '乌镇深度游攻略，感受江南水乡的慢生活',
    summary: '东栅看人文，西栅赏夜景，住进百年老宅...',
    cover: 'https://picsum.photos/400/300?random=105',
    categoryName: '目的地',
    views: 21000,
    likes: 1980,
    favorites: 234,
    createTime: '2024-12-20'
  },
  {
    id: 6,
    title: '云南丽江大理七天环线攻略，自由行必备',
    summary: '丽江古城、玉龙雪山、大理洱海、喜洲古镇...',
    cover: 'https://picsum.photos/400/300?random=106',
    categoryName: '路线规划',
    views: 34560,
    likes: 2890,
    favorites: 345,
    createTime: '2024-12-15'
  },
  {
    id: 7,
    title: '青岛啤酒海鲜攻略，夏天就该去海边',
    summary: '栈桥、八大关、崂山、金沙滩...青岛的美食美景',
    cover: 'https://picsum.photos/400/300?random=107',
    categoryName: '美食',
    views: 21230,
    likes: 1760,
    favorites: 212,
    createTime: '2024-10-20'
  },
  {
    id: 8,
    title: '新疆自驾游攻略，独库公路全记录',
    summary: '独库公路、那拉提草原、赛里木湖、喀纳斯...',
    cover: 'https://picsum.photos/400/300?random=108',
    categoryName: '路线规划',
    views: 56700,
    likes: 4980,
    favorites: 678,
    createTime: '2024-10-15'
  }
])

// ==================== 数据适配 ====================

const adaptedSpots = computed(() => {
  return spotsRawData.value.map((spot) => ({
    id: spot.id,
    name: spot.name,
    image: spot.image,
    score: spot.rating,
    desc: spot.description,
    city: spot.city,
    price: spot.minPrice
  }))
})

const adaptedStrategies = computed(() => {
  return strategiesRawData.value.map((strategy) => ({
    id: strategy.id,
    title: strategy.title,
    cover: strategy.cover,
    summary: strategy.summary,
    likes: strategy.likes,
    favorites: strategy.favorites,
    createTime: strategy.createTime
  }))
})

// ==================== 搜索和筛选 ====================

const filteredSpots = computed(() => {
  if (!searchKey.value.trim()) return adaptedSpots.value
  const kw = searchKey.value.trim().toLowerCase()
  return adaptedSpots.value.filter(
    (spot) =>
      spot.name.toLowerCase().includes(kw) ||
      spot.desc.toLowerCase().includes(kw) ||
      spot.city.toLowerCase().includes(kw)
  )
})

const filteredStrategies = computed(() => {
  if (!searchKey.value.trim()) return adaptedStrategies.value
  const kw = searchKey.value.trim().toLowerCase()
  return adaptedStrategies.value.filter(
    (strategy) =>
      strategy.title.toLowerCase().includes(kw) || strategy.summary.toLowerCase().includes(kw)
  )
})

const spotTotal = computed(() => filteredSpots.value.length)
const strategyTotal = computed(() => filteredStrategies.value.length)
const currentTotal = computed(() =>
  activeTab.value === 'spot' ? spotTotal.value : strategyTotal.value
)
const totalPages = computed(() => Math.ceil(currentTotal.value / pageSize))

// 分页数据
const paginatedSpots = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredSpots.value.slice(start, start + pageSize)
})

const paginatedStrategies = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredStrategies.value.slice(start, start + pageSize)
})

// 显示的页码
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

// 切换 Tab 时重置页码
const handleTabChange = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
}

// 搜索时重置页码
const handleSearch = () => {
  if (searchKey.value.trim()) {
    const newHistory = searchHistory.value.filter((h) => h !== searchKey.value.trim())
    newHistory.unshift(searchKey.value.trim())
    searchHistory.value = newHistory.slice(0, 10)
  }
  currentPage.value = 1
}

const handleHistoryClick = (keyword) => {
  searchKey.value = keyword
  handleSearch()
}

const handleTagClick = (tag) => {
  searchKey.value = tag
  handleSearch()
}

const clearHistory = () => {
  searchHistory.value = []
}

const removeHistory = (item) => {
  searchHistory.value = searchHistory.value.filter((h) => h !== item)
}

const toggleSort = () => {
  alert('排序功能开发中')
}
</script>

<style scoped>
.search-page-container {
  min-height: 100vh;
  background: #f1f6f5;
  background-image: radial-gradient(at top right, #e0f0e9 0%, transparent 40%);
  padding-bottom: 60px;
}

.hero-section {
  text-align: center;
  padding: 80px 0 60px;
}

.hero-title {
  font-size: 34px;
  color: #1a1a1a;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 15px;
  color: #8c93a1;
  margin-bottom: 40px;
}

.search-bar-wrap {
  display: flex;
  align-items: center;
  width: 680px;
  margin: 0 auto;
  background: #fff;
  height: 58px;
  border-radius: 30px;
  padding: 0 8px 0 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.capsule-input {
  flex: 1;
}

:deep(.capsule-input .el-input__wrapper) {
  box-shadow: none !important;
  font-size: 16px;
}

.hero-search-btn {
  background: #18b57d;
  color: #fff;
  border: none;
  height: 44px;
  padding: 0 35px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.hero-search-btn:hover {
  background: #149b71;
}

.main-layout {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  gap: 25px;
  padding: 0 20px;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
}

.side-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header .title {
  font-weight: 700;
  color: #1a1a1a;
}

.card-header .action {
  font-size: 13px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-header .action:hover {
  color: #18b57d;
}

.history-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 14px;
  color: #5c616f;
  cursor: pointer;
  border-bottom: 1px solid #f5f7f9;
}

.history-list li:last-child {
  border-bottom: none;
}

.history-list li .left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8c93a1;
}

.history-list li:hover .left {
  color: #18b57d;
}

.close-x {
  color: #cbd5e0;
  font-size: 14px;
  cursor: pointer;
}

.close-x:hover {
  color: #ff6a3c;
}

.empty-history {
  color: #cbd5e0;
  text-align: center;
  padding: 20px 0;
  cursor: default;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-pill {
  padding: 6px 14px;
  background: #f5f7f9;
  border-radius: 20px;
  font-size: 13px;
  color: #5c616f;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-pill:hover {
  background: #e8f5f0;
  color: #18b57d;
}

.reserved-banner-area {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.banner-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.3s;
}

.banner-image:hover {
  transform: scale(1.02);
}

.content-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.content-header {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 25px;
}

.tab-item {
  display: inline-block;
  padding: 0 10px 15px;
  margin-right: 40px;
  font-size: 16px;
  color: #5c616f;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #18b57d;
  font-weight: 700;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #18b57d;
  border-radius: 2px;
}

.tab-count {
  margin-left: 6px;
  padding: 0 6px;
  background: #f0f2f5;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 400;
}

.tab-item.active .tab-count {
  background: #e8f8f2;
  color: #18b57d;
}

.result-stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.stats-text {
  font-size: 14px;
  color: #8c93a1;
}

.sort-dropdown {
  font-size: 14px;
  color: #5c616f;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.2s;
}

.sort-dropdown:hover {
  color: #18b57d;
  background: #f0fdf6;
}

/* 景点网格 - 一行3个 */
.spot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 攻略网格 - 一行3个 */
.strategy-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 空状态 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.4;
}

.empty-state p {
  color: #8a94a6;
  font-size: 14px;
}

/* ==================== 优雅的分页样式 ==================== */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  color: #5c616f;
}

.page-btn:hover:not(:disabled) {
  border-color: #18b57d;
  color: #18b57d;
  background: #f0fdf6;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-num {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  color: #5c616f;
  font-size: 14px;
  font-weight: 500;
  padding: 0 4px;
}

.page-num:hover {
  border-color: #18b57d;
  color: #18b57d;
  background: #f0fdf6;
}

.page-num.active {
  background: #18b57d;
  border-color: #18b57d;
  color: #fff;
  box-shadow: 0 4px 12px rgba(24, 181, 125, 0.3);
}

.page-info {
  margin-left: 12px;
  padding: 0 12px;
  height: 40px;
  line-height: 40px;
  background: #f5f7f9;
  border-radius: 12px;
  font-size: 13px;
  color: #8a94a6;
}

.mt-20 {
  margin-top: 20px;
}

/* 响应式：平板 */
@media (max-width: 1100px) {
  .search-bar-wrap {
    width: 90%;
  }
  .spot-grid,
  .strategy-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .reserved-banner-area {
    max-width: 300px;
  }
}

/* 响应式：手机 */
@media (max-width: 768px) {
  .spot-grid,
  .strategy-grid {
    grid-template-columns: 1fr;
  }

  .pagination-wrapper {
    flex-wrap: wrap;
    gap: 10px;
  }

  .page-info {
    width: 100%;
    text-align: center;
    margin-left: 0;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 50px 0 40px;
  }
  .hero-title {
    font-size: 26px;
  }
  .content-card {
    padding: 20px;
  }
  .tab-item {
    margin-right: 25px;
  }
}
</style>
