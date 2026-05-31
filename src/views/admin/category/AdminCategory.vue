<script setup>
/**
 * 景区分类管理页面
 * 功能：分类的增删改查、筛选搜索、服务端分页
 */

import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Grid, TrendCharts, Location, Hide, Search } from '@element-plus/icons-vue'
import Pagination from '../../../components/Pagination.vue'
import CategoryDialog from '../../../components/CategoryDialog.vue'
import {
  getCategoryList,
  getCategoryDetail,
  addCategory,
  updateCategory,
  deleteCategory
} from '@/api/admin/category'

// ==================== 分页相关 ====================
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// ==================== 弹窗相关 ====================
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentCategoryId = ref(null)

// ==================== 筛选相关 ====================
const searchKeyword = ref('')
const statusFilter = ref('全部状态')

// ==================== 表单数据 ====================
const formModel = reactive({
  name: '',
  desc: '',
  sort: 0,
  status: '启用中',
  icon: ''
})

// ==================== 数据列表 ====================
const categoryList = ref([])

// ==================== 计算属性 ====================

const dialogTitle = computed(() => (isEdit.value ? '编辑分类' : '新增分类'))

// ==================== 辅助函数 ====================

const resetFormData = () => {
  formModel.name = ''
  formModel.desc = ''
  formModel.sort = 0
  formModel.status = '启用中'
  formModel.icon = ''
}

// ==================== 业务函数 ====================

const openAddDialog = () => {
  isEdit.value = false
  currentCategoryId.value = null
  resetFormData()
  dialogVisible.value = true
}

const openEditDialog = async (category) => {
  isEdit.value = true
  currentCategoryId.value = category.id
  resetFormData()
  dialogVisible.value = true

  try {
    const res = await getCategoryDetail(category.id)
    if (res.code === 200) {
      const detail = res.data
      formModel.name = detail.category_name
      formModel.desc = detail.description
      formModel.sort = detail.sort_order
      formModel.status = detail.status === 1 ? '启用中' : '已禁用'
      formModel.icon = detail.icon_url
    }
  } catch (error) {
    console.error('获取详情失败', error)
  }
}

const fetchCategoryList = async () => {
  const params = {
    page: currentPage.value,
    size: pageSize.value
  }
  // 状态筛选
  if (statusFilter.value === '启用中') {
    params.status = 1
  } else if (statusFilter.value === '已禁用') {
    params.status = 0
  }
  const res = await getCategoryList(params)
  if (res.code === 200) {
    categoryList.value = res.data.list
    total.value = res.data.total
  }
}

const handleSubmit = async (data) => {
  try {
    const submitData = {
      category_name: data.name,
      description: data.desc,
      icon_url: data.icon || 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      sort_order: data.sort
    }

    if (isEdit.value) {
      submitData.status = data.status === '启用中' ? 1 : 0
      await updateCategory(currentCategoryId.value, submitData)
    } else {
      await addCategory(submitData)
    }

    dialogVisible.value = false
    fetchCategoryList()
  } catch (error) {
    console.error('操作失败', error)
  }
}

const handleDelete = async (item) => {
  if (!confirm(`确定要删除分类「${item.category_name}」吗？`)) return
  try {
    const res = await deleteCategory(item.id)
    if (res.code === 200) {
      // 如果删除后当前页没数据了，回到上一页
      if (categoryList.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
      fetchCategoryList()
    }
  } catch (error) {
    console.error('删除失败', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchCategoryList()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchCategoryList()
}

// 状态筛选变化
const handleStatusChange = () => {
  currentPage.value = 1
  fetchCategoryList()
}

const resetFilters = () => {
  searchKeyword.value = ''
  statusFilter.value = '全部状态'
  currentPage.value = 1
  fetchCategoryList()
}

// ==================== 生命周期 ====================

onMounted(() => {
  fetchCategoryList()
})
</script>

<template>
  <div class="page-container">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div>
        <h2>景区分类</h2>
        <p>管理平台景区分类体系与展示内容</p>
      </div>
      <button class="add-btn" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增分类
      </button>
    </div>

    <!-- ==================== 数据统计卡片 ==================== -->
    <div class="stats-grid">
      <!-- 卡片1：分类总数 -->
      <div class="stats-card">
        <div>
          <p>分类总数</p>
          <h2>{{ total }}</h2>
          <span>+2%</span>
        </div>
        <div class="icon green">
          <el-icon><Grid /></el-icon>
        </div>
      </div>

      <!-- 卡片2：热门分类（静态数据，可后续对接） -->
      <div class="stats-card">
        <div>
          <p>热门分类</p>
          <h2>6</h2>
          <span>热度上升</span>
        </div>
        <div class="icon blue">
          <el-icon><TrendCharts /></el-icon>
        </div>
      </div>

      <!-- 卡片3：关联景区（静态数据，可后续对接） -->
      <div class="stats-card">
        <div>
          <p>关联景区</p>
          <h2>128</h2>
          <span>持续增长</span>
        </div>
        <div class="icon orange">
          <el-icon><Location /></el-icon>
        </div>
      </div>

      <!-- 卡片4：禁用分类（动态计算禁用状态的数量） -->
      <div class="stats-card">
        <div>
          <p>禁用分类</p>
          <h2>{{ categoryList.filter((item) => item.status === 0).length }}</h2>
          <span class="danger">未展示</span>
        </div>
        <div class="icon red">
          <el-icon><Hide /></el-icon>
        </div>
      </div>
    </div>

    <!-- ==================== 表格区域 ==================== -->
    <div class="table-wrapper">
      <!-- 筛选工具栏 -->
      <div class="table-toolbar">
        <div class="filters">
          <!-- 搜索框 -->
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input v-model="searchKeyword" placeholder="搜索分类名称" />
          </div>
          <!-- 状态下拉框 -->
          <select v-model="statusFilter" class="select" @change="handleStatusChange">
            <option>全部状态</option>
            <option>启用中</option>
            <option>已禁用</option>
          </select>
          <!-- 重置按钮 -->
          <button class="reset-btn" @click="resetFilters">重置</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <table class="category-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>描述</th>
            <th>分类图标</th>
            <th>排序</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-if="categoryList.length">
          <tr v-for="item in categoryList" :key="item.id">
        <td>
              <h4 class="cat-name">{{ item.category_name }}</h4>
            </td>
            <td>
              <p class="cat-desc">{{ item.description }}</p>
            </td>
            <!-- 分类图标 -->
            <td>
              <div class="icon-preview">
                <img :src="item.icon_url" alt="图标" />
              </div>
            </td>
            <!-- 排序号 -->
            <td>{{ item.sort_order }}</td>
            <!-- 状态（带样式标签） -->
            <td>
              <span class="status-tag" :class="item.status === 1 ? 'success' : 'danger'">
                {{ item.status === 1 ? '启用中' : '已禁用' }}
              </span>
            </td>
            <!-- 操作按钮 -->
            <td>
              <div class="actions">
                <button class="edit-btn" @click="openEditDialog(item)">编辑</button>
                <button class="delete-btn" @click="handleDelete(item)">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
        <!-- 空状态 -->
        <tbody v-else>
          <tr>
            <td colspan="6">
              <div class="empty-box">暂无数据</div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页组件 -->
      <Pagination
        v-if="total > 0"
        :total="total"
        :current="currentPage"
        :page-size="pageSize"
        @update:current="handlePageChange"
      />
    </div>

    <!-- ==================== 分类弹窗 ==================== -->
    <!-- 用于新增和编辑分类 -->
    <CategoryDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      subtitle="配置景区分类信息"
      :form-data="formModel"
      @submit="handleSubmit"
      @close="resetFormData"
    />
  </div>
</template>

<style scoped>
/* ==================== 页面容器 ==================== */
.page-container {
  width: 100%;
}

/* ==================== 页面头部样式 ==================== */
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

/* 新增按钮 */
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
  transition: all 0.2s;
}

.add-btn:hover {
  background: #0e9f6e;
}

/* ==================== 统计卡片样式 ==================== */
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

/* 卡片图标样式 */
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

/* ==================== 表格区域样式 ==================== */
.table-wrapper {
  margin-top: 28px;
  background: #fff;
  border-radius: 28px;
  padding: 24px;
  border: 1px solid #f1f5f9;
}

/* 筛选工具栏 */
.table-toolbar {
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 14px;
}

/* 搜索框 */
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
}

.search-box:focus-within {
  border-color: #18b57d;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
}

/* 下拉框 */
.select {
  height: 42px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 0 14px;
  background: #fff;
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

/* 表格样式 */
.category-table {
  width: 100%;
  border-collapse: collapse;
}

.category-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
}

.category-table td {
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.cat-name {
  color: #14263f;
  font-size: 15px;
  margin: 0;
}

.cat-desc {
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 图标预览 */
.icon-preview img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

/* 状态标签 */
.status-tag {
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
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
  padding: 4px 8px;
  border-radius: 8px;
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

/* 空状态 */
.empty-box {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 14px;
}

/* ==================== 响应式布局 ==================== */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .filters {
    flex-wrap: wrap;
  }
  .category-table {
    font-size: 12px;
    overflow-x: auto;
    display: block;
  }
}
</style>
