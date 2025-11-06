<template>
  <div class="modal fade show" style="display: block;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="d-flex align-items-center">
            <div class="event-icon me-3" :style="{ backgroundColor: event.color }">
              <i :class="event.icon"></i>
            </div>
            <div>
              <h5 class="modal-title mb-1">{{ formatEventType(event.type) }}</h5>
              <div class="event-subtitle">
                {{ formatDate(event.date) }}
                <span v-if="event.userDisplayName" class="ms-2">
                  • by {{ event.userDisplayName }}
                </span>
              </div>
            </div>
          </div>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Event Description -->
          <div class="event-description-section mb-4">
            <h6 class="section-title">
              <i class="fas fa-info-circle me-2"></i>
              Description
            </h6>
            <p class="event-description">{{ event.description }}</p>
          </div>

          <!-- Event Details -->
          <div v-if="hasEventDetails" class="event-details-section mb-4">
            <h6 class="section-title">
              <i class="fas fa-list-ul me-2"></i>
              Details
            </h6>
            <div class="details-grid">
              <!-- Assignment Details -->
              <template v-if="isAssignmentEvent">
                <div v-if="event.details?.employee" class="detail-card">
                  <div class="detail-label">Employee</div>
                  <div class="detail-value">{{ event.details.employee }}</div>
                </div>
                <div v-if="event.details?.employeeId" class="detail-card">
                  <div class="detail-label">Employee ID</div>
                  <div class="detail-value">{{ event.details.employeeId }}</div>
                </div>
                <div v-if="event.details?.reason" class="detail-card">
                  <div class="detail-label">Reason</div>
                  <div class="detail-value">{{ event.details.reason }}</div>
                </div>
                <div v-if="event.details?.condition" class="detail-card">
                  <div class="detail-label">Condition</div>
                  <div class="detail-value">
                    <span class="condition-badge" :class="getConditionClass(event.details.condition)">
                      {{ event.details.condition }}
                    </span>
                  </div>
                </div>
              </template>

              <!-- Maintenance Details -->
              <template v-if="isMaintenanceEvent">
                <div v-if="event.details?.type" class="detail-card">
                  <div class="detail-label">Maintenance Type</div>
                  <div class="detail-value">{{ formatMaintenanceType(event.details.type) }}</div>
                </div>
                <div v-if="event.details?.scheduledDate" class="detail-card">
                  <div class="detail-label">Scheduled Date</div>
                  <div class="detail-value">{{ formatDate(event.details.scheduledDate) }}</div>
                </div>
                <div v-if="event.details?.vendor" class="detail-card">
                  <div class="detail-label">Vendor</div>
                  <div class="detail-value">{{ event.details.vendor }}</div>
                </div>
                <div v-if="event.details?.status" class="detail-card">
                  <div class="detail-label">Status</div>
                  <div class="detail-value">
                    <span class="status-badge" :class="getStatusClass(event.details.status)">
                      {{ event.details.status }}
                    </span>
                  </div>
                </div>
                <div v-if="event.details?.estimatedCost" class="detail-card">
                  <div class="detail-label">Estimated Cost</div>
                  <div class="detail-value">₹{{ formatCurrency(event.details.estimatedCost) }}</div>
                </div>
                <div v-if="event.details?.actualCost" class="detail-card">
                  <div class="detail-label">Actual Cost</div>
                  <div class="detail-value cost-value">
                    ₹{{ formatCurrency(event.details.actualCost) }}
                    <span 
                      v-if="event.details?.estimatedCost" 
                      class="cost-difference"
                      :class="getCostDifferenceClass(event.details.actualCost, event.details.estimatedCost)"
                    >
                      ({{ getCostDifference(event.details.actualCost, event.details.estimatedCost) }})
                    </span>
                  </div>
                </div>
              </template>

              <!-- Asset Creation Details -->
              <template v-if="event.type === 'ASSET_CREATED'">
                <div v-if="event.details?.purchaseDate" class="detail-card">
                  <div class="detail-label">Purchase Date</div>
                  <div class="detail-value">{{ formatDate(event.details.purchaseDate) }}</div>
                </div>
                <div v-if="event.details?.purchaseCost" class="detail-card">
                  <div class="detail-label">Purchase Cost</div>
                  <div class="detail-value">₹{{ formatCurrency(event.details.purchaseCost) }}</div>
                </div>
                <div v-if="event.details?.location" class="detail-card">
                  <div class="detail-label">Initial Location</div>
                  <div class="detail-value">{{ event.details.location }}</div>
                </div>
                <div v-if="event.details?.serialNumber" class="detail-card">
                  <div class="detail-label">Serial Number</div>
                  <div class="detail-value">{{ event.details.serialNumber }}</div>
                </div>
                <div v-if="event.details?.initialCondition" class="detail-card">
                  <div class="detail-label">Initial Condition</div>
                  <div class="detail-value">
                    <span class="condition-badge" :class="getConditionClass(event.details.initialCondition)">
                      {{ event.details.initialCondition }}
                    </span>
                  </div>
                </div>
                <div v-if="event.details?.initialStatus" class="detail-card">
                  <div class="detail-label">Initial Status</div>
                  <div class="detail-value">
                    <span class="status-badge" :class="getStatusClass(event.details.initialStatus)">
                      {{ event.details.initialStatus }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Notes Section -->
          <div v-if="hasNotes" class="notes-section mb-4">
            <h6 class="section-title">
              <i class="fas fa-sticky-note me-2"></i>
              Notes
            </h6>
            
            <!-- General Notes -->
            <div v-if="event.details?.notes" class="note-card">
              <div class="note-header">
                <i class="fas fa-comment me-2"></i>
                Notes
              </div>
              <div class="note-content">{{ event.details.notes }}</div>
            </div>

            <!-- Completion Notes -->
            <div v-if="event.details?.completionNotes" class="note-card success">
              <div class="note-header">
                <i class="fas fa-check-circle me-2"></i>
                Completion Notes
              </div>
              <div class="note-content">{{ event.details.completionNotes }}</div>
            </div>

            <!-- Cancellation Notes -->
            <div v-if="event.details?.cancellationNotes" class="note-card danger">
              <div class="note-header">
                <i class="fas fa-times-circle me-2"></i>
                Cancellation Notes
              </div>
              <div class="note-content">{{ event.details.cancellationNotes }}</div>
            </div>

            <!-- Cancellation Reason -->
            <div v-if="event.details?.cancellationReason" class="note-card warning">
              <div class="note-header">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Cancellation Reason
              </div>
              <div class="note-content">{{ event.details.cancellationReason }}</div>
            </div>
          </div>

          <!-- Event Metadata -->
          <div class="metadata-section">
            <h6 class="section-title">
              <i class="fas fa-info me-2"></i>
              Event Information
            </h6>
            <div class="metadata-grid">
              <div class="metadata-item">
                <div class="metadata-label">Event ID</div>
                <div class="metadata-value">{{ event.id }}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Event Type</div>
                <div class="metadata-value">
                  <span class="event-type-badge" :style="{ backgroundColor: event.color }">
                    {{ formatEventType(event.type) }}
                  </span>
                </div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Date & Time</div>
                <div class="metadata-value">{{ formatFullDate(event.date) }}</div>
              </div>
              <div v-if="event.userDisplayName" class="metadata-item">
                <div class="metadata-label">Performed By</div>
                <div class="metadata-value">{{ event.userDisplayName }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">
            Close
          </button>
          <button v-if="canExportEvent" type="button" class="btn btn-primary" @click="exportEvent">
            <i class="fas fa-download me-2"></i>
            Export Event
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div class="modal-backdrop fade show" @click="$emit('close')"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AssetHistoryEvent } from '../../types/assetHistory.types'

interface Props {
  event: AssetHistoryEvent
}

const props = defineProps<Props>()

defineEmits<{
  'close': []
}>()

// Computed properties
const hasEventDetails = computed(() => {
  return props.event.details && Object.keys(props.event.details).some(key => 
    props.event.details![key] !== null && 
    props.event.details![key] !== undefined && 
    props.event.details![key] !== ''
  )
})

const hasNotes = computed(() => {
  return props.event.details?.notes || 
         props.event.details?.completionNotes || 
         props.event.details?.cancellationNotes ||
         props.event.details?.cancellationReason
})

const isAssignmentEvent = computed(() => {
  return ['ASSIGNED', 'RETURNED'].includes(props.event.type)
})

const isMaintenanceEvent = computed(() => {
  return props.event.type.startsWith('MAINTENANCE_')
})

const canExportEvent = computed(() => {
  return true // Always allow export for now
})

// Methods
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const formatEventType = (type: string): string => {
  return type.replaceAll('_', ' ').toLowerCase().replaceAll(/\b\w/g, (match: string) => match.toUpperCase())
}

const formatMaintenanceType = (type: string): string => {
  return type.replaceAll('_', ' ').toLowerCase().replaceAll(/\b\w/g, (match: string) => match.toUpperCase())
}

const getConditionClass = (condition: string): string => {
  const classes = {
    'NEW': 'condition-new',
    'GOOD': 'condition-good',
    'FAIR': 'condition-fair',
    'POOR': 'condition-poor',
    'DAMAGED': 'condition-damaged'
  }
  return classes[condition as keyof typeof classes] || 'condition-default'
}

const getStatusClass = (status: string): string => {
  const classes = {
    'AVAILABLE': 'status-available',
    'ASSIGNED': 'status-assigned',
    'IN_MAINTENANCE': 'status-maintenance',
    'RETIRED': 'status-retired',
    'LOST': 'status-lost',
    'SCHEDULED': 'status-scheduled',
    'IN_PROGRESS': 'status-progress',
    'COMPLETED': 'status-completed',
    'CANCELLED': 'status-cancelled'
  }
  return classes[status as keyof typeof classes] || 'status-default'
}

const getCostDifference = (actual: number, estimated: number): string => {
  const diff = actual - estimated
  const percentage = ((diff / estimated) * 100).toFixed(1)
  
  if (diff > 0) {
    return `+₹${formatCurrency(diff)} (+${percentage}%)`
  } else if (diff < 0) {
    return `-₹${formatCurrency(Math.abs(diff))} (${percentage}%)`
  } else {
    return 'On budget'
  }
}

const getCostDifferenceClass = (actual: number, estimated: number): string => {
  const diff = actual - estimated
  if (diff > 0) return 'cost-over'
  if (diff < 0) return 'cost-under'
  return 'cost-exact'
}

const exportEvent = () => {
  // Implementation for exporting individual event
  const eventData = {
    ...props.event,
    exportedAt: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(eventData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `asset-event-${props.event.id}.json`
  link.click()
}
</script>

<style scoped>
.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  border-bottom: 1px solid #E0E0E0;
  padding: 1.5rem;
}

.event-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0A0A0A;
  margin: 0;
}

.event-subtitle {
  font-size: 0.875rem;
  color: #666666;
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0A0A0A;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.event-description {
  color: #0A0A0A;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-card {
  background: #F8F9FA;
  border: 1px solid #E0E0E0;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.3s ease;
}

.detail-card:hover {
  border-color: #331FEA;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(51, 31, 234, 0.1);
}

.detail-label {
  font-weight: 600;
  color: #666666;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.detail-value {
  color: #0A0A0A;
  font-size: 1rem;
  font-weight: 500;
}

.cost-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cost-difference {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.cost-over {
  background: #FEE2E2;
  color: #DC2626;
}

.cost-under {
  background: #D1FAE5;
  color: #065F46;
}

.cost-exact {
  background: #DBEAFE;
  color: #1D4ED8;
}

.condition-badge, .status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Condition badges */
.condition-new {
  background: #D1FAE5;
  color: #065F46;
}

.condition-good {
  background: #DBEAFE;
  color: #1E40AF;
}

.condition-fair {
  background: #FEF3C7;
  color: #92400E;
}

.condition-poor {
  background: #FED7AA;
  color: #C2410C;
}

.condition-damaged {
  background: #FECACA;
  color: #991B1B;
}

/* Status badges */
.status-available {
  background: #D1FAE5;
  color: #065F46;
}

.status-assigned {
  background: #DBEAFE;
  color: #1E40AF;
}

.status-maintenance {
  background: #FEF3C7;
  color: #92400E;
}

.status-retired {
  background: #F3F4F6;
  color: #374151;
}

.status-lost {
  background: #FECACA;
  color: #991B1B;
}

.status-scheduled {
  background: #FEF3C7;
  color: #92400E;
}

.status-progress {
  background: #FED7AA;
  color: #C2410C;
}

.status-completed {
  background: #D1FAE5;
  color: #065F46;
}

.status-cancelled {
  background: #FECACA;
  color: #991B1B;
}

.note-card {
  background: white;
  border: 1px solid #E0E0E0;
  border-left: 4px solid #331FEA;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.note-card.success {
  border-left-color: #10B981;
  background: #F0FDF4;
}

.note-card.danger {
  border-left-color: #EF4444;
  background: #FEF2F2;
}

.note-card.warning {
  border-left-color: #F59E0B;
  background: #FFFBEB;
}

.note-header {
  font-weight: 600;
  color: #0A0A0A;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.note-content {
  color: #666666;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metadata-label {
  font-weight: 600;
  color: #666666;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metadata-value {
  color: #0A0A0A;
  font-size: 0.875rem;
  font-weight: 500;
}

.event-type-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.modal-footer {
  border-top: 1px solid #E0E0E0;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
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

.btn-outline-secondary {
  color: #666666;
  border-color: #E0E0E0;
}

.btn-outline-secondary:hover {
  background: #F8F9FA;
  border-color: #666666;
  color: #0A0A0A;
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .details-grid, .metadata-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 1rem;
  }
  
  .event-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .modal-title {
    font-size: 1.125rem;
  }
}
</style>
