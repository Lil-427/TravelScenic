<script setup>
import {
  getStrategyList,
  getStrategyDetail,
  addStrategy,
  updateStrategy,
  publishStrategy,
  deleteStrategy
} from '@/api/admin/strategy'

// ============================================================
// Vue 核心 + Element Plus
// ============================================================
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 图标：笔记本、编辑笔、警告、下架圆圈、搜索、加号
import {
  Notebook,
  EditPen,
  WarningFilled,
  CircleClose,
  Search,
  Plus
} from '@element-plus/icons-vue'

// 公共组件
import Pagination from '../../../components/Pagination.vue'
import FormDialog from '../../../components/FormDialog.vue'

// ============================================================
// ① 分页状态
//    这三个值的改变会触发 fetchStrategyList 重新请求
// ============================================================
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0) // 后端返回的总条数，用于 Pagination 组件

// ============================================================
// ② 筛选条件
//    searchKeyword / categoryFilter → 纯前端 computed 过滤，不请求接口
//    statusFilter → 传参给接口，点击下拉时触发接口请求
// ============================================================
const searchKeyword = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

// ============================================================
// ③ 弹窗控制（新增/编辑共用一个 FormDialog）
//    isEdit = false → 新增模式，调用 addStrategy
//    isEdit = true  → 编辑模式，调用 updateStrategy
// ============================================================
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentStrategyId = ref(null) // 编辑时记录当前攻略 ID

// 弹窗标题随模式切换
const dialogTitle = computed(() => (isEdit.value ? '编辑攻略' : '新增攻略'))

// 统计卡片数据：每次增/删/改/发布后都会重新拉取
const grandTotal = ref(0) // 攻略总数
const todayCount = ref(0) // 今日发布数（客户端按日期过滤）
const offlineCount = ref(0) // 已下架数量
const pendingCount = ref(0) // 待审核数量

// 分类选项（表单下拉 & 筛选下拉共用）
const categoryOptions = ['热门推荐', '自由行', '周边游', '亲子游', '美食攻略']

// ============================================================
// ⑥ 弹窗表单字段配置
//    FormDialog 组件根据此数组动态渲染表单项
//    prop 对应 formData 的 key，rules 为 Element Plus 校验规则
// ============================================================
const strategyFields = [
  {
    label: '攻略标题',
    prop: 'title',
    type: 'input',
    placeholder: '请输入攻略标题',
    required: true,
    rules: [
      { required: true, message: '请输入攻略标题', trigger: 'blur' },
      { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
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
      { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
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
    fullWidth: true, // 占满弹窗整行
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
    fullWidth: true
  }
]

// ============================================================
// ⑦ 表单双向绑定数据（reactive 响应式对象）
//    新增时清空，编辑时从详情接口回填
// ============================================================
const formData = reactive({
  title: '',
  description: '',
  category: '',
  content: '',
  cover_image: ''
})

// ============================================================
// ⑧ 列表数据 + 前端本地过滤
//    strategyList：接口返回的当前页原始数据
//    displayList：经过搜索关键词 + 分类下拉过滤后的展示数据
//    搜索和分类筛选不请求接口，仅对当前页做客户端过滤
// ============================================================
const strategyList = ref([])

const displayList = computed(() => {
  let list = strategyList.value
  // 按标题关键词过滤（大小写不敏感）
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter((item) => item.title.toLowerCase().includes(kw))
  }
  // 按分类精确匹配
  if (categoryFilter.value) {
    list = list.filter((item) => item.category === categoryFilter.value)
  }
  return list
})

// ============================================================
// ⑨ 数据请求方法
// ============================================================

// 统计卡片 — 总数：只取 1 条，用 total 字段
const fetchGrandTotal = async () => {
  try {
    const res = await getStrategyList({ page: 1, size: 1 })
    grandTotal.value = res.data.total
  } catch (error) {
    console.log('获取总数失败', error)
  }
}

// 统计卡片 — 待审核 / 已下架 / 今日发布
// Promise.all 并行请求待审核(status=0)和已下架(status=2)，减少等待时间
const fetchStats = async () => {
  try {
    const [pendingRes, offlineRes] = await Promise.all([
      getStrategyList({ page: 1, size: 1, status: 0 }),
      getStrategyList({ page: 1, size: 1, status: 2 })
    ])
    pendingCount.value = pendingRes.data.total
    offlineCount.value = offlineRes.data.total

    // 今日发布：拉取已发布的前100条，客户端过滤 create_time 为今天的
    const todayRes = await getStrategyList({ page: 1, size: 100, status: 1 })
    const today = new Date().toISOString().slice(0, 10) // "2026-06-04"
    todayCount.value = (todayRes.data.list || []).filter(
      (item) => item.create_time && item.create_time.startsWith(today)
    ).length
  } catch (error) {
    console.log('获取统计失败', error)
  }
}

// 核心：获取当前页的攻略列表
// 只有 statusFilter 传参给后端（keyword/category 在前端 computed 里过滤）
const fetchStrategyList = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    // 状态下拉：空字符串表示"全部"，不传 status 参数
    if (statusFilter.value !== '') {
      params.status = Number(statusFilter.value)
    }

    const res = await getStrategyList(params)

    // 接口返回的 status 是数字 0/1/2，映射为中文便于模板展示
    strategyList.value = (res.data.list || []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      cover_image: item.cover_image,
      statusCode: item.status, // 保留原始数字，用于 toggle 发布/下架
      status: item.status === 0 ? '待审核' : item.status === 1 ? '已发布' : '已下架',
      create_time: item.create_time || ''
    }))

    total.value = res.data.total
  } catch (error) {
    console.log('获取攻略列表失败', error)
  }
}

// 表格时间格式化：截取日期部分，无效时显示 "--"
const formatTime = (time) => {
  if (!time) return '--'
  return time.replace('T', ' ').split(' ')[0]
}

// ============================================================
// ⑩ 生命周期：页面挂载时拉取全部数据
// ============================================================
onMounted(() => {
  fetchGrandTotal()
  fetchStats()
  fetchStrategyList()
})

// ============================================================
// ⑪ 工具栏事件
// ============================================================

// 状态下拉变更 → 重置到第1页并请求接口
const handleSearch = () => {
  currentPage.value = 1
  fetchStrategyList()
}

// 重置：清空所有筛选条件（包括前端搜索/分类），回到第1页
const handleReset = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
  currentPage.value = 1
  fetchStrategyList()
}

// Pagination 组件页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchStrategyList()
}

// ============================================================
// ⑫ 新增 / 编辑弹窗
// ============================================================

// 打开新增弹窗：清空 formData，标记为非编辑模式
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

// 打开编辑弹窗：先调详情接口获取完整数据，回填到 formData
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

// 弹窗确认提交：根据 isEdit 走新增或更新接口
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
    // 刷新列表和统计
    fetchStrategyList()
    fetchGrandTotal()
    fetchStats()
  } catch (error) {
    console.log(error)
    ElMessage.error('操作失败')
  }
}

// ============================================================
// ⑬ 发布 / 下架（toggle 切换）
//     当前已发布 → 下架(status=2)；当前非已发布 → 发布(status=1)
// ============================================================
const handlePublish = async (item) => {
  try {
    // statusCode: 0待审核 1已发布 2已下架
    // 1→2 下架，0或2→1 发布
    const newStatus = item.statusCode === 1 ? 2 : 1
    const actionText = newStatus === 1 ? '发布' : '下架'
    if (!confirm(`确定要${actionText}攻略「${item.title}」吗？`)) return

    await publishStrategy(item.id, newStatus)
    ElMessage.success(`${actionText}成功`)

    fetchStrategyList()
    fetchGrandTotal()
    fetchStats()
  } catch (error) {
    console.log(error)
    ElMessage.error('操作失败')
  }
}

// 关闭弹窗回调（FormDialog 内部自行处理重置，此处无需额外操作）
const handleCloseDialog = () => {}

// ============================================================
// ⑭ 删除攻略
//     删除当前页最后一条时，自动回退到上一页
// ============================================================
const handleDelete = async (item) => {
  try {
    if (!confirm(`确定要删除攻略「${item.title}」吗？删除后不可恢复！`)) return

    await deleteStrategy(item.id)
    ElMessage.success('删除成功')

    // 边界处理：当前页只剩 1 条且不是第 1 页 → 页码减 1
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
            <input v-model="searchKeyword" placeholder="搜索攻略标题" />
          </div>

          <el-select
            v-model="statusFilter"
            size="large"
            style="width: 130px"
            placeholder="全部状态"
            @change="handleSearch"
          >
            <el-option label="全部状态" value="" />
            <el-option label="已发布" value="1" />
            <el-option label="待审核" value="0" />
            <el-option label="已下架" value="2" />
          </el-select>

          <el-select
            v-model="categoryFilter"
            size="large"
            style="width: 150px"
            placeholder="全部分类"
          >
            <el-option label="全部分类" value="" />
            <el-option v-for="opt in categoryOptions" :key="opt" :label="opt" :value="opt" />
          </el-select>

          <button class="reset-btn" @click="handleReset">重置</button>
        </div>

        <button class="add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新增攻略
        </button>
      </div>

      <!-- 表格 -->
      <table class="guide-table">
        <colgroup>
          <col style="width: 5%" />
          <col style="width: 8%" />
          <col style="width: 22%" />
          <col style="width: 9%" />
          <col style="width: 8%" />
          <col style="width: 9%" />
          <col style="width: 15%" />
        </colgroup>
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
          <tr v-for="(item, index) in displayList" :key="item.id">
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
                <button
                  v-if="item.statusCode !== 1"
                  class="publish-btn"
                  @click="handlePublish(item)"
                >
                  发布
                </button>
                <button v-else class="unpublish-btn" @click="handlePublish(item)">下架</button>
                <button class="delete-btn" @click="handleDelete(item)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="displayList.length === 0">
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
  table-layout: fixed;
}

.guide-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
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
  gap: 6px;
  flex-wrap: nowrap;
}

.edit-btn,
.publish-btn,
.unpublish-btn,
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

.publish-btn {
  color: #18b57d;
}

.unpublish-btn {
  color: #ff9f43;
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
