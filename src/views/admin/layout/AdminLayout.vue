<template>
  <div class="admin-layout">
    <!-- 左侧菜单 -->
    <aside class="sidebar">
      <div class="logo-box">
        <img class="logo" src="../../../assets/tubiao.png" alt="logo" />
        <div class="logo-text">
          <h2>旅游景区管理系统</h2>
          <p>Tourist Attraction System</p>
        </div>
      </div>

      <div class="menu-list">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="menu-item"
          active-class="active"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </div>

      <div class="sidebar-banner">
        <img
          src="../../../assets/banner-watercolor.png"
          class="sidebar-banner-img"
        />
        <div class="sidebar-text">
          <h3>探索自然之美</h3>
          <p>开启美好旅程</p>
        </div>
      </div>
    </aside>

    <!-- 右侧主区域 -->
    <main class="main-container">
      <div class="main-content">
        <!-- 顶部栏 -->
        <div class="topbar">
          <div></div>
          <div class="top-right">
            <img
              class="avatar"
              src="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <span class="admin-name">管理员</span>
          </div>
        </div>

        <!-- 路由出口包装器 - 自动撑满剩余空间 -->
        <div class="router-view-wrapper">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  House,
  User,
  Tickets,
  Location,
  Grid,
  ChatDotRound,
  Notebook,
  UserFilled,
  Bell,
} from "@element-plus/icons-vue";

const menuItems = [
  { name: "adminDashboard", label: "首页", icon: House },
  { name: "adminUser", label: "用户管理", icon: User },
  { name: "adminOrder", label: "订单管理", icon: Tickets },
  { name: "adminSpot", label: "景区管理", icon: Location },
  { name: "adminCategory", label: "景区分类", icon: Grid },
  { name: "adminComment", label: "评论管理", icon: ChatDotRound },
  { name: "adminGuide", label: "攻略管理", icon: Notebook },
  { name: "adminAdmin", label: "管理员管理", icon: UserFilled },
  { name: "adminNotice", label: "公告管理", icon: Bell },
];
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* ========= 左侧菜单样式 ========= */
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #ffffff;
  border-right: 1px solid #eef2f6;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
}
.logo-text {
  line-height: 1.2;
  white-space: nowrap;
}
.logo-text h2 {
  font-size: 18px;
  color: #14263f;
  font-weight: 700;
  margin-bottom: 2px;
  white-space: nowrap;
}
.logo-text p {
  color: #94a3b8;
  font-size: 11px;
  white-space: nowrap;
}

.menu-list {
  margin-top: 48px;
}
.menu-item {
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
  margin-bottom: 12px;
  color: #475569;
  cursor: pointer;
  transition: 0.25s;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
}
.menu-item .el-icon {
  font-size: 22px;
}
.menu-item span {
  font-size: 16px;
}
.menu-item:hover {
  background: #f2fbf6;
  color: #18b57d;
}
.menu-item.active {
  background: #eefaf5;
  color: #18b57d;
  font-weight: 600;
}

.sidebar-banner {
  margin-top: auto;
  position: relative;
  height: 280px;
  border-radius: 28px;
  overflow: hidden;
}
.sidebar-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sidebar-text {
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 2;
}
.sidebar-text h3 {
  color: #18b57d;
  font-size: 22px;
  font-weight: 800;
}
.sidebar-text p {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 13px;
}

/* ========= 右侧主区域样式 ========= */
.main-container {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
  background: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.topbar {
  height: 68px;
  background: #ffffff;
  border-radius: 20px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f2f5;
  flex-shrink: 0; /* 防止顶部栏被压缩 */
}

.top-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.admin-name {
  color: #14263f;
  font-weight: 600;
  font-size: 15px;
}

/* 关键：router-view 包装器，自动撑满剩余空间 */
.router-view-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 让 router-view 内的所有页面自动撑满 */
.router-view-wrapper :deep(.user-manage),
.router-view-wrapper :deep(.order-manage),
.router-view-wrapper :deep(.spot-manage),
.router-view-wrapper :deep(.category-manage),
.router-view-wrapper :deep(.comment-manage),
.router-view-wrapper :deep(.guide-manage),
.router-view-wrapper :deep(.admin-manage),
.router-view-wrapper :deep(.notice-manage) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 让表格包装器自动撑满 */
.router-view-wrapper :deep(.table-wrapper) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 让表格自动撑满 */
.router-view-wrapper :deep(.user-table),
.router-view-wrapper :deep(.order-table),
.router-view-wrapper :deep(.spot-table),
.router-view-wrapper :deep(.category-table),
.router-view-wrapper :deep(.comment-table),
.router-view-wrapper :deep(.guide-table),
.router-view-wrapper :deep(.admin-table),
.router-view-wrapper :deep(.notice-table) {
  flex: 1;
}

/* 分页自动贴底 */
.router-view-wrapper :deep(.pagination-wrapper),
.router-view-wrapper :deep(.pagination) {
  margin-top: auto;
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-container {
    padding: 20px;
  }
}

@media (max-width: 800px) {
  .sidebar {
    width: 220px;
    min-width: 220px;
  }
  .topbar {
    padding: 0 16px;
  }
  .top-right {
    gap: 10px;
  }
  .avatar {
    width: 32px;
    height: 32px;
  }
}
</style>
