<script setup>
/**
 * 景区分类管理页面
 * 功能：分类的增删改查、筛选搜索、前端分页
 */

import { ref, reactive, computed, onMounted, watch } from 'vue'
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
const currentPage = ref(1) // 当前页码，默认第1页
const pageSize = ref(5) // 每页显示条数，默认5条
const total = ref(0) // 数据总条数

// ==================== 弹窗相关 ====================
const dialogVisible = ref(false) // 弹窗是否显示
const isEdit = ref(false) // 是否为编辑模式（false=新增，true=编辑）
const currentCategoryId = ref(null) // 当前编辑的分类ID

// ==================== 筛选相关 ====================
const searchKeyword = ref('') // 搜索关键词
const statusFilter = ref('全部状态') // 状态筛选：全部状态/启用中/已禁用

// ==================== 表单数据 ====================
const formModel = reactive({
  name: '', // 分类名称
  desc: '', // 分类描述
  sort: 0, // 排序号
  status: '启用中', // 状态（启用中/已禁用）
  icon: '' // 图标URL
})

// ==================== 数据列表 ====================
const categoryList = ref([]) // 原始分类数据（从后端获取的全部数据）

// ==================== 计算属性 ====================

/**
 * 弹窗标题（根据新增/编辑模式动态变化）
 */
const dialogTitle = computed(() => (isEdit.value ? '编辑分类' : '新增分类'))

/**
 * 前端筛选后的列表
 * 处理逻辑：
 * 1. 先按搜索关键词筛选（模糊匹配分类名称，不区分大小写）
 * 2. 再按状态筛选（启用中/已禁用/全部）
 */
const filteredCategoryList = computed(() => {
  let list = categoryList.value

  // 搜索筛选（模糊匹配）
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    list = list.filter((item) => item.category_name.toLowerCase().includes(keyword))
  }

  // 状态筛选
  if (statusFilter.value === '启用中') {
    list = list.filter((item) => item.status === 1) // status=1 表示启用
  } else if (statusFilter.value === '已禁用') {
    list = list.filter((item) => item.status === 0) // status=0 表示禁用
  }

  return list
})

/**
 * 前端分页后的列表
 * 根据当前页码和每页条数，截取对应范围的数据
 */
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value // 起始索引
  const end = start + pageSize.value // 结束索引
  return filteredCategoryList.value.slice(start, end) // slice 截取当前页数据
})

// ==================== 辅助函数 ====================

/**
 * 获取下一个排序号
 * 规则：当前最大排序号 + 1，如果没有数据则返回 1
 */
const getNextSortOrder = () => {
  if (categoryList.value.length === 0) return 1
  const maxSort = Math.max(...categoryList.value.map((item) => item.sort_order))
  return maxSort + 1
}

/**
 * 重置表单数据
 * 用于关闭弹窗或打开新增弹窗时清空上次的数据
 */
const resetFormData = () => {
  formModel.name = ''
  formModel.desc = ''
  formModel.sort = 0
  formModel.status = '启用中'
  formModel.icon = ''
}

// ==================== 业务函数 ====================

/**
 * 打开新增弹窗
 * 1. 设置为新增模式
 * 2. 清空表单
 * 3. 自动分配排序号
 * 4. 显示弹窗
 */
const openAddDialog = () => {
  isEdit.value = false
  currentCategoryId.value = null
  resetFormData()
  formModel.sort = getNextSortOrder() // 自动分配排序号
  dialogVisible.value = true
}

/**
 * 打开编辑弹窗
 * 1. 设置为编辑模式
 * 2. 调用详情接口获取数据
 * 3. 填充表单（注意状态需要转换：1→启用中，0→已禁用）
 * 4. 显示弹窗
 */
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
      formModel.status = detail.status === 1 ? '启用中' : '已禁用' // 状态转换
      formModel.icon = detail.icon_url
    }
  } catch (error) {
    console.error('获取详情失败', error)
  }
}

/**
 * 获取分类列表
 * 一次性获取所有数据，后续筛选和分页都在前端完成
 */
const fetchCategoryList = async () => {
  const res = await getCategoryList() // 不传分页参数，获取全部
  if (res.code === 200) {
    categoryList.value = res.data // 存储全部数据
    total.value = res.data.length // 更新总数
  }
}

/**
 * 提交表单（新增/编辑）
 * 1. 构建提交数据
 * 2. 根据 isEdit 判断调用新增还是编辑接口
 * 3. 注意状态转换：启用中→1，已禁用→0
 * 4. 成功后关闭弹窗并刷新列表
 */
const handleSubmit = async (data) => {
  try {
    // 构建提交数据
    const submitData = {
      category_name: data.name,
      description: data.desc,
      icon_url: data.icon || 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      sort_order: data.sort
    }

    let res

    // 状态转换：启用中→1，已禁用→0
    submitData.status = data.status === '启用中' ? 1 : 0

    if (isEdit.value) {
      res = await updateCategory(currentCategoryId.value, submitData)
    } else {
      res = await addCategory(submitData)
    }

    if (res.code === 200) {
      dialogVisible.value = false // 关闭弹窗
      fetchCategoryList() // 刷新列表
    }
  } catch (error) {
    console.error('操作失败', error)
  }
}

/**
 * 删除分类
 * 1. 弹出确认框
 * 2. 调用删除接口
 * 3. 成功后刷新列表
 */
const handleDelete = async (item) => {
  if (!confirm(`确定要删除分类「${item.category_name}」吗？`)) return
  try {
    const res = await deleteCategory(item.id)
    if (res.code === 200) {
      fetchCategoryList() // 刷新列表
    }
  } catch (error) {
    console.error('删除失败', error)
  }
}

/**
 * 分页切换
 * 只更新当前页码，数据由 paginatedList 计算属性自动响应
 */
const handlePageChange = (page) => {
  currentPage.value = page
}

/**
 * 重置筛选条件
 * 清空搜索框，状态下拉恢复为"全部状态"
 */
const resetFilters = () => {
  searchKeyword.value = ''
  statusFilter.value = '全部状态'
}

// ==================== 监听器 ====================

/**
 * 监听筛选后的列表变化
 * 作用：当筛选结果变化时，如果当前页码超出总页数，自动调整到最后一页
 * 例如：筛选后只有5条数据（1页），但当前在第2页，则自动跳回第1页
 */
watch(filteredCategoryList, (newList) => {
  const totalPages = Math.ceil(newList.length / pageSize.value)
  if (currentPage.value > totalPages) {
    currentPage.value = Math.max(1, totalPages) // 跳转到最后一页，至少为第1页
  }
})

// ==================== 生命周期 ====================

/**
 * 页面加载时获取分类列表
 */
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
          <h2>{{ filteredCategoryList.filter((item) => item.status === 0).length }}</h2>
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
          <select v-model="statusFilter" class="select">
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
            <th>分类信息</th>
            <th>分类图标</th>
            <th>排序</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-if="paginatedList.length">
          <!-- 遍历分页后的列表 -->
          <tr v-for="item in paginatedList" :key="item.id">
            <!-- 分类信息：名称 + 描述 -->
            <td>
              <div class="category-info">
                <div class="category-name">
                  <h4>{{ item.category_name }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </div>
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
            <td colspan="5">
              <div class="empty-box">暂无数据</div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页组件：只在有数据时显示 -->
      <Pagination
        v-if="filteredCategoryList.length > 0"
        :total="filteredCategoryList.length"
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

/* 分类信息区域 */
.category-name h4 {
  color: #14263f;
  font-size: 15px;
  margin: 0 0 6px 0;
}

.category-name p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
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
