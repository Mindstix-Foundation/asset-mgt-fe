<template>
  <div style="min-height: 100vh;">
    <!-- Main Content -->
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row align-items-center mb-4">
        <!-- Title Section -->
        <div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-3 mb-lg-0">
          <h2 class="mb-0" style="color: var(--primary-black);">Employee Asset History</h2>
          
        </div>
        
        <!-- Actions Section -->
        <div class="col-12 col-md-6 col-lg-8">
          <div class="d-flex gap-2 justify-content-md-end">
            <button class="btn btn-outline-secondary btn-modern" @click="goBackToEmployee">
              <i class="fas fa-arrow-left me-1"></i>Back to Employee
            </button>
          </div>
        </div>
      </div>

      <!-- Employee Info Card -->
      <div class="card mb-3" v-if="employee">
        <div class="card-body py-3">
          <div class="row align-items-center">
            <div class="col-12 col-md-8">
              <div class="d-flex align-items-center">
                <div 
                  class="rounded-circle d-flex align-items-center justify-content-center me-3" 
                  :style="{ width: '40px', height: '40px', backgroundColor: getEmployeeIconColor(employee.id), flexShrink: 0 }"
                >
                  <i class="fas fa-user" style="font-size: 1rem; color: white !important;"></i>
                </div>
                <div>
                  <h5 class="mb-0 fw-bold" style="color: var(--primary-black);">{{ employee.name }}</h5>
                  <p class="text-muted mb-0 small">{{ employee.id }} • {{ employee.email }}</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4 text-md-end mt-3 mt-md-0">
              <div class="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                <span class="badge badge-orange">{{ returnedEventsCount }} Completed</span>
                <span v-if="(employee?.assignedAssetsCount || 0) > 0" class="badge badge-green">{{ employee.assignedAssetsCount }} Currently Assigned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Asset Events Content -->
      <div class="card">
        <div class="card-body py-3">
          <!-- Filters -->
          <div class="row align-items-end mb-3">
            <!-- Search -->
            <div class="col-12 col-lg-7 mb-3">
              <label class="form-label" for="asset-history-search">Search</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="filters.search"
                  id="asset-history-search"
                  placeholder="Asset/brand/model"
                  @keyup.enter="applyFilters"
                >
              </div>
            </div>
            <!-- Sort By -->
            <div class="col-12 col-lg-3 mb-3">
              <SearchableDropdown
                id="sort-by-filter"
                label="Sort By"
                placeholder="Select sort field"
                :items="sortByOptions"
                v-model="selectedSortBy"
                @change="onSortByChange"
              />
            </div>
            <!-- Toggle Sort Order + Filters Button -->
            <div class="col-12 col-lg-2 mb-3">
              <div class="row g-3">
                <div class="col-4">
                  <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" @click="toggleSortOrder" :title="'Toggle Sort Order'" style="min-width: 40px; height: 38px;">
                    <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']" style="font-size: 0.9rem;"></i>
                  </button>
                </div>
                <div class="col-8">
                  <button 
                    class="btn btn-filter w-100" 
                    @click="showFilterDropdown = !showFilterDropdown"
                    :class="{ active: showFilterDropdown }"
                  >
                    <i class="fas fa-filter me-1"></i>Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Dropdown -->
          <div v-if="showFilterDropdown" class="filter-dropdown mt-3 mb-3 p-3 bg-light rounded">
            <div class="d-flex flex-column flex-md-row gap-2">
              <div class="flex-fill">
                <SearchableDropdown
                  id="event-action"
                  label="Action"
                  placeholder="Select action"
                  :items="actionOptions"
                  v-model="selectedAction"
                  @change="onActionChange"
                />
              </div>
              <div class="flex-fill">
                <SearchableDropdown
                  id="asset-type"
                  label="Asset Type"
                  placeholder="Select asset type"
                  :items="assetTypeOptions"
                  v-model="selectedAssetType"
                  @change="onAssetTypeChange"
                />
              </div>
              <div class="flex-fill">
                <DatePicker :inputId="'history-date-from'" label="From" v-model="filters.dateFrom" @change="applyFilters" />
              </div>
              <div class="flex-fill">
                <DatePicker :inputId="'history-date-to'" label="To" v-model="filters.dateTo" @change="applyFilters" />
              </div>
              <div class="filter-clear-button-container">
                <div class="d-flex align-items-end h-100">
                  <button class="btn btn-gray filter-clear-btn" @click="clearFilters" title="Clear All Filters">
                    <i class="fas fa-times me-1"></i>Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary">
              <output class="visually-hidden">Loading...</output>
            </div>
            <p class="mt-2 text-muted">Loading asset events...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="assetEvents.length === 0" class="text-center py-4">
            <i class="fas fa-history fa-2x text-muted mb-2"></i>
            <h6 class="text-muted">No Events</h6>
            <p class="text-muted small">No asset events found for the selected filters.</p>
          </div>

          <!-- Timeline -->
          <div v-else class="asset-history-timeline">
            <div class="timeline-item" v-for="(item, index) in assetEvents" :key="index + '-' + item.id + '-' + item.action">
              <div class="timeline-connector" v-if="index < assetEvents.length - 1"></div>

              <div class="timeline-dot returned" :style="{ backgroundColor: item.action === 'ASSIGNED' ? 'var(--secondary-green)' : 'var(--secondary-orange)' }">
                <i :class="item.action === 'ASSIGNED' ? 'fas fa-arrow-right' : 'fas fa-arrow-left'"></i>
              </div>

              <div class="timeline-content compact">
                <div class="timeline-header">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="asset-icon-timeline" :style="{ backgroundColor: getAssetIconColor(item.assetType) }">
                        <i :class="getAssetTypeIcon(item.assetType)"></i>
                      </div>
                      <div class="asset-basic-info-timeline">
                        <div class="asset-name-timeline">{{ item.assetName }}</div>
                        <div class="asset-meta-timeline small">{{ item.assetType }} • {{ item.brand }} {{ item.model }} • {{ item.assetId }}</div>
                      </div>
                    </div>
                    <div class="d-flex flex-column align-items-end text-end">
                      <div class="text-muted small">{{ item.performedBy }} • {{ formatDateTime(item.timestamp) }}</div>
                      <div class="mt-1">
                        <span class="badge" :class="item.action === 'ASSIGNED' ? 'badge-green' : 'badge-orange'">{{ item.action === 'ASSIGNED' ? 'Assigned' : 'Returned' }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="timeline-details compact">
                  <div class="row g-2">
                    <div class="col-6 col-sm-3">
                      <div class="info-item">
                        <span class="info-label small">{{ item.action === 'ASSIGNED' ? 'Issue Date' : 'Return Date' }}</span>
                        <div class="info-value small">{{ formatDate(item.date) }}</div>
                      </div>
                    </div>
                    <div class="col-6 col-sm-2">
                      <div class="info-item">
                        <span class="info-label small">Condition</span>
                        <div class="info-value small">{{ item.condition || 'Not specified' }}</div>
                      </div>
                    </div>
                    <div class="col-6 col-sm-4">
                      <div class="info-item">
                        <span class="info-label small">{{ item.action === 'ASSIGNED' ? 'Issue Reason' : 'Return Reason' }}</span>
                        <div class="info-value small">{{ item.reason || 'Not specified' }}</div>
                      </div>
                    </div>
                    
                    <div class="col-12" v-if="getNotesForAction(item)">
                      <div class="info-item">
                        <span class="info-label small">Notes</span>
                        <div class="info-value notes-display small">{{ getNotesForAction(item) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.totalPages > 1" class="d-flex justify-content-center mt-4">
            <AppPagination 
              :current-page="pagination.currentPage" 
              :total-pages="pagination.totalPages"
              :start="paginationInfo.start"
              :end="paginationInfo.end"
              :total="paginationInfo.total"
              item-name="events"
              @change="changePage" 
            />
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script>
import { employeeApiService } from '@/services/api/employeeApi'
import { assetApiService } from '@/services/api/assetApi'
import ToastNotification from '@/components/common/ToastNotification.vue'
import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
import { DatePicker } from '@/components/ui'
import AppPagination from '@/components/ui/pagination/AppPagination.vue'
import { useToastStore } from '@/stores/toast'

export default {
  name: 'EmployeeAssetHistory',
  components: { ToastNotification, SearchableDropdown, DatePicker, AppPagination },
  setup() {
    const toastStore = useToastStore()
    return {
      toastStore
    }
  },
  computed: {
    returnedEventsCount() {
      if (!this.assetEvents || !Array.isArray(this.assetEvents)) return 0
      return this.assetEvents.filter(e => e.action === 'RETURNED').length
    },
    sortAscending() {
      return this.filters.sortOrder === 'asc'
    },
    paginationInfo() {
      const total = this.pagination?.totalCount || 0
      const currentPage = this.pagination?.currentPage || 1
      const limit = this.filters?.limit || 20
      const start = total === 0 ? 0 : (currentPage - 1) * limit + 1
      const end = Math.min(currentPage * limit, total)
      return { start, end, total }
    }
  },
  watch: {
    'filters.dateFrom'(newFromDate) {
      // Reset "To" date only if "From" date is after the "To" date
      if (newFromDate && this.filters.dateTo && new Date(newFromDate) > new Date(this.filters.dateTo)) {
        this.filters.dateTo = ''
        // Optional: Show a brief toast notification
        // this.toastStore.showToast('To date reset because From date is after To date', 'info')
      }
    }
  },
  data() {
    return {
      employee: null,
      // Events-based timeline data
      assetEvents: [],
      pagination: { totalCount: 0, currentPage: 1, totalPages: 1, hasNext: false, hasPrevious: false },
      filters: { action: '', assetType: '', dateFrom: '', dateTo: '', search: '', sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20 },
      // dropdown selections and options
      selectedAction: null,
      selectedAssetType: null,
      selectedSortBy: null,
      showFilterDropdown: false,
      actionOptions: [
        { id: '', name: 'All' },
        { id: 'ASSIGNED', name: 'Assigned' },
        { id: 'RETURNED', name: 'Returned' }
      ],
      sortByOptions: [
        { id: 'date', name: 'Date' },
        { id: 'action', name: 'Action' },
        { id: 'assetType', name: 'Asset Type' }
      ],
      assetTypeOptions: [ { id: '', name: 'All' } ],
      // still used to show currently assigned quick section? removed to avoid duplication; keep minimal if needed later
      currentAssignments: [],
      loading: true
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    goBackToEmployee() {
      const employeeId = this.$route.params.id
      // Navigate back to employees list and reopen the modal for this employee
      this.$router.push({ path: '/app/employees', query: { open: employeeId } })
    },
    async loadData() {
      const employeeId = this.$route.params.id
      if (!employeeId) {
        this.$router.push('/app/employees')
        return
      }

      try {
        this.loading = true
        
        // Load employee details
        const employeeResponse = await employeeApiService.getEmployeeById(employeeId, true)
        const e = employeeResponse.data.employee || {}
        // Normalize to fields used by this view
        this.employee = {
          id: e.employeeId,
          employeeId: e.employeeId,
          name: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.employeeId || 'Employee',
          email: e.email,
        assignedAssetsCount: e.assignedAssetsCount || 0
        }
      this.currentAssignments = (e.assignedAssets || []).map(a => ({
        assetId: a.assetId,
        assetName: a.assetName,
        assignedDate: a.assignedDate,
        status: a.status,
        // Optional extra fields when available
        assetType: a.assetType || 'Other',
        brand: a.brand,
        model: a.model
      }))

      // Try to enrich current assignments with asset details for icon and meta
      await this.enrichCurrentAssignments()
        
        // Load events
        await this.fetchEvents()
        
      } catch (error) {
        console.error('Failed to load data:', error)
        this.toastStore.showToast(
          'Error',
          'Failed to load employee asset history. Please try again.',
          'error'
        )
        this.$router.push('/app/employees')
      } finally {
        this.loading = false
      }
    },
    async fetchEvents() {
      const employeeId = this.$route.params.id
      const params = { ...this.filters, page: this.filters.page, limit: this.filters.limit }
      const response = await employeeApiService.getAssetEvents(employeeId, params)
      this.assetEvents = response.data.assetEvents || []
      this.pagination = response.data.pagination || { totalCount: 0, currentPage: 1, totalPages: 1, hasNext: false, hasPrevious: false }
      // refresh asset type options from current result set
      const set = new Set(this.assetEvents.map(e => e.assetType).filter(Boolean))
      const dynamicOptions = Array.from(set).sort().map(name => ({ id: name, name }))
      this.assetTypeOptions = [ { id: '', name: 'All' }, ...dynamicOptions ]
    },
    async applyFilters() {
      this.filters.page = 1
      this.pagination.currentPage = 1
      await this.fetchEvents()
    },
    async changePage(page) {
      this.filters.page = page
      this.pagination.currentPage = page
      await this.fetchEvents()
    },
    async toggleSortOrder() {
      this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc'
      await this.fetchEvents()
    },
    onActionChange(item) {
      this.selectedAction = item
      this.filters.action = item?.id || ''
      this.applyFilters()
    },
    onAssetTypeChange(item) {
      this.selectedAssetType = item
      this.filters.assetType = item?.id || ''
      this.applyFilters()
    },
    onSortByChange(item) {
      this.selectedSortBy = item
      this.filters.sortBy = item?.id || 'date'
      this.applyFilters()
    },
    clearFilters() {
      this.selectedAction = null
      this.selectedAssetType = null
      this.filters = { action: '', assetType: '', dateFrom: '', dateTo: '', search: '', sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20 }
      this.pagination.currentPage = 1
      this.applyFilters()
    },
    async enrichCurrentAssignments() {
      if (!this.currentAssignments || this.currentAssignments.length === 0) return
      const fetches = this.currentAssignments.map(async (item, index) => {
        const numericId = Number.parseInt(item.assetId, 10)
        if (!Number.isNaN(numericId)) {
          try {
            const resp = await assetApiService.getAssetById(numericId)
            const asset = resp.data.asset
            const updated = {
              ...item,
              assetType: asset?.assetType?.name || item.assetType || 'Other',
              brand: asset?.brand?.name || item.brand,
              model: asset?.model?.name || item.model,
              assetName: item.assetName || asset?.model?.name || asset?.assetId || item.assetId
            }
            this.$set(this.currentAssignments, index, updated)
          } catch (e) {
            console.error('Asset enrichment failed for assignment item', { item, error: e })
          }
        }
      })
      await Promise.all(fetches)
    },
    formatDate(dateString) {
      if (!dateString) return 'Not specified'
      const d = new Date(dateString)
      if (Number.isNaN(d.getTime())) return 'Not specified'
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    },
    formatDateTime(dateString) {
      if (!dateString) return 'Not specified'
      const d = new Date(dateString)
      if (Number.isNaN(d.getTime())) return 'Not specified'
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      const pad2 = (n) => String(n).padStart(2, '0')
      const hours = pad2(d.getHours())
      const minutes = pad2(d.getMinutes())
      const seconds = pad2(d.getSeconds())
      // Format: DD/MM/YYYY HH:mm:ss
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    },
    getNotesForAction(item) {
      // For employee asset events, the notes field contains the appropriate content
      // based on the action (ASSIGNED or RETURNED)
      return item.notes || null
    },
    daysSince(dateString) {
      if (!dateString) return 0
      const start = new Date(dateString).getTime()
      const now = Date.now()
      const diffMs = Math.max(now - start, 0)
      return Math.floor(diffMs / (1000 * 60 * 60 * 24))
    },
    getEmployeeIconColor(employeeId) {
      const colors = [
        'var(--secondary-purple)',
        'var(--secondary-green)', 
        'var(--secondary-pink)',
        'var(--secondary-orange)',
        'var(--secondary-red)',
        'var(--secondary-blue)',
        'var(--secondary-brown)',
        'var(--primary-dark-gray)'
      ]
      const hash = Array.from(employeeId).reduce((acc, ch) => {
        const code = ch.codePointAt(0) ?? 0
        acc = ((acc << 5) - acc) + code
        return acc & acc
      }, 0)
      return colors[Math.abs(hash) % colors.length]
    },
    getAssetIconColor(assetType) {
      const colors = {
        'Laptop': 'var(--secondary-purple)',
        'Desktop': 'var(--secondary-blue)',
        'Monitor': 'var(--secondary-green)',
        'Phone': 'var(--secondary-orange)',
        'Tablet': 'var(--secondary-pink)',
        'Other': 'var(--secondary-gray)'
      }
      const type = this.normalizeAssetType(assetType)
      return colors[type] || colors['Other']
    },
    getAssetTypeIcon(assetType) {
      const icons = {
        'Laptop': 'fas fa-laptop',
        'Desktop': 'fas fa-desktop',
        'Monitor': 'fas fa-tv',
        'Phone': 'fas fa-mobile-alt',
        'Tablet': 'fas fa-tablet-alt',
        'Other': 'fas fa-box-open'
      }
      const type = this.normalizeAssetType(assetType)
      // If a type is not recognized, fall back to the same icon and color used for 'Other'
      return icons[type] || icons['Other']
    },
    normalizeAssetType(assetType) {
      if (!assetType || typeof assetType !== 'string') return 'Other'
      const v = assetType.trim().toLowerCase()
      if (['laptop', 'notebook', 'macbook'].includes(v)) return 'Laptop'
      if (['desktop', 'pc', 'workstation'].includes(v)) return 'Desktop'
      if (['monitor', 'display', 'screen'].includes(v)) return 'Monitor'
      if (['phone', 'mobile', 'smartphone', 'cellphone'].includes(v)) return 'Phone'
      if (['tablet', 'ipad'].includes(v)) return 'Tablet'
      return 'Other'
    }
  }
}
</script>

<style scoped>
/**
 * EmployeeAssetHistory.vue - View-Specific Styles
 * Styles unique to this view only - shared styles are in /assets/styles/pages/employees.css
 */

/* =================================
   PAGE LAYOUT
   Specific to asset history page
================================= */

.card-body {
  padding: 1.5rem;
}

/* =================================
   TIMELINE CUSTOMIZATION
   View-specific timeline adjustments
================================= */

/* Defensive fixes to prevent layout regression from shared/global styles */
.asset-history-timeline .timeline-item { 
  position: relative; 
}

/* uses shared .badge display rules from badges.css */

.asset-history-timeline .timeline-dot { 
  position: absolute !important; 
  left: -2rem !important; 
  top: 0.25rem !important; 
  width: 1.5rem !important; 
  height: 1.5rem !important; 
  border-radius: 50% !important; 
  display: flex !important; 
  align-items: center !important; 
  justify-content: center !important; 
}

.asset-icon-timeline {
  width: 40px !important;
  height: 40px !important;
  border-radius: 0.5rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 0.75rem !important;
  flex-shrink: 0 !important;
}

.asset-icon-timeline i {
  color: white !important;
  font-size: 1rem !important;
}

.asset-basic-info-timeline {
  min-width: 0 !important;
  flex-grow: 1 !important;
}

.asset-name-timeline {
  color: var(--primary-black) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.1rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.asset-meta-timeline {
  color: var(--primary-mid-gray) !important;
  font-size: 0.85rem !important;
  font-weight: 500 !important;
}

/* =================================
   EVENT DETAILS
   Specific to this page's event display
================================= */

.info-item {
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
  display: block;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #212529;
}

.notes-display {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 0.9rem;
  color: #495057;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e9ecef;
}

/* =================================
   FILTER SECTION
   Specific to this page's filters
================================= */

.filter-dropdown {
  border: 1px solid #dee2e6;
  background-color: #f8f9fa !important;
}

.filter-dropdown .history-date-input {
  height: 37.6px !important;
  line-height: 1.5;
  font-size: 1rem;
  padding: 9px !important;
  border-radius: 0.375rem;
}

.filter-dropdown .info-label {
  margin-bottom: 0.5rem !important;
}

.btn.active {
  background-color: #0d6efd;
  color: #fff;
}

.filter-clear-button-container {
  flex-shrink: 0;
  min-width: 120px;
}

.filter-clear-btn {
  width: 100%;
  min-width: 120px;
}

/* =================================
   RESPONSIVE STYLES
   View-specific responsive adjustments
================================= */

@media (max-width: 767.98px) {
  .filter-clear-button-container { width: 100%; min-width: unset; }
  .filter-clear-btn { width: 100%; min-width: unset; }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .filter-clear-button-container { min-width: 140px; }
  .filter-clear-btn { min-width: 140px; }
}

/* Mobile Responsive */
@media (max-width: 576px) {
  .asset-history-timeline {
    padding-left: 1.5rem;
  }
  
  .timeline-dot {
    left: -1.5rem;
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .timeline-connector {
    left: -1rem;
  }
  
  .timeline-content.compact {
    padding: 0.6rem;
  }
  
  .timeline-header {
    margin-bottom: 0.6rem;
    padding-bottom: 0.4rem;
  }
}

/* Tablet Responsive */
@media (min-width: 577px) and (max-width: 991.98px) {
  .timeline-content {
    padding: 1rem;
  }
  
  .timeline-details {
    padding: 1rem;
  }
}
</style>

