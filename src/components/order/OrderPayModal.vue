<!-- components/OrderPayModal.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="订单支付"
    width="480px"
    class="payment-dialog"
    :before-close="handleClose"
  >
    <div class="pay-form">
      <!-- 订单信息卡片 -->
      <div class="pay-order-card">
        <div class="card-icon">
          <el-icon><Ticket /></el-icon>
        </div>
        <div class="pay-order-info">
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
              <span class="label">联系人</span>
              <span class="value">{{ order.contactName || '待填写' }}</span>
            </div>
            <div class="info-row">
              <span class="label">联系电话</span>
              <span class="value">{{ order.contactPhone || '待填写' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 金额区域 -->
      <div class="amount-section">
        <span class="amount-label">支付金额</span>
        <span class="amount-value">¥{{ order.total }}</span>
      </div>

      <!-- 支付按钮 -->
      <div class="pay-actions">
        <button class="btn-cancel" @click="handleClose">取消支付</button>
        <button class="btn-confirm" @click="handleConfirm">确认支付</button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { Ticket } from '@element-plus/icons-vue'

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

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClose = () => {
  visible.value = false
}

const handleConfirm = () => {
  emit('confirm', props.order)
  handleClose()
}
</script>

<style scoped>
.payment-dialog :deep(.el-dialog) {
  border-radius: 24px !important;
  overflow: hidden;
  margin: 0 auto !important;
}

.payment-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #1ec58b, #149b71);
  padding: 20px 24px;
  margin: 0;
}

.payment-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.payment-dialog :deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

.payment-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
  font-size: 18px;
}

.payment-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.pay-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pay-order-card {
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, #f8fafc, #fff);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #edf2f7;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
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

.pay-order-info {
  flex: 1;
  min-width: 0;
}

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
  color: #8a94a6;
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

.pay-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  flex: 1;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #e53e3e;
  color: #e53e3e;
  background: #fff5f5;
}

.btn-confirm {
  flex: 1;
  padding: 14px 16px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  border: none;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(30, 197, 139, 0.3);
}

@media (max-width: 500px) {
  .payment-dialog :deep(.el-dialog) {
    width: 90% !important;
  }

  .pay-order-card {
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

  .btn-cancel,
  .btn-confirm {
    padding: 12px;
    font-size: 14px;
  }
}
</style>
