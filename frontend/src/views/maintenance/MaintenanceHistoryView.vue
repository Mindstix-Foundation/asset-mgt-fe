<template>
  <div class="container-fluid py-4 maintenance-history-page">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h2 class="mb-0" style="color: var(--primary-black);">Maintenance History</h2>
      </div>
      <button class="btn btn-gray" @click="goBack">
        <i class="fas fa-arrow-left me-1"></i>Back
      </button>
    </div>

    <div class="card mb-3 asset-summary-card" v-if="assetDetails">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-12 col-md-8">
            <h5 class="mb-1">{{ assetDetails.name }}</h5>
            <p class="asset-meta mb-0">
              <span v-if="assetDetails.assetType">{{ assetDetails.assetType }} • </span>
              <span>{{ assetDetails.brand }} {{ assetDetails.model }}</span>
              <span class="text-muted"> • {{ assetDetails.assetId }}</span>
            </p>
          </div>
          <div class="col-12 col-md-4 text-md-end mt-3 mt-md-0">
            <div class="info-item mb-0">
              <small class="text-muted d-block">Serial Number</small>
              <span class="fw-semibold">{{ assetDetails.serialNumber || 'Not specified' }}</span>
            </div>
          </div>
        </div>
        <div class="asset-specifications mt-3" v-if="hasAssetSpecifications(assetDetails)">
          <div class="spec-header">
            <span class="info-label small mb-0">Specifications</span>
          </div>
          <div class="specifications-inline">
            <span
              class="spec-inline-item"
              v-for="(spec, specIndex) in getAssetSpecificationEntries(assetDetails)"
              :key="`asset-spec-${specIndex}`"
            >
              <span class="spec-inline-label">{{ spec.label }}:</span>
              <span class="spec-inline-value">{{ spec.value }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-3 border rounded p-3 shadow-sm bg-white filter-panel">
      <div class="row align-items-end">
          <!-- Search -->
          <div class="col-12 col-lg-7 mb-3">
            <label class="form-label" for="mh-search">Search</label>
            <div class="search-input-container">
              <i class="fas fa-search search-icon"></i>
              <input id="mh-search" type="text" class="form-control search-input" v-model="filters.search" placeholder="Search by description, type, or status..." @keyup.enter="applyFilters" />
            </div>
          </div>
          <!-- Sort By (aligned with EmployeeAssetHistory) -->
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
                <button type="button" class="btn btn-gray w-100 d-flex align-items-center justify-content-center" @click="toggleSortOrder" title="Toggle Sort Order" style="min-width: 40px; height: 38px;">
                  <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']" style="font-size: 0.9rem;"></i>
                </button>
              </div>
              <div class="col-8">
                <button class="btn btn-filter w-100" @click="showFilterDropdown = !showFilterDropdown" :class="{ active: showFilterDropdown }">
                  <i class="fas fa-filter me-1"></i>Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showFilterDropdown" class="mt-3 border rounded p-3 shadow-sm bg-white filter-panel">
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
              <DatePicker id="mh-from" label="From" v-model="filters.dateFrom" :max="todayIso" @change="onFromDateChange" />
            </div>
            <div class="flex-fill">
              <DatePicker 
                id="mh-to" 
                label="To" 
                v-model="filters.dateTo" 
                :disabled="!filters.dateFrom"
                :min="filters.dateFrom || undefined"
                :max="todayIso"
                @change="onToDateChange"
              />
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
      </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary">
        <span class="visually-hidden">Loading...</span>
      </div>
      <output class="mt-2 text-muted">Loading maintenance history…</output>
    </div>

    <div v-else>
      <div v-if="filteredHistory.length === 0" class="text-center py-5">
        <i class="fas fa-history fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">No history found</h5>
      </div>

      <div v-else class="card">
        <div class="card-body">
          <h6 class="section-title d-flex align-items-center justify-content-between mb-3">
            <span><i class="fas fa-history me-2"></i>Timeline</span>
            <span class="badge badge-pink">{{ totalRecords }} records</span>
          </h6>
          
          <hr class="timeline-divider mt-2 mb-3">

          <div class="history-timeline">
          <div 
            v-for="item in filteredHistory" 
            :key="item.id" 
            class="timeline-item" 
            :class="`timeline-${item.status.toLowerCase().replaceAll('_', '-')}`">
            <div class="timeline-marker"></div>
            <div class="timeline-content compact">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 class="timeline-title mb-1">{{ item.description }}</h6>
                  <div class="timeline-meta">
                    <span class="badge" :class="getStatusBadgeClass(item.status)">{{ formatStatus(item.status) }}</span>
                  </div>
                </div>
                <div class="d-flex flex-column align-items-end text-end">
                  <div class="text-muted small">
                    <template v-if="(item as any).performedByName || (item as any).performedBy">
                      {{ (item as any).performedByName || (item as any).performedBy }} • 
                    </template>{{ formatDateTimeDisplay((item as any).date || item.scheduledDate) }}
                  </div>
                </div>
              </div>
                <div class="timeline-details compact">
                <div class="row g-2">
                  <template v-if="item.status === 'SCHEDULED'">
                    <div class="col-md-3">
                      <small class="text-muted">Scheduled Date</small>
                      <div>{{ formatDate((item as any).scheduledDateOnly || item.scheduledDate) }}</div>
                    </div>
                    <div class="col-md-3">
                      <small class="text-muted">Scheduled At</small>
              <div>{{ formatDateTimeDisplay((item as any).date || item.scheduledDate) }}</div>
                    </div>
                    <div class="col-md-3">
                      <small class="text-muted">Type</small>
                      <div>{{ item.maintenanceTypeName }}</div>
                    </div>
                  </template>

                  <template v-else-if="item.status === 'COMPLETED'">
                    <div class="col-md-3">
                      <small class="text-muted">Completed At</small>
              <div>{{ formatDateTimeDisplay((item as any).date) }}</div>
                    </div>
                    <div class="col-md-3">
                      <small class="text-muted">Type</small>
                      <div>{{ item.maintenanceTypeName }}</div>
                    </div>
                  </template>

                  <template v-else-if="item.status === 'CANCELLED'">
                    <div class="col-md-3">
                      <small class="text-muted">Cancelled At</small>
              <div>{{ formatDateTimeDisplay((item as any).date) }}</div>
                    </div>
                    <div class="col-md-3">
                      <small class="text-muted">Type</small>
                      <div>{{ item.maintenanceTypeName }}</div>
                    </div>
                  </template>

                  <div class="col-md-3">
                    <small class="text-muted">Cost</small>
                    <div>
                      {{ item.actualCost ? `₹${item.actualCost.toFixed(2)} (Actual)` : item.estimatedCost ? `₹${item.estimatedCost.toFixed(2)} (Estimated)` : 'N/A' }}
                    </div>
                  </div>
                </div>
                <div class="col-12 mt-2" v-if="getNotesForStatus(item)">
                  <div class="info-item">
                    <span class="info-label small">Notes</span>
                    <div class="info-value notes-display small">{{ getNotesForStatus(item) }}</div>
                  </div>
                </div>
              </div>
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
          :start="paginationInfo.start"
          :end="paginationInfo.end"
          :total="totalRecords"
          item-name="records"
          @change="onPageChange" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { maintenanceService } from '@/services/business/maintenanceService'
import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
import DatePicker from '@/components/ui/date/DatePicker.vue'
import AppPagination from '@/components/ui/pagination/AppPagination.vue'
import { formatDateOnly } from '@/utils/date'

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
  performedBy: string | null
}

interface AssetSummary {
  id: number
  assetId: string
  name: string
  assetType?: string
  brand?: string
  model?: string
  serialNumber?: string
  specifications?: Record<string, any>
  specificationLabelMap?: Record<string, string>
}

const route = useRoute()
const router = useRouter()
const assetId = String(route.params.assetId || '')
const MAINTENANCE_HISTORY_STATE_KEY = 'maintenanceHistoryViewState'
let isRestoringViewState = false

const loading = ref(false)
const history = ref<HistoryItem[]>([])
const assetDetails = ref<AssetSummary | null>(null)
const todayIso = new Date().toISOString().split('T')[0]

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

const persistViewState = () => {
  if (typeof window === 'undefined') return
  try {
    const state = {
      filters: { ...filters.value },
      selectedStatusId: selectedStatus.value?.id ?? null,
      selectedTypeId: selectedType.value?.id ?? null,
      selectedSortById: selectedSortBy.value?.id ?? 'date',
      currentPage: currentPage.value,
      showFilterDropdown: showFilterDropdown.value
    }
    window.sessionStorage.setItem(MAINTENANCE_HISTORY_STATE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to persist maintenance history view state:', error)
  }
}

const restoreViewState = () => {
  if (typeof window === 'undefined') return
  try {
    const raw = window.sessionStorage.getItem(MAINTENANCE_HISTORY_STATE_KEY)
    if (!raw) return
    const state = JSON.parse(raw) as {
      filters?: typeof filters.value,
      selectedStatusId?: string | null,
      selectedTypeId?: string | null,
      selectedSortById?: string | null,
      currentPage?: number,
      showFilterDropdown?: boolean
    }
    isRestoringViewState = true

    if (state.filters) {
      filters.value = {
        ...filters.value,
        ...state.filters,
        sortBy: state.filters.sortBy || filters.value.sortBy,
        sortOrder: state.filters.sortOrder === 'asc' ? 'asc' : 'desc'
      }
    }

    if ('currentPage' in state && typeof state.currentPage === 'number' && state.currentPage > 0) {
      currentPage.value = state.currentPage
    }

    if ('showFilterDropdown' in state) {
      showFilterDropdown.value = Boolean(state.showFilterDropdown)
    }

    if ('selectedStatusId' in state) {
      const matchStatus = statusOptions.find(option => option.id === state.selectedStatusId) || null
      selectedStatus.value = matchStatus
    }

    if ('selectedTypeId' in state) {
      const matchType = typeOptions.find(option => option.id === state.selectedTypeId) || null
      selectedType.value = matchType
    }

    if ('selectedSortById' in state) {
      const matchSort = sortByOptions.find(option => option.id === state.selectedSortById) || null
      if (matchSort) {
        selectedSortBy.value = matchSort
        filters.value.sortBy = matchSort.id
      }
    }

    onFromDateChange(filters.value.dateFrom)
    onToDateChange(filters.value.dateTo)
  } catch (error) {
    console.warn('Failed to restore maintenance history view state:', error)
  } finally {
    isRestoringViewState = false
  }
}

const sortAscending = computed(() => filters.value.sortOrder === 'asc')

const formatStatus = (status: string) => status.replaceAll('_', ' ').replaceAll(/\b\w/g, l => l.toUpperCase())

// Format date as "3 Oct 2025" (day month year)
const formatDate = (dateString?: string | null) => {
  if (!dateString) return '-'
  return formatDateOnly(dateString, 'en-US')
}

// Local display wrapper to avoid shadowing imported helper
const formatDateTimeDisplay = (dateString?: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'
  
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
// Map status to standardized badge classes from badges.css
const getStatusBadgeClass = (status?: string | null) => {
  const v = (status || '').toUpperCase()
  switch (v) {
    case 'SCHEDULED':
      return 'badge-purple'
    case 'IN_PROGRESS':
      return 'badge-orange'
    case 'COMPLETED':
      return 'badge-green'
    case 'CANCELLED':
      return 'badge-red'
    default:
      return 'badge-gray'
  }
}

// Map maintenance type to standardized badge classes from badges.css
const getTypeBadgeClass = (typeName?: string | null) => {
  const v = (typeName || '').toUpperCase()
  switch (v) {
    case 'PREVENTIVE':
      return 'badge-green'
    case 'CORRECTIVE':
      return 'badge-pink'
    case 'EMERGENCY':
      return 'badge-red'
    case 'UPGRADE':
      return 'badge-purple'
    default:
      return 'badge-gray'
  }
}
const getTimelineDate = (item: HistoryItem) => item.status === 'IN_PROGRESS' ? (item.actualStartDate || item.scheduledDate) : item.scheduledDate
const calcDurationDays = (start?: string | null, end?: string | null) => {
  if (!start || !end) return null
  const startDt = new Date(start)
  const endDt = new Date(end)
  const ms = endDt.getTime() - startDt.getTime()
  if (Number.isNaN(ms) || ms < 0) return null
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return days === 1 ? '1 day' : `${days} days`
}

const goBack = () => router.back()

const normalizeSpecificationsForDisplay = (specs: any) => {
  if (specs === null || specs === undefined || specs === '') {
    return null
  }
  if (typeof specs === 'string') {
    const trimmed = specs.trim()
    if (!trimmed) return null
    try {
      const parsed = JSON.parse(trimmed)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return stripDescriptionField(parsed)
      }
    } catch (error) {
      console.warn('Failed to parse specifications JSON for display:', error)
      return { Details: trimmed }
    }
    return { Details: trimmed }
  }
  if (typeof specs === 'object' && !Array.isArray(specs)) {
    return stripDescriptionField(specs)
  }
  return null
}

const stripDescriptionField = (obj: Record<string, any>) => {
  const clone = { ...obj }
  if ('description' in clone) {
    delete clone.description
  }
  return Object.keys(clone).length > 0 ? clone : null
}

const formatSpecificationLabel = (key?: string) => {
  if (!key) return ''
  return key
    .replace(/[_\s]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

const getAssetSpecificationEntries = (asset?: AssetSummary | null) => {
  if (!asset) return []
  const normalizedSpecs = normalizeSpecificationsForDisplay(asset.specifications)
  if (!normalizedSpecs || typeof normalizedSpecs !== 'object') {
    return []
  }
  return Object.entries(normalizedSpecs)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      const label = asset.specificationLabelMap?.[key] || formatSpecificationLabel(key)
      const formattedValue = Array.isArray(value) ? value.join(', ') : String(value)
      return { label, value: formattedValue }
    })
}

const hasAssetSpecifications = (asset?: AssetSummary | null) => getAssetSpecificationEntries(asset).length > 0

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
    
    // Prepare parameters with proper date formatting
    const params: any = {
      status: selectedStatus.value?.id || undefined,
      type: selectedType.value?.id || undefined,
      search: filters.value.search || undefined,
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.sortOrder,
      page: currentPage.value,
      limit: pageSize.value,
    }
    
    // Add date filters only if BOTH dates are selected and valid
    if (filters.value.dateFrom && filters.value.dateTo) {
      const fromDate = new Date(filters.value.dateFrom)
      const toDate = new Date(filters.value.dateTo)
      
      // Validate dates
      if (toDate >= fromDate) {
        // Format dates as YYYY-MM-DD for backend
        // The DatePicker might return DD-MM-YYYY or YYYY-MM-DD format
        const formatToYYYYMMDD = (dateStr: string) => {
          // If already in YYYY-MM-DD format (has dash at position 4)
          if (dateStr.charAt(4) === '-') {
            return dateStr.split('T')[0] // Just remove time if present
          }
          // If in DD-MM-YYYY format (dash at position 2)
          if (dateStr.charAt(2) === '-') {
            const parts = dateStr.split('-')
            return `${parts[2]}-${parts[1]}-${parts[0]}` // Convert to YYYY-MM-DD
          }
          // Fallback: try to parse and format
          const date = new Date(dateStr)
          if (!Number.isNaN(date.getTime())) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
          }
          return dateStr
        }
          
        params.dateFrom = formatToYYYYMMDD(filters.value.dateFrom)
        params.dateTo = formatToYYYYMMDD(filters.value.dateTo)
      }
    }
    
    console.log('Maintenance History API Call:', { 
      assetId, 
      params,
      rawDates: {
        dateFrom: filters.value.dateFrom,
        dateTo: filters.value.dateTo
      },
      formattedDates: {
        dateFrom: params.dateFrom,
        dateTo: params.dateTo
      }
    })
    const res = await maintenanceService.getMaintenanceEvents(assetId, params)
    console.log('Maintenance History API Response:', res)
    
    assetDetails.value = (res.data as any)?.asset || null

    // Update pagination info
    if (res.data?.pagination) {
      totalPages.value = res.data.pagination.totalPages
      totalRecords.value = res.data.pagination.totalCount
    } else {
      console.warn('No pagination data in response:', res.data)
      totalPages.value = 0
      totalRecords.value = 0
    }
    
    // Transform events to the HistoryItem-like shape expected by the template
    const events = res.data?.events || []
    console.log('Maintenance Events:', events)
    
    history.value = events.map((e: any, idx: number) => ({
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
      performedBy: (e.performedBy || e.performedByName || e.updatedBy || e.updatedByName || e.userDisplayName || null)
    }))
  } catch (error: any) {
    console.error('Error fetching maintenance events:', error)
    console.error('Error details:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    })
    history.value = []
    totalPages.value = 0
    totalRecords.value = 0
  } finally {
    loading.value = false
  }
}

const filteredHistory = computed(() => history.value)

// Pagination info (start, end, total) with 20 per page
const paginationInfo = computed(() => {
  const total = totalRecords.value || 0
  const current = currentPage.value || 1
  const limit = pageSize.value || 20
  const start = total === 0 ? 0 : (current - 1) * limit + 1
  const end = Math.min(current * limit, total)
  return { start, end }
})

// Debounced search and filters
let searchTimeout: number | null = null
let filterTimeout: number | null = null

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    applyFilters()
  }, 500)
}

const debouncedFilter = () => {
  if (filterTimeout) clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    currentPage.value = 1
    applyFilters()
  }, 300)
}

// Watchers for automatic filtering
watch(() => filters.value.search, () => {
  debouncedSearch()
})

const onFromDateChange = (newFromDate: string) => {
  // Clamp future dates
  if (newFromDate && new Date(newFromDate) > new Date(todayIso)) {
    filters.value.dateFrom = todayIso
  }
  // Reset "To" date if it becomes invalid
  if (filters.value.dateTo && new Date(filters.value.dateTo) < new Date(filters.value.dateFrom)) {
    filters.value.dateTo = ''
  }
  // If To date already selected and valid, trigger API
  if (filters.value.dateTo) {
    debouncedFilter()
  }
}

watch(() => filters.value.dateFrom, (newFromDate) => {
  onFromDateChange(newFromDate)
})

const onToDateChange = (newToDate: string) => {
  // Clamp to today if future
  if (newToDate && new Date(newToDate) > new Date(todayIso)) {
    filters.value.dateTo = todayIso
  }
  // Only call API if both dates valid and ordered
  if (filters.value.dateFrom && filters.value.dateTo) {
    const fromDate = new Date(filters.value.dateFrom)
    const toDate = new Date(filters.value.dateTo)
    if (toDate >= fromDate) {
      debouncedFilter()
    }
  }
}

watch(() => filters.value.dateTo, (newToDate) => {
  onToDateChange(newToDate)
})

watch(() => selectedStatus.value, () => {
  debouncedFilter()
})

watch(() => selectedType.value, () => {
  debouncedFilter()
})

watch(
  [
    () => filters.value,
    () => selectedStatus.value,
    () => selectedType.value,
    () => selectedSortBy.value,
    () => currentPage.value,
    () => showFilterDropdown.value
  ],
  () => {
    if (isRestoringViewState) return
    persistViewState()
  },
  { deep: true }
)

onMounted(async () => {
  if (!assetId) return
  restoreViewState()
  try {
    loading.value = true
    await applyFilters()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import '@/assets/styles/pages/maintenance.css';

.maintenance-history-page .card {
  border-radius: 0.75rem;
}

.maintenance-history-page .filter-panel {
  border-radius: 0.75rem !important;
}

.history-timeline .timeline-content {
  background: #fafafa;
}

.asset-summary-card .asset-meta {
  color: var(--primary-mid-gray);
  font-size: 0.95rem;
}

.asset-summary-card .info-item {
  margin-bottom: 0;
}

.asset-specifications {
  border-top: 1px solid #f0f0f0;
  padding-top: 0.75rem;
}

.asset-specifications .spec-header {
  margin-bottom: 0.5rem;
}

.asset-specifications .info-label {
  font-weight: 600;
  color: var(--primary-black);
}

.specifications-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.spec-inline-item {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
}

.spec-inline-label {
  font-weight: 600;
  color: var(--primary-black);
}

.spec-inline-value {
  color: var(--primary-black);
}

.info-item {
  margin-bottom: 0.5rem;
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
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e9ecef;
}
</style>


