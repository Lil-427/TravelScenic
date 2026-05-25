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
        <img class="avatar" :src="localFormData[avatarField]" />
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
          :class="{ fullWidth: field.fullWidth, 'has-error': errors[field.prop] }"
        >
          <label>
            {{ field.label }}
            <span v-if="field.required" class="required-star">*</span>
          </label>

          <!-- 输入框 -->
          <input
            v-if="field.type === 'input'"
            :value="localFormData[field.prop]"
            :type="field.inputType || 'text'"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :disabled="field.disabled"
            @input="(e) => handleInput(field, e.target.value)"
            @blur="() => validateField(field, true)"
          />

          <!-- 下拉选择 -->
          <select
            v-else-if="field.type === 'select'"
            :value="localFormData[field.prop]"
            :disabled="field.disabled"
            @change="(e) => handleSelect(field, e.target.value)"
          >
            <option value="">请选择</option>
            <option v-for="opt in field.options" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>

          <!-- 文本域 -->
          <textarea
            v-else-if="field.type === 'textarea'"
            :value="localFormData[field.prop]"
            :rows="field.rows || 4"
            :placeholder="field.placeholder || `请输入${field.label}`"
            @input="(e) => handleInput(field, e.target.value)"
            @blur="() => validateField(field, true)"
          />

          <!-- 数字输入框 -->
          <input
            v-else-if="field.type === 'number'"
            :value="localFormData[field.prop]"
            type="number"
            :placeholder="field.placeholder || `请输入${field.label}`"
            @input="(e) => handleNumberInput(field, e.target.value)"
            @blur="() => validateField(field, true)"
          />

          <!-- 日期选择 -->
          <input
            v-else-if="field.type === 'date'"
            :value="localFormData[field.prop]"
            type="date"
            :disabled="field.disabled"
            @change="(e) => handleInput(field, e.target.value)"
          />

          <!-- 开关（启用/禁用） -->
          <div v-else-if="field.type === 'switch'" class="switch-group">
            <button
              class="switch-btn"
              :class="{ active: localFormData[field.prop] === field.activeValue }"
              @click="handleSwitch(field, field.activeValue)"
            >
              {{ field.activeLabel || '启用' }}
            </button>
            <button
              class="switch-btn"
              :class="{ active: localFormData[field.prop] === field.inactiveValue }"
              @click="handleSwitch(field, field.inactiveValue)"
            >
              {{ field.inactiveLabel || '禁用' }}
            </button>
          </div>

          <!-- 默认输入框 -->
          <input
            v-else
            :value="localFormData[field.prop]"
            @input="(e) => handleInput(field, e.target.value)"
          />

          <!-- 错误提示 -->
          <div v-if="errors[field.prop]" class="error-message">
            {{ errors[field.prop] }}
          </div>
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
import { ref, computed, watch, reactive } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '编辑'
  },
  subtitle: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '760px'
  },
  fields: {
    type: Array,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  showAvatar: {
    type: Boolean,
    default: false
  },
  avatarField: {
    type: String,
    default: 'avatar'
  },
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
const errors = ref({})
const touched = ref({})

// 创建本地副本，避免直接修改 props
const localFormData = reactive({ ...props.formData })

// 监听 props.formData 变化，同步到本地副本
watch(
  () => props.formData,
  (newVal) => {
    Object.keys(newVal).forEach((key) => {
      localFormData[key] = newVal[key]
    })
  },
  { deep: true }
)

// 检查值是否为空的辅助函数（数字0不算空）
const isEmptyValue = (value) => {
  if (value === undefined || value === null) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (typeof value === 'number' && value === 0) return false
  if (typeof value === 'number' && isNaN(value)) return true
  return false
}

// 验证单个字段
const validateField = (field, isBlur = false) => {
  if (isBlur && !touched.value[field.prop]) {
    touched.value[field.prop] = true
  }

  if (!isBlur && !touched.value[field.prop]) {
    return true
  }

  const value = localFormData[field.prop]
  const rules = field.rules || []

  if (rules.length === 0) {
    if (field.required && isEmptyValue(value)) {
      errors.value[field.prop] = `请输入${field.label}`
      return false
    }
    errors.value[field.prop] = ''
    return true
  }

  for (const rule of rules) {
    // 必填验证（数字0视为有效值）
    if (rule.required) {
      if (isEmptyValue(value)) {
        errors.value[field.prop] = rule.message || `请输入${field.label}`
        return false
      }
    }

    // 自定义验证器
    if (rule.validator && typeof rule.validator === 'function') {
      // 同步验证器直接调用
      try {
        let error = null
        rule.validator(rule, value, (err) => {
          error = err
        })
        if (error) {
          errors.value[field.prop] = error.message
          return false
        }
      } catch (err) {
        errors.value[field.prop] = err.message
        return false
      }
    }

    // 字符串长度验证
    if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
      errors.value[field.prop] = rule.message || `长度不能小于${rule.min}个字符`
      return false
    }

    if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
      errors.value[field.prop] = rule.message || `长度不能大于${rule.max}个字符`
      return false
    }

    // 数字验证（允许0）
    if (rule.type === 'number' && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min && value !== 0) {
        errors.value[field.prop] = rule.message || `数值不能小于${rule.min}`
        return false
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.value[field.prop] = rule.message || `数值不能大于${rule.max}`
        return false
      }
    }

    // 数字类型检查
    if (
      rule.type === 'number' &&
      value !== undefined &&
      value !== '' &&
      value !== 0 &&
      isNaN(value)
    ) {
      errors.value[field.prop] = rule.message || '请输入数字'
      return false
    }
  }

  errors.value[field.prop] = ''
  return true
}

// 验证所有字段
const validateAll = () => {
  let isValid = true
  for (const field of props.fields) {
    touched.value[field.prop] = true
    if (field.required || (field.rules && field.rules.length)) {
      const fieldValid = validateField(field, true)
      if (!fieldValid) isValid = false
    }
  }
  return isValid
}

const handleInput = (field, value) => {
  localFormData[field.prop] = value
  touched.value[field.prop] = true
  validateField(field)
}

const handleSelect = (field, value) => {
  localFormData[field.prop] = value
  touched.value[field.prop] = true
  validateField(field)
}

const handleNumberInput = (field, value) => {
  // 保留空字符串，让用户能清空输入框
  if (value === '') {
    localFormData[field.prop] = ''
  } else {
    const numValue = Number(value)
    localFormData[field.prop] = isNaN(numValue) ? '' : numValue
  }
  touched.value[field.prop] = true
  validateField(field)
}

const handleSwitch = (field, value) => {
  localFormData[field.prop] = value
  touched.value[field.prop] = true
  validateField(field)
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (evt) => {
      localFormData[props.avatarField] = evt.target?.result
    }
    reader.readAsDataURL(file)
  }
}

const handleClose = () => {
  errors.value = {}
  touched.value = {}
  visible.value = false
  emit('close')
}

const handleSubmit = () => {
  if (!validateAll()) {
    return
  }
  emit('submit', { ...localFormData })
}

// 监听弹窗关闭，重置状态
watch(visible, (newVal) => {
  if (!newVal) {
    errors.value = {}
    touched.value = {}
  }
})
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

.required-star {
  color: #ff5d5d;
  margin-left: 4px;
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

/* 错误状态 */
.form-item.has-error input,
.form-item.has-error select,
.form-item.has-error textarea {
  border-color: #ff5d5d;
}

.error-message {
  color: #ff5d5d;
  font-size: 12px;
  margin-top: 6px;
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
