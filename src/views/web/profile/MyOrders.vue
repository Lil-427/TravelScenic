<!-- views/web/profile/MyOrders.vue -->
<template>
  <div class="my-orders">
    <div class="orders-card">
      <h2 class="card-title">我的订单</h2>

      <!-- 订单统计卡片 -->
      <div class="stats-row">
        <div v-for="stat in stats" :key="stat.key" class="stat-card" @click="activeTab = stat.key">
          <span class="stat-num">{{ stat.count }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <!-- 订单状态 Tab -->
      <div class="order-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span class="tab-count" v-if="tab.count > 0">{{ tab.count }}</span>
        </button>
      </div>

      <!-- 订单列表 -->
      <div class="order-list-wrapper">
        <div class="order-list">
          <!-- 使用订单卡片组件 -->
          <OrderCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
            @pay="openPayModal"
            @cancel="cancelOrder"
            @detail="openDetailModal"
            @review="goReview"
            @contact="contactService"
          />

          <!-- 使用空状态组件 -->
          <EmptyState v-if="filteredOrders.length === 0" :text="emptyText" show-button />
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <OrderPayModal v-model="showPayModal" :order="payOrder" @confirm="handlePayConfirm" />

    <!-- 订单详情弹窗 -->
    <OrderDetailModal v-model="showDetailModal" :order="detailOrder" @contact="contactService" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import OrderCard from '@/components/order/OrderCard.vue'
import EmptyState from '@/components/order/EmptyState.vue'
import OrderPayModal from '@/components/order/OrderPayModal.vue'
import OrderDetailModal from '@/components/order/OrderDetailModal.vue'

const activeTab = ref('all')

// 弹窗状态
const showPayModal = ref(false)
const showDetailModal = ref(false)
const payOrder = ref({})
const detailOrder = ref({})

// 存储定时器ID
let timers = []

// 空状态文本
const emptyText = computed(() => {
  if (activeTab.value === 'all') return '暂无订单'
  const tab = tabs.value.find((t) => t.key === activeTab.value)
  return `暂无${tab?.label || ''}订单`
})

// Tab 配置
const tabs = ref([
  { key: 'all', label: '全部', count: 6 },
  { key: 'pending', label: '待付款', count: 2 },
  { key: 'unused', label: '待使用', count: 2 },
  { key: 'completed', label: '已完成', count: 1 },
  { key: 'cancelled', label: '已取消', count: 1 }
])

// 统计卡片配置
const stats = ref([
  { key: 'all', label: '全部订单', count: 6 },
  { key: 'pending', label: '待付款', count: 2 },
  { key: 'unused', label: '待使用', count: 2 },
  { key: 'completed', label: '已完成', count: 1 },
  { key: 'cancelled', label: '已取消', count: 1 }
])

// 计算距离游玩日期的天数
const getDaysUntilTravel = (dateStr) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const travelDate = new Date(dateStr)
  travelDate.setHours(0, 0, 0, 0)
  const diffTime = travelDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 ? diffDays : 0
}

// 格式化倒计时
const formatCountdown = (seconds) => {
  if (seconds <= 0) return '已超时'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 订单数据
const ordersData = ref([
  {
    id: 1,
    orderNo: '202501150001',
    name: '九寨沟门票',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=200&auto=format',
    date: '2025-02-01',
    quantity: 2,
    total: 598,
    createTime: '2025-01-15 14:30',
    status: 'pending',
    statusText: '待付款',
    ticketType: '成人票',
    contactName: '张三',
    contactPhone: '13800138001',
    remainingSeconds: 15 * 60
  },
  {
    id: 2,
    orderNo: '202501100002',
    name: '西湖游船票',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=200&auto=format',
    date: '2025-01-20',
    quantity: 3,
    total: 297,
    createTime: '2025-01-10 10:15',
    status: 'unused',
    statusText: '待使用',
    ticketType: '成人票',
    contactName: '李四',
    contactPhone: '13800138002'
  },
  {
    id: 3,
    orderNo: '202501050003',
    name: '黄山风景区',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=200&auto=format',
    date: '2025-01-18',
    quantity: 2,
    total: 576,
    createTime: '2025-01-05 09:20',
    status: 'pending',
    statusText: '待付款',
    ticketType: '成人票',
    contactName: '王五',
    contactPhone: '13800138003',
    remainingSeconds: 8 * 60
  },
  {
    id: 4,
    orderNo: '202412200004',
    name: '张家界套票',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format',
    date: '2024-12-25',
    quantity: 1,
    total: 488,
    createTime: '2024-12-20 09:45',
    status: 'completed',
    statusText: '已完成',
    ticketType: '成人票',
    contactName: '赵六',
    contactPhone: '13800138004'
  },
  {
    id: 5,
    orderNo: '202412150005',
    name: '故宫博物院',
    image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=200&auto=format',
    date: '2025-01-20',
    quantity: 2,
    total: 120,
    createTime: '2024-12-15 16:20',
    status: 'unused',
    statusText: '待使用',
    ticketType: '儿童票',
    contactName: '小明',
    contactPhone: '13800138005'
  },
  {
    id: 6,
    orderNo: '202412010006',
    name: '漓江竹筏',
    image: 'https://images.unsplash.com/photo-1551634979-2b11f8c946fe?q=80&w=200&auto=format',
    date: '2024-12-10',
    quantity: 3,
    total: 360,
    createTime: '2024-12-01 11:00',
    status: 'cancelled',
    statusText: '已取消',
    ticketType: '成人票',
    contactName: '孙七',
    contactPhone: '13800138006'
  }
])

// 初始化订单数据
const initOrders = () => {
  ordersData.value.forEach((order) => {
    if (order.status === 'pending') {
      if (order.remainingSeconds === undefined) {
        order.remainingSeconds = 15 * 60
      }
      order.countdownText = formatCountdown(order.remainingSeconds)
    } else if (order.status === 'unused') {
      order.daysUntilTravel = getDaysUntilTravel(order.date)
    }
  })
}

// 启动倒计时
const startCountdown = () => {
  timers.forEach((timer) => clearInterval(timer))
  timers = []

  ordersData.value.forEach((order) => {
    if (order.status === 'pending' && order.remainingSeconds > 0) {
      const timer = setInterval(() => {
        if (order.remainingSeconds > 0) {
          order.remainingSeconds--
          order.countdownText = formatCountdown(order.remainingSeconds)

          if (order.remainingSeconds === 0) {
            order.status = 'cancelled'
            order.statusText = '已取消'
            order.countdownText = '已超时'
            updateStatsCount()
            clearInterval(timer)
          }
        }
      }, 1000)
      timers.push(timer)
    }
  })
}

// 更新统计数据
const updateStatsCount = () => {
  const pendingCount = ordersData.value.filter((o) => o.status === 'pending').length
  const unusedCount = ordersData.value.filter((o) => o.status === 'unused').length
  const completedCount = ordersData.value.filter((o) => o.status === 'completed').length
  const cancelledCount = ordersData.value.filter((o) => o.status === 'cancelled').length
  const totalCount = ordersData.value.length

  tabs.value.forEach((tab) => {
    if (tab.key === 'all') tab.count = totalCount
    if (tab.key === 'pending') tab.count = pendingCount
    if (tab.key === 'unused') tab.count = unusedCount
    if (tab.key === 'completed') tab.count = completedCount
    if (tab.key === 'cancelled') tab.count = cancelledCount
  })

  stats.value.forEach((stat) => {
    if (stat.key === 'all') stat.count = totalCount
    if (stat.key === 'pending') stat.count = pendingCount
    if (stat.key === 'unused') stat.count = unusedCount
    if (stat.key === 'completed') stat.count = completedCount
    if (stat.key === 'cancelled') stat.count = cancelledCount
  })
}

// 计算属性
const orders = computed(() => ordersData.value)

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter((order) => order.status === activeTab.value)
})

// 弹窗方法
const openPayModal = (order) => {
  payOrder.value = { ...order }
  showPayModal.value = true
}

const handlePayConfirm = (order) => {
  const targetOrder = ordersData.value.find((o) => o.id === order.id)
  if (targetOrder) {
    targetOrder.status = 'unused'
    targetOrder.statusText = '待使用'
    targetOrder.daysUntilTravel = getDaysUntilTravel(targetOrder.date)
    updateStatsCount()
  }
  alert(`支付成功！\n订单号：${order.orderNo}\n金额：¥${order.total}`)
}

const openDetailModal = (order) => {
  detailOrder.value = { ...order }
  showDetailModal.value = true
}

const cancelOrder = (id) => {
  const order = ordersData.value.find((o) => o.id === id)
  if (order && order.status === 'pending') {
    order.status = 'cancelled'
    order.statusText = '已取消'
    updateStatsCount()
    alert('订单已取消')
  }
}

const contactService = () => {
  alert('客服热线：400-123-4567\n在线时间：09:00-21:00')
}

const goReview = (id) => {
  alert('评价功能开发中')
}

// 生命周期
onMounted(() => {
  initOrders()
  startCountdown()
})

onUnmounted(() => {
  timers.forEach((timer) => clearInterval(timer))
})
</script>

<style scoped>
.my-orders {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.orders-card {
  width: 900px;
  background: #fff;
  border-radius: 20px;
  padding: 32px 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 140px);
}

.card-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1a2c3e;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 20px;
  flex-shrink: 0;
}

/* 统计卡片 */
.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.stat-card {
  flex: 1;
  background: #f8fafc;
  border-radius: 14px;
  padding: 10px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.stat-num {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #1a2c3e;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #8a94a6;
}

/* Tab 样式 */
.order-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e8ecf0;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.tab {
  padding: 8px 20px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #8a94a6;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab:hover {
  color: #18b57d;
}

.tab.active {
  color: #18b57d;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #18b57d;
}

.tab-count {
  background: #f1f5f9;
  padding: 0 5px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: normal;
}

/* 订单列表滚动区域 */
.order-list-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 4px;
}

.order-list-wrapper::-webkit-scrollbar {
  width: 6px;
}

.order-list-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.order-list-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.order-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .orders-card {
    width: 95%;
    padding: 20px;
  }

  .stats-row {
    gap: 8px;
  }

  .stat-card {
    padding: 8px 4px;
  }

  .stat-num {
    font-size: 18px;
  }

  .stat-label {
    font-size: 10px;
  }

  .tab {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
