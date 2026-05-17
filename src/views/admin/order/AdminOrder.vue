<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>订单管理</h2>
        <p>查看与处理景区订单信息</p>
      </div>

      <button class="export-btn" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出订单
      </button>
    </div>

    <!-- 数据统计 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>订单总数</p>
          <h2>2,568</h2>
          <span>+12%</span>
        </div>
        <div class="icon green">
          <el-icon><Tickets /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>今日订单</p>
          <h2>128</h2>
          <span>+8%</span>
        </div>
        <div class="icon blue">
          <el-icon><ShoppingBag /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>待支付</p>
          <h2>36</h2>
          <span class="warning">需处理</span>
        </div>
        <div class="icon orange">
          <el-icon><WarningFilled /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>总收入</p>
          <h2>¥82,560</h2>
          <span>+18%</span>
        </div>
        <div class="icon purple">
          <el-icon><Coin /></el-icon>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-wrapper">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="filters">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input placeholder="搜索订单号/用户" />
          </div>
          <select class="select">
            <option>全部状态</option>
            <option>已支付</option>
            <option>待支付</option>
            <option>已取消</option>
          </select>
          <select class="select">
            <option>全部景区</option>
            <option>九寨沟</option>
            <option>黄山</option>
            <option>西湖</option>
          </select>
        </div>
      </div>

      <!-- 表格 -->
      <table class="order-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>用户</th>
            <th>景区名称</th>
            <th>订单金额</th>
            <th>支付状态</th>
            <th>下单时间</th>
            <th>游玩日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orderList" :key="item.id">
            <td>
              <span class="order-id">{{ item.orderNo }}</span>
            </td>
            <td>
              <div class="user-info">
                <img :src="item.avatar" />
                <div>
                  <h4>{{ item.user }}</h4>
                  <p>{{ item.phone }}</p>
                </div>
              </div>
            </td>
            <td>
              <div class="scenic-info">
                <img :src="item.cover" />
                <span>{{ item.scenic }}</span>
              </div>
            </td>
            <td class="price">¥{{ item.price }}</td>
            <td>
              <span
                class="status-tag"
                :class="{
                  success: item.status === '已支付',
                  warning: item.status === '待支付',
                  danger: item.status === '已取消',
                }"
              >
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.createTime }}</td>
            <td>{{ item.playDate }}</td>
            <td>
              <div class="actions">
                <button class="detail-btn" @click="openDetailDialog(item)">
                  详情
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

    <!-- 订单详情弹窗 -->
    <FormDialog
      v-model="detailDialogVisible"
      title="订单详情"
      subtitle="查看订单完整信息"
      :fields="orderFields"
      :form-data="orderForm"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  Tickets,
  ShoppingBag,
  WarningFilled,
  Coin,
  Search,
  Download,
} from "@element-plus/icons-vue";
import Pagination from "../../../components/Pagination.vue";
import FormDialog from "../../../components/FormDialog.vue";

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(128);

// 弹窗相关
const detailDialogVisible = ref(false);
const currentOrderId = ref(null);

// 订单表单数据（用于弹窗展示）
const orderForm = reactive({
  orderNo: "",
  user: "",
  phone: "",
  scenic: "",
  price: "",
  status: "",
  createTime: "",
  playDate: "",
  ticketCount: "",
  totalAmount: "",
  remark: "",
});

// 订单详情弹窗字段配置（只读展示）
const orderFields = [
  { label: "订单号", prop: "orderNo", type: "input", disabled: true },
  { label: "用户名称", prop: "user", type: "input", disabled: true },
  { label: "手机号码", prop: "phone", type: "input", disabled: true },
  { label: "景区名称", prop: "scenic", type: "input", disabled: true },
  { label: "门票单价", prop: "price", type: "input", disabled: true },
  { label: "购票数量", prop: "ticketCount", type: "input", disabled: true },
  { label: "订单总额", prop: "totalAmount", type: "input", disabled: true },
  {
    label: "支付状态",
    prop: "status",
    type: "select",
    options: ["已支付", "待支付", "已取消"],
    disabled: true,
  },
  { label: "下单时间", prop: "createTime", type: "input", disabled: true },
  { label: "游玩日期", prop: "playDate", type: "date", disabled: true },
  {
    label: "备注信息",
    prop: "remark",
    type: "textarea",
    fullWidth: true,
    rows: 3,
    disabled: true,
  },
];

// 订单列表数据
const orderList = ref([
  {
    id: 1,
    orderNo: "DD202406070001",
    user: "张小明",
    phone: "138****1234",
    scenic: "九寨沟景区",
    price: "268",
    status: "已支付",
    createTime: "2024-06-07 10:30",
    playDate: "2024-06-10",
    ticketCount: "2",
    totalAmount: "536",
    remark: "用户要求靠窗座位",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200",
  },
  {
    id: 2,
    orderNo: "DD202406070002",
    user: "李雪",
    phone: "139****5678",
    scenic: "杭州西湖",
    price: "128",
    status: "待支付",
    createTime: "2024-06-07 09:12",
    playDate: "2024-06-11",
    ticketCount: "1",
    totalAmount: "128",
    remark: "",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200",
  },
  {
    id: 3,
    orderNo: "DD202406070003",
    user: "王强",
    phone: "156****9999",
    scenic: "黄山风景区",
    price: "399",
    status: "已取消",
    createTime: "2024-06-06 18:20",
    playDate: "2024-06-15",
    ticketCount: "3",
    totalAmount: "1197",
    remark: "用户申请退款，已处理",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    cover: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200",
  },
]);

// 打开订单详情弹窗
const openDetailDialog = (order) => {
  currentOrderId.value = order.id;
  orderForm.orderNo = order.orderNo;
  orderForm.user = order.user;
  orderForm.phone = order.phone;
  orderForm.scenic = order.scenic;
  orderForm.price = order.price;
  orderForm.status = order.status;
  orderForm.createTime = order.createTime;
  orderForm.playDate = order.playDate;
  orderForm.ticketCount = order.ticketCount || "1";
  orderForm.totalAmount = order.totalAmount || order.price;
  orderForm.remark = order.remark || "";
  detailDialogVisible.value = true;
};

// 关闭弹窗
const handleCloseDialog = () => {
  // 重置表单
  Object.keys(orderForm).forEach((key) => {
    orderForm[key] = "";
  });
};

// 删除订单
const handleDelete = (item) => {
  if (confirm(`确定要删除订单「${item.orderNo}」吗？`)) {
    const index = orderList.value.findIndex((o) => o.id === item.id);
    if (index !== -1) {
      orderList.value.splice(index, 1);
      total.value--;
    }
  }
};

// 导出订单
const handleExport = () => {
  console.log("导出订单");
  // 后续实现导出功能
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

.export-btn {
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

.export-btn:hover {
  background: #0e9f6e;
}

/* 数据卡片 */
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

.stats-card .warning {
  color: #ff9f43;
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

.purple {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
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
.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
}

.order-table td {
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.order-id {
  color: #18b57d;
  font-weight: 600;
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
}

.user-info h4 {
  color: #14263f;
}

.user-info p {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 13px;
}

.scenic-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.scenic-info img {
  width: 64px;
  height: 42px;
  border-radius: 10px;
  object-fit: cover;
}

.scenic-info span {
  color: #334155;
}

.price {
  color: #ff9f43;
  font-weight: 700;
}

.status-tag {
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
}

.success {
  background: rgba(24, 181, 125, 0.1);
  color: #18b57d;
}

.warning {
  background: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
}

.danger {
  background: rgba(255, 93, 93, 0.1);
  color: #ff5d5d;
}

.actions {
  display: flex;
  gap: 10px;
}

.detail-btn,
.delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
}

.detail-btn {
  color: #18b57d;
}

.detail-btn:hover {
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
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .filters {
    flex-wrap: wrap;
  }
  .order-table {
    font-size: 12px;
    overflow-x: auto;
    display: block;
  }
}
</style>
