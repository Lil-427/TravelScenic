<!-- views/web/profile/my-likes.vue -->
<template>
  <div class="my-likes">
    <div class="likes-card">
      <h2 class="card-title">我的点赞</h2>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-num">{{ totalCount }}</span>
          <span class="stat-label">篇点赞的攻略</span>
        </div>
      </div>

      <div class="likes-list">
        <div
          v-for="item in paginatedLikes"
          :key="item.id"
          class="like-item"
          @click="viewStrategy(item.id)"
        >
          <img :src="item.image" class="item-image" />
          <div class="item-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="item-meta">
              <span class="date">
                <el-icon><Calendar /></el-icon>
                {{ item.createTime }}
              </span>
            </div>
          </div>
          <button class="unlike-btn" @click.stop="removeLike(item.id)">
            <el-icon><StarFilled /></el-icon>
            已点赞
          </button>
        </div>

        <div v-if="filteredLikes.length === 0" class="empty-state">
          <div class="empty-icon">
            <el-icon><Star /></el-icon>
          </div>
          <p>暂无点赞的攻略</p>
          <router-link to="/strategy" class="go-btn">去点赞攻略</router-link>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn prev" :disabled="currentPage === 1" @click="currentPage--">
          <el-icon><ArrowLeft /></el-icon>
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['page-btn', { active: currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button class="page-btn next" :disabled="currentPage === totalPages" @click="currentPage++">
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { StarFilled, ArrowLeft, ArrowRight, Calendar, Star } from '@element-plus/icons-vue'

const router = useRouter()
const currentPage = ref(1)
const pageSize = 5

const likes = ref([
  {
    id: 1,
    title: '九寨沟四季游玩全攻略，每个季节都有不同的美',
    desc: '九寨沟被誉为"人间仙境"，四季景色各异。春季山花烂漫，夏季绿树成荫，秋季彩林斑斓，冬季银装素裹...',
    createTime: '2025-01-15',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=200&auto=format'
  },
  {
    id: 2,
    title: '杭州西湖三日游最佳路线，看完这篇就够了',
    desc: '西湖、灵隐寺、宋城、龙井村...三天时间怎么玩最合理？这份攻略带你深度游杭州，不走回头路...',
    createTime: '2025-01-10',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=200&auto=format'
  },
  {
    id: 3,
    title: '张家界自由行攻略，门票交通住宿全解析',
    desc: '张家界国家森林公园、天门山、大峡谷玻璃桥...详细的门票价格、交通方式、住宿推荐，一篇搞定...',
    createTime: '2025-01-05',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format'
  }
])

const filteredLikes = computed(() => likes.value)
const totalCount = computed(() => filteredLikes.value.length)
const totalPages = computed(() => Math.ceil(filteredLikes.value.length / pageSize))

const paginatedLikes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredLikes.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (current <= 3) {
    for (let i = 1; i <= 5; i++) pages.push(i)
  } else if (current >= total - 2) {
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    for (let i = current - 2; i <= current + 2; i++) pages.push(i)
  }
  return pages
})

const viewStrategy = (id) => {
  router.push(`/strategy/${id}`)
}

const removeLike = (id) => {
  const index = likes.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    likes.value.splice(index, 1)
    if (paginatedLikes.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
    alert('已取消点赞')
  }
}
</script>

<style scoped>
.my-likes {
  display: flex;
  justify-content: center;
  width: 100%;
}

.likes-card {
  width: 900px;
  background: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1a2c3e;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 20px;
}

.stats-bar {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f2f5;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #1ec58b;
}

.stat-label {
  font-size: 14px;
  color: #8a94a6;
}

.likes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.like-item {
  display: flex;
  gap: 16px;
  border: 1px solid #e8ecf0;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
}

.like-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.item-image {
  width: 120px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a2c3e;
  margin: 0 0 8px 0;
}

.item-info p {
  font-size: 13px;
  color: #7a9588;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8a94a6;
  align-items: center;
}

.item-meta .el-icon {
  font-size: 12px;
  margin-right: 2px;
}

.date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.unlike-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  background: #e8f8f2;
  border: none;
  border-radius: 30px;
  font-size: 13px;
  color: #1ec58b;
  cursor: pointer;
  transition: 0.3s;
  height: 32px;
  align-self: center;
}

.unlike-btn:hover {
  background: #fee;
  color: #e53e3e;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.4;
  display: flex;
  justify-content: center;
}

.empty-icon .el-icon {
  font-size: 64px;
}

.empty-state p {
  color: #8a94a6;
  margin-bottom: 20px;
}

.go-btn {
  display: inline-block;
  padding: 10px 32px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
}

.page-btn.active {
  background: #1ec58b;
  border-color: #1ec58b;
  color: #fff;
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: #1ec58b;
  color: #1ec58b;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
