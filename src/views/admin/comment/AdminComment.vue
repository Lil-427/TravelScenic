<!-- CommentManage.vue - 评论管理（仅审核，无删除） -->
<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>评论管理</h2>
        <p>审核与管理用户景区评论内容</p>
      </div>
      <button class="export-btn" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出评论
      </button>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stats-card">
        <div>
          <p>评论总数</p>
          <h2>{{ total }}</h2>
          <span>+15%</span>
        </div>
        <div class="icon green">
          <el-icon><ChatDotRound /></el-icon>
        </div>
      </div>

      <div class="stats-card">
        <div>
          <p>今日新增</p>
          <h2>{{ todayCount }}</h2>
          <span>持续增长</span>
        </div>
        <div class="icon blue">
          <el-icon><ChatLineRound /></el-icon>
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

      <div class="stats-card">
        <div>
          <p>违规评论</p>
          <h2>{{ blockedCount }}</h2>
          <span class="danger">需关注</span>
        </div>
        <div class="icon red">
          <el-icon><CircleCloseFilled /></el-icon>
        </div>
      </div>
    </div>

    <!-- 评论列表表格 -->
    <div class="table-wrapper">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="filters">
          <div class="search-box">
            <el-icon><Search /></el-icon>
            <input
              v-model="searchKeyword"
              placeholder="搜索评论内容/用户"
              @keyup.enter="handleSearch"
            />
          </div>

          <select v-model="statusFilter" class="select">
            <option value="">全部状态</option>
            <option value="已通过">已通过</option>
            <option value="待审核">待审核</option>
            <option value="已屏蔽">已屏蔽</option>
          </select>

          <select v-model="scoreFilter" class="select">
            <option value="">全部评分</option>
            <option value="5">5星</option>
            <option value="4">4星</option>
            <option value="3">3星</option>
            <option value="2">2星</option>
            <option value="1">1星</option>
          </select>

          <button class="search-btn" @click="handleSearch">搜索</button>
          <button class="reset-btn" @click="handleReset">重置</button>
        </div>
      </div>

      <!-- 表格 -->
      <table class="comment-table">
        <thead>
          <tr>
            <th>用户信息</th>
            <th>评论内容</th>
            <th>景区名称</th>
            <th>评分</th>
            <th>状态</th>
            <th>评论时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in displayList" :key="item.id">
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
              <div class="comment-content">{{ item.content }}</div>
            </td>
            <td>
              <span class="scenic-name">{{ item.scenic }}</span>
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
                  success: item.status === '已通过',
                  warning: item.status === '待审核',
                  danger: item.status === '已屏蔽',
                }"
              >
                {{ item.status }}
              </span>
            </td>
            <td>{{ item.createTime }}</td>
            <td>
              <div class="actions">
                <!-- 待审核状态：显示通过和屏蔽按钮 -->
                <template v-if="item.status === '待审核'">
                  <button class="pass-btn" @click="handleApprove(item)">
                    通过
                  </button>
                  <button class="block-btn" @click="handleBlock(item)">
                    屏蔽
                  </button>
                </template>
                <!-- 已通过状态：显示屏蔽按钮 -->
                <button
                  v-if="item.status === '已通过'"
                  class="block-btn"
                  @click="handleBlock(item)"
                >
                  屏蔽
                </button>
                <!-- 已屏蔽状态：显示恢复按钮 -->
                <button
                  v-if="item.status === '已屏蔽'"
                  class="restore-btn"
                  @click="handleRestore(item)"
                >
                  恢复
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

    <!-- 审核弹窗（确认通过/屏蔽） -->
    <FormDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      subtitle="审核评论"
      :fields="auditFields"
      :form-data="formData"
      @submit="handleAuditSubmit"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  ChatDotRound,
  ChatLineRound,
  WarningFilled,
  CircleCloseFilled,
  Search,
  Download,
  StarFilled,
} from "@element-plus/icons-vue";
import Pagination from "../../../components/Pagination.vue";
import FormDialog from "../../../components/FormDialog.vue";

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(8526);

// 筛选条件
const searchKeyword = ref("");
const statusFilter = ref("");
const scoreFilter = ref("");

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const currentAction = ref(""); // 'approve', 'block'
const currentCommentItem = ref(null);

// 统计数量
const todayCount = ref(268);
const pendingCount = ref(32);
const blockedCount = ref(6);

// 弹窗字段配置（只有备注说明）
const auditFields = [
  {
    label: "用户",
    prop: "user",
    type: "input",
    disabled: true,
  },
  {
    label: "评论内容",
    prop: "originalContent",
    type: "textarea",
    rows: 3,
    disabled: true,
  },
  {
    label: "操作说明",
    prop: "remark",
    type: "textarea",
    rows: 2,
    placeholder: "请输入审核备注（选填）",
  },
];

// 表单数据
const formData = reactive({
  user: "",
  originalContent: "",
  remark: "",
});

// 评论列表数据
const commentList = ref([
  {
    id: 1,
    user: "张小明",
    phone: "138****1234",
    scenic: "九寨沟景区",
    score: "5.0",
    status: "已通过",
    createTime: "2024-06-07 10:30",
    content: "景区环境特别漂亮，体验感非常好，下次还会再来。",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 2,
    user: "李雪",
    phone: "139****5678",
    scenic: "杭州西湖",
    score: "4.5",
    status: "待审核",
    createTime: "2024-06-07 09:12",
    content: "风景不错，但是节假日游客有点多。",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: 3,
    user: "王强",
    phone: "156****9999",
    scenic: "黄山风景区",
    score: "2.0",
    status: "已屏蔽",
    createTime: "2024-06-06 18:20",
    content: "评论内容涉嫌违规，已被系统屏蔽。",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    id: 4,
    user: "赵丽颖",
    phone: "177****2345",
    scenic: "故宫博物院",
    score: "5.0",
    status: "已通过",
    createTime: "2024-06-07 08:45",
    content: "历史文化底蕴深厚，非常震撼，强烈推荐！",
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
  },
  {
    id: 5,
    user: "陈伟",
    phone: "188****3456",
    scenic: "张家界",
    score: "4.0",
    status: "待审核",
    createTime: "2024-06-07 07:30",
    content: "风景很美，但是门票有点贵。",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
  },
]);

// 筛选后的数据
const filteredList = computed(() => {
  let list = [...commentList.value];

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    list = list.filter(
      (item) =>
        item.content.toLowerCase().includes(keyword) ||
        item.user.toLowerCase().includes(keyword),
    );
  }

  if (statusFilter.value) {
    list = list.filter((item) => item.status === statusFilter.value);
  }

  if (scoreFilter.value) {
    const minScore = parseInt(scoreFilter.value);
    list = list.filter((item) => parseFloat(item.score) >= minScore);
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
  total.value = commentList.value.length;
  pendingCount.value = commentList.value.filter(
    (item) => item.status === "待审核",
  ).length;
  blockedCount.value = commentList.value.filter(
    (item) => item.status === "已屏蔽",
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
  scoreFilter.value = "";
  currentPage.value = 1;
};

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 打开审核弹窗（通过）
const handleApprove = (item) => {
  currentAction.value = "approve";
  currentCommentItem.value = item;
  dialogTitle.value = "审核通过";
  formData.user = item.user;
  formData.originalContent = item.content;
  formData.remark = "";
  dialogVisible.value = true;
};

// 屏蔽评论
const handleBlock = (item) => {
  currentAction.value = "block";
  currentCommentItem.value = item;
  dialogTitle.value = "屏蔽评论";
  formData.user = item.user;
  formData.originalContent = item.content;
  formData.remark = "";
  dialogVisible.value = true;
};

// 恢复评论（从屏蔽恢复为已通过）
const handleRestore = (item) => {
  if (confirm(`确定要恢复用户「${item.user}」的评论吗？`)) {
    const index = commentList.value.findIndex((c) => c.id === item.id);
    if (index !== -1) {
      commentList.value[index].status = "已通过";
      updateStats();
    }
  }
};

// 提交审核
const handleAuditSubmit = (data) => {
  const index = commentList.value.findIndex(
    (c) => c.id === currentCommentItem.value.id,
  );
  if (index !== -1) {
    if (currentAction.value === "approve") {
      commentList.value[index].status = "已通过";
    } else if (currentAction.value === "block") {
      commentList.value[index].status = "已屏蔽";
    }
    updateStats();
  }
  dialogVisible.value = false;
};

// 关闭弹窗
const handleCloseDialog = () => {
  formData.user = "";
  formData.originalContent = "";
  formData.remark = "";
  currentCommentItem.value = null;
};

// 导出评论
const handleExport = () => {
  alert(`共导出 ${total.value} 条评论数据`);
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
.comment-table {
  width: 100%;
  border-collapse: collapse;
}

.comment-table th {
  background: #f8fafc;
  padding: 18px;
  text-align: left;
  color: #64748b;
  font-weight: 600;
}

.comment-table td {
  padding: 20px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.empty-cell {
  text-align: center;
  color: #94a3b8;
  padding: 48px !important;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-info img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h4 {
  color: #14263f;
}

.user-info p {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 13px;
}

.comment-content {
  max-width: 360px;
  color: #475569;
  line-height: 1.7;
  word-break: break-all;
}

.scenic-name {
  color: #18b57d;
  font-weight: 600;
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
  flex-wrap: wrap;
}

.pass-btn,
.block-btn,
.restore-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
}

.pass-btn {
  color: #18b57d;
}

.block-btn {
  color: #ff9f43;
}

.restore-btn {
  color: #4a8cff;
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

  .comment-table {
    font-size: 12px;
    overflow-x: auto;
    display: block;
  }

  .comment-content {
    max-width: 200px;
  }
}
</style>
