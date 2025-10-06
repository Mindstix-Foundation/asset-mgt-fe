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
            <small class="text-muted">
              Updated {{ lastStatsUpdated }}
            </small>
          </div>
        </div>
      </div>

      <!-- Filters (Assets-style) -->
      <div class="mb-4">
        <div class="row align-items-end">
          <!-- Search -->
          <div class="col-12 col-lg-7 mb-3">
            <label class="form-label" for="mv-search">Search Maintenance</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
              <input 
                id="mv-search"
                type="text" 
                class="form-control" 
                v-model="filters.search"
                placeholder="Search by asset ID, issue..."
                @input="filterMaintenances"
              >
            </div>
          </div>

          <!-- Sort By -->
          <div class="col-12 col-lg-3 mb-3">
            <SearchableDropdown
              id="maintenance-sort-by"
              label="Sort By"
              placeholder="Select sort option..."
              :items="sortOptions"
              v-model="selectedSortBy"
              @change="onSortByChange"
            />
          </div>

          <!-- Sort Order + Filters Toggle -->
          <div class="col-12 col-lg-2 mb-3">
            <div class="row g-3">
              <div class="col-4">
                <button type="button" class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" @click.prevent.stop="toggleSortOrder" :title="'Toggle Sort Order'" style="min-width: 40px; height: 38px;">
                  <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']" style="font-size: 0.9rem;"></i>
                </button>
              </div>
              <div class="col-8">
                <button 
                  class="btn btn-outline-secondary btn-modern w-100" 
                  @click="toggleFilterDropdown"
                  :class="{ active: showFilterDropdown }"
                >
                  <i class="fas fa-filter me-1"></i>Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Dropdown -->
        <div v-if="showFilterDropdown" class="filter-dropdown mt-3 p-3 bg-light rounded">
          <div class="row">
            <div class="col-12">
              <div class="d-flex flex-column flex-md-row gap-2">
                <div class="flex-fill">
                  <SearchableDropdown
                    id="maintenance-type-filter"
                    label="Maintenance Type"
                    placeholder="Search types..."
                    :items="maintenanceTypeOptions"
                    v-model="selectedType"
                    @change="onTypeChange"
                  />
                </div>
                <div class="flex-fill">
                  <SearchableDropdown
                    id="maintenance-status-filter"
                    label="Status"
                    placeholder="Search status..."
                    :items="statusOptions"
                    v-model="selectedStatus"
                    @change="onStatusChange"
                  />
                </div>
                
                <div class="flex-shrink-0" style="width: 12.5%;">
                  <div class="d-flex align-items-end h-100">
                    <button class="btn btn-outline-secondary btn-modern w-100" @click="clearFilters" title="Clear All Filters">
                      <i class="fas fa-times me-1"></i>Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary">
          <span class="visually-hidden">Loading...</span>
        </div>
        <output class="mt-2 text-muted">Loading maintenance records...</output>
      </div>

      <!-- Maintenance Table -->
      <div v-else class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Asset ID</th>
              <th>Type</th>
              <th>Status</th>
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
                <span :class="`badge badge-${maintenance.status.toLowerCase().replaceAll('_', '-')}`">
                  {{ formatStatus(maintenance.status) }}
                </span>
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
                    v-if="['CANCELLED', 'COMPLETED'].includes(maintenance.status)"
                    class="btn btn-action btn-reschedule" 
                    @click="navigateToSchedule(maintenance)"
                    title="Reschedule Maintenance"
                  >
                    <i class="fas fa-calendar-plus"></i>
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
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              Maintenance Details - {{ selectedMaintenance?.assetId }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedMaintenance">
            <!-- 2x2 grid layout to match EmployeesView modal -->
            <div class="row g-2">
              <div class="col-12 col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-tools me-2"></i>Asset & Maintenance Information</h6>
                  <div class="row g-2">
                    <div class="col-md-6">
                      <div class="info-label-compact">Asset ID</div>
                      <div class="info-value-compact fw-bold">{{ selectedMaintenance.assetId }}</div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-label-compact">Asset</div>
                      <div class="info-value-compact fw-bold">{{ selectedMaintenance.assetName }}</div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-label-compact">Maintenance Type</div>
                      <div class="info-value-compact">
                        <span :class="`badge badge-type-${selectedMaintenance.type.toLowerCase()}`">{{ selectedMaintenance.type }}</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-label-compact">Status</div>
                      <div class="info-value-compact">
                        <span :class="`badge badge-${selectedMaintenance.status.toLowerCase().replaceAll('_', '-')}`">{{ formatStatus(selectedMaintenance.status) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-calendar-alt me-2"></i>Timeline & Assignment</h6>
                  <div class="row g-2">
                    <div class="col-md-6">
                      <div class="info-label-compact">Scheduled Date</div>
                      <div class="info-value-compact">{{ formatDate(selectedMaintenance.scheduledDate) }}</div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-label-compact">Frequency</div>
                      <div class="info-value-compact">One-time</div>
                    </div>
                    <div class="col-md-12">
                      <div class="info-label-compact">Assigned To</div>
                      <div class="info-value-compact">{{ selectedMaintenance.assignedTo || 'Internal Team' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row g-2 mt-2">
              <div class="col-12 col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact">₹ Cost Information</h6>
                  <div class="row g-2">
                    <div class="col-md-6">
                      <div class="info-label-compact">{{ selectedMaintenance.costType === 'Actual' ? 'Actual Cost' : 'Estimated Cost' }}</div>
                      <div class="info-value-compact">{{ selectedMaintenance.cost }}</div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-label-compact">{{ selectedMaintenance.costType === 'Actual' ? 'Estimated Cost' : 'Actual Cost' }}</div>
                      <div class="info-value-compact" :class="selectedMaintenance.status === 'COMPLETED' ? '' : 'text-muted'">
                        {{ selectedMaintenance.status === 'COMPLETED' ? selectedMaintenance.cost : selectedMaintenance.status === 'CANCELLED' ? 'N/A - Cancelled' : 'Pending completion' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-clipboard-list me-2"></i>Maintenance Description</h6>
                  <div class="description-content">
                    <p><strong>Description:</strong> {{ selectedMaintenance.description }}</p>
                    <p><strong>{{ selectedMaintenance.status === 'CANCELLED' ? 'Cancellation Details:' : 'Progress Notes:' }}</strong></p>
                    <ul class="service-notes">
                      <li v-for="note in selectedMaintenance.progressNotes" :key="note" :style="selectedMaintenance.status === 'CANCELLED' ? 'color: var(--secondary-red)' : ''">
                        {{ note }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Maintenance History moved to dedicated page -->
          </div>
          <div class="modal-footer">
            <!-- Mobile: 2x2 grid like EmployeesView -->
            <div class="mobile-actions-grid d-md-none w-100">
              <button 
                v-if="selectedMaintenance?.status === 'IN_PROGRESS'"
                type="button" 
                class="btn btn-success" 
                @click="closeDetailAndOpenComplete"
              >
                <i class="fas fa-check me-1"></i>Complete
              </button>
              <button 
                v-if="selectedMaintenance?.status === 'SCHEDULED'"
                type="button" 
                class="btn btn-warning" 
                @click="navigateToEdit(selectedMaintenance)"
              >
                <i class="fas fa-edit me-1"></i>Edit
              </button>
              <button 
                v-if="selectedMaintenance?.status && ['CANCELLED', 'COMPLETED'].includes(selectedMaintenance.status)"
                type="button" 
                class="btn btn-warning" 
                @click="navigateToSchedule(selectedMaintenance as MaintenanceRow)"
              >
                <i class="fas fa-calendar-plus me-1"></i>Reschedule
              </button>
              <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-history" @click="openHistory">
                <i class="fas fa-history me-1"></i>History
              </button>
              <button 
                v-if="selectedMaintenance?.status && ['IN_PROGRESS', 'SCHEDULED'].includes(selectedMaintenance.status)"
                type="button" 
                class="btn btn-danger" 
                @click="closeDetailAndOpenCancel"
              >
                <i class="fas fa-times me-1"></i>Cancel
              </button>
            </div>

            <!-- Desktop: aligned like EmployeesView -->
            <div class="d-none d-md-flex w-100 justify-content-between align-items-center">
              <div>
                <button type="button" class="btn btn-history" @click="openHistory">
                  <i class="fas fa-history me-1"></i>History
                </button>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Close</button>
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
                  v-if="selectedMaintenance?.status && ['CANCELLED', 'COMPLETED'].includes(selectedMaintenance.status)"
                  type="button" 
                  class="btn btn-warning" 
                  @click="navigateToSchedule(selectedMaintenance as MaintenanceRow)"
                >
                  <i class="fas fa-calendar-plus me-1"></i>Reschedule Maintenance
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
                    <span class="input-group-text">₹</span>
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
              
              <!-- Cancellation Date removed: now set by backend to current timestamp -->
              
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

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, watch, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRouteToast } from '@/composables/useRouteToast'
import { Modal } from 'bootstrap'
import { maintenanceService } from '@/services/maintenanceService'
import { useToastStore } from '@/stores/toast'
import { formatDateOnly } from '@/utils/date'
import AppPagination from '@/components/pagination/AppPagination.vue'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'

const router = useRouter()
const route = useRoute()
useRouteToast()
const toastStore = useToastStore()

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
// vendor state removed

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

// UI state for Assets-style filters
const showFilterDropdown = ref(false)

// Dropdown selections
const selectedType = ref<Item | null>(null)
const selectedStatus = ref<Item | null>(null)
// vendor selection removed
const selectedSortBy = ref<Item | null>(null)

// Dropdown items
const maintenanceTypeOptions = computed<Item[]>(() => [
  { id: 'Preventive', name: 'Preventive', value: 'Preventive' },
  { id: 'Corrective', name: 'Corrective', value: 'Corrective' },
  { id: 'Emergency', name: 'Emergency', value: 'Emergency' },
  { id: 'Upgrade', name: 'Upgrade', value: 'Upgrade' }
])

const statusOptions = computed<Item[]>(() => [
  { id: 'SCHEDULED', name: 'Scheduled', value: 'SCHEDULED' },
  { id: 'IN_PROGRESS', name: 'In Progress', value: 'IN_PROGRESS' },
  { id: 'COMPLETED', name: 'Completed', value: 'COMPLETED' },
  { id: 'CANCELLED', name: 'Cancelled', value: 'CANCELLED' }
])

// vendor options removed

const sortOptions = ref<Item[]>([
  { id: 'assetId', name: 'Asset ID', value: 'assetId' },
  { id: 'status', name: 'Status', value: 'status' },
  { id: 'type', name: 'Maintenance Type', value: 'type' },
  { id: 'vendor', name: 'Vendor', value: 'vendor' },
  { id: 'scheduledDate', name: 'Date', value: 'scheduledDate' },
  { id: 'cost', name: 'Cost', value: 'cost' }
])

// API functions
  // fetchVendors removed

  const fetchMaintenances = async () => {
    try {
      isLoading.value = true
      
      // Map frontend sort fields to backend fields
      const sortFieldMap: Record<string, string> = {
        'cost': 'estimatedCost',
        'type': 'maintenanceType',
        
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
        
        sortBy: sortFieldMap[sortBy.value] || sortBy.value,
        sortOrder: (sortAscending.value ? 'asc' : 'desc') as 'asc' | 'desc'
      }

      const response = await maintenanceService.getMaintenances(params)
    
    if (response.data) {
      // Transform API data to match local interface
      maintenanceData.value = response.data.maintenances.map(maintenance => ({
        id: Number.parseInt(maintenance.id),
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
      
      // Stats are fetched separately and don't need to be updated on every data load
    } else {
      toastStore.showError('Error', 'Failed to fetch maintenance data')
    }
  } catch (error) {
    console.error('Error fetching maintenances:', error)
    toastStore.showError('Error', 'Error loading maintenance data')
    maintenanceData.value = []
    totalItems.value = 0
    totalPages.value = 1
  } finally {
    isLoading.value = false
    // Start stats refresh interval only after initial load
    if (!statsInterval) {
      statsInterval = globalThis.setInterval(fetchStats, 60_000)
    }
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
  cancelNotes: ''
})

// Form validation errors
const completeFormErrors = reactive({
  actualCost: ''
})

const cancelFormErrors = reactive({
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
  const actualCostValue = typeof actualCost === 'number' ? actualCost : Number.parseFloat(String(actualCost))
  
  // Check if it's a valid number
  if (Number.isNaN(actualCostValue)) {
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
  cancelFormErrors.cancelNotes = ''
  
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

// Loading states
const completeLoading = ref(false)
const cancelLoading = ref(false)

// Stats interval for periodic updates
let statsInterval: number | undefined

// Last updated tracking for stats
const lastStatsUpdated = ref('Loading...')
let lastStatsUpdatedAt: number | null = null
let statsTimestampInterval: number | undefined

// Initialize data on component mount
onMounted(async () => {
  await fetchMaintenances()
  // Fetch stats once after initial data load
  await fetchStats()
  // Initialize default sort option
  selectedSortBy.value = sortOptions.value.find(o => o.value === sortBy.value) || null
  
  // Start timestamp update interval (every minute)
  statsTimestampInterval = globalThis.setInterval(updateStatsTimestampDisplay, 60_000)
})

// Watch for route changes to refresh stats when coming from form submissions
watch(() => route.query.refreshStats, async (newValue) => {
  if (newValue === 'true') {
    await fetchStats()
    // Remove the query parameter to prevent repeated refreshes
    router.replace({ query: { ...route.query, refreshStats: undefined } })
  }
})

onUnmounted(() => {
  if (statsInterval) {
    clearInterval(statsInterval)
    statsInterval = undefined
  }
  if (statsTimestampInterval) {
    clearInterval(statsTimestampInterval)
    statsTimestampInterval = undefined
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

// Format relative time for stats timestamp
function formatRelativeStatsUpdated(nowMs: number) {
  if (!lastStatsUpdatedAt) return 'Just now'
  const diffMs = Math.max(0, nowMs - lastStatsUpdatedAt)
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin <= 0) return 'Just now'
  if (diffMin === 1) return '1 minute ago'
  return `${diffMin} minutes ago`
}

// Update stats timestamp display
function updateStatsTimestampDisplay() {
  lastStatsUpdated.value = formatRelativeStatsUpdated(Date.now())
}

const fetchStats = async () => {
  try {
    // Use dedicated stats endpoint for efficient data retrieval
    const response = await maintenanceService.getMaintenanceStats()
    
    if (response.data) {
      const { counts, percentages } = response.data
      
      // Update stats data directly from API response
      statsData.underMaintenance = counts.underMaintenance
      statsData.scheduled = counts.scheduled
      statsData.completed = counts.completed
      statsData.cancelled = counts.cancelled

      // Update percentages directly from API response
      statsData.underMaintenancePercent = percentages.underMaintenancePercent
      statsData.scheduledPercent = percentages.scheduledPercent
      statsData.completedPercent = percentages.completedPercent
      statsData.cancelledPercent = percentages.cancelledPercent

      // Update timestamp
      lastStatsUpdatedAt = Date.now()
      updateStatsTimestampDisplay()
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

    // Update timestamp even for fallback
    lastStatsUpdatedAt = Date.now()
    updateStatsTimestampDisplay()
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
  return status.replaceAll('_', ' ').replaceAll(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (dateString: string) => formatDateOnly(dateString)

const navigateToSchedule = (maintenance?: any) => {
  // If a maintenance record (e.g., cancelled) is provided, pass external assetId as query param
  if (maintenance?.assetId) {
    router.push({ path: '/app/maintenance/schedule', query: { assetId: maintenance.assetId } })
    return
  }
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

// Note: Removed watch(sortAscending) to prevent duplicate API calls
// The toggleSortOrder function already handles the API call

const clearFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.type = ''
  filters.vendor = ''
  currentPage.value = 1
  // Clear any pending search timeout
  if (searchTimeout) clearTimeout(searchTimeout)
  // Reset dropdown selections
  selectedType.value = null
  selectedStatus.value = null
  
  selectedSortBy.value = sortOptions.value.find(o => o.value === 'scheduledDate') || null
  sortBy.value = 'scheduledDate'
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

// Assets-style filter dropdown handlers
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
}

const onTypeChange = (item: Item | null) => {
  selectedType.value = item
  filters.type = item?.value as string || ''
  filterMaintenancesImmediate()
}

const onStatusChange = (item: Item | null) => {
  selectedStatus.value = item
  filters.status = (item?.value as string) || ''
  filterMaintenancesImmediate()
}

// vendor change removed

const onSortByChange = (item: Item | null) => {
  selectedSortBy.value = item
  if (item?.value) {
    sortBy.value = item.value as string
  }
  sortMaintenances()
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
        id: Number.parseInt(history.id),
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
        cost: (() => {
          if (history.actualCost) {
            return `₹${history.actualCost.toFixed(2)}`
          }
          if (history.estimatedCost) {
            return `₹${history.estimatedCost.toFixed(2)}`
          }
          return '₹0.00'
        })(),
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
  cancelForm.cancelNotes = ''
  cancelFormErrors.cancelNotes = ''
  const modal = new Modal(cancelModal.value!)
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


// Navigate to dedicated maintenance history page
const viewMaintenanceHistory = (maintenance: MaintenanceRow) => {
  const instance = Modal.getInstance(detailModal.value!)
  if (instance) instance.hide()
  router.push(`/app/maintenance/${maintenance.assetId}/history`)
}

const openHistory = () => {
  if (!selectedMaintenance.value) return
  viewMaintenanceHistory(selectedMaintenance.value)
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
        actualCost: Number.parseFloat(completeForm.actualCost),
        completionNotes: completeForm.completionNotes || undefined
      }
    )

    if (response.data && response.data.maintenance) {
      // Update local data
      const row = maintenanceData.value.find(m => m.id === selectedMaintenance.value!.id)
      if (row) {
        row.status = 'COMPLETED'
        row.cost = `₹${Number.parseFloat(completeForm.actualCost).toFixed(2)}`
        row.costType = 'Actual'
        row.actualCost = Number.parseFloat(completeForm.actualCost)
        row.completionNotes = completeForm.completionNotes || null
      }

      const actual = Number.parseFloat(completeForm.actualCost)
      const noteSuffix = completeForm.completionNotes ? ` Notes: ${completeForm.completionNotes}` : ''
      toastStore.showSuccess('Success', `Maintenance completed successfully! Actual Cost: ₹${actual.toFixed(2)}${noteSuffix}`)
      const modal = Modal.getInstance(completeModal.value!)
      if (modal) modal.hide()

      // Refresh stats after completing maintenance
      await fetchStats()

      // Reset form
      completeForm.actualCost = ''
      completeForm.completionNotes = ''
      completeFormErrors.actualCost = ''
    } else {
      toastStore.showError('Error', response.message || 'Error completing maintenance. Please try again.')
    }

  } catch (error) {
    console.error('Error completing maintenance:', error)
    toastStore.showError('Error', 'Error completing maintenance. Please try again.')
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
      { cancelNotes: cancelForm.cancelNotes }
    )

    if (response.data && response.data.maintenance) {
      // Update local data
      const row = maintenanceData.value.find(m => m.id === selectedMaintenance.value!.id)
      if (row) {
        row.status = 'CANCELLED'
        row.cancellationNotes = cancelForm.cancelNotes
      }

      toastStore.showSuccess('Success', `Maintenance cancelled successfully! Notes: ${cancelForm.cancelNotes}`)
      const modal = Modal.getInstance(cancelModal.value!)
      if (modal) modal.hide()

      // Refresh stats after cancelling maintenance
      await fetchStats()

      // Reset form
      cancelForm.cancelNotes = ''
      cancelFormErrors.cancelNotes = ''
    } else {
      toastStore.showError('Error', response.message || 'Error cancelling maintenance. Please try again.')
    }

  } catch (error) {
    console.error('Error cancelling maintenance:', error)
    toastStore.showError('Error', 'Error cancelling maintenance. Please try again.')
  } finally {
    cancelLoading.value = false
  }
}


// Toast notification function is now imported from utils

onMounted(() => {
  // Any initialization logic
})

// New method to toggle history expansion
const toggleHistory = () => {
  isHistoryExpanded.value = !isHistoryExpanded.value
}

// New reactive data for history expansion
const isHistoryExpanded = ref(true)
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
  pointer-events: none;
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
  border-color: var(--secondary-purple) !important;
  /* Preserve original text color */
}

.btn-action.btn-edit:hover {
  border-color: var(--secondary-orange) !important;
  /* Preserve original text color */
}

.btn-action.btn-complete:hover {
  border-color: var(--secondary-green) !important;
  /* Preserve original text color */
}

.btn-action.btn-cancel:hover {
  border-color: var(--secondary-red) !important;
  /* Preserve original text color */
}

.btn-action.btn-reschedule:hover,
.btn-action.btn-report:hover {
  border-color: var(--secondary-purple) !important;
  /* Preserve original text color */
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
  padding-right: 0.75rem !important; /* tighter like EmployeesView */
  padding-left: 0.5rem !important;
  text-align: right !important; /* push content to the right edge */
}

.table-responsive {
  margin: 0 !important;
  padding: 0 !important;
}

/* Column width distribution for 6 columns (vendor column removed) */
/* 1: Asset ID */
.table th:nth-child(1), .table td:nth-child(1) {
  width: 22% !important;
  min-width: 220px !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}
/* 2: Type */
.table th:nth-child(2), .table td:nth-child(2) { 
  width: 14% !important; 
  min-width: 140px !important;
}
/* 3: Status */
.table th:nth-child(3), .table td:nth-child(3) { 
  width: 14% !important; 
  min-width: 130px !important;
}
/* 4: Date */
.table th:nth-child(4), .table td:nth-child(4) { 
  width: 18% !important; 
  min-width: 170px !important;
}
/* 5: Cost */
.table th:nth-child(5), .table td:nth-child(5) { 
  width: 21% !important; 
  min-width: 180px !important;
}

/* 6: Actions column */
.table th:nth-child(6), .table td:nth-child(6) {
  width: 136px !important;
  min-width: 136px !important;
  max-width: 136px !important;
  text-align: left !important;
}

/* Actions button group spacing */
.maintenance-actions {
  justify-content: flex-end !important; /* align buttons to the right */
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

/* Maintenance Info sections */
.asset-info-section-compact {
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
}

.section-title-compact {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #dee2e6;
}

.info-label-compact {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0 !important;
  min-width: 140px;
  flex-shrink: 0;
}

.info-value-compact {
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #212529 !important;
  margin-bottom: 0 !important;
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
/* Duplicate timeline styles removed (see definitions above at lines 2026-2243) */

/* Maintenance History Section (Collapsible) */
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

/* Assignment Chevron */
.assignment-chevron {
  transition: transform 0.3s ease;
}

.assignment-chevron.rotated {
  transform: rotate(180deg);
}
</style> 