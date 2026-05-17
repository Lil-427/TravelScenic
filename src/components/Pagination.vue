<template>
  <div class="pagination-wrapper">
    <div class="pagination">
      <span class="total">共 {{ total }} 条</span>
      <div class="page-group">
        <button class="page prev" :disabled="current === 1" @click="handlePrev">
          <el-icon><ArrowLeft /></el-icon>
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="page"
          :class="{ active: current === page }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
        <button class="page next" :disabled="current === totalPages" @click="handleNext">
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  current: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:current', 'change'])

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const visiblePages = computed(() => {
  const pages = []
  let start, end

  if (totalPages.value <= 3) {
    start = 1
    end = totalPages.value
  } else {
    if (props.current <= 2) {
      start = 1
      end = 3
    } else if (props.current >= totalPages.value - 1) {
      start = totalPages.value - 2
      end = totalPages.value
    } else {
      start = props.current - 1
      end = props.current + 1
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const handlePrev = () => {
  if (props.current > 1) {
    const newPage = props.current - 1
    emit('update:current', newPage)
    emit('change', newPage)
  }
}

const handleNext = () => {
  if (props.current < totalPages.value) {
    const newPage = props.current + 1
    emit('update:current', newPage)
    emit('change', newPage)
  }
}

const handlePageChange = (page) => {
  if (page !== props.current) {
    emit('update:current', page)
    emit('change', page)
  }
}
</script>

<style scoped>
/* 外层容器 - 让分页组件始终在底部 */
.pagination-wrapper {
  margin-top: auto;
  padding-top: 20px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  color: #94a3b8;
  font-size: 14px;
}

.page-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page {
  min-width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.page:hover:not(:disabled) {
  border-color: #18b57d;
  color: #18b57d;
}

.page.active {
  background: #18b57d;
  color: #ffffff;
  border-color: #18b57d;
}

.page:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.prev,
.next {
  padding: 0 12px;
}

.page .el-icon {
  font-size: 14px;
}
</style>
