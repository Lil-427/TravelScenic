<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>管理员管理</h2>
        <p>配置系统后台管理员账号与权限</p>
      </div>

      <button class="add-btn" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增管理员
      </button>
    </div>

    <!-- 数据统计 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>管理员总数</p>
          <h2>{{ total }}</h2>
          <span>+2%</span>
        </div>
        <div class="icon green">
          <el-icon><UserFilled /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>超级管理员</p>
          <h2>3</h2>
          <span>核心权限</span>
        </div>
        <div class="icon blue">
          <el-icon><Avatar /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>在线管理员</p>
          <h2>8</h2>
          <span>实时在线</span>
        </div>
        <div class="icon orange">
          <el-icon><Monitor /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>禁用账号</p>
          <h2>{{ disabledCount }}</h2>
          <span class="danger">已限制</span>
        </div>
        <div class="icon red">
          <el-icon><CircleCloseFilled /></el-icon>
        </div>
      </div>
    </div>

    <!-- 管理员列表 -->
    <div class="table-wrapper">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="filters">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input placeholder="搜索管理员账号" />
          </div>
          <select class="select">
            <option>全部角色</option>
            <option>超级管理员</option>
            <option>运营管理员</option>
            <option>审核管理员</option>
          </select>
          <select class="select">
            <option>全部状态</option>
            <option>正常</option>
            <option>已禁用</option>
          </select>
        </div>
      </div>

      <!-- 表格 -->
      <table class="admin-table">
        <thead>
          <tr>
            <th>管理员信息</th>
            <th>角色权限</th>
            <th>手机号</th>
            <th>最后登录</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in adminList" :key="item.id">
            <td>
              <div class="admin-info">
                <img :src="item.avatar" />
                <div>
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.email }}</p>
                </div>
              </div>
            </td>
            <td>
              <span
                class="role-tag"
                :class="{
                  super: item.role === '超级管理员',
                  normal: item.role !== '超级管理员',
                }"
              >
                {{ item.role }}
              </span>
            </td>
            <td>{{ item.phone }}</td>
            <td>{{ item.lastLogin }}</td>
            <td>
              <span
                class="status-tag"
                :class="item.status === '正常' ? 'success' : 'danger'"
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

      <!-- 分页组件 -->
      <Pagination
        :total="total"
        :current="currentPage"
        :page-size="pageSize"
        @update:current="currentPage = $event"
      />
    </div>

    <!-- 新增/编辑管理员弹窗 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      subtitle="配置管理员账号信息"
      :fields="adminFields"
      :form-data="formData"
      @submit="handleSubmit"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  UserFilled,
  Avatar,
  Monitor,
  CircleCloseFilled,
  Search,
  Plus,
} from "@element-plus/icons-vue";
import Pagination from "../../../components/Pagination.vue";
import FormDialog from "../../../components/FormDialog.vue";

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(18);

// 弹窗相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentAdminId = ref(null);

// 弹窗标题
const dialogTitle = computed(() =>
  isEdit.value ? "编辑管理员" : "新增管理员",
);

// 禁用账号数量
const disabledCount = computed(() => {
  return adminList.value.filter((item) => item.status === "已禁用").length;
});

// 表单字段配置
const adminFields = [
  {
    label: "管理员名称",
    prop: "name",
    type: "input",
    placeholder: "请输入管理员名称",
  },
  {
    label: "邮箱地址",
    prop: "email",
    type: "input",
    placeholder: "请输入邮箱地址",
  },
  {
    label: "手机号码",
    prop: "phone",
    type: "input",
    placeholder: "请输入手机号码",
  },
  {
    label: "角色权限",
    prop: "role",
    type: "select",
    options: ["超级管理员", "运营管理员", "审核管理员"],
  },
  {
    label: "账号状态",
    prop: "status",
    type: "select",
    options: ["正常", "已禁用"],
  },
  {
    label: "备注信息",
    prop: "remark",
    type: "textarea",
    fullWidth: true,
    rows: 3,
    placeholder: "请输入备注信息",
  },
];

// 表单数据
const formData = reactive({
  name: "",
  email: "",
  phone: "",
  role: "运营管理员",
  status: "正常",
  remark: "",
});

// 管理员列表数据
const adminList = ref([
  {
    id: 1,
    name: "系统管理员",
    email: "admin@example.com",
    role: "超级管理员",
    phone: "138****1234",
    status: "正常",
    lastLogin: "2024-06-07 10:30",
    createTime: "2024-01-01",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    remark: "系统初始管理员",
  },
  {
    id: 2,
    name: "运营主管",
    email: "operate@example.com",
    role: "运营管理员",
    phone: "139****5678",
    status: "正常",
    lastLogin: "2024-06-07 09:20",
    createTime: "2024-02-10",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    remark: "负责日常运营",
  },
  {
    id: 3,
    name: "审核专员",
    email: "review@example.com",
    role: "审核管理员",
    phone: "156****9999",
    status: "已禁用",
    lastLogin: "2024-06-05 18:20",
    createTime: "2024-03-15",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    remark: "违规操作被禁用",
  },
]);

// 打开新增弹窗
const openAddDialog = () => {
  isEdit.value = false;
  currentAdminId.value = null;
  formData.name = "";
  formData.email = "";
  formData.phone = "";
  formData.role = "运营管理员";
  formData.status = "正常";
  formData.remark = "";
  dialogVisible.value = true;
};

// 打开编辑弹窗
const openEditDialog = (admin) => {
  isEdit.value = true;
  currentAdminId.value = admin.id;
  formData.name = admin.name;
  formData.email = admin.email;
  formData.phone = admin.phone;
  formData.role = admin.role;
  formData.status = admin.status;
  formData.remark = admin.remark || "";
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = (data) => {
  if (isEdit.value) {
    // 编辑管理员
    const index = adminList.value.findIndex(
      (a) => a.id === currentAdminId.value,
    );
    if (index !== -1) {
      adminList.value[index] = {
        ...adminList.value[index],
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: data.status,
        remark: data.remark,
      };
    }
  } else {
    // 新增管理员
    const newAdmin = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      lastLogin: "-",
      createTime: new Date().toISOString().slice(0, 10),
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 50) + 1}.jpg`,
      remark: data.remark,
    };
    adminList.value.unshift(newAdmin);
    total.value++;
  }
  dialogVisible.value = false;
};

// 删除管理员
const handleDelete = (item) => {
  if (confirm(`确定要删除管理员「${item.name}」吗？`)) {
    const index = adminList.value.findIndex((a) => a.id === item.id);
    if (index !== -1) {
      adminList.value.splice(index, 1);
      total.value--;
    }
  }
};

// 关闭弹窗
const handleCloseDialog = () => {
  formData.name = "";
  formData.email = "";
  formData.phone = "";
  formData.role = "运营管理员";
  formData.status = "正常";
  formData.remark = "";
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
}

.select {
  height: 42px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 0 14px;
  background: #fff;
}

/* 表格 */
.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
}

.admin-table td {
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.admin-info img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
}

.admin-info h4 {
  color: #14263f;
}

.admin-info p {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 13px;
}

.role-tag {
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
}

.role-tag.super {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

.role-tag.normal {
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
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
  transition: all 0.2s;
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

/* 分页样式覆盖 */
.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination span {
  color: #94a3b8;
}

.pages {
  display: flex;
  gap: 10px;
}

.page {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
}

.page.active {
  background: #18b57d;
  color: #fff;
  border-color: #18b57d;
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
  .admin-table {
    font-size: 12px;
    overflow-x: auto;
    display: block;
  }
}
</style>
