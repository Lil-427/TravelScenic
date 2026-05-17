<!-- views/web/layout/web-layout.vue -->
<template>
  <div class="web-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo-box" @click="goToHome">
        <img class="logo" :src="tubiao" />
        <div>
          <h2>旅游景区管理系统</h2>
          <p>Tourist Attraction Management System</p>
        </div>
      </div>

      <div class="nav">
        <router-link to="/" class="nav-item" active-class="active" exact-active-class="active">
          首页
        </router-link>
        <router-link to="/category" class="nav-item" active-class="active"> 景点 </router-link>
        <router-link to="/strategy" class="nav-item" active-class="active"> 攻略 </router-link>
        <router-link to="/search" class="nav-item" active-class="active"> 搜索 </router-link>
        <router-link to="/profile" class="nav-item" active-class="active"> 个人中心 </router-link>
      </div>

      <div class="header-right">
        <!-- 已登录状态：显示头像下拉菜单 -->
        <el-dropdown v-if="isLoggedIn" trigger="click" @command="handleCommand">
          <div class="avatar-wrapper">
            <img class="avatar" :src="userInfo.avatar" />
            <span class="username">欢迎，{{ userInfo.username }}</span>
            <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item command="orders">
                <el-icon><Document /></el-icon>
                我的订单
              </el-dropdown-item>
              <el-dropdown-item command="favorites">
                <el-icon><Star /></el-icon>
                我的收藏
              </el-dropdown-item>
              <el-dropdown-item command="likes">
                <el-icon><Pointer /></el-icon>
                我的点赞
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 未登录状态：显示默认头像，点击跳转登录 -->
        <div v-else class="avatar-wrapper" @click="goToLogin">
          <img class="avatar" :src="defaultAvatar" />
          <span class="username">未登录</span>
        </div>
      </div>
    </header>

    <!-- 内容区域（子路由出口） -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, User, Document, Star, Pointer, SwitchButton } from '@element-plus/icons-vue'
import tubiao from '@/assets/tubiao.png'
import defaultAvatarImg from '@/assets/default-avatar.png'

const router = useRouter()
const route = useRoute()

// 用户登录状态
const isLoggedIn = ref(false)

// 默认头像（未登录时使用）
const defaultAvatar = defaultAvatarImg

// 用户信息
const userInfo = ref({
  username: '张三',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
})

// 检查登录状态（从 localStorage 或 store 中获取）
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('userInfo')

  if (token && user) {
    isLoggedIn.value = true
    try {
      const userData = JSON.parse(user)
      userInfo.value = {
        username: userData.username || '用户',
        avatar: userData.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
      }
    } catch (e) {
      console.error('解析用户信息失败', e)
    }
  } else {
    isLoggedIn.value = false
  }
}

// 跳转到首页
const goToHome = () => {
  router.push('/')
}

// 跳转到登录页
const goToLogin = () => {
  // 保存当前页面，登录后跳转回来
  const redirect = route.fullPath
  router.push({
    path: '/login',
    query: { redirect }
  })
}

// 处理下拉菜单点击
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'orders':
      router.push('/profile/orders')
      break
    case 'favorites':
      router.push('/profile/favorites')
      break
    case 'likes':
      router.push('/profile/likes')
      break
    case 'logout':
      handleLogout()
      break
    default:
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // 清除登录状态
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      sessionStorage.clear()

      isLoggedIn.value = false
      ElMessage.success('已退出登录')

      // 如果当前在个人中心相关页面，跳转到首页
      if (route.path.startsWith('/profile')) {
        router.push('/')
      }
    })
    .catch(() => {})
}

onMounted(() => {
  checkLoginStatus()

  // 监听 storage 变化（用于多标签页同步）
  window.addEventListener('storage', (e) => {
    if (e.key === 'token') {
      checkLoginStatus()
    }
  })
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.web-layout {
  min-height: 100vh;
  background: #f5f7f9;
  font-family: 'Source Han Sans SC', sans-serif;
}

/* 顶部导航 */
.header {
  height: 82px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 70px;
  border-bottom: 1px solid #edf1f4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}

.logo {
  width: 56px;
  height: 56px;
}

.logo-box h2 {
  font-size: 20px;
  color: #14263f;
  font-weight: 700;
}

.logo-box p {
  font-size: 12px;
  color: #8a94a6;
  margin-top: 2px;
}

.nav {
  display: flex;
  gap: 52px;
}

.nav-item {
  font-size: 16px;
  color: #222;
  cursor: pointer;
  position: relative;
  transition: 0.3s;
  text-decoration: none;
}

.nav-item:hover {
  color: #18b57d;
}

.nav .active {
  color: #18b57d;
  font-weight: 600;
}

.nav .active::after {
  content: '';
  width: 28px;
  height: 3px;
  border-radius: 30px;
  background: #18b57d;
  position: absolute;
  left: 50%;
  bottom: -18px;
  transform: translateX(-50%);
}

.header-right {
  display: flex;
  align-items: center;
}

/* 头像下拉区域（通用样式，已登录和未登录共用） */
.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 40px;
  transition: background 0.3s;
}

.avatar-wrapper:hover {
  background: #f5f7f9;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.arrow-icon {
  font-size: 14px;
  color: #8a94a6;
  transition: transform 0.3s;
}

.avatar-wrapper:hover .arrow-icon {
  color: #18b57d;
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu) {
  border-radius: 12px;
  padding: 8px 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  margin-top: 8px;
}

:deep(.el-dropdown-menu__item) {
  padding: 10px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f0fdf6;
  color: #1ec58b;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
}

:deep(.el-popper) {
  border: none;
}

.main-content {
  min-height: calc(100vh - 82px);
}

/* 响应式 */
@media (max-width: 1100px) {
  .header {
    padding: 0 30px;
  }

  .nav {
    gap: 30px;
  }

  .username {
    display: none;
  }

  .avatar-wrapper {
    padding: 6px 8px;
  }
}

@media (max-width: 900px) {
  .nav {
    gap: 20px;
  }

  .nav-item {
    font-size: 14px;
  }

  .logo-box p {
    display: none;
  }

  .logo-box h2 {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 20px;
    flex-wrap: wrap;
    height: auto;
    padding: 12px 20px;
    gap: 12px;
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 20px;
    padding-top: 8px;
    border-top: 1px solid #edf1f4;
  }

  .nav .active::after {
    bottom: -10px;
  }

  .username {
    display: none;
  }
}
</style>
