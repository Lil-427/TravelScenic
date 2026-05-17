<!-- GuideManage.vue - 攻略管理（修复版） -->
<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>攻略管理</h2>
        <p>发布与管理旅游攻略内容</p>
      </div>
      <button class="add-btn" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        发布攻略
      </button>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>攻略总数</p>
          <h2>{{ total }}</h2>
          <span>+12%</span>
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
          <p>浏览总量</p>
          <h2>{{ totalViews }}</h2>
          <span>热度上涨</span>
        </div>
        <div class="icon orange">
          <el-icon><View /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>待审核</p>
          <h2>{{ pendingCount }}</h2>
          <span class="warning">需处理</span>
        </div>
        <div class="icon red">
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
            <input
              v-model="searchKeyword"
              placeholder="搜索攻略标题"
              @keyup.enter="handleSearch"
            />
          </div>

          <select v-model="statusFilter" class="select">
            <option value="">全部状态</option>
            <option value="已发布">已发布</option>
            <option value="待审核">待审核</option>
            <option value="已下架">已下架</option>
          </select>

          <select v-model="categoryFilter" class="select">
            <option value="">全部分类</option>
            <option value="热门推荐">热门推荐</option>
            <option value="自由行">自由行</option>
            <option value="周边游">周边游</option>
            <option value="亲子游">亲子游</option>
            <option value="美食攻略">美食攻略</option>
          </select>

          <button class="search-btn" @click="handleSearch">搜索</button>
          <button class="reset-btn" @click="handleReset">重置</button>
        </div>
      </div>

      <!-- 表格 -->
      <table class="guide-table">
        <thead>
          <tr>
            <th>攻略信息</th>
            <th>作者</th>
            <th>分类</th>
            <th>浏览量</th>
            <th>点赞数</th>
            <th>状态</th>
            <th>发布时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in displayList" :key="item.id">
            <td>
              <div class="guide-info">
                <img :src="item.cover" />
                <div>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </td>
            <td>
              <div class="author">
                <img :src="item.avatar" />
                <span>{{ item.author }}</span>
              </div>
            </td>
            <td>
              <span class="category-tag">{{ item.category }}</span>
            </td>
            <td>
              <span class="view-count">{{ item.views }}</span>
            </td>
            <td>
              <span class="like-count">{{ item.likes }}</span>
            </td>
            <td>
              <span
                class="status-tag"
                :class="{
                  success: item.status === '已发布',
                  warning: item.status === '待审核',
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
            <td colspan="8" class="empty-cell">暂无数据</td>
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
      subtitle="配置攻略信息"
      :fields="guideFields"
      :form-data="formData"
      @submit="handleSubmit"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  Notebook,
  EditPen,
  View,
  WarningFilled,
  Search,
  Plus,
} from "@element-plus/icons-vue";
import Pagination from "../../../components/Pagination.vue";
import FormDialog from "../../../components/FormDialog.vue";

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(268);

// 筛选条件
const searchKeyword = ref("");
const statusFilter = ref("");
const categoryFilter = ref("");

// 弹窗相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentGuideId = ref(null);

const dialogTitle = computed(() => (isEdit.value ? "编辑攻略" : "发布攻略"));

// 统计数量
const todayCount = ref(18);
const pendingCount = ref(6);
const totalViews = ref("82K");

// 弹窗字段配置（增加状态字段）
const guideFields = [
  {
    label: "攻略标题",
    prop: "title",
    type: "input",
    placeholder: "请输入攻略标题",
    required: true,
  },
  {
    label: "攻略描述",
    prop: "desc",
    type: "textarea",
    rows: 2,
    placeholder: "请输入攻略简短描述",
  },
  {
    label: "作者",
    prop: "author",
    type: "input",
    placeholder: "请输入作者名称",
    required: true,
  },
  {
    label: "分类",
    prop: "category",
    type: "select",
    options: ["热门推荐", "自由行", "周边游", "亲子游", "美食攻略"],
  },
  {
    label: "状态",
    prop: "status",
    type: "select",
    options: ["待审核", "已发布", "已下架"],
  },
  {
    label: "详细内容",
    prop: "content",
    type: "textarea",
    rows: 5,
    placeholder: "请输入攻略详细内容",
    fullWidth: true,
  },
  {
    label: "封面图片URL",
    prop: "cover",
    type: "input",
    placeholder: "请输入封面图片地址",
    fullWidth: true,
  },
  {
    label: "作者头像URL",
    prop: "avatar",
    type: "input",
    placeholder: "请输入作者头像地址",
  },
];

// 表单数据
const formData = reactive({
  title: "",
  desc: "",
  author: "",
  category: "自由行",
  status: "待审核",
  content: "",
  cover: "",
  avatar: "",
});

// 攻略列表数据
const guideList = ref([
  {
    id: 1,
    title: "九寨沟三日自由行攻略",
    desc: "详细路线、美食与住宿推荐",
    author: "旅行日记",
    category: "自由行",
    views: "12.5K",
    likes: "2.3K",
    status: "已发布",
    publishTime: "2024-06-07",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    content: "九寨沟详细攻略内容...",
  },
  {
    id: 2,
    title: "杭州西湖周末游玩指南",
    desc: "一天玩遍西湖热门景点",
    author: "城市玩家",
    category: "周边游",
    views: "8.2K",
    likes: "1.2K",
    status: "待审核",
    publishTime: "2024-06-06",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    content: "杭州西湖攻略内容...",
  },
  {
    id: 3,
    title: "故宫深度旅游攻略",
    desc: "故宫热门路线与拍照地点",
    author: "历史旅行者",
    category: "热门推荐",
    views: "18.9K",
    likes: "3.6K",
    status: "已下架",
    publishTime: "2024-06-03",
    cover: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    content: "故宫攻略内容...",
  },
  {
    id: 4,
    title: "成都美食探店攻略",
    desc: "本地人推荐的美食地图",
    author: "吃货小分队",
    category: "美食攻略",
    views: "25.3K",
    likes: "5.1K",
    status: "已发布",
    publishTime: "2024-06-05",
    cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    content: "成都美食攻略内容...",
  },
  {
    id: 5,
    title: "三亚亲子游攻略",
    desc: "带娃旅行必备指南",
    author: "亲子旅行家",
    category: "亲子游",
    views: "6.8K",
    likes: "890",
    status: "待审核",
    publishTime: "2024-06-04",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300",
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    content: "三亚亲子游攻略内容...",
  },
]);

// 筛选后的数据
const filteredList = computed(() => {
  let list = [...guideList.value];

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.desc.toLowerCase().includes(keyword),
    );
  }

  if (statusFilter.value) {
    list = list.filter((item) => item.status === statusFilter.value);
  }

  if (categoryFilter.value) {
    list = list.filter((item) => item.category === categoryFilter.value);
  }

  return list;
});

const filteredTotal = computed(() => filteredList.value.length);

const displayList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredList.value.slice(start, end);
});

// 更新统计数量
const updateStats = () => {
  total.value = guideList.value.length;
  pendingCount.value = guideList.value.filter(
    (item) => item.status === "待审核",
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
  categoryFilter.value = "";
  currentPage.value = 1;
};

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 新增攻略
const openAddDialog = () => {
  isEdit.value = false;
  currentGuideId.value = null;
  formData.title = "";
  formData.desc = "";
  formData.author = "";
  formData.category = "自由行";
  formData.status = "待审核";
  formData.content = "";
  formData.cover = "";
  formData.avatar = "";
  dialogVisible.value = true;
};

// 编辑攻略
const openEditDialog = (item) => {
  isEdit.value = true;
  currentGuideId.value = item.id;
  formData.title = item.title;
  formData.desc = item.desc;
  formData.author = item.author;
  formData.category = item.category;
  formData.status = item.status;
  formData.content = item.content || "";
  formData.cover = item.cover;
  formData.avatar = item.avatar;
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = (data) => {
  const now = new Date().toISOString().slice(0, 10);

  if (isEdit.value) {
    const index = guideList.value.findIndex(
      (g) => g.id === currentGuideId.value,
    );
    if (index !== -1) {
      guideList.value[index] = {
        ...guideList.value[index],
        title: data.title,
        desc: data.desc,
        author: data.author,
        category: data.category,
        status: data.status,
        content: data.content,
        cover: data.cover || guideList.value[index].cover,
        avatar: data.avatar || guideList.value[index].avatar,
      };
    }
  } else {
    const newGuide = {
      id: Date.now(),
      title: data.title,
      desc: data.desc || "暂无描述",
      author: data.author,
      category: data.category,
      views: "0",
      likes: "0",
      status: data.status || "待审核",
      publishTime: now,
      cover:
        data.cover ||
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
      avatar: data.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
      content: data.content || "",
    };
    guideList.value.unshift(newGuide);
  }
  updateStats();
  dialogVisible.value = false;
};

// 关闭弹窗
const handleCloseDialog = () => {
  formData.title = "";
  formData.desc = "";
  formData.author = "";
  formData.category = "自由行";
  formData.status = "待审核";
  formData.content = "";
  formData.cover = "";
  formData.avatar = "";
};

// 删除攻略
const handleDelete = (item) => {
  if (confirm(`确定要删除攻略「${item.title}」吗？删除后不可恢复！`)) {
    const index = guideList.value.findIndex((g) => g.id === item.id);
    if (index !== -1) {
      guideList.value.splice(index, 1);
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

.guide-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.guide-info img {
  width: 100px;
  height: 68px;
  border-radius: 14px;
  object-fit: cover;
}

.guide-info h4 {
  color: #14263f;
  font-size: 15px;
}

.guide-info p {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.category-tag {
  padding: 6px 12px;
  border-radius: 30px;
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
  font-size: 12px;
}

.view-count {
  color: #4a8cff;
  font-weight: 600;
}

.like-count {
  color: #ff9f43;
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

  .guide-info {
    min-width: 200px;
  }
}
</style>
