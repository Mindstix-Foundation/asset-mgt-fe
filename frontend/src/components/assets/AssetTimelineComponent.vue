<template>
  <div class="timeline-wrapper">
    <div class="timeline">
      <div 
        v-for="(event, index) in events" 
        :key="event.id"
        class="timeline-item"
        :class="getEventClass(event.type)"
        @click="$emit('event-click', event)"
      >
        <!-- Timeline Connector -->
        <div class="timeline-connector">
          <div class="timeline-dot" :style="{ backgroundColor: event.color }">
            <i :class="event.icon"></i>
          </div>
          <div 
            v-if="index < events.length - 1" 
            class="timeline-line"
          ></div>
        </div>

        <!-- Event Content -->
        <div class="timeline-content">
          <div class="event-card">
            <!-- Event Header -->
            <div class="event-header">
              <div class="event-title-section">
                <h6 class="event-title">{{ formatEventType(event.type) }}</h6>
                <div class="event-meta">
                  <span class="event-date">
                    <i class="fas fa-calendar-alt me-1"></i>
                    {{ formatDate(event.date) }}
                  </span>
                  <span v-if="event.userDisplayName" class="event-user">
                    <i class="fas fa-user me-1"></i>
                    {{ event.userDisplayName }}
                  </span>
                </div>
              </div>
              <div class="event-type-badge" :style="{ backgroundColor: event.color }">
                {{ formatEventType(event.type) }}
              </div>
            </div>

            <!-- Event Description -->
            <div class="event-description">
              {{ event.description }}
            </div>

            <!-- Event Details -->
            <div v-if="hasEventDetails(event)" class="event-details">
              <div class="details-grid">
                <!-- Assignment Details -->
                <template v-if="isAssignmentEvent(event.type)">
                  <div v-if="event.details?.employeeEmail" class="detail-item">
                    <span class="detail-label">Employee:</span>
                    <span class="detail-value">{{ event.details.employeeEmail }}</span>
                  </div>
                  <div v-if="event.details?.issueDate" class="detail-item">
                    <span class="detail-label">Issue Date:</span>
                    <span class="detail-value">{{ formatDate(event.details.issueDate) }}</span>
                  </div>
                  <div v-if="event.details?.returnDate" class="detail-item">
                    <span class="detail-label">Return Date:</span>
                    <span class="detail-value">{{ formatDate(event.details.returnDate) }}</span>
                  </div>
                  <div v-if="event.details?.issueCondition" class="detail-item">
                    <span class="detail-label">Issue Condition:</span>
                    <span class="detail-value">
                      <span class="condition-badge" :class="getConditionClass(event.details.issueCondition)">
                        {{ event.details.issueCondition }}
                      </span>
                    </span>
                  </div>
                  <div v-if="event.details?.returnCondition" class="detail-item">
                    <span class="detail-label">Return Condition:</span>
                    <span class="detail-value">
                      <span class="condition-badge" :class="getConditionClass(event.details.returnCondition)">
                        {{ event.details.returnCondition }}
                      </span>
                    </span>
                  </div>
                </template>

                <!-- Maintenance Details -->
                <template v-if="isMaintenanceEvent(event.type)">
                  <div v-if="event.details?.maintenanceType" class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">{{ formatMaintenanceType(event.details.maintenanceType) }}</span>
                  </div>
                  <div v-if="event.details?.scheduledDate" class="detail-item">
                    <span class="detail-label">Scheduled:</span>
                    <span class="detail-value">{{ formatDate(event.details.scheduledDate) }}</span>
                  </div>
                  <div v-if="event.details?.vendor" class="detail-item">
                    <span class="detail-label">Vendor:</span>
                    <span class="detail-value">{{ event.details.vendor }}</span>
                  </div>
                  <div v-if="event.details?.estimatedCost" class="detail-item">
                    <span class="detail-label">Estimated Cost:</span>
                    <span class="detail-value">₹{{ formatCurrency(event.details.estimatedCost) }}</span>
                  </div>
                  <div v-if="event.details?.actualCost" class="detail-item">
                    <span class="detail-label">Actual Cost:</span>
                    <span class="detail-value">₹{{ formatCurrency(event.details.actualCost) }}</span>
                  </div>
                </template>

                <!-- Asset Creation Details -->
                <template v-if="event.type === 'ASSET_CREATED'">
                  <div v-if="event.details?.purchaseDate" class="detail-item">
                    <span class="detail-label">Purchase Date:</span>
                    <span class="detail-value">{{ formatDate(event.details.purchaseDate) }}</span>
                  </div>
                  <div v-if="event.details?.purchaseCost" class="detail-item">
                    <span class="detail-label">Purchase Cost:</span>
                    <span class="detail-value">₹{{ formatCurrency(event.details.purchaseCost) }}</span>
                  </div>
                  <div v-if="event.details?.location" class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">{{ event.details.location }}</span>
                  </div>
                  <div v-if="event.details?.serialNumber" class="detail-item">
                    <span class="detail-label">Serial Number:</span>
                    <span class="detail-value">{{ event.details.serialNumber }}</span>
                  </div>
                </template>
              </div>

              <!-- Notes -->
              <div v-if="event.details?.notes" class="event-notes">
                <div class="notes-label">
                  <i class="fas fa-sticky-note me-1"></i>
                  Notes:
                </div>
                <div class="notes-content">{{ event.details.notes }}</div>
              </div>

              <!-- Completion/Cancellation Notes -->
              <div v-if="event.details?.completionNotes" class="event-notes">
                <div class="notes-label">
                  <i class="fas fa-check-circle me-1"></i>
                  Completion Notes:
                </div>
                <div class="notes-content">{{ event.details.completionNotes }}</div>
              </div>

              <div v-if="event.details?.cancellationNotes" class="event-notes">
                <div class="notes-label">
                  <i class="fas fa-times-circle me-1"></i>
                  Cancellation Notes:
                </div>
                <div class="notes-content">{{ event.details.cancellationNotes }}</div>
              </div>
            </div>

            <!-- Click Indicator -->
            <div class="click-indicator">
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading More Indicator -->
      <div v-if="loading" class="timeline-loading">
        <div class="timeline-connector">
          <div class="timeline-dot loading-dot">
            <output class="spinner-border spinner-border-sm">
              <span class="visually-hidden">Loading...</span>
            </output>
          </div>
        </div>
        <div class="timeline-content">
          <div class="loading-text">Loading more events...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AssetHistoryEvent } from '../../types/assetHistory.types'

interface Props {
  events: AssetHistoryEvent[]
  loading?: boolean
}

defineProps<Props>()

defineEmits<{
  'event-click': [event: AssetHistoryEvent]
  'load-more': []
}>()

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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const formatEventType = (type: string): string => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatMaintenanceType = (type: string): string => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getEventClass = (type: string): string => {
  const classes = {
    'ASSET_CREATED': 'event-created',
    'ASSIGNED': 'event-assigned',
    'RETURNED': 'event-returned',
    'MAINTENANCE_SCHEDULED': 'event-maintenance',
    'MAINTENANCE_STARTED': 'event-maintenance',
    'MAINTENANCE_COMPLETED': 'event-maintenance-completed',
    'MAINTENANCE_CANCELLED': 'event-maintenance-cancelled',
    'STATUS_CHANGED': 'event-status',
    'CONDITION_CHANGED': 'event-condition',
    'RETIRED': 'event-retired',
    'REACTIVATED': 'event-reactivated'
  }
  return classes[type as keyof typeof classes] || 'event-default'
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

const hasEventDetails = (event: AssetHistoryEvent): boolean => {
  return !!(event.details && Object.keys(event.details).some(key => 
    event.details![key] !== null && 
    event.details![key] !== undefined && 
    event.details![key] !== ''
  ))
}

const isAssignmentEvent = (type: string): boolean => {
  return ['ASSIGNED', 'RETURNED'].includes(type)
}

const isMaintenanceEvent = (type: string): boolean => {
  return type.startsWith('MAINTENANCE_')
}
</script>

<style scoped>
.timeline-wrapper {
  position: relative;
}

.timeline {
  position: relative;
  padding: 1rem 0;
}

.timeline-item {
  display: flex;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(5px);
}

.timeline-item:hover .event-card {
  border-color: #331FEA;
  box-shadow: 0 4px 20px rgba(51, 31, 234, 0.15);
}

.timeline-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
  position: relative;
}

.timeline-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
  position: relative;
}

.timeline-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, #E0E0E0, transparent);
  margin-top: 0.5rem;
  min-height: 2rem;
}

.timeline-content {
  flex: 1;
  position: relative;
}

.event-card {
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.event-header {
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-title-section {
  flex: 1;
}

.event-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0A0A0A;
  margin: 0 0 0.5rem 0;
}

.event-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.event-date, .event-user {
  font-size: 0.875rem;
  color: #666666;
  display: flex;
  align-items: center;
}

.event-type-badge {
  background: #331FEA;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.event-description {
  color: #0A0A0A;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.event-details {
  border-top: 1px solid #F0F0F0;
  padding-top: 1rem;
  margin-top: 1rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem 1.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-label {
  font-weight: 600;
  color: #666666;
  font-size: 0.875rem;
  min-width: fit-content;
}

.detail-value {
  color: #0A0A0A;
  font-size: 0.875rem;
  flex: 1;
}

.condition-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

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

.event-notes {
  margin-top: 1rem;
  padding: 1rem;
  background: #F8F9FA;
  border-radius: 0.5rem;
  border-left: 4px solid #331FEA;
}

.notes-label {
  font-weight: 600;
  color: #0A0A0A;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.notes-content {
  color: #666666;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.click-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #E0E0E0;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.timeline-item:hover .click-indicator {
  color: #331FEA;
  transform: translateX(3px);
}

.timeline-loading {
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.loading-dot {
  background: #F0F0F0 !important;
  color: #666666;
}

.loading-text {
  color: #666666;
  font-style: italic;
  padding: 1rem;
}

/* Event Type Specific Styles */
.event-assigned .timeline-dot {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.event-returned .timeline-dot {
  background: linear-gradient(135deg, #6c757d, #545b62);
}

.event-maintenance .timeline-dot {
  background: linear-gradient(135deg, #ffc107, #e0a800);
}

.event-maintenance-completed .timeline-dot {
  background: linear-gradient(135deg, #28a745, #1e7e34);
}

.event-maintenance-cancelled .timeline-dot {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

.event-created .timeline-dot {
  background: linear-gradient(135deg, #28a745, #1e7e34);
}

.event-status .timeline-dot {
  background: linear-gradient(135deg, #17a2b8, #138496);
}

.event-retired .timeline-dot {
  background: linear-gradient(135deg, #6f42c1, #59359a);
}

@media (max-width: 768px) {
  .timeline-item {
    margin-bottom: 1.5rem;
  }
  
  .timeline-connector {
    margin-right: 1rem;
  }
  
  .timeline-dot {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
  
  .event-card {
    padding: 1rem;
  }
  
  .event-header {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .event-type-badge {
    align-self: flex-start;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .click-indicator {
    display: none;
  }
}
</style>
