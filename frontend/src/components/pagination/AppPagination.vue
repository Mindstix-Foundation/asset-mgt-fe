<template>
  <nav aria-label="Pagination" v-if="totalPages > 1">
    <ul class="pagination pagination-modern mb-0">
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
        :class="{ active: page === currentPage, disabled: page === '...' }"
      >
        <a class="page-link" href="#" @click.prevent="page !== '...' && goTo(Number(page))">{{ page }}</a>
      </li>
      <!-- Next -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="goTo(currentPage + 1)" aria-label="Next">
          <i class="fas fa-chevron-right"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AppPagination',
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
  },
  emits: ['change'],
  computed: {
    pages() {
      const total = this.totalPages
      const current = this.currentPage
      const items = []

      if (total <= 7) {
        for (let i = 1; i <= total; i++) items.push(i)
        return items
      }

      items.push(1)

      if (current <= 4) {
        for (let i = 2; i <= 5; i++) items.push(i)
        items.push('...', total)
      } else if (current >= total - 3) {
        items.push('...')
        for (let i = total - 4; i <= total; i++) items.push(i)
      } else {
        items.push('...')
        for (let i = current - 1; i <= current + 1; i++) items.push(i)
        items.push('...', total)
      }

      return items
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
</style> 