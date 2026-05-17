<template>
  <div>
    <!-- 欢迎卡片 -->
    <section class="welcome-card">
      <div class="welcome-content">
        <h1>欢迎回来，管理员 👋</h1>
        <p>旅游景区管理系统后台</p>
        <span>高效管理 · 轻松运营</span>
      </div>
      <img src="@/assets/banner-watercolor.png" class="welcome-bg" />
    </section>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon green-bg">
          <el-icon><Location /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">128</div>
          <div class="stat-label">景区总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue-bg">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">1,234</div>
          <div class="stat-label">用户总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange-bg">
          <el-icon><Tickets /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">356</div>
          <div class="stat-label">订单总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple-bg">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">12.5k</div>
          <div class="stat-label">今日访问</div>
        </div>
      </div>
    </div>

    <!-- 待处理事项 + 系统公告 -->
    <div class="two-columns">
      <!-- 待处理事项 -->
      <div class="todo-wrapper">
        <h2 class="section-title">待处理事项</h2>
        <div class="todo-list">
          <div class="todo-item">
            <div class="todo-left green">
              <el-icon><Tickets /></el-icon>
              <p>待处理订单</p>
              <h2>12</h2>
            </div>
            <el-icon class="todo-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="todo-item">
            <div class="todo-left blue">
              <el-icon><ChatLineSquare /></el-icon>
              <p>用户咨询</p>
              <h2>5</h2>
            </div>
            <el-icon class="todo-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="todo-item">
            <div class="todo-left orange">
              <el-icon><WarningFilled /></el-icon>
              <p>景区审核</p>
              <h2>3</h2>
            </div>
            <el-icon class="todo-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="todo-item">
            <div class="todo-left purple">
              <el-icon><ChatDotRound /></el-icon>
              <p>待审核评论</p>
              <h2>8</h2>
            </div>
            <el-icon class="todo-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <!-- 系统公告 -->
      <div class="notice-wrapper">
        <div class="notice-header">
          <h2 class="section-title">系统公告</h2>
          <span class="more">查看更多 ></span>
        </div>
        <div class="notice-item">
          <div class="dot"></div>
          <p>关于系统维护升级的通知</p>
          <span class="date">06-07</span>
        </div>
        <div class="notice-item">
          <div class="dot"></div>
          <p>五一假期景区运营安排</p>
          <span class="date">04-28</span>
        </div>
        <div class="notice-item">
          <div class="dot"></div>
          <p>新增景区审核规范</p>
          <span class="date">04-20</span>
        </div>
        <div class="notice-item">
          <div class="dot"></div>
          <p>探索自然之美</p>
          <span class="date">03-15</span>
        </div>
      </div>
    </div>

    <!-- 功能导航 -->
    <section class="func-section">
      <h2 class="section-title">功能导航</h2>
      <div class="func-navigation">
        <div class="func-card" @click="goTo('adminUser')">
          <el-icon><User /></el-icon>
          <h3>用户管理</h3>
          <p>管理系统用户信息</p>
          <button>进入管理</button>
        </div>
        <div class="func-card" @click="goTo('adminOrder')">
          <el-icon><Tickets /></el-icon>
          <h3>订单管理</h3>
          <p>查看和处理订单</p>
          <button>进入管理</button>
        </div>
        <div class="func-card" @click="goTo('adminSpot')">
          <el-icon><Location /></el-icon>
          <h3>景区管理</h3>
          <p>管理景区资源信息</p>
          <button>进入管理</button>
        </div>
        <div class="func-card" @click="goTo('adminCategory')">
          <el-icon><Grid /></el-icon>
          <h3>景区分类</h3>
          <p>管理景区分类体系</p>
          <button>进入管理</button>
        </div>
        <div class="func-card" @click="goTo('adminComment')">
          <el-icon><ChatDotRound /></el-icon>
          <h3>评论管理</h3>
          <p>审核与管理用户评论</p>
          <button>进入管理</button>
        </div>
        <div class="func-card" @click="goTo('adminGuide')">
          <el-icon><Notebook /></el-icon>
          <h3>攻略管理</h3>
          <p>发布和管理旅游攻略</p>
          <button>进入管理</button>
        </div>
        <div class="func-card" @click="goTo('adminAdmin')">
          <el-icon><UserFilled /></el-icon>
          <h3>管理员管理</h3>
          <p>配置系统管理员</p>
          <button>进入管理</button>
        </div>
        <div class="func-card" @click="goTo('adminNotice')">
          <el-icon><Bell /></el-icon>
          <h3>公告管理</h3>
          <p>发布系统公告通知</p>
          <button>进入管理</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  User,
  Tickets,
  Location,
  Grid,
  ArrowRight,
  ChatLineSquare,
  WarningFilled,
  ChatDotRound,
  Notebook,
  UserFilled,
  Bell,
  View
} from '@element-plus/icons-vue'

const router = useRouter()

const goTo = (name) => {
  router.push({ name })
}
</script>

<style scoped>
/* 欢迎卡片 */
.welcome-card {
  margin-top: 24px;
  height: 200px;
  border-radius: 30px;
  background: #eefaf5;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-left: 56px;
}
.welcome-content {
  position: relative;
  z-index: 2;
}
.welcome-content h1 {
  font-size: 36px;
  color: #14263f;
  font-weight: 700;
}
.welcome-content p {
  margin-top: 10px;
  color: #64748b;
  font-size: 18px;
}
.welcome-content span {
  display: inline-block;
  margin-top: 14px;
  color: #18b57d;
  font-size: 15px;
}
.welcome-bg {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: auto;
  opacity: 0.3;
  z-index: 1;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 32px;
}
.stat-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f5f5f5;
}
.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon .el-icon {
  font-size: 28px;
}
.stat-info {
  flex: 1;
}
.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #14263f;
  line-height: 1.2;
}
.stat-label {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 4px;
}
.green-bg {
  background: #e8f7f0;
  color: #18b57d;
}
.blue-bg {
  background: #eef2ff;
  color: #4a8cff;
}
.orange-bg {
  background: #fff0ed;
  color: #ff9f43;
}
.purple-bg {
  background: #f3e8ff;
  color: #a855f7;
}

/* 公用标题 */
.section-title {
  font-size: 24px;
  color: #14263f;
  font-weight: 700;
  margin-bottom: 20px;
}

/* 两列布局 */
.two-columns {
  margin-top: 32px;
  display: flex;
  gap: 24px;
}
.todo-wrapper {
  flex: 2;
  background: #ffffff;
  border-radius: 28px;
  padding: 24px 22px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f5f5f5;
}
.notice-wrapper {
  flex: 1.2;
  background: #ffffff;
  border-radius: 28px;
  padding: 24px 22px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f5f5f5;
}
.todo-list {
  display: flex;
  gap: 20px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.todo-item {
  flex: 1;
  min-width: 140px;
  background: #f8fafc;
  border-radius: 24px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.2s;
  cursor: pointer;
}
.todo-item:hover {
  background: #f1f5f9;
}
.todo-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.todo-left .el-icon {
  font-size: 24px;
}
.todo-left p {
  font-size: 14px;
  font-weight: 500;
}
.todo-left h2 {
  font-size: 28px;
  font-weight: 700;
  margin-top: 4px;
  color: #14263f;
}
.todo-arrow {
  font-size: 20px;
  color: #cbd5e1;
}
.green {
  color: #18b57d;
}
.blue {
  color: #4a8cff;
}
.orange {
  color: #ff9f43;
}
.purple {
  color: #a855f7;
}

/* 系统公告 */
.notice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.notice-header .section-title {
  margin-bottom: 0;
}
.more {
  color: #18b57d;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}
.notice-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #f0f2f5;
}
.notice-item:last-child {
  border-bottom: none;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #18b57d;
  margin-right: 14px;
  flex-shrink: 0;
}
.notice-item p {
  flex: 1;
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}
.date {
  color: #94a3b8;
  font-size: 12px;
  white-space: nowrap;
}

/* 功能导航 */
.func-section {
  margin-top: 40px;
}
.func-navigation {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 8px;
}
.func-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 26px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: 0.2s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f5f5f5;
  cursor: pointer;
}
.func-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
}
.func-card .el-icon {
  font-size: 36px;
  color: #18b57d;
  margin-bottom: 16px;
}
.func-card h3 {
  font-size: 18px;
  color: #14263f;
  font-weight: 700;
  margin-bottom: 8px;
}
.func-card p {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 18px;
}
.func-card button {
  padding: 8px 20px;
  border: 1px solid #18b57d;
  background: #fff;
  border-radius: 40px;
  color: #18b57d;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: 0.2s;
}
.func-card button:hover {
  background: #18b57d;
  color: #fff;
  border-color: #18b57d;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .func-navigation {
    grid-template-columns: repeat(2, 1fr);
  }
  .two-columns {
    flex-direction: column;
  }
}
@media (max-width: 800px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
