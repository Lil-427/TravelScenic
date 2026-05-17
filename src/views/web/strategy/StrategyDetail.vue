<!-- views/web/strategy/strategy-detail.vue -->
<template>
  <div class="strategy-detail-page">
    <!-- 背景装饰 - 与景点详情页一致 -->
    <div class="bg-decoration"></div>

    <div class="detail-container">
      <!-- 面包屑导航 - 与景点详情页结构一致 -->
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <el-icon><ArrowRight /></el-icon>
        <router-link to="/strategy">旅游攻略</router-link>
        <el-icon><ArrowRight /></el-icon>
        <router-link to="/strategy">四川</router-link>
        <el-icon><ArrowRight /></el-icon>
        <span class="current">{{ strategy.title }}</span>
      </div>

      <div class="main-content">
        <!-- 左侧主体 -->
        <article class="article-panel">
          <div class="article-header">
            <div class="header-left">
              <h1 class="article-title">{{ strategy.title }}</h1>
              <div class="meta-row">
                <div class="tag-group">
                  <span v-for="(tag, idx) in strategy.tags" :key="idx" class="premium-tag">
                    {{ tag }}
                  </span>
                </div>
                <span class="publish-date">{{ strategy.createTime }} 发布</span>
              </div>
            </div>

            <!-- 收藏点赞按钮 -->
            <div class="action-buttons">
              <button class="action-btn" :class="{ active: isCollected }" @click="toggleCollect">
                <el-icon><Star /></el-icon>
                <span>收藏</span>
              </button>
              <button class="action-btn" :class="{ active: isLiked }" @click="toggleLike">
                <el-icon><Pointer /></el-icon>
                <span>点赞 {{ strategy.likes + (isLiked ? 1 : 0) }}</span>
              </button>
            </div>
          </div>

          <!-- 顶部轮播图 -->
          <div class="article-carousel">
            <el-carousel height="360px" motion-blur>
              <el-carousel-item v-for="(img, index) in bannerImages" :key="index">
                <img :src="img" class="carousel-img" alt="banner" />
              </el-carousel-item>
            </el-carousel>
          </div>

          <!-- 01 概况 -->
          <section class="content-section" id="section-1">
            <div class="section-head">
              <span class="num-idx">01</span>
              <h2 class="section-name">目的地概况</h2>
            </div>
            <div class="text-content">
              <p class="summary-text">{{ strategy.summary }}</p>

              <div class="info-grid-row">
                <div class="address-box-custom">
                  <el-icon class="box-icon"><LocationInformation /></el-icon>
                  <div class="box-content">
                    <div class="box-label">景点地址</div>
                    <div class="box-text">{{ strategy.address }}</div>
                    <div class="box-link">查看地图 →</div>
                  </div>
                </div>
                <div class="address-box-custom">
                  <el-icon class="box-icon"><Clock /></el-icon>
                  <div class="box-content">
                    <div class="box-label">开放时间</div>
                    <div class="box-text">{{ strategy.openTime }}</div>
                  </div>
                </div>
              </div>

              <div class="info-strip">
                <div class="strip-item">
                  <span class="label">最佳游玩：</span>
                  <span class="val">{{ strategy.bestTime }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 02 路线 -->
          <section class="content-section" id="section-2">
            <div class="section-head">
              <span class="num-idx">02</span>
              <h2 class="section-name">游玩路线推荐</h2>
            </div>
            <div class="route-list">
              <div v-for="(day, index) in routeDetails" :key="index" class="route-step">
                <div class="step-line">
                  <div class="step-dot"></div>
                </div>
                <div class="step-info">
                  <div class="day-num">DAY {{ index + 1 }}</div>
                  <h4 class="step-title">{{ day.title }}</h4>
                  <p class="step-desc">{{ day.desc }}</p>
                  <div class="step-meta">
                    <span>推荐交通：{{ day.transport }}</span>
                    <span class="dot">·</span>
                    <span>预计耗时：{{ day.duration }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 03 美食 -->
          <section class="content-section" id="section-3">
            <div class="section-head">
              <span class="num-idx">03</span>
              <h2 class="section-name">地道美食推荐</h2>
            </div>
            <div class="food-columns">
              <div v-for="(food, index) in strategy.foods" :key="index" class="food-mini-card">
                <img :src="food.image" />
                <div class="food-detail">
                  <h5>{{ food.name }}</h5>
                  <p>{{ food.desc }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 04 注意事项 -->
          <section class="content-section" id="section-4">
            <div class="section-head">
              <span class="num-idx">04</span>
              <h2 class="section-name">避坑注意事项</h2>
            </div>
            <div class="tips-box">
              <div v-for="(tip, index) in strategy.tips" :key="index" class="tip-line">
                <span class="tip-icon">!</span>
                <p>{{ tip }}</p>
              </div>
            </div>
          </section>
        </article>

        <!-- 右侧侧边栏 -->
        <aside class="sidebar-wrapper">
          <!-- 1. 极简订票引导 -->
          <div class="side-widget booking-widget">
            <div class="top-line"></div>
            <div class="widget-body">
              <div class="widget-tag">OFFICIAL</div>
              <h3>官方预约通道</h3>
              <p>提前预约享极速入园</p>
              <button class="minimal-btn-primary" @click="router.push('/category')">
                立即预约
              </button>
            </div>
          </div>

          <!-- 旅行提醒 -->
          <div class="side-widget reminder-widget">
            <div class="widget-title">旅行提醒</div>
            <div class="reminders-list">
              <div v-for="(rem, idx) in commonReminders" :key="idx" class="reminder-item">
                <div class="rem-title-row">
                  <el-icon class="rem-icon"><InfoFilled /></el-icon>
                  <span>{{ rem.label }}</span>
                </div>
                <p class="rem-desc">{{ rem.content }}</p>
              </div>
            </div>
          </div>

          <!-- 2. 周边景点 -->
          <div class="side-widget">
            <div class="widget-title">附近热门推荐</div>
            <div class="nearby-grid">
              <div
                v-for="spot in relatedSpots"
                :key="spot.id"
                class="spot-premium-card"
                @click="router.push(`/spot/${spot.id}`)"
              >
                <div class="spot-img">
                  <img :src="spot.img" />
                </div>
                <div class="spot-data">
                  <p class="name">{{ spot.name }}</p>
                  <span class="price">¥{{ spot.price }}起</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 排行榜 -->
          <div class="side-widget">
            <div class="widget-title">本周必看榜单</div>
            <ul class="clean-rank">
              <li
                v-for="(item, index) in topStrategies"
                :key="item.id"
                @click="goToDetail(item.id)"
              >
                <span :class="['rank-no', { top: index < 3 }]">{{ index + 1 }}</span>
                <div class="rank-info">
                  <p class="title">{{ item.title }}</p>
                  <span class="likes">{{ item.likes }} 赞</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- 4. 目录 -->
          <div class="side-widget toc-widget">
            <div class="widget-title">攻略目录</div>
            <div class="toc-links">
              <div
                v-for="item in tocList"
                :key="item.id"
                :class="['toc-link', { active: activeSection === item.id }]"
                @click="scrollToSection(item.id)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Star,
  Pointer,
  LocationInformation,
  Clock,
  InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const isLiked = ref(false)
const isCollected = ref(false)
const activeSection = ref('section-1')

const bannerImages = [
  'https://images.unsplash.com/photo-1542309865-0a3597843851?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1505993597083-3bd19f75e57d?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=1200&auto=format'
]

const strategy = ref({
  title: '九寨沟风景名胜区',
  address: '四川省阿坝藏族羌族自治州九寨沟县漳扎镇',
  openTime: '08:00 - 17:30（14:00停止入园）',
  tags: ['自然风光', '世界遗产', '四川必去'],
  createTime: '2025-06-12',
  likes: 8560,
  summary:
    '九寨沟位于四川省阿坝州，是中国首个以保护自然风景为主要目的的自然保护区。以其翠海、叠瀑、彩林、雪峰、藏情、蓝冰"六绝"著称。',
  bestTime: '10月中下旬至11月初',
  tips: [
    '门票需至少提前一天实名预约',
    '景区内海拔差异大，建议携带轻便外套',
    '建议自带少量饮用水及高能小食品',
    '严禁在景区内喂食野生动物'
  ],
  foods: [
    {
      name: '牦牛肉火锅',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=200&auto=format',
      desc: '选自当地散养牦牛，肉质鲜嫩劲道。'
    },
    {
      name: '酥油茶与青稞饼',
      image: 'https://images.unsplash.com/photo-1595122245592-1dc37299b007?q=80&w=200&auto=format',
      desc: '纯正藏式早餐，提供一天所需的能量。'
    }
  ]
})

const commonReminders = ref([
  { label: '必备证件', content: '请务必随身携带有效身份证原件。' },
  { label: '天气早知道', content: '早晚温差较大，建议备好防晒霜与防风外套。' },
  { label: '健康第一', content: '高海拔地区请缓步行走，必要时准备红景天。' }
])

const routeDetails = ref([
  {
    title: '日则沟深度打卡',
    desc: '五花海是全沟的精华，建议预留1小时。珍珠滩瀑布是西游记取景地，不容错过。',
    transport: '观光车+步行',
    duration: '5小时'
  },
  {
    title: '则查洼沟绝美景观',
    desc: '长海是九寨沟海拔最高、湖水最深的海子，景色壮美。',
    transport: '观光车',
    duration: '2小时'
  },
  {
    title: '树正沟文化游览',
    desc: '傍晚时分游览树正群海，在磨坊和经幡前体验藏家风情。',
    transport: '步行',
    duration: '2.5小时'
  }
])

const relatedSpots = ref([
  {
    id: 101,
    name: '黄龙名胜风景区',
    img: 'https://images.unsplash.com/photo-1528114039593-4366cc08227d?q=80&w=200&auto=format',
    price: 170
  },
  {
    id: 102,
    name: '神仙池',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=200&auto=format',
    price: 100
  }
])

const topStrategies = ref([
  { id: 2, title: '成都自驾九寨三日游全攻略', likes: '2.5w' },
  { id: 3, title: '九寨沟拍照最佳机位揭秘', likes: '1.8w' },
  { id: 4, title: '除了九寨，阿坝州还有这些小众地', likes: '1.2w' }
])

const tocList = ref([
  { id: 'section-1', title: '01 目的地概况' },
  { id: 'section-2', title: '02 游玩路线推荐' },
  { id: 'section-3', title: '03 地道美食推荐' },
  { id: 'section-4', title: '04 避坑注意事项' }
])

const toggleLike = () => (isLiked.value = !isLiked.value)
const toggleCollect = () => (isCollected.value = !isCollected.value)

const goToDetail = (id) => {
  router.push(`/strategy/detail/${id}`)
}

const scrollToSection = (id) => {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const handleScroll = () => {
  const scrollY = window.scrollY + 120
  tocList.value.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el && el.offsetTop <= scrollY) activeSection.value = item.id
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.strategy-detail-page {
  min-height: calc(100vh - 82px);
  background: #f5f8f7;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* 背景装饰 - 与景点详情页完全一致 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;
  pointer-events: none;
  background: linear-gradient(135deg, #e8f4f8 0%, #d4eaf0 50%, #c5e3e8 100%);
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
}

.detail-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px 24px 40px;
  position: relative;
  z-index: 10;
}

/* 面包屑导航 - 与景点详情页完全一致 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #8a94a6;
  margin-bottom: 24px;
}

.breadcrumb a {
  color: #8a94a6;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #1ec58b;
}

.breadcrumb .current {
  color: #1a3c34;
  font-weight: 500;
}

.breadcrumb .el-icon {
  font-size: 12px;
}

/* 主内容区 */
.main-content {
  display: flex;
  gap: 24px;
}

/* 左侧主体 - 固定宽度与景点详情页左侧一致 */
.article-panel {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f2f5;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #172433;
  margin-bottom: 16px;
}

/* 标签优化 */
.tag-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.premium-tag {
  border: 1px solid #e2e8f0;
  background: #fafbfc;
  color: #5a6e66;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.publish-date {
  font-size: 12px;
  color: #8a94a6;
  margin-left: 12px;
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* 收藏点赞按钮 - 与景点详情页风格一致 */
.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 40px;
  background: #f8faf9;
  border: 1px solid #edf2f7;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #5a6e66;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #ecf9f4;
  border-color: rgba(30, 197, 139, 0.3);
  color: #1ec58b;
}

.action-btn.active {
  background: linear-gradient(135deg, #1ec58b, #149b71);
  border-color: #1ec58b;
  color: #fff;
}

.action-btn.active .el-icon {
  color: #fff;
}

.action-btn .el-icon {
  font-size: 16px;
}

/* 轮播图 */
.article-carousel {
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 章节设计 */
.content-section {
  margin-bottom: 40px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 20px;
}

.num-idx {
  font-size: 24px;
  font-weight: 800;
  color: #1ec58b;
  opacity: 0.2;
  line-height: 1;
}

.section-name {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.summary-text {
  line-height: 1.8;
  color: #5a6e66;
  margin-bottom: 20px;
  text-align: justify;
}

/* 景点地址与开放时间卡片 */
.info-grid-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.address-box-custom {
  flex: 1;
  background: #f8faf9;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  gap: 14px;
  transition: all 0.2s;
}

.address-box-custom:hover {
  background: #f0fdf6;
}

.box-icon {
  font-size: 20px;
  color: #1ec58b;
  margin-top: 2px;
}

.box-label {
  font-size: 14px;
  font-weight: 600;
  color: #1a3c34;
  margin-bottom: 4px;
}

.box-text {
  font-size: 13px;
  color: #8a94a6;
  line-height: 1.4;
  margin-bottom: 6px;
}

.box-link {
  font-size: 12px;
  color: #1ec58b;
  cursor: pointer;
  text-decoration: none;
}

.box-link:hover {
  text-decoration: underline;
}

.info-strip {
  background: #fafbfc;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
}

.strip-item .label {
  color: #8a94a6;
}

.strip-item .val {
  color: #333;
  font-weight: 500;
}

/* 时间轴路线 */
.route-list {
  padding-left: 10px;
}

.route-step {
  display: flex;
  gap: 20px;
  margin-bottom: 28px;
}

.step-line {
  position: relative;
  width: 1px;
  background: #e2e8f0;
}

.step-dot {
  position: absolute;
  top: 8px;
  left: -4px;
  width: 9px;
  height: 9px;
  background: #1ec58b;
  border-radius: 50%;
}

.day-num {
  font-size: 11px;
  font-weight: 800;
  color: #1ec58b;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.step-title {
  font-size: 17px;
  margin-bottom: 8px;
  color: #172433;
}

.step-desc {
  font-size: 14px;
  color: #5a6e66;
  line-height: 1.6;
  margin-bottom: 8px;
}

.step-meta {
  font-size: 12px;
  color: #8a94a6;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 美食 */
.food-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.food-mini-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 12px;
  background: #f8faf9;
  border-radius: 16px;
  transition: all 0.2s;
}

.food-mini-card:hover {
  background: #f0fdf6;
  transform: translateX(4px);
}

.food-mini-card img {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
}

.food-mini-card h5 {
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #172433;
}

.food-mini-card p {
  font-size: 12px;
  color: #8a94a6;
  line-height: 1.4;
}

/* 注意事项 */
.tips-box {
  background: #fffcfb;
  border: 1px solid #f9f2ef;
  padding: 24px;
  border-radius: 16px;
}

.tip-line {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.tip-line:last-child {
  margin-bottom: 0;
}

.tip-icon {
  width: 20px;
  height: 20px;
  background: #e27d60;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.tip-line p {
  margin: 0;
  font-size: 14px;
  color: #7d5a50;
  line-height: 1.5;
}

/* 右侧侧边栏 - 与景点详情页一致 */
.sidebar-wrapper {
  width: 340px;
  flex-shrink: 0;
}

.side-widget {
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f2f5;
}

.side-widget:last-child {
  margin-bottom: 0;
}

.widget-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 18px;
  color: #172433;
  position: relative;
  padding-left: 12px;
}

.widget-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: #1ec58b;
  border-radius: 2px;
}

/* 旅行提醒样式 */
.reminder-item {
  margin-bottom: 14px;
}

.rem-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1a3c34;
  margin-bottom: 4px;
}

.rem-icon {
  color: #1ec58b;
  font-size: 14px;
}

.rem-desc {
  font-size: 12px;
  color: #8a94a6;
  line-height: 1.5;
  padding-left: 26px;
}

/* 订票引导 */
.booking-widget {
  padding: 0;
  overflow: hidden;
}

.top-line {
  height: 4px;
  background: #1ec58b;
}

.widget-body {
  padding: 24px;
  text-align: center;
}

.widget-tag {
  font-size: 10px;
  color: #1ec58b;
  letter-spacing: 2px;
  margin-bottom: 8px;
  font-weight: 800;
}

.widget-body h3 {
  font-size: 18px;
  margin-bottom: 6px;
  color: #172433;
}

.widget-body p {
  font-size: 13px;
  color: #8a94a6;
  margin-bottom: 16px;
}

.minimal-btn-primary {
  width: 100%;
  height: 42px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.minimal-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(30, 197, 139, 0.3);
}

/* 周边景点 */
.nearby-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.spot-premium-card {
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 12px;
  padding: 8px;
}

.spot-premium-card:hover {
  transform: translateX(6px);
  background: #f8faf9;
}

.spot-img {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.spot-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spot-data .name {
  font-size: 14px;
  font-weight: 600;
  color: #172433;
  margin-bottom: 4px;
}

.spot-data .price {
  font-size: 12px;
  color: #1ec58b;
  font-weight: 500;
}

/* 排行榜 */
.clean-rank {
  list-style: none;
  padding: 0;
  margin: 0;
}

.clean-rank li {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  cursor: pointer;
  transition: 0.2s;
}

.clean-rank li:hover .title {
  color: #1ec58b;
}

.rank-no {
  font-size: 18px;
  font-weight: 300;
  color: #ddd;
  font-family: 'Georgia', serif;
  width: 28px;
}

.rank-no.top {
  color: #1ec58b;
  font-weight: 700;
}

.rank-info .title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
}

.rank-info .likes {
  font-size: 11px;
  color: #bbb;
}

/* 目录 */
.toc-links {
  border-left: 1px solid #edf2f7;
  margin-left: 8px;
}

.toc-link {
  font-size: 13px;
  color: #8a94a6;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
}

.toc-link.active {
  color: #1ec58b;
  font-weight: 600;
}

.toc-link.active::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #1ec58b;
}

.toc-link:hover:not(.active) {
  color: #172433;
}

/* 响应式 */
@media (max-width: 1100px) {
  .main-content {
    flex-direction: column;
  }
  .sidebar-wrapper {
    width: 100%;
  }
  .detail-container {
    padding: 16px 20px 40px;
  }
}

@media (max-width: 768px) {
  .detail-container {
    padding: 12px 16px 32px;
  }
  .article-header {
    flex-direction: column;
    gap: 16px;
  }
  .article-title {
    font-size: 22px;
  }
  .info-grid-row {
    flex-direction: column;
  }
  .food-columns {
    grid-template-columns: 1fr;
  }
  .action-buttons {
    width: 100%;
  }
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  .article-panel {
    padding: 20px;
  }
  .breadcrumb {
    flex-wrap: wrap;
  }
}
</style>
