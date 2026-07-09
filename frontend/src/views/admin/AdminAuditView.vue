<template>
  <div class="admin-audit-page">
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h2 class="h3 mb-1 page-title">
                <i class="fas fa-history me-2 text-purple"></i>
                Admin Audit
              </h2>
              <p class="text-muted mb-0">
                Immutable log of all system changes with who, when, and before/after details
              </p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-gray btn-modern" @click="goBack">
                <i class="fas fa-arrow-left me-1"></i>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-3 g-1">
        <div class="col-12 col-md-4 col-lg-1">
          <SearchableDropdown
            id="audit-entity-filter"
            label="Entity type"
            placeholder="All entities"
            :items="entityFilterItems"
            v-model="selectedEntityFilter"
            label-key="label"
            value-key="value"
            @change="onFilterChange"
          />
        </div>
        <div class="col-12 col-md-4 action-filter-col">
          <SearchableDropdown
            id="audit-action-filter"
            label="Action"
            placeholder="All actions"
            :items="actionFilterItems"
            v-model="selectedActionFilter"
            label-key="label"
            value-key="value"
            @change="onFilterChange"
          />
        </div>
        <div class="col-12 col-md-4 col-lg-1">
          <label class="form-label" for="audit-search">Search</label>
          <div class="search-input-container">
            <i class="fas fa-search search-icon"></i>
            <input
              id="audit-search"
              type="text"
              class="form-control search-input"
              v-model="searchTerm"
              placeholder="Summary, entity, or actor..."
              @input="debouncedLoad"
            />
          </div>
        </div>
        <div class="col-12 col-md-4 col-lg-2">
          <SearchableDropdown
            id="audit-page-size"
            label="Per page"
            placeholder="Page size"
            :items="pageSizeItems"
            v-model="selectedPageSizeFilter"
            label-key="label"
            value-key="value"
            @change="onPageSizeChange"
          />
        </div>
        <div class="col-12 col-lg-2 d-flex align-items-end">
          <small class="text-muted" v-if="!isLoading && totalCount > 0">
            {{ totalCount.toLocaleString() }} total records
          </small>
        </div>
      </div>

      <div class="card audit-card">
        <div class="card-body p-0">
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="text-muted mt-2 mb-0">Loading audit logs...</p>
          </div>

          <div v-else-if="logs.length === 0" class="text-center py-5">
            <i class="fas fa-clipboard-list text-muted fa-3x mb-3"></i>
            <h5 class="text-muted">No audit records yet</h5>
            <p class="text-muted mb-0">New actions will appear here as they occur.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover audit-table mb-0">
              <colgroup>
                <col class="col-time" />
                <col class="col-action" />
                <col class="col-entity" />
                <col class="col-summary" />
                <col class="col-performer" />
                <col class="col-details" />
              </colgroup>
              <thead>
                <tr>
                  <th class="col-time">Time</th>
                  <th class="col-action">Action</th>
                  <th class="col-entity">Entity</th>
                  <th class="col-summary">Summary</th>
                  <th class="col-performer">Performed by</th>
                  <th class="col-details">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.id" class="audit-row">
                  <td class="col-time">
                    <div class="time-primary">{{ formatTimestamp(log.createdAt) }}</div>
                    <div class="time-secondary text-muted">{{ formatRelative(log.createdAt) }}</div>
                  </td>
                  <td class="col-action">
                    <span class="badge action-badge" :class="getActionBadgeClass(log.action)">{{ formatAuditAction(log.action) }}</span>
                  </td>
                  <td class="col-entity">
                    <span class="badge badge-gray badge-sm entity-badge">{{ log.tableDisplayName }}</span>
                  </td>
                  <td class="col-summary">{{ log.summary || '—' }}</td>
                  <td class="col-performer">{{ log.performedBy?.name || 'Unknown' }}</td>
                  <td class="col-details">
                    <button
                      type="button"
                      class="btn btn-action btn-brown"
                      title="View change details"
                      @click="openDetailsModal(log)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="!isLoading && totalCount > 0" class="card-footer bg-transparent border-top px-3 py-3">
          <AppPagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :start="paginationInfo.start"
            :end="paginationInfo.end"
            :total="totalCount"
            item-name="records"
            @change="onPageChange"
          />
        </div>
      </div>
    </div>

    <!-- Audit Details Modal -->
    <div
      class="modal fade"
      :class="{ show: showDetailsModal }"
      :style="{ display: showDetailsModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="selectedLog"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-eye me-2 text-purple"></i>
              Audit Details
            </h5>
            <button type="button" class="btn-close" @click="closeDetailsModal"></button>
          </div>
          <div class="modal-body">
            <div class="audit-detail-meta mb-3">
              <div class="row g-2">
                <div class="col-sm-6">
                  <div class="meta-label">Action</div>
                  <span class="badge" :class="getActionBadgeClass(selectedLog.action)">
                    {{ formatAuditAction(selectedLog.action) }}
                  </span>
                </div>
                <div class="col-sm-6">
                  <div class="meta-label">Entity</div>
                  <span class="badge badge-gray">{{ selectedLog.tableDisplayName }}</span>
                </div>
                <div class="col-12">
                  <div class="meta-label">Summary</div>
                  <div>{{ selectedLog.summary || '—' }}</div>
                </div>
                <div class="col-sm-6">
                  <div class="meta-label">Performed by</div>
                  <div>{{ selectedLog.performedBy?.name || 'Unknown' }}</div>
                </div>
                <div class="col-sm-6">
                  <div class="meta-label">Time</div>
                  <div>{{ formatTimestamp(selectedLog.createdAt) }}</div>
                </div>
              </div>
            </div>

            <div v-if="getDisplayChanges(selectedLog).length === 0" class="text-muted small">
              No field-level changes recorded.
            </div>
            <div v-else-if="isUpdateAction(selectedLog.action)" class="table-responsive">
              <table class="table table-sm change-table mb-0">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Before</th>
                    <th>After</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="change in getDisplayChanges(selectedLog)" :key="`${selectedLog.id}-${change.field}`">
                    <td class="fw-semibold">{{ change.label }}</td>
                    <td class="old-value">{{ formatValue(change.oldValue) }}</td>
                    <td class="new-value">{{ formatValue(change.newValue) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-sm change-table mb-0">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>{{ getSingleColumnHeader(selectedLog.action) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="change in getDisplayChanges(selectedLog)" :key="`${selectedLog.id}-${change.field}`">
                    <td class="fw-semibold">{{ change.label }}</td>
                    <td :class="selectedLog.action === 'DELETE' ? 'old-value' : 'new-value'">
                      {{ formatValue(getSingleColumnValue(selectedLog, change)) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-gray btn-modern" @click="closeDetailsModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDetailsModal"
      class="modal-backdrop fade show"
      @click="closeDetailsModal"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPagination from '@/components/ui/pagination/AppPagination.vue'
import SearchableDropdown, { type Item as SDItem } from '@/components/common/SearchableDropdown.vue'
import { auditApi, type AuditChange, type AuditLogEntry } from '@/services/api/auditApi'

const router = useRouter()

const isLoading = ref(false)
const logs = ref<AuditLogEntry[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const totalPages = ref(1)
const searchTerm = ref('')
const showDetailsModal = ref(false)
const selectedLog = ref<AuditLogEntry | null>(null)

const entityFilterItems: SDItem[] = [
  { value: '', label: 'All entities' },
  { value: 'employees', label: 'Employee' },
  { value: 'assets', label: 'Asset' },
  { value: 'vendors', label: 'Vendor' },
  { value: 'maintenance_schedules', label: 'Maintenance' },
  { value: 'asset_issues', label: 'Assignment' },
  { value: 'users', label: 'Admin User' },
  { value: 'brands', label: 'Brand' },
  { value: 'models', label: 'Model' },
  { value: 'asset_categories', label: 'Asset Category' },
  { value: 'asset_types', label: 'Asset Type' },
]

const actionFilterItems: SDItem[] = [
  { value: '', label: 'All actions' },
  { value: 'INSERT', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
]

const pageSizeItems: SDItem[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]

const selectedEntityFilter = ref<SDItem | null>(entityFilterItems[0]!)
const selectedActionFilter = ref<SDItem | null>(actionFilterItems[0]!)
const selectedPageSizeFilter = ref<SDItem | null>(pageSizeItems[1]!)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const paginationInfo = computed(() => {
  if (totalCount.value === 0) return { start: 0, end: 0 }
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalCount.value)
  return { start, end }
})

const loadLogs = async () => {
  try {
    isLoading.value = true
    const result = await auditApi.getAuditLogs({
      page: currentPage.value,
      limit: pageSize.value,
      tableName: String(selectedEntityFilter.value?.value || '') || undefined,
      action: String(selectedActionFilter.value?.value || '') || undefined,
      search: searchTerm.value.trim() || undefined,
    })
    logs.value = result.logs || []
    totalCount.value = result.pagination?.totalCount || 0
    totalPages.value = result.pagination?.totalPages || 1
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  } catch (error) {
    console.error('Failed to load audit logs', error)
    logs.value = []
    totalCount.value = 0
    totalPages.value = 1
  } finally {
    isLoading.value = false
  }
}

const debouncedLoad = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadLogs()
  }, 400)
}

const onFilterChange = () => {
  currentPage.value = 1
  loadLogs()
}

const onPageSizeChange = (item: SDItem | null) => {
  const n = item ? Number(item.value) : 20
  if (!Number.isFinite(n) || n < 1) return
  pageSize.value = n
  currentPage.value = 1
  loadLogs()
}

const onPageChange = (page: number) => {
  if (page === currentPage.value) return
  currentPage.value = page
  loadLogs()
  globalThis.scrollTo({ top: 0, behavior: 'smooth' })
}

const openDetailsModal = (log: AuditLogEntry) => {
  selectedLog.value = log
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedLog.value = null
}

const formatFieldLabel = (field: string) =>
  field
    .replaceAll('_', ' ')
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll(/\b\w/g, (c) => c.toUpperCase())

const isUpdateAction = (action: string) => action === 'UPDATE'

const getSingleColumnHeader = (action: string) => {
  if (action === 'INSERT') return 'Created'
  if (action === 'DELETE') return 'Deleted'
  return 'Value'
}

const getSingleColumnValue = (log: AuditLogEntry, change: AuditChange) => {
  if (log.action === 'INSERT') {
    return change.newValue ?? log.newValues?.[change.field]
  }
  if (log.action === 'DELETE') {
    return change.oldValue ?? log.oldValues?.[change.field]
  }
  return null
}

const getDisplayChanges = (log: AuditLogEntry): AuditChange[] => {
  if (log.changes?.length) {
    return log.changes.map((change) => ({
      ...change,
      label: change.label || formatFieldLabel(change.field),
    }))
  }

  const fields =
    log.changedFields?.length
      ? log.changedFields
      : log.action === 'INSERT'
        ? Object.keys(log.newValues ?? {})
        : log.action === 'DELETE'
          ? Object.keys(log.oldValues ?? {})
          : []

  return fields.map((field) => ({
    field,
    label: formatFieldLabel(field),
    oldValue: log.oldValues?.[field],
    newValue: log.newValues?.[field],
  }))
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const formatTimestamp = (ts?: string) => {
  if (!ts) return '—'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatRelative = (ts?: string) => {
  if (!ts) return ''
  const d = new Date(ts)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const formatAuditAction = (action: string) => {
  switch (action) {
    case 'INSERT': return 'Create'
    case 'UPDATE': return 'Update'
    case 'DELETE': return 'Delete'
    default: return action
  }
}

const getActionBadgeClass = (action: string) => {
  switch (action) {
    case 'INSERT': return 'badge-green'
    case 'UPDATE': return 'badge-blue'
    case 'DELETE': return 'badge-red'
    default: return 'badge-gray'
  }
}

const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/app/dashboard')
}

onMounted(() => loadLogs())
</script>

<style scoped>
.admin-audit-page .page-title {
  color: var(--primary-black);
  font-weight: 600;
}

.text-purple {
  color: var(--secondary-purple);
}

.action-filter-col {
  max-width: 150px;
}

@media (max-width: 767.98px) {
  .action-filter-col {
    max-width: 100%;
  }
}

.audit-card {
  border-radius: 1rem;
  border: 1px solid var(--element-gray);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.audit-table {
  table-layout: fixed;
  width: 100%;
}

.audit-table col.col-time {
  width: 20%;
}

.audit-table col.col-action {
  width: 10%;
}

.audit-table col.col-entity {
  width: 15%;
}

.audit-table col.col-summary {
  width: 30%;
}

.audit-table col.col-performer {
  width: 15%;
}

.audit-table col.col-details {
  width: 10%;
}

.audit-table .col-action {
  padding-left: 0.35rem;
  padding-right: 0.35rem;
  text-align: center;
  vertical-align: middle;
}

.audit-table .col-entity {
  text-align: center;
  vertical-align: middle;
}

.audit-table .entity-badge {
  font-size: 0.75rem;
  padding: 0.15rem 0.35rem;
  max-width: 100%;
  white-space: nowrap;
  line-height: 1.2;
  display: inline-block;
}

.audit-table .col-performer {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.audit-table .col-details {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  text-align: center;
  vertical-align: middle;
}

.audit-table .col-summary {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
  vertical-align: middle;
}

.audit-table .col-time {
  vertical-align: middle;
}

.audit-table .col-details .btn-action {
  padding: 0.25rem 0.45rem;
}

.audit-table .action-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  min-width: 0;
}

.audit-table thead th {
  background: #f8f9fa;
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid var(--element-gray);
  white-space: nowrap;
}

.audit-row:hover {
  background-color: #fafafa;
}

.audit-detail-meta .meta-label {
  font-size: 0.78rem;
  color: #6c757d;
  margin-bottom: 0.2rem;
}

.time-primary {
  font-size: 0.9rem;
  font-weight: 500;
}

.time-secondary {
  font-size: 0.78rem;
}

.change-table th {
  font-size: 0.8rem;
  color: #6c757d;
}

.change-table td {
  font-size: 0.88rem;
  vertical-align: top;
}

.old-value {
  color: #842029;
}

.new-value {
  color: #0f5132;
}
</style>
