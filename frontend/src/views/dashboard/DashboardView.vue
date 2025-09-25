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
                <div class="progress-bar bg-success" style="width: 71.5%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Assets -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-info rounded-circle p-3">
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
                <div class="progress-bar bg-info" style="width: 25%"></div>
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
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="fas fa-clock me-2"></i>Recent Activities
              </h5>
              <button class="btn btn-sm btn-outline-primary dashboard-btn" @click="viewAllActivities">View All</button>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <!-- Loading state -->
                <div v-if="isLoadingAnalytics" class="list-group-item border-0 px-0" v-for="n in 4" :key="'loading-' + n">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="placeholder-glow">
                        <span class="placeholder col-6"></span>
                      </div>
                      <div class="placeholder-glow mt-1">
                        <small class="placeholder col-8"></small>
                      </div>
                    </div>
                    <div class="placeholder-glow">
                      <small class="placeholder col-3"></small>
                    </div>
                  </div>
                </div>
                
                <!-- Actual data -->
                <div v-else-if="recentActivities.length > 0" v-for="activity in recentActivities" :key="activity.id" 
                     class="list-group-item d-flex justify-content-between align-items-start border-0 px-0">
                  <div class="ms-2 me-auto">
                    <div class="fw-bold">{{ activity.title }}</div>
                    <small class="text-muted">{{ activity.description }}</small>
                  </div>
                  <small class="text-muted">{{ activity.timeAgo }}</small>
                </div>
                
                <!-- No data state -->
                <div v-else class="list-group-item border-0 px-0 text-center py-4">
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
            <div class="card-body">
              <!-- Laptops -->
              <div class="asset-distribution-item mb-4">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <div class="d-flex align-items-center">
                    <div class="asset-type-icon laptops me-3">
                      <i class="fas fa-laptop"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">Laptops</div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold" style="color: #0A0A0A;">{{ assetDistribution.laptops.percentage }}%</div>
                  </div>
                </div>
                <div class="progress asset-progress">
                  <div class="progress-bar progress-bar-laptops" :style="`width: ${assetDistribution.laptops.percentage}%`"></div>
                </div>
              </div>

              <!-- Monitors -->
              <div class="asset-distribution-item mb-4">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <div class="d-flex align-items-center">
                    <div class="asset-type-icon monitors me-3">
                      <i class="fas fa-desktop"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">Monitors</div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold" style="color: #0A0A0A;">{{ assetDistribution.monitors.percentage }}%</div>
                  </div>
                </div>
                <div class="progress asset-progress">
                  <div class="progress-bar progress-bar-monitors" :style="`width: ${assetDistribution.monitors.percentage}%`"></div>
                </div>
              </div>

              <!-- Mobile Devices -->
              <div class="asset-distribution-item mb-4">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <div class="d-flex align-items-center">
                    <div class="asset-type-icon mobile me-3">
                      <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">Mobile Devices</div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold" style="color: #0A0A0A;">{{ assetDistribution.mobile.percentage }}%</div>
                  </div>
                </div>
                <div class="progress asset-progress">
                  <div class="progress-bar progress-bar-mobile" :style="`width: ${assetDistribution.mobile.percentage}%`"></div>
                </div>
              </div>

              <!-- Accessories -->
              <div class="asset-distribution-item">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <div class="d-flex align-items-center">
                    <div class="asset-type-icon accessories me-3">
                      <i class="fas fa-headphones"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-dark">Accessories</div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold" style="color: #0A0A0A;">{{ assetDistribution.accessories.percentage }}%</div>
                  </div>
                </div>
                <div class="progress asset-progress">
                  <div class="progress-bar progress-bar-accessories" :style="`width: ${assetDistribution.accessories.percentage}%`"></div>
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

// Recent activities data (used by template)
const recentActivities = ref<Array<{
  id: string
  title: string
  description: string
  timeAgo: string
}>>([])

// Asset distribution data (used by template)
const assetDistribution = ref({
  laptops: {
    assigned: 0,
    total: 0,
    percentage: 0
  },
  monitors: {
    assigned: 0,
    total: 0,
    percentage: 0
  },
  mobile: {
    assigned: 0,
    total: 0,
    percentage: 0
  },
  accessories: {
    assigned: 0,
    total: 0,
    percentage: 0
  }
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
  // TODO: Navigate to add asset page when ready
  console.log('Navigate to Add Asset')
}

const navigateToIssueAsset = () => {
  // TODO: Navigate to issue asset page when ready
  console.log('Navigate to Issue Asset')
}

const navigateToCollectAsset = () => {
  // TODO: Navigate to collect asset page when ready
  console.log('Navigate to Collect Asset')
}

const navigateToScheduleMaintenance = () => {
  router.push('/maintenance')
}

const viewAllActivities = () => {
  // TODO: Navigate to activities page when ready
  console.log('View All Activities')
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
  
  // Auto-refresh every 3 minutes
  refreshIntervalId = window.setInterval(refreshDashboard, 180_000)
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
})
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

/* Ensure quick action cards use proper cursor */
.quick-action-card {
  cursor: pointer;
}

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
.stats-icon.bg-success { background-color: var(--secondary-green) !important; color: white !important; }
.stats-icon.bg-secondary { background-color: var(--secondary-red) !important; color: white !important; }
/* Primary variant for Total Assets */
.stats-icon.bg-primary { background-color: var(--secondary-purple) !important; color: white !important; }

/* Progress bar colors to match maintenance */
.progress-bar.bg-warning { background-color: var(--secondary-orange) !important; }
.progress-bar.bg-info { background-color: var(--secondary-purple) !important; }
.progress-bar.bg-success { background-color: var(--secondary-green) !important; }
.progress-bar.bg-secondary { background-color: var(--secondary-red) !important; }
/* Primary variant for Total Assets */
.progress-bar.bg-primary { background-color: var(--secondary-purple) !important; }
</style>