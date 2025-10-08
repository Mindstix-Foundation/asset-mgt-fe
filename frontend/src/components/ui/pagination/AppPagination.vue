<template>
  <div class="d-flex justify-content-between align-items-center mt-4 w-100" v-if="totalPages > 1 || total > 0">
    <div class="text-muted">
      <small>Showing {{ start }}-{{ end }} of {{ total }} {{ itemName }}</small>
    </div>
    <nav aria-label="Pagination">
      <ul class="pagination pagination-modern mb-0">
      <!-- First -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="goTo(1)" aria-label="First">
          <i class="fas fa-angle-double-left"></i>
        </a>
      </li>
      <!-- Previous -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="goTo(currentPage - 1)" aria-label="Previous">
          <i class="fas fa-chevron-left"></i>
        </a>
      </li>
      <!-- Page Numbers -->
      <li
        v-for="page in pages"
        :key="`p-${page}-${currentPage}-${totalPages}`"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <a class="page-link" href="#" @click.prevent="goTo(Number(page))">{{ page }}</a>
      </li>
      <!-- Next -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="goTo(currentPage + 1)" aria-label="Next">
          <i class="fas fa-chevron-right"></i>
        </a>
      </li>
      <!-- Last -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
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
  computed: {
    pages() {
      const total = this.totalPages
      const current = this.currentPage
      const windowSize = Math.max(1, this.pageWindow)
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
  methods: {
    goTo(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return
      this.$emit('change', page)
    }
  }
}
</script>

<style scoped>
/* Inherit host styles; no extra styling here to keep consistency */
/* Default: numbers and arrows in black shade */
.pagination-modern .page-link {
  color: var(--primary-dark-gray) !important;
}

/* Active page: blue background, white text */
.pagination-modern .page-item.active .page-link {
  color: #ffffff !important;
}
</style> 