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
                <div class="progress-bar bg-primary" style="width: 100%"></div>
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

        <!-- Available Assets -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-pink rounded-circle p-3">
                  <i class="fas fa-warehouse fa-lg"></i>
                </div>
                                  <div class="text-end">
                    <div class="text-dark small mb-1 fw-semibold">Available Assets</div>
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
                <div class="progress-bar bg-warning" style="width: 3.4%"></div>
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
              <div class="status-indicator me-2"></div>
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
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-clock me-2"></i>Last 24 Hours
              </h5>
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
                    <div class="activity-time">{{ activity.timeAgo || 'Unknown' }}</div>
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
        
        <div class="col-12 col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-chart-pie me-2"></i>Asset Distribution
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="asset-distribution-list">
                <div v-for="item in assetDistribution" :key="item.name" class="asset-distribution-item mb-4">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <div class="d-flex align-items-center">
                    <div class="asset-type-icon me-3" :class="getCategoryClass(item.name)">
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
                  <div class="progress-bar" :class="getCategoryBarClass(item.name)" :style="`width: ${item.percentage}%`"></div>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dashboardApi } from '@/services/dashboardApi'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

// Loading states
const isLoadingStats = ref(true)
const isLoadingAnalytics = ref(true)

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

// Percentages for top cards
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
      availableAssets: stats.available,
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
    
    // Transform asset distribution data
    const distribution = dashboardApi.transformAssetDistribution(analytics.assetDistribution)
    assetDistribution.value = distribution
    
    // Transform status overview to update stats if needed
    const statusStats = dashboardApi.transformStatusOverview(analytics.statusOverview)
    dashboardStats.value = {
      ...dashboardStats.value,
      assignedAssets: statusStats.assignedAssets || dashboardStats.value.assignedAssets
    }
    
    // Transform recent activities
    recentActivities.value = dashboardApi.transformRecentActivity(analytics.recentActivity)
    
  } catch (err) {
    console.error('Error loading analytics data:', err)
  } finally {
    isLoadingAnalytics.value = false
  }
}

// Navigation methods
const navigateToAddAsset = () => {
  router.push('/app/assets/add')
}

const navigateToIssueAsset = () => {
  router.push('/app/assets/issue')
}

const navigateToCollectAsset = () => {
  router.push('/app/assets/collect')
}

const navigateToScheduleMaintenance = () => {
  router.push('/app/maintenance/schedule')
}


// Refresh dashboard data
const refreshDashboard = async () => {
  await Promise.all([
    loadDashboardStats(),
    loadAnalyticsData()
  ])
}

// Load dashboard data on mount
onMounted(async () => {
  await refreshDashboard()
  
  // Update relative "Updated X minutes ago" every 30 seconds
  updatedTickerId = window.setInterval(updateLastUpdatedDisplay, 30_000)
  
  // Update real-time activity times every minute for minute-level updates
  realTimeUpdateId = window.setInterval(updateRealTimeActivityTimes, 60_000)
  
  // Smart refresh strategy:
  // - Full refresh every 5 minutes for fresh data
  // - Real-time updates every minute for time display
  refreshIntervalId = window.setInterval(refreshDashboard, 300_000)
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
.dashboard-page {
  background: var(--primary-white);
  min-height: 100vh;
}

/* Status Indicator Animation */
.status-indicator {
  width: 8px;
  height: 8px;
  background-color: var(--secondary-green);
  border-radius: 50%;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(33, 175, 101, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 175, 101, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 175, 101, 0);
  }
}

/* Override any card hover effects for stats cards */
.stats-card-modern:hover {
  transform: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  cursor: default !important;
}

/* Quick action cards inherit styles from global CSS */

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem 0;
  }
  
  .quick-action-card {
    padding: 1.25rem 0.75rem;
    min-height: 100px;
  }
  
  .quick-action-card .action-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .quick-action-card .action-title {
    font-size: 0.8rem;
    line-height: 1.2;
  }
}

/* Match MaintenanceView.vue card visuals */
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

/* Disable hover/interactions and force visuals to stay consistent */
.stats-card-modern,
.stats-card-modern *,
.stats-card-modern:hover,
.stats-card-modern:hover *,
.stats-card-modern:focus,
.stats-card-modern:active {
  transition: none !important;
  transform: none !important;
  cursor: default !important;
}

/* Prevent hover interactions entirely */
.stats-card-modern {
  pointer-events: none;
}

/* Force same visuals on interactive states */
.stats-card-modern,
.stats-card-modern:hover,
.card.stats-card-modern:hover,
.stats-card-modern:focus,
.card.stats-card-modern:focus,
.stats-card-modern:active,
.card.stats-card-modern:active,
.stats-card-modern .card-body,
.stats-card-modern:hover .card-body {
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  transform: none !important;
}

/* Stats icon background colors to match maintenance */
.stats-icon.bg-warning { background-color: var(--secondary-orange) !important; color: white !important; }
.stats-icon.bg-info { background-color: var(--secondary-purple) !important; color: white !important; }
.stats-icon.bg-pink { background-color: var(--secondary-pink) !important; color: white !important; }
.stats-icon.bg-success { background-color: var(--secondary-green) !important; color: white !important; }
.stats-icon.bg-secondary { background-color: var(--secondary-red) !important; color: white !important; }
/* Primary variant for Total Assets */
.stats-icon.bg-primary { background-color: var(--secondary-purple) !important; color: white !important; }

/* Progress bar colors to match maintenance */
.progress-bar.bg-warning { background-color: var(--secondary-orange) !important; }
.progress-bar.bg-info { background-color: var(--secondary-purple) !important; }
.progress-bar.bg-pink { background-color: var(--secondary-pink) !important; }
.progress-bar.bg-success { background-color: var(--secondary-green) !important; }
.progress-bar.bg-secondary { background-color: var(--secondary-red) !important; }
/* Primary variant for Total Assets */
.progress-bar.bg-primary { background-color: var(--secondary-purple) !important; }

/* Activity List - Fixed height with scrollbar */
.activity-list {
  height: 400px; /* Fixed height for consistent card sizing */
  overflow-y: auto; /* Always show scrollbar when content exceeds height */
}

/* Asset Distribution List - Fixed height with scrollbar */
.asset-distribution-list {
  height: 400px; /* Same fixed height as activity list */
  overflow-y: auto; /* Always show scrollbar when content exceeds height */
  padding: 1rem; /* Add padding since card-body padding was removed */
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem; /* Slightly reduced padding to fit more items */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background-color: rgba(51, 31, 234, 0.02);
  /* Preserve original text and icon colors */
}

.activity-icon {
  width: 28px; /* Slightly smaller icon */
  height: 28px; /* Slightly smaller icon */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-size: 0.75rem; /* Slightly smaller font */
  color: white;
  flex-shrink: 0; /* Prevent icon from shrinking */
}

.activity-icon.added { background-color: var(--secondary-purple); }
.activity-icon.assigned { background-color: var(--secondary-green); }
.activity-icon.maintenance { background-color: var(--secondary-orange); }

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
</style>