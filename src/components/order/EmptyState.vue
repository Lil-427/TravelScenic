<!-- components/EmptyState.vue -->
<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <p>{{ text }}</p>
    <slot name="button">
      <router-link to="/category" class="empty-btn" v-if="showButton"> 去逛逛 </router-link>
    </slot>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📦'
  },
  text: {
    type: String,
    default: '暂无订单'
  },
  showButton: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.empty-state {
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
  margin-bottom: 20px;
}

.empty-btn {
  display: inline-block;
  padding: 10px 32px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 197, 139, 0.3);
}
</style>
