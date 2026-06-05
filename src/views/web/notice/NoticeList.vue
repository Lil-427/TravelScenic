<template>
  <div class="notice-page">
    <div class="notice-banner">
      <h1>公告中心</h1>
      <p>查看平台最新通知、运营公告与活动信息</p >
    </div>

    <div class="notice-container">
      <div class="notice-header">
        <h2>公告列表</h2>
      </div>

      <div v-loading="loading" class="notice-list">
        <div
          v-for="item in noticeList"
          :key="item.id"
          class="notice-card"
          @click="goDetail(item.id)"
        >
          <div class="notice-card-left">
            <div class="notice-title">
              {{ item.title }}
            </div>

            <div class="notice-meta">
              <span class="notice-type">
                {{ getTypeText(item.type) }}
              </span>
              <span>{{ item.publish_time || '暂无发布时间' }}</span>
            </div>
          </div>

          <div class="notice-card-right">
            查看详情
          </div>
        </div>

        <el-empty
          v-if="!loading && noticeList.length === 0"
          description="暂无公告"
        />
      </div>

      <div class="pagination-box">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.size"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

defineOptions({
  name: 'NoticeList'
})

const router = useRouter()

const loading = ref(false)
const noticeList = ref([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  size: 10
})

const getTypeText = type => {
  const map = {
    1: '系统通知',
    2: '运营公告',
    3: '活动信息'
  }

  return map[Number(type)] || '公告'
}

const getList = async () => {
  loading.value = true

  try {
    const res = await request({
      url: '/announcement/list',
      method: 'get',
      params: {
        page: queryParams.page,
        size: queryParams.size
      }
    })

    console.log('公告列表接口返回：', res)

    /**
     * 兼容两种返回情况：
     * 1. request 已经拦截过：res.data 是真正数据
     * 2. axios 原始返回：res.data.data 是真正数据
     */
    const data = res.data?.data || res.data || res || {}

    noticeList.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('获取公告列表失败：', error)
    ElMessage.error('获取公告列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = size => {
  queryParams.size = size
  queryParams.page = 1
  getList()
}

const handleCurrentChange = page => {
  queryParams.page = page
  getList()
}

const goDetail = id => {
  router.push(`/notice/detail/${id}`)
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.notice-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.notice-banner {
  position: relative;
  padding: 90px 20px;
  text-align: center;
  color: #fff;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
    url('11.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
}

.notice-banner h1 {
  margin: 0;
  font-size: 38px;
  font-weight: 600;
}

.notice-banner p {
  margin-top: 14px;
  font-size: 16px;
  opacity: 0.9;
}

.notice-container {
  width: 1100px;
  max-width: calc(100% - 40px);
  margin: 30px auto;
  padding: 28px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.notice-header {
  margin-bottom: 20px;
}

.notice-header h2 {
  margin: 0;
  font-size: 24px;
  color: #222;
}

.notice-list {
  min-height: 300px;
}

.notice-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s;
}

.notice-card:hover {
  background: #f7fbf9;
  padding-left: 18px;
}

.notice-title {
  font-size: 18px;
  color: #222;
  font-weight: 500;
}

.notice-meta {
  margin-top: 10px;
  font-size: 14px;
  color: #999;
}

.notice-type {
  display: inline-block;
  margin-right: 16px;
  color: #2f8f6b;
}

.notice-card-right {
  color: #2f8f6b;
  font-size: 14px;
}

.pagination-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>