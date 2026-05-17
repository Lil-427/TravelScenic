<!-- components/AdminLogin.vue -->
<template>
  <div class="admin-login-wrapper">
    <div class="form-container">
      <div class="form-group">
        <input
          v-model="form.account"
          type="text"
          placeholder="请输入管理员账号"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          class="form-input"
        />
      </div>
      <button class="submit-btn" @click="handleAdminLogin">管理员登录</button>
      <div class="back-link" @click="switchToLogin">
        <span>← 返回用户登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['adminLogin', 'switchToLogin'])

const form = reactive({
  account: '',
  password: ''
})

const handleAdminLogin = () => {
  if (!form.account) {
    alert('请输入管理员账号')
    return
  }
  if (!form.password) {
    alert('请输入密码')
    return
  }

  emit('adminLogin', {
    account: form.account,
    password: form.password
  })
}

const switchToLogin = () => {
  emit('switchToLogin')
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  width: 100%;
}

.form-input {
  width: 100%;
  height: 52px;
  padding: 0 18px;
  border: 1px solid #e0e4e9;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s;
  background: #fafbfc;
}

.form-input:focus {
  border-color: #18b57d;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(24, 181, 125, 0.08);
}

.submit-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
  letter-spacing: 2px;
}

.submit-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 181, 125, 0.3);
}

.back-link {
  text-align: center;
  margin-top: 16px;
}

.back-link span {
  color: #18b57d;
  cursor: pointer;
  font-size: 14px;
}

.back-link span:hover {
  text-decoration: underline;
}
</style>
