<template>
  <div class="maintenance-page">
    <div class="container-fluid px-3 py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0" style="color: var(--primary-black);">Maintenance & Repairs</h2>
          <p class="text-muted mb-0">Track asset maintenance, repairs, and service history</p>
        </div>
        <button class="btn btn-orange" @click="navigateToSchedule">
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
                <div class="stats-icon bg-primary rounded-circle p-3">
                  <i class="fas fa-calendar-alt fa-lg"></i>
                </div>
                <div class="text-end">
                  <div class="text-dark small mb-1 fw-semibold">Scheduled</div>
                  <div class="h3 mb-0 fw-bold text-dark">{{ stats.scheduled }}</div>
                </div>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-primary" :style="`width: ${stats.scheduledPercent}%`"></div>
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
            <StatusIndicator variant="success" :size="8" class="me-2" />
            <small class="text-muted">
              Updated {{ lastStatsUpdated }}
            </small>
          </div>
        </div>
      </div>

      <!-- Filters (match EmployeesView) -->
      <div class="mb-4">
        <div class="row align-items-end">
          <!-- Search Maintenance -->
          <div class="col-12 col-lg-7 mb-3">
            <label class="form-label" for="mv-search">Search Maintenance</label>
            <div class="search-input-container">
              <i class="fas fa-search search-icon"></i>
              <input 
                id="mv-search"
                type="text" 
                class="form-control search-input" 
                v-model="filters.search"
                placeholder="Search by asset ID, issue..."
                @input="filterMaintenances"
              >
            </div>
          </div>

          <!-- Sort By -->
          <div class="col-12 col-lg-3 mb-3">
            <SearchableDropdown
              id="sort-by-filter"
              label="Sort By"
              placeholder="Select sort option..."
              :items="sortOptions"
              v-model="selectedSortBy"
              @change="onSortByChange"
            />
          </div>

          <!-- Toggle Sort Order and Filter Button -->
          <div class="col-12 col-lg-2 mb-3">
            <div class="row g-3">
              <!-- Toggle Sort Order -->
              <div class="col-4">
                <button type="button" class="btn btn-gray w-100 d-flex align-items-center justify-content-center" @click.prevent.stop="toggleSortOrder" :title="'Toggle Sort Order'" style="min-width: 40px; height: 38px;">
                  <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']" style="font-size: 0.9rem;"></i>
                </button>
              </div>
              
              <!-- Filter Button -->
              <div class="col-8">
                <button 
                  class="btn btn-filter w-100" 
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
              <!-- Responsive filter layout -->
              <div class="d-flex flex-column flex-md-row gap-2">
                <!-- Maintenance Type Filter -->
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
                
                <!-- Status Filter -->
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
                
                <!-- Clear Button: responsive width -->
                <div class="filter-clear-button-container">
                  <div class="d-flex align-items-end h-100">
                    <button class="btn btn-gray filter-clear-btn" @click="clearFilters" title="Clear All Filters">
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
              <th>Asset Details</th>
              <th>Est./Actual Cost</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
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
                <strong>{{ maintenance.assetId }}</strong>
              </td>
              <td>
                <div class="asset-details-cell">
                  <div class="asset-model">{{ maintenance.assetModel || 'Unknown Model' }}</div>
                  <div class="asset-type-brand">{{ maintenance.assetType || 'Unknown Type' }} - {{ maintenance.assetBrand || 'Unknown Brand' }}</div>
                </div>
              </td>
              <td>
                <div class="cost-cell">
                  <div class="cost-amount">{{ maintenance.cost }}</div>
                  <div class="cost-type">{{ maintenance.costType }}</div>
                </div>
              </td>
              <td>
                <div class="date-cell">
            <div class="date-value">{{ formatDate(maintenance.relevantDate || '') }}</div>
            <div class="date-label">{{ getDateTypeLabel(maintenance.dateType || '') }}</div>
                </div>
              </td>
              <td>
                {{ formatMaintenanceType(maintenance.type) }}
              </td>
              <td>
                <span :class="['badge', getStatusBadgeClass(maintenance.status)]">
                  {{ formatStatus(maintenance.status) }}
                </span>
              </td>
              <td>
                <div class="btn-group btn-group-sm asset-actions">
                  <button 
                    class="btn btn-action btn-brown" 
                    @click="showMaintenanceDetails(maintenance)"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="maintenance.status === 'IN_PROGRESS'"
                    class="btn btn-action btn-green" 
                    @click="openCompleteModal(maintenance)"
                    title="Complete Maintenance"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button 
                    v-if="maintenance.status === 'SCHEDULED'"
                    class="btn btn-action btn-purple" 
                    @click="navigateToEdit(maintenance)"
                    title="Edit Maintenance"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    v-if="['CANCELLED', 'COMPLETED'].includes(maintenance.status)"
                    class="btn btn-action btn-purple" 
                    @click="navigateToSchedule(maintenance)"
                    title="Reschedule Maintenance"
                  >
                    <i class="fas fa-calendar-plus"></i>
                  </button>
                  
                  <button 
                    v-if="['IN_PROGRESS', 'SCHEDULED'].includes(maintenance.status)"
                    class="btn btn-action btn-red" 
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
      <AppPagination 
        :current-page="currentPage" 
        :total-pages="totalPages"
        :start="paginationInfo.start"
        :end="paginationInfo.end"
        :total="paginationInfo.total"
        item-name="maintenance records"
        @change="changePage" 
      />
    </div>

    <!-- Maintenance Detail Modal -->
    <div 
      v-if="selectedMaintenance" 
      class="modal fade" 
      :class="{ show: showDetailModal }" 
      :style="{ display: showDetailModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              Maintenance Details - {{ selectedMaintenance?.assetId }}
            </h5>
            <button type="button" class="btn-close" @click="closeModals"></button>
          </div>
          <div class="modal-body" v-if="selectedMaintenance">
            <!-- Asset Information - Compact Layout (matching AssetsView.vue) -->
            <div class="row g-2 equal-height-columns">
              <!-- Left Column: Basic Info -->
              <div class="col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-tools me-2"></i>Asset & Maintenance Information</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <div class="info-label-compact">Asset ID</div>
                      <div class="info-value-compact fw-bold">{{ selectedMaintenance.assetId }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Asset Name</div>
                      <div class="info-value-compact fw-bold">{{ selectedMaintenance.assetName }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Maintenance Type</div>
                      <div class="info-value-compact">{{ selectedMaintenance.type }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Status</div>
                      <div class="info-value-compact">
                        <span :class="['badge', getStatusBadgeClass(selectedMaintenance.status)]">{{ formatStatus(selectedMaintenance.status) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Timeline & Assignment -->
              <div class="col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-calendar-alt me-2"></i>Timeline & Assignment</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <div class="info-label-compact">Scheduled Date</div>
                      <div class="info-value-compact">{{ formatDate(selectedMaintenance.relevantDate || '') }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Frequency</div>
                      <div class="info-value-compact">One-time</div>
                    </div>
                    <div class="info-item-compact" v-if="selectedMaintenance.vendor !== 'Internal Team'">
                      <div class="info-label-compact">Assigned To</div>
                      <div class="info-value-compact">
                        {{ selectedMaintenance.assignedTo || 'Not Assigned' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cost & Description Row -->
            <div class="row g-2 mt-2">
              <div class="col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-rupee-sign me-2"></i>Cost Information</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <div class="info-label-compact">{{ selectedMaintenance.costType === 'Actual' ? 'Actual Cost' : 'Estimated Cost' }}</div>
                      <div class="info-value-compact">{{ selectedMaintenance.cost }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">{{ selectedMaintenance.costType === 'Actual' ? 'Estimated Cost' : 'Actual Cost' }}</div>
                      <div class="info-value-compact" :class="selectedMaintenance.status === 'COMPLETED' ? '' : 'text-muted'">
                        {{ selectedMaintenance.status === 'COMPLETED' ? selectedMaintenance.cost : selectedMaintenance.status === 'CANCELLED' ? 'N/A - Cancelled' : 'Pending completion' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
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
                class="btn btn-green btn-sm" 
                @click="closeDetailAndOpenComplete"
              >
                <i class="fas fa-check me-1"></i>Complete
              </button>
              <button 
                v-if="selectedMaintenance?.status === 'SCHEDULED'"
                type="button" 
                class="btn btn-orange btn-sm" 
                @click="navigateToEdit(selectedMaintenance)"
              >
                <i class="fas fa-edit me-1"></i>Edit
              </button>
              <button 
                v-if="selectedMaintenance?.status && ['CANCELLED', 'COMPLETED'].includes(selectedMaintenance.status)"
                type="button" 
                class="btn btn-orange btn-sm" 
                @click="navigateToSchedule(selectedMaintenance as MaintenanceRow)"
              >
                <i class="fas fa-calendar-plus me-1"></i>Reschedule
              </button>
              <button type="button" class="btn btn-cancel btn-sm" @click="closeModals">Close</button>
              <button type="button" class="btn btn-brown btn-sm" @click="openHistory">
                <i class="fas fa-history me-1"></i>History
              </button>
              <button 
                v-if="selectedMaintenance?.status && ['IN_PROGRESS', 'SCHEDULED'].includes(selectedMaintenance.status)"
                type="button" 
                class="btn btn-red btn-sm" 
                @click="closeDetailAndOpenCancel"
              >
                <i class="fas fa-times me-1"></i>Cancel
              </button>
            </div>

            <!-- Desktop: aligned like EmployeesView -->
            <div class="d-none d-md-flex w-100 justify-content-between align-items-center">
              <div>
                <button type="button" class="btn btn-brown btn-sm" @click="openHistory">
                  <i class="fas fa-history me-1"></i>History
                </button>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-cancel btn-sm" @click="closeModals">Close</button>
                <button 
                  v-if="selectedMaintenance?.status === 'IN_PROGRESS'"
                  type="button" 
                  class="btn btn-green btn-sm" 
                  @click="closeDetailAndOpenComplete"
                >
                  <i class="fas fa-check me-1"></i>Complete Maintenance
                </button>
                <button 
                  v-if="selectedMaintenance?.status === 'SCHEDULED'"
                  type="button" 
                  class="btn btn-orange btn-sm" 
                  @click="navigateToEdit(selectedMaintenance)"
                >
                  <i class="fas fa-edit me-1"></i>Edit Maintenance
                </button>
                <button 
                  v-if="selectedMaintenance?.status && ['CANCELLED', 'COMPLETED'].includes(selectedMaintenance.status)"
                  type="button" 
                  class="btn btn-orange btn-sm" 
                  @click="navigateToSchedule(selectedMaintenance as MaintenanceRow)"
                >
                  <i class="fas fa-calendar-plus me-1"></i>Reschedule Maintenance
                </button>
                <button 
                  v-if="selectedMaintenance?.status && ['IN_PROGRESS', 'SCHEDULED'].includes(selectedMaintenance.status)"
                  type="button" 
                  class="btn btn-red btn-sm" 
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
    <div 
      v-if="selectedMaintenance" 
      class="modal fade" 
      :class="{ show: showCompleteModal }" 
      :style="{ display: showCompleteModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              Complete Maintenance - {{ selectedMaintenance?.assetId }}
            </h5>
            <button type="button" class="btn-close" @click="closeModals"></button>
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
            <button type="button" class="btn btn-cancel btn-sm" @click="closeModals">Cancel</button>
            <button type="button" class="btn btn-green btn-sm" @click="completeMaintenance" :disabled="completeLoading">
              <i :class="completeLoading ? 'fas fa-spinner fa-spin me-1' : 'fas fa-check me-1'"></i>
              {{ completeLoading ? 'Completing...' : 'Complete Maintenance' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Maintenance Modal -->
    <div 
      v-if="selectedMaintenance" 
      class="modal fade" 
      :class="{ show: showCancelModal }" 
      :style="{ display: showCancelModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title d-flex align-items-center" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              <i class="fas fa-times-circle me-2 text-danger"></i>Cancel Maintenance - {{ selectedMaintenance?.assetId }}
            </h5>
            <button type="button" class="btn-close" @click="closeModals"></button>
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
            <button type="button" class="btn btn-cancel btn-sm" data-bs-dismiss="modal">
              Keep Maintenance
            </button>
            <button type="button" class="btn btn-red btn-sm" @click="cancelMaintenance" :disabled="cancelLoading">
              <i :class="cancelLoading ? 'fas fa-spinner fa-spin me-1' : 'fas fa-times me-1'"></i>
              {{ cancelLoading ? 'Cancelling...' : 'Confirm Cancellation' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div v-if="showDetailModal || showCompleteModal || showCancelModal" class="modal-backdrop fade show" @click="closeModals"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, watch, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRouteToast } from '@/composables/useRouteToast'
import { maintenanceService } from '@/services/business/maintenanceService'
import { useToastStore } from '@/stores/toast'
import { formatDateOnly } from '@/utils/date'
import AppPagination from '@/components/ui/pagination/AppPagination.vue'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'
import { StatusIndicator } from '@/components/common'

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
  relevantDate: string | null
  dateType: 'scheduled' | 'completion' | 'cancellation' | null
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

const sortBy = ref('relevantDate')
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
  { id: 'relevantDate', name: 'Date', value: 'relevantDate' },
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
        
        'assetId': 'relevantDate' // Asset ID sorting not supported yet, fallback to date
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
        assetType: maintenance.assetType || '',
        assetBrand: maintenance.assetBrand || '',
        assetModel: maintenance.assetModel || '',
        maintenanceTypeId: maintenance.maintenanceTypeId,
        maintenanceTypeName: maintenance.maintenanceTypeName,
        type: maintenance.maintenanceTypeName, // For backward compatibility
        status: maintenance.status,
        vendor: maintenance.vendorName || 'Internal Team',
        vendorName: maintenance.vendorName || null,
        assignedTo: maintenance.assignedTo || 'Not Assigned',
        relevantDate: maintenance.relevantDate || null,
        dateType: maintenance.dateType || null,
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

// Modal state
const showDetailModal = ref(false)
const showCompleteModal = ref(false)
const showCancelModal = ref(false)

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

// Format maintenance type to title case
const formatMaintenanceType = (type: string) => {
  if (!type) return 'Unknown'
  return type.replaceAll(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

// Get user-friendly label for date type
const getDateTypeLabel = (dateType: string) => {
  if (!dateType) return ''
  const labels = {
    'scheduled': 'Scheduled Date',
    'completion': 'Completion Date',
    'cancellation': 'Cancellation Date'
  }
  return labels[dateType as keyof typeof labels] || ''
}

// Map maintenance status to shared badge color classes from badges.css
const getStatusBadgeClass = (status: string) => {
  const normalized = (status || '').toUpperCase()
  switch (normalized) {
    case 'SCHEDULED':
      return 'badge-purple'
    case 'IN_PROGRESS':
      return 'badge-orange'
    case 'COMPLETED':
      return 'badge-green'
    case 'CANCELLED':
      return 'badge-red'
    default:
      return 'badge-gray'
  }
}

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
  
  selectedSortBy.value = sortOptions.value.find(o => o.value === 'relevantDate') || null
  sortBy.value = 'relevantDate'
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
        relevantDate: history.relevantDate || null,
        dateType: history.dateType || null,
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
  
  showDetailModal.value = true
}

const openCompleteModal = (maintenance: MaintenanceRow) => {
  selectedMaintenance.value = maintenance
  completeForm.actualCost = ''
  completeForm.completionNotes = ''
  completeFormErrors.actualCost = ''
  showCompleteModal.value = true
}

const openCancelModal = (maintenance: MaintenanceRow) => {
  selectedMaintenance.value = maintenance
  cancelForm.cancelNotes = ''
  cancelFormErrors.cancelNotes = ''
  showCancelModal.value = true
}

const closeModals = () => {
  showDetailModal.value = false
  showCompleteModal.value = false
  showCancelModal.value = false
  selectedMaintenance.value = null
}


const closeDetailAndOpenComplete = () => {
  showDetailModal.value = false
  showCompleteModal.value = true
}

const closeDetailAndOpenCancel = () => {
  showDetailModal.value = false
  showCancelModal.value = true
}


// Navigate to dedicated maintenance history page
const viewMaintenanceHistory = (maintenance: MaintenanceRow) => {
  showDetailModal.value = false
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
      closeModals()

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
      closeModals()

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
@import '@/assets/styles/pages/maintenance.css';
</style> 