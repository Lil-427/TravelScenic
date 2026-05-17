<!-- views/web/profile/my-cart.vue -->
<template>
  <div class="my-cart">
    <div class="cart-card">
      <h2 class="card-title">我的购物车</h2>

      <!-- 全选栏 -->
      <div class="cart-header">
        <label class="select-all">
          <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
          <span>全选</span>
        </label>
        <span class="header-name">商品信息</span>
        <span class="header-price">单价</span>
        <span class="header-quantity">数量</span>
        <span class="header-total">小计</span>
        <span class="header-action">操作</span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <input
            type="checkbox"
            v-model="item.selected"
            class="item-checkbox"
            @change="updateSelectAll"
          />
          <div class="item-info" @click="viewSpot(item.id)">
            <img :src="item.image" class="item-image" />
            <div class="item-detail">
              <h4>{{ item.name }}</h4>
              <p>游玩日期：{{ item.date }}</p>
            </div>
          </div>
          <div class="item-price">¥{{ item.price }}</div>
          <div class="item-quantity">
            <button class="qty-btn" @click.stop="decreaseQty(item.id)">-</button>
            <span>{{ item.quantity }}</span>
            <button class="qty-btn" @click.stop="increaseQty(item.id)">+</button>
          </div>
          <div class="item-total">¥{{ item.price * item.quantity }}</div>
          <div class="item-action">
            <button class="delete-btn" @click.stop="removeItem(item.id)">删除</button>
          </div>
        </div>

        <div v-if="cartItems.length === 0" class="empty-state">
          <div class="empty-icon">🛒</div>
          <p>购物车还是空的</p>
          <router-link to="/category" class="go-btn">去逛逛</router-link>
        </div>
      </div>

      <!-- 底部结算栏 -->
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="total-info">
          <span>已选 {{ selectedCount }} 件商品</span>
          <span class="total-price">合计：¥{{ totalPrice }}</span>
        </div>
        <button class="checkout-btn" :disabled="selectedCount === 0" @click="handleCheckout">
          去结算
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 购物车数据
const cartItems = ref([
  {
    id: 1,
    name: '九寨沟门票',
    price: 299,
    quantity: 2,
    selected: true,
    date: '2025-03-15',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=200&auto=format'
  },
  {
    id: 2,
    name: '西湖游船票',
    price: 99,
    quantity: 3,
    selected: true,
    date: '2025-03-20',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=200&auto=format'
  },
  {
    id: 3,
    name: '张家界套票',
    price: 488,
    quantity: 1,
    selected: false,
    date: '2025-03-25',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format'
  }
])

// 全选状态
const selectAll = computed({
  get: () => {
    return cartItems.value.length > 0 && cartItems.value.every((item) => item.selected)
  },
  set: (value) => {
    cartItems.value.forEach((item) => {
      item.selected = value
    })
  }
})

// 选中数量
const selectedCount = computed(() => {
  return cartItems.value.filter((item) => item.selected).length
})

// 总价
const totalPrice = computed(() => {
  return cartItems.value
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 全选切换
const toggleSelectAll = () => {
  const newValue = !selectAll.value
  cartItems.value.forEach((item) => {
    item.selected = newValue
  })
}

// 更新全选状态
const updateSelectAll = () => {
  // 这个函数不需要做额外操作，computed 会自动处理
}

// 增加数量
const increaseQty = (id) => {
  const item = cartItems.value.find((i) => i.id === id)
  if (item) {
    item.quantity++
  }
}

// 减少数量
const decreaseQty = (id) => {
  const item = cartItems.value.find((i) => i.id === id)
  if (item && item.quantity > 1) {
    item.quantity--
  }
}

// 删除商品
const removeItem = (id) => {
  const index = cartItems.value.findIndex((i) => i.id === id)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

// 查看景点详情
const viewSpot = (id) => {
  router.push(`/detail/${id}`)
}

// 去结算
const handleCheckout = () => {
  alert('结算功能开发中')
}
</script>

<style scoped>
.my-cart {
  display: flex;
  justify-content: center;
  width: 100%;
}

.cart-card {
  width: 1000px;
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

.cart-header {
  display: flex;
  align-items: center;
  padding: 12px 0;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 13px;
  color: #8a94a6;
  margin-bottom: 16px;
}

.select-all {
  width: 80px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 16px;
  cursor: pointer;
}

.header-name {
  flex: 3;
}

.header-price,
.header-quantity,
.header-total {
  width: 100px;
  text-align: center;
}

.header-action {
  width: 80px;
  text-align: center;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  max-height: 500px;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f2f5;
}

.item-checkbox {
  width: 80px;
  padding-left: 16px;
}

.item-info {
  flex: 3;
  display: flex;
  gap: 16px;
  cursor: pointer;
}

.item-image {
  width: 80px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
}

.item-detail h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1a2c3e;
  margin: 0 0 6px 0;
}

.item-detail p {
  font-size: 12px;
  color: #8a94a6;
  margin: 0;
}

.item-price,
.item-total {
  width: 100px;
  text-align: center;
  font-size: 14px;
  color: #ff6a00;
  font-weight: 500;
}

.item-quantity {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.qty-btn {
  width: 26px;
  height: 26px;
  background: #f5f7f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.qty-btn:hover {
  border-color: #1ec58b;
  color: #1ec58b;
}

.item-action {
  width: 80px;
  text-align: center;
}

.delete-btn {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 13px;
}

.delete-btn:hover {
  text-decoration: underline;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f2f5;
}

.total-info {
  font-size: 14px;
  color: #4a5568;
}

.total-price {
  font-size: 22px;
  font-weight: 700;
  color: #ff6a00;
  margin-left: 16px;
}

.checkout-btn {
  padding: 12px 40px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
</style>
