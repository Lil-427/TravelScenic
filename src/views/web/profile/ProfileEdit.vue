<!-- views/web/profile/profile-edit.vue - 修改资料 -->
<template>
  <div class="profile-edit">
    <div class="edit-card">
      <h2 class="card-title">修改资料</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-list">
          <div class="form-item">
            <label>头像</label>
            <div class="avatar-upload">
              <img :src="form.avatar" alt="头像" />
              <button type="button" class="upload-btn" @click="triggerUpload">更换头像</button>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleImageChange"
              />
            </div>
          </div>

          <div class="form-item">
            <label>昵称</label>
            <input type="text" v-model="form.nickname" placeholder="请输入昵称" />
          </div>

          <div class="form-item">
            <label>手机号</label>
            <input type="tel" v-model="form.phone" placeholder="请输入手机号" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">保存修改</button>
          <router-link to="/profile/info" class="cancel-btn">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-useless-assignment */

import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)

const form = reactive({
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '张三',
  phone: '13888888888',
  captcha: ''
})

const captchaDisabled = ref(false)
const captchaText = ref('获取验证码')
let timer = null

const sendCaptcha = () => {
  if (captchaDisabled.value) return
  captchaDisabled.value = true
  let count = 60
  captchaText.value = `${count}s`
  timer = setInterval(() => {
    count--
    if (count <= 0) {
      clearInterval(timer)
      captchaDisabled.value = false
      captchaText.value = '获取验证码'
    } else {
      captchaText.value = `${count}s`
    }
  }, 1000)
  alert('验证码：123456')
  form.captcha = '123456'
}

const triggerUpload = () => {
  fileInput.value.click()
}

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      form.avatar = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = () => {
  alert('保存成功')
  router.push('/profile/info')
}
</script>

<style scoped>
.profile-edit {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit-card {
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

.form-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 10px;
}

.form-item input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
  outline: none;
}

.form-item input:focus {
  border-color: #18b57d;
  box-shadow: 0 0 0 3px rgba(24, 181, 125, 0.1);
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-upload img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.upload-btn {
  padding: 8px 24px;
  background: #f1f5f9;
  border: none;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

.upload-btn:hover {
  background: #e2e8f0;
}

.captcha-group {
  display: flex;
  gap: 12px;
}

.captcha-group input {
  flex: 1;
}

.captcha-btn {
  padding: 0 20px;
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.captcha-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.captcha-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 16px;
  padding-top: 8px;
}

.submit-btn {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  border: none;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 181, 125, 0.35);
}

.cancel-btn {
  flex: 1;
  text-align: center;
  padding: 12px;
  background: #fff;
  color: #8a94a6;
  text-decoration: none;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 15px;
  transition: 0.3s;
}

.cancel-btn:hover {
  border-color: #18b57d;
  color: #18b57d;
}
</style>
