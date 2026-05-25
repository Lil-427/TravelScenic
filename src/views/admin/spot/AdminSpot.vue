<!-- ScenicSpot.vue - 景区管理 -->
<script setup>
import { getSpotList, getSpotDetail, updateSpot, addSpot, deleteSpot } from '@/api/admin/spot'
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Location,
  Star,
  WarningFilled,
  CircleClose,
  Search,
  StarFilled
} from '@element-plus/icons-vue'
import Pagination from '../../../components/Pagination.vue'
import FormDialog from '../../../components/FormDialog.vue'

// 分页相关
const currentPage = ref(1)
const pageSize = ref(4)
const total = ref(0)

// 筛选条件
const searchKeyword = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

// 弹窗相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentScenicId = ref(null)

const dialogTitle = computed(() => (isEdit.value ? '编辑景区' : '新增景区'))

// 统计数量
const hotCount = ref(36)
const pendingCount = ref(0)
const offlineCount = ref(0)
const grandTotal = ref(0)

// 弹窗字段配置（添加验证规则）
const scenicFields = [
  {
    label: '景区名称',
    prop: 'name',
    type: 'input',
    placeholder: '请输入景区名称',
    required: true,
    rules: [
      { required: true, message: '请输入景区名称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ]
  },
  {
    label: '景区描述',
    prop: 'desc',
    type: 'textarea',
    rows: 2,
    placeholder: '请输入景区描述',
    required: true,
    rules: [
      { required: true, message: '请输入景区描述', trigger: 'blur' },
      { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
    ]
  },
  {
    label: '分类',
    prop: 'category',
    type: 'select',
    options: ['自然风光', '历史古迹', '主题乐园', '城市地标', '海滨度假'],
    required: true,
    rules: [{ required: true, message: '请选择分类', trigger: 'change' }]
  },
  {
    label: '所在地',
    prop: 'location',
    type: 'input',
    placeholder: '请输入所在地（如：四川 阿坝）',
    required: true,
    rules: [
      { required: true, message: '请输入所在地', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ]
  },
  {
    label: '门票价格',
    prop: 'price',
    type: 'number',
    placeholder: '请输入门票价格（0表示免费）',
    required: true,
    rules: [
      {
        required: true,
        validator: (rule, value, callback) => {
          // 允许 0 或正数，不允许 null/undefined/空字符串
          if (value === undefined || value === null || value === '') {
            callback(new Error('请输入门票价格'))
          } else if (typeof value === 'number' && value >= 0) {
            callback() // 验证通过，包括0
          } else {
            callback(new Error('请输入有效的价格'))
          }
        },
        trigger: 'blur'
      },
      { type: 'number', min: 0, max: 2000, message: '价格在 0-2000 元之间' }
    ]
  },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: ['待审核', '已上架', '已下架'],
    required: true,
    rules: [{ required: true, message: '请选择状态', trigger: 'change' }]
  },
  {
    label: '详细内容',
    prop: 'content',
    type: 'textarea',
    rows: 4,
    placeholder: '请输入景区详细介绍',
    fullWidth: true,
    required: true,
    rules: [
      { required: true, message: '请输入详细内容', trigger: 'blur' },
      { min: 10, max: 1000, message: '长度在 10 到 1000 个字符', trigger: 'blur' }
    ]
  },
  {
    label: '封面图片URL',
    prop: 'cover',
    type: 'input',
    placeholder: '请输入封面图片地址',
    fullWidth: true
  }
]

// 表单数据
const formData = reactive({
  name: '',
  desc: '',
  category: '自然风光',
  location: '',
  price: 0,
  status: '待审核',
  content: '',
  cover: ''
})

// 景区列表数据
const scenicList = ref([])

// 获取所有景区总数（不分页、不筛选）
const fetchGrandTotal = async () => {
  try {
    const res = await getSpotList({ page: 1, size: 1 })
    grandTotal.value = res.data.total
  } catch (error) {
    console.log('获取总数失败', error)
  }
}

// 获取统计数据（待审核、已下架数量）
const fetchStats = async () => {
  try {
    const [pendingRes, offlineRes] = await Promise.all([
      getSpotList({ page: 1, size: 1, status: 0 }),
      getSpotList({ page: 1, size: 1, status: 2 })
    ])
    pendingCount.value = pendingRes.data.total
    offlineCount.value = offlineRes.data.total
  } catch (error) {
    console.log('获取统计失败', error)
  }
}

// 获取景区列表（支持筛选和分页）
const fetchSpotList = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    // 搜索关键词
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    // 分类筛选
    if (categoryFilter.value) {
      params.category = categoryFilter.value
    }

    // 状态筛选
    if (statusFilter.value !== '') {
      params.status = Number(statusFilter.value)
    }

    console.log('请求参数:', params)

    const res = await getSpotList(params)

    console.log('景区列表:', res.data)

    scenicList.value = res.data.list.map((item) => ({
      id: item.id,
      name: item.scenic_name,
      category: item.category_name,
      cover: item.cover_image,
      location: item.location,
      price: item.price,
      status: item.status === 0 ? '待审核' : item.status === 1 ? '已上架' : '已下架',
      createTime: item.create_time,
      desc: item.description || '',
      score: item.score || '0'
    }))

    total.value = res.data.total
  } catch (error) {
    console.log('获取景区失败', error)
  }
}

onMounted(() => {
  fetchGrandTotal() // 总数不随搜索变化
  fetchSpotList() // 列表随搜索变化
  fetchStats() // 待审核和已下架数量
})

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchSpotList()
}

// 重置筛选
const handleReset = () => {
  searchKeyword.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  fetchSpotList()
}

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page
  fetchSpotList()
}

// 新增景区
const openAddDialog = () => {
  isEdit.value = false
  currentScenicId.value = null
  formData.name = ''
  formData.desc = ''
  formData.category = '自然风光'
  formData.location = ''
  formData.price = 0
  formData.status = '待审核'
  formData.content = ''
  formData.cover = ''
  dialogVisible.value = true
}

// 编辑景区
const openEditDialog = async (item) => {
  try {
    isEdit.value = true
    currentScenicId.value = item.id

    const res = await getSpotDetail(item.id)
    console.log(JSON.stringify(res, null, 2))

    const detail = res.data

    formData.name = detail.scenic_name || ''
    formData.desc = detail.description || ''
    formData.category = detail.category_name || ''
    formData.location = detail.location || ''
    formData.price = detail.price || 0
    formData.status = detail.status === 0 ? '待审核' : detail.status === 1 ? '已上架' : '已下架'
    formData.content = detail.description || ''
    formData.cover = detail.cover_image || ''

    dialogVisible.value = true
  } catch (error) {
    console.log('获取景区详情失败', error)
  }
}

// 提交表单
const handleSubmit = async (data) => {
  try {
    if (isEdit.value) {
      await updateSpot(currentScenicId.value, {
        scenic_name: data.name,
        description: data.desc,
        category_name: data.category,
        location: data.location,
        price: data.price,
        status: data.status === '待审核' ? 0 : data.status === '已上架' ? 1 : 2,
        cover_image: data.cover
      })

      ElMessage.success('更新成功')

      const index = scenicList.value.findIndex((item) => item.id === currentScenicId.value)
      if (index !== -1) {
        scenicList.value.splice(index, 1, {
          ...scenicList.value[index],
          name: data.name,
          desc: data.desc,
          category: data.category,
          location: data.location,
          price: data.price,
          status: data.status,
          cover: data.cover
        })
      }

      // 刷新统计数据
      fetchStats()
    } else {
      await addSpot({
        scenic_name: data.name,
        description: data.desc,
        category_name: data.category,
        location: data.location,
        price: data.price,
        status: data.status === '待审核' ? 0 : data.status === '已上架' ? 1 : 2,
        cover_image: data.cover
      })

      ElMessage.success('新增成功')

      // 更新总数和统计数据
      fetchGrandTotal()
      fetchStats()

      // 刷新列表
      fetchSpotList()
    }

    dialogVisible.value = false
  } catch (error) {
    console.log(error)
    ElMessage.error('操作失败')
  }
}

// 关闭弹窗
const handleCloseDialog = () => {
  formData.name = ''
  formData.desc = ''
  formData.category = '自然风光'
  formData.location = ''
  formData.price = 0
  formData.status = '待审核'
  formData.content = ''
  formData.cover = ''
}

// 删除景区
const handleDelete = async (item) => {
  try {
    const confirmDelete = confirm(`确定要删除景区「${item.name}」吗？`)
    if (!confirmDelete) return

    await deleteSpot(item.id)
    ElMessage.success('删除成功')

    const index = scenicList.value.findIndex((s) => s.id === item.id)
    if (index !== -1) {
      scenicList.value.splice(index, 1)
    }

    // 更新总数和统计数据
    fetchGrandTotal()
    fetchStats()

    // 如果当前页没有数据了，回到上一页
    if (scenicList.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
      fetchSpotList()
    }
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
        <h2>景区管理</h2>
        <p>管理平台景区资源与展示信息</p>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>景区总数</p>
          <h2>{{ grandTotal }}</h2>
          <span>+12%</span>
        </div>
        <div class="icon green">
          <el-icon><Location /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>热门景区</p>
          <h2>{{ hotCount }}</h2>
          <span>热度上涨</span>
        </div>
        <div class="icon blue">
          <el-icon><Star /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>待审核</p>
          <h2>{{ pendingCount }}</h2>
          <span class="warning">待处理</span>
        </div>
        <div class="icon orange">
          <el-icon><WarningFilled /></el-icon>
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
    </div>

    <!-- 景区列表表格 -->
    <div class="table-wrapper">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="filters">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input v-model="searchKeyword" placeholder="搜索景区名称" @keyup.enter="handleSearch" />
          </div>

          <select v-model="categoryFilter" class="select" @change="handleSearch">
            <option value="">全部分类</option>
            <option value="自然风光">自然风光</option>
            <option value="历史古迹">历史古迹</option>
            <option value="主题乐园">主题乐园</option>
            <option value="城市地标">城市地标</option>
            <option value="海滨度假">海滨度假</option>
          </select>

          <select v-model="statusFilter" class="select" @change="handleSearch">
            <option value="">全部状态</option>
            <option value="1">已上架</option>
            <option value="0">待审核</option>
            <option value="2">已下架</option>
          </select>

          <button class="reset-btn" @click="handleReset">重置</button>
        </div>

        <!-- 新增景区按钮 -->
        <button class="add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新增景区
        </button>
      </div>

      <!-- 表格 -->
      <table class="scenic-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>景区信息</th>
            <th>分类</th>
            <th>所在地</th>
            <th>门票价格</th>
            <th>评分</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in scenicList" :key="item.id">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>
              <div class="scenic-info">
                <img v-if="item.cover" :src="item.cover" alt="" />
                <div v-else class="spot-cover">景区</div>
                <div>
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </td>
            <td>
              <span class="category-tag">{{ item.category }}</span>
            </td>
            <td>{{ item.location }}</td>
            <td class="price">
              <template v-if="item.price === 0">免费</template>
              <template v-else>¥{{ item.price }}</template>
            </td>
            <td>
              <div class="score">
                <el-icon><StarFilled /></el-icon>
                {{ item.score }}
              </div>
            </td>
            <td>
              <span
                class="status-tag"
                :class="{
                  success: item.status === '已上架',
                  warning: item.status === '待审核',
                  danger: item.status === '已下架'
                }"
              >
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.createTime }}</td>
            <td>
              <div class="actions">
                <button class="edit-btn" @click="openEditDialog(item)">编辑</button>
                <button class="delete-btn" @click="handleDelete(item)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="scenicList.length === 0">
            <td colspan="9" class="empty-cell">暂无数据</td>
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
      subtitle="配置景区信息"
      :fields="scenicFields"
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
page-header {
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
.spot-cover {
  width: 90px;
  height: 60px;
  border-radius: 14px;
  background: linear-gradient(135deg, #18b57d, #4a8cff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}
.scenic-table {
  width: 100%;
  border-collapse: collapse;
}

.scenic-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
}

.scenic-table td {
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.empty-cell {
  text-align: center;
  color: #94a3b8;
  padding: 48px !important;
}

.scenic-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.scenic-info img {
  width: 90px;
  height: 60px;
  border-radius: 14px;
  object-fit: cover;
}

.scenic-info h4 {
  color: #14263f;
  font-size: 15px;
}

.scenic-info p {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.category-tag {
  padding: 6px 12px;
  border-radius: 30px;
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
  font-size: 12px;
  display: inline-block;
}

.price {
  color: #ff9f43;
  font-weight: 700;
}

.score {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f59e0b;
  font-weight: 600;
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

  .scenic-table {
    font-size: 12px;
    overflow-x: auto;
    display: block;
  }

  .scenic-info {
    min-width: 200px;
  }
}
</style>
