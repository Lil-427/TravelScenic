<template>
  <el-dialog
    v-model="visible"
    :width="width"
    class="category-dialog"
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
      <div class="form-grid">
        <!-- 分类名称 -->
        <div class="form-item fullWidth">
          <label>分类名称 <span class="required">*</span></label>
          <input
            v-model="localFormData.name"
            type="text"
            placeholder="请输入分类名称"
            :class="{ 'error-input': errors.name }"
            @input="clearError('name')"
          />
          <span v-if="errors.name" class="error-tip">{{ errors.name }}</span>
        </div>

        <!-- 分类描述 -->
        <div class="form-item fullWidth">
          <label>分类描述 <span class="required">*</span></label>
          <textarea
            v-model="localFormData.desc"
            rows="3"
            placeholder="请输入分类描述（至少5个字）"
            :class="{ 'error-input': errors.desc }"
            @input="clearError('desc')"
          ></textarea>
          <span v-if="errors.desc" class="error-tip">{{ errors.desc }}</span>
        </div>

        <!-- 排序序号 -->
        <div class="form-item">
          <label>排序序号</label>
          <input
            v-model.number="localFormData.sort"
            type="number"
            placeholder="自动生成"
            disabled
          />
        </div>

        <!-- 状态 -->
        <div class="form-item">
          <label>状态</label>
          <select v-model="localFormData.status">
            <option>启用中</option>
            <option>已禁用</option>
          </select>
        </div>

        <!-- 分类图标URL -->
        <div class="form-item fullWidth">
          <label>分类图标URL</label>
          <input v-model="localFormData.icon" type="text" placeholder="请输入图标地址" />
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="submit-btn" @click="handleSubmit">保存</button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
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
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 本地表单数据
const localFormData = reactive({
  name: '',
  desc: '',
  sort: 0,
  status: '启用中',
  icon: ''
})

// 错误信息
const errors = reactive({
  name: '',
  desc: ''
})

// 监听外部传入的 formData，同步到本地
watch(
  () => props.formData,
  (newVal) => {
    if (newVal) {
      localFormData.name = newVal.name || ''
      localFormData.desc = newVal.desc || ''
      localFormData.sort = newVal.sort || 0
      localFormData.status = newVal.status || '启用中'
      localFormData.icon = newVal.icon || ''
    }
  },
  { deep: true, immediate: true }
)

// 清除错误
const clearError = (field) => {
  errors[field] = ''
}

// 校验表单
const validate = () => {
  let isValid = true

  errors.name = ''
  errors.desc = ''

  // 校验名称
  if (!localFormData.name || localFormData.name.trim() === '') {
    errors.name = '分类名称不能为空'
    isValid = false
  } else if (localFormData.name.length < 2) {
    errors.name = '分类名称至少需要2个字符'
    isValid = false
  } else if (localFormData.name.length > 50) {
    errors.name = '分类名称不能超过50个字符'
    isValid = false
  }

  // 校验描述
  if (!localFormData.desc || localFormData.desc.trim() === '') {
    errors.desc = '分类描述不能为空'
    isValid = false
  } else if (localFormData.desc.length < 5) {
    errors.desc = '分类描述至少需要5个字符'
    isValid = false
  } else if (localFormData.desc.length > 200) {
    errors.desc = '分类描述不能超过200个字符'
    isValid = false
  }

  return isValid
}

// 关闭
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 提交
const handleSubmit = () => {
  if (!validate()) return
  emit('submit', { ...localFormData })
}
</script>

<style scoped>
.category-dialog :deep(.el-dialog) {
  border-radius: 30px;
  overflow: hidden;
}

.category-dialog :deep(.el-dialog__header) {
  margin-right: 0;
  padding: 0;
}

.category-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.category-dialog :deep(.el-dialog__footer) {
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

/* 表单 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.form-item .required {
  color: #ff5d5d;
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
.form-item .error-input {
  border-color: #ff5d5d;
}

.form-item .error-input:focus {
  border-color: #ff5d5d;
}

.error-tip {
  font-size: 12px;
  color: #ff5d5d;
  margin-top: 6px;
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

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-item.fullWidth {
    grid-column: span 1;
  }
}
</style>
