<template>
  <div class="container-fluid px-3 py-4">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0" style="color: var(--primary-black);">Manage Employees</h2>
        <p class="text-muted mb-0">Manage deletable employees (employees without assigned assets)</p>
        <PaginationInfo 
          :start="paginationInfo.start" 
          :end="paginationInfo.end" 
          :total="paginationInfo.total" 
          item-name="employees"
        />
      </div>
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-secondary btn-modern" @click="goBack">
          <i class="fas fa-arrow-left me-1"></i>Back to Employees
        </button>
      </div>
    </div>

    <!-- Main Form -->
    <div class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="mb-1">Manage Employee Deletions</h5>
          <p class="text-muted mb-0">Select employees to delete in bulk or individually</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-danger btn-modern" @click="startBulkDelete">
            <i class="fas fa-trash me-1"></i>Bulk Delete
          </button>
        </div>
      </div>
      <form @submit.prevent="confirmBulkDelete">
        <!-- Form Card - Using same design as filter dropdown -->
        <div v-if="showFormCard" class="form-card mt-3 p-3 bg-light rounded">
          <div class="row">
            <div class="col-12">
              <div class="row g-3 justify-content-between">
                <div class="col-4">
                  <label class="form-label" for="single-emp-input">Add Single Employee</label>
                  <div class="row justify-content-around">
                    <div class="col-7">
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="singleEmployeeInput"
                        id="single-emp-input"
                        placeholder="EMP-0001"
                        @keyup.enter="addSingleEmployee"
                        pattern="EMP-\d{4}"
                        title="Format: EMP-NNNN (e.g., EMP-0001)"
                      >
                    </div>
                    <div class="col-4">
                      <button 
                        class="btn btn-brown w-100 employee-add-btn" 
                        type="button" 
                        @click="addSingleEmployee"
                        :disabled="!singleEmployeeInput"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <small class="form-text text-muted">
                    Enter a single employee ID (e.g., EMP-0001) to add to deletion list
                  </small>
                </div>
                <div class="col-7">
                  <span class="form-label">Add Employee Range</span>
                  <div class="row justify-content-around">
                    <div class="col-9">
                      <div class="d-flex align-items-center gap-2">
                        <label class="text-muted mb-0" for="employee-from-input">From</label>
                        <input 
                          type="text" 
                          class="form-control" 
                          v-model="employeeFromInput"
                          id="employee-from-input"
                          placeholder="EMP-0001"
                          @keyup.enter="addEmployeeRange"
                          pattern="EMP-\d{4}"
                          title="Format: EMP-NNNN (e.g., EMP-0001)"
                        >
                        <label class="text-muted mb-0" for="employee-to-input">to</label>
                        <input 
                          type="text" 
                          class="form-control" 
                          v-model="employeeToInput"
                          id="employee-to-input"
                          placeholder="EMP-9999"
                          @keyup.enter="addEmployeeRange"
                          pattern="EMP-\d{4}"
                          title="Format: EMP-NNNN (e.g., EMP-9999)"
                        >
                      </div>
                    </div>
                    <div class="col-2">
                      <button 
                        class="btn btn-brown w-100 employee-add-btn" 
                        type="button" 
                        @click="addEmployeeRange"
                        :disabled="!employeeFromInput || !employeeToInput"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <small class="form-text text-muted">
                    Enter employee ID range (e.g., EMP-0001 to EMP-9999) to add multiple employees for deletion
                  </small>
                </div>
                <div class="col-12">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="form-label mb-1">Selected Employees for Deletion ({{ selectedEmployeesForDeletion.length }})</span>
                    </div>
                  </div>
                  <div v-if="selectedEmployeesForDeletion.length > 0" class="mt-3">
                    <div class="d-flex flex-wrap gap-2">
                      <span 
                        v-for="employeeId in selectedEmployeesForDeletion" 
                        :key="employeeId"
                        class="badge bg-warning d-flex align-items-center gap-1"
                      >
                        <i class="fas fa-user"></i>
                        {{ getEmployeeDisplayId(employeeId) }}
                        <button 
                          type="button" 
                          class="btn-close btn-close-white" 
                          style="font-size: 0.7em;"
                          @click="toggleEmployeeSelection(employeeId)"
                          title="Remove from selection"
                        ></button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Form Action Buttons - Bottom Right -->
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-outline-secondary btn-modern" @click="clearEmployeeSelection">
              <i class="fas fa-times me-1"></i>Clear
            </button>
            <button type="button" class="btn btn-danger btn-modern" @click="confirmBulkDelete" :disabled="selectedEmployeesForDeletion.length === 0 || isBulkDeleting">
              <i v-if="isBulkDeleting" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-trash me-1"></i>
              {{ isBulkDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Search and Sort Bar -->
    <div class="mb-4">
      <div class="row align-items-end">
        <!-- Search Employees -->
        <div class="col-12 col-lg-7 mb-3">
          <label class="form-label" for="employees-search">Search Employees</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input 
              type="text" 
              class="form-control" 
              v-model="searchTerm"
              id="employees-search"
              placeholder="Search by ID, name, or email..."
              @input="debouncedLoadEmployees"
            >
          </div>
        </div>
        
        <!-- Sort By -->
        <div class="col-12 col-lg-3 mb-3">
          <SearchableDropdown
            id="sort-by-filter"
            label="Sort By"
            placeholder="Select sort option..."
            :items="sortOptions"
            v-model="selectedSortBy"
            @change="onSortByChange"
          />
        </div>
        
        <!-- Toggle Sort Order -->
        <div class="col-12 col-lg-2 mb-3">
          <button class="btn btn-outline-secondary w-100" @click="toggleSortOrder" :title="'Toggle Sort Order'" style="height: 38px;">
            <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Employees Table -->
    <div class="mt-5" v-if="items.length > 0">
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 table-employee" :class="{ 'show-checkboxes': showFormCard }">
              <thead class="table-light">
                <tr>
                  <th v-if="showFormCard"></th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in items" :key="employee.id">
                  <!-- Checkbox column -->
                  <td v-if="showFormCard">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      :checked="selectedEmployeesForDeletion.includes(employee.id)"
                      @change="toggleEmployeeSelection(employee.id)"
                    >
                  </td>
                  
                  <!-- Employee ID column -->
                  <td>
                    <strong>{{ employee.employeeId }}</strong>
                  </td>
                  
                  <!-- Name column -->
                  <td>
                    <strong style="color: var(--primary-black);">
                      {{ employee.firstName }} {{ employee.lastName }}
                    </strong>
                  </td>
                  
                  <!-- Email column -->
                  <td>
                    <span class="text-muted">{{ employee.email }}</span>
                  </td>
                  
                  <!-- Phone column -->
                  <td>
                    <span class="text-muted">{{ employee.phone || 'N/A' }}</span>
                  </td>
                  
                  <!-- Status column -->
                  <td>
                    <span :class="employee.status === 'ACTIVE' ? 'badge badge-active' : 'badge badge-inactive'">
                      {{ employee.status === 'ACTIVE' ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  
                  <!-- Actions column -->
                  <td>
                    <div class="btn-group btn-group-sm employee-actions">
                      <button 
                        class="btn btn-outline-danger btn-delete-employee" 
                        @click="deleteSingleEmployee(employee)"
                        title="Delete Employee"
                        :disabled="employee.isAdmin"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Pagination -->
        <div class="card-footer d-flex justify-content-between align-items-center py-3" v-if="pagination.totalPages > 1">
          <PaginationInfo 
            :start="paginationInfo.start" 
            :end="paginationInfo.end" 
            :total="paginationInfo.total" 
            item-name="employees"
          />
          <AppPagination 
            :current-page="pagination.currentPage" 
            :total-pages="pagination.totalPages"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <i class="fas fa-users fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">No Deletable Employees Found</h5>
      <p class="text-muted">All employees have assigned assets or are admins and cannot be deleted.</p>
    </div>

    <!-- Single Employee Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showDeleteConfirmationModal }" 
      :style="{ display: showDeleteConfirmationModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="employeeToDelete"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black);">
              <i class="fas fa-exclamation-triangle me-2" style="color: var(--secondary-orange);"></i>
              <span>Confirm Deletion</span>
            </h5>
            <button type="button" class="btn-close" @click="closeDeleteConfirmationModal"></button>
          </div>
          <div class="modal-body" v-if="employeeToDelete">
            <div class="text-center py-2">
              <div class="confirmation-icon mb-2">
                <i 
                  class="fas fa-trash fa-2x"
                  style="color: var(--secondary-red);"
                ></i>
              </div>
              <h6 class="mb-2" style="color: var(--primary-black); font-size: 1rem;">
                Are you sure you want to delete this employee?
              </h6>
              <p class="text-muted mb-0" style="font-size: 0.9rem;">
                <strong>{{ employeeToDelete.firstName }} {{ employeeToDelete.lastName }} ({{ employeeToDelete.employeeId }})</strong> will be permanently deleted 
                and this action cannot be undone.
              </p>
            </div>
            
            <!-- Employee Summary - Compact Version -->
            <div class="mt-2">
              <div class="employee-info-section-compact">
                <h6 class="section-title-compact">
                  <i class="fas fa-user me-2"></i>Employee Details
                </h6>
                <div class="info-grid-compact">
                  <div class="info-item-compact">
                    <span class="info-label-compact">Employee ID</span>
                    <div class="info-value-compact fw-bold">{{ employeeToDelete?.employeeId || 'Unknown' }}</div>
                  </div>
                  <div class="info-item-compact">
                    <span class="info-label-compact">Name</span>
                    <div class="info-value-compact">{{ employeeToDelete?.firstName }} {{ employeeToDelete?.lastName }}</div>
                  </div>
                  <div class="info-item-compact">
                    <span class="info-label-compact">Email</span>
                    <div class="info-value-compact">{{ employeeToDelete?.email }}</div>
                  </div>
                  <div class="info-item-compact">
                    <span class="info-label-compact">Phone</span>
                    <div class="info-value-compact">{{ employeeToDelete?.phone || 'N/A' }}</div>
                  </div>
                  <div class="info-item-compact">
                    <span class="info-label-compact">Status</span>
                    <div class="info-value-compact">{{ employeeToDelete?.status }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-cancel-confirm" @click="closeDeleteConfirmationModal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-confirm-delete"
              @click="confirmDelete"
              :disabled="isDeleting"
            >
              <i class="fas fa-trash me-1"></i>
              {{ isDeleting ? 'Deleting...' : 'Confirm Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showBulkDeleteConfirmationModal }" 
      :style="{ display: showBulkDeleteConfirmationModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black);">
              <i class="fas fa-exclamation-triangle me-2" style="color: var(--secondary-orange);"></i>
              <span>Confirm Bulk Deletion</span>
            </h5>
            <button type="button" class="btn-close" @click="closeBulkDeleteConfirmationModal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center py-2">
              <div class="confirmation-icon mb-2">
                <i 
                  class="fas fa-trash fa-2x"
                  style="color: var(--secondary-red);"
                ></i>
              </div>
              <h6 class="mb-2" style="color: var(--primary-black); font-size: 1rem;">
                Are you sure you want to delete {{ selectedEmployeesForDeletion.length }} selected employees?
              </h6>
              <p class="text-muted mb-0" style="font-size: 0.9rem;">
                All selected employees will be permanently deleted and this action cannot be undone.
              </p>
              <div class="mt-2 p-2" style="background-color: var(--primary-light-gray); border-radius: 0.5rem; border-left: 4px solid var(--secondary-orange);">
                <small class="text-muted" style="font-size: 0.8rem;">
                  <i class="fas fa-info-circle me-1"></i>
                  Only employees without assigned assets can be deleted. Admin employees will be automatically excluded.
                </small>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-cancel-confirm" @click="closeBulkDeleteConfirmationModal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-confirm-delete"
              @click="executeBulkDelete"
              :disabled="isBulkDeleting"
            >
              <i class="fas fa-trash me-1"></i>
              {{ isBulkDeleting ? 'Deleting...' : 'Confirm Delete All' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div 
      v-if="showDeleteConfirmationModal || showBulkDeleteConfirmationModal" 
      class="modal-backdrop fade show"
      @click="closeModals"
    ></div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { employeeService } from '@/services/business/employeeService'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'
import AppPagination from '@/components/ui/pagination/AppPagination.vue'
import PaginationInfo from '@/components/ui/pagination/PaginationInfo.vue'

const router = useRouter()
const toastStore = useToastStore()

// State
const showFormCard = ref(false)

// Employees-specific state
const selectedEmployeesForDeletion = ref<(string | number)[]>([])
const isBulkDeleting = ref(false)
const singleEmployeeInput = ref('')
const employeeFromInput = ref('')
const employeeToInput = ref('')

// Search and filter state
const searchTerm = ref('')
const selectedSortBy = ref<Item | null>(null)
const sortAscending = ref(true)

// Filter options
const sortOptions = ref<Item[]>([
  { value: 'employeeId', label: 'Employee ID' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'status', label: 'Status' },
  { value: 'createdAt', label: 'Created Date' }
])

// Data
const items = ref<any[]>([])
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  hasNext: false,
  hasPrevious: false
})

// Computed properties
const paginationInfo = computed(() => {
  const total = pagination.value.totalCount
  const itemsPerPage = 20
  const start = total === 0 ? 0 : (pagination.value.currentPage - 1) * itemsPerPage + 1
  const end = Math.min(pagination.value.currentPage * itemsPerPage, total)
  
  return { start, end, total }
})

// Delete confirmation modal state
const showDeleteConfirmationModal = ref(false)
const showBulkDeleteConfirmationModal = ref(false)
const employeeToDelete = ref<any>(null)
const isDeleting = ref(false)

// Methods
const startBulkDelete = () => {
  showFormCard.value = !showFormCard.value
  if (showFormCard.value) {
    // Clear employee selection when starting bulk delete
    selectedEmployeesForDeletion.value = []
  }
}

const loadEmployees = async () => {
  try {
    const params: any = {
      page: pagination.value.currentPage,
      limit: 20, // 20 per page
      sortBy: selectedSortBy.value?.value || 'employeeId',
      sortOrder: sortAscending.value ? 'asc' : 'desc'
    }

    // Add search parameter
    if (searchTerm.value) {
      params.search = searchTerm.value
    }

    // Get deletable employees (non-admin with no asset history)
    const employeeResponse = await employeeService.getDeletableEmployees(params)
    items.value = employeeResponse.data.employees || []
    
    // Update pagination info
    if (employeeResponse.data.pagination) {
      pagination.value = {
        currentPage: employeeResponse.data.pagination.currentPage,
        totalPages: employeeResponse.data.pagination.totalPages,
        totalCount: employeeResponse.data.pagination.totalCount,
        hasNext: employeeResponse.data.pagination.hasNext,
        hasPrevious: employeeResponse.data.pagination.hasPrevious
      }
    }
  } catch (error) {
    console.error('Error loading deletable employees:', error)
    toastStore.showError('Error', 'Failed to load deletable employees')
    items.value = []
  }
}

// Handle pagination change
const handlePageChange = (page: number) => {
  pagination.value.currentPage = page
  loadEmployees()
}

const deleteSingleEmployee = async (employee: any) => {
  // Set the employee to delete and show confirmation modal
  employeeToDelete.value = employee
  showDeleteConfirmationModal.value = true
}

const executeSingleEmployeeDelete = async () => {
  if (!employeeToDelete.value) return
  
  try {
    isDeleting.value = true

    // Call the delete API
    await employeeService.deleteEmployee(employeeToDelete.value.id)
    
    toastStore.showSuccess('Success', `Employee ${employeeToDelete.value.employeeId} deleted successfully!`)
    
    // Close modal and reload employees
    showDeleteConfirmationModal.value = false
    employeeToDelete.value = null
    await loadEmployees()
    
  } catch (error: any) {
    console.error('Error deleting employee:', error)
    
    // Handle specific error messages from the API
    if (error.response?.data?.message) {
      toastStore.showError('Cannot Delete Employee', error.response.data.message)
    } else {
      toastStore.showError('Error', 'Failed to delete employee')
    }
  } finally {
    isDeleting.value = false
  }
}

const closeDeleteConfirmationModal = () => {
  showDeleteConfirmationModal.value = false
  employeeToDelete.value = null
  isDeleting.value = false
}

const closeBulkDeleteConfirmationModal = () => {
  showBulkDeleteConfirmationModal.value = false
}

const confirmDelete = async () => {
  await executeSingleEmployeeDelete()
}

const closeModals = () => {
  closeDeleteConfirmationModal()
  closeBulkDeleteConfirmationModal()
}

// Employee selection methods
const toggleEmployeeSelection = (employeeId: string | number) => {
  const index = selectedEmployeesForDeletion.value.indexOf(employeeId)
  if (index > -1) {
    selectedEmployeesForDeletion.value.splice(index, 1)
  } else {
    selectedEmployeesForDeletion.value.push(employeeId)
  }
}

const clearEmployeeSelection = () => {
  selectedEmployeesForDeletion.value = []
}

const addSingleEmployee = () => {
  const employeeId = singleEmployeeInput.value.trim()
  
  if (!employeeId) {
    showErrorToast('Please enter an employee ID')
    return
  }
  
  // Validate EMP-NNNN format
  const empPattern = /^EMP-\d{4}$/
  if (!empPattern.test(employeeId)) {
    showErrorToast('Employee ID must be in format EMP-NNNN (e.g., EMP-0001)')
    return
  }
  
  // Check if the employee is in the current table (deletable employees)
  const deletableEmployeeIds = items.value.map(emp => emp.employeeId)
  if (!deletableEmployeeIds.includes(employeeId)) {
    showErrorToast(`Employee ${employeeId} is not deletable (not in current list or doesn't meet deletion criteria)`)
    return
  }
  
  const employee = items.value.find(emp => emp.employeeId === employeeId)
  if (employee && !selectedEmployeesForDeletion.value.includes(employee.id)) {
    selectedEmployeesForDeletion.value.push(employee.id)
    showToast(`Added employee ${employeeId} to selection`, 'success')
  } else {
    showToast(`Employee ${employeeId} is already selected`, 'info')
  }
  
  // Clear the input
  singleEmployeeInput.value = ''
}

// Helper function to validate employee ID format
const validateEmployeeIdFormat = (value: string): boolean => {
  const empPattern = /^EMP-\d{4}$/
  return empPattern.test(value)
}

// Helper function to validate range inputs
const validateRangeInputs = (fromValue: string, toValue: string): boolean => {
  if (!fromValue || !toValue) {
    showErrorToast('Please enter both "from" and "to" values')
    return false
  }
  
  if (!validateEmployeeIdFormat(fromValue) || !validateEmployeeIdFormat(toValue)) {
    showErrorToast('Employee IDs must be in format EMP-NNNN (e.g., EMP-0001)')
    return false
  }
  
  return true
}

// Helper function to process employee range selection
const processEmployeeRange = (fromValue: string, toValue: string) => {
  let addedCount = 0
  let alreadySelectedCount = 0
  
  for (const emp of items.value) {
    if (emp.employeeId >= fromValue && emp.employeeId <= toValue) {
      if (selectedEmployeesForDeletion.value.includes(emp.id)) {
        alreadySelectedCount++
      } else {
        selectedEmployeesForDeletion.value.push(emp.id)
        addedCount++
      }
    }
  }
  
  return { addedCount, alreadySelectedCount }
}

// Helper function to generate success message
const generateRangeMessage = (addedCount: number, alreadySelectedCount: number, fromValue: string, toValue: string): string => {
  if (addedCount > 0) {
    let message = `Added ${addedCount} deletable employee(s) from range ${fromValue} to ${toValue}`
    if (alreadySelectedCount > 0) {
      message += `\n(${alreadySelectedCount} employees were already selected)`
    }
    return message
  }
  return `No new employees added from range ${fromValue} to ${toValue}`
}

const addEmployeeRange = async () => {
  const fromValue = employeeFromInput.value.trim()
  const toValue = employeeToInput.value.trim()
  
  if (!validateRangeInputs(fromValue, toValue)) {
    return
  }
  
  const { addedCount, alreadySelectedCount } = processEmployeeRange(fromValue, toValue)
  const message = generateRangeMessage(addedCount, alreadySelectedCount, fromValue, toValue)
  const messageType = addedCount > 0 ? 'success' : 'info'
  
  showToast(message, messageType)
  
  // Clear the inputs
  employeeFromInput.value = ''
  employeeToInput.value = ''
}

const confirmBulkDelete = async () => {
  if (selectedEmployeesForDeletion.value.length === 0) {
    showErrorToast('Please select employees to delete')
    return
  }
  
  // Show confirmation modal
  showBulkDeleteConfirmationModal.value = true
}

const executeBulkDelete = async () => {
  try {
    isBulkDeleting.value = true

    // Get employee IDs (database IDs)
    const employeeIdsToDelete = selectedEmployeesForDeletion.value
      .map(selectedId => {
        const employee = items.value.find(item => item.id === selectedId)
        return employee?.id
      })
      .filter(id => id !== undefined) as number[]

    if (employeeIdsToDelete.length === 0) {
      toastStore.showError('Error', 'No valid employees selected for deletion')
      isBulkDeleting.value = false
      return
    }

    // Delete employees one by one
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const empId of employeeIdsToDelete) {
      try {
        await employeeService.deleteEmployee(empId)
        successCount++
      } catch (error: any) {
        errorCount++
        const employee = items.value.find(emp => emp.id === empId)
        errors.push(`${employee?.employeeId || empId}: ${error.response?.data?.message || error.message}`)
      }
    }
    
    // Show success message
    if (successCount > 0) {
      toastStore.showSuccess('Bulk Delete Complete', `Successfully deleted ${successCount} employee(s)`)
    }
    
    // Show error details
    if (errorCount > 0) {
      const errorMessage = errors.length > 3 
        ? `${errors.slice(0, 3).join('\n')}\n... and ${errors.length - 3} more errors`
        : errors.join('\n')
      toastStore.showError('Some Employees Could Not Be Deleted', errorMessage)
    }

    // Clear selection and reload
    selectedEmployeesForDeletion.value = []
    showFormCard.value = false
    showBulkDeleteConfirmationModal.value = false
    await loadEmployees()
    
  } catch (error: any) {
    console.error('Error in bulk delete:', error)
    toastStore.showError('Error', 'Failed to perform bulk delete')
  } finally {
    isBulkDeleting.value = false
  }
}

// Search and filter methods
const debouncedLoadEmployees = () => {
  // Debounce search input
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    // Reset to page 1 when searching
    pagination.value.currentPage = 1
    loadEmployees()
  }, 300)
}

let debounceTimer: number

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value
  // Reset to page 1 when changing sort order
  pagination.value.currentPage = 1
  loadEmployees()
}

const onSortByChange = () => {
  // Reset to page 1 when changing sort
  pagination.value.currentPage = 1
  loadEmployees()
}

// Helper functions for toast messages
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (type === 'success') {
    toastStore.showSuccess('Success', message)
  } else if (type === 'error') {
    toastStore.showError('Error', message)
  } else {
    toastStore.showInfo('Info', message)
  }
}

const showErrorToast = (message: string) => {
  toastStore.showError('Error', message)
}

// Helper function to get employee display ID
const getEmployeeDisplayId = (id: string | number): string => {
  // Find the employee in the items array and return its employeeId
  const employee = items.value.find(item => item.id === id)
  return employee?.employeeId || String(id)
}

const goBack = () => {
  router.push('/app/employees')
}

// Lifecycle
onMounted(async () => {
  await loadEmployees()
})
</script>

<style scoped>
/* Import all styles from ManageAssetCategoriesView.vue for consistency */

/* Button styling */
.btn {
  border-radius: 0.375rem !important;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-modern {
  border-radius: 0.375rem !important;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-danger {
  background-color: var(--secondary-red);
  border-color: var(--secondary-red);
  color: white;
}

.btn-danger:hover {
  background-color: #d63447;
  border-color: #d63447;
  color: white;
}

/* Form styling */
.form-control, .form-select {
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem !important;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  background-color: var(--primary-white);
}

.form-control:focus, .form-select:focus {
  border-color: var(--secondary-purple);
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
  background-color: var(--primary-white);
}

.form-label {
  font-weight: 600 !important;
  color: #666666 !important;
  margin-bottom: 0.5rem !important;
  font-size: 1rem !important;
}

.form-text {
  font-size: 0.875rem;
  color: var(--primary-mid-gray);
  margin-top: 0.25rem;
}

/* Badge styling */
.badge-active {
  background-color: var(--secondary-green) !important;
  color: white !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge-inactive {
  background-color: var(--secondary-red) !important;
  color: white !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

/* Form Card */
.form-card {
  border: 1px solid #dee2e6;
  background-color: #f8f9fa !important;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Table styling */
.table-employee {
  table-layout: fixed;
}

/* When checkbox column is visible */
.table-employee.show-checkboxes th:nth-child(1), 
.table-employee.show-checkboxes td:nth-child(1) { width: 5% !important; }
.table-employee.show-checkboxes th:nth-child(2), 
.table-employee.show-checkboxes td:nth-child(2) { width: 12% !important; }
.table-employee.show-checkboxes th:nth-child(3), 
.table-employee.show-checkboxes td:nth-child(3) { width: 20% !important; }
.table-employee.show-checkboxes th:nth-child(4), 
.table-employee.show-checkboxes td:nth-child(4) { width: 25% !important; }
.table-employee.show-checkboxes th:nth-child(5), 
.table-employee.show-checkboxes td:nth-child(5) { width: 15% !important; }
.table-employee.show-checkboxes th:nth-child(6), 
.table-employee.show-checkboxes td:nth-child(6) { width: 13% !important; }
.table-employee.show-checkboxes th:nth-child(7), 
.table-employee.show-checkboxes td:nth-child(7) { width: 10% !important; }

/* When checkbox column is hidden */
.table-employee:not(.show-checkboxes) th:nth-child(1), 
.table-employee:not(.show-checkboxes) td:nth-child(1) { width: 15% !important; }
.table-employee:not(.show-checkboxes) th:nth-child(2), 
.table-employee:not(.show-checkboxes) td:nth-child(2) { width: 22% !important; }
.table-employee:not(.show-checkboxes) th:nth-child(3), 
.table-employee:not(.show-checkboxes) td:nth-child(3) { width: 26% !important; }
.table-employee:not(.show-checkboxes) th:nth-child(4), 
.table-employee:not(.show-checkboxes) td:nth-child(4) { width: 17% !important; }
.table-employee:not(.show-checkboxes) th:nth-child(5), 
.table-employee:not(.show-checkboxes) td:nth-child(5) { width: 12% !important; }
.table-employee:not(.show-checkboxes) th:nth-child(6), 
.table-employee:not(.show-checkboxes) td:nth-child(6) { width: 8% !important; }

/* Checkbox styling */
.form-check-input {
  border-radius: 0.25rem !important;
  border: 1px solid var(--element-gray) !important;
}

.form-check-input:checked {
  background-color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
}

/* Employee selection chips styling */
.badge.bg-warning {
  background-color: #8B4513 !important;
  color: white !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.875rem !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
}

/* Employee Add Buttons */
.employee-add-btn {
  width: 103px !important;
  height: 38px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  border-radius: 0.5rem !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

.employee-add-btn:hover:not(:disabled) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.employee-add-btn:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

/* Modal styling */
.modal-content {
  border: 1px solid var(--element-gray);
  border-radius: 0.5rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

/* Confirmation Modal Buttons */
.btn-cancel-confirm {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  padding: 0.4rem 1rem !important;
  font-size: 0.9rem !important;
}

.btn-cancel-confirm:hover {
  background-color: var(--element-gray) !important;
  border-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
  transform: translateY(-1px) !important;
}

.btn-confirm-delete {
  background-color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
  color: white !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  padding: 0.4rem 1rem !important;
  font-size: 0.9rem !important;
  box-shadow: 0 2px 8px rgba(233, 118, 118, 0.25) !important;
}

.btn-confirm-delete:hover {
  background-color: #d63447 !important;
  border-color: #d63447 !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(233, 118, 118, 0.35) !important;
}

.confirmation-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Employee info section */
.employee-info-section-compact {
  margin-bottom: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
}

.employee-info-section-compact .section-title-compact {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.25rem !important;
  padding-bottom: 0.15rem;
  border-bottom: 1px solid #dee2e6;
}

.employee-info-section-compact .info-grid-compact {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.employee-info-section-compact .info-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.15rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.employee-info-section-compact .info-item-compact:last-child {
  border-bottom: none;
}

.employee-info-section-compact .info-label-compact {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0 !important;
  min-width: 120px;
}

.employee-info-section-compact .info-value-compact {
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  color: #212529 !important;
  margin-bottom: 0 !important;
  text-align: right;
}

/* Delete Button Hover Effect */
.btn-delete-employee:hover {
  color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.btn-brown {
  background-color: #8B4513 !important;
  border-color: #8B4513 !important;
  color: white !important;
}

.btn-brown:hover {
  background-color: #6B3410 !important;
  border-color: #6B3410 !important;
}
</style>

