<!-- NoticeManage.vue - 公告管理 -->
<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>公告管理</h2>
        <p>发布与管理系统公告通知内容</p>
      </div>
      <button class="add-btn" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        发布公告
      </button>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>公告总数</p>
          <h2>{{ total }}</h2>
          <span>+8%</span>
        </div>
        <div class="icon green">
          <el-icon><Bell /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>已发布</p>
          <h2>{{ publishedCount }}</h2>
          <span>正常展示</span>
        </div>
        <div class="icon blue">
          <el-icon><Promotion /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>待发布</p>
          <h2>{{ pendingCount }}</h2>
          <span class="warning">待处理</span>
        </div>
        <div class="icon orange">
          <el-icon><Clock /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>已下架</p>
          <h2>{{ offlineCount }}</h2>
          <span class="danger">停止展示</span>
        </div>
        <div class="icon red">
          <el-icon><CircleCloseFilled /></el-icon>
        </div>
      </div>
    </div>

    <!-- 公告列表表格 -->
    <div class="table-wrapper">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="filters">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input
              v-model="searchKeyword"
              placeholder="搜索公告标题"
              @keyup.enter="handleSearch"
            />
          </div>

          <select v-model="statusFilter" class="select">
            <option value="">全部状态</option>
            <option value="已发布">已发布</option>
            <option value="待发布">待发布</option>
            <option value="已下架">已下架</option>
          </select>

          <select v-model="typeFilter" class="select">
            <option value="">全部类型</option>
            <option value="系统通知">系统通知</option>
            <option value="运营公告">运营公告</option>
            <option value="活动通知">活动通知</option>
          </select>

          <button class="search-btn" @click="handleSearch">搜索</button>
          <button class="reset-btn" @click="handleReset">重置</button>
        </div>
      </div>

      <!-- 表格 -->
      <table class="notice-table">
        <thead>
          <tr>
            <th>公告信息</th>
            <th>公告类型</th>
            <th>发布人</th>
            <th>浏览量</th>
            <th>状态</th>
            <th>发布时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in displayList" :key="item.id">
            <td>
              <div class="notice-info">
                <div class="notice-cover">
                  <img :src="item.cover" />
                </div>
                <div>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </td>
            <td>
              <span
                class="type-tag"
                :class="{
                  system: item.type === '系统通知',
                  active: item.type === '活动通知',
                  operate: item.type === '运营公告',
                }"
              >
                {{ item.type }}
              </span>
            </td>
            <td>{{ item.author }}</td>
            <td>
              <span class="views">{{ item.views }}</span>
            </td>
            <td>
              <span
                class="status-tag"
                :class="{
                  success: item.status === '已发布',
                  warning: item.status === '待发布',
                  danger: item.status === '已下架',
                }"
              >
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.publishTime }}</td>
            <td>
              <div class="actions">
                <button class="edit-btn" @click="openEditDialog(item)">
                  编辑
                </button>
                <button class="delete-btn" @click="handleDelete(item)">
                  删除
                </button>
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
        :total="filteredTotal"
        :current="currentPage"
        :page-size="pageSize"
        @update:current="handlePageChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      subtitle="配置公告信息"
      :fields="noticeFields"
      :form-data="formData"
      @submit="handleSubmit"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  Bell,
  Promotion,
  Clock,
  CircleCloseFilled,
  Search,
  Plus,
} from "@element-plus/icons-vue";
import Pagination from "../../../components/Pagination.vue";
import FormDialog from "../../../components/FormDialog.vue";

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(86);

// 筛选条件
const searchKeyword = ref("");
const statusFilter = ref("");
const typeFilter = ref("");

// 弹窗相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentNoticeId = ref(null);

const dialogTitle = computed(() => (isEdit.value ? "编辑公告" : "发布公告"));

// 统计数量
const publishedCount = ref(72);
const pendingCount = ref(8);
const offlineCount = ref(6);

// 弹窗字段配置（包含状态）
const noticeFields = [
  {
    label: "公告标题",
    prop: "title",
    type: "input",
    placeholder: "请输入公告标题",
    required: true,
  },
  {
    label: "公告描述",
    prop: "desc",
    type: "textarea",
    rows: 2,
    placeholder: "请输入公告简短描述",
  },
  {
    label: "公告类型",
    prop: "type",
    type: "select",
    options: ["系统通知", "运营公告", "活动通知"],
  },
  {
    label: "发布人",
    prop: "author",
    type: "input",
    placeholder: "请输入发布人名称",
    required: true,
  },
  {
    label: "状态",
    prop: "status",
    type: "select",
    options: ["待发布", "已发布", "已下架"],
  },
  {
    label: "详细内容",
    prop: "content",
    type: "textarea",
    rows: 5,
    placeholder: "请输入公告详细内容",
    fullWidth: true,
  },
  {
    label: "封面图片URL",
    prop: "cover",
    type: "input",
    placeholder: "请输入封面图片地址",
    fullWidth: true,
  },
];

// 表单数据
const formData = reactive({
  title: "",
  desc: "",
  type: "系统通知",
  author: "",
  status: "待发布",
  content: "",
  cover: "",
});

// 公告列表数据
const noticeList = ref([
  {
    id: 1,
    title: "关于系统维护升级的通知",
    desc: "系统将于今晚 23:00 进行升级维护",
    type: "系统通知",
    author: "系统管理员",
    views: "12.5K",
    status: "已发布",
    publishTime: "2024-06-07",
    cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300",
    content: "系统将于今晚 23:00 进行升级维护，届时部分功能可能暂时无法使用...",
  },
  {
    id: 2,
    title: "五一假期景区运营安排",
    desc: "部分热门景区开放时间调整",
    type: "运营公告",
    author: "运营中心",
    views: "8.2K",
    status: "待发布",
    publishTime: "2024-06-06",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300",
    content: "五一假期期间，部分热门景区开放时间有所调整，请游客提前了解...",
  },
  {
    id: 3,
    title: "夏季旅游活动上线通知",
    desc: "平台推出暑期优惠活动专区",
    type: "活动通知",
    author: "活动策划部",
    views: "18.9K",
    status: "已下架",
    publishTime: "2024-06-03",
    cover: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=300",
    content: "夏季旅游活动已上线，平台推出暑期优惠活动专区，欢迎参与...",
  },
  {
    id: 4,
    title: "景区门票价格调整通知",
    desc: "部分景区门票价格将于下月起调整",
    type: "系统通知",
    author: "票务中心",
    views: "5.6K",
    status: "已发布",
    publishTime: "2024-06-05",
    cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300",
    content: "接景区通知，部分景区门票价格将于下月起进行调整...",
  },
  {
    id: 5,
    title: "平台会员权益升级公告",
    desc: "会员权益全面升级，新增多项特权",
    type: "运营公告",
    author: "产品部",
    views: "9.3K",
    status: "待发布",
    publishTime: "2024-06-04",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300",
    content: "平台会员权益全面升级，新增多项特权，敬请期待...",
  },
]);

// 筛选后的数据
const filteredList = computed(() => {
  let list = [...noticeList.value];

  // 关键词筛选（标题/描述）
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.desc.toLowerCase().includes(keyword),
    );
  }

  // 状态筛选
  if (statusFilter.value) {
    list = list.filter((item) => item.status === statusFilter.value);
  }

  // 类型筛选
  if (typeFilter.value) {
    list = list.filter((item) => item.type === typeFilter.value);
  }

  return list;
});

const filteredTotal = computed(() => filteredList.value.length);

// 当前页显示的数据
const displayList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredList.value.slice(start, end);
});

// 更新统计数量
const updateStats = () => {
  total.value = noticeList.value.length;
  publishedCount.value = noticeList.value.filter(
    (item) => item.status === "已发布",
  ).length;
  pendingCount.value = noticeList.value.filter(
    (item) => item.status === "待发布",
  ).length;
  offlineCount.value = noticeList.value.filter(
    (item) => item.status === "已下架",
  ).length;
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
};

// 重置筛选
const handleReset = () => {
  searchKeyword.value = "";
  statusFilter.value = "";
  typeFilter.value = "";
  currentPage.value = 1;
};

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 新增公告
const openAddDialog = () => {
  isEdit.value = false;
  currentNoticeId.value = null;
  formData.title = "";
  formData.desc = "";
  formData.type = "系统通知";
  formData.author = "";
  formData.status = "待发布";
  formData.content = "";
  formData.cover = "";
  dialogVisible.value = true;
};

// 编辑公告
const openEditDialog = (item) => {
  isEdit.value = true;
  currentNoticeId.value = item.id;
  formData.title = item.title;
  formData.desc = item.desc;
  formData.type = item.type;
  formData.author = item.author;
  formData.status = item.status;
  formData.content = item.content || "";
  formData.cover = item.cover;
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = (data) => {
  const now = new Date().toISOString().slice(0, 10);

  if (isEdit.value) {
    const index = noticeList.value.findIndex(
      (n) => n.id === currentNoticeId.value,
    );
    if (index !== -1) {
      noticeList.value[index] = {
        ...noticeList.value[index],
        title: data.title,
        desc: data.desc,
        type: data.type,
        author: data.author,
        status: data.status,
        content: data.content,
        cover: data.cover || noticeList.value[index].cover,
      };
    }
  } else {
    const newNotice = {
      id: Date.now(),
      title: data.title,
      desc: data.desc || "暂无描述",
      type: data.type,
      author: data.author,
      views: "0",
      status: data.status || "待发布",
      publishTime: now,
      cover:
        data.cover ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300",
      content: data.content || "",
    };
    noticeList.value.unshift(newNotice);
  }
  updateStats();
  dialogVisible.value = false;
};

// 关闭弹窗
const handleCloseDialog = () => {
  formData.title = "";
  formData.desc = "";
  formData.type = "系统通知";
  formData.author = "";
  formData.status = "待发布";
  formData.content = "";
  formData.cover = "";
};

// 删除公告
const handleDelete = (item) => {
  if (confirm(`确定要删除公告「${item.title}」吗？删除后不可恢复！`)) {
    const index = noticeList.value.findIndex((n) => n.id === item.id);
    if (index !== -1) {
      noticeList.value.splice(index, 1);
      updateStats();
      if (displayList.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    }
  }
};
</script>

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
  margin-bottom: 24px;
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

.search-btn,
.reset-btn {
  height: 42px;
  padding: 0 20px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.search-btn {
  background: #18b57d;
  color: #fff;
}

.search-btn:hover {
  background: #0e9f6e;
}

.reset-btn {
  background: #f1f5f9;
  color: #64748b;
}

.reset-btn:hover {
  background: #e2e8f0;
}

/* 表格 */
.notice-table {
  width: 100%;
  border-collapse: collapse;
}

.notice-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
}

.notice-table td {
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.empty-cell {
  text-align: center;
  color: #94a3b8;
  padding: 48px !important;
}

.notice-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.notice-cover img {
  width: 100px;
  height: 68px;
  border-radius: 14px;
  object-fit: cover;
}

.notice-info h4 {
  color: #14263f;
  font-size: 15px;
}

.notice-info p {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.type-tag {
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
  display: inline-block;
}

.type-tag.system {
  background: rgba(74, 140, 255, 0.12);
  color: #4a8cff;
}

.type-tag.active {
  background: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
}

.type-tag.operate {
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
}

.views {
  color: #18b57d;
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

  .notice-table {
    font-size: 12px;
    overflow-x: auto;
    display: block;
  }

  .notice-info {
    min-width: 200px;
  }
}
</style>
