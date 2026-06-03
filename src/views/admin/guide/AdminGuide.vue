<script setup>
import {
  getStrategyList,
  getStrategyDetail,
  addStrategy,
  updateStrategy,
  deleteStrategy
} from '@/api/admin/strategy'
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Notebook,
  EditPen,
  WarningFilled,
  CircleClose,
  Search,
  Plus
} from '@element-plus/icons-vue'
import Pagination from '../../../components/Pagination.vue'
import FormDialog from '../../../components/FormDialog.vue'

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// 筛选条件
const searchKeyword = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

// 弹窗相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentStrategyId = ref(null)

const dialogTitle = computed(() => (isEdit.value ? '编辑攻略' : '发布攻略'))

// 统计数量
const grandTotal = ref(0)
const todayCount = ref(0)
const offlineCount = ref(0)
const pendingCount = ref(0)

// 分类选项
const categoryOptions = ['热门推荐', '自由行', '周边游', '亲子游', '美食攻略']

// 弹窗字段配置
const strategyFields = [
  {
    label: '攻略标题',
    prop: 'title',
    type: 'input',
    placeholder: '请输入攻略标题',
    required: true,
    rules: [
      { required: true, message: '请输入攻略标题', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ]
  },
  {
    label: '摘要描述',
    prop: 'description',
    type: 'textarea',
    rows: 2,
    placeholder: '请输入攻略摘要描述',
    required: true,
    rules: [
      { required: true, message: '请输入摘要描述', trigger: 'blur' },
      { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
    ]
  },
  {
    label: '攻略分类',
    prop: 'category',
    type: 'select',
    options: categoryOptions,
    required: true,
    rules: [{ required: true, message: '请选择攻略分类', trigger: 'change' }]
  },
  {
    label: '详细内容',
    prop: 'content',
    type: 'textarea',
    rows: 5,
    placeholder: '请输入攻略详细内容',
    required: true,
    fullWidth: true,
    rules: [
      { required: true, message: '请输入详细内容', trigger: 'blur' },
      { min: 1, max: 10000, message: '长度在 1 到 10000 个字符', trigger: 'blur' }
    ]
  },
  {
    label: '封面图片URL',
    prop: 'cover_image',
    type: 'input',
    placeholder: '请输入封面图片地址',
    required: true,
    fullWidth: true,
    rules: [{ required: true, message: '请输入封面图片地址', trigger: 'blur' }]
  }
]

// 表单数据
const formData = reactive({
  title: '',
  description: '',
  category: '',
  content: '',
  cover_image: ''
})

// 攻略列表数据
const strategyList = ref([])

// 获取总数
const fetchGrandTotal = async () => {
  try {
    const res = await getStrategyList({ page: 1, size: 1 })
    grandTotal.value = res.data.total
  } catch (error) {
    console.log('获取总数失败', error)
  }
}

// 获取统计数据
const fetchStats = async () => {
  try {
    const [pendingRes, offlineRes] = await Promise.all([
      getStrategyList({ page: 1, size: 1, status: 0 }),
      getStrategyList({ page: 1, size: 1, status: 2 })
    ])
    pendingCount.value = pendingRes.data.total
    offlineCount.value = offlineRes.data.total

    const todayRes = await getStrategyList({ page: 1, size: 100, status: 1 })
    const today = new Date().toISOString().slice(0, 10)
    todayCount.value = (todayRes.data.list || []).filter(
      (item) => item.create_time && item.create_time.startsWith(today)
    ).length
  } catch (error) {
    console.log('获取统计失败', error)
  }
}

// 获取攻略列表
const fetchStrategyList = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    if (statusFilter.value !== '') {
      params.status = Number(statusFilter.value)
    }

    if (categoryFilter.value) {
      params.category = categoryFilter.value
    }

    const res = await getStrategyList(params)

    strategyList.value = (res.data.list || []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      cover_image: item.cover_image,
      status: item.status === 0 ? '待审核' : item.status === 1 ? '已发布' : '已下架',
      create_time: item.create_time || ''
    }))

    total.value = res.data.total
  } catch (error) {
    console.log('获取攻略列表失败', error)
  }
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return '--'
  return time.replace('T', ' ').split(' ')[0]
}

onMounted(() => {
  fetchGrandTotal()
  fetchStats()
  fetchStrategyList()
})

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchStrategyList()
}

// 重置筛选
const handleReset = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
  currentPage.value = 1
  fetchStrategyList()
}

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page
  fetchStrategyList()
}

// 新增攻略
const openAddDialog = () => {
  isEdit.value = false
  currentStrategyId.value = null
  formData.title = ''
  formData.description = ''
  formData.category = ''
  formData.content = ''
  formData.cover_image = ''
  dialogVisible.value = true
}

// 编辑攻略
const openEditDialog = async (item) => {
  try {
    isEdit.value = true
    currentStrategyId.value = item.id

    const res = await getStrategyDetail(item.id)
    const detail = res.data

    formData.title = detail.title || ''
    formData.description = detail.description || ''
    formData.category = detail.category || ''
    formData.content = detail.content || ''
    formData.cover_image = detail.cover_image || ''

    dialogVisible.value = true
  } catch (error) {
    console.log('获取攻略详情失败', error)
    ElMessage.error('获取详情失败')
  }
}

// 提交表单
const handleSubmit = async (data) => {
  try {
    if (isEdit.value) {
      await updateStrategy(currentStrategyId.value, data)
      ElMessage.success('更新成功')
    } else {
      await addStrategy(data)
      ElMessage.success('添加成功')
    }

    dialogVisible.value = false
    fetchStrategyList()
    fetchGrandTotal()
    fetchStats()
  } catch (error) {
    console.log(error)
    ElMessage.error('操作失败')
  }
}

// 关闭弹窗
const handleCloseDialog = () => {
  // FormDialog 会自己处理重置
}

// 删除攻略
const handleDelete = async (item) => {
  try {
    if (!confirm(`确定要删除攻略「${item.title}」吗？删除后不可恢复！`)) return

    await deleteStrategy(item.id)
    ElMessage.success('删除成功')

    if (strategyList.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    fetchStrategyList()
    fetchGrandTotal()
    fetchStats()
  } catch (error) {
    console.log(error)
    ElMessage.error('删除失败')
  }
}
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>攻略管理</h2>
        <p>发布与管理旅游攻略内容</p>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>攻略总数</p>
          <h2>{{ grandTotal }}</h2>
          <span>累计发布</span>
        </div>
        <div class="icon green">
          <el-icon><Notebook /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>今日发布</p>
          <h2>{{ todayCount }}</h2>
          <span>持续增长</span>
        </div>
        <div class="icon blue">
          <el-icon><EditPen /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>已下架</p>
          <h2>{{ offlineCount }}</h2>
          <span class="danger">需关注</span>
        </div>
        <div class="icon red">
          <el-icon><CircleClose /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>待审核</p>
          <h2>{{ pendingCount }}</h2>
          <span class="warning">需处理</span>
        </div>
        <div class="icon orange">
          <el-icon><WarningFilled /></el-icon>
        </div>
      </div>
    </div>

    <!-- 攻略列表表格 -->
    <div class="table-wrapper">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="filters">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input v-model="searchKeyword" placeholder="搜索攻略标题" @keyup.enter="handleSearch" />
          </div>

          <select v-model="statusFilter" class="select" @change="handleSearch">
            <option value="">全部状态</option>
            <option value="1">已发布</option>
            <option value="0">待审核</option>
            <option value="2">已下架</option>
          </select>

          <select v-model="categoryFilter" class="select" @change="handleSearch">
            <option value="">全部分类</option>
            <option v-for="opt in categoryOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>

          <button class="reset-btn" @click="handleReset">重置</button>
        </div>

        <button class="add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          发布攻略
        </button>
      </div>

      <!-- 表格 -->
      <table class="guide-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>封面</th>
            <th>攻略标题</th>
            <th>分类</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in strategyList" :key="item.id">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>
              <img v-if="item.cover_image" :src="item.cover_image" class="cover-img" alt="" />
              <div v-else class="cover-placeholder">攻略</div>
            </td>
            <td>
              <div class="guide-info">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </td>
            <td>
              <span class="category-tag">{{ item.category }}</span>
            </td>
            <td>
              <span
                class="status-tag"
                :class="{
                  success: item.status === '已发布',
                  warning: item.status === '待审核',
                  danger: item.status === '已下架'
                }"
              >
                {{ item.status }}
              </span>
            </td>
            <td>{{ formatTime(item.create_time) }}</td>
            <td>
              <div class="actions">
                <button class="edit-btn" @click="openEditDialog(item)">编辑</button>
                <button class="delete-btn" @click="handleDelete(item)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="strategyList.length === 0">
            <td colspan="7" class="empty-cell">暂无数据</td>
          </tr>
        </tbody>
      </table>

      <!-- 分页组件 -->
      <Pagination
        :total="total"
        :current="currentPage"
        :page-size="pageSize"
        @update:current="handlePageChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      subtitle="配置攻略信息"
      :fields="strategyFields"
      :form-data="formData"
      @submit="handleSubmit"
      @close="handleCloseDialog"
    />
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

.warning {
  color: #ff9f43 !important;
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
  gap: 12px;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
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

.select {
  height: 42px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 0 14px;
  background: #fff;
  cursor: pointer;
}

.reset-btn {
  height: 42px;
  padding: 0 20px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  font-weight: 500;
  background: #ffffff;
  color: #64748b;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #ffffff;
  border-color: #18b57d;
  color: #18b57d;
}

/* 表格 */
.cover-img {
  width: 80px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
}

.cover-placeholder {
  width: 80px;
  height: 56px;
  border-radius: 10px;
  background: linear-gradient(135deg, #18b57d, #4a8cff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.guide-table {
  width: 100%;
  border-collapse: collapse;
}

.guide-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
}

.guide-table td {
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.empty-cell {
  text-align: center;
  color: #94a3b8;
  padding: 48px !important;
}

.guide-info h4 {
  color: #14263f;
  font-size: 15px;
}

.guide-info p {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 13px;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-tag {
  padding: 6px 12px;
  border-radius: 30px;
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
  font-size: 12px;
}

.status-tag {
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
  display: inline-block;
}

.status-tag.success {
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
}

.status-tag.warning {
  background: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
}

.status-tag.danger {
  background: rgba(255, 93, 93, 0.1);
  color: #ff5d5d;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
  color: #4a8cff;
}

.delete-btn {
  color: #ff5d5d;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .guide-table {
    font-size: 12px;
    overflow-x: auto;
    display: block;
  }
}
</style>
