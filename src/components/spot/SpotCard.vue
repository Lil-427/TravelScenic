<!-- src/components/spot/spot-card.vue -->
<template>
  <div class="spot-card" @click="handleClick">
    <div class="card-image">
      <img :src="data.image" :alt="data.name" />
      <div class="score">{{ data.score }}</div>
    </div>
    <div class="card-content">
      <h3>{{ data.name }}</h3>
      <p>{{ data.desc }}</p>
      <div class="card-bottom">
        <div class="location">
          <el-icon><Location /></el-icon>
          {{ data.city }}
        </div>
        <div class="price">¥{{ data.price }}<span>起</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Location } from '@element-plus/icons-vue'

const router = useRouter()
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const handleClick = () => {
  router.push(`/detail/${props.data.id}`)
}
</script>

<style scoped>
.spot-card {
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.35s,
    box-shadow 0.35s;
}

.spot-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
}

.card-image {
  height: 190px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.spot-card:hover .card-image img {
  transform: scale(1.05);
}

.score {
  position: absolute;
  right: 14px;
  top: 14px;
  background: #17bf83;
  color: white;
  padding: 6px 13px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  z-index: 2;
}

.card-content {
  padding: 22px;
}

.card-content h3 {
  font-size: 24px;
  color: #172433;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.card-content p {
  font-size: 15px;
  color: #7d8795;
  line-height: 1.75;
  margin: 0 0 20px 0;
  min-height: 52px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7d8795;
  font-size: 14px;
}

.price {
  color: #ff6a00;
  font-size: 22px;
  font-weight: 700;
}

.price span {
  font-size: 14px;
  font-weight: 400;
  color: #999;
}
</style>
