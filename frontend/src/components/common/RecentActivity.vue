<template>
  <div class="recent-activity">
    <div class="card h-100">
      <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 class="card-title mb-0">
          <i class="fas fa-clock me-2"></i>{{ title }}
        </h5>
        <router-link
          v-if="viewAllRoute"
          :to="viewAllRoute"
          class="btn btn-gray btn-modern btn-sm view-all-btn"
        >
          {{ viewAllLabel }}
          <i class="fas fa-arrow-right ms-1"></i>
        </router-link>
      </div>
      <div class="card-body p-0">
        <div class="activity-list" :class="layoutClass">
          <!-- Loading state -->
          <div v-if="isLoading" class="activity-item" v-for="n in 4" :key="'loading-' + n">
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
          <div v-else-if="activities.length > 0" v-for="activity in activities" :key="activity.id" 
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
</template>

<script setup lang="ts">

// Props
interface Activity {
  id: string
  title: string
  description: string
  timeAgo: string
  needsRealTimeUpdate: boolean
  timestamp: Date
}

interface Props {
  activities: Activity[]
  isLoading?: boolean
  title?: string
  maxHeight?: string
  /**
   * Optional vue-router target. When provided, a "View All" link
   * appears in the card header pointing to it.
   */
  viewAllRoute?: string | { name?: string; path?: string; params?: Record<string, string | number>; query?: Record<string, string | number> }
  /** Label for the "View All" link. */
  viewAllLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  title: 'Recent Activity',
  maxHeight: '400px',
  viewAllRoute: undefined,
  viewAllLabel: 'View All',
})

// Computed class for different layouts
import { computed } from 'vue'
const layoutClass = computed(() => {
  return props.maxHeight === '400px' ? 'dashboard-layout' : 'reports-layout'
})

// Helper functions for activity display
const getActivityType = (title: string): string => {
  if (title.includes('Maintenance')) return 'maintenance'
  if (title.includes('Assignment')) return 'assigned'
  return 'added'
}

const getActivityIcon = (title: string): string => {
  if (title.includes('Asset')) return 'fas fa-laptop'
  if (title.includes('Assignment')) return 'fas fa-exchange-alt'
  if (title.includes('Maintenance')) return 'fas fa-tools'
  if (title.includes('Employee')) return 'fas fa-user'
  if (title.includes('Vendor')) return 'fas fa-building'
  if (title.includes('Admin User')) return 'fas fa-user-shield'
  if (
    title.includes('Brand') ||
    title.includes('Model') ||
    title.includes('Category') ||
    title.includes('Type')
  ) {
    return 'fas fa-tags'
  }
  return 'fas fa-circle'
}
</script>

<style scoped>
/*
 * The component caps the OUTER card to maxHeight (e.g. 360px on Reports,
 * 400px on Dashboard) and lets the inner activity list fill whatever
 * remains under the header. Using flex with min-height: 0 on the body
 * ensures the scroll area shrinks to fit so the last row is always
 * reachable instead of being clipped behind the parent card.
 */
.recent-activity {
  height: 100%;
}

.recent-activity > .card {
  height: v-bind(maxHeight);
  max-height: v-bind(maxHeight);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.recent-activity > .card > .card-header {
  flex-shrink: 0;
}

.recent-activity > .card > .card-body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.view-all-btn {
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
}

/* Activity list fills the remaining card body and scrolls internally
   so the full last row is always visible (no clipping at the bottom). */
.activity-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  background: transparent;
  border-top: 1px solid var(--element-gray);
  border-radius: 0;
  margin: 0;
  transition: none;
}

.activity-item:first-child {
  border-top: none;
}

/* Dashboard layout: up to 15 items in 400px total height (scrollable) */
.dashboard-layout .activity-item {
  min-height: calc((400px - 52px - 4px) / 15);
}

/* Reports layout: up to 15 items in 360px (scrollable) */
.reports-layout .activity-item {
  min-height: calc((360px - 41px - 4px) / 15);
}



.activity-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  font-size: 0.7rem;
  color: white;
  flex-shrink: 0;
}

.activity-icon.added { background-color: var(--secondary-purple); }
.activity-icon.assigned { background-color: var(--secondary-green); }
.activity-icon.maintenance { background-color: var(--secondary-orange); }

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.78rem;
  color: var(--primary-black);
  font-weight: 500;
  margin-bottom: 0.1rem;
}

.activity-description {
  font-size: 0.72rem;
  color: var(--primary-dark-gray);
  margin-bottom: 0;
}

.activity-time {
  font-size: 0.68rem;
  color: var(--primary-dark-gray);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .activity-item {
    padding: 0.5rem;
  }
  
  .activity-icon {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }
}
</style>
