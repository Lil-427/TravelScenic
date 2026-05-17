<template>
  <div class="user-manage">
    <!-- 数据统计卡片 -->
    <section class="stats-wrapper">
      <div class="stats-card">
        <div class="stats-left">
          <p>总用户数</p>
          <h2>12,568</h2>
          <span class="up">+12.5%</span>
        </div>
        <div class="stats-icon green">
          <el-icon><User /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-left">
          <p>今日新增</p>
          <h2>128</h2>
          <span class="up">+8.2%</span>
        </div>
        <div class="stats-icon blue">
          <el-icon><Plus /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-left">
          <p>活跃用户</p>
          <h2>8,321</h2>
          <span class="up">+5.6%</span>
        </div>
        <div class="stats-icon orange">
          <el-icon><DataAnalysis /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-left">
          <p>冻结账号</p>
          <h2>36</h2>
          <span class="down">-2.1%</span>
        </div>
        <div class="stats-icon red">
          <el-icon><WarningFilled /></el-icon>
        </div>
      </div>
    </section>

    <!-- 用户列表表格 -->
    <section class="table-wrapper">
      <!-- 表格顶部（搜索和新增按钮） -->
      <div class="table-header">
        <div class="header-left">
          <h3>用户列表</h3>
          <div class="filter-group">
            <div class="filter-item">
              <el-icon><Search /></el-icon>
              <input placeholder="搜索用户名/手机号..." />
            </div>
            <div class="filter-item">
              <el-icon><Filter /></el-icon>
              <select class="status-select">
                <option value="">全部状态</option>
                <option value="正常">正常</option>
                <option value="冻结">冻结</option>
              </select>
            </div>
          </div>
        </div>
        <button class="add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新增用户
        </button>
      </div>

      <!-- 表格 -->
      <table class="user-table">
        <thead>
          <tr>
            <th>用户信息</th>
            <th>手机号</th>
            <th>状态</th>
            <th>注册时间</th>
            <th>最近登录</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userList" :key="item.id">
            <td>
              <div class="user-info">
                <img :src="item.avatar" />
                <div>
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.email }}</p>
                </div>
              </div>
            </td>
            <td>{{ item.phone }}</td>
            <td>
              <span
                class="status-tag"
                :class="item.status === '正常' ? 'success' : 'danger'"
              >
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.registerTime }}</td>
            <td>{{ item.lastLogin }}</td>
            <td>
              <div class="action-group">
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
    </section>

    <!-- 新增/编辑用户弹窗 -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      subtitle="填写用户基础信息"
      :fields="userFields"
      :form-data="formData"
      :show-avatar="isEdit"
      avatar-field="avatar"
      @submit="handleSubmit"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  Plus,
  Search,
  Filter,
  User,
  DataAnalysis,
  WarningFilled,
} from "@element-plus/icons-vue";
import Pagination from "../../../components/Pagination.vue";
import FormDialog from "../../../components/FormDialog.vue";

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(68);

// 弹窗相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentUserId = ref(null);

// 弹窗标题
const dialogTitle = computed(() => (isEdit.value ? "编辑用户" : "新增用户"));

// 表单字段配置
const userFields = [
  {
    label: "用户昵称",
    prop: "name",
    type: "input",
    placeholder: "请输入用户昵称",
  },
  {
    label: "手机号码",
    prop: "phone",
    type: "input",
    placeholder: "请输入手机号码",
  },
  {
    label: "邮箱地址",
    prop: "email",
    type: "input",
    placeholder: "请输入邮箱地址",
  },
  {
    label: "账号状态",
    prop: "status",
    type: "select",
    options: ["正常", "冻结"],
  },
  {
    label: "备注信息",
    prop: "remark",
    type: "textarea",
    fullWidth: true,
    rows: 4,
    placeholder: "请输入备注内容",
  },
];

// 表单数据
const formData = reactive({
  name: "",
  phone: "",
  email: "",
  status: "正常",
  remark: "",
  avatar: "",
});

// 用户列表数据
const userList = ref([
  {
    id: 1,
    name: "张小明",
    email: "zhang@example.com",
    phone: "138****1234",
    status: "正常",
    registerTime: "2024-06-01",
    lastLogin: "2024-06-07 10:30",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    remark: "活跃用户",
  },
  {
    id: 2,
    name: "李雪",
    email: "li@example.com",
    phone: "139****5678",
    status: "正常",
    registerTime: "2024-05-20",
    lastLogin: "2024-06-07 08:12",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    remark: "VIP会员",
  },
  {
    id: 3,
    name: "王强",
    email: "wang@example.com",
    phone: "156****9999",
    status: "冻结",
    registerTime: "2024-05-11",
    lastLogin: "2024-06-05 18:20",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    remark: "违规操作冻结",
  },
]);

// 打开新增弹窗
const openAddDialog = () => {
  isEdit.value = false;
  currentUserId.value = null;
  // 重置表单
  formData.name = "";
  formData.phone = "";
  formData.email = "";
  formData.status = "正常";
  formData.remark = "";
  formData.avatar = "";
  dialogVisible.value = true;
};

// 打开编辑弹窗
const openEditDialog = (user) => {
  isEdit.value = true;
  currentUserId.value = user.id;
  // 填充表单
  formData.name = user.name;
  formData.phone = user.phone;
  formData.email = user.email;
  formData.status = user.status;
  formData.remark = user.remark || "";
  formData.avatar = user.avatar;
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = (data) => {
  if (isEdit.value) {
    // 编辑用户
    const index = userList.value.findIndex((u) => u.id === currentUserId.value);
    if (index !== -1) {
      userList.value[index] = {
        ...userList.value[index],
        name: data.name,
        phone: data.phone,
        email: data.email,
        status: data.status,
        remark: data.remark,
      };
    }
  } else {
    // 新增用户
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      registerTime: new Date().toISOString().slice(0, 10),
      lastLogin: "-",
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 50) + 1}.jpg`,
      remark: data.remark,
    };
    userList.value.unshift(newUser);
    total.value++;
  }
  dialogVisible.value = false;
};

// 删除用户
const handleDelete = (item) => {
  if (confirm(`确定要删除用户「${item.name}」吗？`)) {
    const index = userList.value.findIndex((u) => u.id === item.id);
    if (index !== -1) {
      userList.value.splice(index, 1);
      total.value--;
    }
  }
};

// 关闭弹窗
const handleCloseDialog = () => {
  // 重置表单
  formData.name = "";
  formData.phone = "";
  formData.email = "";
  formData.status = "正常";
  formData.remark = "";
  formData.avatar = "";
};
</script>

<style scoped>
.user-manage {
  margin-top: 24px;
}

/* 统计卡片 */
.stats-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
}

.stats-left p {
  font-size: 14px;
  color: #94a3b8;
}

.stats-left h2 {
  font-size: 34px;
  color: #14263f;
  margin-top: 10px;
}

.stats-left span {
  display: inline-block;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
}

.up {
  color: #18b57d;
}

.down {
  color: #ff5d5d;
}

.stats-icon {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-icon .el-icon {
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
  background: #ffffff;
  border-radius: 28px;
  padding: 26px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h3 {
  font-size: 24px;
  color: #14263f;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border-radius: 14px;
  padding: 0 16px;
  height: 42px;
  border: 1px solid #eef2f6;
  transition: all 0.2s;
}

.filter-item:focus-within {
  border-color: #18b57d;
  box-shadow: 0 0 0 2px rgba(24, 181, 125, 0.1);
}

.filter-item .el-icon {
  color: #94a3b8;
  font-size: 18px;
}

.filter-item input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 14px;
  color: #334155;
}

.filter-item input::placeholder {
  color: #cbd5e1;
}

/* 下拉框样式 */
.status-select {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  padding-right: 4px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.status-select option {
  color: #334155;
  background: #ffffff;
  padding: 8px;
}

.status-select:focus {
  outline: none;
  border: none;
}

.add-btn {
  height: 42px;
  padding: 0 22px;
  border: none;
  border-radius: 14px;
  background: #18b57d;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #0e9f6e;
}

/* 表格 */
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
}

.user-table thead tr {
  background: #f8fafc;
  border-radius: 16px;
}

.user-table th {
  padding: 18px 16px;
  text-align: left;
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
}

.user-table td {
  padding: 20px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-info img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h4 {
  font-size: 15px;
  color: #14263f;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-info p {
  color: #94a3b8;
  font-size: 13px;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
}

.success {
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
}

.danger {
  background: rgba(255, 93, 93, 0.1);
  color: #ff5d5d;
}

/* 操作按钮 */
.action-group {
  display: flex;
  gap: 12px;
}

.edit-btn,
.delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
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

/* 响应式 */
@media (max-width: 1200px) {
  .stats-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .table-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  .filter-group {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .stats-wrapper {
    grid-template-columns: 1fr;
  }
  .user-table {
    font-size: 12px;
  }
  .user-table th,
  .user-table td {
    padding: 12px 8px;
  }
  .user-info img {
    width: 32px;
    height: 32px;
  }
  .action-group {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
