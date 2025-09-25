<template>
  <div class="maintenance-page">
    <div class="container-fluid px-3 py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0" style="color: var(--primary-black);">Maintenance & Repairs</h2>
          <p class="text-muted mb-0">Track asset maintenance, repairs, and service history</p>
        </div>
        <button class="btn btn-warning btn-modern" @click="navigateToSchedule">
          <i class="fas fa-plus me-1"></i>Schedule Maintenance
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <!-- Under Maintenance -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-warning rounded-circle p-3">
                  <i class="fas fa-tools fa-lg"></i>
                </div>
                <div class="text-end">
                  <div class="text-dark small mb-1 fw-semibold">Under Maintenance</div>
                  <div class="h3 mb-0 fw-bold text-dark">{{ stats.underMaintenance }}</div>
                </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-warning" :style="`width: ${stats.underMaintenancePercent}%`"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scheduled -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-info rounded-circle p-3">
                  <i class="fas fa-calendar-alt fa-lg"></i>
                </div>
                <div class="text-end">
                  <div class="text-dark small mb-1 fw-semibold">Scheduled</div>
                  <div class="h3 mb-0 fw-bold text-dark">{{ stats.scheduled }}</div>
                </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-info" :style="`width: ${stats.scheduledPercent}%`"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-success rounded-circle p-3">
                  <i class="fas fa-check-circle fa-lg"></i>
                </div>
                <div class="text-end">
                  <div class="text-dark small mb-1 fw-semibold">Completed</div>
                  <div class="h3 mb-0 fw-bold text-dark">{{ stats.completed }}</div>
                </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-success" :style="`width: ${stats.completedPercent}%`"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cancelled -->
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card border-0 shadow-sm h-100 stats-card-modern">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="stats-icon bg-secondary rounded-circle p-3">
                  <i class="fas fa-times-circle fa-lg"></i>
                </div>
                <div class="text-end">
                  <div class="text-dark small mb-1 fw-semibold">Cancelled</div>
                  <div class="h3 mb-0 fw-bold text-dark">{{ stats.cancelled }}</div>
                </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-secondary" :style="`width: ${stats.cancelledPercent}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Updated Status Line -->
      <div class="row mb-2">
        <div class="col-12">
          <div class="d-flex justify-content-end align-items-center" style="margin-top: -20px;">
            <div class="status-indicator me-2"></div>
            <small class="text-muted">Updated 1 Minute Ago</small>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-12 col-md-3 mb-3">
              <label class="form-label">Search Maintenance</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="filters.search"
                  placeholder="Search by asset ID, vendor, issue..."
                  @input="filterMaintenances"
                >
              </div>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="filters.status" @change="filterMaintenancesImmediate">
                <option value="">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Maintenance Type</label>
              <select class="form-select" v-model="filters.type" @change="filterMaintenancesImmediate">
                <option value="">All Types</option>
                <option value="Preventive">Preventive</option>
                <option value="Corrective">Corrective</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Vendor</label>
              <select class="form-select" v-model="filters.vendor" @change="filterMaintenancesImmediate" :disabled="vendorsLoading">
                <option value="">All Vendors</option>
                <option v-if="vendorsLoading" disabled>Loading vendors...</option>
                <option 
                  v-for="vendor in availableVendors" 
                  :key="vendor.id" 
                  :value="vendor.name"
                >
                  {{ vendor.name }}
                </option>
              </select>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Sort By</label>
              <div class="d-flex gap-2">
                <select class="form-select" v-model="sortBy" @change="sortMaintenances">
                  <option value="assetId">Asset ID</option>
                  <option value="status">Status</option>
                  <option value="type">Maintenance Type</option>
                  <option value="vendor">Vendor</option>
                  <option value="scheduledDate">Date</option>
                  <option value="cost">Cost</option>
                </select>
                <button class="btn btn-outline-secondary" @click="toggleSortOrder" title="Toggle Sort Order">
                  <i :class="sortAscending ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up'"></i>
                </button>
              </div>
            </div>
            <div class="col-12 col-md-1 mb-3 d-flex align-items-end">
              <button class="btn btn-outline-secondary w-100" @click="clearFilters" title="Clear Filters">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading maintenance records...</p>
      </div>

      <!-- Maintenance Table -->
      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Asset ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Vendor/Assigned</th>
              <th>Date</th>
              <th>Est./Actual Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="maintenance in filteredMaintenance" 
              :key="maintenance.id"
              :data-asset-id="maintenance.assetId"
              :data-status="maintenance.status"
              :data-type="maintenance.type"
              :data-vendor="maintenance.vendor"
            >
              <td>
                <strong>{{ maintenance.assetId }}</strong><br>
                <small class="text-muted">{{ maintenance.assetName }}</small>
              </td>
              <td>
                <span :class="`badge badge-type-${maintenance.type.toLowerCase()}`">
                  {{ maintenance.type }}
                </span>
              </td>
              <td>
                <span :class="`badge badge-${maintenance.status.toLowerCase().replace('_', '-')}`">
                  {{ formatStatus(maintenance.status) }}
                </span>
              </td>
              <td>
                <strong>{{ maintenance.vendor }}</strong><br>
                <small class="text-muted">{{ maintenance.assignedTo }}</small>
              </td>
              <td>{{ formatDate(maintenance.scheduledDate) }}</td>
              <td>
                <strong>{{ maintenance.cost }}</strong><br>
                <small class="text-muted">{{ maintenance.costType }}</small>
              </td>
              <td>
                <div class="btn-group btn-group-sm maintenance-actions">
                  <button 
                    class="btn btn-action btn-view" 
                    @click="showMaintenanceDetails(maintenance)"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="maintenance.status === 'IN_PROGRESS'"
                    class="btn btn-action btn-complete" 
                    @click="openCompleteModal(maintenance)"
                    title="Complete Maintenance"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button 
                    v-if="maintenance.status === 'SCHEDULED'"
                    class="btn btn-action btn-edit" 
                    @click="navigateToEdit(maintenance)"
                    title="Edit Maintenance"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    v-if="maintenance.status === 'CANCELLED'"
                    class="btn btn-action btn-reschedule" 
                    @click="navigateToSchedule"
                    title="Reschedule Maintenance"
                  >
                    <i class="fas fa-calendar-plus"></i>
                  </button>
                  <button 
                    v-if="maintenance.status === 'COMPLETED'"
                    class="btn btn-action btn-report" 
                    @click="openReportModal(maintenance)"
                    title="Generate Report"
                  >
                    <i class="fas fa-file-alt"></i>
                  </button>
                  <button 
                    v-if="['IN_PROGRESS', 'SCHEDULED'].includes(maintenance.status)"
                    class="btn btn-action btn-cancel" 
                    @click="openCancelModal(maintenance)"
                    title="Cancel Maintenance"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredMaintenance.length === 0">
              <td colspan="7" class="text-center py-4">
                <i class="fas fa-search fa-2x text-muted mb-2 d-block"></i>
                <h6 class="text-muted">No maintenance records found</h6>
                <p class="text-muted mb-0">Try adjusting your search criteria</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <div class="text-muted">
          <small>Showing {{ paginationInfo.start }}-{{ paginationInfo.end }} of {{ paginationInfo.total }} maintenance records</small>
        </div>
        <AppPagination 
          :current-page="currentPage" 
          :total-pages="totalPages" 
          @change="changePage" 
        />
      </div>
    </div>

    <!-- Maintenance Detail Modal -->
    <div class="modal fade" id="maintenanceDetailModal" tabindex="-1" ref="detailModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              Maintenance Details - {{ selectedMaintenance?.assetId }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedMaintenance">
            <!-- Asset & Maintenance Info Section -->
            <div class="maintenance-info-section">
              <h6 class="section-title"><i class="fas fa-tools me-2"></i>Asset & Maintenance Information</h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="info-label">Asset ID</div>
                  <div class="info-value">{{ selectedMaintenance.assetId }}</div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">Asset</div>
                  <div class="info-value">{{ selectedMaintenance.assetName }}</div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">Maintenance Type</div>
                  <div class="info-value">
                    <span :class="`badge badge-type-${selectedMaintenance.type.toLowerCase()}`">
                      {{ selectedMaintenance.type }}
                    </span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">Status</div>
                  <div class="info-value">
                    <span :class="`badge badge-${selectedMaintenance.status.toLowerCase().replace('_', '-')}`">
                      {{ formatStatus(selectedMaintenance.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline & Assignment Section -->
            <div class="timeline-info-section">
              <h6 class="section-title"><i class="fas fa-calendar-alt me-2"></i>Timeline & Assignment</h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="info-label">Scheduled Date</div>
                  <div class="info-value">{{ formatDate(selectedMaintenance.scheduledDate) }}</div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">Frequency</div>
                  <div class="info-value">One-time</div>
                </div>
                <div class="col-md-12">
                  <div class="info-label">Assigned To</div>
                  <div class="info-value">{{ selectedMaintenance.assignedTo }} ({{ selectedMaintenance.vendor }})</div>
                </div>
              </div>
            </div>

            <!-- Cost Information Section -->
            <div class="cost-info-section">
              <h6 class="section-title"><i class="bi bi-currency-rupee me-2"></i>Cost Information</h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="info-label">{{ selectedMaintenance.costType === 'Actual' ? 'Actual Cost' : 'Estimated Cost' }}</div>
                  <div class="info-value">{{ selectedMaintenance.cost }}</div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">{{ selectedMaintenance.costType === 'Actual' ? 'Estimated Cost' : 'Actual Cost' }}</div>
                  <div class="info-value" :class="selectedMaintenance.status === 'COMPLETED' ? '' : 'text-muted'">
                    {{ selectedMaintenance.status === 'COMPLETED' ? selectedMaintenance.cost : 
                       selectedMaintenance.status === 'CANCELLED' ? 'N/A - Cancelled' : 'Pending completion' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Description Section -->
            <div class="description-section">
              <h6 class="section-title"><i class="fas fa-clipboard-list me-2"></i>Maintenance Description</h6>
              <div class="description-content">
                <p><strong>Description:</strong> {{ selectedMaintenance.description }}</p>
                
                <p><strong>{{ selectedMaintenance.status === 'CANCELLED' ? 'Cancellation Details:' : 'Progress Notes:' }}</strong></p>
                <ul class="service-notes">
                  <li 
                    v-for="note in selectedMaintenance.progressNotes" 
                    :key="note"
                    :style="selectedMaintenance.status === 'CANCELLED' ? 'color: var(--secondary-red)' : ''"
                  >
                    {{ note }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Maintenance History Section -->
            <div class="maintenance-history-section" v-if="maintenanceHistory.length > 0">
              <h6 class="section-title">
                <i class="fas fa-history me-2"></i>Maintenance History
                <span class="badge bg-primary ms-2">{{ maintenanceHistory.length }} records</span>
              </h6>
              <div class="history-timeline">
                <div 
                  v-for="(history, index) in maintenanceHistory" 
                  :key="history.id"
                  class="timeline-item"
                  :class="`timeline-${history.status.toLowerCase().replace('_', '-')}`"
                >
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 class="timeline-title mb-1">{{ history.description }}</h6>
                        <div class="timeline-meta">
                          <span class="badge" :class="`badge-${history.status.toLowerCase().replace('_', '-')}`">
                            {{ formatStatus(history.status) }}
                          </span>
                          <span class="badge" :class="`badge-type-${history.maintenanceTypeName.toLowerCase()}`">
                            {{ history.maintenanceTypeName }}
                          </span>
                        </div>
                      </div>
                      <div class="timeline-date">
                        {{ formatDate(history.scheduledDate) }}
                      </div>
                    </div>
                    <div class="timeline-details">
                      <div class="row">
                        <div class="col-md-6">
                          <small class="text-muted">Vendor:</small>
                          <div>{{ history.vendorName || 'Internal Team' }}</div>
                        </div>
                        <div class="col-md-6">
                          <small class="text-muted">Cost:</small>
                          <div>
                            {{ history.actualCost 
                              ? `₹${history.actualCost.toFixed(2)} (Actual)` 
                              : history.estimatedCost 
                                ? `₹${history.estimatedCost.toFixed(2)} (Estimated)` 
                                : 'N/A' 
                            }}
                          </div>
                        </div>
                      </div>
                      <div v-if="history.completionNotes || history.cancellationNotes" class="mt-2">
                        <small class="text-muted">Notes:</small>
                        <div class="timeline-notes">{{ history.completionNotes || history.cancellationNotes }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button 
              v-if="selectedMaintenance?.status === 'IN_PROGRESS'"
              type="button" 
              class="btn btn-success" 
              @click="closeDetailAndOpenComplete"
            >
              <i class="fas fa-check me-1"></i>Complete Maintenance
            </button>
            <button 
              v-if="selectedMaintenance?.status === 'SCHEDULED'"
              type="button" 
              class="btn btn-warning" 
              @click="navigateToEdit(selectedMaintenance)"
            >
              <i class="fas fa-edit me-1"></i>Edit Maintenance
            </button>
            <button 
              v-if="selectedMaintenance?.status === 'CANCELLED'"
              type="button" 
              class="btn btn-warning" 
              @click="navigateToSchedule"
            >
              <i class="fas fa-calendar-plus me-1"></i>Reschedule Maintenance
            </button>
            <button 
              v-if="selectedMaintenance?.status === 'COMPLETED'"
              type="button" 
              class="btn btn-primary" 
              @click="closeDetailAndOpenReport"
            >
              <i class="fas fa-file-alt me-1"></i>Generate Report
            </button>
            <button 
              v-if="selectedMaintenance?.status && ['IN_PROGRESS', 'SCHEDULED'].includes(selectedMaintenance.status)"
              type="button" 
              class="btn btn-danger" 
              @click="closeDetailAndOpenCancel"
            >
              <i class="fas fa-times me-1"></i>Cancel Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete Maintenance Modal -->
    <div class="modal fade" id="completeMaintenanceModal" tabindex="-1" ref="completeModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              Complete Maintenance - {{ selectedMaintenance?.assetId }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedMaintenance">
            <form @submit.prevent="completeMaintenance" class="needs-validation" novalidate ref="completeFormElement">
              <div class="complete-maintenance-form">
                <div class="mb-3">
                  <p><strong>Maintenance:</strong> {{ selectedMaintenance.description }}</p>
                  <p><strong>Estimated Cost:</strong> {{ selectedMaintenance.cost }}</p>
                </div>
                
                <div class="mb-3">
                  <label for="actualCost" class="form-label">Actual Cost <span class="text-danger">*</span></label>
                  <div class="input-group has-validation">
                    <span class="input-group-text"><i class="bi bi-currency-rupee"></i></span>
                    <input 
                      type="number" 
                      :class="['form-control', { 'is-invalid': completeFormErrors.actualCost }]"
                      id="actualCost"
                      v-model.number="completeForm.actualCost"
                      placeholder="0.00" 
                      step="0.01" 
                      min="0.01" 
                      max="100000" 
                      required
                      title="Please enter the actual cost for this maintenance"
                      @input="completeFormErrors.actualCost = ''"
                    >
                    <div class="invalid-feedback" v-if="completeFormErrors.actualCost">
                      {{ completeFormErrors.actualCost }}
                    </div>
                  </div>
                  <div class="form-text">Enter the actual cost incurred for this maintenance activity (required)</div>
                </div>
                
                <div class="mb-3">
                  <label for="completionNotes" class="form-label">Completion Notes <span class="text-muted">(Optional)</span></label>
                  <textarea 
                    class="form-control" 
                    id="completionNotes" 
                    v-model="completeForm.completionNotes"
                    rows="3" 
                    placeholder="Add any final notes about the completed maintenance..." 
                    maxlength="500"
                  ></textarea>
                  <div class="form-text">Any additional notes about the completion (max 500 characters)</div>
                  <div class="character-count text-end">
                    <small :class="`text-${completeForm.completionNotes.length > 450 ? 'danger' : completeForm.completionNotes.length > 375 ? 'warning' : 'muted'}`">
                      {{ completeForm.completionNotes.length }}/500 characters
                    </small>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success" @click="completeMaintenance" :disabled="completeLoading">
              <i :class="completeLoading ? 'fas fa-spinner fa-spin me-1' : 'fas fa-check me-1'"></i>
              {{ completeLoading ? 'Completing...' : 'Complete Maintenance' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Maintenance Modal -->
    <div class="modal fade" id="cancelMaintenanceModal" tabindex="-1" ref="cancelModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title d-flex align-items-center" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              <i class="fas fa-times-circle me-2 text-danger"></i>Cancel Maintenance - {{ selectedMaintenance?.assetId }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body pt-3" v-if="selectedMaintenance">
            <div class="cancel-maintenance-form">
              <!-- Warning Alert -->
              <div class="alert alert-warning d-flex align-items-start mb-4" style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
                <i class="fas fa-exclamation-triangle me-3 mt-1" style="color: #f39c12; font-size: 1.1rem;"></i>
                <div>
                  <strong>Warning:</strong> This action will permanently cancel the maintenance. It cannot be assigned to vendors after cancellation.
                </div>
              </div>
              
              <!-- Maintenance Summary -->
              <div class="maintenance-summary mb-4 p-3" style="background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                <h6 class="mb-3 d-flex align-items-center" style="color: var(--primary-black); font-weight: 600;">
                  <i class="fas fa-tools me-2"></i>Maintenance Summary
                </h6>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-2">
                      <small class="text-muted d-block" style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Asset ID</small>
                      <span class="fw-semibold" style="color: var(--primary-black);">{{ selectedMaintenance.assetId }}</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-2">
                      <small class="text-muted d-block" style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Asset Type</small>
                      <span class="fw-semibold" style="color: var(--primary-black);">{{ selectedMaintenance.assetName }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Cancellation Date -->
              <div class="mb-3">
                <label for="cancelDate" class="form-label fw-semibold" style="color: var(--primary-black);">
                  Cancellation Date <span class="text-danger">*</span>
                </label>
                <input 
                  type="date" 
                  :class="['form-control', { 'is-invalid': cancelFormErrors.cancelDate }]"
                  id="cancelDate" 
                  v-model="cancelForm.cancelDate"
                  required 
                  style="border: 2px solid #e9ecef; border-radius: 8px; padding: 0.75rem;"
                  @change="cancelFormErrors.cancelDate = ''"
                >
                <div class="invalid-feedback" v-if="cancelFormErrors.cancelDate">
                  {{ cancelFormErrors.cancelDate }}
                </div>
                <small class="form-text text-muted">Date when maintenance is being cancelled</small>
              </div>
              
              <!-- Cancellation Notes -->
              <div class="mb-3">
                <label for="cancelNotes" class="form-label fw-semibold" style="color: var(--primary-black);">
                  Cancellation Notes <span class="text-danger">*</span>
                </label>
                <textarea 
                  :class="['form-control', { 'is-invalid': cancelFormErrors.cancelNotes }]"
                  id="cancelNotes" 
                  v-model="cancelForm.cancelNotes"
                  rows="4" 
                  required
                  placeholder="Please describe the reason for cancelling this maintenance..." 
                  maxlength="1000"
                  style="border: 2px solid #e9ecef; border-radius: 8px; padding: 0.75rem; resize: vertical;"
                  @input="cancelFormErrors.cancelNotes = ''"
                ></textarea>
                <div class="invalid-feedback" v-if="cancelFormErrors.cancelNotes">
                  {{ cancelFormErrors.cancelNotes }}
                </div>
                <div class="d-flex justify-content-between align-items-center mt-1">
                  <small class="form-text text-muted">Describe why this maintenance is being cancelled (max 1000 characters)</small>
                  <small :class="`${cancelForm.cancelNotes.length > 900 ? 'text-danger fw-bold' : cancelForm.cancelNotes.length > 700 ? 'text-warning fw-semibold' : 'text-muted'} character-counter`">
                    {{ cancelForm.cancelNotes.length }}/1000 characters
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0" style="background-color: #f8f9fa;">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" 
                    style="border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 500;">
              Keep Maintenance
            </button>
            <button type="button" class="btn btn-danger" @click="cancelMaintenance" :disabled="cancelLoading"
                    style="border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 500;">
              <i :class="cancelLoading ? 'fas fa-spinner fa-spin me-1' : 'fas fa-times me-1'"></i>
              {{ cancelLoading ? 'Cancelling...' : 'Confirm Cancellation' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <div class="modal fade" id="generateReportModal" tabindex="-1" ref="reportModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">Generate Maintenance Report</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedMaintenance">
            <div class="generate-report-form">
              <div class="mb-3">
                <p><strong>Asset:</strong> {{ selectedMaintenance.assetName }} ({{ selectedMaintenance.assetId }})</p>
                <p><strong>Maintenance:</strong> {{ selectedMaintenance.description }}</p>
                <p><strong>Completed:</strong> {{ formatDate(selectedMaintenance.scheduledDate) }}</p>
                <p><strong>Cost:</strong> {{ selectedMaintenance.cost }}</p>
              </div>
              
              <div class="mb-3">
                <label for="reportType" class="form-label">Report Type <span class="text-danger">*</span></label>
                <select :class="['form-select', { 'is-invalid': reportFormErrors.reportType }]" id="reportType" v-model="reportForm.reportType" required @change="reportFormErrors.reportType = ''">
                  <option value="">Select report type</option>
                  <option value="summary">Summary Report</option>
                  <option value="detailed">Detailed Report</option>
                  <option value="cost-analysis">Cost Analysis</option>
                  <option value="warranty">Warranty Report</option>
                </select>
                <div class="invalid-feedback" v-if="reportFormErrors.reportType">{{ reportFormErrors.reportType }}</div>
              </div>
              
              <div class="mb-3">
                <label for="reportFormat" class="form-label">Format</label>
                <select class="form-select" id="reportFormat" v-model="reportForm.reportFormat">
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="word">Word Document</option>
                </select>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="includeTimeline" v-model="reportForm.includeTimeline">
                  <label class="form-check-label" for="includeTimeline">
                    Include maintenance timeline
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="generateReport" :disabled="reportLoading">
              <i :class="reportLoading ? 'fas fa-spinner fa-spin me-1' : 'fas fa-download me-1'"></i>
              {{ reportLoading ? 'Generating...' : 'Generate & Download' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { maintenanceService } from '@/services/maintenanceService'
import { fetchDashboardStats } from '@/services/api'
import { showToast, showErrorToast } from '@/utils/toast'
import AppPagination from '@/components/pagination/AppPagination.vue'

const router = useRouter()

// Local type representing a table row in this view
interface MaintenanceRow {
  id: number
  assetId: string
  assetName: string
  assetType: string
  assetBrand: string
  assetModel: string
  maintenanceTypeId: string
  maintenanceTypeName: string
  type: string // For backward compatibility with template
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  vendor: string
  vendorName: string | null
  assignedTo: string | null
  scheduledDate: string
  cost: string
  costType: 'Estimated' | 'Actual'
  estimatedCost: number | null
  actualCost: number | null
  description: string
  completionNotes: string | null
  cancellationNotes: string | null
  progressNotes: string[]
}

// Reactive data
const maintenanceData: Ref<MaintenanceRow[]> = ref([])
const isLoading = ref(false)
const totalItems = ref(0)
const totalPages = ref(1)
const availableVendors = ref<Array<{id: string, name: string}>>([])
const vendorsLoading = ref(false)

const filters = reactive({
  search: '',
  status: '',
  type: '',
  vendor: ''
})

const sortBy = ref('scheduledDate')
const sortAscending = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

// API functions
  const fetchVendors = async () => {
    try {
      vendorsLoading.value = true
      const response = await maintenanceService.getVendors()
      if (response.data && response.data.vendors) {
        availableVendors.value = response.data.vendors.map(vendor => ({
          id: vendor.id,
          name: vendor.name
        }))
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      availableVendors.value = []
    } finally {
      vendorsLoading.value = false
    }
  }

  const fetchMaintenances = async () => {
    try {
      isLoading.value = true
      
      // Map frontend sort fields to backend fields
      const sortFieldMap: Record<string, string> = {
        'cost': 'estimatedCost',
        'type': 'maintenanceType',
        'vendor': 'vendorName',
        'assetId': 'scheduledDate' // Asset ID sorting not supported yet, fallback to date
      }
      
      // Map frontend maintenance type values to backend enum values
      const maintenanceTypeMap: Record<string, string> = {
        'Preventive': 'PREVENTIVE',
        'Corrective': 'CORRECTIVE',
        'Emergency': 'EMERGENCY',
        'Upgrade': 'UPGRADE'
      }
      
      const params = {
        page: currentPage.value,
        limit: itemsPerPage,
        search: filters.search || undefined,
        status: filters.status || undefined,
        maintenanceType: filters.type ? maintenanceTypeMap[filters.type] || filters.type : undefined,
        vendorName: filters.vendor || undefined,
        sortBy: sortFieldMap[sortBy.value] || sortBy.value,
        sortOrder: (sortAscending.value ? 'asc' : 'desc') as 'asc' | 'desc'
      }

      const response = await maintenanceService.getMaintenances(params)
    
    if (response.data) {
      // Transform API data to match local interface
      maintenanceData.value = response.data.maintenances.map(maintenance => ({
        id: parseInt(maintenance.id),
        assetId: maintenance.assetId,
        assetName: maintenance.assetName,
        assetType: '', // Not provided in API response
        assetBrand: '', // Not provided in API response  
        assetModel: '', // Not provided in API response
        maintenanceTypeId: maintenance.maintenanceTypeId,
        maintenanceTypeName: maintenance.maintenanceTypeName,
        type: maintenance.maintenanceTypeName, // For backward compatibility
        status: maintenance.status,
        vendor: maintenance.vendorName || 'Internal Team',
        vendorName: maintenance.vendorName || null,
        assignedTo: maintenance.assignedTo || 'Not Assigned',
        scheduledDate: maintenance.scheduledDate,
        cost: maintenance.actualCost 
          ? `₹${maintenance.actualCost.toFixed(2)}` 
          : `₹${maintenance.estimatedCost?.toFixed(2) || '0.00'}`,
        costType: maintenance.actualCost ? 'Actual' : 'Estimated',
        estimatedCost: maintenance.estimatedCost || null,
        actualCost: maintenance.actualCost || null,
        description: maintenance.description,
        completionNotes: null, // Not in API interface
        cancellationNotes: null, // Not in API interface
        progressNotes: generateProgressNotes(maintenance)
      }))
      
      // Fix: Access pagination data from the correct nested structure
      const pagination = response.data.pagination || {}
      totalItems.value = pagination.total || 0

      totalPages.value = pagination.totalPages || Math.ceil((pagination.total || 0) / itemsPerPage)
      
      // Update stats after loading maintenance data
      fetchStats()
    } else {
      showErrorToast('Failed to fetch maintenance data')
    }
  } catch (error) {
    console.error('Error fetching maintenances:', error)
    showErrorToast('Error loading maintenance data')
    maintenanceData.value = []
    totalItems.value = 0
    totalPages.value = 1
  } finally {
    isLoading.value = false
  }
}

const generateProgressNotes = (maintenance: any): string[] => {
  const notes: string[] = []
  
  // Add creation note
  notes.push(`Maintenance scheduled - ${new Date(maintenance.createdAt).toLocaleDateString()}`)
  
  // Add status-based notes
  if (maintenance.status === 'IN_PROGRESS' && maintenance.actualStartDate) {
    notes.push(`Started on ${maintenance.actualStartDate}`)
  }
  
  if (maintenance.status === 'COMPLETED' && maintenance.actualCompletionDate) {
    notes.push(`Completed on ${maintenance.actualCompletionDate}`)
    if (maintenance.completionNotes) {
      notes.push(`Notes: ${maintenance.completionNotes}`)
    }
  }
  
  if (maintenance.status === 'CANCELLED' && maintenance.cancellationDate) {
    notes.push(`Cancelled on ${maintenance.cancellationDate}`)
    if (maintenance.cancellationNotes) {
      notes.push(`Reason: ${maintenance.cancellationNotes}`)
    }
  }
  
  return notes
}

// Modal refs
const detailModal = ref<HTMLElement>()
const completeModal = ref<HTMLElement>()
const cancelModal = ref<HTMLElement>()
const reportModal = ref<HTMLElement>()
const completeFormElement = ref<HTMLFormElement>()

// Selected maintenance for modals
const selectedMaintenance = ref<MaintenanceRow | null>(null)
const maintenanceHistory = ref<MaintenanceRow[]>([])

// Form data
const completeForm = reactive({
  actualCost: '',
  completionNotes: ''
})

const cancelForm = reactive({
  cancelDate: new Date().toISOString().split('T')[0],
  cancelNotes: ''
})

// Form validation errors
const completeFormErrors = reactive({
  actualCost: ''
})

const cancelFormErrors = reactive({
  cancelDate: '',
  cancelNotes: ''
})

// Validation functions
const validateCompleteForm = () => {
  let isValid = true
  
  // Reset errors
  completeFormErrors.actualCost = ''
  
  // Validate actual cost
  const actualCost = completeForm.actualCost
  
  // Handle empty/null/undefined values  
  if (actualCost === null || actualCost === undefined || actualCost === '' || (typeof actualCost === 'number' && actualCost === 0)) {
    completeFormErrors.actualCost = 'Please enter the actual cost'
    isValid = false
    return isValid
  }
  
  // Convert to number for validation
  const actualCostValue = typeof actualCost === 'number' ? actualCost : parseFloat(String(actualCost))
  
  // Check if it's a valid number
  if (isNaN(actualCostValue)) {
    completeFormErrors.actualCost = 'Please enter a valid number'
    isValid = false
  } else if (actualCostValue <= 0) {
    completeFormErrors.actualCost = 'Actual cost must be greater than 0'
    isValid = false
  } else if (actualCostValue > 100000) {
    completeFormErrors.actualCost = 'Actual cost cannot exceed ₹1,00,000'
    isValid = false
  }
  
  return isValid
}

const validateCancelForm = () => {
  let isValid = true
  
  // Reset errors
  cancelFormErrors.cancelDate = ''
  cancelFormErrors.cancelNotes = ''
  
  // Validate cancel date
  if (!cancelForm.cancelDate || cancelForm.cancelDate.trim() === '') {
    cancelFormErrors.cancelDate = 'Please select a cancellation date'
    isValid = false
  }
  
  // Validate cancel notes
  if (!cancelForm.cancelNotes || cancelForm.cancelNotes.trim() === '') {
    cancelFormErrors.cancelNotes = 'Please provide cancellation notes'
    isValid = false
  } else if (cancelForm.cancelNotes.trim().length < 10) {
    cancelFormErrors.cancelNotes = 'Cancellation notes must be at least 10 characters'
    isValid = false
  }
  
  return isValid
}

const reportForm = reactive({
  reportType: '',
  reportFormat: 'pdf',
  includeTimeline: true
})

// Report form validation errors
const reportFormErrors = reactive({
  reportType: ''
})

// Loading states
const completeLoading = ref(false)
const cancelLoading = ref(false)
const reportLoading = ref(false)

// Stats interval for periodic updates
let statsInterval: number | undefined

// Initialize data on component mount
onMounted(() => {
  fetchMaintenances()
  fetchVendors()
  fetchStats()
  // Refresh every 1 minute
  statsInterval = window.setInterval(fetchStats, 60_000)
})

onUnmounted(() => {
  if (statsInterval) {
    clearInterval(statsInterval)
    statsInterval = undefined
  }
})

// Stats from API with auto-refresh
const statsData = reactive({
  underMaintenance: 0,
  scheduled: 0,
  completed: 0,
  cancelled: 0,
  underMaintenancePercent: 0,
  scheduledPercent: 0,
  completedPercent: 0,
  cancelledPercent: 0
})

const fetchStats = async () => {
  try {
    // Get all maintenance records to compute accurate stats
    const response = await maintenanceService.getMaintenances({ page: 1, limit: 1000 })
    
    if (response.data && response.data.maintenances) {
      const maintenances = response.data.maintenances
      
      // Count by status
      const counts = maintenances.reduce((acc, m) => {
        acc.total++
        if (m.status === "IN_PROGRESS") acc.underMaintenance++
        if (m.status === "SCHEDULED") acc.scheduled++
        if (m.status === "COMPLETED") acc.completed++
        if (m.status === "CANCELLED") acc.cancelled++
        return acc
      }, { total: 0, underMaintenance: 0, scheduled: 0, completed: 0, cancelled: 0 })

      // Update stats data
      statsData.underMaintenance = counts.underMaintenance
      statsData.scheduled = counts.scheduled
      statsData.completed = counts.completed
      statsData.cancelled = counts.cancelled

      // Calculate percentages
      const total = counts.total || 1
      statsData.underMaintenancePercent = Math.round((counts.underMaintenance / total) * 100)
      statsData.scheduledPercent = Math.round((counts.scheduled / total) * 100)
      statsData.completedPercent = Math.round((counts.completed / total) * 100)
      statsData.cancelledPercent = Math.round((counts.cancelled / total) * 100)
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    // Fallback to current maintenance data if API fails
    const counts = maintenanceData.value.reduce((acc, m) => {
      acc.total++
      if (m.status === "IN_PROGRESS") acc.underMaintenance++
      if (m.status === "SCHEDULED") acc.scheduled++
      if (m.status === "COMPLETED") acc.completed++
      if (m.status === "CANCELLED") acc.cancelled++
      return acc
    }, { total: 0, underMaintenance: 0, scheduled: 0, completed: 0, cancelled: 0 })

    statsData.underMaintenance = counts.underMaintenance
    statsData.scheduled = counts.scheduled
    statsData.completed = counts.completed
    statsData.cancelled = counts.cancelled

    const total = counts.total || 1
    statsData.underMaintenancePercent = Math.round((counts.underMaintenance / total) * 100)
    statsData.scheduledPercent = Math.round((counts.scheduled / total) * 100)
    statsData.completedPercent = Math.round((counts.completed / total) * 100)
    statsData.cancelledPercent = Math.round((counts.cancelled / total) * 100)
  }
}
const stats = computed(() => statsData)

// Since we're using server-side pagination, we just return the data from the API
const filteredMaintenance = computed(() => {
  return maintenanceData.value
})

// Server-side pagination - totalPages is now a ref updated from API response

// Pagination info for display
const paginationInfo = computed(() => {
  const start = totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(currentPage.value * itemsPerPage, totalItems.value)

  return { start, end, total: totalItems.value }
})



// Methods
const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const navigateToSchedule = () => {
  // Navigate to schedule maintenance page
  router.push('/app/maintenance/schedule')
}

const navigateToEdit = (maintenance: MaintenanceRow) => {
  // Navigate to edit maintenance page
  router.push(`/app/maintenance/edit/${maintenance.id}`)
}

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value
  fetchMaintenances()
}

const clearFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.type = ''
  filters.vendor = ''
  currentPage.value = 1
  // Clear any pending search timeout
  if (searchTimeout) clearTimeout(searchTimeout)
  fetchMaintenances()
}

const changePage = (page: number | string) => {
  if (typeof page !== 'number') return
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchMaintenances()
  }
}

// Filter methods - similar to EmployeesView
let searchTimeout: number | null = null
const filterMaintenances = () => {
  currentPage.value = 1
  // Debounce search input
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchMaintenances()
  }, 300)
}

const filterMaintenancesImmediate = () => {
  currentPage.value = 1
  fetchMaintenances()
}

const sortMaintenances = () => {
  fetchMaintenances()
}

// Modal methods
const showMaintenanceDetails = async (maintenance: MaintenanceRow) => {
  selectedMaintenance.value = maintenance
  maintenanceHistory.value = []
  
  // Fetch maintenance history for this asset
  try {
    const response = await maintenanceService.getMaintenanceHistory(maintenance.assetId)
    if (response.data && response.data.maintenanceHistory) {
      // Transform the history data to match our local interface
      maintenanceHistory.value = response.data.maintenanceHistory.map(history => ({
        id: parseInt(history.id),
        assetId: history.assetId,
        assetName: history.assetName,
        assetType: '', 
        assetBrand: '', 
        assetModel: '', 
        maintenanceTypeId: history.maintenanceTypeId,
        maintenanceTypeName: history.maintenanceTypeName,
        type: history.maintenanceTypeName,
        status: history.status,
        vendor: history.vendorName || 'Internal Team',
        vendorName: history.vendorName || null,
        assignedTo: history.assignedTo || 'Not Assigned',
        scheduledDate: history.scheduledDate,
        cost: history.actualCost 
          ? `₹${history.actualCost.toFixed(2)}` 
          : history.estimatedCost
            ? `₹${history.estimatedCost.toFixed(2)}`
            : '₹0.00',
        costType: history.actualCost ? 'Actual' : 'Estimated',
        estimatedCost: history.estimatedCost || null,
        actualCost: history.actualCost || null,
        description: history.description,
        completionNotes: history.completionNotes || null,
        cancellationNotes: history.cancellationNotes || null,
        progressNotes: generateProgressNotes(history)
      }))
    }
  } catch (error) {
    console.error('Error fetching maintenance history:', error)
    // Continue showing the modal even if history fails to load
  }
  
  const modal = new Modal(detailModal.value!)
  modal.show()
}

const openCompleteModal = (maintenance: MaintenanceRow) => {
  selectedMaintenance.value = maintenance
  completeForm.actualCost = ''
  completeForm.completionNotes = ''
  completeFormErrors.actualCost = ''
  const modal = new Modal(completeModal.value!)
  modal.show()
}

const openCancelModal = (maintenance: MaintenanceRow) => {
  selectedMaintenance.value = maintenance
  cancelForm.cancelDate = new Date().toISOString().split('T')[0]
  cancelForm.cancelNotes = ''
  cancelFormErrors.cancelDate = ''
  cancelFormErrors.cancelNotes = ''
  const modal = new Modal(cancelModal.value!)
  modal.show()
}

const openReportModal = (maintenance: MaintenanceRow) => {
  selectedMaintenance.value = maintenance
  reportForm.reportType = ''
  reportForm.reportFormat = 'pdf'
  reportForm.includeTimeline = true
  const modal = new Modal(reportModal.value!)
  modal.show()
}

const closeDetailAndOpenComplete = () => {
  const detailModalInstance = Modal.getInstance(detailModal.value!)
  if (detailModalInstance) {
    detailModalInstance.hide()
  }
  setTimeout(() => {
    if (selectedMaintenance.value) {
      openCompleteModal(selectedMaintenance.value)
    }
  }, 300)
}

const closeDetailAndOpenCancel = () => {
  const detailModalInstance = Modal.getInstance(detailModal.value!)
  if (detailModalInstance) {
    detailModalInstance.hide()
  }
  setTimeout(() => {
    if (selectedMaintenance.value) {
      openCancelModal(selectedMaintenance.value)
    }
  }, 300)
}

const closeDetailAndOpenReport = () => {
  const detailModalInstance = Modal.getInstance(detailModal.value!)
  if (detailModalInstance) {
    detailModalInstance.hide()
  }
  setTimeout(() => {
    if (selectedMaintenance.value) {
      openReportModal(selectedMaintenance.value)
    }
  }, 300)
}

const completeMaintenance = async () => {
  // Validate form
  if (!validateCompleteForm()) {
    return
  }

  if (!selectedMaintenance.value) return

  completeLoading.value = true

  try {
    const response = await maintenanceService.completeMaintenance(
      selectedMaintenance.value.id.toString(),
      {
        actualCost: parseFloat(completeForm.actualCost),
        completionNotes: completeForm.completionNotes || undefined
      }
    )

    if (response.data && response.data.maintenance) {
      // Update local data
      const row = maintenanceData.value.find(m => m.id === selectedMaintenance.value!.id)
      if (row) {
        row.status = 'COMPLETED'
        row.cost = `₹${parseFloat(completeForm.actualCost).toFixed(2)}`
        row.costType = 'Actual'
        row.actualCost = parseFloat(completeForm.actualCost)
        row.completionNotes = completeForm.completionNotes || null
      }

      showToast(`Maintenance completed successfully!<br>Actual Cost: ₹${parseFloat(completeForm.actualCost).toFixed(2)}${completeForm.completionNotes ? '<br>Notes: ' + completeForm.completionNotes : ''}`, 'success')
      const modal = Modal.getInstance(completeModal.value!)
      if (modal) modal.hide()

      // Reset form
      completeForm.actualCost = ''
      completeForm.completionNotes = ''
      completeFormErrors.actualCost = ''
    } else {
      showToast(response.message || 'Error completing maintenance. Please try again.', 'error')
    }

  } catch (error) {
    console.error('Error completing maintenance:', error)
    showToast('Error completing maintenance. Please try again.', 'error')
  } finally {
    completeLoading.value = false
  }
}

const cancelMaintenance = async () => {
  // Validate form
  if (!validateCancelForm()) {
    return
  }
  
  if (!selectedMaintenance.value) return

  cancelLoading.value = true

  try {
    const response = await maintenanceService.cancelMaintenance(
      selectedMaintenance.value.id.toString(),
      {
        cancelDate: cancelForm.cancelDate,
        cancelNotes: cancelForm.cancelNotes
      }
    )

    if (response.data && response.data.maintenance) {
      // Update local data
      const row = maintenanceData.value.find(m => m.id === selectedMaintenance.value!.id)
      if (row) {
        row.status = 'CANCELLED'
        row.cancellationNotes = cancelForm.cancelNotes
      }

      showToast(`Maintenance cancelled successfully!<br>Date: ${cancelForm.cancelDate}<br>Notes: ${cancelForm.cancelNotes}`, 'success')
      const modal = Modal.getInstance(cancelModal.value!)
      if (modal) modal.hide()

      // Reset form
      cancelForm.cancelDate = ''
      cancelForm.cancelNotes = ''
      cancelFormErrors.cancelDate = ''
      cancelFormErrors.cancelNotes = ''
    } else {
      showToast(response.message || 'Error cancelling maintenance. Please try again.', 'error')
    }

  } catch (error) {
    console.error('Error cancelling maintenance:', error)
    showToast('Error cancelling maintenance. Please try again.', 'error')
  } finally {
    cancelLoading.value = false
  }
}

const generateReport = async () => {
  if (!reportForm.reportType) {
    reportFormErrors.reportType = 'Please select a report type'
    return
  }
  if (!selectedMaintenance.value) {
    showToast('No maintenance selected.', 'error')
    return
  }

  reportLoading.value = true

  try {
    const m = selectedMaintenance.value

    const title = `Maintenance Report - ${m.assetId}`
    const dateStr = new Date().toLocaleString()

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset=\"utf-8\" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 24px; }
    h1 { font-size: 20px; margin: 0 0 16px; }
    h2 { font-size: 16px; margin: 24px 0 8px; }
    .meta { color: #555; font-size: 12px; margin-bottom: 16px; }
    .section { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
    .row { display: flex; gap: 16px; }
    .col { flex: 1; }
    .label { color: #555; font-size: 12px; margin-bottom: 4px; }
    .value { font-size: 14px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
    .muted { color: #666; }
    @media print {
      @page { size: A4; margin: 16mm; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class=\"no-print\" style=\"text-align:right; margin-bottom: 8px;\">
    <button onclick=\"window.print()\" style=\"padding:8px 12px; border:1px solid #ccc; border-radius:6px; background:#f9fafb; cursor:pointer;\">Print / Save as PDF</button>
  </div>

  <h1>${title}</h1>
  <div class=\"meta\">Generated on ${dateStr} • Type: ${reportForm.reportType} • Format: ${reportForm.reportFormat.toUpperCase()}</div>

  <div class=\"section\">
    <div class=\"row\">
      <div class=\"col\">
        <div class=\"label\">Asset</div>
        <div class=\"value\">${m.assetName} (${m.assetId})</div>
      </div>
      <div class=\"col\">
        <div class=\"label\">Type / Brand / Model</div>
        <div class=\"value\">${m.assetType} / ${m.assetBrand} / ${m.assetModel}</div>
      </div>
    </div>
    <div class=\"row\" style=\"margin-top:8px;\">
      <div class=\"col\">
        <div class=\"label\">Status</div>
        <div class=\"value\">${m.status}</div>
      </div>
      <div class=\"col\">
        <div class=\"label\">Scheduled Date</div>
        <div class=\"value\">${m.scheduledDate}</div>
      </div>
    </div>
  </div>

  <div class=\"section\">
    <div class=\"label\">Maintenance</div>
    <div class=\"value\">${m.description}</div>
    <table>
      <tr><th>Type</th><td>${m.maintenanceTypeName}</td></tr>
      <tr><th>Vendor</th><td>${m.vendorName ?? '—'}</td></tr>
      <tr><th>Estimated Cost</th><td>${m.estimatedCost != null ? '₹' + m.estimatedCost : '—'}</td></tr>
      <tr><th>Actual Cost</th><td>${m.actualCost != null ? '₹' + m.actualCost : m.cost ? m.cost : '—'}</td></tr>
      <tr><th>Completion Notes</th><td>${m.completionNotes ?? '—'}</td></tr>
      <tr><th>Cancellation Notes</th><td>${m.cancellationNotes ?? '—'}</td></tr>
    </table>
  </div>

  ${reportForm.includeTimeline ? `<div class=\"section\"><div class=\"label\">Timeline</div><div class=\"muted\">Timeline details not available. This section is included by request.</div></div>` : ''}

  <div class=\"muted\" style=\"margin-top:16px; font-size: 11px;\">This is a system-generated report.</div>
</body>
</html>`

    const printWindow = window.open('', '_blank')
    if (!printWindow) throw new Error('Popup blocked. Please allow popups to download the report.')

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()

    // Auto-print on load
    printWindow.onload = () => {
      try { printWindow.focus(); printWindow.print(); } catch (e) {}
    }

    showToast('Report is ready. Use the browser dialog to save as PDF.', 'success')

    const modal = Modal.getInstance(reportModal.value!)
    if (modal) modal.hide()

  } catch (error) {
    console.error('Error generating report:', error)
    showToast('Error generating report. Please try again.', 'error')
  } finally {
    reportLoading.value = false
  }
}

// Toast notification function is now imported from utils

onMounted(() => {
  // Any initialization logic
})
</script>

<style scoped>
.maintenance-page {
  background: var(--primary-white);
  min-height: calc(100vh - 60px);
}

/* Stats Cards */
.stats-card-modern {
  border-radius: 0.75rem !important;
  border: 1px solid var(--element-gray) !important;
  background-color: var(--primary-white) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  transition: none !important;
  overflow: hidden; /* ensure perfect rounded corners */
  background-clip: padding-box; /* prevent background bleed under border */
}

/* Make inner content respect rounded corners */
.stats-card-modern .card-body {
  border-radius: inherit;
}

/* Disable hover effects on stats cards */
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

/* Prevent hover interactions */
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

.stats-icon.bg-warning {
  background-color: var(--secondary-orange) !important;
  color: white !important;
}

.progress-bar.bg-warning {
  background-color: var(--secondary-orange) !important;
}


.stats-icon.bg-info {
  background-color: var(--secondary-purple) !important;
  color: white !important;
}

.progress-bar.bg-info {
  background-color: var(--secondary-purple) !important;
}

.stats-icon.bg-success {
  background-color: var(--secondary-green) !important;
  color: white !important;
}

.progress-bar.bg-success {
  background-color: var(--secondary-green) !important;
}

.stats-icon.bg-secondary {
  background-color: var(--secondary-red) !important;
  color: white !important;
}

.progress-bar.bg-secondary {
  background-color: var(--secondary-red) !important;
}

/* Status Indicator */
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

/* Badges */
.badge {
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge-scheduled {
  background-color: var(--secondary-purple) !important;
  color: white !important;
}

.badge-in-progress {
  background-color: var(--secondary-orange) !important;
  color: white !important;
}

.badge-completed {
  background-color: var(--secondary-green) !important;
  color: white !important;
}

.badge-cancelled {
  background-color: var(--secondary-red) !important;
  color: white !important;
}

.badge-type-preventive {
  background-color: var(--secondary-green) !important;
  color: white !important;
}

.badge-type-corrective {
  background-color: var(--secondary-pink) !important;
  color: white !important;
}

.badge-type-emergency {
  background-color: var(--secondary-red) !important;
  color: white !important;
}

/* Modern Button Styling */
.btn-modern {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: none;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
  border: 1.5px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-modern:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-modern:hover:before {
  left: 100%;
}

.btn-modern:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-modern.btn-warning {
  background-color: var(--secondary-orange) !important;
  border-color: var(--secondary-orange) !important;
  color: white !important;
}

.btn-modern.btn-warning:hover {
  background-color: #e67d4d !important;
  border-color: #e67d4d !important;
  color: white !important;
}

/* Action buttons */
.maintenance-actions .btn-action {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
  border-radius: 0.5rem !important;
  padding: 0.375rem 0.75rem !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  min-height: 32px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 36px !important;
}

.maintenance-actions .btn-action:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12) !important;
  background-color: var(--primary-white) !important;
  border-color: var(--primary-mid-light) !important;
}

.btn-action.btn-view:hover {
  color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
}

.btn-action.btn-edit:hover {
  color: var(--secondary-orange) !important;
  border-color: var(--secondary-orange) !important;
}

.btn-action.btn-complete:hover {
  color: var(--secondary-green) !important;
  border-color: var(--secondary-green) !important;
}

.btn-action.btn-cancel:hover {
  color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
}

.btn-action.btn-reschedule:hover,
.btn-action.btn-report:hover {
  color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
}

/* Table styling */
.table-hover tbody tr:hover {
  background-color: var(--primary-light-gray) !important;
  transition: all 0.2s ease !important;
}

.table td, .table th {
  padding: 0.75rem !important;
}

/* Match table alignment with EmployeesView */
.table th:first-child, .table td:first-child {
  padding-left: 1.25rem !important;
}

.table th:last-child, .table td:last-child {
  padding-right: 1.75rem !important; /* extra right gutter to mirror left */
  padding-left: 0.5rem !important;
}

.table-responsive {
  margin: 0 !important;
  padding: 0 !important;
}

/* Column width distribution for 7 columns */
/* 1: Asset ID */
.table th:nth-child(1), .table td:nth-child(1) {
  width: 13% !important;
  min-width: 160px !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}
/* 2: Type */
.table th:nth-child(2), .table td:nth-child(2) { width: 11% !important; }
/* 3: Status */
.table th:nth-child(3), .table td:nth-child(3) { width: 12% !important; }
/* 4: Vendor/Assigned */
.table th:nth-child(4), .table td:nth-child(4) { width: 19% !important; }
/* 5: Date */
.table th:nth-child(5), .table td:nth-child(5) { width: 14% !important; }
/* 6: Cost */
.table th:nth-child(6), .table td:nth-child(6) { width: 17% !important; }

/* 7: Actions column */
.table th:nth-child(7), .table td:nth-child(7) {
  width: 136px !important;
  min-width: 136px !important;
  max-width: 136px !important;
  text-align: left !important;
}

/* Actions button group spacing */
.maintenance-actions {
  justify-content: flex-start !important;
  gap: 0.375rem !important;
}

.maintenance-actions .btn {
  min-width: 32px !important;
  min-height: 32px !important;
  padding: 0.25rem !important;
}

/* Card styling */
.card {
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

.card:hover:not(.stats-card-modern) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
}

/* Pagination */
.pagination-modern {
  --bs-pagination-padding-x: 0.75rem;
  --bs-pagination-padding-y: 0.5rem;
  --bs-pagination-font-size: 0.875rem;
  --bs-pagination-color: var(--primary-dark-gray);
  --bs-pagination-bg: var(--primary-white);
  --bs-pagination-border-width: 1px;
  --bs-pagination-border-color: var(--element-gray);
  --bs-pagination-border-radius: 0.5rem;
  --bs-pagination-hover-color: var(--secondary-purple);
  --bs-pagination-hover-bg: var(--primary-light-gray);
  --bs-pagination-hover-border-color: var(--primary-mid-light);
  --bs-pagination-focus-color: var(--secondary-purple);
  --bs-pagination-focus-bg: var(--primary-light-gray);
  --bs-pagination-focus-box-shadow: 0 0 0 0.25rem rgba(51, 31, 234, 0.25);
  --bs-pagination-active-color: var(--primary-white);
  --bs-pagination-active-bg: var(--secondary-purple);
  --bs-pagination-active-border-color: var(--secondary-purple);
  --bs-pagination-disabled-color: var(--primary-mid-gray);
  --bs-pagination-disabled-bg: var(--primary-light-gray);
  --bs-pagination-disabled-border-color: var(--element-gray);
}

.pagination-modern .page-link {
  border-radius: 0.5rem !important;
  margin: 0 0.125rem !important;
  min-width: 40px !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.pagination-modern .page-item.active .page-link {
  background-color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(51, 31, 234, 0.25) !important;
}

.pagination-modern .page-item:not(.active) .page-link:hover {
  background-color: var(--primary-light-gray) !important;
  border-color: var(--primary-mid-light) !important;
  color: var(--secondary-purple) !important;
  transform: translateY(-1px) !important;
}

/* Modal styling */
.modal-footer {
  background-color: var(--primary-light-gray) !important;
  border-top: 1px solid var(--element-gray) !important;
  padding: 1rem 1.5rem !important;
}

.modal-footer .btn {
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.modal-footer .btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.maintenance-info-section,
.timeline-info-section,
.cost-info-section,
.description-section {
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.5rem !important;
}

.section-title {
  color: var(--primary-black) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.75rem !important;
  padding-bottom: 0.5rem !important;
  border-bottom: 1px solid var(--element-gray) !important;
}

.info-label {
  font-size: 0.8rem !important;
  color: var(--primary-mid-gray) !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.025em !important;
  margin-bottom: 0.25rem !important;
}

.info-value {
  color: var(--primary-black) !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  line-height: 1.4 !important;
}

.description-content {
  color: var(--primary-black) !important;
  font-size: 0.9rem !important;
  line-height: 1.5 !important;
}

.service-notes {
  margin: 0.5rem 0 0 1rem !important;
  color: var(--primary-dark-gray) !important;
}

.service-notes li {
  margin-bottom: 0.25rem !important;
  font-size: 0.85rem !important;
}

/* Form styling */
.complete-maintenance-form .form-label,
.cancel-maintenance-form .form-label,
.generate-report-form .form-label {
  font-weight: 600 !important;
  color: var(--primary-black) !important;
  margin-bottom: 0.5rem !important;
}

.complete-maintenance-form .form-control,
.complete-maintenance-form .form-select,
.cancel-maintenance-form .form-control,
.generate-report-form .form-control,
.generate-report-form .form-select {
  border: 2px solid var(--primary-mid-light) !important;
  border-radius: 0.5rem !important;
  padding: 0.75rem !important;
  font-size: 0.9rem !important;
}

.complete-maintenance-form .form-control:focus,
.complete-maintenance-form .form-select:focus,
.cancel-maintenance-form .form-control:focus,
.generate-report-form .form-control:focus,
.generate-report-form .form-select:focus {
  border-color: var(--secondary-purple) !important;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25) !important;
}

.complete-maintenance-form .input-group-text {
  background-color: var(--primary-light-gray) !important;
  border: 2px solid var(--primary-mid-light) !important;
  border-right: none !important;
  color: var(--primary-dark-gray) !important;
  font-weight: 600 !important;
}

.form-text {
  color: var(--primary-mid-gray) !important;
  font-size: 0.8rem !important;
  margin-top: 0.25rem !important;
}

.character-count {
  margin-top: 0.25rem;
  transition: color 0.3s ease;
}

/* Button colors */
.btn-success {
  background-color: var(--secondary-green) !important;
  border-color: var(--secondary-green) !important;
  color: white !important;
}

.btn-success:hover {
  background-color: #1e9c5a !important;
  border-color: #1e9c5a !important;
  color: white !important;
}

.btn-danger {
  background-color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
  color: white !important;
}

.btn-danger:hover {
  background-color: #d63031 !important;
  border-color: #d63031 !important;
  color: white !important;
}

.btn-warning {
  background-color: var(--secondary-orange) !important;
  border-color: var(--secondary-orange) !important;
  color: white !important;
}

.btn-warning:hover {
  background-color: #e67d4d !important;
  border-color: #e67d4d !important;
  color: white !important;
}

.btn-primary {
  background-color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
  color: white !important;
}

.btn-primary:hover {
  background-color: #2415c7 !important;
  border-color: #2415c7 !important;
  color: white !important;
}

.btn-secondary {
  background-color: var(--primary-light-gray) !important;
  border-color: var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
}

.btn-secondary:hover {
  background-color: var(--element-gray) !important;
  border-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
}

/* Text colors */
.text-success {
  color: var(--secondary-green) !important;
}

.text-info {
  color: var(--secondary-purple) !important;
}

.text-warning {
  color: var(--secondary-orange) !important;
}

.text-danger {
  color: var(--secondary-red) !important;
}

/* Maintenance History Timeline */
.maintenance-history-section {
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.5rem !important;
}

.history-timeline {
  position: relative;
  padding-left: 2rem;
}

.history-timeline::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--element-gray);
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -2.25rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--primary-white);
  background: var(--primary-mid-gray);
}

.timeline-scheduled .timeline-marker {
  background: var(--secondary-purple);
}

.timeline-in-progress .timeline-marker {
  background: var(--secondary-orange);
}

.timeline-completed .timeline-marker {
  background: var(--secondary-green);
}

.timeline-cancelled .timeline-marker {
  background: var(--secondary-red);
}

.timeline-content {
  background: var(--primary-light-gray);
  border: 1px solid var(--element-gray);
  border-radius: 0.5rem;
  padding: 1rem;
}

.timeline-title {
  color: var(--primary-black);
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}

.timeline-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.timeline-meta .badge {
  font-size: 0.7rem;
}

.timeline-date {
  font-size: 0.8rem;
  color: var(--primary-mid-gray);
  font-weight: 500;
}

.timeline-details {
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.timeline-details .text-muted {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-weight: 500;
}

.timeline-notes {
  font-style: italic;
  color: var(--primary-dark-gray);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style> 