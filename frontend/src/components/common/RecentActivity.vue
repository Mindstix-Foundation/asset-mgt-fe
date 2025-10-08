<template>
  <div class="recent-activity">
    <div class="card h-100">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="fas fa-clock me-2"></i>{{ title }}
        </h5>
      </div>
      <div class="card-body p-0">
        <div class="activity-list">
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
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  title: 'Recent Activity',
  maxHeight: '400px'
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
</script>

<style scoped>
.recent-activity {
  height: 100%;
}

/* Activity List - Fixed height with scrollbar */
.activity-list {
  height: v-bind(maxHeight);
  overflow-y: auto;
  padding: 0.75rem 0;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border-bottom: 1px solid var(--element-gray);
  border-radius: 0;
  margin: 0;
  transition: none;
}

.activity-item:last-child {
  border-bottom: none;
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
