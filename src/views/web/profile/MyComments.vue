<!-- views/web/profile/my-comments.vue -->
<template>
  <div class="my-comments">
    <div class="comments-card">
      <h2 class="card-title">我的评论</h2>

      <!-- 统计 -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-num">{{ totalCount }}</span>
          <span class="stat-label">条评论</span>
        </div>
      </div>

      <!-- 评论列表 -->
      <div class="comments-list">
        <div v-for="item in paginatedComments" :key="item.id" class="comment-item">
          <div class="comment-header">
            <div class="spot-info">
              <img :src="item.spotImage" class="spot-avatar" />
              <div class="spot-detail">
                <span class="spot-name">{{ item.spotName }}</span>
                <span class="comment-time">{{ item.createTime }}</span>
              </div>
            </div>
            <div class="comment-actions">
              <button class="action-btn view" @click="viewOriginal(item.spotId)">
                <el-icon><View /></el-icon>
                查看原帖
              </button>
              <button class="action-btn delete" @click="handleDelete(item.id)">
                <el-icon><Delete /></el-icon>
                删除
              </button>
            </div>
          </div>
          <div class="comment-content">
            <div class="rating">
              <el-rate v-model="item.rating" disabled :colors="rateColors" />
            </div>
            <p>{{ item.content }}</p>
            <div v-if="item.images && item.images.length" class="comment-images">
              <img v-for="(img, idx) in item.images" :key="idx" :src="img" />
            </div>
          </div>
        </div>

        <div v-if="filteredComments.length === 0" class="empty-state">
          <div class="empty-icon">💬</div>
          <p>暂无评论</p>
          <router-link to="/category" class="go-btn">去评价景点</router-link>
        </div>
      </div>

      <!-- 分页 -->
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
import { View, Delete, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const currentPage = ref(1)
const pageSize = 5

const rateColors = ['#ffd700', '#ffd700', '#ffd700', '#ffd700', '#ffd700']

const comments = ref([
  {
    id: 1,
    spotId: 1,
    spotName: '九寨沟',
    spotImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=100&auto=format',
    rating: 5,
    content: '太美了！五彩池的水清澈见底，秋天的彩林更是美不胜收，强烈推荐大家去！',
    images: [],
    createTime: '2025-01-15 14:30'
  },
  {
    id: 2,
    spotId: 2,
    spotName: '西湖',
    spotImage:
      'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=100&auto=format',
    rating: 4.5,
    content: '苏堤春晓名不虚传，西湖醋鱼也很好吃。就是人有点多，建议避开节假日。',
    images: ['https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=200&auto=format'],
    createTime: '2024-12-20 10:15'
  },
  {
    id: 3,
    spotId: 3,
    spotName: '张家界',
    spotImage:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=100&auto=format',
    rating: 5,
    content: '阿凡达取景地果然名不虚传，天门山玻璃栈道很刺激，百龙天梯也很震撼。',
    images: [],
    createTime: '2024-12-10 09:45'
  }
])

const filteredComments = computed(() => comments.value)
const totalCount = computed(() => filteredComments.value.length)
const totalPages = computed(() => Math.ceil(filteredComments.value.length / pageSize))

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredComments.value.slice(start, end)
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

const viewOriginal = (spotId) => {
  router.push(`/detail/${spotId}`)
}

const handleDelete = (id) => {
  const index = comments.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    comments.value.splice(index, 1)
    // 如果当前页没数据了，回到上一页
    if (paginatedComments.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
    alert('评论已删除')
  }
}
</script>

<style scoped>
.my-comments {
  display: flex;
  justify-content: center;
  width: 100%;
}

.comments-card {
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
  display: flex;
  gap: 24px;
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

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  border: 1px solid #e8ecf0;
  border-radius: 16px;
  padding: 20px;
  transition: 0.3s;
}

.comment-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f2f5;
}

.spot-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spot-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
}

.spot-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spot-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a2c3e;
}

.comment-time {
  font-size: 12px;
  color: #8a94a6;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #f5f7f9;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: 0.3s;
}

.action-btn.view:hover {
  background: #e8f8f2;
  color: #1ec58b;
}

.action-btn.delete:hover {
  background: #fee;
  color: #e53e3e;
}

.comment-content p {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
  margin: 12px 0 0 0;
}

.rating {
  margin-bottom: 8px;
}

.comment-images {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.comment-images img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.4;
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
