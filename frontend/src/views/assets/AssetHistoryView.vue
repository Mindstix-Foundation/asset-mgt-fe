<template>
  <div style="min-height: 100vh;">
    <!-- Main Content -->
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row align-items-center mb-4">
        <!-- Title Section -->
        <div class="col-12 col-sm-12 col-md-6 col-lg-4 mb-3 mb-lg-0">
          <h2 class="mb-0" style="color: var(--primary-black);">Asset History</h2>
        </div>
        
        <!-- Actions Section -->
        <div class="col-12 col-md-6 col-lg-8">
          <div class="d-flex gap-2 justify-content-md-end">
            <button class="btn btn-outline-secondary btn-modern" @click="goBack">
              <i class="fas fa-arrow-left me-1"></i>Back to Assets
            </button>
          </div>
        </div>
      </div>

      <!-- Asset Info -->
      <div v-if="assetInfo" class="mb-3">
          <div class="row align-items-center">
            <div class="col-12 col-md-8">
              <div class="d-flex align-items-center">
                <div 
                  class="rounded-circle d-flex align-items-center justify-content-center me-3" 
                  :style="{ width: '40px', height: '40px', backgroundColor: getAssetIconColor(assetInfo.assetType), flexShrink: 0 }"
                >
                  <i :class="getAssetTypeIcon(assetInfo.assetType)" style="font-size: 1rem; color: white;"></i>
            </div>
                <div>
                  <h5 class="mb-0 fw-bold" style="color: var(--primary-black);">{{ assetInfo.name }}</h5>
                  <p class="text-muted mb-0 small">{{ assetInfo.assetId }} • {{ assetInfo.assetType || 'Asset' }}</p>
            </div>
          </div>
        </div>
            <div class="col-12 col-md-4 text-md-end mt-3 mt-md-0">
              <div class="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
              <span v-if="summary" class="badge badge-count">{{ summary.totalEvents }} Total Events</span>
              <span v-if="summary && summary.totalAssignments > 0" class="badge badge-assigned">{{ summary.totalAssignments }} Assignments</span>
              <span v-if="summary && summary.totalMaintenance > 0" class="badge badge-maintenance">{{ summary.totalMaintenance }} Maintenance</span>
              <span v-if="!summary" class="badge badge-count">{{ timeline.length }} Events</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Asset Events Content -->
     
        
          <!-- Filters -->
           <div class="mb-4">
          <div class="row align-items-end">
            <!-- Search -->
            <div class="col-12 col-lg-7 mb-3">
              <div class="form-label">Search</div>
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="filters.search"
                  placeholder="Description/type/status" 
                  @keyup.enter="applyFilters"
                >
              </div>
            </div>
            <!-- Toggle Filters Button -->
            <div class="col-12 col-lg-2 mb-3">
              <button 
                class="btn btn-outline-secondary btn-modern w-100" 
                @click="showFilters = !showFilters"
                :class="{ active: showFilters }"
              >
                <i class="fas fa-filter me-1"></i>Filters
              </button>
            </div>
          </div>
        

          <!-- Search Stats Bar -->
          <div class="row align-items-center mb-3" v-if="isSearching || (searchQuery && searchStats.totalResults > 0)">
            <div class="col-12">
              <div class="d-flex justify-content-end align-items-center">
                <!-- Search Stats -->
                <div v-if="isSearching" class="text-muted small">
                  <i class="fas fa-spinner fa-spin me-1"></i>Searching...
        </div>
                <div v-else-if="searchQuery && searchStats.totalResults > 0" class="text-muted small">
                  {{ searchStats.totalResults }} results in {{ searchStats.searchTime.toFixed(0) }}ms
            </div>
        </div>
      </div>
    </div>

          <!-- Enhanced Filter Dropdown -->
          <div v-if="showFilters" class="filter-dropdown mb-3 p-3 bg-light rounded">
            <div class="d-flex flex-column flex-md-row gap-2">
              <div class="flex-fill">
                <SearchableDropdown
                  id="event-types-filter"
                  label="Event Types"
                  placeholder="Search event types..."
                  :items="eventTypes"
                  v-model="selectedEventTypes"
                  @change="onEventTypesChange"
                  :search-keys="['name', 'label']"
                />
          </div>
              <div class="flex-fill">
                <DateInput
                  id="date-from-filter"
                  label="Date From"
                  v-model="filters.dateFrom"
                  @change="onDateFromChange"
                />
              </div>
              <div class="flex-fill">
                <DateInput
                  id="date-to-filter"
                  label="Date To"
                  v-model="filters.dateTo"
                  @change="onDateToChange"
                />
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
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary">
              <output class="visually-hidden">Loading...</output>
            </div>
            <p class="mt-2 text-muted">Loading asset events...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="displayTimeline.length === 0" class="text-center py-4">
            <i class="fas fa-history fa-2x text-muted mb-2"></i>
            <h6 class="text-muted">No Events</h6>
            <p class="text-muted small">No asset events found for the selected filters.</p>
          </div>

          <!-- Timeline -->
          <div v-if="displayTimeline.length > 0" class="asset-history-section">
            <h6 class="section-title d-flex align-items-center justify-content-between">
              <span>
                <i class="fas fa-history me-2"></i>
                <span v-if="currentViewMode === 'summary'">Recent Events (Latest 5)</span>
                <span v-else-if="currentViewMode === 'full'">Full History (100 events)</span>
                <span v-else-if="currentViewMode === 'complete'">Complete History (500 events)</span>
                <span v-else>Timeline</span>
              </span>
              <span class="badge bg-primary">{{ displayTimeline.length }} records</span>
            </h6>

            <div class="history-timeline">
              <div 
                v-for="(item, index) in displayTimeline" 
                :key="index + '-' + item.id + '-' + item.type" 
                class="timeline-item" 
                :class="`timeline-${item.type.toLowerCase().replace('_', '-')}`">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <!-- Main Event Header -->
                  <div class="event-header">
                    <div class="event-icon-title">
                      <i :class="item.icon || getEventTypeIcon(item.type)" class="event-icon" :style="{ color: item.color || getEventTypeColor(item.type) }"></i>
                      <h6 class="event-title">{{ getEventTitle(item) }}</h6>
                      </div>
                    <div class="event-date">{{ item.dateIST }}</div>
                      </div>
                      
                  <!-- Event Info Row -->
                  <div class="row justify-content-between align-items-center mb-3">
                    <div class="col-6">
                      <div class="row justify-content-start">
                        <div class="col-6" v-if="item.status">
                          <span :class="getStatusBadgeClass(item.status)" class="text-start" v-html="getStatusDisplayText(item.status)"></span>
                        </div>
                        <div class="col-6" v-if="item.condition">
                          <span :class="getConditionBadgeClass(item.condition)" class="text-start" v-html="getConditionDisplayText(item.condition)"></span>
                        </div>
                      </div>
                        </div>
                    <div class="col-3" v-if="item.userDisplayName">
                      <span class="user-text text-end">{{ item.userDisplayName }}</span>
                      </div>
                    </div>

                  <!-- Combined Description and Details Card -->
                  <div class="event-details-combined" v-if="item.details">
                    <!-- Description as Header (clickable) -->
                    <div class="event-description-header" @click="toggleDetails(index)" style="cursor: pointer;">
                      <h6 class="section-title-compact">
                        <i class="fas fa-info-circle me-2"></i>{{ item.description }}
                      </h6>
                      <i class="fas fa-chevron-down details-chevron" :class="{ 'rotated': expandedItems.includes(index) }"></i>
                    </div>

                    <!-- Details as Body (collapsible) -->
                    <div class="event-details-body" v-show="expandedItems.includes(index)">
                      <!-- Universal Details Display -->
                      <div class="details-simple">
                        <!-- Dynamic Details - All Available Fields -->
                        <div v-for="entry in getDisplayableDetails(item.details)" :key="entry.key" class="detail-line">
                          <span class="detail-label">{{ formatFieldName(entry.key) }} :</span>
                          <span class="detail-value">{{ formatDetailValue(entry.key, entry.value) }}</span>
                    </div>
                    </div>

                      <!-- Changes Section (if available) -->
                      <div v-if="item.details.changes && item.details.changes.length > 0" class="changes-simple">
                        <div class="changes-title">Changes Made ({{ item.details.totalChanges || item.details.changes.length }}) :</div>
                        <div class="changes-list">
                          <div v-for="change in item.details.changes" :key="change.field" class="change-line">
                            <span class="change-label">{{ formatFieldName(change.field) }} :</span>
                            <span class="change-old">{{ change.change.split(' → ')[0] }}</span>
                            <i class="fas fa-arrow-right change-arrow"></i>
                            <span class="change-new">{{ change.change.split(' → ')[1] }}</span>
                      </div>
        </div>
      </div>
                      </div>
      </div>

                  <!-- Description without details (not clickable) -->
                  <div class="event-description-simple" v-else-if="item.description">
                    <h6 class="section-title-compact">
                      <i class="fas fa-info-circle me-2"></i>{{ item.description }}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
      </div>

          <!-- View Full History Button -->
          <div v-if="showViewFullHistoryButton && displayTimeline.length > 0" class="d-flex justify-content-center mt-4">
            <button 
              @click="viewFullHistory" 
              class="btn btn-brown"
              :disabled="loading"
            >
              <i class="fas fa-history me-1" :class="{ 'fa-spin': loading }"></i>
              View Full History
        </button>
      </div>

          <!-- Load More History Button -->
          <div v-if="showLoadMoreHistoryButton" class="d-flex justify-content-center mt-4">
            <button 
              @click="loadMoreHistory" 
              class="btn btn-outline-primary"
              :disabled="loading"
            >
              <i class="fas fa-plus-circle me-1" :class="{ 'fa-spin': loading }"></i>
              Load More History (500 events)
        </button>
      </div>

          <!-- Pagination -->
          <div v-if="pagination && pagination.totalPages > 1" class="d-flex justify-content-between align-items-center mt-3">
            <div class="text-muted small">Page {{ pagination.currentPage }} of {{ pagination.totalPages }} • {{ pagination.totalEvents }} events</div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary btn-sm" :disabled="!pagination.hasPrevious" @click="changePage(pagination.currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="btn btn-outline-secondary btn-sm" :disabled="!pagination.hasNext" @click="changePage(pagination.currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { assetHistoryService } from '@/services/assetHistoryService'
import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
import NotesDisplay from '@/components/common/NotesDisplay.vue'
import DateInput from '@/components/common/DateInput.vue'
import { useAdvancedSearch } from '@/services/advancedSearchService'
import type { AssetHistoryEvent, AssetHistorySummary, AssetHistoryResponse, AssetHistorySummaryResponse } from '@/types/assetHistory.types'

const route = useRoute()
const router = useRouter()
const assetId = ref(String(route.params.id || ''))

const loading = ref(false)
const assetInfo = ref<any>(null)
const summary = ref<AssetHistorySummary | null>(null)
const timeline = ref<AssetHistoryEvent[]>([])
const recentEvents = ref<AssetHistoryEvent[]>([]) // Latest 5 events from summary
const showViewFullHistoryButton = ref(false)
const showLoadMoreHistoryButton = ref(false)
const currentViewMode = ref<'summary' | 'full' | 'complete'>('summary')
const pagination = ref<any>(null)
const showFilters = ref(false)
const expandedItems = ref<number[]>([])

// Date picker refs
const dateFromPicker = ref<HTMLInputElement | null>(null)
const dateToPicker = ref<HTMLInputElement | null>(null)

// Filters (for compatibility with template)
const filters = ref({
  search: '',
  dateFrom: '',
  dateTo: '',
  dateFromDisplay: '',
  dateToDisplay: '',
  eventTypes: [] as any[],
  page: 1,
  limit: 20
})

// Event Types for SearchableDropdown - Updated to match new simplified enum
const eventTypes = ref([
  { id: 'ASSET_CREATED', name: 'Asset Created', label: 'Asset Created' },
  { id: 'ASSET_UPDATED', name: 'Asset Updated', label: 'Asset Updated' },
  { id: 'ASSET_RETIRED', name: 'Asset Retired', label: 'Asset Retired' },
  { id: 'ASSET_REACTIVATED', name: 'Asset Reactivated', label: 'Asset Reactivated' },
  { id: 'ASSET_ISSUED', name: 'Asset Issued', label: 'Asset Issued' },
  { id: 'ASSET_COLLECTED', name: 'Asset Collected', label: 'Asset Collected' },
  { id: 'MAINTENANCE_SCHEDULED', name: 'Maintenance Scheduled', label: 'Maintenance Scheduled' },
  { id: 'MAINTENANCE_UPDATED', name: 'Maintenance Updated', label: 'Maintenance Updated' },
  { id: 'MAINTENANCE_COMPLETED', name: 'Maintenance Completed', label: 'Maintenance Completed' },
  { id: 'MAINTENANCE_CANCELLED', name: 'Maintenance Cancelled', label: 'Maintenance Cancelled' }
])

const selectedEventTypes = ref<any>(null)

// Advanced Search
const { searchQuery, searchResults, isSearching, searchStats } = useAdvancedSearch(() => timeline.value, {
  searchFields: ['type', 'title', 'description', 'details.notes', 'details.reason', 'details.performedBy'],
  fuzzySearch: true,
  highlightMatches: true
})

// Computed
const displayTimeline = computed(() => {
  if (searchQuery.value && searchResults.value.length > 0) {
    return searchResults.value.map((result: any) => result.item || result)
  }
  return filteredTimeline.value
})

// Methods
const goBack = () => router.back()

/**
 * Load asset history summary with latest 5 events
 * This is called on page load
 */
const loadSummary = async () => {
  if (!assetId.value) return
  
  try {
    loading.value = true
    console.log('Loading summary for asset:', assetId.value)
    
    // Build query parameters for filtering
    const queryParams: any = { _t: Date.now() }
    
    // Add event types filter
    if (filters.value.eventTypes.length > 0) {
      queryParams.eventTypes = filters.value.eventTypes.join(',')
    }
    
    // Add date filters (convert dd-mm-yyyy to yyyy-mm-dd)
    if (filters.value.dateFromDisplay) {
      const fromDate = convertDDMMYYYYToDate(filters.value.dateFromDisplay)
      if (fromDate) {
        queryParams.dateFrom = fromDate.toISOString().split('T')[0] // yyyy-mm-dd format
      }
    }
    
    if (filters.value.dateToDisplay) {
      const toDate = convertDDMMYYYYToDate(filters.value.dateToDisplay)
      if (toDate) {
        queryParams.dateTo = toDate.toISOString().split('T')[0] // yyyy-mm-dd format
      }
    }
    
    // Add search filter
    if (filters.value.search) {
      queryParams.search = filters.value.search
    }
    
    const response = await assetHistoryService.getAssetHistorySummary(assetId.value, queryParams) as AssetHistorySummaryResponse
    
    if (response) {
      // New flat structure: response.asset, response.summary, response.recentEvents, etc.
      assetInfo.value = response.asset
      summary.value = response.summary
      recentEvents.value = response.recentEvents || []
      
      console.log('Summary loaded:', { 
        assetInfo: response.asset, 
        summary: response.summary,
        recentEventsCount: response.recentEvents?.length || 0
      })
      
      // Set initial timeline to recent events
      timeline.value = recentEvents.value
      currentViewMode.value = 'summary'
      
      // Show "View Full History" button if there are more than 5 events
      showViewFullHistoryButton.value = (response.summary?.totalEvents || 0) > 5
    }
  } catch (error) {
    console.error('Error loading asset history summary:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Load first 100 events (View Full History button)
 */
const viewFullHistory = async () => {
  if (!assetId.value) return
  
  try {
    loading.value = true
    console.log('Loading full history (100 events) for asset:', assetId.value)
    
    // Build query parameters for filtering
    const queryParams: any = {
      page: 1,
      limit: 100,
      _t: Date.now()
    }
    
    // Add event types filter
    if (filters.value.eventTypes.length > 0) {
      queryParams.eventTypes = filters.value.eventTypes.join(',')
    }
    
    // Add date filters (convert dd-mm-yyyy to yyyy-mm-dd)
    if (filters.value.dateFromDisplay) {
      const fromDate = convertDDMMYYYYToDate(filters.value.dateFromDisplay)
      if (fromDate) {
        queryParams.dateFrom = fromDate.toISOString().split('T')[0] // yyyy-mm-dd format
      }
    }
    
    if (filters.value.dateToDisplay) {
      const toDate = convertDDMMYYYYToDate(filters.value.dateToDisplay)
      if (toDate) {
        queryParams.dateTo = toDate.toISOString().split('T')[0] // yyyy-mm-dd format
      }
    }
    
    // Add search filter
    if (filters.value.search) {
      queryParams.search = filters.value.search
    }
    
    const response = await assetHistoryService.getAssetHistory(assetId.value, queryParams) as AssetHistoryResponse
    
    if (response) {
      // New flat structure: response.timeline, response.pagination, etc.
      timeline.value = response.timeline || []
      pagination.value = response.pagination
      currentViewMode.value = 'full'
      
      console.log('Full history loaded:', { 
        timelineLength: response.timeline?.length || 0,
        totalEvents: response.pagination?.totalEvents || 0
      })
      
      // Hide "View Full History" button
      showViewFullHistoryButton.value = false
      
      // Show "Load More History" button if there are more than 100 events
      const totalEvents = response.pagination?.totalEvents || 0
      showLoadMoreHistoryButton.value = totalEvents > 100
    }
  } catch (error) {
    console.error('Error loading full history:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Load up to 500 events (Load More History button)
 */
const loadMoreHistory = async () => {
  if (!assetId.value) return
  
  try {
    loading.value = true
    console.log('Loading complete history (500 events) for asset:', assetId.value)
    
    // Build query parameters for filtering
    const queryParams: any = {
      page: 1,
      limit: 500,
      _t: Date.now()
    }
    
    // Add event types filter
    if (filters.value.eventTypes.length > 0) {
      queryParams.eventTypes = filters.value.eventTypes.join(',')
    }
    
    // Add date filters (convert dd-mm-yyyy to yyyy-mm-dd)
    if (filters.value.dateFromDisplay) {
      const fromDate = convertDDMMYYYYToDate(filters.value.dateFromDisplay)
      if (fromDate) {
        queryParams.dateFrom = fromDate.toISOString().split('T')[0] // yyyy-mm-dd format
      }
    }
    
    if (filters.value.dateToDisplay) {
      const toDate = convertDDMMYYYYToDate(filters.value.dateToDisplay)
      if (toDate) {
        queryParams.dateTo = toDate.toISOString().split('T')[0] // yyyy-mm-dd format
      }
    }
    
    // Add search filter
    if (filters.value.search) {
      queryParams.search = filters.value.search
    }
    
    const response = await assetHistoryService.getAssetHistory(assetId.value, queryParams) as AssetHistoryResponse
    
    if (response) {
      // New flat structure: response.timeline, response.pagination, etc.
      timeline.value = response.timeline || []
      pagination.value = response.pagination
      currentViewMode.value = 'complete'
      
      console.log('Complete history loaded:', { 
        timelineLength: response.timeline?.length || 0,
        totalEvents: response.pagination?.totalEvents || 0
      })
      
      // Hide "Load More History" button
      showLoadMoreHistoryButton.value = false
    }
  } catch (error) {
    console.error('Error loading complete history:', error)
  } finally {
    loading.value = false
  }
}


// Utility functions
const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  } catch (error) {
    return dateString
  }
}

const getEventTypeColor = (eventType: string): string => {
  const colors: Record<string, string> = {
    'ASSET_CREATED': 'var(--mindstix-success)',
    'ASSET_UPDATED': 'var(--mindstix-primary)',
    'ASSET_RETIRED': 'var(--mindstix-danger)',
    'ASSET_REACTIVATED': 'var(--mindstix-success)',
    'ASSET_ISSUED': 'var(--mindstix-primary)',
    'ASSET_COLLECTED': 'var(--mindstix-warning)',
    'MAINTENANCE_SCHEDULED': 'var(--mindstix-warning)',
    'MAINTENANCE_UPDATED': 'var(--mindstix-primary)',
    'MAINTENANCE_COMPLETED': 'var(--mindstix-success)',
    'MAINTENANCE_CANCELLED': 'var(--mindstix-danger)'
  }
  return colors[eventType] || 'var(--mindstix-secondary)'
}

const getEventTypeIcon = (eventType: string): string => {
  const icons: Record<string, string> = {
    'ASSET_CREATED': 'fas fa-plus-circle',
    'ASSET_UPDATED': 'fas fa-edit',
    'ASSET_RETIRED': 'fas fa-ban',
    'ASSET_REACTIVATED': 'fas fa-redo',
    'ASSET_ISSUED': 'fas fa-user-plus',
    'ASSET_COLLECTED': 'fas fa-user-minus',
    'MAINTENANCE_SCHEDULED': 'fas fa-calendar-plus',
    'MAINTENANCE_UPDATED': 'fas fa-edit',
    'MAINTENANCE_COMPLETED': 'fas fa-check-circle',
    'MAINTENANCE_CANCELLED': 'fas fa-times-circle'
  }
  return icons[eventType] || 'fas fa-circle'
}

const getEventTypeLabel = (eventType: string): string => {
  const labels: Record<string, string> = {
    'ASSET_CREATED': 'Asset Created',
    'ASSET_UPDATED': 'Asset Updated',
    'ASSET_RETIRED': 'Asset Retired',
    'ASSET_REACTIVATED': 'Asset Reactivated',
    'ASSET_ISSUED': 'Asset Issued',
    'ASSET_COLLECTED': 'Asset Collected',
    'MAINTENANCE_SCHEDULED': 'Maintenance Scheduled',
    'MAINTENANCE_UPDATED': 'Maintenance Updated',
    'MAINTENANCE_COMPLETED': 'Maintenance Completed',
    'MAINTENANCE_CANCELLED': 'Maintenance Cancelled'
  }
  return labels[eventType] || eventType
}

const getEventTypeBadgeClass = (eventType: string): string => {
  const classes: Record<string, string> = {
    'ASSET_CREATED': 'badge-success',
    'ASSET_UPDATED': 'badge-info',
    'ASSET_RETIRED': 'badge-danger',
    'ASSET_REACTIVATED': 'badge-success',
    'ASSET_ISSUED': 'badge-primary',
    'ASSET_COLLECTED': 'badge-warning',
    'MAINTENANCE_SCHEDULED': 'badge-warning',
    'MAINTENANCE_UPDATED': 'badge-info',
    'MAINTENANCE_COMPLETED': 'badge-success',
    'MAINTENANCE_CANCELLED': 'badge-danger'
  }
  return classes[eventType] || 'badge-secondary'
}

const getAssetIconColor = (assetType?: string): string => {
  const colors: Record<string, string> = {
    'Laptop': 'var(--secondary-purple)',
    'Desktop': 'var(--secondary-blue)',
    'Monitor': 'var(--secondary-green)',
    'Phone': 'var(--secondary-orange)',
    'Tablet': 'var(--secondary-pink)',
    'Other': 'var(--secondary-gray)'
  }
  const type = normalizeAssetType(assetType || '')
  return colors[type] || colors['Other']
}

const getAssetTypeIcon = (assetType?: string): string => {
  const icons: Record<string, string> = {
    'Laptop': 'fas fa-laptop',
    'Desktop': 'fas fa-desktop',
    'Monitor': 'fas fa-tv',
    'Phone': 'fas fa-mobile-alt',
    'Tablet': 'fas fa-tablet-alt',
    'Other': 'fas fa-box-open'
  }
  const type = normalizeAssetType(assetType || '')
  return icons[type] || icons['Other']
}

const normalizeAssetType = (assetType: string): string => {
  if (!assetType || typeof assetType !== 'string') return 'Other'
  const v = assetType.trim().toLowerCase()
  if (['laptop', 'notebook', 'macbook'].includes(v)) return 'Laptop'
  if (['desktop', 'pc', 'workstation'].includes(v)) return 'Desktop'
  if (['monitor', 'display', 'screen'].includes(v)) return 'Monitor'
  if (['phone', 'mobile', 'smartphone', 'cellphone'].includes(v)) return 'Phone'
  if (['tablet', 'ipad'].includes(v)) return 'Tablet'
  return 'Other'
}

const getConditionBadgeClass = (condition: string): string => {
  // Handle condition transitions (e.g., "NEW → GOOD")
  // Use the color of the final condition
  const finalCondition = condition.includes(' → ') ? condition.split(' → ')[1] : condition
  
  const classes: Record<string, string> = {
    'NEW': 'badge badge-condition-new',
    'GOOD': 'badge badge-condition-good',
    'FAIR': 'badge badge-condition-fair',
    'POOR': 'badge badge-condition-poor',
    'DAMAGED': 'badge badge-condition-damaged',
    'REFURBISHED': 'badge badge-condition-refurbished'
  }
  return classes[finalCondition] || 'badge badge-condition-poor'
}

const getStatusBadgeClass = (status: string): string => {
  // Handle status transitions (e.g., "AVAILABLE → IN_MAINTENANCE")
  // Use the color of the final status
  const finalStatus = status.includes(' → ') ? status.split(' → ')[1] : status
  
  const classes: Record<string, string> = {
    'AVAILABLE': 'badge badge-available',
    'ASSIGNED': 'badge badge-assigned', 
    'IN_MAINTENANCE': 'badge badge-under-repair',
    'RETIRED': 'badge badge-retired',
    'LOST': 'badge badge-lost'
  }
  return classes[finalStatus] || 'badge badge-retired'
}

const getStatusDisplayText = (status: string): string => {
  // Replace → with Font Awesome arrow icon
  return status.replace(' → ', ' <i class="fas fa-arrow-right"></i> ')
}

const getConditionDisplayText = (condition: string): string => {
  // Replace → with Font Awesome arrow icon
  return condition.replace(' → ', ' <i class="fas fa-arrow-right"></i> ')
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  } catch (error) {
    return dateString
  }
}

// Date validation and conversion functions
const validateDateFormat = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  // Basic format validation (dd-mm-yyyy)
  const dateRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/
  if (value && !dateRegex.test(value)) {
    input.classList.add('is-invalid')
    return false
  } else {
    input.classList.remove('is-invalid')
    return true
  }
}

const convertDDMMYYYYToDate = (dateString: string): Date | null => {
  if (!dateString) return null
  
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  
  const day = Number.parseInt(parts[0], 10)
  const month = Number.parseInt(parts[1], 10) - 1 // JavaScript months are 0-indexed
  const year = Number.parseInt(parts[2], 10)
  
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null
  
  const date = new Date(year, month, day)
  
  // Validate the date is valid
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null
  }
  
  return date
}

const convertDateToDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Date picker methods
const showDatePicker = (type: 'from' | 'to') => {
  if (type === 'from' && dateFromPicker.value) {
    dateFromPicker.value.showPicker()
  } else if (type === 'to' && dateToPicker.value) {
    dateToPicker.value.showPicker()
  }
}

const onDateFromChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value) {
    const date = new Date(input.value)
    filters.value.dateFromDisplay = convertDateToDDMMYYYY(date)
    applyFilters()
  } else {
    filters.value.dateFromDisplay = ''
    applyFilters()
  }
}

const onDateToChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value) {
    const date = new Date(input.value)
    filters.value.dateToDisplay = convertDateToDDMMYYYY(date)
    applyFilters()
  } else {
    filters.value.dateToDisplay = ''
    applyFilters()
  }
}

const formatCurrency = (amount: number | string): string => {
  try {
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  } catch (error) {
    return amount.toString()
  }
}

const formatFieldName = (fieldName: string): string => {
  const fieldMap: Record<string, string> = {
    'maintenanceType': 'Maintenance Type',
    'scheduledDate': 'Scheduled Date',
    'estimatedCost': 'Estimated Cost',
    'actualCost': 'Actual Cost',
    'description': 'Description',
    'frequencyDays': 'Frequency (Days)',
    'status': 'Status',
    'condition': 'Condition',
    'purchaseCost': 'Purchase Cost',
    'vendor': 'Vendor',
    'serialNumber': 'Serial Number',
    'location': 'Location',
    'notes': 'Notes',
    'assetId': 'Asset ID',
    'assetType': 'Asset Type',
    'brand': 'Brand',
    'model': 'Model',
    'purchaseDate': 'Purchase Date',
    'warrantyStartDate': 'Warranty Start',
    'warrantyEndDate': 'Warranty End',
    'employee': 'Employee',
    'employeeId': 'Employee ID',
    'employeeEmail': 'Email',
    'issuedBy': 'Issued By',
    'collectedBy': 'Collected By',
    'issueDate': 'Issue Date',
    'returnDate': 'Return Date',
    'issueCondition': 'Issue Condition',
    'issueReason': 'Issue Reason',
    'returnReason': 'Return Reason',
    'retirementDate': 'Retirement Date',
    'retirementReason': 'Retirement Reason',
    'retirementNotes': 'Retirement Notes',
    'reactivationDate': 'Reactivation Date',
    'reactivationReason': 'Reactivation Reason',
    'previousLocation': 'Previous Location',
    'newLocation': 'New Location',
    'actualCompletionDate': 'Completed Date',
    'cancellationDate': 'Cancelled Date',
    'completionNotes': 'Completion Notes',
    'cancellationNotes': 'Cancellation Notes'
  }
  return fieldMap[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

const shouldDisplayDetail = (key: string, value: any): boolean => {
  // Don't display these fields as they're handled separately
  const excludeFields = ['changes', 'totalChanges', 'updatedVia', 'scheduledVia', 'retiredVia', 'reactivatedVia', 'issuedVia', 'collectedVia']
  
  // Don't display null, undefined, or empty values
  if (value === null || value === undefined || value === '') {
    return false
  }
  
  // Don't display excluded fields
  if (excludeFields.includes(key)) {
    return false
  }
  
  return true
}

const formatDetailValue = (key: string, value: any): string => {
  // Format dates
  if (key.includes('Date') || key.includes('date')) {
    return formatDate(value)
  }
  
  // Format currency
  if (key.includes('Cost') || key.includes('cost')) {
    return `₹${formatCurrency(value)}`
  }
  
  // Return as string
  return String(value)
}

const getDisplayableDetails = (details: any): Array<{key: string, value: any}> => {
  if (!details || typeof details !== 'object') {
    return []
  }
  
  // If there's a changes array, exclude fields that are shown in changes to avoid duplication
  let additionalExcludes: string[] = []
  if (details.changes && Array.isArray(details.changes) && details.changes.length > 0) {
    // Get all field names from the changes array
    additionalExcludes = details.changes.map((change: any) => change.fieldName || change.field)
  }
  
  return Object.entries(details)
    .filter(([key, value]) => {
      // Don't show fields that are in the changes array
      if (additionalExcludes.includes(key)) {
        return false
      }
      return shouldDisplayDetail(key, value)
    })
    .map(([key, value]) => ({ key, value }))
}

// Since we're now doing server-side filtering, we can use the timeline directly
const filteredTimeline = computed(() => {
  return timeline.value
})

// Filter functions (for compatibility with template)
const onEventTypesChange = (item: any) => {
  selectedEventTypes.value = item
  if (item) {
    filters.value.eventTypes = [item.id]
  } else {
    filters.value.eventTypes = []
  }
  showViewFullHistoryButton.value = true
  applyFilters()
}

const applyFilters = () => {
  filters.value.page = 1
  
  // Reload data based on current view mode with filters applied
  if (currentViewMode.value === 'summary') {
    loadSummary()
  } else if (currentViewMode.value === 'full') {
    viewFullHistory()
  } else if (currentViewMode.value === 'complete') {
    loadMoreHistory()
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    dateFrom: '',
    dateTo: '',
    dateFromDisplay: '',
    dateToDisplay: '',
    eventTypes: [] as any[],
    page: 1,
    limit: 20
  }
  selectedEventTypes.value = null
  showViewFullHistoryButton.value = true
  // Clear any validation classes
  const dateInputs = document.querySelectorAll('.form-control[placeholder="dd-mm-yyyy"]')
  dateInputs.forEach(input => input.classList.remove('is-invalid'))
}

const getEventTitle = (item: AssetHistoryEvent): string => {
  // Since we removed the title field from the API, generate it from the type
  return item.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const changePage = (page: number) => {
  filters.value.page = page
  // For now, just reload summary since we're not using pagination
  loadSummary()
}

const toggleDetails = (index: number) => {
  const expandedIndex = expandedItems.value.indexOf(index)
  if (expandedIndex > -1) {
    expandedItems.value.splice(expandedIndex, 1)
  } else {
    expandedItems.value.push(index)
  }
}

// Watchers
watch(() => route.params.id, async () => {
  if (route.params.id) {
    await loadSummary()
  }
})

// Lifecycle
onMounted(async () => {
  if (assetId.value) {
    await loadSummary()
  }
})
</script>

<style scoped>
/* Asset History Section - Matching MaintenanceHistoryView */
.asset-history-section {
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  padding: 1rem !important;
  margin-bottom: 1rem !important;
}

.section-title {
  color: var(--primary-black) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.75rem !important;
  padding-bottom: 0.5rem !important;
  border-bottom: 1px solid var(--element-gray) !important;
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

/* Timeline marker colors based on event type */
.timeline-asset-created .timeline-marker { background: var(--mindstix-success); }
.timeline-asset-updated .timeline-marker { background: var(--mindstix-primary); }
.timeline-asset-retired .timeline-marker { background: var(--mindstix-danger); }
.timeline-asset-reactivated .timeline-marker { background: var(--mindstix-success); }
.timeline-asset-issued .timeline-marker { background: var(--mindstix-primary); }
.timeline-asset-collected .timeline-marker { background: var(--mindstix-warning); }
.timeline-maintenance-scheduled .timeline-marker { background: var(--mindstix-warning); }
.timeline-maintenance-updated .timeline-marker { background: var(--mindstix-primary); }
.timeline-maintenance-completed .timeline-marker { background: var(--mindstix-success); }
.timeline-maintenance-cancelled .timeline-marker { background: var(--mindstix-danger); }

.timeline-content { 
  background: #fafafa; 
  border: 1px solid #e9ecef; 
  border-radius: 0.5rem;
  padding: 0.75rem; 
}

/* Event Header */
.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.event-icon-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.event-icon {
  font-size: 1.25rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-title {
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600; 
  margin: 0; 
}

.event-date {
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: 'Courier New', monospace;
}

/* Event Info Row - Bootstrap Grid */
.status-text, .condition-text, .user-text {
  font-size: 0.8rem;
  font-weight: 500;
  color: #495057;
  display: block;
}

.status-text {
  color: var(--mindstix-primary);
}

.condition-text {
  color: var(--mindstix-success);
}

.user-text {
  color: var(--primary-mid-gray);
}

/* Event Description Row - Clickable Heading Style */
.event-description-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 2px solid #dee2e6;
}

.event-description-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 0.25rem;
}

.event-description {
  flex: 1;
}

.description-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
  line-height: 1.4;
}

/* Details Toggle - Matching AssetsView Modal Design */
.details-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.details-toggle:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.details-chevron {
  transition: transform 0.3s ease;
  font-size: 1.1rem;
  color: #666666;
  cursor: pointer;
  padding: 0.2rem;
}

.details-chevron.rotated {
  transform: rotate(180deg);
}

/* Details Section - Compact Design */
/* Combined Event Details Card */
.event-details-combined {
  border-radius: 0.5rem;
  background-color: #fafafa;
  margin-top: 0.5rem;
}

.event-description-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 2px solid #dee2e6;
  margin-bottom: 0.5rem;
}

.event-description-header .section-title-compact {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0 !important;
  flex-grow: 1;
}

.event-details-body {
  transition: all 0.3s ease;
  overflow: hidden;
}

.event-description-simple {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
  margin-top: 0.5rem;
}

.event-description-simple .section-title-compact {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0 !important;
}

.timeline-meta { 
  display: flex; 
  gap: 0.5rem; 
  margin-top: 0.4rem; 
}

.timeline-meta .badge { 
  font-size: 0.7rem; 
  padding: 0.25rem 0.5rem; 
  border-radius: 0.375rem; 
  font-weight: 500; 
}

/* Badge colors using palette */
.badge-asset-created { background-color: var(--mindstix-success) !important; color: white !important; }
.badge-asset-updated { background-color: var(--mindstix-primary) !important; color: white !important; }
.badge-asset-retired { background-color: var(--mindstix-danger) !important; color: white !important; }
.badge-asset-reactivated { background-color: var(--mindstix-success) !important; color: white !important; }
.badge-asset-issued { background-color: var(--mindstix-primary) !important; color: white !important; }
.badge-asset-collected { background-color: var(--mindstix-warning) !important; color: white !important; }
.badge-maintenance-scheduled { background-color: var(--mindstix-warning) !important; color: white !important; }
.badge-maintenance-updated { background-color: var(--mindstix-primary) !important; color: white !important; }
.badge-maintenance-completed { background-color: var(--mindstix-success) !important; color: white !important; }
.badge-maintenance-cancelled { background-color: var(--mindstix-danger) !important; color: white !important; }

.badge-type-event { 
  background-color: var(--primary-mid-gray) !important; 
  color: white !important; 
}

.timeline-details { 
  margin-top: 0.5rem; 
  font-size: 0.85rem; 
}

.timeline-details.compact { 
  margin-top: 0.4rem; 
}

.timeline-details .text-muted { 
  font-size: 0.72rem; 
  text-transform: uppercase; 
  letter-spacing: 0.025em; 
  font-weight: 500; 
}

/* Enhanced Change Details Styles */
.change-details {
  background-color: var(--primary-light-gray);
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.change-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.change-label {
  font-weight: 600;
  color: var(--primary-black);
}

.change-values {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.old-value {
  background-color: var(--secondary-red);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.new-value {
  background-color: var(--secondary-green);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Grouped Changes Styles */
.grouped-changes {
  background-color: var(--primary-light-gray);
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.change-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.5rem;
  background-color: var(--primary-white);
  border: 1px solid var(--element-gray);
  border-radius: 0.25rem;
}

.change-item:last-child {
  margin-bottom: 0;
}

.change-item .change-label {
  font-weight: 600;
  color: var(--primary-black);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.change-item .change-values {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.change-item .old-value {
  background-color: var(--secondary-red);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.change-item .new-value {
  background-color: var(--secondary-green);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}


.user-info {
  background-color: var(--primary-light-gray);
  border-left: 3px solid var(--secondary-purple);
  padding: 0.75rem;
  border-radius: 0.25rem;
}

.user-details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.timestamp {
  background-color: var(--primary-light-gray);
  border-left: 3px solid var(--primary-mid-gray);
  padding: 0.75rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

/* Timeline Timestamp Styles */
.timeline-timestamp {
  flex-shrink: 0;
  text-align: right;
  min-width: 140px;
}

.timestamp-main {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.timestamp-ist-main {
  font-weight: 600;
  color: var(--primary-black);
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
}

.timestamp-utc-main {
  font-size: 0.75rem;
  color: var(--primary-mid-gray);
  font-family: 'Courier New', monospace;
}

.timestamp-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timestamp-ist {
  font-weight: 600;
  color: var(--primary-black);
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
}

.timestamp-utc {
  font-size: 0.75rem;
  color: var(--primary-mid-gray);
  font-family: 'Courier New', monospace;
}


/* Badge Styles - Using Palette Colors */
.badge-count {
  background-color: var(--mindstix-primary) !important;
  color: white !important;
  border: 2px solid var(--mindstix-primary) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge-assigned {
  background-color: var(--mindstix-success) !important;
  color: white !important;
  border: 2px solid var(--mindstix-success) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge-maintenance {
  background-color: var(--mindstix-warning) !important;
  color: white !important;
  border: 2px solid var(--mindstix-warning) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.bg-primary {
  background-color: var(--mindstix-primary) !important;
  color: white !important;
  border: 2px solid var(--mindstix-primary) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

/* Details Grid - Compact Design */
.details-grid {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-bottom: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0;
  min-width: 140px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #212529;
  margin-bottom: 0;
  text-align: right;
  flex-grow: 1;
  word-break: break-word;
}

/* Simple Details Layout */
.details-simple {

  padding: 1rem 1rem 0 1rem;
}

.detail-line {
  margin-bottom: 0.1rem;
  font-size: 0.85rem;
  color: #000000;
}

.detail-line .detail-label {
  font-weight: 600;
  color: #000000;
  margin-right: 0.5rem;
}

.detail-line .detail-value {
  font-weight: 500;
  color: #000000;
}

/* Simple Changes Layout */
.changes-simple {

  padding: 0 1rem 1rem 1rem;
}

.changes-simple .changes-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.25rem;
}

.changes-list {
  margin-left: 1rem;
}

.change-line {
  margin-bottom: 0.1rem;
  font-size: 0.85rem;
  color: #000000;
}

.change-line .change-label {
  font-weight: 600;
  color: #000000;
  margin-right: 0.5rem;
}

.change-line .change-old {
  color: #000000;
  margin-right: 0.25rem;
}

.change-line .change-arrow {
  color: #000000;
  margin: 0 0.25rem;
  font-weight: 600;
  font-size: 0.8rem;
}

.change-line .change-new {
  color: #000000;
}

.detail-description, .detail-notes {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

/* Minimal Changes Section - All Text Black */
.changes-minimal {
  margin-top: 0.25rem;
}

.changes-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.1rem;
}

.changes-inline {
  font-size: 0.8rem;
  line-height: 1.4;
}

.change-inline {
  display: inline;
  margin-right: 0.75rem;
}

.change-inline strong {
  color: #000000;
  text-transform: capitalize;
  margin-right: 0.25rem;
}

.change-old {
  color: #000000;
  font-weight: 500;
  margin: 0 0.25rem;
}

.change-new {
  color: #000000;
  font-weight: 500;
  margin-left: 0.25rem;
}

.change-inline i {
  color: #000000;
  font-size: 0.7rem;
  margin: 0 0.25rem;
}

.change-separator {
  color: #000000;
  margin: 0 0.5rem;
  font-weight: bold;
}

.badge-duration {
  background-color: var(--primary-mid-gray) !important;
  color: white !important;
}

.badge-primary {
  background-color: var(--secondary-purple) !important;
  color: white !important;
}

.badge-success {
  background-color: var(--secondary-green) !important;
  color: white !important;
  font-weight: 700 !important;
}

.badge-info {
  background-color: var(--secondary-purple) !important;
  color: white !important;
  font-weight: 700 !important;
}

.badge-warning {
  background-color: var(--secondary-orange) !important;
  color: white !important;
  font-weight: 700 !important;
}

.badge-danger {
  background-color: var(--secondary-red) !important;
  color: white !important;
  font-weight: 700 !important;
}

.badge-secondary {
  background-color: var(--primary-mid-gray) !important;
  color: white !important;
  font-weight: 700 !important;
}

/* Arrow icons within badges */
.badge i.fas.fa-arrow-right {
  font-size: 0.6rem;
  margin: 0 0.25rem;
  color: inherit;
}

/* Status Badge Colors - Matching AssetsView.vue */
.badge.badge-available {
  background-color: var(--secondary-green) !important;
  color: white !important;
  border: 2px solid var(--secondary-green) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-assigned {
  background-color: var(--secondary-purple) !important;
  color: white !important;
  border: 2px solid var(--secondary-purple) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-under-repair {
  background-color: var(--secondary-orange) !important;
  color: white !important;
  border: 2px solid var(--secondary-orange) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-retired {
  background-color: var(--secondary-brown) !important;
  color: white !important;
  border: 2px solid var(--secondary-brown) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-lost {
  background-color: var(--secondary-red) !important;
  color: white !important;
  border: 2px solid var(--secondary-red) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

/* Condition Badge Colors - Using Specified Palette Colors */
.badge.badge-condition-new {
  background-color: var(--primary-white) !important;
  color: var(--primary-black) !important;
  border: 2px solid var(--primary-black) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-condition-good {
  background-color: var(--primary-light-gray) !important;
  color: var(--primary-black) !important;
  border: 2px solid var(--primary-black) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-condition-fair {
  background-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
  border: 2px solid var(--primary-black) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-condition-poor {
  background-color: var(--primary-mid-gray) !important;
  color: white !important;
  border: 2px solid var(--primary-black) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-condition-damaged {
  background-color: var(--primary-dark-gray) !important;
  color: white !important;
  border: 2px solid var(--primary-black) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-condition-refurbished {
  background-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
  border: 2px solid var(--primary-black) !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

/* Filter dropdown styling - Using Palette Colors */
.filter-dropdown { 
  border: 1px solid var(--element-gray); 
  background-color: var(--primary-light-gray) !important; 
}

.btn.active { 
  background-color: var(--secondary-purple); 
  color: #fff; 
}

.filter-clear-button-container { 
  flex-shrink: 0; 
  min-width: 120px; 
}

.filter-clear-btn { 
  width: 100%; 
  min-width: 120px; 
  border-radius: 0.375rem !important;
}

@media (max-width: 767.98px) { 
  .filter-clear-button-container { 
    width: 100%; 
    min-width: unset; 
  } 
  .filter-clear-btn { 
    width: 100%;
    min-width: unset; 
  } 
}

@media (min-width: 768px) and (max-width: 991.98px) { 
  .filter-clear-button-container { 
    min-width: 140px; 
  } 
  .filter-clear-btn { 
    min-width: 140px; 
  }
}

/* Date Input Validation */
.form-control.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-control[placeholder="dd-mm-yyyy"] {
  font-family: monospace;
}

/* Date Input Container */
.date-input-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.date-display {
  font-family: monospace;
  cursor: pointer;
  background-color: white;
  border-radius: 0.375rem !important;
}

.date-picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: -1;
  border-radius: 0.375rem !important;
  pointer-events: none;
}

.date-icon {
  position: absolute;
  right: 10px;
  color: #6c757d;
  cursor: pointer;
  z-index: 1;
  pointer-events: none;
}

.date-input-container:hover .date-icon {
  color: #495057;
}

/* Form Controls - Match SearchableDropdown border radius */
.form-control {
  border-radius: 0.375rem !important;
}

/* Buttons - Match SearchableDropdown border radius */
.btn-modern {
  border-radius: 0.375rem !important;
}


/* Search Input Group Styling */
.input-group {
  border-radius: 0.375rem !important;
  overflow: hidden;
}

.input-group-text {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-right: none;
  color: #6c757d;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem 0 0 0.375rem !important;
}

.input-group .form-control {
  border-left: none;
  border-radius: 0 0.375rem 0.375rem 0 !important;
}

.input-group .form-control:focus {
  border-color: #ced4da !important;
  box-shadow: none !important;
  background-color: white !important;
}

.input-group .form-control:focus + .input-group-text,
.input-group .form-control:focus ~ .input-group-text {
  border-color: #ced4da !important;
}

/* Override any global focus styles for input group */
.input-group .form-control:focus,
.input-group .form-control:valid:focus,
.input-group .form-control:invalid:focus {
  border-color: #ced4da !important;
  box-shadow: none !important;
  background-color: white !important;
}

/* Responsive styles */
@media (max-width: 767.98px) {
  .event-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .event-date {
    font-size: 0.8rem;
  }
  
  /* Mobile: Stack status/condition vertically */
  .row.justify-content-between .col-4 .row .col-6 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 0.25rem;
  }
  
  .row.justify-content-between .col-3 {
    flex: 0 0 100%;
    max-width: 100%;
    text-align: left !important;
    margin-top: 0.5rem;
  }
  
  .event-description-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .details-toggle {
    align-self: flex-end;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .changes-inline {
    font-size: 0.75rem;
  }
  
  .change-inline {
    display: block;
    margin-bottom: 0.25rem;
    margin-right: 0;
  }
  
  .timeline-content {
    padding: 0.75rem;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .details-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>
