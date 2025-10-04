<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h2 class="mb-0" style="color: var(--primary-black);">Maintenance History</h2>
        <p class="text-muted mb-0">Asset {{ assetId }}</p>
      </div>
      <button class="btn btn-outline-secondary" @click="goBack">
        <i class="fas fa-arrow-left me-1"></i>Back
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-3">
      <div class="card-body py-3">
        <div class="row align-items-end">
          <!-- Search -->
          <div class="col-12 col-lg-7 mb-3">
            <label class="form-label">Search</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
              <input type="text" class="form-control" v-model="filters.search" placeholder="Description/type/status" @keyup.enter="applyFilters" />
            </div>
          </div>
          <!-- Sort By -->
          <div class="col-12 col-lg-3 mb-3">
            <SearchableDropdown
              id="mh-sort-by"
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
                <button type="button" class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" @click.prevent.stop="toggleSortOrder" title="Toggle Sort Order" style="min-width: 40px; height: 38px;">
                  <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']" style="font-size: 0.9rem;"></i>
                </button>
              </div>
              <div class="col-8">
                <button class="btn btn-outline-secondary btn-modern w-100" @click="showFilterDropdown = !showFilterDropdown" :class="{ active: showFilterDropdown }">
                  <i class="fas fa-filter me-1"></i>Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showFilterDropdown" class="filter-dropdown mt-3 p-3 bg-light rounded">
          <div class="d-flex flex-column flex-md-row gap-2">
            <div class="flex-fill">
              <SearchableDropdown
                id="mh-status"
                label="Status"
                placeholder="Search status..."
                :items="statusOptions"
                v-model="selectedStatus"
                @change="applyFilters"
              />
            </div>
            <div class="flex-fill">
              <SearchableDropdown
                id="mh-type"
                label="Type"
                placeholder="Search type..."
                :items="typeOptions"
                v-model="selectedType"
                @change="applyFilters"
              />
            </div>
            <div class="flex-fill">
              <DateField id="mh-from" label="From" v-model="filters.dateFrom" @change="applyFilters" />
            </div>
            <div class="flex-fill">
              <DateField id="mh-to" label="To" v-model="filters.dateTo" @change="applyFilters" />
            </div>
            <div class="filter-clear-button-container">
              <div class="d-flex align-items-end h-100">
                <button class="btn btn-outline-secondary btn-modern filter-clear-btn" @click="clearFilters" title="Clear All Filters">
                  <i class="fas fa-times me-1"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading maintenance history…</p>
    </div>

    <div v-else>
      <div v-if="filteredHistory.length === 0" class="text-center py-5">
        <i class="fas fa-history fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No history found</h5>
      </div>

      <div v-else class="maintenance-history-section">
        <h6 class="section-title d-flex align-items-center justify-content-between">
          <span><i class="fas fa-history me-2"></i>Timeline</span>
          <span class="badge bg-primary">{{ totalRecords }} records</span>
        </h6>

        <div class="history-timeline">
          <div 
            v-for="item in filteredHistory" 
            :key="item.id" 
            class="timeline-item" 
            :class="`timeline-${item.status.toLowerCase().replace('_', '-')}`">
            <div class="timeline-marker"></div>
            <div class="timeline-content compact">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 class="timeline-title mb-1">{{ item.description }}</h6>
                  <div class="timeline-meta">
                    <span class="badge" :class="`badge-${item.status.toLowerCase().replace('_', '-')}`">{{ formatStatus(item.status) }}</span>
                    <span class="badge" :class="`badge-type-${item.maintenanceTypeName.toLowerCase()}`">{{ item.maintenanceTypeName }}</span>
                  </div>
                </div>
                <!-- Top-right date/time intentionally hidden per UX -->
              </div>
              <div class="timeline-details compact">
                <div class="row g-2">
                  <template v-if="item.status === 'SCHEDULED'">
                    <div class="col-md-4">
                      <small class="text-muted">Scheduled Date</small>
                      <div>{{ formatDate((item as any).scheduledDateOnly || item.scheduledDate) }}</div>
                    </div>
                    <div class="col-md-4">
                      <small class="text-muted">Scheduled At</small>
                      <div>{{ formatDateTime((item as any).date || item.scheduledDate) }}</div>
                    </div>
                  </template>

                  <template v-else-if="item.status === 'COMPLETED'">
                    <div class="col-md-4">
                      <small class="text-muted">Completed At</small>
                      <div>{{ formatDateTime((item as any).date) }}</div>
                    </div>
                  </template>

                  <template v-else-if="item.status === 'CANCELLED'">
                    <div class="col-md-4">
                      <small class="text-muted">Cancelled At</small>
                      <div>{{ formatDateTime((item as any).date) }}</div>
                    </div>
                  </template>

                  <div class="col-md-4">
                    <small class="text-muted">Cost</small>
                    <div>
                      {{ item.actualCost ? `₹${item.actualCost.toFixed(2)} (Actual)` : item.estimatedCost ? `₹${item.estimatedCost.toFixed(2)} (Estimated)` : 'N/A' }}
                    </div>
                  </div>
                </div>
                <div v-if="getNotesForStatus(item)" class="mt-2">
                  <small class="text-muted">Notes</small>
                  <div class="timeline-notes">{{ getNotesForStatus(item) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
          <AppPagination 
            :current-page="currentPage" 
            :total-pages="totalPages" 
            @change="onPageChange" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { maintenanceService } from '@/services/maintenanceService'
import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
import DateField from '@/components/common/DateField.vue'
import AppPagination from '@/components/pagination/AppPagination.vue'
import { formatDateOnly, formatDateTime } from '@/utils/date'

interface HistoryItem {
  id: number
  assetId: string
  assetName: string
  maintenanceTypeName: string
  status: string
  scheduledDate: string
  estimatedCost: number | null
  actualCost: number | null
  description: string
  completionNotes: string | null
  cancellationNotes: string | null
  actualStartDate: string | null
  actualCompletionDate: string | null
  totalTimeTaken: string | null
  cancellationDate: string | null
}

const route = useRoute()
const router = useRouter()
const assetId = String(route.params.assetId || '')

const loading = ref(false)
const history = ref<HistoryItem[]>([])

// Pagination state
const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = ref(0)
const totalRecords = ref(0)

// Filters state
const showFilterDropdown = ref(false)
const filters = ref({ search: '', dateFrom: '', dateTo: '', sortBy: 'date', sortOrder: 'desc' as 'asc' | 'desc' })
const selectedSortBy = ref({ id: 'date', name: 'Date' } as any)
const selectedStatus = ref<any>(null)
const selectedType = ref<any>(null)

const sortByOptions = [
  { id: 'date', name: 'Date' },
  { id: 'status', name: 'Status' },
  { id: 'type', name: 'Type' },
]

const statusOptions = [
  { id: '', name: 'All' },
  { id: 'SCHEDULED', name: 'Scheduled' },
  { id: 'COMPLETED', name: 'Completed' },
  { id: 'CANCELLED', name: 'Cancelled' },
]

const typeOptions = [
  { id: '', name: 'All' },
  { id: 'PREVENTIVE', name: 'Preventive' },
  { id: 'CORRECTIVE', name: 'Corrective' },
  { id: 'EMERGENCY', name: 'Emergency' },
  { id: 'UPGRADE', name: 'Upgrade' },
]

const sortAscending = computed(() => filters.value.sortOrder === 'asc')

const formatStatus = (status: string) => status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

// Format date as "3 Oct 2025" (day month year)
const formatDate = (dateString?: string | null) => {
  if (!dateString) return '-'
  return formatDateOnly(dateString, 'en-US')
}

// Format datetime as "2 Oct 2025 8:10:10" (day month year hour:minute:second)
const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}
const getNotesForStatus = (item: any) => {
  switch (item.status) {
    case 'SCHEDULED':
      return null // Don't show notes for scheduled as description is already shown as heading
    case 'COMPLETED':
      return item.completionNotes
    case 'CANCELLED':
      return item.cancellationNotes
    default:
      return null
  }
}
const getTimelineDate = (item: HistoryItem) => item.status === 'IN_PROGRESS' ? (item.actualStartDate || item.scheduledDate) : item.scheduledDate
const calcDurationDays = (start?: string | null, end?: string | null) => {
  if (!start || !end) return null
  const startDt = new Date(start)
  const endDt = new Date(end)
  const ms = endDt.getTime() - startDt.getTime()
  if (isNaN(ms) || ms < 0) return null
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return days === 1 ? '1 day' : `${days} days`
}

const goBack = () => router.back()

const onSortByChange = (item: any) => {
  selectedSortBy.value = item
  filters.value.sortBy = item?.id || 'date'
  applyFilters()
}

const toggleSortOrder = () => {
  filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
  applyFilters()
}

const clearFilters = () => {
  filters.value = { search: '', dateFrom: '', dateTo: '', sortBy: 'date', sortOrder: 'desc' }
  selectedStatus.value = null
  selectedType.value = null
  selectedSortBy.value = { id: 'date', name: 'Date' }
  currentPage.value = 1
  applyFilters()
}

const onPageChange = (page: number) => {
  currentPage.value = page
  applyFilters()
}

const applyFilters = async () => {
  if (!assetId) return
  
  try {
    loading.value = true
    const params: any = {
      status: selectedStatus.value?.id || undefined,
      type: selectedType.value?.id || undefined,
      search: filters.value.search || undefined,
      dateFrom: filters.value.dateFrom || undefined,
      dateTo: filters.value.dateTo || undefined,
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.sortOrder,
      page: currentPage.value,
      limit: pageSize.value,
    }
    const res = await maintenanceService.getMaintenanceEvents(assetId, params)
    
    // Update pagination info
    if (res.data.pagination) {
      totalPages.value = res.data.pagination.totalPages
      totalRecords.value = res.data.pagination.totalCount
    }
    
    // Transform events to the HistoryItem-like shape expected by the template
    history.value = (res.data.events || []).map((e: any, idx: number) => ({
      id: e.id || idx,
      assetId: assetId,
      assetName: '',
      maintenanceTypeName: e.maintenanceTypeName,
      status: e.status,
      scheduledDate: e.scheduledDateOnly || '-',
      estimatedCost: e.estimatedCost ?? null,
      actualCost: e.actualCost ?? null,
      description: e.description,
      completionNotes: e.completionNotes ?? null,
      cancellationNotes: e.cancellationNotes ?? null,
      actualStartDate: null,
      actualCompletionDate: null,
      totalTimeTaken: null,
      cancellationDate: null,
      // extra fields for rendering
      date: e.date,
      scheduledDateOnly: e.scheduledDateOnly,
    }))
  } catch (error) {
    console.error('Error fetching maintenance events:', error)
    history.value = []
    totalPages.value = 0
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

const filteredHistory = computed(() => history.value)

// Debounced search
let searchTimeout: number | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Watchers for automatic filtering
watch(() => filters.value.search, () => {
  currentPage.value = 1
  debouncedSearch()
})

watch(() => filters.value.dateFrom, (newFromDate) => {
  currentPage.value = 1
  // Reset "To" date only if "From" date is after the "To" date
  if (newFromDate && filters.value.dateTo && new Date(newFromDate) > new Date(filters.value.dateTo)) {
    filters.value.dateTo = ''
    // Optional: Show a brief toast notification
    // toastStore.showToast('To date reset because From date is after To date', 'info')
  }
  applyFilters()
})

watch(() => filters.value.dateTo, () => {
  currentPage.value = 1
  applyFilters()
})

watch(() => selectedStatus.value, () => {
  currentPage.value = 1
  applyFilters()
})

watch(() => selectedType.value, () => {
  currentPage.value = 1
  applyFilters()
})

onMounted(async () => {
  if (!assetId) return
  try {
    loading.value = true
    await applyFilters()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.maintenance-history-section {
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  padding: 1rem !important;
  margin-bottom: 1rem !important;
}

.history-timeline {
  position: relative;
  padding-left: 2rem;
}

.history-timeline::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--element-gray);
}

.timeline-item {
  position: relative;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.timeline-item:last-child { margin-bottom: 0; }

.timeline-marker {
  position: absolute;
  left: -2.25rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--primary-white);
  background: var(--primary-mid-gray);
}

.timeline-scheduled .timeline-marker { background: var(--secondary-purple); }
.timeline-in-progress .timeline-marker { background: var(--secondary-orange); }
.timeline-completed .timeline-marker { background: var(--secondary-green); }
.timeline-cancelled .timeline-marker { background: var(--secondary-red); }

.timeline-content { background: var(--primary-light-gray); border: 1px solid var(--element-gray); border-radius: 0.5rem; padding: 0.75rem; }
.timeline-content.compact { padding: 0.6rem; }

.timeline-title { color: var(--primary-black); font-size: 0.95rem; font-weight: 600; margin: 0; }
.timeline-meta { display: flex; gap: 0.5rem; margin-top: 0.4rem; }
.timeline-meta .badge { font-size: 0.7rem; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-weight: 500; }
.badge-scheduled { background-color: var(--secondary-purple) !important; color: white !important; }
.badge-in-progress { background-color: var(--secondary-orange) !important; color: white !important; }
.badge-completed { background-color: var(--secondary-green) !important; color: white !important; }
.badge-cancelled { background-color: var(--secondary-red) !important; color: white !important; }
.badge-type-preventive { background-color: var(--secondary-green) !important; color: white !important; }
.badge-type-corrective { background-color: var(--secondary-pink) !important; color: white !important; }
.badge-type-emergency { background-color: var(--secondary-red) !important; color: white !important; }
.badge-type-upgrade { background-color: var(--secondary-purple) !important; color: white !important; }
.timeline-date { font-size: 0.8rem; color: var(--primary-mid-gray); font-weight: 500; }

.timeline-details { margin-top: 0.5rem; font-size: 0.85rem; }
.timeline-details.compact { margin-top: 0.4rem; }
.timeline-details .text-muted { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.025em; font-weight: 500; }
.timeline-notes { font-style: italic; color: var(--primary-dark-gray); font-size: 0.8rem; margin-top: 0.25rem; }

/* Filter dropdown styling */
.filter-dropdown { border: 1px solid #dee2e6; background-color: #f8f9fa !important; }
.btn.active { background-color: #0d6efd; color: #fff; }
.filter-clear-button-container { flex-shrink: 0; min-width: 120px; }
.filter-clear-btn { width: 100%; min-width: 120px; }
@media (max-width: 767.98px) { .filter-clear-button-container { width: 100%; min-width: unset; } .filter-clear-btn { width: 100%; min-width: unset; } }
@media (min-width: 768px) and (max-width: 991.98px) { .filter-clear-button-container { min-width: 140px; } .filter-clear-btn { min-width: 140px; } }
</style>


