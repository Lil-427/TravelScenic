<template>
  <div class="notice-detail-page">
    <div class="detail-container" v-loading="loading">
      <el-button class="back-btn" @click="goBack">
        返回公告列表
      </el-button>

      <div v-if="detail.id" class="detail-card">
        <h1>{{ detail.title }}</h1>

        <div class="detail-meta">
          <span>{{ getTypeText(detail.type) }}</span>
          <span>发布人：{{ detail.publisher }}</span>
          <span>发布时间：{{ detail.publish_time }}</span>
        </div>

        <div class="detail-content">
          {{ detail.content }}
        </div>
      </div>

      <el-empty
        v-if="!loading && !detail.id"
        description="公告不存在"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getAnnouncementDetail } from '@/api/admin/announcement'

defineOptions({
  name: 'NoticeDetail'
})

const route = useRoute()
const router = useRouter()

const loading = ref(false)

const detail = reactive({
  id: '',
  title: '',
  content: '',
  type: '',
  publisher: '',
  publish_time: ''
})

const getTypeText = type => {
  const map = {
    1: '系统通知',
    2: '运营公告',
    3: '活动信息'
  }
  return map[Number(type)] || '公告'
}

const getDetail = async () => {
  const id = route.params.id

  if (!id) {
    ElMessage.error('公告ID不存在')
    return
  }

  loading.value = true

  try {
    const res = await getAnnouncementDetail(id)

    // 兼容两种返回格式：
    // 1. request 已经拦截处理过：res.data 就是公告数据
    // 2. axios 原始返回：res.data.data 才是公告数据
    const data = res.data?.data || res.data || {}

    detail.id = data.id
    detail.title = data.title
    detail.content = data.content
    detail.type = data.type
    detail.publisher = data.publisher
    detail.publish_time = data.publish_time
  } catch (error) {
    console.error('获取公告详情失败：', error)
    ElMessage.error('获取公告详情失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/notice')
}

onMounted(() => {
  getDetail()
})
</script>

<style scoped>
.notice-detail-page {
  min-height: 100vh;
  padding: 40px 0;
  background: #f7f8fa;
}

.detail-container {
  width: 900px;
  max-width: calc(100% - 40px);
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 20px;
}

.detail-card {
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.detail-card h1 {
  margin: 0;
  font-size: 30px;
  color: #222;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 18px;
  padding-bottom: 24px;
  color: #888;
  font-size: 14px;
  border-bottom: 1px solid #eee;
}

.detail-content {
  margin-top: 28px;
  line-height: 2;
  font-size: 16px;
  color: #444;
  white-space: pre-wrap;
}
</style>