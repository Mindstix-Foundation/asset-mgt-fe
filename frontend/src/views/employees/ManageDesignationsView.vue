<template>
  <div class="container-fluid px-3 py-4">
    <div class="manage-designations-page-header mb-4">
      <div class="manage-designations-page-intro">
        <h2 class="mb-0" style="color: var(--primary-black);">Manage Designations</h2>
        <p class="text-muted mb-0">Add or remove job designations for your organization</p>
      </div>
      <div class="manage-designations-page-actions">
        <button class="btn btn-gray" @click="goBack">
          <i class="fas fa-arrow-left me-1"></i>Back to Employees
        </button>
      </div>
    </div>

    <!-- Add designation form -->
    <div class="filter-card p-3 bg-light rounded mb-4">
      <form @submit.prevent="addDesignation">
        <div class="row g-3 align-items-end">
          <div class="col-12 col-md-4">
            <label for="designation-name" class="form-label">Designation Name <span class="text-danger">*</span></label>
            <input
              id="designation-name"
              type="text"
              class="form-control"
              v-model="form.name"
              placeholder="e.g. Software Engineer"
              maxlength="100"
              required
              :disabled="isSubmitting"
            >
          </div>
          <div class="col-12 col-md-5">
            <label for="designation-description" class="form-label">Description <span class="text-muted">(Optional)</span></label>
            <input
              id="designation-description"
              type="text"
              class="form-control"
              v-model="form.description"
              placeholder="Short description"
              maxlength="500"
              :disabled="isSubmitting"
            >
          </div>
          <div class="col-12 col-md-3">
            <button type="submit" class="btn btn-purple w-100" :disabled="isSubmitting || !form.name.trim()">
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-plus me-1"></i>
              {{ isSubmitting ? 'Adding...' : 'Add Designation' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Search -->
    <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
      <div class="input-group" style="max-width: 360px;">
        <span class="input-group-text"><i class="fas fa-search"></i></span>
        <input
          type="text"
          class="form-control"
          v-model="search"
          placeholder="Search designations..."
          @input="onSearch"
        >
      </div>
      <span class="text-muted small">{{ designations.length }} designation{{ designations.length === 1 ? '' : 's' }}</span>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="designations.length === 0" class="text-center py-5 text-muted">
      <i class="fas fa-id-badge fa-2x mb-3 d-block"></i>
      <p class="mb-0">No designations yet. Add one above to use it when creating employees.</p>
    </div>

    <!-- List -->
    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th class="text-center">Assigned Employees</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in designations" :key="item.id">
            <td class="fw-semibold">{{ item.name }}</td>
            <td class="text-muted">{{ item.description || '—' }}</td>
            <td class="text-center">
              <span class="badge" :class="(item._count?.employees || 0) > 0 ? 'bg-info' : 'bg-secondary'">
                {{ item._count?.employees || 0 }}
              </span>
            </td>
            <td class="text-end">
              <button
                class="btn btn-sm btn-outline-danger"
                :disabled="(item._count?.employees || 0) > 0 || deletingId === item.id"
                :title="(item._count?.employees || 0) > 0
                  ? 'Cannot delete — assigned to employees'
                  : 'Delete designation'"
                @click="confirmDelete(item)"
              >
                <i v-if="deletingId === item.id" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  designationService,
  type Designation,
} from '@/services/api/designationService'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const toastStore = useToastStore()

const designations = ref<Designation[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const deletingId = ref<number | null>(null)
const search = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const form = reactive({
  name: '',
  description: '',
})

const goBack = () => {
  router.push('/app/employees')
}

const loadDesignations = async () => {
  isLoading.value = true
  try {
    const response = await designationService.getDesignations({
      limit: 100,
      search: search.value.trim() || undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    })
    designations.value = response.data.designations || []
  } catch (error: any) {
    console.error('Failed to load designations', error)
    toastStore.showError('Error', error?.response?.data?.message || 'Failed to load designations')
  } finally {
    isLoading.value = false
  }
}

const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    loadDesignations()
  }, 300)
}

const addDesignation = async () => {
  const name = form.name.trim()
  if (!name) return

  isSubmitting.value = true
  try {
    await designationService.createDesignation({
      name,
      description: form.description.trim() || undefined,
    })
    form.name = ''
    form.description = ''
    toastStore.showSuccess('Success', 'Designation added successfully')
    await loadDesignations()
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      'Failed to add designation. Please try again.'
    toastStore.showError('Error', message)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (item: Designation) => {
  if ((item._count?.employees || 0) > 0) {
    toastStore.showError(
      'Cannot Delete',
      'This designation is assigned to one or more employees',
    )
    return
  }

  const confirmed = window.confirm(
    `Delete designation "${item.name}"? This cannot be undone.`,
  )
  if (!confirmed) return

  deletingId.value = item.id
  try {
    await designationService.deleteDesignation(item.id)
    toastStore.showSuccess('Success', `Designation "${item.name}" deleted`)
    await loadDesignations()
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      'Failed to delete designation. Please try again.'
    toastStore.showError('Error', message)
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  loadDesignations()
})
</script>

<style scoped>
.manage-designations-page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.manage-designations-page-intro {
  flex: 1 1 240px;
}

.manage-designations-page-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 767.98px) {
  .manage-designations-page-actions {
    width: 100%;
  }

  .manage-designations-page-actions .btn {
    width: 100%;
  }
}
</style>
