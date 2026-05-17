<template>
  <div class="page-container">
    <!-- 页面头部 -->
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

    <!-- 数据统计 -->
    <div class="stats-grid">
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
      <div class="stats-card">
        <div>
          <p>隐藏分类</p>
          <h2>{{ hiddenCount }}</h2>
          <span class="danger">未展示</span>
        </div>
        <div class="icon red">
          <el-icon><Hide /></el-icon>
        </div>
      </div>
    </div>

    <!-- 分类表格 -->
    <div class="table-wrapper">
      <div class="table-toolbar">
        <div class="filters">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input placeholder="搜索分类名称" />
          </div>
          <select class="select">
            <option>全部状态</option>
            <option>启用中</option>
            <option>已隐藏</option>
          </select>
        </div>
      </div>

      <table class="category-table">
        <thead>
          <tr>
            <th>分类信息</th>
            <th>分类图标</th>
            <th>景区数量</th>
            <th>排序</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categoryList" :key="item.id">
            <td>
              <div class="category-info">
                <div class="category-cover">
                  <img :src="item.cover" />
                </div>
                <div>
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </td>
            <td>
              <div class="icon-preview">
                <img :src="item.icon" />
              </div>
            </td>
            <td>
              <span class="count">{{ item.count }} 个景区</span>
            </td>
            <td>{{ item.sort }}</td>
            <td>
              <span
                class="status-tag"
                :class="item.status === '启用中' ? 'success' : 'danger'"
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
        </tbody>
      </table>

      <Pagination
        :total="total"
        :current="currentPage"
        :page-size="pageSize"
        @update:current="currentPage = $event"
      />
    </div>

    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      subtitle="配置景区分类信息"
      :fields="categoryFields"
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
  Grid,
  TrendCharts,
  Location,
  Hide,
  Search,
} from "@element-plus/icons-vue";
import Pagination from "../../../components/Pagination.vue";
import FormDialog from "../../../components/FormDialog.vue";

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(18);

const dialogVisible = ref(false);
const isEdit = ref(false);
const currentCategoryId = ref(null);

const dialogTitle = computed(() => (isEdit.value ? "编辑分类" : "新增分类"));

const hiddenCount = computed(() => {
  return categoryList.value.filter((item) => item.status === "已隐藏").length;
});

const categoryFields = [
  {
    label: "分类名称",
    prop: "name",
    type: "input",
    placeholder: "请输入分类名称",
  },
  {
    label: "分类描述",
    prop: "desc",
    type: "textarea",
    rows: 3,
    placeholder: "请输入分类描述",
  },
  {
    label: "排序序号",
    prop: "sort",
    type: "number",
    placeholder: "请输入排序序号",
  },
  {
    label: "状态",
    prop: "status",
    type: "select",
    options: ["启用中", "已隐藏"],
  },
  {
    label: "分类图标URL",
    prop: "icon",
    type: "input",
    placeholder: "请输入图标地址",
  },
  {
    label: "封面图片URL",
    prop: "cover",
    type: "input",
    fullWidth: true,
    placeholder: "请输入封面地址",
  },
];

const formData = reactive({
  name: "",
  desc: "",
  sort: 0,
  status: "启用中",
  icon: "",
  cover: "",
});

const categoryList = ref([
  {
    id: 1,
    name: "自然风光",
    desc: "山川湖泊等自然景观",
    count: 36,
    sort: 1,
    status: "启用中",
    createTime: "2024-06-01",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
    icon: "https://cdn-icons-png.flaticon.com/512/427/427735.png",
  },
  {
    id: 2,
    name: "历史古迹",
    desc: "文化遗址与古建筑",
    count: 28,
    sort: 2,
    status: "启用中",
    createTime: "2024-06-02",
    cover: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300",
    icon: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  },
  {
    id: 3,
    name: "主题乐园",
    desc: "娱乐休闲主题景区",
    count: 12,
    sort: 3,
    status: "已隐藏",
    createTime: "2024-06-03",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300",
    icon: "https://cdn-icons-png.flaticon.com/512/2436/2436636.png",
  },
]);

const openAddDialog = () => {
  isEdit.value = false;
  currentCategoryId.value = null;
  formData.name = "";
  formData.desc = "";
  formData.sort = 0;
  formData.status = "启用中";
  formData.icon = "";
  formData.cover = "";
  dialogVisible.value = true;
};

const openEditDialog = (category) => {
  isEdit.value = true;
  currentCategoryId.value = category.id;
  formData.name = category.name;
  formData.desc = category.desc;
  formData.sort = category.sort;
  formData.status = category.status;
  formData.icon = category.icon;
  formData.cover = category.cover;
  dialogVisible.value = true;
};

const handleSubmit = (data) => {
  const now = new Date().toISOString().slice(0, 10);

  if (isEdit.value) {
    const index = categoryList.value.findIndex(
      (c) => c.id === currentCategoryId.value,
    );
    if (index !== -1) {
      categoryList.value[index] = {
        ...categoryList.value[index],
        name: data.name,
        desc: data.desc,
        sort: data.sort,
        status: data.status,
        icon: data.icon,
        cover: data.cover,
      };
    }
  } else {
    const newCategory = {
      id: Date.now(),
      name: data.name,
      desc: data.desc,
      count: 0,
      sort: data.sort,
      status: data.status,
      createTime: now,
      cover:
        data.cover ||
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300",
      icon:
        data.icon || "https://cdn-icons-png.flaticon.com/512/427/427735.png",
    };
    categoryList.value.push(newCategory);
    total.value++;
  }
  dialogVisible.value = false;
};

const handleDelete = (item) => {
  if (confirm(`确定要删除分类「${item.name}」吗？`)) {
    const index = categoryList.value.findIndex((c) => c.id === item.id);
    if (index !== -1) {
      categoryList.value.splice(index, 1);
      total.value--;
    }
  }
};

const handleCloseDialog = () => {
  formData.name = "";
  formData.desc = "";
  formData.sort = 0;
  formData.status = "启用中";
  formData.icon = "";
  formData.cover = "";
};
</script>

<style scoped>
.page-container {
  width: 100%;
}
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
}

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
.category-info {
  display: flex;
  align-items: center;
  gap: 14px;
}
.category-cover img {
  width: 90px;
  height: 60px;
  border-radius: 14px;
  object-fit: cover;
}
.category-info h4 {
  color: #14263f;
  font-size: 15px;
}
.category-info p {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 13px;
}
.icon-preview img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}
.count {
  color: #18b57d;
  font-weight: 600;
}
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
.delete-btn {
  color: #ff5d5d;
}

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
