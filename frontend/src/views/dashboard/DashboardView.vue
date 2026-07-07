<template>
  <div class="dashboard-page">
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0" style="color: var(--primary-black);">Dashboard</h2>
          <p class="text-muted mb-0">Overview of assets, assignments, maintenance, and recent activity</p>
        </div>
      </div>
      <!-- Stats Cards - Modern Design -->
      <div class="row mb-4">
        <!-- Total Assets -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-primary rounded-circle p-3">
                  <i class="fas fa-laptop fa-lg"></i>
                </div>
                                  <div class="text-end">
                    <div class="text-dark small mb-1 fw-semibold">Total Assets</div>
                    <div class="h3 mb-0 fw-bold text-dark">
                      <span v-if="isLoadingStats" class="placeholder-glow">
                        <span class="placeholder col-4"></span>
                      </span>
                      <span v-else>{{ dashboardStats.totalAssets }}</span>
                    </div>
                  </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-primary" :style="{ width: `${totalPercent.toFixed(1)}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assigned Assets -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-success rounded-circle p-3">
                  <i class="fas fa-user-check fa-lg"></i>
                </div>
                                  <div class="text-end">
                    <div class="text-dark small mb-1 fw-semibold">Assigned Assets</div>
                    <div class="h3 mb-0 fw-bold text-dark">
                      <span v-if="isLoadingStats" class="placeholder-glow">
                        <span class="placeholder col-4"></span>
                      </span>
                      <span v-else>{{ dashboardStats.assignedAssets }}</span>
                    </div>
                  </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-success" :style="{ width: `${assignedPercent.toFixed(1)}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Non Assigned Assets -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-pink rounded-circle p-3">
                  <i class="fas fa-warehouse fa-lg"></i>
                </div>
                                  <div class="text-end">
                    <div class="text-dark small mb-1 fw-semibold">Non Assigned Assets</div>
                    <div class="h3 mb-0 fw-bold text-dark">
                      <span v-if="isLoadingStats" class="placeholder-glow">
                        <span class="placeholder col-4"></span>
                      </span>
                      <span v-else>{{ dashboardStats.availableAssets }}</span>
                    </div>
                  </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-pink" :style="{ width: `${availablePercent.toFixed(1)}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Under Maintenance -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-warning rounded-circle p-3">
                  <i class="fas fa-tools fa-lg"></i>
                </div>
                                  <div class="text-end">
                    <div class="text-dark small mb-1 fw-semibold">In Maintenance</div>
                    <div class="h3 mb-0 fw-bold text-dark">
                      <span v-if="isLoadingStats" class="placeholder-glow">
                        <span class="placeholder col-4"></span>
                      </span>
                      <span v-else>{{ dashboardStats.maintenanceAssets }}</span>
                    </div>
                  </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-warning" :style="{ width: `${maintenancePercent.toFixed(1)}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Updated Status Line -->
      <div class="row mb-2">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center" style="margin-top: -20px;">
            <div></div>
            <div class="d-flex align-items-center">
              <StatusIndicator variant="success" :size="8" class="me-2" />
              <small class="text-muted">Updated {{ lastUpdated }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-4" style="margin-top: -5px;">
        <h5 class="mb-3" style="color: #0A0A0A;">
          <i class="fas fa-bolt me-2"></i>Quick Actions
        </h5>
        <div class="row">
          <div class="col-6 col-md-3 mb-3">
            <div class="quick-action-card primary" @click="navigateToAddAsset">
              <div class="action-icon">
                <i class="fas fa-plus"></i>
              </div>
              <div class="action-title">Add New Asset</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <div class="quick-action-card success" @click="navigateToIssueAsset">
              <div class="action-icon">
                <i class="fas fa-user-plus"></i>
              </div>
              <div class="action-title">Issue Asset</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <div class="quick-action-card warning" @click="navigateToCollectAsset">
              <div class="action-icon">
                <i class="fas fa-user-minus"></i>
              </div>
              <div class="action-title">Collect Asset</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <div class="quick-action-card danger" @click="navigateToScheduleMaintenance">
              <div class="action-icon">
                <i class="fas fa-wrench"></i>
              </div>
              <div class="action-title">Schedule Maintenance</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities & Asset Overview -->
      <div class="row">
        <div class="col-12 col-lg-6 mb-4">
          <RecentActivity 
            :activities="recentActivities"
            :isLoading="isLoadingRecentActivities"
            title="Recent Activity"
            maxHeight="400px"
            :view-all-route="{ name: 'admin-audit' }"
            view-all-label="View All"
          />
        </div>
        
        <div class="col-12 col-lg-6 mb-4">
          <div class="card h-100 asset-distribution-card">
            <div class="card-header d-flex align-items-center">
              <h5 class="card-title mb-0">
                <i class="fas fa-chart-pie me-2"></i>Asset Distribution
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="asset-distribution-list">
                <div v-for="(item, index) in assetDistribution" :key="item.name" class="asset-distribution-item mb-4">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <div class="d-flex align-items-center">
                    <div class="asset-type-icon me-3" :class="getCategoryClassByIndex(index)">
                      <i :class="getCategoryIcon(item.name)"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ item.name }}</div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold" style="color: #0A0A0A;">{{ item.percentage }}%</div>
                  </div>
                </div>
                <div class="progress asset-progress">
                  <div class="progress-bar" :class="`progress-bar-${getCategoryClassByIndex(index)}`" :style="{ width: `${(assetDistributionDisplayPercent[index] ?? 0).toFixed(1)}%` }"></div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dashboardApi } from '@/services/api/dashboardApi'
import { auditApi } from '@/services/api/auditApi'
import { RecentActivity, StatusIndicator } from '@/components/common'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const buildReturnToParam = () => encodeURIComponent(route.fullPath || '/app/dashboard')

const user = computed(() => authStore.user)

// Loading states
const isLoadingStats = ref(true)
const isLoadingAnalytics = ref(true)
const isLoadingRecentActivities = ref(true)

// Add after the loading states
const error = ref<string | null>(null)

// Dashboard stats data
const dashboardStats = ref({
  totalAssets: 0,
  assignedAssets: 0,
  availableAssets: 0,
  maintenanceAssets: 0
})

// Last updated tracking
const lastUpdated = ref('Loading...')
let lastUpdatedAt: number | null = null
let refreshIntervalId: number | undefined
let updatedTickerId: number | undefined
let realTimeUpdateId: number | undefined

// Recent activities data (used by template)
const recentActivities = ref<Array<{
  id: string
  title: string
  description: string
  timeAgo: string
  needsRealTimeUpdate: boolean
  timestamp: Date
}>>([])

// Asset distribution data (dynamic list from backend)
const assetDistribution = ref<Array<{ name: string; percentage: number; count?: number }>>([])
// Animated widths for distribution bars (0 → percentage on load)
const assetDistributionDisplayPercent = ref<number[]>([])

watch(assetDistribution, (list) => {
  const targetPercentages = list.map((item) => item.percentage)
  assetDistributionDisplayPercent.value = list.map(() => 0)
  nextTick(() => {
    // Double rAF so the 0% state is painted before we set final widths (transition then runs)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        assetDistributionDisplayPercent.value = targetPercentages
      })
    })
  })
}, { immediate: true })

// Extended color palette for asset types (repeats after initial set)
const assetTypeColors = [
  'laptops',      // purple
  'monitors',     // green
  'mobile',       // pink
  'accessories',  // orange
  'desktops',     // blue
  'tablets',      // brown
  'laptops',      // purple (repeat)
  'monitors',     // green (repeat)
  'mobile',       // pink (repeat)
  'accessories',  // orange (repeat)
  'desktops',     // blue (repeat)
  'tablets'       // brown (repeat)
]

// Get color class by index (supports repeating colors)
const getCategoryClassByIndex = (index: number): string => {
  return assetTypeColors[index % assetTypeColors.length]
}

// Percentages for top cards (Total Assets: 100% when loaded, 0 when loading – animates on load)
const totalPercent = computed(() => {
  const total = dashboardStats.value.totalAssets
  if (isLoadingStats.value || !total || total <= 0) return 0
  return 100
})

const assignedPercent = computed(() => {
  const total = dashboardStats.value.totalAssets
  if (!total || total <= 0) return 0
  const assigned = Math.max(0, Math.min(total, dashboardStats.value.assignedAssets))
  return (assigned / total) * 100
})

const availablePercent = computed(() => {
  const total = dashboardStats.value.totalAssets
  if (!total || total <= 0) return 0
  const available = Math.max(0, Math.min(total, dashboardStats.value.availableAssets))
  return (available / total) * 100
})

const maintenancePercent = computed(() => {
  const total = dashboardStats.value.totalAssets
  if (!total || total <= 0) return 0
  const maintenance = Math.max(0, Math.min(total, dashboardStats.value.maintenanceAssets))
  return (maintenance / total) * 100
})

function formatRelativeUpdated(nowMs: number) {
  if (!lastUpdatedAt) return 'Just now'
  const diffMs = Math.max(0, nowMs - lastUpdatedAt)
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin <= 0) return 'Just now'
  if (diffMin === 1) return '1 minute ago'
  return `${diffMin} minutes ago`
}

function updateLastUpdatedDisplay() {
  lastUpdated.value = formatRelativeUpdated(Date.now())
}

// Update real-time activity times
function updateRealTimeActivityTimes() {
  try {
    // Only update if we have activities
    if (recentActivities.value.length === 0) {
      return
    }
    
    // Use backend's needsRealTimeUpdate flag as primary method
    const needsUpdateActivities = recentActivities.value.filter(activity => activity.needsRealTimeUpdate)
    
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

// Update the loadDashboardStats method
const loadDashboardStats = async () => {
  try {
    isLoadingStats.value = true
    error.value = null
    const stats = await dashboardApi.getDashboardStats()
    
    dashboardStats.value = {
      totalAssets: stats.totalAssets,
      assignedAssets: stats.assigned,
      availableAssets: (stats as any).nonAssigned ?? stats.available,
      maintenanceAssets: stats.maintenance
    }
    
    lastUpdatedAt = Date.now()
    updateLastUpdatedDisplay()
  } catch (err) {
    console.error('Error loading dashboard stats:', err)
    error.value = 'Failed to load dashboard statistics'
    // Keep previous timestamp; still update label
    updateLastUpdatedDisplay()
  } finally {
    isLoadingStats.value = false
  }
}

// Update the loadAnalyticsData method
const loadAnalyticsData = async () => {
  try {
    isLoadingAnalytics.value = true
    const analytics = await dashboardApi.getAnalyticsData()
    
    // Use only categories from backend, sort by percentage descending, and map to { name, percentage, count }
    assetDistribution.value = (analytics.assetDistribution || [])
      .filter((item: any) => (item?.count ?? 0) > 0)
      .map((item: any) => ({ name: item.type, percentage: item.percentage, count: item.count }))
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage descending (highest first)
    
    // Transform status overview to update stats if needed
    const statusStats = dashboardApi.transformStatusOverview(analytics.statusOverview)
    dashboardStats.value = {
      ...dashboardStats.value,
      assignedAssets: statusStats.assignedAssets || dashboardStats.value.assignedAssets
    }
    
  } catch (err) {
    console.error('Error loading analytics data:', err)
  } finally {
    isLoadingAnalytics.value = false
  }
}

const loadRecentActivities = async () => {
  try {
    isLoadingRecentActivities.value = true
    recentActivities.value = await auditApi.getRecentActivities(15)
  } catch (err) {
    console.error('Error loading recent audit activities:', err)
    recentActivities.value = []
  } finally {
    isLoadingRecentActivities.value = false
  }
}

// Navigation methods
const navigateToAddAsset = () => {
  router.push('/app/assets/add')
}

const navigateToIssueAsset = () => {
  router.push({
    path: '/app/assets/issue',
    query: { from: 'dashboard', returnTo: buildReturnToParam() },
  })
}

const navigateToCollectAsset = () => {
  router.push({
    path: '/app/assets/collect',
    query: { from: 'dashboard', returnTo: buildReturnToParam() },
  })
}

const navigateToScheduleMaintenance = () => {
  router.push('/app/maintenance/schedule')
}


// Refresh dashboard data
const refreshDashboard = async () => {
  await Promise.all([
    loadDashboardStats(),
    loadAnalyticsData(),
    loadRecentActivities(),
  ])
}

// Load dashboard data on mount
onMounted(async () => {
  await refreshDashboard()
  
  // Update relative "Updated X minutes ago" every 30 seconds
  updatedTickerId = globalThis.setInterval(updateLastUpdatedDisplay, 30_000)
  
  // Update real-time activity times every minute for minute-level updates
  realTimeUpdateId = globalThis.setInterval(updateRealTimeActivityTimes, 60_000)
  
  // Smart refresh strategy:
  // - Full refresh every 5 minutes for fresh data
  // - Real-time updates every minute for time display
  refreshIntervalId = globalThis.setInterval(refreshDashboard, 300_000)
})

onUnmounted(() => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = undefined
  }
  if (updatedTickerId) {
    clearInterval(updatedTickerId)
    updatedTickerId = undefined
  }
  if (realTimeUpdateId) {
    clearInterval(realTimeUpdateId)
    realTimeUpdateId = undefined
  }
})


// Category helpers for dynamic distribution
const getCategoryIcon = (name: string): string => {
  const v = name.toLowerCase()
  if (v.includes('laptop')) return 'fas fa-laptop'
  if (v.includes('desktop')) return 'fas fa-desktop'
  if (v.includes('monitor') || v.includes('display')) return 'fas fa-tv'
  if (v.includes('mobile') || v.includes('phone')) return 'fas fa-mobile-alt'
  if (v.includes('tablet')) return 'fas fa-tablet-alt'
  if (v.includes('accessor')) return 'fas fa-headphones'
  return 'fas fa-cube'
}

const getCategoryClass = (name: string): string => {
  const v = name.toLowerCase()
  if (v.includes('laptop')) return 'laptops'
  if (v.includes('desktop')) return 'desktops'
  if (v.includes('monitor') || v.includes('display')) return 'monitors'
  if (v.includes('mobile') || v.includes('phone')) return 'mobile'
  if (v.includes('tablet')) return 'tablets'
  if (v.includes('accessor')) return 'accessories'
  return 'others'
}

const getCategoryBarClass = (name: string): string => {
  const base = getCategoryClass(name)
  return `progress-bar-${base}`
}
</script>

<style scoped>
/**
 * Dashboard Page Styles - Pebble Asset Tracker Theme
 * Dashboard specific styling and layout
 */

/* Main Content Container - Responsive margins */
.container-fluid.py-4 {
  max-width: calc(100% - 4rem);
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  background: var(--primary-white);
  min-height: 100vh;
}

/* Dashboard-specific Asset Distribution Styles */
.asset-distribution-item {
  transition: all 0.2s ease;
  padding: 0.5rem;
  border-radius: 0.75rem;
}

.asset-distribution-item:hover {
  background-color: var(--mindstix-light);
}

.asset-type-icon {
  width: 45px;
  height: 45px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  transition: all 0.2s ease;
}

.asset-type-icon.laptops {
  background: var(--secondary-purple);
}

.asset-type-icon.monitors {
  background: var(--secondary-green);
}

.asset-type-icon.mobile {
  background: var(--secondary-pink);
}

.asset-type-icon.accessories {
  background: var(--secondary-orange);
}

.asset-type-icon.desktops {
  background: var(--secondary-blue);
}

.asset-type-icon.tablets {
  background: var(--secondary-brown);
}

.asset-type-icon.others {
  background: var(--primary-mid-gray);
}

.asset-progress {
  height: 8px;
  border-radius: 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.asset-progress .progress-bar {
  transition: width 0.6s ease-out;
}

.asset-progress .progress-bar-laptops,
.asset-progress .progress-bar-monitors,
.asset-progress .progress-bar-mobile,
.asset-progress .progress-bar-accessories,
.asset-progress .progress-bar-desktops,
.asset-progress .progress-bar-tablets,
.asset-progress .progress-bar-others {
  transition: width 0.6s ease-out;
}

.asset-progress .progress-bar-laptops {
  background-color: var(--secondary-purple) !important;
  border-radius: 1rem;
}

.asset-progress .progress-bar-monitors {
  background-color: var(--secondary-green) !important;
  border-radius: 1rem;
}

.asset-progress .progress-bar-mobile {
  background-color: var(--secondary-pink) !important;
  border-radius: 1rem;
}

.asset-progress .progress-bar-accessories {
  background-color: var(--secondary-orange) !important;
  border-radius: 1rem;
}

.asset-progress .progress-bar-desktops {
  background-color: var(--secondary-blue) !important;
  border-radius: 1rem;
}

.asset-progress .progress-bar-tablets {
  background-color: var(--secondary-brown) !important;
  border-radius: 1rem;
}

.asset-progress .progress-bar-others {
  background-color: var(--primary-mid-gray) !important;
  border-radius: 1rem;
}

/* Dashboard-specific Progress Circles */
.progress-circle {
  position: relative;
  display: inline-block;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 14px;
  color: var(--mindstix-dark);
}

/* Dashboard-specific Progress Stacked Fix for Bootstrap 5 with rounded corners */
.progress-stacked {
  display: flex;
  height: 20px;
  border-radius: 1rem;
  overflow: hidden;
  background-color: var(--mindstix-light);
}

.progress-stacked .progress {
  height: 100%;
  background-color: transparent;
}

.progress-bar {
  background-color: var(--mindstix-primary);
}

.progress {
  border-radius: 1rem;
  height: 0.5rem !important;
  background-color: var(--element-gray) !important;
}

/* Dashboard-specific Chart Container */
canvas {
  max-height: 300px;
}

/* Dashboard-specific Employee Avatar */
.employee-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Background color is set dynamically via :style binding */
  color: white; /* White text for better contrast on colored backgrounds */
}

/* Dashboard-specific QR Code Placeholder */
.qr-code-placeholder {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--mindstix-secondary);
}

/* Dashboard-specific Timeline Styles */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--mindstix-border);
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -22px;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--mindstix-primary);
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px var(--mindstix-border);
}

.timeline-content {
  padding-left: 15px;
}

/* Dashboard-specific Responsive Adjustments */
@media (max-width: 1200px) {
  .container-fluid.py-4 {
      max-width: calc(100% - 2rem);
  }
}

@media (max-width: 768px) {
  .container-fluid.py-4 {
      max-width: calc(100% - 1rem);
      padding-left: 0.75rem;
      padding-right: 0.75rem;
  }
  
  .timeline {
      padding-left: 20px;
  }
  
  .timeline-marker {
      left: -17px;
      width: 10px;
      height: 10px;
  }
}

@media (max-width: 576px) {
  .container-fluid.py-4 {
      max-width: 100%;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
  }
}

/* Dashboard Page Specific Styles */

/* Override any card hover effects for stats cards - Dashboard specific */
.stats-card-modern:hover {
  transform: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  cursor: default !important;
}

/* Dashboard-specific stats icon variants */
.stats-icon.bg-pink { 
  background-color: var(--secondary-pink) !important; 
  color: white !important; 
}

.stats-icon.bg-primary { 
  background-color: var(--secondary-purple) !important; 
  color: white !important; 
}

/* Dashboard-specific progress bar variants */
.progress-bar.bg-pink { 
  background-color: var(--secondary-pink) !important; 
}

.progress-bar.bg-primary { 
  background-color: var(--secondary-purple) !important; 
}

/*
 * Same total height as Recent Activity (maxHeight 400px): header + scrollable
 * body. Previously the list alone was 400px, so this card was taller than
 * Recent Activity and misaligned.
 */
.dashboard-page .asset-distribution-card {
  height: 400px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-page :deep(.recent-activity > .card > .card-header),
.dashboard-page .asset-distribution-card > .card-header {
  min-height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  box-sizing: border-box;
}

.dashboard-page .asset-distribution-card > .card-header {
  justify-content: flex-start;
}

.dashboard-page .asset-distribution-card > .card-body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-page .asset-distribution-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
}

/* Dashboard-specific responsive adjustments */
@media (max-width: 768px) {
  .container-fluid.py-4 {
    padding: 1rem 0;
  }
  
  .dashboard-page .quick-action-card {
    padding: 1.25rem 0.75rem;
    min-height: 100px;
  }
  
  .dashboard-page .quick-action-card .action-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .dashboard-page .quick-action-card .action-title {
    font-size: 0.8rem;
    line-height: 1.2;
  }
}
</style>
