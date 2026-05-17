<!-- views/web/profile/my-favorites.vue -->
<template>
  <div class="my-favorites">
    <div class="favorites-card">
      <h2 class="card-title">我的收藏</h2>

      <!-- Tab 切换 -->
      <div class="favorite-tabs">
        <button :class="['tab', { active: activeTab === 'spot' }]" @click="activeTab = 'spot'">
          景点收藏
          <span class="tab-count">{{ spotFavorites.length }}</span>
        </button>
        <button
          :class="['tab', { active: activeTab === 'strategy' }]"
          @click="activeTab = 'strategy'"
        >
          攻略收藏
          <span class="tab-count">{{ strategyFavorites.length }}</span>
        </button>
      </div>

      <!-- 景点收藏列表 -->
      <div v-if="activeTab === 'spot'" class="favorite-list">
        <div
          v-for="item in spotFavorites"
          :key="item.id"
          class="favorite-item"
          @click="viewSpot(item.id)"
        >
          <img :src="item.image" class="item-image" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.desc }}</p>
            <div class="item-meta">
              <span class="location">
                <el-icon><Location /></el-icon>
                {{ item.city }}
              </span>
              <span class="price">¥{{ item.price }}起</span>
            </div>
          </div>
          <button class="remove-btn" @click.stop="removeFavorite(item.id, 'spot')">
            <el-icon><Close /></el-icon>
          </button>
        </div>
        <div v-if="spotFavorites.length === 0" class="empty-state">
          <div class="empty-icon">
            <el-icon><Star /></el-icon>
          </div>
          <p>暂无收藏景点</p>
          <router-link to="/category" class="go-btn">去收藏景点</router-link>
        </div>
      </div>

      <!-- 攻略收藏列表 -->
      <div v-else class="favorite-list">
        <div
          v-for="item in strategyFavorites"
          :key="item.id"
          class="favorite-item"
          @click="viewStrategy(item.id)"
        >
          <img :src="item.image" class="item-image" />
          <div class="item-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="item-meta">
              <span class="date">
                <el-icon><Calendar /></el-icon>
                {{ item.createTime }}
              </span>
            </div>
          </div>
          <button class="remove-btn" @click.stop="removeFavorite(item.id, 'strategy')">
            <el-icon><Close /></el-icon>
          </button>
        </div>
        <div v-if="strategyFavorites.length === 0" class="empty-state">
          <div class="empty-icon">
            <el-icon><Document /></el-icon>
          </div>
          <p>暂无收藏攻略</p>
          <router-link to="/strategy" class="go-btn">去收藏攻略</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Close, Location, Star, Calendar, Document } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('spot')

// 景点收藏数据
const spotFavorites = ref([
  {
    id: 1,
    name: '九寨沟',
    desc: '五彩湖泊与雪山森林交织成童话般景色，被誉为"人间仙境"。',
    city: '四川·九寨沟',
    price: 299,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=200&auto=format'
  },
  {
    id: 2,
    name: '西湖',
    desc: '江南烟雨与古典园林融合的诗意风景，苏堤春晓、断桥残雪。',
    city: '浙江·杭州',
    price: 199,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=200&auto=format'
  },
  {
    id: 3,
    name: '黄山',
    desc: '五岳归来不看山，黄山归来不看岳，奇松怪石云海温泉。',
    city: '安徽·黄山',
    price: 230,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=200&auto=format'
  }
])

// 攻略收藏数据（只保留标题、描述、时间、图片）
const strategyFavorites = ref([
  {
    id: 1,
    title: '九寨沟四季游玩全攻略，每个季节都有不同的美',
    desc: '九寨沟被誉为"人间仙境"，四季景色各异。春季山花烂漫，夏季绿树成荫...',
    createTime: '2025-01-15',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=200&auto=format'
  },
  {
    id: 2,
    title: '杭州西湖三日游最佳路线，看完这篇就够了',
    desc: '西湖、灵隐寺、宋城、龙井村...三天时间怎么玩最合理？这份攻略带你深度游杭州...',
    createTime: '2025-01-10',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=200&auto=format'
  }
])

const viewSpot = (id) => {
  router.push(`/detail/${id}`)
}

const viewStrategy = (id) => {
  router.push(`/strategy/${id}`)
}

const removeFavorite = (id, type) => {
  if (type === 'spot') {
    const index = spotFavorites.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      spotFavorites.value.splice(index, 1)
      alert('已取消收藏')
    }
  } else {
    const index = strategyFavorites.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      strategyFavorites.value.splice(index, 1)
      alert('已取消收藏')
    }
  }
}
</script>

<style scoped>
.my-favorites {
  display: flex;
  justify-content: center;
  width: 100%;
}

.favorites-card {
  width: 900px;
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

.favorite-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e8ecf0;
  margin-bottom: 24px;
}

.tab {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #8a94a6;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab:hover {
  color: #1ec58b;
}

.tab.active {
  color: #1ec58b;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1ec58b;
}

.tab-count {
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  display: flex;
  gap: 16px;
  border: 1px solid #e8ecf0;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
}

.favorite-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.item-image {
  width: 120px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a2c3e;
  margin: 0 0 8px 0;
}

.item-info p {
  font-size: 13px;
  color: #7a9588;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8a94a6;
  align-items: center;
}

.item-meta .el-icon {
  font-size: 12px;
  margin-right: 2px;
}

.location,
.date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price {
  color: #ff6a00;
  font-weight: 500;
}

.remove-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.remove-btn:hover {
  background: #fee;
  border-color: #e53e3e;
  color: #e53e3e;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.4;
  display: flex;
  justify-content: center;
}

.empty-icon .el-icon {
  font-size: 64px;
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
