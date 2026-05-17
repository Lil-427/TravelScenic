<!-- views/web/category/category.vue -->
<template>
  <div class="category-page">
    <div class="page-container" :style="{ backgroundImage: 'url(' + bgImage + ')' }">
      <div class="page-header">
        <div class="title-section">
          <div class="title-with-bar">
            <span class="vertical-bar"></span>
            <h1>景点分类</h1>
          </div>
          <p>探索自然之美，发现心之所向</p>
        </div>

        <div class="header-search">
          <el-icon class="search-icon"><Search /></el-icon>
          <input
            type="text"
            placeholder="搜索景点、城市、主题或关键词"
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
              <el-icon><List /></el-icon>
              共 {{ totalCount }} 个景点
            </div>
          </div>

          <!-- 使用统一的 SpotList 组件 -->
          <SpotList :spots="paginatedSpots" />

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
import { useRouter } from 'vue-router'
import {
  Search,
  Location,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  List,
  Menu,
  Picture,
  OfficeBuilding,
  MapLocation,
  Ticket,
  Promotion,
  Guide,
  Sunrise
} from '@element-plus/icons-vue'
import bgImage from '@/assets/categoriy-bg.png'
import SpotList from '@/components/spot/SpotList.vue'

const router = useRouter()

const currentCategory = ref('all')
const currentSort = ref('hot')
const keyword = ref('')
const currentPage = ref(1)
const pageSize = 6

const categories = ref([
  { id: 'all', name: '全部景点', icon: Menu, color: '#1ec58b', count: 128 },
  { id: 'nature', name: '自然风光', icon: Picture, color: '#4caf50', count: 32 },
  { id: 'ancient', name: '人文古迹', icon: OfficeBuilding, color: '#ff9800', count: 28 },
  { id: 'water', name: '山水河湖', icon: MapLocation, color: '#2196f3', count: 24 },
  { id: 'theme', name: '主题乐园', icon: Ticket, color: '#f44336', count: 16 },
  { id: 'beach', name: '海滨岛屿', icon: Promotion, color: '#00bcd4', count: 14 },
  { id: 'forest', name: '森林草原', icon: Guide, color: '#2e7d32', count: 10 },
  { id: 'hotspring', name: '温泉度假', icon: Sunrise, color: '#03a9f4', count: 4 }
])

const sortOptions = [
  { value: 'hot', label: '热门推荐' },
  { value: 'new', label: '最新上线' },
  { value: 'score', label: '评分最高' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' }
]

const spots = ref([
  {
    id: 1,
    name: '九寨沟',
    desc: '五彩湖泊与雪山森林交织成童话般景色。',
    city: '四川·阿坝',
    price: 299,
    score: '5.0',
    category: 'nature',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format'
  },
  {
    id: 2,
    name: '西湖',
    desc: '江南烟雨与古典园林融合的诗意风景。',
    city: '浙江·杭州',
    price: 199,
    score: '4.9',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format'
  },
  {
    id: 3,
    name: '张家界',
    desc: '奇峰林立，云海翻腾，宛如仙境。',
    city: '湖南·张家界',
    price: 288,
    score: '5.0',
    category: 'nature',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format'
  },
  {
    id: 4,
    name: '故宫',
    desc: '明清皇家宫殿，感受千年历史的厚重。',
    city: '北京·东城区',
    price: 60,
    score: '4.8',
    category: 'ancient',
    image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=600&auto=format'
  },
  {
    id: 5,
    name: '三亚亚龙湾',
    desc: '碧海蓝天，细沙白浪，度假天堂。',
    city: '海南·三亚',
    price: 399,
    score: '4.7',
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600&auto=format'
  },
  {
    id: 6,
    name: '上海迪士尼',
    desc: '梦幻童话世界，欢乐无限。',
    city: '上海·浦东',
    price: 475,
    score: '4.6',
    category: 'theme',
    image: 'https://images.unsplash.com/photo-1554110398-9d2a5d6b4b8a?q=80&w=600&auto=format'
  },
  {
    id: 7,
    name: '黄山',
    desc: '五岳归来不看山，黄山归来不看岳。',
    city: '安徽·黄山',
    price: 230,
    score: '4.9',
    category: 'nature',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format'
  },
  {
    id: 8,
    name: '乌镇',
    desc: '江南水乡的典型代表，小桥流水人家。',
    city: '浙江·桐乡',
    price: 150,
    score: '4.7',
    category: 'water',
    image: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=600&auto=format'
  }
])

const filteredSpots = computed(() => {
  let result = [...spots.value]
  if (currentCategory.value !== 'all') {
    result = result.filter((spot) => spot.category === currentCategory.value)
  }
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    result = result.filter(
      (spot) =>
        spot.name.toLowerCase().includes(kw) ||
        spot.city.toLowerCase().includes(kw) ||
        spot.desc.toLowerCase().includes(kw)
    )
  }
  switch (currentSort.value) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'score':
      result.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
      break
    case 'new':
      result.sort((a, b) => b.id - a.id)
      break
    default:
      result.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
      break
  }
  return result
})

const totalCount = computed(() => filteredSpots.value.length)
const totalPages = computed(() => Math.ceil(filteredSpots.value.length / pageSize))

const paginatedSpots = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredSpots.value.slice(start, end)
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

const goToDetail = (id) => {
  router.push(`/detail/${id}`)
}
</script>

<style scoped>
.category-page {
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
