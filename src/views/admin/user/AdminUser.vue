<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Search,
  User,
  DataAnalysis,
  WarningFilled,
  Close
} from '@element-plus/icons-vue'
import Pagination from '../../../components/Pagination.vue'
import { getUserList, addUser, updateUser, deleteUser } from '@/api/admin/user'

// ==================== 分页相关 ====================
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// ==================== 筛选相关 ====================
const searchKeyword = ref('')
const statusFilter = ref('')

// ==================== 弹窗相关 ====================
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentUserId = ref(null)

const dialogTitle = computed(() => (isEdit.value ? '编辑用户' : '新增用户'))

// ==================== 表单数据 ====================
const localFormData = reactive({
  username: '',
  nickname: '',
  phone: '',
  user_type: 1,
  status: 1
})

// ==================== 表单校验 ====================
const errors = reactive({
  username: '',
  phone: ''
})

const clearError = (field) => {
  errors[field] = ''
}

const validate = () => {
  let isValid = true

  errors.username = ''
  errors.phone = ''

  if (!localFormData.username || localFormData.username.trim() === '') {
    errors.username = '用户名不能为空'
    isValid = false
  } else if (localFormData.username.length < 2) {
    errors.username = '用户名至少需要2个字符'
    isValid = false
  } else if (localFormData.username.length > 50) {
    errors.username = '用户名不能超过50个字符'
    isValid = false
  }

  if (!localFormData.phone || localFormData.phone.trim() === '') {
    errors.phone = '手机号码不能为空'
    isValid = false
  } else if (localFormData.phone.length !== 11) {
    errors.phone = '请输入11位手机号'
    isValid = false
  }

  return isValid
}

// ==================== 数据列表 ====================
const userList = ref([])

// ==================== 统计数据 ====================
const grandTotal = ref(0)
const frozenCount = ref(0)

// ==================== 业务函数 ====================

// 重置表单
const resetFormData = () => {
  localFormData.username = ''
  localFormData.nickname = ''
  localFormData.phone = ''
  localFormData.user_type = 1
  localFormData.status = 1
  errors.username = ''
  errors.phone = ''
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim()
    }
    if (statusFilter.value !== '') {
      params.status = statusFilter.value
    }

    const res = await getUserList(params)

    if (res.code === 200) {
      userList.value = res.data.list || []
      total.value = res.data.total
      grandTotal.value = res.data.total

      frozenCount.value = userList.value.filter((u) => u.status === 0).length
    }
  } catch (error) {
    console.error('获取用户列表失败', error)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUserList()
}

// 重置筛选
const handleReset = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  fetchUserList()
}

// 状态筛选变化
const handleStatusChange = () => {
  currentPage.value = 1
  fetchUserList()
}

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page
  fetchUserList()
}

// 打开新增弹窗
const openAddDialog = () => {
  isEdit.value = false
  currentUserId.value = null
  resetFormData()
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (item) => {
  isEdit.value = true
  currentUserId.value = item.id
  localFormData.username = item.username
  localFormData.nickname = item.nickname || ''
  localFormData.phone = item.phone
  localFormData.user_type = item.user_type
  localFormData.status = item.status
  errors.username = ''
  errors.phone = ''
  dialogVisible.value = true
}

// 关闭弹窗
const handleCloseDialog = () => {
  dialogVisible.value = false
  resetFormData()
}

// 提交表单
const handleSubmit = async () => {
  if (!validate()) return

  try {
    const submitData = {
      username: localFormData.username,
      nickname: localFormData.nickname,
      phone: localFormData.phone,
      user_type: localFormData.user_type,
      status: localFormData.status
    }

    if (isEdit.value) {
      await updateUser(currentUserId.value, submitData)
      ElMessage.success('修改成功')
    } else {
      await addUser(submitData)
      ElMessage.success('新增成功')
    }

    dialogVisible.value = false
    resetFormData()
    fetchUserList()
  } catch (error) {
    console.error('操作失败', error)
    ElMessage.error('操作失败')
  }
}

// 删除用户
const handleDelete = async (item) => {
  if (!confirm(`确定要删除用户「${item.nickname || item.username}」吗？`)) return

  try {
    const res = await deleteUser(item.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      // 如果删除的是最后一页的最后一条，回退一页
      if (userList.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
      fetchUserList()
    }
  } catch (error) {
    console.error('删除失败', error)
    ElMessage.error('删除失败')
  }
}

// 格式化用户类型
const formatUserType = (type) => {
  const map = {
    1: '普通用户',
    2: '管理员'
  }
  return map[type] || '未知'
}

// ==================== 生命周期 ====================
onMounted(() => {
  fetchUserList()
})
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>用户管理</h2>
        <p>管理平台注册用户与账号状态</p>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>总用户数</p>
          <h2>{{ grandTotal }}</h2>
          <span>+12%</span>
        </div>
        <div class="icon green">
          <el-icon><User /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>今日新增</p>
          <h2>128</h2>
          <span>增长中</span>
        </div>
        <div class="icon blue">
          <el-icon><Plus /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>活跃用户</p>
          <h2>8,321</h2>
          <span>持续增长</span>
        </div>
        <div class="icon orange">
          <el-icon><DataAnalysis /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>冻结账号</p>
          <h2>{{ frozenCount }}</h2>
          <span class="danger">需关注</span>
        </div>
        <div class="icon red">
          <el-icon><WarningFilled /></el-icon>
        </div>
      </div>
    </div>

    <!-- 用户列表表格 -->
    <div class="table-wrapper">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="filters">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input
              v-model="searchKeyword"
              placeholder="搜索用户名 / 昵称 / 手机号"
              @keyup.enter="handleSearch"
            />
          </div>
          <el-select
            v-model="statusFilter"
            size="large"
            style="width: 130px"
            placeholder="全部状态"
            @change="handleStatusChange"
          >
            <el-option label="全部状态" value="" />
            <el-option label="正常" value="1" />
            <el-option label="冻结" value="0" />
          </el-select>
          <button class="reset-btn" @click="handleReset">重置</button>
        </div>
        <button class="add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新增用户
        </button>
      </div>

      <!-- 表格 -->
      <table class="user-table">
        <thead>
          <tr>
            <th>用户信息</th>
            <th>手机号</th>
            <th>用户类型</th>
            <th>状态</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userList" :key="item.id">
            <td>
              <div class="user-info">
                <img :src="item.avatar" />
                <div>
                  <h4>{{ item.username }}</h4>
                  <p>{{ item.nickname || '未设置昵称' }}</p>
                </div>
              </div>
            </td>
            <td>{{ item.phone }}</td>
            <td>
              <span class="type-tag" :class="item.user_type === 2 ? 'admin' : 'normal'">
                {{ formatUserType(item.user_type) }}
              </span>
            </td>
            <td>
              <span class="status-tag" :class="item.status === 1 ? 'success' : 'danger'">
                {{ item.status === 1 ? '正常' : '冻结' }}
              </span>
            </td>
            <td>{{ item.create_time }}</td>
            <td>
              <div class="actions">
                <button class="edit-btn" @click="openEditDialog(item)">编辑</button>
                <button class="delete-btn" @click="handleDelete(item)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="userList.length === 0">
            <td colspan="6" class="empty-cell">暂无数据</td>
          </tr>
        </tbody>
      </table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        :current="currentPage"
        :page-size="pageSize"
        @update:current="handlePageChange"
      />
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      width="760px"
      class="user-dialog"
      :show-close="false"
      @close="handleCloseDialog"
    >
      <template #header>
        <div class="dialog-header">
          <div>
            <h2>{{ dialogTitle }}</h2>
            <p>填写用户基础信息</p>
          </div>
          <div class="close-btn" @click="handleCloseDialog">
            <el-icon><Close /></el-icon>
          </div>
        </div>
      </template>

      <div class="dialog-content">
        <div class="form-grid">
          <!-- 用户名 -->
          <div class="form-item fullWidth">
            <label>用户名 <span class="required">*</span></label>
            <input
              v-model="localFormData.username"
              type="text"
              placeholder="请输入用户名"
              :class="{ 'error-input': errors.username }"
              @input="clearError('username')"
            />
            <span v-if="errors.username" class="error-tip">{{ errors.username }}</span>
          </div>

          <!-- 用户昵称 -->
          <div class="form-item fullWidth">
            <label>用户昵称</label>
            <input
              v-model="localFormData.nickname"
              type="text"
              placeholder="请输入用户昵称"
            />
          </div>

          <!-- 手机号码 -->
          <div class="form-item fullWidth">
            <label>手机号码 <span class="required">*</span></label>
            <input
              v-model="localFormData.phone"
              type="text"
              placeholder="请输入手机号码"
              :class="{ 'error-input': errors.phone }"
              @input="clearError('phone')"
            />
            <span v-if="errors.phone" class="error-tip">{{ errors.phone }}</span>
          </div>

          <!-- 用户类型 -->
          <div class="form-item">
            <label>用户类型</label>
            <el-select v-model="localFormData.user_type" size="large" style="width: 100%">
              <el-option label="普通用户" :value="1" />
              <el-option label="管理员" :value="2" />
            </el-select>
          </div>

          <!-- 账号状态 -->
          <div class="form-item">
            <label>状态</label>
            <el-select v-model="localFormData.status" size="large" style="width: 100%">
              <el-option label="正常" :value="1" />
              <el-option label="冻结" :value="0" />
            </el-select>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="handleCloseDialog">取消</button>
          <button class="submit-btn" @click="handleSubmit">保存</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.page-header h2 {
  font-size: 30px;
  color: #14263f;
}

.page-header p {
  margin-top: 6px;
  color: #94a3b8;
}

.add-btn {
  height: 46px;
  padding: 0 22px;
  border: none;
  border-radius: 14px;
  background: #18b57d;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #0e9f6e;
}

/* 数据统计 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stats-card {
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #f1f5f9;
}

.stats-card p {
  color: #94a3b8;
}

.stats-card h2 {
  margin-top: 10px;
  font-size: 34px;
  color: #14263f;
}

.stats-card span {
  display: inline-block;
  margin-top: 10px;
  color: #18b57d;
}

.danger {
  color: #ff5d5d !important;
}

.icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon .el-icon {
  font-size: 28px;
}

.green {
  background: rgba(24, 181, 125, 0.12);
  color: #18b57d;
}

.blue {
  background: rgba(74, 140, 255, 0.12);
  color: #4a8cff;
}

.orange {
  background: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
}

.red {
  background: rgba(255, 93, 93, 0.12);
  color: #ff5d5d;
}

/* 表格区域 */
.table-wrapper {
  margin-top: 28px;
  background: #fff;
  border-radius: 28px;
  padding: 24px;
  border: 1px solid #f1f5f9;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 14px;
  align-items: center;
}

.search-box {
  width: 260px;
  height: 42px;
  background: #f8fafc;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
  border: 1px solid #eef2f6;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: #18b57d;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 14px;
  color: #334155;
}

.search-box input::placeholder {
  color: #cbd5e1;
}

.search-box .el-icon {
  color: #94a3b8;
  font-size: 18px;
}

.reset-btn {
  height: 42px;
  padding: 0 20px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #18b57d;
  color: #18b57d;
}

/* 表格 */
.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
}

.user-table td {
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-info img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h4 {
  color: #14263f;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.user-info p {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 13px;
}

.empty-cell {
  text-align: center;
  color: #94a3b8;
  padding: 48px !important;
}

/* 用户类型标签 */
.type-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 64px;
}

.type-tag.normal {
  background: rgba(74, 140, 255, 0.1);
  color: #4a8cff;
}

.type-tag.admin {
  background: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 48px;
}

.status-tag.success {
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
}

.status-tag.danger {
  background: rgba(255, 93, 93, 0.1);
  color: #ff5d5d;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.edit-btn {
  color: #18b57d;
}

.edit-btn:hover {
  background: rgba(24, 181, 125, 0.1);
}

.delete-btn {
  color: #ff5d5d;
}

.delete-btn:hover {
  background: rgba(255, 93, 93, 0.1);
}

/* ==================== 弹窗样式 ==================== */
.user-dialog :deep(.el-dialog) {
  border-radius: 30px;
  overflow: hidden;
}

.user-dialog :deep(.el-dialog__header) {
  margin-right: 0;
  padding: 0;
}

.user-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.user-dialog :deep(.el-dialog__footer) {
  padding: 0;
}

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

.dialog-content {
  padding: 30px 32px;
}

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

.form-item input {
  width: 100%;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 16px;
  padding: 0 16px;
  font-size: 14px;
  transition: 0.2s;
  font-family: inherit;
  height: 48px;
}

.form-item input:focus {
  border-color: #18b57d;
  outline: none;
}

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

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .filters {
    flex-wrap: wrap;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-item.fullWidth {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .user-table {
    font-size: 12px;
    overflow-x: auto;
    display: block;
  }
}
</style>
