<!-- views/web/profile/profile-info.vue - 我的账号 -->
<template>
  <div class="profile-info">
    <div class="info-card">
      <h2 class="card-title">我的账号</h2>

      <div class="info-list">
        <div class="info-item">
          <div class="label">头像</div>
          <div class="value">
            <img :src="userInfo.avatar" alt="头像" class="avatar-img" />
          </div>
        </div>

        <div class="info-item">
          <div class="label">昵称</div>
          <div class="value">{{ userInfo.nickname }}</div>
        </div>

        <div class="info-item">
          <div class="label">手机号</div>
          <div class="value">{{ userInfo.phone }}</div>
        </div>

        <div class="info-item">
          <div class="label">账户状态</div>
          <div class="value">
            <span class="status-normal">正常</span>
          </div>
        </div>

        <div class="info-item">
          <div class="label">注册时间</div>
          <div class="value">{{ userInfo.regTime }}</div>
        </div>
      </div>

      <div class="action-bar">
        <router-link to="/profile/edit" class="edit-btn">编辑资料</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-useless-assignment */

import { reactive } from 'vue'

const userInfo = reactive({
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '张三',
  phone: '138****8888',
  regTime: '2024-01-15'
})
</script>

<style scoped>
.profile-info {
  display: flex;
  justify-content: center;
  width: 100%;
}

.info-card {
  width: 600px;
  background: #fff;
  border-radius: 20px;
  padding: 32px 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1a2c3e;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 28px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  width: 100px;
  font-size: 15px;
  color: #8a94a6;
  flex-shrink: 0;
}

.value {
  font-size: 15px;
  color: #2d3a4a;
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.status-normal {
  color: #18b57d;
  position: relative;
  padding-left: 16px;
}

.status-normal::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #18b57d;
  border-radius: 50%;
}

.action-bar {
  text-align: center;
  padding-top: 8px;
}

.edit-btn {
  display: inline-block;
  padding: 10px 48px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  text-decoration: none;
  border-radius: 40px;
  font-size: 15px;
  transition: all 0.3s;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 181, 125, 0.35);
}
</style>
