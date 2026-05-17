<!-- components/OrderCard.vue -->
<template>
  <div class="order-item">
    <!-- 订单头部 -->
    <div class="order-header">
      <div class="order-left">
        <span class="order-no">订单号：{{ order.orderNo }}</span>
        <span class="order-time">{{ order.createTime }}</span>
      </div>
      <span :class="['order-status', statusClass]">
        {{ order.statusText }}
      </span>
    </div>

    <!-- 订单内容 -->
    <div class="order-content">
      <img :src="order.image" class="order-img" :alt="order.name" />
      <div class="order-info">
        <h4>{{ order.name }}</h4>
        <div class="order-meta">
          <span>游玩日期：{{ order.date }}</span>
          <span>数量：{{ order.quantity }} 张</span>
          <span>票型：{{ order.ticketType }}</span>
        </div>

        <!-- 倒计时 -->
        <div class="countdown-timer" v-if="order.status === 'pending'">
          <el-icon><Timer /></el-icon>
          <span>剩余支付时间：{{ order.countdownText || '15:00' }}</span>
        </div>

        <!-- 距离游玩天数 -->
        <div class="countdown-timer days" v-if="order.status === 'unused'">
          <el-icon><Calendar /></el-icon>
          <span>距离游玩还有 {{ order.daysUntilTravel }} 天</span>
        </div>
      </div>
      <div class="order-price">
        <span class="total-price">¥{{ order.total }}</span>
      </div>
    </div>

    <!-- 订单底部按钮 -->
    <div class="order-footer">
      <div class="order-actions">
        <!-- 待付款按钮组 -->
        <template v-if="order.status === 'pending'">
          <button class="btn-outline" @click="handleCancel">取消订单</button>
          <button class="btn-primary" @click="handlePay">立即支付</button>
        </template>

        <!-- 待使用按钮组 -->
        <template v-if="order.status === 'unused'">
          <button class="btn-outline" @click="handleContact">联系客服</button>
          <button class="btn-outline" @click="handleDetail">查看详情</button>
        </template>

        <!-- 已完成按钮组 -->
        <template v-if="order.status === 'completed'">
          <button class="btn-outline" @click="handleDetail">查看详情</button>
          <button class="btn-outline" @click="handleReview">写评价</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Timer, Calendar } from '@element-plus/icons-vue'

const props = defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits([
  'pay', // 支付
  'cancel', // 取消订单
  'detail', // 查看详情
  'review', // 写评价
  'contact' // 联系客服
])

// 状态样式类
const statusClass = computed(() => {
  const statusMap = {
    pending: 'status-pending',
    unused: 'status-unused',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  }
  return statusMap[props.order.status] || ''
})

// 事件处理
const handlePay = () => {
  emit('pay', props.order)
}

const handleCancel = () => {
  emit('cancel', props.order.id)
}

const handleDetail = () => {
  emit('detail', props.order)
}

const handleReview = () => {
  emit('review', props.order.id)
}

const handleContact = () => {
  emit('contact')
}
</script>

<style scoped>
/* 订单卡片 */
.order-item {
  border: 1px solid #e8ecf0;
  border-radius: 16px;
  padding: 16px 20px;
  transition: all 0.3s;
  background: #fff;
}

.order-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.order-left {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.order-no {
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
}

.order-time {
  font-size: 12px;
  color: #8a94a6;
}

/* 订单状态 */
.order-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
}

.status-pending {
  background: #fff3e0;
  color: #ed8936;
}

.status-unused {
  background: #e8f8f2;
  color: #18b57d;
}

.status-completed {
  background: #e8ecf0;
  color: #8a94a6;
}

.status-cancelled {
  background: #fee;
  color: #e53e3e;
}

/* 订单内容 */
.order-content {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.order-img {
  width: 90px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.order-info {
  flex: 1;
}

.order-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1a2c3e;
  margin-bottom: 8px;
}

.order-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.order-meta span {
  font-size: 12px;
  color: #8a94a6;
}

/* 倒计时样式 */
.countdown-timer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #ed8936;
  background: #fff3e0;
  padding: 4px 10px;
  border-radius: 20px;
}

.countdown-timer.days {
  color: #18b57d;
  background: #e8f8f2;
}

.countdown-timer .el-icon {
  font-size: 14px;
}

/* 价格 */
.order-price {
  text-align: right;
  flex-shrink: 0;
}

.total-price {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #ff6a00;
}

/* 订单底部 */
.order-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f2f5;
}

.order-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 按钮样式 */
.btn-primary {
  padding: 6px 20px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 181, 125, 0.3);
}

.btn-outline {
  padding: 6px 20px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  color: #4a5568;
}

.btn-outline:hover {
  border-color: #18b57d;
  color: #18b57d;
  background: #f0fdf9;
}

/* 响应式 */
@media (max-width: 768px) {
  .order-item {
    padding: 12px 16px;
  }

  .order-left {
    gap: 10px;
  }

  .order-meta {
    flex-direction: column;
    gap: 4px;
  }

  .order-content {
    flex-direction: column;
  }

  .order-img {
    width: 100%;
    height: 140px;
  }

  .order-price {
    text-align: left;
    margin-top: 8px;
  }

  .order-footer {
    flex-direction: column;
    gap: 12px;
  }

  .order-actions {
    justify-content: center;
  }

  .btn-primary,
  .btn-outline {
    padding: 6px 16px;
    font-size: 11px;
  }
}
</style>
