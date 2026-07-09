<template>
  <div class="app-pagination" v-if="totalPages > 1">
    <div class="app-pagination__info text-muted">
      <small>Showing {{ start }}-{{ end }} of {{ total }} {{ itemName }}</small>
    </div>
    <nav class="app-pagination__nav" aria-label="Pagination">
      <ul class="pagination pagination-modern mb-0">
        <li v-if="!isCompact" class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goTo(1)" aria-label="First">
            <i class="fas fa-angle-double-left"></i>
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goTo(currentPage - 1)" aria-label="Previous">
            <i class="fas fa-chevron-left"></i>
          </a>
        </li>
        <li
          v-for="page in pages"
          :key="`p-${page}-${currentPage}-${totalPages}`"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="goTo(Number(page))">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goTo(currentPage + 1)" aria-label="Next">
            <i class="fas fa-chevron-right"></i>
          </a>
        </li>
        <li v-if="!isCompact" class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goTo(totalPages)" aria-label="Last">
            <i class="fas fa-angle-double-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    total: { type: Number, required: true },
    itemName: { type: String, default: 'items' },
    pageWindow: { type: Number, default: 6 }
  },
  emits: ['change'],
  data() {
    return {
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
    }
  },
  computed: {
    isCompact() {
      return this.viewportWidth < 768
    },
    effectivePageWindow() {
      if (this.viewportWidth < 576) return 3
      if (this.viewportWidth < 992) return 4
      return this.pageWindow
    },
    pages() {
      const total = this.totalPages
      const current = this.currentPage
      const windowSize = Math.max(1, this.effectivePageWindow)
      if (total <= windowSize) {
        const all = []
        for (let i = 1; i <= total; i++) all.push(i)
        return all
      }
      let start = current - Math.floor(windowSize / 2)
      if (start < 1) start = 1
      let end = start + windowSize - 1
      if (end > total) {
        end = total
        start = Math.max(1, end - windowSize + 1)
      }
      const range = []
      for (let i = start; i <= end; i++) range.push(i)
      return range
    }
  },
  mounted() {
    this.onResize = () => {
      this.viewportWidth = window.innerWidth
    }
    window.addEventListener('resize', this.onResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    goTo(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return
      this.$emit('change', page)
    }
  }
}
</script>

<style scoped>
.app-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  width: 100%;
}

.app-pagination__info {
  flex-shrink: 0;
}

.app-pagination__nav {
  min-width: 0;
}

.pagination-modern .page-link {
  color: var(--primary-dark-gray) !important;
}

.pagination-modern .page-item.active .page-link {
  color: #ffffff !important;
}

@media (max-width: 991.98px) {
  .app-pagination {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .app-pagination__info {
    text-align: center;
  }

  .app-pagination__nav {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    justify-content: center;
    padding-bottom: 0.125rem;
  }

  .pagination-modern {
    flex-wrap: nowrap;
  }

  .pagination-modern .page-link {
    padding: 0.375rem 0.5rem;
    font-size: 0.8125rem;
    min-width: 2rem;
    text-align: center;
  }
}

@media (max-width: 575.98px) {
  .app-pagination {
    margin-top: 1rem;
  }

  .pagination-modern .page-link {
    padding: 0.3rem 0.45rem;
    font-size: 0.75rem;
    min-width: 1.75rem;
  }
}
</style>
