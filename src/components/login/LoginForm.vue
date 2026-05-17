<!-- components/LoginForm.vue -->
<template>
  <div class="login-form-wrapper">
    <div class="form-container">
      <div class="form-group">
        <input v-model="form.phone" type="text" placeholder="请输入手机号" class="form-input" />
      </div>
      <div class="form-group">
        <input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          class="form-input"
        />
      </div>
      <div class="form-options">
        <label class="checkbox">
          <input type="checkbox" v-model="form.remember" />
          <span>记住我</span>
        </label>
        <a href="#" class="forgot">忘记密码?</a>
      </div>
      <button class="submit-btn" @click="handleLogin">登 录</button>
      <div class="admin-link" @click="switchToAdmin">
        <span>管理员登录 →</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['login', 'switchToAdmin'])

const form = reactive({
  phone: '',
  password: '',
  remember: false
})

const handleLogin = () => {
  // 表单验证
  if (!form.phone) {
    alert('请输入手机号')
    return
  }
  if (!form.password) {
    alert('请输入密码')
    return
  }

  // 触发登录事件
  emit('login', {
    phone: form.phone,
    password: form.password,
    remember: form.remember
  })
}

const switchToAdmin = () => {
  emit('switchToAdmin')
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
}

.checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #18b57d;
}

.forgot {
  color: #18b57d;
  text-decoration: none;
  font-size: 14px;
}

.forgot:hover {
  text-decoration: underline;
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

.admin-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e8ecf0;
}

.admin-link span {
  color: #18b57d;
  cursor: pointer;
  font-size: 14px;
}

.admin-link span:hover {
  text-decoration: underline;
}
</style>
