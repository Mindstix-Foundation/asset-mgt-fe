<template>
  <div class="container-fluid px-3 py-4">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h2 class="mb-0" style="color: var(--primary-black);">Software Licenses</h2>
        <p class="text-muted mb-0">
          Track license expiry and assign each license to a responsible employee
        </p>
      </div>
    </div>

    <!-- Add / edit form -->
    <div class="filter-card p-3 bg-light rounded mb-4">
      <form @submit.prevent="saveLicense">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label class="form-label">License Name <span class="text-danger">*</span></label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              maxlength="150"
              required
              :disabled="isSubmitting"
              placeholder="e.g. Microsoft 365"
            >
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label" for="license-assignee">Assigned To <span class="text-danger">*</span></label>
            <SearchableDropdown
              id="license-assignee"
              label=""
              placeholder="Select responsible employee..."
              :items="employeeItems"
              v-model="selectedAssignee"
              required
              :disabled="isSubmitting"
              @change="onAssigneeChange"
            />
            <div class="form-text">Team lead / owner responsible for this license</div>
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label">Expiry Date <span class="text-danger">*</span></label>
            <input
              v-model="form.expiryDate"
              type="date"
              class="form-control"
              required
              :disabled="isSubmitting"
            >
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label">Vendor</label>
            <input
              v-model="form.vendorName"
              type="text"
              class="form-control"
              maxlength="100"
              :disabled="isSubmitting"
              placeholder="Optional"
            >
          </div>
          <div class="col-12 col-md-2">
            <label class="form-label">Seats</label>
            <input
              v-model.number="form.seats"
              type="number"
              min="1"
              class="form-control"
              :disabled="isSubmitting"
            >
          </div>
          <div class="col-12 col-md-3">
            <label class="form-label">Start Date</label>
            <input
              v-model="form.startDate"
              type="date"
              class="form-control"
              :disabled="isSubmitting"
            >
          </div>
          <div class="col-12 col-md-3">
            <label class="form-label">Purchase Cost (₹)</label>
            <input
              v-model.number="form.purchaseCost"
              type="number"
              min="0"
              step="0.01"
              class="form-control"
              :disabled="isSubmitting"
            >
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label">License Key</label>
            <input
              v-model="form.licenseKey"
              type="text"
              class="form-control"
              maxlength="255"
              :disabled="isSubmitting"
            >
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label">Notes</label>
            <input
              v-model="form.notes"
              type="text"
              class="form-control"
              maxlength="1000"
              :disabled="isSubmitting"
            >
          </div>
          <div class="col-12 d-flex gap-2">
            <button
              type="submit"
              class="btn btn-purple"
              :disabled="isSubmitting || !canSubmit"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-plus me-1"></i>
              {{ editingId ? 'Update License' : 'Add License' }}
            </button>
            <button
              v-if="editingId"
              type="button"
              class="btn btn-gray"
              :disabled="isSubmitting"
              @click="resetForm"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <div class="input-group" style="max-width: 320px;">
          <span class="input-group-text"><i class="fas fa-search"></i></span>
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Search licenses or owner..."
            @input="onSearch"
          >
        </div>
        <select v-model="statusFilter" class="form-select" style="max-width: 180px;" @change="loadLicenses">
          <option value="">All statuses</option>
          <option value="expiring">Expiring soon</option>
          <option value="expired">Expired</option>
          <option value="active">Active</option>
        </select>
      </div>
      <span class="text-muted small">{{ licenses.length }} license{{ licenses.length === 1 ? '' : 's' }}</span>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="licenses.length === 0" class="text-center py-5 text-muted">
      <i class="fas fa-key fa-2x mb-3 d-block"></i>
      <p class="mb-0">No software licenses yet. Add one above and assign an owner.</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Assigned To</th>
            <th>Vendor</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Seats</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in licenses" :key="item.id">
            <td class="fw-semibold">{{ item.name }}</td>
            <td>
              <div v-if="item.assignedTo">
                <div class="fw-semibold">
                  {{ item.assignedTo.firstName }} {{ item.assignedTo.lastName }}
                </div>
                <div class="text-muted small">
                  {{ item.assignedTo.designation?.name || item.assignedTo.employeeId }}
                </div>
              </div>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="text-muted">{{ item.vendorName || '—' }}</td>
            <td>{{ formatDate(item.expiryDate) }}</td>
            <td>
              <span class="badge" :class="statusBadgeClass(item.expiryStatus)">
                {{ statusLabel(item) }}
              </span>
            </td>
            <td>{{ item.seats ?? '—' }}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-secondary me-1" title="Edit" @click="startEdit(item)">
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                :disabled="deletingId === item.id"
                title="Delete"
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
import { ref, reactive, computed, onMounted } from 'vue'
import {
  softwareLicenseService,
  type SoftwareLicense,
  type LicenseExpiryStatus,
} from '@/services/api/softwareLicenseService'
import { employeeApiService, type Employee } from '@/services/api/employeeApi'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const licenses = ref<SoftwareLicense[]>([])
const employees = ref<Employee[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const deletingId = ref<number | null>(null)
const editingId = ref<number | null>(null)
const search = ref('')
const statusFilter = ref<'' | LicenseExpiryStatus>('')
const selectedAssignee = ref<Item | null>(null)
let searchTimer: ReturnType<typeof setTimeout> | null = null

const form = reactive({
  name: '',
  assignedToId: undefined as number | undefined,
  vendorName: '',
  licenseKey: '',
  seats: undefined as number | undefined,
  purchaseCost: undefined as number | undefined,
  startDate: '',
  expiryDate: '',
  notes: '',
})

const employeeItems = computed<Item[]>(() =>
  employees.value.map((emp) => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}${emp.designation?.name ? ` · ${emp.designation.name}` : ''}`,
    value: String(emp.id),
  })),
)

const canSubmit = computed(
  () =>
    !!form.name.trim() &&
    !!form.expiryDate &&
    !!form.assignedToId,
)

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.assignedToId = undefined
  form.vendorName = ''
  form.licenseKey = ''
  form.seats = undefined
  form.purchaseCost = undefined
  form.startDate = ''
  form.expiryDate = ''
  form.notes = ''
  selectedAssignee.value = null
}

const onAssigneeChange = (item: Item | null) => {
  selectedAssignee.value = item
  form.assignedToId = item ? Number(item.id) : undefined
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB')
}

const statusLabel = (item: SoftwareLicense) => {
  if (item.expiryStatus === 'expired') return 'Expired'
  if (item.expiryStatus === 'expiring') {
    const days = item.daysUntilExpiry ?? 0
    return days === 0 ? 'Expires today' : `${days}d left`
  }
  return 'Active'
}

const statusBadgeClass = (status?: LicenseExpiryStatus) => {
  if (status === 'expired') return 'bg-danger'
  if (status === 'expiring') return 'bg-warning text-dark'
  return 'bg-success'
}

const loadEmployees = async () => {
  try {
    const response = await employeeApiService.getActiveEmployees()
    employees.value = response.data?.employees || []
  } catch (error: any) {
    toastStore.showError(
      'Error',
      error?.response?.data?.message || 'Failed to load employees',
    )
  }
}

const loadLicenses = async () => {
  isLoading.value = true
  try {
    const response = await softwareLicenseService.getLicenses({
      limit: 100,
      search: search.value.trim() || undefined,
      status: statusFilter.value || undefined,
      sortBy: 'expiryDate',
      sortOrder: 'asc',
    })
    licenses.value = response.licenses || []
  } catch (error: any) {
    toastStore.showError(
      'Error',
      error?.response?.data?.message || 'Failed to load licenses',
    )
  } finally {
    isLoading.value = false
  }
}

const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadLicenses(), 300)
}

const saveLicense = async () => {
  if (!canSubmit.value || !form.assignedToId) return
  isSubmitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      assignedToId: form.assignedToId,
      vendorName: form.vendorName.trim() || undefined,
      licenseKey: form.licenseKey.trim() || undefined,
      seats: form.seats || undefined,
      purchaseCost: form.purchaseCost || undefined,
      startDate: form.startDate || undefined,
      expiryDate: form.expiryDate,
      notes: form.notes.trim() || undefined,
    }
    if (editingId.value) {
      await softwareLicenseService.updateLicense(editingId.value, payload)
      toastStore.showSuccess('Success', 'License updated successfully')
    } else {
      await softwareLicenseService.createLicense(payload)
      toastStore.showSuccess('Success', 'License added successfully')
    }
    resetForm()
    await loadLicenses()
  } catch (error: any) {
    toastStore.showError(
      'Error',
      error?.response?.data?.message || 'Failed to save license',
    )
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (item: SoftwareLicense) => {
  editingId.value = item.id
  form.name = item.name
  form.assignedToId = item.assignedToId
  form.vendorName = item.vendorName || ''
  form.licenseKey = item.licenseKey || ''
  form.seats = item.seats ?? undefined
  form.purchaseCost = item.purchaseCost ?? undefined
  form.startDate = item.startDate ? String(item.startDate).slice(0, 10) : ''
  form.expiryDate = item.expiryDate ? String(item.expiryDate).slice(0, 10) : ''
  form.notes = item.notes || ''

  if (item.assignedTo) {
    selectedAssignee.value = {
      id: item.assignedTo.id,
      name: `${item.assignedTo.firstName} ${item.assignedTo.lastName}${
        item.assignedTo.designation?.name
          ? ` · ${item.assignedTo.designation.name}`
          : ''
      }`,
      value: String(item.assignedTo.id),
    }
  } else {
    selectedAssignee.value =
      employeeItems.value.find((e) => Number(e.id) === item.assignedToId) || null
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmDelete = async (item: SoftwareLicense) => {
  if (!window.confirm(`Delete license "${item.name}"?`)) return
  deletingId.value = item.id
  try {
    await softwareLicenseService.deleteLicense(item.id)
    toastStore.showSuccess('Success', 'License deleted')
    if (editingId.value === item.id) resetForm()
    await loadLicenses()
  } catch (error: any) {
    toastStore.showError(
      'Error',
      error?.response?.data?.message || 'Failed to delete license',
    )
  } finally {
    deletingId.value = null
  }
}

onMounted(async () => {
  await Promise.all([loadEmployees(), loadLicenses()])
})
</script>
