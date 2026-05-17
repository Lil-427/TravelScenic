<!-- ScenicSpot.vue - 景区管理 -->
<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>景区管理</h2>
        <p>管理平台景区资源与展示信息</p>
      </div>
      <button class="add-btn" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增景区
      </button>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>景区总数</p>
          <h2>{{ total }}</h2>
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
            <input
              v-model="searchKeyword"
              placeholder="搜索景区名称"
              @keyup.enter="handleSearch"
            />
          </div>

          <select v-model="categoryFilter" class="select">
            <option value="">全部分类</option>
            <option value="自然风光">自然风光</option>
            <option value="历史古迹">历史古迹</option>
            <option value="主题乐园">主题乐园</option>
            <option value="城市地标">城市地标</option>
            <option value="海滨度假">海滨度假</option>
          </select>

          <select v-model="statusFilter" class="select">
            <option value="">全部状态</option>
            <option value="已上架">已上架</option>
            <option value="待审核">待审核</option>
            <option value="已下架">已下架</option>
          </select>

          <button class="search-btn" @click="handleSearch">搜索</button>
          <button class="reset-btn" @click="handleReset">重置</button>
        </div>
      </div>

      <!-- 表格 -->
      <table class="scenic-table">
        <thead>
          <tr>
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
          <tr v-for="item in displayList" :key="item.id">
            <td>
              <div class="scenic-info">
                <img :src="item.cover" />
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
                  danger: item.status === '已下架',
                }"
              >
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.createTime }}</td>
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
      subtitle="配置景区信息"
      :fields="scenicFields"
      :form-data="formData"
      @submit="handleSubmit"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  Plus,
  Location,
  Star,
  WarningFilled,
  CircleClose,
  Search,
  StarFilled,
} from "@element-plus/icons-vue";
import Pagination from "../../../components/Pagination.vue";
import FormDialog from "../../../components/FormDialog.vue";

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(128);

// 筛选条件
const searchKeyword = ref("");
const categoryFilter = ref("");
const statusFilter = ref("");

// 弹窗相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentScenicId = ref(null);

const dialogTitle = computed(() => (isEdit.value ? "编辑景区" : "新增景区"));

// 统计数量
const hotCount = ref(36);
const pendingCount = ref(8);
const offlineCount = ref(12);

// 弹窗字段配置（包含状态）
const scenicFields = [
  {
    label: "景区名称",
    prop: "name",
    type: "input",
    placeholder: "请输入景区名称",
    required: true,
  },
  {
    label: "景区描述",
    prop: "desc",
    type: "textarea",
    rows: 2,
    placeholder: "请输入景区描述",
  },
  {
    label: "分类",
    prop: "category",
    type: "select",
    options: ["自然风光", "历史古迹", "主题乐园", "城市地标", "海滨度假"],
  },
  {
    label: "所在地",
    prop: "location",
    type: "input",
    placeholder: "请输入所在地（如：四川 阿坝）",
    required: true,
  },
  {
    label: "门票价格",
    prop: "price",
    type: "number",
    placeholder: "请输入门票价格（0表示免费）",
  },
  {
    label: "状态",
    prop: "status",
    type: "select",
    options: ["待审核", "已上架", "已下架"],
  },
  {
    label: "详细内容",
    prop: "content",
    type: "textarea",
    rows: 4,
    placeholder: "请输入景区详细介绍",
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
  name: "",
  desc: "",
  category: "自然风光",
  location: "",
  price: 0,
  status: "待审核",
  content: "",
  cover: "",
});

// 景区列表数据
const scenicList = ref([
  {
    id: 1,
    name: "九寨沟风景区",
    desc: "国家5A级自然风景区，以多彩湖泊和瀑布闻名",
    category: "自然风光",
    location: "四川 阿坝",
    price: 268,
    score: "4.9",
    status: "已上架",
    createTime: "2024-06-01",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
    content: "九寨沟位于四川省阿坝藏族羌族自治州，是世界自然遗产...",
  },
  {
    id: 2,
    name: "杭州西湖",
    desc: "中国著名湖泊景区，免费开放",
    category: "自然风光",
    location: "浙江 杭州",
    price: 0,
    score: "4.8",
    status: "待审核",
    createTime: "2024-06-03",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300",
    content: "西湖位于浙江省杭州市，是中国主要的观赏性淡水湖泊之一...",
  },
  {
    id: 3,
    name: "故宫博物院",
    desc: "世界文化遗产，明清两代皇家宫殿",
    category: "历史古迹",
    location: "北京",
    price: 60,
    score: "4.9",
    status: "已下架",
    createTime: "2024-05-20",
    cover: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300",
    content:
      "故宫博物院成立于1925年，是世界上规模最大、保存最完整的木结构宫殿建筑群...",
  },
  {
    id: 4,
    name: "上海迪士尼乐园",
    desc: "中国大陆首座迪士尼主题乐园",
    category: "主题乐园",
    location: "上海",
    price: 599,
    score: "4.7",
    status: "已上架",
    createTime: "2024-06-02",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300",
    content: "上海迪士尼乐园是中国内地首座迪士尼主题乐园，拥有多个主题园区...",
  },
  {
    id: 5,
    name: "黄山风景区",
    desc: "世界自然与文化双遗产，以奇松怪石云海闻名",
    category: "自然风光",
    location: "安徽 黄山",
    price: 190,
    score: "4.9",
    status: "待审核",
    createTime: "2024-06-04",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
    content: "黄山位于安徽省南部，以奇松、怪石、云海、温泉四绝著称...",
  },
]);

// 筛选后的数据
const filteredList = computed(() => {
  let list = [...scenicList.value];

  // 关键词筛选（名称/描述）
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.desc.toLowerCase().includes(keyword),
    );
  }

  // 分类筛选
  if (categoryFilter.value) {
    list = list.filter((item) => item.category === categoryFilter.value);
  }

  // 状态筛选
  if (statusFilter.value) {
    list = list.filter((item) => item.status === statusFilter.value);
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
  total.value = scenicList.value.length;
  hotCount.value = scenicList.value.filter(
    (item) => parseFloat(item.score) >= 4.7 && item.status === "已上架",
  ).length;
  pendingCount.value = scenicList.value.filter(
    (item) => item.status === "待审核",
  ).length;
  offlineCount.value = scenicList.value.filter(
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
  categoryFilter.value = "";
  statusFilter.value = "";
  currentPage.value = 1;
};

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 新增景区
const openAddDialog = () => {
  isEdit.value = false;
  currentScenicId.value = null;
  formData.name = "";
  formData.desc = "";
  formData.category = "自然风光";
  formData.location = "";
  formData.price = 0;
  formData.status = "待审核";
  formData.content = "";
  formData.cover = "";
  dialogVisible.value = true;
};

// 编辑景区
const openEditDialog = (item) => {
  isEdit.value = true;
  currentScenicId.value = item.id;
  formData.name = item.name;
  formData.desc = item.desc;
  formData.category = item.category;
  formData.location = item.location;
  formData.price = item.price;
  formData.status = item.status;
  formData.content = item.content || "";
  formData.cover = item.cover;
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = (data) => {
  const now = new Date().toISOString().slice(0, 10);

  if (isEdit.value) {
    const index = scenicList.value.findIndex(
      (s) => s.id === currentScenicId.value,
    );
    if (index !== -1) {
      scenicList.value[index] = {
        ...scenicList.value[index],
        name: data.name,
        desc: data.desc,
        category: data.category,
        location: data.location,
        price: data.price,
        status: data.status,
        content: data.content,
        cover: data.cover || scenicList.value[index].cover,
      };
    }
  } else {
    const newScenic = {
      id: Date.now(),
      name: data.name,
      desc: data.desc || "暂无描述",
      category: data.category,
      location: data.location,
      price: data.price,
      score: "0",
      status: data.status || "待审核",
      createTime: now,
      cover:
        data.cover ||
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
      content: data.content || "",
    };
    scenicList.value.unshift(newScenic);
  }
  updateStats();
  dialogVisible.value = false;
};

// 关闭弹窗
const handleCloseDialog = () => {
  formData.name = "";
  formData.desc = "";
  formData.category = "自然风光";
  formData.location = "";
  formData.price = 0;
  formData.status = "待审核";
  formData.content = "";
  formData.cover = "";
};

// 删除景区
const handleDelete = (item) => {
  if (confirm(`确定要删除景区「${item.name}」吗？删除后不可恢复！`)) {
    const index = scenicList.value.findIndex((s) => s.id === item.id);
    if (index !== -1) {
      scenicList.value.splice(index, 1);
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
