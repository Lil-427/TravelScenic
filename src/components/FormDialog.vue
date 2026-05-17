<template>
  <el-dialog
    v-model="visible"
    :width="width"
    class="form-dialog"
    :show-close="false"
    @close="handleClose"
  >
    <!-- 自定义头部 -->
    <template #header>
      <div class="dialog-header">
        <div>
          <h2>{{ title }}</h2>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <div class="close-btn" @click="handleClose">
          <el-icon><Close /></el-icon>
        </div>
      </div>
    </template>

    <!-- 内容 -->
    <div class="dialog-content">
      <!-- 头像上传区域（可选） -->
      <div v-if="showAvatar" class="avatar-section">
        <img class="avatar" :src="formData[avatarField]" />
        <div>
          <button class="upload-btn" @click="triggerAvatarUpload">更换头像</button>
          <p>支持 JPG、PNG 格式</p>
        </div>
        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleAvatarChange"
        />
      </div>

      <!-- 表单 - 根据配置动态渲染 -->
      <div class="form-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
        <div
          v-for="field in fields"
          :key="field.prop"
          class="form-item"
          :class="{ fullWidth: field.fullWidth }"
        >
          <label>{{ field.label }}</label>

          <!-- 输入框 -->
          <input
            v-if="field.type === 'input'"
            v-model="formData[field.prop]"
            :type="field.inputType || 'text'"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :disabled="field.disabled"
          />

          <!-- 下拉选择 -->
          <select
            v-else-if="field.type === 'select'"
            v-model="formData[field.prop]"
            :disabled="field.disabled"
          >
            <option v-for="opt in field.options" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>

          <!-- 文本域 -->
          <textarea
            v-else-if="field.type === 'textarea'"
            v-model="formData[field.prop]"
            :rows="field.rows || 4"
            :placeholder="field.placeholder || `请输入${field.label}`"
          />

          <!-- 数字输入框 -->
          <input
            v-else-if="field.type === 'number'"
            v-model.number="formData[field.prop]"
            type="number"
            :placeholder="field.placeholder || `请输入${field.label}`"
          />

          <!-- 日期选择 -->
          <input
            v-else-if="field.type === 'date'"
            v-model="formData[field.prop]"
            type="date"
            :disabled="field.disabled"
          />

          <!-- 开关（启用/禁用） -->
          <div v-else-if="field.type === 'switch'" class="switch-group">
            <button
              class="switch-btn"
              :class="{ active: formData[field.prop] === field.activeValue }"
              @click="formData[field.prop] = field.activeValue"
            >
              {{ field.activeLabel || '启用' }}
            </button>
            <button
              class="switch-btn"
              :class="{ active: formData[field.prop] === field.inactiveValue }"
              @click="formData[field.prop] = field.inactiveValue"
            >
              {{ field.inactiveLabel || '禁用' }}
            </button>
          </div>

          <!-- 默认输入框 -->
          <input v-else v-model="formData[field.prop]" />
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="submit-btn" @click="handleSubmit">保存修改</button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  // 弹窗显示状态
  modelValue: {
    type: Boolean,
    default: false
  },
  // 弹窗标题
  title: {
    type: String,
    default: '编辑'
  },
  // 副标题
  subtitle: {
    type: String,
    default: ''
  },
  // 弹窗宽度
  width: {
    type: String,
    default: '760px'
  },
  // 表单字段配置
  fields: {
    type: Array,
    required: true
  },
  // 表单数据
  formData: {
    type: Object,
    required: true
  },
  // 是否显示头像上传
  showAvatar: {
    type: Boolean,
    default: false
  },
  // 头像字段名
  avatarField: {
    type: String,
    default: 'avatar'
  },
  // 表单列数
  columns: {
    type: Number,
    default: 2
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const avatarInput = ref(null)

// 触发头像上传
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

// 处理头像上传
const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (evt) => {
      props.formData[props.avatarField] = evt.target?.result
    }
    reader.readAsDataURL(file)
  }
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 提交表单
const handleSubmit = () => {
  emit('submit', props.formData)
}
</script>

<style scoped>
/* 弹窗 */
:deep(.form-dialog) {
  border-radius: 30px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 0;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__footer) {
  padding: 0;
}

/* 头部 */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.dialog-header h2 {
  font-size: 28px;
  color: #14263f;
  margin: 0;
}

.dialog-header p {
  margin-top: 6px;
  color: #94a3b8;
}

.close-btn {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}

.close-btn:hover {
  background: #eef2f7;
}

/* 内容 */
.dialog-content {
  padding: 30px 32px;
}

/* 头像 */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 36px;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

.upload-btn {
  height: 42px;
  padding: 0 22px;
  border: none;
  border-radius: 14px;
  background: #18b57d;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.avatar-section p {
  margin-top: 10px;
  color: #94a3b8;
  font-size: 13px;
}

/* 表单网格 */
.form-grid {
  display: grid;
  gap: 22px;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-item.fullWidth {
  grid-column: span 2;
}

.form-item label {
  margin-bottom: 10px;
  font-size: 14px;
  color: #334155;
  font-weight: 600;
}

.form-item input,
.form-item select,
.form-item textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 16px;
  padding: 0 16px;
  font-size: 14px;
  transition: 0.2s;
  font-family: inherit;
}

.form-item input,
.form-item select {
  height: 48px;
}

.form-item textarea {
  padding: 12px 16px;
  resize: vertical;
}

.form-item input:focus,
.form-item select:focus,
.form-item textarea:focus {
  border-color: #18b57d;
  outline: none;
}

.form-item input:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

/* 开关按钮组 */
.switch-group {
  display: flex;
  gap: 12px;
}

.switch-btn {
  flex: 1;
  height: 48px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.switch-btn.active {
  background: #18b57d;
  color: #fff;
  border-color: #18b57d;
}

/* 底部 */
.dialog-footer {
  padding: 24px 32px 30px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  border-top: 1px solid #f1f5f9;
}

.cancel-btn,
.submit-btn {
  height: 46px;
  padding: 0 28px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.cancel-btn {
  border: 1px solid #dbe3ec;
  background: #fff;
  color: #64748b;
}

.cancel-btn:hover {
  background: #f8fafc;
}

.submit-btn {
  border: none;
  background: #18b57d;
  color: #fff;
}

.submit-btn:hover {
  opacity: 0.92;
}
</style>
