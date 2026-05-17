<!-- views/web/spot-detail/spot-detail.vue -->
<template>
  <div class="spot-detail-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>

    <div class="detail-container">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <el-icon><ArrowRight /></el-icon>
        <router-link to="/category">景点目的地</router-link>
        <el-icon><ArrowRight /></el-icon>
        <router-link to="/category">四川</router-link>
        <el-icon><ArrowRight /></el-icon>
        <span class="current">{{ spotData.name }}</span>
      </div>

      <!-- 轮播图区域 -->
      <div class="carousel-container">
        <el-carousel :interval="5000" arrow="always" height="460px" class="spot-carousel">
          <el-carousel-item v-for="(img, idx) in spotData.images" :key="idx">
            <img :src="img" :alt="spotData.name" class="carousel-image" />
          </el-carousel-item>
        </el-carousel>
        <button class="favorite-btn" :class="{ favorited: isFavorited }" @click="toggleFavorite">
          <el-icon><Star /></el-icon>
          {{ isFavorited ? '已收藏' : '收藏' }}
        </button>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 左侧：详细信息 -->
        <div class="content-left">
          <!-- 基本信息卡片 -->
          <div class="info-card">
            <div class="card-header">
              <div>
                <div class="title-row">
                  <h1>{{ spotData.name }}</h1>
                  <span class="rank-badge">{{ spotData.rank }}</span>
                </div>
                <div class="rating-row">
                  <div class="score-badge">
                    <el-icon><Star /></el-icon>
                    <span class="score">{{ spotData.score }}</span>
                    <span>分</span>
                  </div>
                  <span class="review-count"
                    >{{ spotData.reviewsCount.toLocaleString() }} 条真实评价</span
                  >
                </div>
              </div>
              <div class="action-buttons">
                <button class="action-btn">
                  <el-icon><Share /></el-icon>
                </button>
              </div>
            </div>

            <div class="tags">
              <span v-for="(tag, idx) in spotData.tags" :key="idx" class="tag">{{ tag }}</span>
            </div>

            <p class="description">{{ spotData.description }}</p>

            <!-- 景点地址和开放时间 -->
            <div class="info-grid">
              <div class="info-item">
                <el-icon><Location /></el-icon>
                <div>
                  <h4>景点地址</h4>
                  <p>{{ spotData.location }}</p>
                  <a href="#" class="map-link" @click.prevent="openMap">查看地图 →</a>
                </div>
              </div>
              <div class="info-item">
                <el-icon><Clock /></el-icon>
                <div>
                  <h4>开放时间</h4>
                  <p>{{ spotData.openTime }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 门票预订区域 -->
          <div id="tickets-section" class="ticket-card">
            <h2>
              <span class="title-bar"></span>
              门票预订
            </h2>

            <div class="ticket-list">
              <!-- 成人票 -->
              <div class="ticket-item">
                <div class="ticket-info">
                  <h4>成人票</h4>
                  <div class="ticket-features">
                    <span
                      ><el-icon><CircleCheck /></el-icon>随时退</span
                    >
                    <span
                      ><el-icon><CircleCheck /></el-icon>免取票</span
                    >
                    <span>凭身份证直接入园</span>
                  </div>
                  <div class="stock-badge">今日票量充足</div>
                </div>
                <div class="ticket-price">
                  <div class="price">
                    <span class="currency">¥</span>
                    <span class="value">{{ adultTicket.price }}</span>
                  </div>
                  <button class="book-btn" @click="openBookingModal('adult')">立即预定</button>
                </div>
              </div>

              <!-- 儿童票 -->
              <div class="ticket-item">
                <div class="ticket-info">
                  <h4>儿童票</h4>
                  <div class="ticket-features">
                    <span
                      ><el-icon><CircleCheck /></el-icon>随时退</span
                    >
                    <span
                      ><el-icon><CircleCheck /></el-icon>免取票</span
                    >
                    <span>凭有效证件入园</span>
                  </div>
                  <div class="stock-badge">今日票量充足</div>
                </div>
                <div class="ticket-price">
                  <div class="price">
                    <span class="currency">¥</span>
                    <span class="value">{{ childTicket.price }}</span>
                  </div>
                  <button class="book-btn" @click="openBookingModal('child')">立即预定</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：信息侧边栏 -->
        <div class="content-right">
          <div class="sidebar-card">
            <!-- 写评论按钮 -->
            <div class="write-review-btn-wrapper">
              <button class="write-review-btn" @click="openReviewModal">
                <el-icon><EditPen /></el-icon>
                写评论
              </button>
            </div>

            <!-- 评论区 -->
            <div class="comments-section">
              <div class="comments-header">
                <h4>用户评价</h4>
                <span class="comments-total">{{ allComments.length }}条评论</span>
              </div>
              <div class="comments-list">
                <div v-for="comment in paginatedComments" :key="comment.id" class="comment-item">
                  <div class="comment-avatar">
                    <img :src="comment.avatar" :alt="comment.nickname" />
                  </div>
                  <div class="comment-content">
                    <div class="comment-user">
                      <span class="user-name">{{ comment.nickname }}</span>
                      <div class="user-stars">
                        <span
                          v-for="n in 5"
                          :key="n"
                          class="star"
                          :class="{ active: n <= comment.rating }"
                          >★</span
                        >
                      </div>
                      <span class="comment-time">{{ comment.createTime }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                    <div class="comment-actions">
                      <button class="comment-like-btn" @click.stop="likeComment(comment.id)">
                        <el-icon><Star /></el-icon>
                        <span>{{ comment.likes || 0 }}</span>
                      </button>
                      <button class="comment-reply-btn" @click.stop="openReplyModal(comment)">
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 分页 -->
              <div class="comments-pagination" v-if="totalPages > 1">
                <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
                  上一页
                </button>
                <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                <button
                  class="page-btn"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  下一页
                </button>
              </div>
            </div>

            <!-- 服务保障 -->
            <div class="service-section">
              <h4>平台服务保障</h4>
              <div class="service-item">
                <div class="service-icon">
                  <el-icon><CircleCheck /></el-icon>
                </div>
                <div>
                  <div class="service-title">官方直营认证</div>
                  <div class="service-desc">平台官方合作景区，门票100%保真</div>
                </div>
              </div>
              <div class="service-item">
                <div class="service-icon">
                  <el-icon><Timer /></el-icon>
                </div>
                <div>
                  <div class="service-title">极速出票入园</div>
                  <div class="service-desc">付款后秒出票，刷身份证快速入园</div>
                </div>
              </div>
            </div>

            <!-- 出游提醒 -->
            <div class="reminder-section">
              <h4>出游提醒</h4>
              <div class="reminder-item">
                <el-icon><InfoFilled /></el-icon>
                <span>请携带本人有效身份证件入园</span>
              </div>
              <div class="reminder-item">
                <el-icon><InfoFilled /></el-icon>
                <span>景区禁止携带宠物入园</span>
              </div>
              <div class="reminder-item">
                <el-icon><InfoFilled /></el-icon>
                <span>建议提前30分钟到达景区</span>
              </div>
              <div class="reminder-item">
                <el-icon><InfoFilled /></el-icon>
                <span>旺季请提前3天预约购票</span>
              </div>
            </div>

            <!-- 联系客服 -->
            <div class="help-link">
              <span>预订遇到问题？</span>
              <button @click="contactService">
                联系客服 <el-icon><ArrowRight /></el-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 购买弹窗 -->
    <el-dialog
      v-model="showBookingModal"
      :title="bookingTitle"
      width="480px"
      class="booking-dialog"
      :before-close="closeBookingModal"
    >
      <div class="booking-form">
        <div class="form-row">
          <label>游玩日期</label>
          <el-date-picker
            v-model="bookingData.travelDate"
            type="date"
            placeholder="选择日期"
            :min-date="minDate"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </div>

        <div class="form-row">
          <label>购买数量</label>
          <div class="quantity-selector">
            <button class="qty-btn" @click="decreaseQty" :disabled="bookingData.quantity <= 1">
              <el-icon><Minus /></el-icon>
            </button>
            <span class="quantity">{{ bookingData.quantity }}</span>
            <button class="qty-btn" @click="increaseQty">
              <el-icon><Plus /></el-icon>
            </button>
          </div>
        </div>

        <div class="form-row">
          <label>联系人姓名</label>
          <el-input v-model="bookingData.contactName" placeholder="请填写真实姓名" />
        </div>

        <div class="form-row">
          <label>联系电话</label>
          <el-input v-model="bookingData.contactPhone" placeholder="请填写手机号码" />
        </div>

        <div class="total-line">
          <span>合计金额</span>
          <span class="total-price">¥{{ bookingTotalPrice }}</span>
        </div>

        <div class="dialog-actions">
          <button class="add-cart-btn" @click="addToCart">加入购物车</button>
          <button class="pay-btn" @click="handlePay">立即支付</button>
        </div>
      </div>
    </el-dialog>

    <!-- 评论弹窗 -->
    <el-dialog
      v-model="showReviewModal"
      title="发表评论"
      width="480px"
      class="review-dialog"
      :before-close="closeReviewModal"
    >
      <div class="review-form">
        <div class="form-row">
          <label>评分</label>
          <div class="stars-input">
            <span
              v-for="n in 5"
              :key="n"
              class="star-input"
              :class="{ active: n <= newRating }"
              @click="setRating(n)"
            >
              ★
            </span>
            <span class="rating-text">{{ getRatingText(newRating) }}</span>
          </div>
        </div>

        <div class="form-row">
          <label>评论内容</label>
          <textarea
            v-model="newCommentContent"
            placeholder="分享你的游玩体验..."
            rows="5"
            class="review-textarea"
          ></textarea>
        </div>

        <div class="dialog-actions">
          <button class="cancel-review-btn" @click="closeReviewModal">取消</button>
          <button class="submit-review-btn" @click="submitReview">发表评论</button>
        </div>
      </div>
    </el-dialog>

    <!-- 回复弹窗 -->
    <el-dialog
      v-model="showReplyModal"
      title="回复评论"
      width="480px"
      class="review-dialog"
      :before-close="closeReplyModal"
    >
      <div class="review-form">
        <div class="reply-info">
          <el-icon><ChatDotRound /></el-icon>
          <span>回复 @{{ replyTarget.nickname }}：</span>
        </div>

        <div class="form-row">
          <label>回复内容</label>
          <textarea
            v-model="replyContent"
            placeholder="写下你的回复..."
            rows="5"
            class="review-textarea"
          ></textarea>
        </div>

        <div class="dialog-actions">
          <button class="cancel-review-btn" @click="closeReplyModal">取消</button>
          <button class="submit-review-btn" @click="submitReply">发表回复</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowRight,
  Star,
  Share,
  Location,
  Clock,
  CircleCheck,
  Timer,
  InfoFilled,
  Minus,
  Plus,
  EditPen,
  ChatDotRound
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const spotId = route.params.id

// 状态
const isFavorited = ref(false)
const showBookingModal = ref(false)
const showReviewModal = ref(false)
const showReplyModal = ref(false)
const currentTicketType = ref('adult')
const currentPage = ref(1)
const pageSize = 3

// 写评论相关
const newCommentContent = ref('')
const newRating = ref(5)

// 回复相关
const replyContent = ref('')
const replyTarget = ref({})

// 门票价格
const adultTicket = { type: 'adult', name: '成人票', price: 280 }
const childTicket = { type: 'child', name: '儿童票', price: 140 }

// 预订数据
const bookingData = ref({
  travelDate: '',
  quantity: 1,
  contactName: '',
  contactPhone: ''
})

// 所有评论
const allComments = ref([
  {
    id: 1,
    nickname: '旅行达人',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    rating: 5,
    content: '太美了！五彩池的水清澈见底，秋天的彩林更是美不胜收，强烈推荐大家去！',
    createTime: '2025-01-15',
    likes: 23,
    isLiked: false
  },
  {
    id: 2,
    nickname: '山水之间',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    rating: 4,
    content: '景色确实很美，就是人有点多，建议避开节假日。景区管理很规范，值得一游。',
    createTime: '2025-01-10',
    likes: 12,
    isLiked: false
  },
  {
    id: 3,
    nickname: '摄影爱好者',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    rating: 5,
    content: '摄影天堂！每个角度都是大片，秋天的色彩太丰富了。',
    createTime: '2025-01-05',
    likes: 8,
    isLiked: false
  },
  {
    id: 4,
    nickname: '家庭出游',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    rating: 5,
    content: '带孩子来的，景区设施很完善，观光车很方便，景色真的太震撼了！',
    createTime: '2024-12-28',
    likes: 15,
    isLiked: false
  },
  {
    id: 5,
    nickname: '背包客小刘',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    rating: 4,
    content: '淡季来的，人少景美，住沟口很方便，下次还会再来。',
    createTime: '2024-12-20',
    likes: 9,
    isLiked: false
  }
])

// 分页后的评论
const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return allComments.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(allComments.value.length / pageSize))

// 最小日期（今天）
const minDate = computed(() => {
  const today = new Date()
  return today
})

// 弹窗标题
const bookingTitle = computed(() => {
  return currentTicketType.value === 'adult' ? '购买成人票' : '购买儿童票'
})

// 当前门票价格
const currentPrice = computed(() => {
  return currentTicketType.value === 'adult' ? adultTicket.price : childTicket.price
})

// 总价
const bookingTotalPrice = computed(() => {
  return currentPrice.value * bookingData.value.quantity
})

// 景点数据
const spotData = {
  name: '九寨沟风景名胜区',
  rank: '5A级景区',
  score: 4.9,
  reviewsCount: 12845,
  description:
    '九寨沟位于四川省阿坝藏族羌族自治州九寨沟县境内，地处青藏高原、川西高原、山地向四川盆地过渡地带，属世界高寒喀斯特地貌。这里有"童话世界"之誉，五彩斑斓的湖泊、瀑布群和连绵的雪峰构成了绝美的自然画卷。水是九寨沟的精灵，湖、泉、瀑、溪、河、滩，连缀一体，飞动与静谧结合，刚烈与温柔相济。',
  location: '四川省阿坝藏族羌族自治州九寨沟县漳扎镇',
  openTime: '08:00 - 17:30（14:00停止入园）',
  tags: ['自然风光', '世界自然遗产', '必打卡', '摄影胜地'],
  images: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format',
    'https://images.unsplash.com/photo-1490263658593-ba8a9cce0d62?q=80&w=1200&auto=format',
    'https://images.unsplash.com/photo-1543085023-e18e8d89e5a1?q=80&w=1200&auto=format',
    'https://images.unsplash.com/photo-1526367339739-1bc433589b25?q=80&w=1200&auto=format'
  ]
}

// 获取评分文字
const getRatingText = (rating) => {
  const texts = { 1: '很差', 2: '较差', 3: '一般', 4: '满意', 5: '非常满意' }
  return texts[rating] || ''
}

// 设置评分
const setRating = (rating) => {
  newRating.value = rating
}

// 打开评论弹窗
const openReviewModal = () => {
  newCommentContent.value = ''
  newRating.value = 5
  showReviewModal.value = true
}

// 关闭评论弹窗
const closeReviewModal = () => {
  showReviewModal.value = false
  newCommentContent.value = ''
  newRating.value = 5
}

// 提交评论
const submitReview = () => {
  if (!newCommentContent.value.trim()) {
    alert('请输入评论内容')
    return
  }

  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`

  const newComment = {
    id: Date.now(),
    nickname: '游客用户',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    rating: newRating.value,
    content: newCommentContent.value.trim(),
    createTime: formattedDate,
    likes: 0,
    isLiked: false
  }

  allComments.value.unshift(newComment)

  // 更新总评论数和评分
  const totalScore = allComments.value.reduce((sum, c) => sum + c.rating, 0)
  const newAvgScore = totalScore / allComments.value.length
  spotData.score = newAvgScore.toFixed(1)
  spotData.reviewsCount = allComments.value.length

  closeReviewModal()
  alert('评论发表成功！')
}

// 打开回复弹窗
const openReplyModal = (comment) => {
  replyTarget.value = comment
  replyContent.value = ''
  showReplyModal.value = true
}

// 关闭回复弹窗
const closeReplyModal = () => {
  showReplyModal.value = false
  replyTarget.value = {}
  replyContent.value = ''
}

// 提交回复
const submitReply = () => {
  if (!replyContent.value.trim()) {
    alert('请输入回复内容')
    return
  }

  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`

  const newReply = {
    id: Date.now(),
    nickname: '游客用户',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    rating: null,
    content: `回复 @${replyTarget.value.nickname}：${replyContent.value.trim()}`,
    createTime: formattedDate,
    likes: 0,
    isLiked: false,
    isReply: true,
    parentId: replyTarget.value.id
  }

  allComments.value.unshift(newReply)
  spotData.reviewsCount = allComments.value.length

  closeReplyModal()
  alert('回复发表成功！')
}

// 点赞评论
const likeComment = (commentId) => {
  const comment = allComments.value.find((c) => c.id === commentId)
  if (comment) {
    if (comment.isLiked) {
      comment.likes--
      comment.isLiked = false
    } else {
      comment.likes++
      comment.isLiked = true
    }
  }
}

// 方法
const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  alert(isFavorited.value ? '已添加到收藏' : '已取消收藏')
}

const openMap = () => {
  const address = encodeURIComponent(spotData.location)
  window.open(`https://map.baidu.com/search/${address}`, '_blank')
}

const contactService = () => {
  alert('客服热线：400-123-4567\n在线时间：09:00-21:00')
}

const openBookingModal = (type) => {
  currentTicketType.value = type
  bookingData.value = {
    travelDate: '',
    quantity: 1,
    contactName: '',
    contactPhone: ''
  }
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
}

const increaseQty = () => {
  bookingData.value.quantity++
}

const decreaseQty = () => {
  if (bookingData.value.quantity > 1) {
    bookingData.value.quantity--
  }
}

const addToCart = () => {
  if (!validateForm()) return
  alert(
    `已加入购物车！\n${bookingTitle.value}\n日期：${bookingData.value.travelDate}\n数量：${bookingData.value.quantity}张\n总价：¥${bookingTotalPrice.value}`
  )
  showBookingModal.value = false
}

const handlePay = () => {
  if (!validateForm()) return
  alert(
    `支付成功！\n${bookingTitle.value}\n日期：${bookingData.value.travelDate}\n数量：${bookingData.value.quantity}张\n总价：¥${bookingTotalPrice.value}\n联系人：${bookingData.value.contactName}\n电话：${bookingData.value.contactPhone}`
  )
  showBookingModal.value = false
}

const validateForm = () => {
  if (!bookingData.value.travelDate) {
    alert('请选择游玩日期')
    return false
  }
  if (!bookingData.value.contactName) {
    alert('请填写联系人姓名')
    return false
  }
  if (!bookingData.value.contactPhone) {
    alert('请填写联系电话')
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(bookingData.value.contactPhone)) {
    alert('请填写正确的手机号码')
    return false
  }
  return true
}
</script>

<style scoped>
.spot-detail-page {
  min-height: calc(100vh - 82px);
  background: #f5f8f7;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;
  pointer-events: none;
  background: linear-gradient(135deg, #e8f4f8 0%, #d4eaf0 50%, #c5e3e8 100%);
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
}

.detail-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px 24px 40px;
  position: relative;
  z-index: 10;
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #8a94a6;
  margin-bottom: 24px;
}

.breadcrumb a {
  color: #8a94a6;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #1ec58b;
}

.breadcrumb .current {
  color: #1a3c34;
  font-weight: 500;
}

.breadcrumb .el-icon {
  font-size: 12px;
}

/* 轮播图 */
.carousel-container {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.spot-carousel {
  border-radius: 20px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 460px;
  object-fit: cover;
}

:deep(.el-carousel__container) {
  height: 460px;
}

.favorite-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  color: #5a6e66;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  background: #fff;
}

.favorite-btn.favorited {
  background: #1ec58b;
  color: #fff;
}

/* 主内容区 */
.main-content {
  display: flex;
  gap: 24px;
}

.content-left {
  flex: 1;
  min-width: 0;
}

.content-right {
  width: 340px;
  flex-shrink: 0;
}

/* 信息卡片 */
.info-card {
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f2f5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.title-row h1 {
  font-size: 28px;
  font-weight: 700;
  color: #172433;
  margin: 0;
}

.rank-badge {
  background: #fff4e6;
  color: #ff6a00;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.score-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf6;
  padding: 6px 14px;
  border-radius: 30px;
  border: 1px solid rgba(30, 197, 139, 0.2);
}

.score-badge .el-icon {
  color: #1ec58b;
  font-size: 14px;
}

.score-badge .score {
  font-size: 16px;
  font-weight: 700;
  color: #1ec58b;
}

.review-count {
  font-size: 13px;
  color: #8a94a6;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f8faf9;
  border: 1px solid #edf2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #8a94a6;
}

.action-btn:hover {
  background: #ecf9f4;
  border-color: rgba(30, 197, 139, 0.3);
  color: #1ec58b;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  border: 1px solid #e2e8f0;
  background: #fafbfc;
  color: #5a6e66;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
}

.description {
  font-size: 15px;
  line-height: 1.8;
  color: #5a6e66;
  margin-bottom: 24px;
}

/* 地址和时间网格 */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 14px;
  background: #f8faf9;
  padding: 18px;
  border-radius: 20px;
  transition: all 0.2s;
}

.info-item:hover {
  background: #f0fdf6;
}

.info-item .el-icon {
  font-size: 20px;
  color: #1ec58b;
  flex-shrink: 0;
}

.info-item h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1a3c34;
  margin: 0 0 4px 0;
}

.info-item p {
  font-size: 13px;
  color: #8a94a6;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.map-link {
  font-size: 12px;
  color: #1ec58b;
  text-decoration: none;
  font-weight: 500;
}

.map-link:hover {
  text-decoration: underline;
}

/* 门票卡片 */
.ticket-card {
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f2f5;
}

.ticket-card h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #172433;
  margin-bottom: 24px;
}

.title-bar {
  width: 4px;
  height: 22px;
  background: #1ec58b;
  border-radius: 2px;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ticket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #edf2f7;
  border-radius: 20px;
  transition: all 0.2s;
}

.ticket-item:hover {
  border-color: rgba(30, 197, 139, 0.4);
  box-shadow: 0 8px 24px rgba(30, 197, 139, 0.06);
}

.ticket-info h4 {
  font-size: 17px;
  font-weight: 600;
  color: #172433;
  margin: 0 0 10px 0;
}

.ticket-features {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #8a94a6;
  margin-bottom: 12px;
}

.ticket-features span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ticket-features .el-icon {
  color: #1ec58b;
  font-size: 12px;
}

.stock-badge {
  display: inline-block;
  background: #ecf9f4;
  color: #1ec58b;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
}

.ticket-price {
  text-align: right;
  flex-shrink: 0;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}

.price .currency {
  font-size: 14px;
  color: #ff6a00;
  font-weight: 600;
}

.price .value {
  font-size: 32px;
  font-weight: 700;
  color: #ff6a00;
}

.book-btn {
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  border: none;
  padding: 10px 28px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.book-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(30, 197, 139, 0.3);
}

/* 右侧边栏 */
.sidebar-card {
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f2f5;
  position: sticky;
  top: 24px;
}

/* 写评论按钮 */
.write-review-btn-wrapper {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
}

.write-review-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  color: #fff;
  border: none;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.write-review-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(30, 197, 139, 0.3);
}

/* 评论区 */
.comments-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.comments-header h4 {
  font-size: 15px;
  font-weight: 700;
  color: #172433;
  margin: 0;
}

.comments-total {
  font-size: 12px;
  color: #8a94a6;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 12px;
  max-height: 320px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a3c34;
}

.star {
  color: #ddd;
  font-size: 12px;
}

.star.active {
  color: #ffb800;
}

.comment-time {
  font-size: 10px;
  color: #b8c5d0;
}

.comment-text {
  font-size: 12px;
  line-height: 1.5;
  color: #5a6e66;
  margin: 0 0 8px 0;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.comment-like-btn,
.comment-reply-btn {
  background: none;
  border: none;
  font-size: 11px;
  color: #8a94a6;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;
}

.comment-like-btn:hover,
.comment-reply-btn:hover {
  color: #1ec58b;
}

.comments-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.page-btn {
  padding: 4px 12px;
  background: #f5f7f9;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1ec58b;
  color: #1ec58b;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 12px;
  color: #8a94a6;
}

/* 服务保障 */
.service-section {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
}

.service-section h4 {
  font-size: 15px;
  font-weight: 700;
  color: #172433;
  margin-bottom: 16px;
}

.service-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.service-icon {
  width: 36px;
  height: 36px;
  background: #ecf9f4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-icon .el-icon {
  font-size: 18px;
  color: #1ec58b;
}

.service-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a3c34;
  margin-bottom: 4px;
}

.service-desc {
  font-size: 12px;
  color: #8a94a6;
  line-height: 1.4;
}

/* 出游提醒 */
.reminder-section {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
}

.reminder-section h4 {
  font-size: 15px;
  font-weight: 700;
  color: #172433;
  margin-bottom: 14px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #5a6e66;
  margin-bottom: 12px;
}

.reminder-item .el-icon {
  color: #ff6a00;
  font-size: 14px;
}

/* 联系客服 */
.help-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #8a94a6;
  padding-top: 8px;
}

.help-link button {
  background: none;
  border: none;
  color: #1ec58b;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 购买弹窗 */
.booking-dialog :deep(.el-dialog) {
  border-radius: 24px !important;
  overflow: hidden;
}

.booking-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #edf2f7;
  padding: 20px 24px;
  margin: 0;
}

.booking-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #172433;
}

.booking-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

/* 评论弹窗样式 */
.review-dialog :deep(.el-dialog) {
  border-radius: 24px !important;
  overflow: hidden;
}

.review-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #edf2f7;
  padding: 20px 24px;
  margin: 0;
}

.review-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #172433;
}

.review-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stars-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.star-input {
  font-size: 28px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star-input:hover,
.star-input.active {
  color: #ffb800;
}

.rating-text {
  font-size: 13px;
  color: #8a94a6;
  margin-left: 8px;
}

.review-textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}

.review-textarea:focus {
  border-color: #1ec58b;
}

.reply-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 14px;
  color: #1ec58b;
}

.cancel-review-btn {
  flex: 1;
  padding: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-review-btn:hover {
  border-color: #e53e3e;
  color: #e53e3e;
}

.submit-review-btn {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  border: none;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-review-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(30, 197, 139, 0.3);
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row label {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 16px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  background: #f5f7f9;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: #1ec58b;
  border-color: #1ec58b;
  color: #fff;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity {
  font-size: 18px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px 0;
  border-top: 1px solid #edf2f7;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #4a5568;
}

.total-line .total-price {
  font-size: 28px;
  font-weight: 700;
  color: #ff6a00;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.add-cart-btn {
  flex: 1;
  padding: 12px;
  background: #fff;
  border: 1px solid #1ec58b;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 500;
  color: #1ec58b;
  cursor: pointer;
  transition: all 0.2s;
}

.add-cart-btn:hover {
  background: #ecf9f4;
}

.pay-btn {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #1ec58b, #149b71);
  border: none;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.pay-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(30, 197, 139, 0.3);
}

/* 响应式 */
@media (max-width: 1000px) {
  .main-content {
    flex-direction: column;
  }
  .content-right {
    width: 100%;
  }
  .carousel-image {
    height: 320px;
  }
  :deep(.el-carousel__container) {
    height: 320px;
  }
}

@media (max-width: 768px) {
  .detail-container {
    padding: 16px;
  }
  .title-row h1 {
    font-size: 22px;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .ticket-item {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  .ticket-price {
    text-align: center;
  }
  .ticket-features {
    justify-content: center;
  }
  .carousel-image {
    height: 240px;
  }
  :deep(.el-carousel__container) {
    height: 240px;
  }
  .favorite-btn {
    top: 12px;
    right: 12px;
    padding: 6px 14px;
    font-size: 12px;
  }
}
</style>
