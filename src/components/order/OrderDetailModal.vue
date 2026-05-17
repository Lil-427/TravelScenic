<!-- components/OrderDetailModal.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="订单详情"
    width="480px"
    class="detail-dialog"
    :before-close="handleClose"
  >
    <div class="detail-form">
      <!-- 订单状态横幅 -->
      <div class="status-banner" :class="statusClass">
        <el-icon><InfoFilled /></el-icon>
        <span>{{ order.statusText }}</span>
      </div>

      <!-- 订单信息卡片 -->
      <div class="detail-order-card">
        <div class="card-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="detail-order-info">
          <div class="info-group">
            <div class="info-row">
              <span class="label">订单号</span>
              <span class="value">{{ order.orderNo }}</span>
            </div>
            <div class="info-row">
              <span class="label">商品名称</span>
              <span class="value">{{ order.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">票型</span>
              <span class="value">{{ order.ticketType }}</span>
            </div>
            <div class="info-row">
              <span class="label">购买数量</span>
              <span class="value">{{ order.quantity }} 张</span>
            </div>
            <div class="info-row">
              <span class="label">游玩日期</span>
              <span class="value">{{ order.date }}</span>
            </div>
            <div class="info-row">
              <span class="label">下单时间</span>
              <span class="value">{{ order.createTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">联系人</span>
              <span class="value">{{ order.contactName || '未填写' }}</span>
            </div>
            <div class="info-row">
              <span class="label">联系电话</span>
              <span class="value">{{ order.contactPhone || '未填写' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 金额区域 -->
      <div class="amount-section">
        <span class="amount-label">实付金额</span>
        <span class="amount-value">¥{{ order.total }}</span>
      </div>

      <!-- 底部按钮 -->
      <div class="detail-actions">
        <button class="btn-contact" @click="handleContact">
          <el-icon><Headset /></el-icon>
          联系客服
        </button>
        <button class="btn-close" @click="handleClose">关闭</button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { InfoFilled, Document, Headset } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'contact'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 计算状态样式类
const statusClass = computed(() => {
  const statusMap = {
    pending: 'status-pending',
    unused: 'status-unused',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  }
  return statusMap[props.order.status] || ''
})

const handleClose = () => {
  visible.value = false
}

const handleContact = () => {
  emit('contact')
}
</script>

<style scoped>
/* 弹窗整体样式 */
.detail-dialog :deep(.el-dialog) {
  border-radius: 24px !important;
  overflow: hidden;
  margin: 0 auto !important;
}

.detail-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #1ec58b, #149b71);
  padding: 20px 24px;
  margin: 0;
  border-radius: 0;
}

.detail-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.detail-dialog :deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

.detail-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
  font-size: 18px;
}

.detail-dialog :deep(.el-dialog__headerbtn .el-dialog__close:hover) {
  color: #e8ecf0;
}

.detail-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

/* 内容容器 */
.detail-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 状态横幅 */
.status-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.status-banner .el-icon {
  font-size: 18px;
}

.status-banner.status-pending {
  background: #fff3e0;
  color: #ed8936;
}

.status-banner.status-unused {
  background: #e8f8f2;
  color: #18b57d;
}

.status-banner.status-completed {
  background: #e8ecf0;
  color: #6c757d;
}

.status-banner.status-cancelled {
  background: #fee;
  color: #e53e3e;
}

/* 订单信息卡片 */
.detail-order-card {
  display: flex;
  gap: 16px;
  background: #f8fafc;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #edf2f7;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2c3e50, #1a2c3e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon .el-icon {
  font-size: 24px;
  color: #fff;
}

.detail-order-info {
  flex: 1;
  min-width: 0; /* 防止溢出 */
}

/* 信息分组 */
.info-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.4;
}

.info-row .label {
  color: #1a2c3e;
  font-weight: 400;
  flex-shrink: 0;
  width: 70px;
}

.info-row .value {
  color: #1a2c3e;
  font-weight: 500;
  text-align: right;
  word-break: break-word;
  flex: 1;
}

/* 金额区域 */
.amount-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-label {
  font-size: 14px;
  color: #8a94a6;
}

.amount-value {
  font-size: 28px;
  font-weight: 700;
  color: #ff6a00;
}

/* 按钮区域 */
.detail-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-contact {
  flex: 1;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-contact:hover {
  border-color: #1ec58b;
  color: #1ec58b;
  background: #f0fdf9;
}

.btn-close {
  flex: 1;
  padding: 12px 16px;
  background: #f5f7f9;
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e8ecf0;
}

/* 响应式适配 */
@media (max-width: 500px) {
  .detail-dialog :deep(.el-dialog) {
    width: 90% !important;
  }

  .detail-order-card {
    padding: 16px;
    gap: 12px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
  }

  .card-icon .el-icon {
    font-size: 20px;
  }

  .info-row {
    font-size: 12px;
  }

  .info-row .label {
    width: 60px;
  }

  .amount-value {
    font-size: 24px;
  }

  .btn-contact,
  .btn-close {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
