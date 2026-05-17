<!-- src/components/strategy/strategy-list.vue -->
<template>
  <div class="strategy-list">
    <div v-if="strategies.length === 0" class="empty-state">
      <div class="empty-icon">📖</div>
      <p>暂无攻略数据</p>
    </div>

    <div v-else class="card-grid">
      <StrategyCard v-for="item in strategies" :key="item.id" :data="item" />
    </div>
  </div>
</template>

<script setup>
import StrategyCard from './StrategyCard.vue'

defineProps({
  strategies: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>

<style scoped>
.strategy-list {
  width: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
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
