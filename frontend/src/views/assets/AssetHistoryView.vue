<template>
  <div class="asset-history-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="row align-items-center mb-4">
        <div class="col-md-8">
          <div class="d-flex align-items-center">
            <button 
              @click="goBack" 
              class="btn btn-outline-secondary me-3"
              title="Go Back"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <div>
              <h2 class="page-title mb-1">Asset History</h2>
              <p class="page-subtitle mb-0" v-if="assetInfo">
                {{ assetInfo.name }} ({{ assetInfo.assetId }})
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4 text-end">
          <div class="btn-group" role="group">
            <button 
              @click="refreshHistory" 
              class="btn btn-outline-primary"
              :disabled="loading"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
              Refresh
            </button>
            <button 
              @click="exportHistory" 
              class="btn btn-outline-success"
              :disabled="loading || !timeline.length"
            >
              <i class="fas fa-download"></i>
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- Asset Info Cards -->
      <div class="row mb-4" v-if="assetInfo && summary">
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ summary.totalEvents }}</div>
              <div class="stat-label">Total Events</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ summary.totalAssignments }}</div>
              <div class="stat-label">Assignments</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-tools"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ summary.totalMaintenance }}</div>
              <div class="stat-label">Maintenance</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-rupee-sign"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">
                {{ summary.totalCost ? `₹${formatCurrency(summary.totalCost)}` : 'N/A' }}
              </div>
              <div class="stat-label">Total Cost</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section mb-4">
      <div class="card">
        <div class="card-header">
          <div class="d-flex align-items-center justify-content-between">
            <h6 class="mb-0">
              <i class="fas fa-filter me-2"></i>
              Filters
            </h6>
            <button 
              @click="toggleFilters" 
              class="btn btn-sm btn-outline-secondary"
            >
              <i class="fas" :class="showFilters ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </button>
          </div>
        </div>
        <div class="card-body" v-show="showFilters">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Event Types</label>
              <select 
                v-model="filters.eventTypes" 
                class="form-select"
                multiple
              >
                <option value="ASSET_CREATED">Asset Created</option>
                <option value="ASSIGNED">Assignments</option>
                <option value="RETURNED">Returns</option>
                <option value="STATUS_CHANGED">Status Changes</option>
                <option value="CONDITION_CHANGED">Condition Changes</option>
                <option value="LOCATION_CHANGED">Location Changes</option>
                <option value="MAINTENANCE_SCHEDULED">Maintenance Scheduled</option>
                <option value="MAINTENANCE_STARTED">Maintenance Started</option>
                <option value="MAINTENANCE_COMPLETED">Maintenance Completed</option>
                <option value="MAINTENANCE_CANCELLED">Maintenance Cancelled</option>
                <option value="RETIRED">Asset Retired</option>
                <option value="REACTIVATED">Asset Reactivated</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Date From</label>
              <input 
                v-model="filters.dateFrom" 
                type="date" 
                class="form-control"
              >
            </div>
            <div class="col-md-2">
              <label class="form-label">Date To</label>
              <input 
                v-model="filters.dateTo" 
                type="date" 
                class="form-control"
              >
            </div>
            <div class="col-md-3">
              <label class="form-label">Search</label>
              <input 
                v-model="filters.search" 
                type="text" 
                class="form-control"
                placeholder="Search events..."
              >
            </div>
            <div class="col-md-2">
              <label class="form-label">&nbsp;</label>
              <div class="d-flex gap-2">
                <button 
                  @click="applyFilters" 
                  class="btn btn-primary btn-sm"
                  :disabled="loading"
                >
                  Apply
                </button>
                <button 
                  @click="clearFilters" 
                  class="btn btn-outline-secondary btn-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline Section -->
    <div class="timeline-section">
      <!-- Loading State -->
      <div v-if="loading && !timeline.length" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading asset history...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !timeline.length" class="empty-state">
        <div class="text-center py-5">
          <i class="fas fa-history fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No History Found</h5>
          <p class="text-muted">No events match your current filters.</p>
          <button @click="clearFilters" class="btn btn-outline-primary">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Timeline -->
      <div v-else class="timeline-container">
        <AssetTimelineComponent 
          :events="timeline"
          :loading="loading"
          @load-more="loadMore"
          @event-click="showEventDetails"
        />
      </div>

      <!-- Load More Button -->
      <div 
        v-if="pagination && pagination.hasNext && !loading" 
        class="text-center mt-4"
      >
        <button @click="loadMore" class="btn btn-outline-primary">
          <i class="fas fa-chevron-down me-2"></i>
          Load More Events
        </button>
      </div>

      <!-- Pagination Info -->
      <div 
        v-if="pagination && timeline.length > 0" 
        class="pagination-info text-center mt-3"
      >
        <small class="text-muted">
          Showing {{ timeline.length }} of {{ pagination.totalEvents }} events
        </small>
      </div>
    </div>

    <!-- Event Details Modal -->
    <EventDetailsModal 
      v-if="selectedEvent"
      :event="selectedEvent"
      @close="selectedEvent = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AssetTimelineComponent from '../../components/assets/AssetTimelineComponent.vue'
import EventDetailsModal from '../../components/assets/EventDetailsModal.vue'
import { assetHistoryService } from '../../services/assetHistoryService'
import type { 
  AssetHistoryEvent, 
  AssetBasicInfo, 
  AssetHistorySummary,
  AssetHistoryPagination,
  AssetHistoryFilters 
} from '../../types/assetHistory.types'

// Router
const route = useRoute()
const router = useRouter()

// Reactive state
const loading = ref(false)
const assetInfo = ref<AssetBasicInfo | null>(null)
const summary = ref<AssetHistorySummary | null>(null)
const timeline = ref<AssetHistoryEvent[]>([])
const pagination = ref<AssetHistoryPagination | null>(null)
const selectedEvent = ref<AssetHistoryEvent | null>(null)
const showFilters = ref(false)

// Filters
const filters = ref<AssetHistoryFilters>({
  eventTypes: [],
  dateFrom: '',
  dateTo: '',
  search: '',
  page: 1,
  limit: 20
})

// Computed
const assetId = computed(() => route.params.id as string)

// Methods
const loadHistorySummary = async () => {
  try {
    loading.value = true
    const response = await assetHistoryService.getAssetHistorySummary(assetId.value)
    
    // Check if response has the expected structure
    if (response && response.data) {
      assetInfo.value = response.data.asset
      summary.value = response.data.summary
      timeline.value = response.data.recentEvents || []
    } else {
      console.error('Invalid response structure:', response)
      // Fallback: try to load basic history
      await loadHistory()
    }
  } catch (error) {
    console.error('Error loading asset history summary:', error)
    // Fallback: try to load basic history
    try {
      await loadHistory()
    } catch (fallbackError) {
      console.error('Fallback history loading also failed:', fallbackError)
      // Show user-friendly error message
    }
  } finally {
    loading.value = false
  }
}

const loadHistory = async (append = false) => {
  try {
    loading.value = true
    
    const queryParams = {
      ...filters.value,
      page: append ? (pagination.value?.currentPage || 0) + 1 : 1
    }

    const response = await assetHistoryService.getAssetHistory(assetId.value, queryParams)
    
    // Check if response has the expected structure
    if (response && response.data) {
      if (!append) {
        assetInfo.value = response.data.asset
        timeline.value = response.data.timeline || []
      } else {
        timeline.value = [...timeline.value, ...(response.data.timeline || [])]
      }
      
      pagination.value = response.data.pagination
    } else {
      console.error('Invalid response structure:', response)
    }
  } catch (error) {
    console.error('Error loading asset history:', error)
    // Handle error - you could show a toast notification here
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (pagination.value?.hasNext && !loading.value) {
    loadHistory(true)
  }
}

const applyFilters = () => {
  filters.value.page = 1
  loadHistory()
}

const clearFilters = () => {
  filters.value = {
    eventTypes: [],
    dateFrom: '',
    dateTo: '',
    search: '',
    page: 1,
    limit: 20
  }
  loadHistory()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const refreshHistory = () => {
  loadHistory()
}

const exportHistory = async () => {
  try {
    // Implementation for exporting history
    console.log('Export functionality to be implemented')
  } catch (error) {
    console.error('Error exporting history:', error)
  }
}

const showEventDetails = (event: AssetHistoryEvent) => {
  selectedEvent.value = event
}

const goBack = () => {
  router.back()
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

// Watchers
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadHistorySummary()
  }
})

// Lifecycle
onMounted(() => {
  if (assetId.value) {
    loadHistorySummary()
  }
})
</script>

<style scoped>
.asset-history-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #0A0A0A;
  margin: 0;
}

.page-subtitle {
  color: #666666;
  font-size: 1rem;
}

.stat-card {
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #331FEA;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(51, 31, 234, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.25rem;
  color: white;
}

.stat-card:nth-child(1) .stat-icon {
  background: linear-gradient(135deg, #331FEA, #4F46E5);
}

.stat-card:nth-child(2) .stat-icon {
  background: linear-gradient(135deg, #21AF65, #16A34A);
}

.stat-card:nth-child(3) .stat-icon {
  background: linear-gradient(135deg, #F59E0B, #D97706);
}

.stat-card:nth-child(4) .stat-icon {
  background: linear-gradient(135deg, #E97676, #DC2626);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0A0A0A;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: #666666;
  margin-top: 0.25rem;
}

.filters-section .card {
  border: 1px solid #E0E0E0;
  border-radius: 0.5rem;
}

.filters-section .card-header {
  background: #F8F9FA;
  border-bottom: 1px solid #E0E0E0;
  padding: 1rem 1.25rem;
}

.filters-section .card-body {
  padding: 1.25rem;
}

.form-label {
  font-weight: 600;
  color: #0A0A0A;
  margin-bottom: 0.5rem;
}

.form-control, .form-select {
  border: 2px solid #E0E0E0;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #331FEA;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
}

.btn {
  border-radius: 0.5rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #331FEA;
  border-color: #331FEA;
}

.btn-primary:hover {
  background: #2818C7;
  border-color: #2818C7;
}

.btn-outline-primary {
  color: #331FEA;
  border-color: #331FEA;
}

.btn-outline-primary:hover {
  background: #331FEA;
  border-color: #331FEA;
}

.btn-outline-secondary {
  color: #666666;
  border-color: #E0E0E0;
}

.btn-outline-secondary:hover {
  background: #F8F9FA;
  border-color: #666666;
  color: #0A0A0A;
}

.btn-outline-success {
  color: #21AF65;
  border-color: #21AF65;
}

.btn-outline-success:hover {
  background: #21AF65;
  border-color: #21AF65;
}

.empty-state {
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 0.5rem;
  padding: 3rem 2rem;
}

.timeline-container {
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 0.5rem;
  padding: 2rem;
}

.pagination-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #F8F9FA;
  border-radius: 0.5rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .asset-history-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .btn-group {
    width: 100%;
  }
  
  .btn-group .btn {
    flex: 1;
  }
}
</style>
