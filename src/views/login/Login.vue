<!-- views/Login.vue -->
<template>
  <div class="login-wrapper">
    <!-- 背景图 -->
    <div class="bg-image"></div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 左上角 Logo -->
      <div class="logo-section" @click="goToHome">
        <img class="logo" :src="tubiao" alt="logo" />
        <div>
          <h2>旅游景区管理系统</h2>
          <p>Tourist Attraction Management System</p>
        </div>
      </div>

      <!-- 主内容区域 - 居中布局 -->
      <div class="main-content">
        <!-- 左侧标题区域 -->
        <div class="left-title">
          <div class="title-line1">探索自然之美</div>
          <div class="title-line2">开启美好旅程</div>
        </div>

        <!-- 右侧登录注册卡片 -->
        <div class="right-card">
          <!-- Tab 切换 -->
          <div class="tab-header">
            <span :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'"
              >登录</span
            >
            <span :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'"
              >注册</span
            >
          </div>

          <!-- 登录表单组件 -->
          <LoginForm
            v-if="activeTab === 'login'"
            @login="handleLogin"
            @switchToAdmin="activeTab = 'admin'"
          />

          <!-- 注册表单组件 -->
          <RegisterModal
            v-if="activeTab === 'register'"
            @register="handleRegister"
            @switchToLogin="activeTab = 'login'"
          />

          <!-- 管理员登录组件 -->
          <AdminLogin
            v-if="activeTab === 'admin'"
            @adminLogin="handleAdminLogin"
            @switchToLogin="activeTab = 'login'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import tubiao from '@/assets/tubiao.png'
import LoginForm from '@/components/login/LoginForm.vue'
import RegisterModal from '@/components/login/RegisterModal.vue'
import AdminLogin from '@/components/login/AdminLogin.vue'

const router = useRouter()
const activeTab = ref('login')

const goToHome = () => {
  router.push('/')
}

const handleLogin = (data) => {
  console.log('用户登录', data)
  // 这里写登录逻辑
  // router.push('/')
}

const handleAdminLogin = (data) => {
  console.log('管理员登录', data)
  // 这里写管理员登录逻辑
  // router.push('/admin')
}

const handleRegister = (data) => {
  console.log('用户注册', data)
  // 这里写注册逻辑
  // 注册成功后切换到登录页
  activeTab.value = 'login'
  alert('注册成功，请登录')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* 背景图 */
.bg-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/login-bg.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
}

/* 内容区域 */
.content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 30px 100px;
}

/* Logo 区域 */
.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  width: fit-content;
  margin-bottom: 80px;
}

.logo {
  width: 56px;
  height: 56px;
}

.logo-section h2 {
  font-size: 20px;
  color: #fff;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.logo-section p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* 主内容区域 - 居中布局 */
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  flex: 1;
}

/* 左侧标题 - 两行错开效果 */
.left-title {
  flex: 0 0 auto;
  text-align: right;
  transform: translate(-60px, -80px);
}

.title-line1 {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 56px;
  font-weight: normal;
  letter-spacing: 4px;
  color: #1a2c3e;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
  transform: translateX(-150px);
}

.title-line2 {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 56px;
  font-weight: normal;
  letter-spacing: 4px;
  color: #1a2c3e;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.6);
  transform: translateX(40px);
  margin-top: 50px;
}

/* 右侧卡片 */
.right-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(2px);
  margin-top: -60px;
}

/* Tab 切换 */
.tab-header {
  display: flex;
  justify-content: center;
  gap: 48px;
  border-bottom: 2px solid #e8ecf0;
  margin-bottom: 32px;
  padding-bottom: 16px;
}

.tab-header span {
  font-size: 24px;
  font-weight: 600;
  color: #8a94a6;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
}

.tab-header span.active {
  color: #18b57d;
}

.tab-header span.active::after {
  content: '';
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #18b57d;
  border-radius: 3px;
}

.tab-header span:hover {
  color: #18b57d;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 30px 60px;
  }

  .main-content {
    gap: 60px;
  }

  .left-title .indent {
    margin-left: 60px;
  }

  .right-card {
    width: 380px;
    padding: 32px 28px;
    margin-top: -40px;
  }

  .tab-header span {
    font-size: 20px;
  }
}

@media (max-width: 1000px) {
  .main-content {
    flex-direction: column;
    justify-content: center;
    gap: 50px;
  }

  .left-title {
    text-align: center;
  }

  .left-title .indent {
    margin-left: 0;
  }

  .right-card {
    margin-top: 0;
    width: 100%;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 20px 30px;
  }

  .logo-section {
    margin-bottom: 40px;
  }

  .left-title h1 {
    font-size: 36px;
  }
}
</style>
