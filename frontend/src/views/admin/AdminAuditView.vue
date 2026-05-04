<template>
  <div class="admin-audit-page">
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h2
                class="h3 mb-1"
                style="color: var(--primary-black); font-weight: 600;"
              >
                <i
                  class="fas fa-history me-2"
                  style="color: var(--secondary-purple);"
                ></i>
                Admin Audit
              </h2>
              <p class="text-muted mb-0">
                Chronological log of all admin and system activities
              </p>
            </div>
            <div class="d-flex gap-2">
              <button
                class="btn btn-gray btn-modern"
                :disabled="isLoading"
                @click="loadActivities"
                title="Refresh"
              >
                <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isLoading }"></i>
                Refresh
              </button>
              <button class="btn btn-gray btn-modern" @click="goBack">
                <i class="fas fa-arrow-left me-1"></i>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="row mb-3">
        <div class="col-12 col-md-6 col-lg-4 mb-2 mb-md-0">
          <SearchableDropdown
            id="audit-type-filter"
            label="Filter by activity type"
            placeholder="Select activity type..."
            :items="typeFilterItemsList"
            v-model="selectedTypeFilter"
            label-key="label"
            value-key="value"
            :search-keys="['label']"
            @change="onActivityTypeFilterChange"
          />
        </div>
        <div class="col-12 col-md-3 col-lg-2 mb-2 mb-md-0">
          <SearchableDropdown
            id="audit-page-size"
            label="Per page"
            placeholder="Page size..."
            :items="pageSizeItemsList"
            v-model="selectedPageSizeFilter"
            label-key="label"
            value-key="value"
            :search-keys="['label']"
            @change="onPageSizeDropdownChange"
          />
        </div>
        <div
          class="col-12 col-md-3 col-lg-6 d-flex align-items-end justify-content-md-end mt-2 mt-md-0"
        >
          <small class="text-muted" v-if="!isLoading && totalCount > 0">
            <i class="fas fa-info-circle me-1"></i>
            {{ totalCount.toLocaleString() }} total activities
            ({{ visibleActivities.length.toLocaleString() }} on this page<span
              v-if="selectedType"
            >
              after filter</span
            >)
          </small>
        </div>
      </div>

      <!-- Activity Card -->
      <div class="card audit-card">
        <div class="card-body p-0">
          <!-- Loading skeleton -->
          <div v-if="isLoading" class="audit-list">
            <div
              v-for="n in pageSize > 8 ? 8 : pageSize"
              :key="`skel-${n}`"
              class="audit-item"
            >
              <div class="audit-icon placeholder-glow">
                <span class="placeholder rounded-circle" style="width: 36px; height: 36px;"></span>
              </div>
              <div class="audit-content flex-grow-1">
                <div class="placeholder-glow">
                  <span class="placeholder col-3 me-2"></span>
                  <span class="placeholder col-7"></span>
                </div>
                <div class="placeholder-glow mt-1">
                  <span class="placeholder col-2"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="visibleActivities.length === 0"
            class="text-center py-5"
          >
            <i
              class="fas fa-clipboard-list text-muted"
              style="font-size: 3rem;"
            ></i>
            <h5 class="mt-3 text-muted">No activities found</h5>
            <p class="text-muted mb-0">
              <span v-if="selectedType">
                Try changing or clearing the activity type filter.
              </span>
              <span v-else>
                There are no recorded admin activities yet.
              </span>
            </p>
            <button
              v-if="selectedType"
              class="btn btn-gray btn-sm mt-3"
              @click="clearActivityTypeFilter"
            >
              <i class="fas fa-times me-1"></i>Clear filter
            </button>
          </div>

          <!-- Activity feed -->
          <div v-else class="audit-list">
            <div
              v-for="activity in visibleActivities"
              :key="activity.id"
              class="audit-item"
            >
              <div
                class="audit-icon"
                :class="getActivityClass(activity.type)"
              >
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="audit-content flex-grow-1 min-width-0">
                <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <span class="audit-title">
                    {{ getActivityTitle(activity.type) }}
                  </span>
                  <span
                    class="badge audit-badge"
                    :class="getActivityBadgeClass(activity.type)"
                  >
                    {{ getActivityCategory(activity.type) }}
                  </span>
                </div>
                <div class="audit-description">{{ activity.description }}</div>
                <div class="audit-meta">
                  <span class="audit-time">
                    <i class="fas fa-clock me-1"></i>
                    {{ activity.timeAgo || formatTimestamp(activity.timestamp) }}
                  </span>
                  <span
                    v-if="activity.timestamp"
                    class="audit-time-absolute text-muted"
                  >
                    &middot; {{ formatTimestamp(activity.timestamp) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="!isLoading && totalCount > 0"
          class="card-footer bg-transparent border-top px-3 py-3"
        >
          <AppPagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :start="paginationInfo.start"
            :end="paginationInfo.end"
            :total="totalCount"
            item-name="activities"
            @change="onPageChange"
          />
          <!-- Fallback caption when AppPagination hides itself (only one page) -->
          <div
            v-if="totalPages <= 1"
            class="text-muted small"
          >
            Showing {{ paginationInfo.start }}-{{ paginationInfo.end }} of
            {{ totalCount }} activities
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPagination from '@/components/ui/pagination/AppPagination.vue'
import SearchableDropdown, { type Item as SDItem } from '@/components/common/SearchableDropdown.vue'
import {
  dashboardApi,
  type RecentActivityData,
} from '@/services/api/dashboardApi'

const router = useRouter()

// Reactive state
const isLoading = ref(false)
const activities = ref<RecentActivityData[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const totalPages = ref(1)
const selectedType = ref<string>('')

// Activity type options for the filter dropdown
const typeOptions: Array<{ value: RecentActivityData['type']; label: string }> = [
  { value: 'asset_added', label: 'Asset Added' },
  { value: 'asset_edited', label: 'Asset Updated' },
  { value: 'asset_issued', label: 'Asset Issued' },
  { value: 'asset_collected', label: 'Asset Collected' },
  { value: 'employee_added', label: 'Employee Added' },
  { value: 'employee_edited', label: 'Employee Updated' },
  { value: 'maintenance_added', label: 'Maintenance Scheduled' },
  { value: 'maintenance_edited', label: 'Maintenance Updated' },
  { value: 'maintenance_completed', label: 'Maintenance Completed' },
  { value: 'maintenance_cancelled', label: 'Maintenance Cancelled' },
  { value: 'vendor_added', label: 'Vendor Added' },
  { value: 'vendor_edited', label: 'Vendor Updated' },
]

const ALL_ACTIVITIES_ITEM: SDItem = { value: '', label: 'All activities' }

const typeFilterItemsList: SDItem[] = [
  ALL_ACTIVITIES_ITEM,
  ...typeOptions.map((o) => ({ value: o.value, label: o.label })),
]

const pageSizeItemsList: SDItem[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]

function findTypeFilterItem(type: string): SDItem {
  return (
    typeFilterItemsList.find(
      (i) => String((i as { value?: unknown }).value) === String(type),
    ) ?? ALL_ACTIVITIES_ITEM
  )
}

function findPageSizeItem(n: number): SDItem {
  return pageSizeItemsList.find((i) => Number((i as { value?: unknown }).value) === n) ?? pageSizeItemsList[1]!
}

const selectedTypeFilter = ref<SDItem | null>(ALL_ACTIVITIES_ITEM)
const selectedPageSizeFilter = ref<SDItem | null>(findPageSizeItem(pageSize.value))

// Filtered list shown on the current page (filter is client-side over the
// page's activities; backend pagination is unaware of the filter, but this
// keeps the UI responsive without an extra API param right now).
const visibleActivities = computed(() => {
  if (!selectedType.value) return activities.value
  return activities.value.filter((a) => a.type === selectedType.value)
})

const paginationInfo = computed(() => {
  if (totalCount.value === 0) {
    return { start: 0, end: 0 }
  }
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalCount.value)
  return { start, end }
})

const loadActivities = async () => {
  try {
    isLoading.value = true
    const result = await dashboardApi.getAllActivities(
      currentPage.value,
      pageSize.value,
    )
    activities.value = (result.data || []).map((a) => ({
      ...a,
      timestamp:
        typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp,
    }))
    totalCount.value = result.pagination.totalCount
    totalPages.value = result.pagination.totalPages
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  } catch (error) {
    console.error('Failed to load audit activities', error)
    activities.value = []
    totalCount.value = 0
    totalPages.value = 1
  } finally {
    isLoading.value = false
  }
}

const onPageChange = (page: number) => {
  if (page === currentPage.value) return
  currentPage.value = page
  loadActivities()
  scrollToTop()
}

const onActivityTypeFilterChange = (item: SDItem | null) => {
  const v = item ? String((item as { value?: unknown }).value ?? '') : ''
  selectedType.value = v
}

const onPageSizeDropdownChange = (item: SDItem | null) => {
  const n = item ? Number((item as { value?: unknown }).value) : 20
  if (!Number.isFinite(n) || n < 1) return
  if (pageSize.value === n) return
  pageSize.value = n
  currentPage.value = 1
  loadActivities()
}

const clearActivityTypeFilter = () => {
  selectedType.value = ''
  selectedTypeFilter.value = ALL_ACTIVITIES_ITEM
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/app/dashboard')
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Visual helpers
const getActivityIcon = (type: string): string => {
  switch (type) {
    case 'asset_added':
      return 'fas fa-plus'
    case 'asset_edited':
      return 'fas fa-pen'
    case 'asset_issued':
      return 'fas fa-arrow-right'
    case 'asset_collected':
      return 'fas fa-arrow-left'
    case 'employee_added':
      return 'fas fa-user-plus'
    case 'employee_edited':
      return 'fas fa-user-edit'
    case 'maintenance_added':
      return 'fas fa-wrench'
    case 'maintenance_edited':
      return 'fas fa-tools'
    case 'maintenance_completed':
      return 'fas fa-check'
    case 'maintenance_cancelled':
      return 'fas fa-times'
    case 'vendor_added':
      return 'fas fa-building'
    case 'vendor_edited':
      return 'fas fa-pen-to-square'
    default:
      return 'fas fa-circle-info'
  }
}

const getActivityClass = (type: string): string => {
  if (type.startsWith('asset_added') || type.startsWith('vendor_added') || type.startsWith('employee_added')) return 'added'
  if (type === 'asset_issued') return 'issued'
  if (type === 'asset_collected') return 'collected'
  if (type.startsWith('maintenance_')) {
    if (type === 'maintenance_completed') return 'completed'
    if (type === 'maintenance_cancelled') return 'cancelled'
    return 'maintenance'
  }
  if (type.endsWith('_edited')) return 'updated'
  return 'added'
}

const getActivityBadgeClass = (type: string): string => {
  if (type.startsWith('asset_')) return 'badge-purple'
  if (type.startsWith('employee_')) return 'badge-blue'
  if (type.startsWith('maintenance_')) return 'badge-orange'
  if (type.startsWith('vendor_')) return 'badge-green'
  return 'badge-gray'
}

const getActivityCategory = (type: string): string => {
  if (type.startsWith('asset_')) return 'Asset'
  if (type.startsWith('employee_')) return 'Employee'
  if (type.startsWith('maintenance_')) return 'Maintenance'
  if (type.startsWith('vendor_')) return 'Vendor'
  return 'Activity'
}

const getActivityTitle = (type: string): string => {
  switch (type) {
    case 'asset_added':
      return 'Asset Added'
    case 'asset_edited':
      return 'Asset Updated'
    case 'asset_issued':
      return 'Asset Issued'
    case 'asset_collected':
      return 'Asset Collected'
    case 'employee_added':
      return 'Employee Added'
    case 'employee_edited':
      return 'Employee Updated'
    case 'maintenance_added':
      return 'Maintenance Scheduled'
    case 'maintenance_edited':
      return 'Maintenance Updated'
    case 'maintenance_completed':
      return 'Maintenance Completed'
    case 'maintenance_cancelled':
      return 'Maintenance Cancelled'
    case 'vendor_added':
      return 'Vendor Added'
    case 'vendor_edited':
      return 'Vendor Updated'
    default:
      return 'Activity'
  }
}

const formatTimestamp = (ts: Date | string | undefined): string => {
  if (!ts) return ''
  const d = typeof ts === 'string' ? new Date(ts) : ts
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  selectedTypeFilter.value = findTypeFilterItem(selectedType.value)
  selectedPageSizeFilter.value = findPageSizeItem(pageSize.value)
  loadActivities()
})
</script>

<style scoped>
.admin-audit-page .container-fluid {
  background: var(--primary-white);
  min-height: 100vh;
}

.audit-card {
  border-radius: 1rem;
  border: 1px solid var(--element-gray);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.audit-list {
  display: flex;
  flex-direction: column;
}

.audit-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-top: 1px solid var(--element-gray);
  transition: background-color 0.15s ease;
}

.audit-item:first-child {
  border-top: none;
}

.audit-item:hover {
  background-color: var(--mindstix-light, #f8f9fa);
}

.audit-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.audit-icon.added {
  background-color: var(--secondary-purple);
}
.audit-icon.updated {
  background-color: var(--secondary-blue, #0d6efd);
}
.audit-icon.issued {
  background-color: var(--secondary-green);
}
.audit-icon.collected {
  background-color: var(--secondary-pink, #d63384);
}
.audit-icon.maintenance {
  background-color: var(--secondary-orange);
}
.audit-icon.completed {
  background-color: var(--secondary-green);
}
.audit-icon.cancelled {
  background-color: #dc3545;
}

.audit-content {
  min-width: 0;
}

.audit-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-black);
}

.audit-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.audit-badge.badge-purple {
  background-color: rgba(111, 66, 193, 0.12);
  color: var(--secondary-purple, #6f42c1);
}
.audit-badge.badge-blue {
  background-color: rgba(13, 110, 253, 0.12);
  color: var(--secondary-blue, #0d6efd);
}
.audit-badge.badge-orange {
  background-color: rgba(253, 126, 20, 0.14);
  color: var(--secondary-orange, #fd7e14);
}
.audit-badge.badge-green {
  background-color: rgba(25, 135, 84, 0.12);
  color: var(--secondary-green, #198754);
}
.audit-badge.badge-gray {
  background-color: rgba(108, 117, 125, 0.12);
  color: #6c757d;
}

.audit-description {
  font-size: 0.85rem;
  color: var(--primary-dark-gray, #495057);
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.audit-meta {
  font-size: 0.75rem;
  color: var(--primary-dark-gray, #6c757d);
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.audit-time {
  white-space: nowrap;
}

.audit-time-absolute {
  font-size: 0.72rem;
}

.min-width-0 {
  min-width: 0;
}

@media (max-width: 576px) {
  .audit-item {
    padding: 0.75rem 0.75rem;
  }
  .audit-title {
    font-size: 0.85rem;
  }
  .audit-description {
    font-size: 0.8rem;
  }
}
</style>
