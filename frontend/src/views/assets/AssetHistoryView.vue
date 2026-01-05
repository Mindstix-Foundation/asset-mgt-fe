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
            <button class="btn btn-gray" @click="goBack">
              <i class="fas fa-arrow-left me-1"></i>Back to Assets
            </button>
          </div>
        </div>
      </div>

      <!-- Asset Info -->
      <div v-if="assetInfo" class="mb-3">
          <div class="row align-items-center mb-4">
            <div class="col-12 col-md-8">
              <div class="d-flex align-items-center">
                <div>
                  <h5 class="mb-0 fw-bold" style="color: var(--primary-black);">{{ assetInfo.name }}</h5>
                  <p class="text-muted mb-0 small">{{ assetInfo.assetId }} • {{ assetInfo.assetType || 'Asset' }}</p>
            </div>
          </div>
        </div>
            <div class="col-12 col-md-4 text-md-end mt-3 mt-md-0">
              <div class="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                <!-- Total Events Badge - Pink -->
                <span v-if="summary" class="badge badge-pink">{{ summary.totalEvents }} Total Events</span>
                <span v-if="!summary" class="badge badge-pink">{{ timeline.length }} Events</span>
                
                <!-- Current Status Badge - Same colors as AssetsView.vue -->
                <span v-if="summary" :class="getStatusBadgeClass(summary.currentStatus)">{{ getStatusText(summary.currentStatus) }}</span>
                
                <!-- Current Condition - Gray badge -->
                <span v-if="summary" class="badge badge-gray">{{ getConditionText(summary.currentCondition) }}</span>
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
              <div class="search-input-container">
                <i class="fas fa-search search-icon"></i>
                <input 
                  type="text" 
                  class="form-control search-input" 
                  v-model="filters.search"
                  placeholder="Description/type/status" 
                  @keyup.enter="applyFilters"
                >
              </div>
            </div>
            <!-- Toggle Filters Button -->
            <div class="col-12 col-lg-2 mb-3">
              <button 
                class="btn btn-gray w-100" 
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
          <div v-if="showFilters" class="mb-3 border rounded p-3 shadow-sm bg-white">
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
                <DatePicker
                  id="date-from-filter"
                  label="Date From"
                  v-model="filters.dateFrom"
                  @change="onDateFromChange"
                  css-class="date-picker-filter"
                />
              </div>
              <div class="flex-fill">
                <DatePicker
                  id="date-to-filter"
                  label="Date To"
                  v-model="filters.dateTo"
                  @change="onDateToChange"
                  css-class="date-picker-filter"
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
              <span class="badge badge-brown">{{ displayTimeline.length }} records</span>
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
              class="btn btn-brown"
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
import { assetHistoryService } from '@/services/api/assetHistoryService'
import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
import DatePicker from '@/components/ui/date/DatePicker.vue'
import { useAdvancedSearch } from '@/composables/useAdvancedSearch'
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
    console.warn('Error formatting date time:', error)
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
    'ASSET_CREATED': 'badge badge-green',
    'ASSET_UPDATED': 'badge badge-blue',
    'ASSET_RETIRED': 'badge badge-red',
    'ASSET_REACTIVATED': 'badge badge-green',
    'ASSET_ISSUED': 'badge badge-purple',
    'ASSET_COLLECTED': 'badge badge-orange',
    'MAINTENANCE_SCHEDULED': 'badge badge-orange',
    'MAINTENANCE_UPDATED': 'badge badge-blue',
    'MAINTENANCE_COMPLETED': 'badge badge-green',
    'MAINTENANCE_CANCELLED': 'badge badge-red'
  }
  return classes[eventType] || 'badge badge-gray'
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
    'NEW': 'badge badge-gray',
    'GOOD': 'badge badge-gray',
    'FAIR': 'badge badge-gray',
    'POOR': 'badge badge-gray',
    'DAMAGED': 'badge badge-gray',
    'REFURBISHED': 'badge badge-gray'
  }
  return classes[finalCondition] || 'badge badge-gray'
}

const getStatusBadgeClass = (status: string): string => {
  // Handle status transitions (e.g., "AVAILABLE → IN_MAINTENANCE")
  // Use the color of the final status
  const finalStatus = status.includes(' → ') ? status.split(' → ')[1] : status
  
  const classes: Record<string, string> = {
    'AVAILABLE': 'badge badge-green',
    'ASSIGNED': 'badge badge-blue', 
    'IN_MAINTENANCE': 'badge badge-orange',
    'RETIRED': 'badge badge-brown',
    'LOST': 'badge badge-red'
  }
  return classes[finalStatus] || 'badge badge-gray'
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    'AVAILABLE': 'Available',
    'ASSIGNED': 'Assigned',
    'IN_MAINTENANCE': 'In Maintenance',
    'RETIRED': 'Retired',
    'LOST': 'Lost'
  }
  return texts[status] || status
}

const getConditionText = (condition: string): string => {
  const texts: Record<string, string> = {
    'NEW': 'New',
    'GOOD': 'Good',
    'FAIR': 'Fair',
    'POOR': 'Poor',
    'DAMAGED': 'Damaged',
    'REFURBISHED': 'Refurbished'
  }
  return texts[condition] || condition
}

const getStatusDisplayText = (status: string): string => {
  // Convert to title case and replace → with Font Awesome arrow icon
  const titleCaseStatus = status.replace(' → ', ' → ').split(' → ').map(part => getStatusText(part)).join(' → ')
  return titleCaseStatus.replace(' → ', ' <i class="fas fa-arrow-right"></i> ')
}

const getConditionDisplayText = (condition: string): string => {
  // Convert to title case and replace → with Font Awesome arrow icon
  const titleCaseCondition = condition.replace(' → ', ' → ').split(' → ').map(part => getConditionText(part)).join(' → ')
  return titleCaseCondition.replace(' → ', ' <i class="fas fa-arrow-right"></i> ')
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  } catch (error) {
    console.warn('Error formatting date:', error)
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

const onDateFromChange = (value: string) => {
  filters.value.dateFrom = value
  filters.value.dateFromDisplay = value
  applyFilters()
}

const onDateToChange = (value: string) => {
  filters.value.dateTo = value
  filters.value.dateToDisplay = value
  applyFilters()
}

const formatCurrency = (amount: number | string): string => {
  try {
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  } catch (error) {
    console.warn('Error formatting currency:', error)
    return amount.toString()
  }
}

const formatFieldName = (fieldName: string): string => {
  if (!fieldName) return ''
  
  // If the field name already looks formatted (contains spaces or parentheses), return as-is
  // This handles labels already formatted by the backend
  if (fieldName.includes(' ') || fieldName.includes('(')) {
    return fieldName
  }
  
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
    'cancellationNotes': 'Cancellation Notes',
    // Specification fields - common laptop/desktop specs
    'processor': 'Processor',
    'ram': 'RAM',
    'ram_gb': 'RAM (GB)',
    'storage': 'Storage',
    'storage_gb': 'Storage (GB)',
    'storage_type': 'Storage Type',
    'graphics': 'Graphics Card',
    'graphics_card': 'Graphics Card',
    'operating_system': 'Operating System',
    'os': 'Operating System',
    'generation': 'Generation',
    'display': 'Display',
    'screen_size': 'Screen Size',
    'resolution': 'Resolution',
    'battery': 'Battery',
    'warranty': 'Warranty',
    'color': 'Color',
    'weight': 'Weight',
    'dimensions': 'Dimensions',
    'ports': 'Ports',
    'connectivity': 'Connectivity',
    'camera': 'Camera',
    'audio': 'Audio',
    'keyboard': 'Keyboard',
    'touchpad': 'Touchpad',
    'webcam': 'Webcam',
    'microphone': 'Microphone',
    'speakers': 'Speakers',
    'network': 'Network',
    'wifi': 'WiFi',
    'bluetooth': 'Bluetooth',
    'ethernet': 'Ethernet'
  }
  return fieldMap[fieldName] || (fieldName as any).replaceAll(/([A-Z_])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()).trim().replaceAll(/\s+/g, ' ')
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
  for (const input of dateInputs) {
    input.classList.remove('is-invalid')
  }
  // Apply the cleared filters to reload data
  applyFilters()
}

const getEventTitle = (item: AssetHistoryEvent): string => {
  // Since we removed the title field from the API, generate it from the type
  return (item.type as any).replaceAll('_', ' ').toLowerCase().replaceAll(/\b\w/g, (match: string) => match.toUpperCase())
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

<style>
@import '@/assets/styles/pages/assets.css';
</style>

