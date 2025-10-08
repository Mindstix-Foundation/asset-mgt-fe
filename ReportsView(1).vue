<template>
  <div class="reports-page">
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0" style="color: var(--primary-black);">Reports & Analytics</h2>
          <p class="text-muted mb-0">Generate and export comprehensive asset reports</p>
        </div>
      </div>

      <!-- Quick Report Cards -->
      <div class="row mb-5">
        <div class="col-12 col-md-6 col-lg-4 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body text-center p-4">
              <i class="fas fa-file-excel fa-3x mb-3" style="color: var(--secondary-purple) !important;"></i>
              <h5 class="card-title">Asset Inventory Report</h5>
              <p class="card-text text-muted">Complete list of all assets with details</p>
              <button 
                class="btn btn-primary"
                @click="handleQuickExport('asset-inventory')"
                :disabled="isExporting"
              >
                <i class="fas fa-spinner fa-spin me-1" v-if="isExporting && exportingType === 'asset-inventory'"></i>
                <i class="fas fa-download me-1" v-else></i>
                {{ isExporting && exportingType === 'asset-inventory' ? 'Generating...' : 'Generate Excel' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-12 col-md-6 col-lg-4 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body text-center p-4">
              <i class="fas fa-users fa-3x mb-3" style="color: var(--secondary-green) !important;"></i>
              <h5 class="card-title">Employee Asset Report</h5>
              <p class="card-text text-muted">Assets assigned to each employee</p>
              <button 
                class="btn btn-success"
                @click="handleQuickExport('employee-assets')"
                :disabled="isExporting"
              >
                <i class="fas fa-spinner fa-spin me-1" v-if="isExporting && exportingType === 'employee-assets'"></i>
                <i class="fas fa-download me-1" v-else></i>
                {{ isExporting && exportingType === 'employee-assets' ? 'Generating...' : 'Generate Excel' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-12 col-md-6 col-lg-4 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body text-center p-4">
              <i class="fas fa-tools fa-3x mb-3" style="color: var(--secondary-orange) !important;"></i>
              <h5 class="card-title">Maintenance Report</h5>
              <p class="card-text text-muted">Completed maintenance history and costs</p>
              <button 
                class="btn btn-warning"
                @click="handleQuickExport('maintenance')"
                :disabled="isExporting"
              >
                <i class="fas fa-spinner fa-spin me-1" v-if="isExporting && exportingType === 'maintenance'"></i>
                <i class="fas fa-download me-1" v-else></i>
                {{ isExporting && exportingType === 'maintenance' ? 'Generating...' : 'Generate Excel' }}
              </button>
            </div>
          </div>
        </div>
        
      </div>

      <!-- Custom Reports Section -->
      <div class="mb-4">
        <h4 class="mb-3" style="color: var(--primary-black); font-weight: 600;">Custom Reports</h4>
        <p class="mb-4" style="color: var(--primary-dark-gray);">Build tailored reports with specific filters and date ranges</p>
      </div>

      <!-- Custom Report Builder -->
      <div class="card mb-5">
        <div class="card-header">
          <h5 class="mb-0" style="color: var(--primary-black);">
            <i class="fas fa-filter me-2" style="color: var(--secondary-purple);"></i>
            Custom Report Builder
          </h5>
        </div>
        <div class="card-body">
          <form @submit.prevent>
            <div class="row">
              <div class="col-12 col-md-3 mb-3">
                <SearchableDropdown
                  id="report-type"
                  label="Report Type"
                  placeholder="Select report type"
                  :items="reportTypeOptions"
                  v-model="selectedReportType"
                  :labelKey="'label'"
                  :valueKey="'value'"
                  :searchKeys="['label']"
                />
              </div>

              <div class="col-12 col-md-3 mb-3" v-if="customFilters.reportType === 'assets'">
                <SearchableDropdown
                  id="report-asset-type"
                  label="Asset Type"
                  placeholder="Select asset type"
                  :items="[{ value: '', label: 'All Types' }, ...assetTypes]"
                  v-model="selectedAssetType"
                  :labelKey="'label'"
                  :valueKey="'value'"
                  :searchKeys="['label']"
                  :disabled="isLoadingDropdowns"
                />
              </div>

              <div class="col-12 col-md-3 mb-3" v-if="customFilters.reportType === 'assets'">
                <SearchableDropdown
                  id="report-asset-status"
                  label="Asset Status"
                  placeholder="Select asset status"
                  :items="[{ value: '', label: 'All Status' }, ...assetStatuses]"
                  v-model="selectedAssetStatus"
                  :labelKey="'label'"
                  :valueKey="'value'"
                  :searchKeys="['label']"
                  :disabled="isLoadingDropdowns"
                />
              </div>

              

              <div class="col-12 col-md-3 mb-3">
                <SearchableDropdown
                  id="report-date-range"
                  label="Date Range"
                  placeholder="Select date range"
                  :items="dateRangeOptions"
                  v-model="selectedDateRange"
                  :labelKey="'label'"
                  :valueKey="'value'"
                  :searchKeys="['label']"
                />
              </div>
            </div>
            
            <div class="row" v-if="showCustomDateRange">
              <div class="col-12 col-md-3 mb-3">
                <DatePicker
                  id="from-date-filter"
                  label="From Date"
                  v-model="customFilters.fromDate"
                />
              </div>
              <div class="col-12 col-md-3 mb-3">
                <DatePicker
                  id="to-date-filter"
                  label="To Date"
                  v-model="customFilters.toDate"
                />
              </div>
            </div>
            
            <div class="row">
              <div class="col-12">
                <div class="d-flex flex-wrap gap-2">
                  <button 
                    type="button" 
                    class="btn btn-custom-primary" 
                    @click="showPreviewModal = true; loadPreviewData()"
                    :disabled="isLoadingPreview"
                  >
                    <i class="fas fa-spinner fa-spin me-1" v-if="isLoadingPreview"></i>
                    <i class="fas fa-eye me-1" v-else></i>
                    {{ isLoadingPreview ? 'Loading...' : 'Preview Report' }}
                  </button>
                  
                  <button 
                    type="button" 
                    class="btn btn-custom-success" 
                    @click="handleCustomExport('excel')"
                    :disabled="isExporting"
                  >
                    <i class="fas fa-spinner fa-spin me-1" v-if="isExporting && exportingType === 'custom-excel'"></i>
                    <i class="fas fa-file-excel me-1" v-else></i>
                    {{ isExporting && exportingType === 'custom-excel' ? 'Exporting...' : 'Export to Excel' }}
                  </button>
                  
                  <button 
                    type="button" 
                    class="btn btn-text-secondary" 
                    @click="clearFilters"
                  >
                    <i class="fas fa-times me-1"></i>Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Analytics Dashboard -->
      <div class="mb-4">
        <h4 class="mb-3" style="color: var(--primary-black); font-weight: 600;">Analytics Dashboard</h4>
        <p class="mb-4" style="color: var(--primary-dark-gray);">Real-time insights and key metrics overview</p>
      </div>

      <!-- Analytics Cards -->
      <div class="row mb-5 analytics-cards" v-if="analyticsData">
        <!-- Asset Distribution by Type -->
        <div class="col-12 col-lg-4 mb-4">
          <div class="card compact-chart-card">
            <div class="card-header compact-header">
              <h6 class="mb-0"><i class="fas fa-chart-pie me-2"></i>Asset Distribution</h6>
            </div>
            <div class="card-body p-2">
              <div class="mini-chart-container mb-2 d-flex justify-content-center">
                <canvas ref="assetDistributionChart" width="200" height="150"></canvas>
              </div>
              <div class="compact-stats">
                <div class="stat-row" v-for="item in analyticsData.assetDistribution" :key="item.type">
                  <div class="stat-dot" :style="{ backgroundColor: getColorForType(item.type) }"></div>
                  <span class="stat-label">{{ item.type }}</span>
                  <span class="stat-value">{{ item.count }} ({{ item.percentage }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Asset Status Overview -->
        <div class="col-12 col-lg-4 mb-4">
          <div class="card compact-chart-card">
            <div class="card-header compact-header">
              <h6 class="mb-0"><i class="fas fa-chart-bar me-2"></i>Status Overview</h6>
            </div>
            <div class="card-body p-2">
              <div class="status-grid">
                <div 
                  v-for="status in analyticsData.statusOverview" 
                  :key="status.status"
                  class="status-mini-card"
                  :class="status.status.toLowerCase()"
                >
                  <div class="status-icon">
                    <i :class="getStatusIcon(status.status)"></i>
                  </div>
                  <div class="status-info">
                    <div class="status-count">{{ status.count }}</div>
                    <div class="status-label">{{ formatStatus(status.status) }}</div>
                    <div class="status-percent">{{ status.percentage }}%</div>
                  </div>
                </div>
                
                <!-- Total Assets Card -->
                <div class="status-mini-card total-assets">
                  <div class="status-icon">
                    <i class="fas fa-laptop"></i>
                  </div>
                  <div class="status-info">
                    <div class="status-count">{{ getTotalAssetCount() }}</div>
                    <div class="status-label">Total Assets</div>
                    <div class="status-percent">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="col-12 col-lg-4 mb-4">
          <div class="card compact-chart-card">
            <div class="card-header compact-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0"><i class="fas fa-clock me-2"></i>Recent Activity</h6>
              <small class="text-muted">Last 24h</small>
            </div>
            <div class="card-body p-0">
              <div class="activity-list">
                <!-- Loading state -->
                <div v-if="isLoadingAnalytics" class="activity-item" v-for="n in 4" :key="'loading-' + n">
                  <div class="activity-icon">
                    <i class="fas fa-spinner fa-spin"></i>
                  </div>
                  <div class="activity-content">
                    <div class="placeholder-glow">
                      <span class="placeholder col-6"></span>
                    </div>
                    <div class="placeholder-glow mt-1">
                      <span class="placeholder col-8"></span>
                    </div>
                    <div class="placeholder-glow mt-1">
                      <span class="placeholder col-4"></span>
                    </div>
                  </div>
                </div>
                
                <!-- Actual data -->
                <div v-else-if="recentActivities.length > 0" v-for="activity in recentActivities" :key="activity.id" 
                     class="activity-item">
                  <div class="activity-icon" :class="getActivityType(activity.title)">
                    <i :class="getActivityIcon(activity.title)"></i>
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.title }}</div>
                    <div class="activity-description">{{ activity.description }}</div>
                    <div class="activity-time">{{ activity.timeAgo }}</div>
                  </div>
                </div>
                
                <!-- No data state -->
                <div v-else class="activity-item text-center py-4">
                  <div class="text-muted">
                    <i class="fas fa-info-circle me-2"></i>
                    No recent activities found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingAnalytics" class="text-center py-5">
        <i class="fas fa-spinner fa-spin fa-2x text-muted mb-3"></i>
        <p class="text-muted">Loading analytics data...</p>
      </div>
    </div>

    <!-- Report Preview Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showPreviewModal }"
      :style="{ display: showPreviewModal ? 'block' : 'none' }"
      tabindex="-1"
      @click.self="showPreviewModal = false"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ getReportTitle() }} Preview</h5>
            <button type="button" class="btn-close" @click="showPreviewModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="isLoadingPreview" class="text-center py-4">
              <i class="fas fa-spinner fa-spin fa-2x text-muted mb-3"></i>
              <p class="text-muted">Loading preview data...</p>
            </div>
            
            <div v-else-if="previewData.length > 0" class="table-responsive" style="max-height: 400px; overflow-y: auto;">
              <table class="table table-striped table-hover">
                <thead class="table-dark sticky-top">
                  <tr>
                    <th v-for="column in getPreviewColumns()" :key="column.key" :style="{ minWidth: column.width }">
                      {{ column.label }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in previewData" :key="item.id || item.maintenanceId || item.assetId || item.employeeId">
                    <td v-for="column in getPreviewColumns()" :key="column.key">
                      <span v-if="column.key === 'status'" class="badge" :class="getBadgeClass(item[column.key])">
                        <i :class="getStatusIcon(item[column.key])" class="me-1"></i>
                        {{ formatStatus(item[column.key]) }}
                      </span>
                      <span v-else>{{ formatCellValue(item[column.key], column.type) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-else class="text-center py-4">
              <i class="fas fa-info-circle fa-2x text-muted mb-3"></i>
              <p class="text-muted">No data available for the selected filters</p>
          </div>
          
            <div v-if="previewData.length > 0" class="d-flex justify-content-between align-items-center mt-3">
              <small class="text-muted">Showing {{ previewData.length }} of {{ previewTotal }} records</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-simple-secondary" @click="showPreviewModal = false">Close</button>
            <div class="d-flex gap-2">
              <button 
                type="button" 
                class="btn btn-simple-success" 
                @click="handleCustomExport('excel')"
                :disabled="isExporting"
              >
                <i class="fas fa-spinner fa-spin me-1" v-if="isExporting && exportingType === 'custom-excel'"></i>
                <i class="fas fa-file-excel me-1" v-else></i>
                {{ isExporting && exportingType === 'custom-excel' ? 'Exporting...' : 'Export Excel' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Backdrop -->
    <div v-if="showPreviewModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { reportsApi, type ReportFilters, type AnalyticsData } from '@/services/reportsApi'
import { dashboardApi } from '@/services/dashboardApi'
import { assetService } from '@/services/assetService'
import { employeeService } from '@/services/employeeService'
import { maintenanceService } from '@/services/maintenanceService'
import SearchableDropdown, { type Item as SDItem } from '@/components/common/SearchableDropdown.vue'
import DatePicker from '@/components/ui/date/DatePicker.vue'

Chart.register(...registerables)

// Reactive data
const analyticsData = ref<AnalyticsData | null>(null)
const isLoadingAnalytics = ref(true)
const isExporting = ref(false)
const exportingType = ref('')
const isLoadingPreview = ref(false)
const showPreviewModal = ref(false)
const previewData = ref<any[]>([])
const previewTotal = ref(0)
const showCustomDateRange = ref(false)

// Recent activities data (used by template)
const recentActivities = ref<Array<{
  id: string
  title: string
  description: string
  timeAgo: string
  needsRealTimeUpdate: boolean
  timestamp: Date
}>>([])

// Real-time update intervals
let realTimeUpdateId: number | undefined

// Chart refs
const assetDistributionChart = ref<HTMLCanvasElement>()
const assetDistributionChartInstance = ref<any | null>(null)

// Filters
const customFilters = ref<ReportFilters>({
  reportType: 'assets',
  assetType: '',
  assetStatus: '',
  
  dateRange: 'last30',
  fromDate: '',
  toDate: ''
})

// Dynamic dropdown data
const assetTypes = ref<Array<{value: string, label: string}>>([])
const assetStatuses = ref<Array<{value: string, label: string}>>([])
const isLoadingDropdowns = ref(false)

// Selected SearchableDropdown models
const selectedAssetType = ref<SDItem | null>(null)
const selectedAssetStatus = ref<SDItem | null>(null)
const selectedReportType = ref<SDItem | null>({ value: 'assets', label: 'Asset Report' })
const selectedDateRange = ref<SDItem | null>({ value: 'last30', label: 'Last 30 Days' })

const reportTypeOptions = [
  { value: 'assets', label: 'Asset Report' },
  { value: 'employees', label: 'Employee Report' },
  { value: 'maintenance', label: 'Maintenance Report' }
]

const dateRangeOptions = [
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last3months', label: 'Last 3 Months' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'lastyear', label: 'Last Year' },
  { value: 'alltime', label: 'All Time' },
  { value: 'custom', label: 'Custom Range' }
]
// Helpers
const toISODate = (val: any): string => {
  if (!val) return ''
  try {
    if (typeof val === 'string') {
      // Handle 'DD/MM/YYYY, HH:mm:ss'
      const m = val.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:,\s*(\d{2}):(\d{2}):(\d{2}))?$/)
      if (m) {
        const day = Number.parseInt(m[1], 10)
        const month = Number.parseInt(m[2], 10) - 1
        const year = Number.parseInt(m[3], 10)
        const hh = Number.parseInt(m[4] || '0', 10)
        const mm = Number.parseInt(m[5] || '0', 10)
        const ss = Number.parseInt(m[6] || '0', 10)
        const d = new Date(year, month, day, hh, mm, ss)
        if (!Number.isNaN(d.getTime())) return d.toISOString().split('T')[0]
      }
    }
    const d = new Date(val)
    if (!Number.isNaN(d.getTime())) return d.toISOString().split('T')[0]
    return ''
  } catch { return '' }
}


// Sync dropdown models into customFilters
watch(selectedAssetType, (val: SDItem | null) => {
  customFilters.value.assetType = (val?.value as string) ?? ''
})
watch(selectedAssetStatus, (val: SDItem | null) => {
  customFilters.value.assetStatus = (val?.value as string) ?? ''
})

watch(selectedReportType, (val: SDItem | null) => {
  const v = (val?.value as string) || 'assets'
  if (v === 'assets' || v === 'employees' || v === 'maintenance') {
    customFilters.value.reportType = v as any
  } else {
    customFilters.value.reportType = 'assets'
  }
})

watch(selectedDateRange, (val: SDItem | null) => {
  customFilters.value.dateRange = (val?.value as string) || 'last30'
  handleDateRangeChange()
})

// Helper to read CSS variables defined in main.css
const getCssVar = (name: string, fallback: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

// Transform asset distribution to show all types even with 0 assets
const transformAssetDistributionForReports = (assetDistribution: any[]) => {
  // Define all standard asset types
  const standardTypes = ['Laptop', 'Desktop', 'Monitor', 'Mobile', 'Tablet', 'Accessories']
  
  // Create a map of existing data
  const existingData = new Map()
  for (const item of assetDistribution) {
    existingData.set(item.type, item)
  }
  
  // Create result array with all standard types
  const result = standardTypes.map(type => {
    const existing = existingData.get(type)
    if (existing) {
      return existing
    } else {
      // Return 0 values for missing types
      return {
        type: type,
        count: 0,
        percentage: 0,
        value: 0
      }
    }
  })
  
  // Add any additional types from backend that aren't in standard list
  for (const item of assetDistribution) {
    if (!standardTypes.includes(item.type)) {
      result.push(item)
    }
  }
  
  // Sort by percentage (highest to lowest)
  return result.sort((a, b) => b.percentage - a.percentage)
}

  // Helper function to determine if an activity should be updated based on its timeAgo
  function shouldUpdateActivityTime(timeAgo: string): boolean {
    // Update activities that are less than 1 hour old
    if (timeAgo === 'Just now' || timeAgo.includes('minute')) {
      return true
    }
    // Don't update activities that are hours, days, etc. old
    return false
  }

  // Update real-time activity times
  function updateRealTimeActivityTimes() {
    try {
      // Only update if we have activities
      if (recentActivities.value.length === 0) {
        return
      }
      
      // Use backend's needsRealTimeUpdate flag OR check if activities are recent enough
      const needsUpdateActivities = recentActivities.value.filter(activity => 
        activity.needsRealTimeUpdate || shouldUpdateActivityTime(activity.timeAgo)
      )
      
      if (needsUpdateActivities.length === 0) {
        return // No activities need updates
      }
      
      const updatedActivities = dashboardApi.updateActivityTimes(recentActivities.value)
      
      // Only update if we have valid results
      if (updatedActivities && updatedActivities.length > 0) {
        recentActivities.value = updatedActivities
      }
    } catch (error) {
      console.error('Error updating real-time activity times:', error)
    }
  }

// Methods
const loadAnalyticsData = async () => {
  try {
    isLoadingAnalytics.value = true
    analyticsData.value = await reportsApi.getAnalytics()
    
    // Transform asset distribution to show all types even with 0 assets
    if (analyticsData.value.assetDistribution) {
      analyticsData.value.assetDistribution = transformAssetDistributionForReports(analyticsData.value.assetDistribution)
    }
    
    // Transform recent activities using dashboardApi
    if (analyticsData.value.recentActivity) {
      // Convert the reports API format to dashboard API format
      const convertedActivities = analyticsData.value.recentActivity.map(activity => ({
        id: activity.id,
        type: activity.type as any,
        description: activity.description,
        timestamp: new Date(activity.timestamp),
        timeAgo: activity.timeAgo || 'Unknown', // Use the backend's timeAgo value
        needsRealTimeUpdate: activity.needsRealTimeUpdate || false,
        assetId: activity.assetId,
        employeeId: activity.employeeId,
        maintenanceId: activity.maintenanceId,
        vendorId: activity.vendorId
      }))
      recentActivities.value = dashboardApi.transformRecentActivity(convertedActivities)
    }
    
    await nextTick()
    initializeCharts()
    
    // Load dropdown data after analytics data is loaded
    await loadDropdownData()
  } catch (error) {
    console.error('Error loading analytics data:', error)
    showNotification('Failed to load analytics data', 'error')
  } finally {
    isLoadingAnalytics.value = false
  }
}

const initializeCharts = () => {
  if (assetDistributionChart.value && analyticsData.value) {
    const ctx = assetDistributionChart.value.getContext('2d')
    if (ctx) {
      // Resolve theme colors from CSS variables (canvas needs concrete color values)
      const resolvedColors: Record<string, string> = {
        'Laptop': getCssVar('--secondary-purple', '#331FEA'),
        'Monitor': getCssVar('--secondary-green', '#22C55E'),
        'Mobile': getCssVar('--secondary-orange', '#F59E0B'),
        'Tablet': getCssVar('--secondary-pink', '#EC4899'),
        'Accessories': getCssVar('--primary-dark-gray', '#4B5563'),
      }

      const labels = analyticsData.value.assetDistribution.map(item => item.type)
      const dataValues = analyticsData.value.assetDistribution.map(item => item.percentage)
      const backgroundColors = analyticsData.value.assetDistribution.map(item => resolvedColors[item.type] || '#94A3B8')

      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: dataValues,
            backgroundColor: backgroundColors,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 8,
            hoverBorderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              cornerRadius: 6,
              displayColors: false,
              bodyFont: { size: 12 },
              titleFont: { size: 12 }
            }
          },
          animation: {
            animateRotate: true,
            duration: 1000
          }
        }
      })
      // Store the instance if you need to update or destroy it later
      assetDistributionChartInstance.value = chart
    }
  }
}

const handleQuickExport = async (reportType: string) => {
  try {
    isExporting.value = true
    exportingType.value = reportType
    
    switch (reportType) {
      case 'asset-inventory':
        // Use the same asset export API as the Assets page
        await assetService.exportAssetsToExcel()
        showNotification('Asset inventory report exported successfully!', 'success')
        break
      case 'employee-assets':
        // Use the same employee export API as the Employees page
        await employeeService.exportEmployeesToExcel()
        showNotification('Employee assets report exported successfully!', 'success')
        break
      case 'maintenance':
        await maintenanceService.exportMaintenanceToExcel()
        showNotification('Completed maintenance report exported successfully!', 'success')
        break
      default:
        throw new Error('Unknown report type')
    }
  } catch (error) {
    console.error('Error exporting report:', error)
    showNotification('Failed to export report', 'error')
  } finally {
    isExporting.value = false
    exportingType.value = ''
  }
}

// Helper function to build asset export parameters
const buildAssetExportParams = (filters: any) => {
  const params: any = {}
  if (filters.assetType) params.assetType = filters.assetType
  if (filters.assetStatus) params.status = filters.assetStatus
  if (filters.fromDate) params.fromDate = filters.fromDate
  if (filters.toDate) params.toDate = filters.toDate
  return params
}

// Helper function to build employee export parameters
const buildEmployeeExportParams = (filters: any) => {
  const params: any = {}
  if (filters.fromDate) params.fromDate = filters.fromDate
  if (filters.toDate) params.toDate = filters.toDate
  return params
}

// Helper function to build maintenance export parameters
const buildMaintenanceExportParams = (filters: any) => {
  const params: any = {
    sortBy: 'id',
    sortOrder: 'desc'
  }
  if (filters.assetType) params.assetType = filters.assetType
  if (filters.fromDate) params.scheduledDateFrom = filters.fromDate
  if (filters.toDate) params.scheduledDateTo = filters.toDate
  return params
}

// Helper function to export assets
const exportAssets = async (filters: any) => {
  const params = buildAssetExportParams(filters)
  await assetService.exportAssetsToExcel(params)
  showNotification('Custom asset report exported successfully!', 'success')
}

// Helper function to export employees
const exportEmployees = async (filters: any) => {
  const params = buildEmployeeExportParams(filters)
  await employeeService.exportEmployeesToExcel(params)
  showNotification('Custom employee report exported successfully!', 'success')
}

// Helper function to export maintenance
const exportMaintenance = async (filters: any) => {
  const params = buildMaintenanceExportParams(filters)
  await maintenanceService.exportMaintenanceToExcel(params)
  showNotification('Custom completed maintenance report exported successfully!', 'success')
}

const handleCustomExport = async (format: string) => {
  try {
    isExporting.value = true
    exportingType.value = `custom-${format}`
    
    const filters = { ...customFilters.value }
    delete filters.dateRange
    
    const exportHandlers: Record<string, (filters: any) => Promise<void>> = {
      assets: exportAssets,
      employees: exportEmployees,
      maintenance: exportMaintenance
    }

    const handler = exportHandlers[customFilters.value.reportType]
    if (!handler) {
      throw new Error('Unknown report type')
    }
    
    await handler(filters)
    showPreviewModal.value = false
  } catch (error) {
    console.error('Error exporting custom report:', error)
    showNotification('Failed to export custom report', 'error')
  } finally {
    isExporting.value = false
    exportingType.value = ''
  }
}

// Helper function to build common API parameters
const buildApiParams = (filters: any, additionalParams: any = {}) => {
  const params: any = { page: 1, limit: 5, ...additionalParams }
  
  if (filters.assetType) params.assetType = filters.assetType
  if (filters.assetStatus) params.status = filters.assetStatus
  if (filters.fromDate) params.fromDate = filters.fromDate
  if (filters.toDate) params.toDate = filters.toDate
  
  return params
}

// Helper function to extract data and pagination from API response
const extractResponseData = (response: any, dataKey: string) => {
  const items = response.data?.[dataKey] || response[dataKey] || []
  const pagination = response.data?.pagination || response.pagination || { totalCount: items.length }
  return { items, pagination }
}

// Helper function to set preview data with common logic
const setPreviewData = (data: any[], total: number) => {
  previewData.value = data.slice(0, 5)
  previewTotal.value = total
}

// Helper function to load assets preview data
const loadAssetsPreview = async (filters: any) => {
  const params = buildApiParams(filters)
  const response = await assetService.getAssets(params)
  const { items, pagination } = extractResponseData(response, 'assets')
  const transformed = assetService.transformAssetsForDisplay(items)
  setPreviewData(transformed, pagination.totalCount || pagination.total || transformed.length)
}

// Helper function to load employees preview data
const loadEmployeesPreview = async (filters: any) => {
  const params = buildApiParams(filters, { fromDate: filters.fromDate, toDate: filters.toDate })
  const response = await employeeService.getEmployees(params)
  const { items: employees, pagination } = extractResponseData(response, 'employees')
  
  const mapped = employees.map((e: any) => ({
    employeeName: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.employeeId,
    email: e.email,
    phoneNumber: e.phoneNumber || e.phone || '-',
    status: e.status || 'ACTIVE',
    totalAssetsAssigned: e.assignedAssetsCount || 0
  }))
  
  setPreviewData(mapped, pagination.totalCount || pagination.total || mapped.length)
}

// Helper function to load maintenance preview data
const loadMaintenancePreview = async (filters: any) => {
  const params = buildApiParams(filters, {})
  const response = await reportsApi.getReportPreview('maintenance', params)
  const records = Array.isArray(response) ? response : (response.data || [])
  
  const transformed = records.map((record: any) => ({
    id: record.maintenanceId || record.id,
    maintenanceId: record.maintenanceId,
    assetId: record.assetId || '-',
    assetType: record.assetType || '-',
    assetBrand: record.assetBrand || '-',
    maintenanceType: record.maintenanceType || '-',
    scheduledDate: record.scheduledDate,
    status: record.status,
    cost: record.cost || 0,
    completedDate: record.completedDate || '-'
  }))
  
  const total = Array.isArray(response) ? response.length : (response.total || transformed.length)
  setPreviewData(transformed, total)
}

// Helper function to load default preview data
const loadDefaultPreview = async (reportType: string, filters: any) => {
  const response = await reportsApi.getReportPreview(reportType, filters)
  const data = response.data || []
  setPreviewData(data, response.total || data.length)
}

const loadPreviewData = async () => {
  try {
    isLoadingPreview.value = true
    const filters = { ...customFilters.value }
    delete filters.dateRange
    const reportType = customFilters.value.reportType || 'assets'

    const previewLoaders: Record<string, (filters: any) => Promise<void>> = {
      assets: loadAssetsPreview,
      employees: loadEmployeesPreview,
      maintenance: loadMaintenancePreview
    }

    const loader = previewLoaders[reportType]
    if (loader) {
      await loader(filters)
    } else {
      await loadDefaultPreview(reportType, filters)
    }
  } catch (error) {
    console.error('Error loading preview data:', error)
    showNotification('Failed to load preview data', 'error')
    previewData.value = []
    previewTotal.value = 0
  } finally {
    isLoadingPreview.value = false
  }
}

const handleDateRangeChange = () => {
  showCustomDateRange.value = customFilters.value.dateRange === 'custom'
  
  if (customFilters.value.dateRange !== 'custom') {
    const now = new Date()
    let fromDate = new Date()
    
    switch (customFilters.value.dateRange) {
      case 'last7':
        fromDate.setDate(now.getDate() - 7)
        break
      case 'last30':
        fromDate.setDate(now.getDate() - 30)
        break
      case 'last3months':
        fromDate.setMonth(now.getMonth() - 3)
        break
      case 'last6months':
        fromDate.setMonth(now.getMonth() - 6)
        break
      case 'lastyear':
        fromDate.setFullYear(now.getFullYear() - 1)
        break
      case 'alltime':
        customFilters.value.fromDate = ''
        customFilters.value.toDate = ''
        return
    }
    
    customFilters.value.fromDate = fromDate.toISOString().split('T')[0]
    customFilters.value.toDate = now.toISOString().split('T')[0]
  }
}

const clearFilters = () => {
  customFilters.value = {
    reportType: 'assets',
    assetType: '',
    assetStatus: '',
    department: '',
    dateRange: 'last30',
    fromDate: '',
    toDate: ''
  }
  showCustomDateRange.value = false
  showNotification('All filters have been cleared', 'info')
}

// Helper functions
const getColorForType = (type: string): string => {
  const colors: Record<string, string> = {
    'Laptop': 'var(--secondary-purple)',
    'Monitor': 'var(--secondary-green)',
    'Mobile': 'var(--secondary-orange)',
    'Tablet': 'var(--secondary-pink)',
    'Accessories': 'var(--primary-dark-gray)'
  }
  return colors[type] || 'var(--primary-mid-gray)'
}

const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    'ASSIGNED': 'fas fa-user-check',
    'AVAILABLE': 'fas fa-check-circle',
    'MAINTENANCE': 'fas fa-tools',
    'IN_MAINTENANCE': 'fas fa-tools',
    'COMPLETED': 'fas fa-check-circle',
    'SCHEDULED': 'fas fa-calendar',
    'CANCELLED': 'fas fa-times-circle',
    'RETIRED': 'fas fa-archive',
    'ACTIVE': 'fas fa-user-check',
    'INACTIVE': 'fas fa-user-times',
    'TERMINATED': 'fas fa-user-slash',
    'ON_LEAVE': 'fas fa-calendar-times'
  }
  return icons[status] || 'fas fa-question-circle'
}


const formatStatus = (status: string): string => {
  if (!status) return '-'
  const normalized = status.toUpperCase()
  if (normalized === 'IN_MAINTENANCE') return 'In Maintenance'
  return normalized.charAt(0) + normalized.slice(1).toLowerCase()
}


const formatTimeAgo = (timestamp: string): string => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours === 1) return '1 hour ago'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return '1 day ago'
  return `${diffInDays} days ago`
}

const getReportTitle = (): string => {
  const titles: Record<string, string> = {
    'assets': 'Asset Inventory Report',
    'employees': 'Employee Asset Report',
    'maintenance': 'Completed Maintenance Report'
  }
  return titles[customFilters.value.reportType || 'assets'] || 'Report'
}

const getPreviewColumns = () => {
  switch (customFilters.value.reportType) {
    case 'assets':
      return [
        { key: 'assetId', label: 'Asset ID', width: '100px' },
        { key: 'type', label: 'Type', width: '80px' },
        { key: 'brand', label: 'Brand', width: '120px' },
        { key: 'model', label: 'Model', width: '120px' },
        { key: 'serialNumber', label: 'Serial Number', width: '120px' },
        { key: 'status', label: 'Status', width: '130px' },
        { key: 'assignedTo', label: 'Assigned To', width: '120px' },
        { key: 'location', label: 'Location', width: '130px' },
        { key: 'purchaseDate', label: 'Purchase Date', width: '120px', type: 'date' }
      ]
    case 'employees':
      return [
        { key: 'employeeName', label: 'Employee Name', width: '150px' },
        { key: 'email', label: 'Email', width: '180px' },
        { key: 'phoneNumber', label: 'Phone Number', width: '120px' },
        { key: 'status', label: 'Status', width: '100px' },
        { key: 'totalAssetsAssigned', label: 'Total Assets', width: '100px' }
      ]
    case 'maintenance':
      return [
        { key: 'assetId', label: 'Asset ID', width: '100px' },
        { key: 'assetType', label: 'Type', width: '80px' },
        { key: 'assetBrand', label: 'Brand', width: '100px' },
        { key: 'maintenanceType', label: 'Maintenance Type', width: '130px' },
        { key: 'scheduledDate', label: 'Scheduled Date', width: '120px', type: 'date' },
        { key: 'status', label: 'Status', width: '100px' },
        { key: 'cost', label: 'Cost', width: '100px', type: 'currency' },
        { key: 'completedDate', label: 'Completed Date', width: '120px', type: 'date' }
      ]
    default:
      return []
  }
}

const getBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    'ASSIGNED': 'badge bg-primary text-white',
    'AVAILABLE': 'badge bg-success text-white',
    'MAINTENANCE': 'badge bg-warning text-dark',
    'IN_MAINTENANCE': 'badge bg-warning text-dark',
    'COMPLETED': 'badge bg-success text-white',
    'SCHEDULED': 'badge bg-info text-white',
    'CANCELLED': 'badge bg-danger text-white',
    'RETIRED': 'badge bg-secondary text-white',
    'ACTIVE': 'badge bg-success text-white',
    'INACTIVE': 'badge bg-warning text-dark',
    'TERMINATED': 'badge bg-danger text-white',
    'ON_LEAVE': 'badge bg-info text-white'
  }
  return classes[status] || 'badge bg-secondary text-white'
}

const formatCellValue = (value: any, type?: string): string => {
  if (value === null || value === undefined) return '-'
  
  switch (type) {
    case 'date':
      try {
        if (!value) return '-'
        const d = typeof value === 'string' ? new Date(value) : value
        if (Number.isNaN(d?.getTime?.())) return '-'
        return d.toLocaleDateString()
      } catch {
        return '-'
      }
    case 'currency':
      return `₹${value.toLocaleString()}`
    default:
      return String(value)
  }
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // Implement your notification system here
  console.log(`${type.toUpperCase()}: ${message}`)
}

// Helper functions for activity display
const getActivityType = (title: string): string => {
  if (title.includes('Asset Updated') || title.includes('Asset Added')) return 'added'
  if (title.includes('Asset Issued') || title.includes('Asset Collected')) return 'assigned'
  if (title.includes('Maintenance')) return 'maintenance'
  if (title.includes('Employee')) return 'added'
  if (title.includes('Vendor')) return 'added'
  return 'added'
}

const getActivityIcon = (title: string): string => {
  if (title.includes('Asset Updated') || title.includes('Asset Added')) return 'fas fa-laptop'
  if (title.includes('Asset Issued')) return 'fas fa-arrow-right'
  if (title.includes('Asset Collected')) return 'fas fa-arrow-left'
  if (title.includes('Maintenance')) return 'fas fa-tools'
  if (title.includes('Employee')) return 'fas fa-user'
  if (title.includes('Vendor')) return 'fas fa-building'
  return 'fas fa-circle'
}

// Calculate total asset count from status overview
const getTotalAssetCount = (): number => {
  if (!analyticsData.value?.statusOverview) return 0
  return analyticsData.value.statusOverview.reduce((total, status) => total + status.count, 0)
}

// Load dynamic dropdown data
const loadDropdownData = async () => {
  try {
    isLoadingDropdowns.value = true
    
    // Load asset types from asset distribution
    if (analyticsData.value?.assetDistribution) {
      assetTypes.value = analyticsData.value.assetDistribution
        .filter(item => item.count > 0) // Only show types with assets
        .map(item => ({
          value: item.type,
          label: item.type
        }))
    }
    
    // Load asset statuses from status overview
    if (analyticsData.value?.statusOverview) {
      assetStatuses.value = analyticsData.value.statusOverview
        .filter(item => item.count > 0) // Only show statuses with assets
        .map(item => ({
          value: item.status,
          label: formatStatus(item.status)
        }))
    }
    
    
    
  } catch (error) {
    console.error('Error loading dropdown data:', error)
  } finally {
    isLoadingDropdowns.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadAnalyticsData()
  handleDateRangeChange()
  
  // Update real-time activity times every minute for minute-level updates
  realTimeUpdateId = globalThis.setInterval(updateRealTimeActivityTimes, 60_000)
})

onUnmounted(() => {
  if (realTimeUpdateId) {
    clearInterval(realTimeUpdateId)
    realTimeUpdateId = undefined
  }
})
</script>

<style scoped>
.reports-page {
  background: var(--primary-white);
  min-height: calc(100vh - 60px);
  padding: 0;
}



/* Include all the styles from the prototype */
.report-card {
  border-radius: 0.75rem !important;
  overflow: hidden;
  cursor: default;
  border: none !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  transition: none !important;
}

.card {
  border-radius: 0.75rem !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
}

.card-header {
  background: white !important;
  border-bottom: 1px solid var(--element-gray) !important;
  padding: 1rem 1.25rem !important;
  min-height: 70px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.card-header h5,
.card-header h6 {
  color: #333333 !important;
  margin: 0 !important;
  flex-grow: 1;
}

.compact-chart-card {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  max-height: 400px;
}

.compact-header {
  background-color: var(--bg-primary);
  color: var(--primary-black);
  border-radius: 1rem 1rem 0 0;
  border: 1px solid var(--element-gray);
  padding: 0.75rem 1rem;
}

.compact-header h6 {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--primary-black) !important;
}

.mini-chart-container {
  position: relative;
  height: 100px;
}

.compact-stats .stat-row {
  display: flex;
  align-items: center;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.compact-stats .stat-row:last-child {
  border-bottom: none;
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.stat-label {
  flex: 1;
  font-size: 0.8rem;
  color: var(--primary-dark-gray);
}

.stat-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary-black);
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.status-mini-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.75rem;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: center;
}

.status-icon {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.status-mini-card.assigned .status-icon,
.status-mini-card.assigned .status-count { color: var(--secondary-purple); }
.status-mini-card.available .status-icon,
.status-mini-card.available .status-count { color: var(--secondary-green); }
.status-mini-card.in_maintenance .status-icon,
.status-mini-card.in_maintenance .status-count { color: var(--secondary-orange); }
.status-mini-card.maintenance .status-icon,
.status-mini-card.maintenance .status-count { color: var(--secondary-orange); }
.status-mini-card.retired .status-icon,
.status-mini-card.retired .status-count { color: var(--primary-dark-gray); }
.status-mini-card.total-assets .status-icon,
.status-mini-card.total-assets .status-count { color: var(--secondary-blue); }

/* Ensure maintenance status icons are orange colored */
.status-mini-card.in_maintenance .status-icon { 
  color: var(--secondary-orange) !important; 
}
.status-mini-card.maintenance .status-icon { 
  color: var(--secondary-orange) !important; 
}

.status-count {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.status-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-dark-gray);
  margin-bottom: 0.2rem;
}

.status-percent {
  font-size: 0.7rem;
  color: var(--primary-dark-gray);
}


.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background-color: rgba(51, 31, 234, 0.02);
}

.activity-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-size: 0.75rem;
  color: white;
  flex-shrink: 0;
}

.activity-icon.assigned { background-color: var(--secondary-green); }
.activity-icon.maintenance { background-color: var(--secondary-orange); }
.activity-icon.added { background-color: var(--secondary-purple); }
.activity-icon.returned { background-color: var(--secondary-pink); }
.activity-icon.retired { background-color: var(--primary-dark-gray); }

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.8rem;
  color: var(--primary-black);
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.activity-description {
  font-size: 0.75rem;
  color: var(--primary-dark-gray);
  margin-bottom: 0.2rem;
}

.activity-time {
  font-size: 0.7rem;
  color: var(--primary-dark-gray);
}

/* Button Styles */
.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none !important;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: var(--secondary-purple) !important;
  color: white !important;
}

.btn-primary:hover {
  background-color: #2a19c7 !important;
}

.btn-success {
  background-color: var(--secondary-green) !important;
  color: white !important;
}

.btn-success:hover {
  background-color: #1e9c5a !important;
}

.btn-warning {
  background-color: var(--secondary-orange) !important;
  color: white !important;
}

.btn-warning:hover {
  background-color: #e67d4d !important;
}

.btn-audit {
  background-color: var(--secondary-pink) !important;
  color: white !important;
}

.btn-audit:hover {
  background-color: #e5499a !important;
}

.btn-custom-primary {
  background-color: var(--secondary-purple) !important;
  color: white !important;
  border-radius: 0.375rem !important;
  padding: 0.5rem 1rem !important;
  font-weight: 600 !important;
}

.btn-custom-success {
  background-color: var(--secondary-green) !important;
  color: white !important;
  border-radius: 0.375rem !important;
  padding: 0.5rem 1rem !important;
  font-weight: 600 !important;
}

.btn-text-secondary {
  background-color: transparent !important;
  color: var(--primary-dark-gray) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.375rem !important;
  padding: 0.5rem 1rem !important;
  font-weight: 500 !important;
}

.btn-text-secondary:hover {
  background-color: #F5F5F5 !important;
  color: var(--primary-black) !important;
  border-color: var(--primary-mid-light) !important;
}

.btn-simple-secondary {
  background-color: var(--primary-dark-gray) !important;
  color: white !important;
  border-radius: 0.375rem !important;
  padding: 0.5rem 1rem !important;
  font-weight: 500 !important;
}

.btn-simple-success {
  background-color: #28a745 !important;
  color: white !important;
  border-radius: 0.375rem !important;
  padding: 0.5rem 1rem !important;
  font-weight: 500 !important;
}

/* Badge Styles */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  white-space: nowrap;
}

.badge-available {
  background-color: var(--secondary-green) !important;
  color: white !important;
}

.badge-assigned {
  background-color: var(--secondary-purple) !important;
  color: white !important;
}

.badge-under-repair {
  background-color: var(--secondary-orange) !important;
  color: white !important;
}

.badge-retired {
  background-color: var(--primary-dark-gray) !important;
  color: white !important;
}

/* Modal Styles */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: var(--primary-white) !important;
  border: none !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 4px 20px rgba(10, 10, 10, 0.15) !important;
}

.modal-header {
  background-color: var(--primary-white) !important;
  border-bottom: 1px solid var(--element-gray) !important;
  padding: 1.25rem !important;
}

.modal-title {
  color: var(--primary-black) !important;
  font-weight: 600 !important;
  font-size: 1.25rem !important;
}

.modal-body {
  background-color: var(--primary-white) !important;
  padding: 1.5rem !important;
}

.modal-footer {
  background-color: var(--primary-white) !important;
  border-top: 1px solid var(--element-gray) !important;
  padding: 1rem 1.25rem !important;
}

/* Table Styles */
.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
  transition: all 0.2s ease;
}

.table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Form Styles */
.form-select,
.form-control {
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.form-select:focus,
.form-control:focus {
  border-color: var(--secondary-purple);
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
}

.form-label {
  font-weight: 500;
  color: var(--primary-black);
  margin-bottom: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .status-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .status-mini-card {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 0.5rem;
  }
  
  .status-icon {
    margin-right: 0.5rem;
    margin-bottom: 0;
  }
  
  .status-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-count {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .compact-chart-card {
    margin-bottom: 1.5rem;
  }
  
  .mini-chart-container {
    height: 100px;
  }
  
  .total-value {
    font-size: 1.5rem;
  }
  
  .activity-item {
    padding: 0.5rem;
  }
  
  .activity-icon {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }
  
  .report-card {
    margin-bottom: 1.5rem;
  }
}

/* Dashboard-like stats cards for quick reports */
.stats-card-modern {
  border-radius: 0.75rem !important;
  border: 1px solid var(--element-gray) !important;
  background-color: var(--primary-white) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  transition: none !important;
  overflow: hidden;
  background-clip: padding-box;
}

.stats-card-modern .card-body {
  border-radius: inherit;
}

/* Color variants for icons to match dashboard */
.stats-icon.bg-warning { background-color: var(--secondary-orange) !important; color: white !important; }
.stats-icon.bg-info { background-color: var(--secondary-purple) !important; color: white !important; }
.stats-icon.bg-success { background-color: var(--secondary-green) !important; color: white !important; }
.stats-icon.bg-secondary { background-color: var(--secondary-red) !important; color: white !important; }
.stats-icon.bg-primary { background-color: var(--secondary-purple) !important; color: white !important; }

/* Keep buttons interactive; do not disable pointer events here */
</style> 