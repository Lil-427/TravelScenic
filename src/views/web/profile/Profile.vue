<!-- views/web/profile/profile.vue -->
<template>
  <div class="profile-container">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="user-card">
        <div class="avatar">
          <img :src="userInfo.avatar" alt="头像" />
        </div>
        <h3 class="nickname">{{ userInfo.nickname }}</h3>
        <p class="phone">{{ userInfo.phone }}</p>
      </div>

      <nav class="nav-menu">
        <router-link to="/profile/info" class="nav-item" active-class="active">
          <el-icon><User /></el-icon>
          <span>我的账号</span>
        </router-link>
        <router-link to="/profile/edit" class="nav-item" active-class="active">
          <el-icon><Edit /></el-icon>
          <span>修改资料</span>
        </router-link>
        <router-link to="/profile/orders" class="nav-item" active-class="active">
          <el-icon><Document /></el-icon>
          <span>我的订单</span>
        </router-link>
        <router-link to="/profile/comments" class="nav-item" active-class="active">
          <el-icon><ChatDotRound /></el-icon>
          <span>我的评论</span>
        </router-link>
        <router-link to="/profile/favorites" class="nav-item" active-class="active">
          <el-icon><Star /></el-icon>
          <span>我的收藏</span>
        </router-link>
        <router-link to="/profile/likes" class="nav-item" active-class="active">
          <el-icon><Pointer /></el-icon>
          <span>我的点赞</span>
        </router-link>
        <router-link to="/profile/cart" class="nav-item" active-class="active">
          <el-icon><ShoppingCart /></el-icon>
          <span>我的购物车</span>
        </router-link>
        <div class="nav-item logout" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </div>
      </nav>
    </aside>

    <!-- 右侧内容区域 -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
// 导入所有在左侧菜单中使用的图标
import {
  User, // 我的账号
  Edit, // 修改资料
  Document, // 我的订单
  ChatDotRound, // 我的评论
  Star, // 我的收藏
  Pointer, // 我的点赞 (修正: 官方库中没有 'ThumbUp'，使用实心星形图标)
  ShoppingCart, // 我的购物车
  SwitchButton // 退出登录
} from '@element-plus/icons-vue'

const router = useRouter()

const userInfo = reactive({
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '张三',
  phone: '138****8888'
})

const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  // 跳转到登录页
  router.push('/login')
}
</script>

<style scoped>
.profile-container {
  display: flex;
  min-height: calc(100vh - 82px);
  background: #f5f7f9;
}

/* ========== 左侧导航栏 ========== */
.sidebar {
  width: 280px;
  background: #fff;
  border-radius: 0 16px 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 30px 0;
}

.user-card {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f2f5;
  margin-bottom: 20px;
}

.avatar {
  width: 88px;
  height: 88px;
  margin: 0 auto 16px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #18b57d;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nickname {
  font-size: 18px;
  font-weight: 600;
  color: #1a2c3e;
  margin-bottom: 6px;
}

.phone {
  font-size: 14px;
  color: #8a94a6;
}

.nav-menu {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  color: #4a5568;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-item .el-icon {
  font-size: 18px;
  width: 20px;
}

.nav-item:hover {
  background: #f5f7f9;
  color: #18b57d;
}

.nav-item.active {
  background: #e8f8f2;
  color: #18b57d;
  border-right: 3px solid #18b57d;
}

.logout {
  margin-top: 40px;
  border-top: 1px solid #f0f2f5;
  padding-top: 20px;
  color: #e53e3e;
}

.logout:hover {
  background: #fff5f5;
  color: #e53e3e;
}

/* ========== 右侧内容区域 ========== */
.content {
  flex: 1;
  padding: 24px 32px;
}
</style>
