<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, User, DataAnalysis, WarningFilled } from '@element-plus/icons-vue'
import Pagination from '../../../components/Pagination.vue'
import { getUserList, updateUserStatus } from '@/api/admin/user'

// ==================== 分页相关 ====================
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// ==================== 筛选相关 ====================
const searchKeyword = ref('')
const statusFilter = ref('')

// ==================== 数据列表 ====================
const userList = ref([])

// ==================== 统计数据 ====================
const grandTotal = ref(0)
const frozenCount = ref(0)

// ==================== 业务函数 ====================

// 获取用户列表
const fetchUserList = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    if (searchKeyword.value.trim()) {
      params.username = searchKeyword.value.trim()
      params.phone = searchKeyword.value.trim()
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

// 状态切换（冻结/解冻）
const handleStatusToggle = async (item) => {
  const newStatus = item.status === 1 ? 0 : 1
  const actionText = newStatus === 0 ? '冻结' : '解冻'
  const userName = item.nickname || item.username

  try {
    await ElMessageBox.confirm(`确定要${actionText}用户「${userName}」吗？`, '操作确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await updateUserStatus({ id: item.id, status: newStatus })
    if (res.code === 200) {
      ElMessage.success(`${actionText}成功`)
      item.status = newStatus
      frozenCount.value = userList.value.filter((u) => u.status === 0).length
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('状态更新失败', error)
      ElMessage.error('状态更新失败')
    }
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
          <el-icon><DataAnalysis /></el-icon>
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
                <button
                  class="toggle-btn"
                  :class="item.status === 1 ? 'freeze' : 'unfreeze'"
                  @click="handleStatusToggle(item)"
                >
                  {{ item.status === 1 ? '冻结' : '解冻' }}
                </button>
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

/* 操作列居中 */
.user-table th:last-child,
.user-table td:last-child {
  text-align: center;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.toggle-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  transition: opacity 0.2s;
}

.toggle-btn.freeze {
  color: #ff9f43;
}

.toggle-btn.freeze:hover {
  opacity: 0.75;
}

.toggle-btn.unfreeze {
  color: #18b57d;
}

.toggle-btn.unfreeze:hover {
  opacity: 0.75;
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
