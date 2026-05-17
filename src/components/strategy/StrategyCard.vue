<!-- src/components/strategy/strategy-card.vue -->
<template>
  <div class="strategy-card" @click="goToDetail">
    <div class="card-image">
      <img :src="data.cover" :alt="data.title" />
    </div>
    <div class="card-content">
      <h3>{{ data.title }}</h3>
      <p>{{ data.summary }}</p>
      <div class="card-footer">
        <div class="stats">
          <span class="likes">
            <el-icon><Pointer /></el-icon>
            {{ formatNumber(data.likes) }}
          </span>
          <span class="favorites">
            <el-icon><StarFilled /></el-icon>
            {{ formatNumber(data.favorites) }}
          </span>
        </div>
        <div class="date">
          {{ data.createTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Pointer, StarFilled } from '@element-plus/icons-vue'

const router = useRouter()

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: '',
      summary: '',
      cover: '',
      categoryName: '',
      likes: 0,
      favorites: 0,
      createTime: ''
    })
  }
})

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num
}

const goToDetail = () => {
  router.push(`/strategy/${props.data.id}`)
}
</script>

<style scoped>
.strategy-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.strategy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.strategy-card:hover .card-image img {
  transform: scale(1.05);
}

.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}

.card-content {
  padding: 16px;
}

.card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a2c3e;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.card-content p {
  font-size: 13px;
  color: #7a9588;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats {
  display: flex;
  gap: 16px;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8aa79a;
}

.stats .el-icon {
  font-size: 14px;
}

.date {
  font-size: 11px;
  color: #b8c5d0;
}
</style>
