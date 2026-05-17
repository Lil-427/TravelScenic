<!-- src/components/spot/spot-list.vue -->
<template>
  <div class="spot-list">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="spots.length === 0" class="empty-state">
      <div class="empty-icon">🏝️</div>
      <p>暂无景点数据</p>
      <button v-if="onReset" @click="onReset" class="reset-btn">重置筛选</button>
    </div>

    <div v-else class="card-grid">
      <SpotCard v-for="item in spots" :key="item.id" :data="item" />
    </div>
  </div>
</template>

<script setup>
import SpotCard from './SpotCard.vue'

defineProps({
  spots: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  onReset: {
    type: Function,
    default: null
  }
})
</script>

<style scoped>
.spot-list {
  width: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.loading-state {
  text-align: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f2f5;
  border-top-color: #1ec58b;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #8a94a6;
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

.reset-btn {
  padding: 10px 32px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
