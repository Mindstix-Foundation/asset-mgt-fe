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
        <div class="col-12 col-md-6 col-lg-3 mb-3">
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
        
        <div class="col-12 col-md-6 col-lg-3 mb-3">
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
        
        <div class="col-12 col-md-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body text-center p-4">
              <i class="fas fa-tools fa-3x mb-3" style="color: var(--secondary-orange) !important;"></i>
              <h5 class="card-title">Maintenance Report</h5>
              <p class="card-text text-muted">Maintenance history and costs</p>
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
        
        <div class="col-12 col-md-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body text-center p-4">
              <i class="fas fa-chart-line fa-3x mb-3" style="color: var(--secondary-pink) !important;"></i>
              <h5 class="card-title">Audit Log Report</h5>
              <p class="card-text text-muted">Complete audit trail of all activities</p>
              <button class="btn btn-audit">
                <i class="fas fa-download me-1"></i>Generate Excel
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
                <label class="form-label">Report Type</label>
                <select class="form-select" v-model="customFilters.reportType">
                  <option value="assets">Asset Report</option>
                  <option value="employees">Employee Report</option>
                  <option value="maintenance">Maintenance Report</option>
                  <option value="audit">Audit Log Report</option>
                </select>
              </div>

              <div class="col-12 col-md-2 mb-3">
                <label class="form-label">Asset Type</label>
                <select class="form-select" v-model="customFilters.assetType">
                  <option value="">All Types</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div class="col-12 col-md-3 mb-3">
                <label class="form-label">Date Range</label>
                <select class="form-select" v-model="customFilters.dateRange" @change="handleDateRangeChange">
                  <option value="last30">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                  <option value="last6months">Last 6 Months</option>
                  <option value="lastyear">Last Year</option>
                  <option value="alltime">All Time</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
            
            <div class="row" v-if="showCustomDateRange">
              <div class="col-12 col-md-3 mb-3">
                <label class="form-label">From Date</label>
                <input type="date" class="form-control" v-model="customFilters.fromDate">
              </div>
              <div class="col-12 col-md-3 mb-3">
                <label class="form-label">To Date</label>
                <input type="date" class="form-control" v-model="customFilters.toDate">
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
        <div class="col-12 col-xl-3 col-lg-6 mb-4">
          <div class="card compact-chart-card">
            <div class="card-header compact-header">
              <h6 class="mb-0"><i class="fas fa-chart-pie me-2"></i>Asset Distribution</h6>
            </div>
            <div class="card-body p-3">
              <div class="mini-chart-container mb-3 d-flex justify-content-center">
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
        <div class="col-12 col-xl-3 col-lg-6 mb-4">
          <div class="card compact-chart-card">
            <div class="card-header compact-header">
              <h6 class="mb-0"><i class="fas fa-chart-bar me-2"></i>Status Overview</h6>
            </div>
            <div class="card-body p-3">
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
              </div>
            </div>
          </div>
        </div>

        <!-- Asset Value Distribution -->
        <div class="col-12 col-xl-3 col-lg-6 mb-4">
          <div class="card compact-chart-card">
            <div class="card-header compact-header">
              <h6 class="mb-0"><i class="bi bi-currency-rupee me-2"></i>Value Distribution</h6>
            </div>
            <div class="card-body p-3">
              <div class="value-summary mb-3">
                <div class="total-value">₹{{ formatCurrency(analyticsData.totalValue) }}</div>
                <div class="total-label">Total Asset Value</div>
              </div>
              <div class="value-breakdown">
                <div 
                  v-for="item in analyticsData.assetDistribution" 
                  :key="item.type"
                  class="value-row"
                >
                  <div class="value-bar">
                    <div 
                      class="value-fill" 
                      :style="{ 
                        width: `${(item.value / analyticsData.totalValue) * 100}%`, 
                        backgroundColor: getColorForType(item.type) 
                      }"
                    ></div>
                  </div>
                  <span class="value-text">{{ item.type }} ₹{{ formatCurrency(item.value) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="col-12 col-xl-3 col-lg-6 mb-4">
          <div class="card compact-chart-card">
            <div class="card-header compact-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0"><i class="fas fa-clock me-2"></i>Recent Activity</h6>
              <small class="text-muted">Last 24h</small>
            </div>
            <div class="card-body p-0">
              <div class="activity-list">
                <div 
                  v-for="activity in analyticsData.recentActivity" 
                  :key="activity.id"
                  class="activity-item"
                >
                  <div class="activity-icon" :class="activity.type">
                    <i :class="getActivityIcon(activity.type)"></i>
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.description }}</div>
                    <div class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</div>
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
                  <tr v-for="item in previewData" :key="item.id || item.assetId || item.employeeId">
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
import { ref, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { reportsApi, type ReportFilters, type AnalyticsData } from '@/services/reportsApi'

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

// Chart refs
const assetDistributionChart = ref<HTMLCanvasElement>()

// Filters
const customFilters = ref<ReportFilters>({
  reportType: 'assets',
  assetType: '',
  dateRange: 'last30',
  fromDate: '',
  toDate: ''
})

// Helper to read CSS variables defined in main.css
const getCssVar = (name: string, fallback: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

// Methods
const loadAnalyticsData = async () => {
  try {
    isLoadingAnalytics.value = true
    analyticsData.value = await reportsApi.getAnalytics()
    await nextTick()
    initializeCharts()
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

      new Chart(ctx, {
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
    }
  }
}

const handleQuickExport = async (reportType: string) => {
  try {
    isExporting.value = true
    exportingType.value = reportType
    
    let blob: Blob
    let filename: string
    
    switch (reportType) {
      case 'asset-inventory':
        blob = await reportsApi.exportAssetInventory()
        filename = `asset_inventory_report_${new Date().toISOString().split('T')[0]}.xlsx`
        break
      case 'employee-assets':
        blob = await reportsApi.exportEmployeeAssets()
        filename = `employee_assets_report_${new Date().toISOString().split('T')[0]}.xlsx`
        break
      case 'maintenance':
        blob = await reportsApi.exportMaintenance()
        filename = `maintenance_report_${new Date().toISOString().split('T')[0]}.xlsx`
        break
      default:
        throw new Error('Unknown report type')
    }
    
    reportsApi.downloadFile(blob, filename)
    showNotification('Report exported successfully!', 'success')
  } catch (error) {
    console.error('Error exporting report:', error)
    showNotification('Failed to export report', 'error')
  } finally {
    isExporting.value = false
    exportingType.value = ''
  }
}

const handleCustomExport = async (format: string) => {
  try {
    isExporting.value = true
    exportingType.value = `custom-${format}`
    
    const filters = { ...customFilters.value }
    delete filters.dateRange
    
    let blob: Blob
    let filename: string
    
    switch (customFilters.value.reportType) {
      case 'assets':
        blob = await reportsApi.exportAssetInventory(filters)
        filename = `custom_asset_report_${new Date().toISOString().split('T')[0]}.xlsx`
        break
      case 'employees':
        blob = await reportsApi.exportEmployeeAssets(filters)
        filename = `custom_employee_report_${new Date().toISOString().split('T')[0]}.xlsx`
        break
      case 'maintenance':
        blob = await reportsApi.exportMaintenance(filters)
        filename = `custom_maintenance_report_${new Date().toISOString().split('T')[0]}.xlsx`
        break
      default:
        throw new Error('Unknown report type')
    }
    
    reportsApi.downloadFile(blob, filename)
    showNotification('Custom report exported successfully!', 'success')
    showPreviewModal.value = false
  } catch (error) {
    console.error('Error exporting custom report:', error)
    showNotification('Failed to export custom report', 'error')
  } finally {
    isExporting.value = false
    exportingType.value = ''
  }
}

const loadPreviewData = async () => {
  try {
    isLoadingPreview.value = true
    const filters = { ...customFilters.value }
    delete filters.dateRange
    
    const response = await reportsApi.getReportPreview(customFilters.value.reportType || 'assets', filters)
    previewData.value = response.data
    previewTotal.value = response.total
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
    'RETIRED': 'fas fa-archive'
  }
  return icons[status] || 'fas fa-question-circle'
}

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'assigned': 'fas fa-laptop',
    'maintenance': 'fas fa-tools',
    'added': 'fas fa-plus',
    'returned': 'fas fa-undo',
    'retired': 'fas fa-archive'
  }
  return icons[type] || 'fas fa-circle'
}

const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M'
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K'
  }
  return amount.toString()
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
    'maintenance': 'Maintenance Report',
    'audit': 'Audit Log Report'
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
        { key: 'department', label: 'Department', width: '120px' },
        { key: 'position', label: 'Position', width: '120px' },
        { key: 'totalAssetsAssigned', label: 'Total Assets', width: '100px' },
        { key: 'totalAssetValue', label: 'Total Value', width: '120px', type: 'currency' }
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
        { key: 'vendor', label: 'Vendor', width: '120px' }
      ]
    default:
      return []
  }
}

const getBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    'ASSIGNED': 'badge-assigned',
    'AVAILABLE': 'badge-available',
    'MAINTENANCE': 'badge-under-repair',
    'RETIRED': 'badge-retired'
  }
  return classes[status] || 'badge-secondary'
}

const formatCellValue = (value: any, type?: string): string => {
  if (value === null || value === undefined) return '-'
  
  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString()
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

// Lifecycle
onMounted(() => {
  loadAnalyticsData()
  handleDateRangeChange()
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
  height: 120px;
}

.compact-stats .stat-row {
  display: flex;
  align-items: center;
  padding: 0.4rem 0;
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
.status-mini-card.maintenance .status-icon,
.status-mini-card.maintenance .status-count { color: var(--secondary-orange); }
.status-mini-card.retired .status-icon,
.status-mini-card.retired .status-count { color: var(--primary-dark-gray); }

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

.value-summary {
  text-align: center;
  padding: 1rem 0;
  background-color: rgba(51, 31, 234, 0.05);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.total-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--secondary-purple);
  margin-bottom: 0.2rem;
}

.total-label {
  font-size: 0.75rem;
  color: var(--primary-dark-gray);
  font-weight: 600;
}

.value-breakdown .value-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.value-bar {
  width: 60px;
  height: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  margin-right: 0.75rem;
  overflow: hidden;
}

.value-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease;
}

.value-text {
  font-size: 0.8rem;
  color: var(--primary-dark-gray);
  font-weight: 500;
}

.activity-list {
  max-height: 280px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background-color: rgba(51, 31, 234, 0.02);
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-size: 0.8rem;
  color: white;
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
@media (max-width: 1200px) {
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