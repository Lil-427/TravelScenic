<!-- views/web/home/home.vue -->
<template>
  <div class="home-page">
    <!-- Banner -->
    <section class="banner">
      <img class="banner-bg" :src="bannerImg" />
      <div class="banner-mask"></div>
      <div class="banner-content">
        <h1>
          探索自然之美
          <br />
          开启美好旅程
        </h1>
        <p>发现心之所向 · 遇见美好风景</p>

        <!-- 一体化全贴合搜索框 -->
        <div class="search-box">
          <!-- 下拉选择区 -->
          <div class="search-dropdown-wrapper" @click.stop="toggleSelect">
            <div class="search-dropdown-current">
              <span>{{ searchType === 'spot' ? '景点' : '攻略' }}</span>
              <el-icon class="arrow-icon" :class="{ 'is-active': showSelect }"
                ><ArrowDown
              /></el-icon>
            </div>

            <!-- 横向悬浮胶囊下拉框 -->
            <div class="search-dropdown-list" v-if="showSelect">
              <div class="dropdown-item" @click.stop="setSearchType('spot')">景点</div>
              <div class="dropdown-item" @click.stop="setSearchType('strategy')">攻略</div>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="search-divider"></div>

          <!-- 搜索输入区 -->
          <div class="search-input-wrapper">
            <input
              v-model="searchKeyword"
              :placeholder="
                searchType === 'spot' ? '搜索景点、城市、主题或关键词' : '搜索攻略、目的地或关键词'
              "
              @keyup.enter="handleSearch"
            />
          </div>

          <!-- 无缝贴合搜索按钮 -->
          <button class="search-submit-btn" @click="handleSearch">搜索</button>
        </div>

        <div class="hot-tags">
          <span>热门搜索：</span>
          <div class="tag" @click="handleHotSearch('黄山')">黄山</div>
          <div class="tag" @click="handleHotSearch('张家界')">张家界</div>
          <div class="tag" @click="handleHotSearch('九寨沟')">九寨沟</div>
          <div class="tag" @click="handleHotSearch('故宫')">故宫</div>
          <div class="tag" @click="handleHotSearch('桂林漓江')">桂林漓江</div>
        </div>
      </div>
    </section>

    <!-- 功能区 -->
    <section class="feature-panel">
      <div class="feature-item" @click="goToCategory">
        <div class="feature-icon">
          <el-icon><Ticket /></el-icon>
        </div>
        <h3>景点门票</h3>
        <p>精选景区 快速预订</p>
      </div>
      <div class="feature-item" @click="goToStrategy">
        <div class="feature-icon">
          <el-icon><Guide /></el-icon>
        </div>
        <h3>攻略</h3>
        <p>旅行灵感 攻略推荐</p>
      </div>
      <div class="feature-item" @click="goToCart">
        <div class="feature-icon">
          <el-icon><ShoppingCart /></el-icon>
        </div>
        <h3>购物车</h3>
        <p>查看我的购物车</p>
      </div>
      <div class="feature-item" @click="goToProfile">
        <div class="feature-icon">
          <el-icon><User /></el-icon>
        </div>
        <h3>个人中心</h3>
        <p>我的账户 订单管理</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon">
          <el-icon><Headset /></el-icon>
        </div>
        <h3>帮助中心</h3>
        <p>常见问题 快速解答</p>
      </div>
    </section>

    <!-- 第一行：热门景区推荐 + 旅行灵感 -->
    <section class="recommend-section">
      <div class="recommend-left">
        <div class="section-header">
          <div class="section-title">
            <div class="line"></div>
            <h2>热门景区推荐</h2>
          </div>
          <div class="more" @click="goToCategory">查看更多 ></div>
        </div>
        <SpotList :spots="displaySpots" />
      </div>

      <div class="travel-box">
        <div class="travel-title">
          <el-icon><Guide /></el-icon>
          <span>旅行灵感</span>
        </div>
        <div class="travel-item">
          <div class="travel-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="travel-content">
            <h4>最佳旅行时间</h4>
            <p>3-10月气候宜人，适合出行拍照。</p>
          </div>
        </div>
        <div class="travel-item">
          <div class="travel-icon">
            <el-icon><Checked /></el-icon>
          </div>
          <div class="travel-content">
            <h4>旅行小贴士</h4>
            <p>提前规划路线，避开高峰期。</p>
          </div>
        </div>
        <div class="travel-item">
          <div class="travel-icon">
            <el-icon><Opportunity /></el-icon>
          </div>
          <div class="travel-content">
            <h4>安全出行</h4>
            <p>文明旅游，注意天气变化。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 第二行：高分景点推荐 + 系统公告 -->
    <section class="recommend-section second-row">
      <div class="recommend-left">
        <div class="section-header">
          <div class="section-title">
            <div class="line"></div>
            <h2>高分景点推荐</h2>
          </div>
          <div class="more" @click="goToCategory">查看更多 ></div>
        </div>
        <SpotList :spots="topRatedSpots" />
      </div>

      <div class="announcement-box">
        <div class="announcement-title">
          <el-icon><Bell /></el-icon>
          <span>系统公告</span>
        </div>
        <div class="announcement-list">
          <div v-for="(item, idx) in announcements" :key="idx" class="announcement-item">
            <div class="announcement-dot"></div>
            <div class="announcement-content">
              <p class="announcement-text">{{ item.title }}</p>
              <span class="announcement-time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Ticket,
  Calendar,
  Headset,
  Checked,
  Opportunity,
  Bell,
  ArrowDown,
  Guide,
  ShoppingCart,
  User
} from '@element-plus/icons-vue'
import bannerImg from '@/assets/image.png'
import SpotList from '@/components/spot/SpotList.vue'

const router = useRouter()
const searchKeyword = ref('')
const searchType = ref('spot')
const showSelect = ref(false)

// 景点数据
const scenicList = ref([
  {
    id: 1,
    name: '九寨沟',
    desc: '五彩湖泊与雪山森林交织成童话般景色。',
    city: '四川',
    price: 299,
    score: '5.0',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format'
  },
  {
    id: 2,
    name: '西湖',
    desc: '江南烟雨与古典园林融合的诗意风景。',
    city: '杭州',
    price: 199,
    score: '4.9',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format'
  },
  {
    id: 3,
    name: '张家界',
    desc: '奇峰林立，云海翻腾，宛如仙境。',
    city: '湖南',
    price: 288,
    score: '5.0',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format'
  }
])

// 高分景点数据
const topRatedSpots = ref([
  {
    id: 4,
    name: '黄山',
    desc: '五岳归来不看山，黄山归来不看岳，奇松怪石云海温泉。',
    city: '安徽',
    price: 230,
    score: '4.9',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format'
  },
  {
    id: 5,
    name: '故宫博物院',
    desc: '世界五大宫之首，明清两代的皇家宫殿，感受六百年历史。',
    city: '北京',
    price: 60,
    score: '4.8',
    image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=600&auto=format'
  },
  {
    id: 6,
    name: '上海迪士尼',
    desc: '中国大陆首座迪士尼主题乐园，奇幻童话城堡梦幻体验。',
    city: '上海',
    price: 499,
    score: '4.9',
    image: 'https://images.unsplash.com/photo-1554110398-9d2a5d6b4b8a?q=80&w=600&auto=format'
  }
])

// 系统公告数据 - 改为3条，均匀分布
const announcements = ref([
  {
    title: '国庆黄金周景区预约通知，请提前3天购票',
    time: '2025-01-15'
  },
  {
    title: '九寨沟景区冬季票价调整公告',
    time: '2025-01-10'
  },
  {
    title: '系统升级维护通知（1月20日02:00-06:00）',
    time: '2025-01-05'
  }
])

// 筛选后的景点
const displaySpots = computed(() => {
  if (!searchKeyword.value.trim() || searchType.value !== 'spot') {
    return scenicList.value
  }
  const kw = searchKeyword.value.trim().toLowerCase()
  return scenicList.value.filter(
    (spot) =>
      spot.name.toLowerCase().includes(kw) ||
      spot.city.toLowerCase().includes(kw) ||
      spot.desc.toLowerCase().includes(kw)
  )
})

const toggleSelect = () => {
  showSelect.value = !showSelect.value
}

const setSearchType = (type) => {
  searchType.value = type
  showSelect.value = false
}

const handleSearch = () => {
  if (searchType.value === 'spot' && searchKeyword.value.trim()) {
    // 景点搜索逻辑
  } else if (searchType.value === 'strategy' && searchKeyword.value.trim()) {
    router.push(`/strategy?keyword=${encodeURIComponent(searchKeyword.value)}`)
  }
}

const handleHotSearch = (keyword) => {
  searchKeyword.value = keyword
  if (searchType.value === 'spot') {
    // 景点搜索
  } else {
    router.push(`/strategy?keyword=${encodeURIComponent(keyword)}`)
  }
}

const goToCategory = () => {
  router.push('/category')
}

const goToStrategy = () => {
  router.push('/strategy')
}

const goToCart = () => {
  router.push('/cart')
}

const goToProfile = () => {
  router.push('/profile')
}

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  const wrapper = document.querySelector('.search-dropdown-wrapper')
  if (wrapper && !wrapper.contains(event.target)) {
    showSelect.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Source+Han+Sans+SC:wght@400;500;700&display=swap');

.home-page {
  font-family: 'Source Han Sans SC', sans-serif;
}

.banner {
  position: relative;
  height: 470px;
  overflow: hidden;
}

.banner-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
}

.banner-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  color: #fff;
  z-index: 2;
}

.banner-content h1 {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 62px;
  font-weight: normal;
  line-height: 1.45;
  letter-spacing: 4px;
  text-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}

.banner-content p {
  margin-top: 14px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 2px;
}

/* ---------------- 全新无缝贴合搜索框 ---------------- */
.search-box {
  width: 700px;
  height: 60px;
  background-color: #ffffff;
  margin: 32px auto 0;
  border-radius: 30px;
  display: flex;
  align-items: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 20;
}

.search-dropdown-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px 0 24px;
  cursor: pointer;
  border-radius: 30px 0 0 30px;
  transition: background-color 0.2s;
}

.search-dropdown-wrapper:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.search-dropdown-current {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  user-select: none;
}

.arrow-icon {
  font-size: 14px;
  color: #8c96a5;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.arrow-icon.is-active {
  transform: rotate(180deg);
  color: #1ec58b;
}

/* 横向排列的悬浮气泡 */
.search-dropdown-list {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 100;
  white-space: nowrap;
  animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.search-dropdown-list::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 36px;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.92);
  border-left: 1px solid rgba(255, 255, 255, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  transform: rotate(45deg);
  border-radius: 2px;
  z-index: 1;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  position: relative;
  z-index: 2;
  padding: 8px 20px;
  font-size: 15px;
  color: #4a5568;
  border-radius: 20px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #edf8f4;
  color: #1ec58b;
}

/* 分割线 */
.search-divider {
  width: 1px;
  height: 24px;
  background-color: #e2e8f0;
  margin: 0 16px;
}

/* 输入框 */
.search-input-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
}

.search-input-wrapper input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
}

.search-input-wrapper input::placeholder {
  color: #a0a8b3;
}

/* 绝对贴合右侧边框的按钮 */
.search-submit-btn {
  height: 60px;
  padding: 0 42px;
  border: none;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: white;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 2px;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-submit-btn:hover {
  background: linear-gradient(135deg, #22d899, #17b382);
}

.hot-tags {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.hot-tags span {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
}

.tag {
  padding: 8px 20px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px);
  color: white;
  font-size: 14px;
  transition: 0.3s;
  cursor: pointer;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.24);
}

/* 功能区 */
.feature-panel {
  width: 92%;
  margin: -42px auto 0;
  background: white;
  border-radius: 24px;
  padding: 34px 10px;
  display: flex;
  justify-content: space-around;
  position: relative;
  z-index: 10;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.06);
}

.feature-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-4px);
}

.feature-icon {
  width: 72px;
  height: 72px;
  margin: auto;
  border-radius: 20px;
  background: #edf8f4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon .el-icon {
  font-size: 34px;
  color: #18b57d;
}

.feature-item h3 {
  margin-top: 16px;
  font-size: 20px;
  color: #1d2b38;
}

.feature-item p {
  margin-top: 8px;
  font-size: 14px;
  color: #8a94a6;
}

/* 推荐区域 - 两行布局 */
.recommend-section {
  width: 92%;
  margin: 52px auto;
  display: flex;
  gap: 26px;
  align-items: stretch;
}

.second-row {
  margin-top: 0;
}

.recommend-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  height: 42px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.line {
  width: 5px;
  height: 28px;
  background: #18b57d;
  border-radius: 20px;
}

.section-title h2 {
  font-size: 22px;
  color: #182433;
  font-weight: 700;
}

.more {
  font-size: 14px;
  color: #8c96a5;
  cursor: pointer;
  transition: 0.3s;
}

.more:hover {
  color: #18b57d;
}

/* 旅行灵感 */
.travel-box {
  width: 320px;
  background: #fff;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  min-height: 390px;
  display: flex;
  flex-direction: column;
  margin-top: 60px;
}

.travel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #18b57d;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 28px;
}

.travel-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 26px;
}

.travel-item:last-child {
  margin-bottom: 0;
}

.travel-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: #edf8f4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.travel-icon .el-icon {
  font-size: 24px;
  color: #18b57d;
}

.travel-item h4 {
  font-size: 18px;
  color: #172433;
  margin-bottom: 8px;
}

.travel-item p {
  font-size: 14px;
  line-height: 1.8;
  color: #8b96a5;
}

/* 系统公告 - 3条均匀分布 */
.announcement-box {
  width: 320px;
  background: #fff;
  border-radius: 22px;
  padding: 20px 22px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  height: 390px;
}

.announcement-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #18b57d;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  transform: translateY(10px);
}

.announcement-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.announcement-dot {
  width: 6px;
  height: 6px;
  background: #1ec58b;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
}

.announcement-content {
  flex: 1;
}

.announcement-text {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
  margin: 0 0 6px 0;
  cursor: pointer;
  transition: color 0.3s;
}

.announcement-text:hover {
  color: #1ec58b;
}

.announcement-time {
  font-size: 11px;
  color: #b8c5d0;
}

/* 响应式 */
@media (max-width: 1200px) {
  .recommend-section {
    flex-direction: column;
  }
  .travel-box,
  .announcement-box {
    width: 100%;
    margin-top: 30px;
  }
  .search-box {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .search-box {
    width: 100%;
    flex-direction: column;
    height: auto;
    border-radius: 24px;
    padding: 12px;
  }
  .search-dropdown-wrapper {
    width: 100%;
    height: 48px;
    justify-content: center;
    border-radius: 12px;
  }
  .search-divider {
    display: none;
  }
  .search-input-wrapper {
    width: 100%;
    height: 48px;
    border-top: 1px solid #f1f5f9;
    padding: 0 10px;
  }
  .search-submit-btn {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    margin-top: 8px;
  }
  .feature-panel {
    flex-wrap: wrap;
    gap: 20px;
  }
  .feature-item {
    width: calc(33.33% - 20px);
  }
  .banner-content h1 {
    font-size: 36px;
  }
  .banner-content p {
    font-size: 14px;
  }
  .hot-tags {
    flex-wrap: wrap;
  }
  .announcement-box {
    height: auto;
    min-height: 300px;
  }
}
</style>
