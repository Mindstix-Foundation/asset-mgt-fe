<template>
  <div class="container-fluid px-3 py-4">
    <!-- Page Header -->
    <div class="row align-items-center mb-4">
      <!-- Title Section -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-3 mb-3 mb-lg-0">
        <h2 class="mb-0" style="color: var(--primary-black);">Asset Management</h2>
        <p class="text-muted mb-0">Manage and track all company assets</p>
      </div>
      
      <!-- Actions Section -->
      <div class="col-12 col-md-6 col-lg-9">
        <!-- Small screens: Custom layout -->
        <div class="d-md-none">
          <div class="row g-2 mb-2">
            <!-- Row 1: View Toggle + More Actions -->
            <div class="col-6">
              <div class="d-flex gap-1 w-100 justify-content-center">
                <!-- View Toggle -->
                <div class="btn-group flex-shrink-0" role="group" aria-label="View toggle">
                  <button 
                    :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: currentView === 'list' }]"
                    @click="setView('list')"
                    style="min-width: 35px; padding: 0.375rem 0.5rem;"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button 
                    :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: currentView === 'grid' }]"
                    @click="setView('grid')"
                    style="min-width: 35px; padding: 0.375rem 0.5rem;"
                  >
                    <i class="fas fa-th-large"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-6">
              <!-- Data Management Dropdown -->
              <div class="dropdown">
                <button 
                  class="btn btn-outline-secondary btn-modern dropdown-toggle w-100" 
                  type="button" 
                  aria-expanded="false"
                  id="moreActionsDropdownSm"
                  @click="handleDropdownClick"
                >
                  <i class="fas fa-cog me-1"></i>More Actions
                </button>
                <ul class="dropdown-menu dropdown-menu-responsive" aria-labelledby="moreActionsDropdownSm" style="min-width: 200px;">
                  <li>
                    <button class="dropdown-item" @click="() => { openBulkUploadModal(); closeDropdown('moreActionsDropdownSm'); }">
                      <i class="fas fa-file-excel me-2 text-primary"></i>Bulk Upload Assets
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item" @click="() => { exportAssets(); closeDropdown('moreActionsDropdownSm'); }">
                      <i class="fas fa-download me-2 text-success"></i>Export Assets
                    </button>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button class="dropdown-item" @click="() => { navigateToManageCategories(); closeDropdown('moreActionsDropdownSm'); }">
                      <i class="fas fa-cogs me-2 text-info"></i>Manage Asset Categories
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="row g-2 mb-2">
            <!-- Row 2: Add New Asset + Issue Asset -->
            <div class="col-6">
              <button class="btn btn-primary btn-modern w-100" @click="navigateToAddAsset">
                <i class="fas fa-plus me-1"></i>Add New Asset
              </button>
            </div>
            <div class="col-6">
              <button class="btn btn-success btn-modern w-100" @click="navigateToIssueAsset">
                <i class="fas fa-user-plus me-1"></i>Issue Asset
              </button>
            </div>
          </div>
          
          <div class="row g-2">
            <!-- Row 3: Collect Asset + Maintenance -->
            <div class="col-6">
              <button class="btn btn-outline-warning btn-modern w-100" @click="navigateToCollectAsset">
                <i class="fas fa-user-minus me-1"></i>Collect Asset
              </button>
            </div>
            <div class="col-6">
              <button class="btn btn-warning btn-modern w-100" @click="navigateToScheduleMaintenance">
                <i class="fas fa-wrench me-1"></i>Maintenance
              </button>
            </div>
          </div>
        </div>
        
        <!-- Medium+ screens: Original layout -->
        <div class="d-none d-md-block">
          <div class="row g-2 justify-content-md-end">
            <!-- View Toggle + More Actions -->
            <div class="col-md-12 col-lg-auto">
              <div class="d-flex gap-2 w-100">
                <!-- View Toggle -->
                <div class="btn-group flex-shrink-0" role="group" aria-label="View toggle">
                  <button 
                    :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: currentView === 'list' }]"
                    @click="setView('list')"
                    style="min-width: 40px;"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button 
                    :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: currentView === 'grid' }]"
                    @click="setView('grid')"
                    style="min-width: 40px;"
                  >
                    <i class="fas fa-th-large"></i>
                  </button>
                </div>
                
                <!-- Data Management Dropdown -->
                <div class="dropdown flex-fill">
                  <button 
                    class="btn btn-outline-secondary btn-modern dropdown-toggle w-100" 
                    type="button" 
                    aria-expanded="false"
                    id="moreActionsDropdown"
                    @click="handleDropdownClick"
                  >
                    <i class="fas fa-cog me-1"></i>More Actions
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="moreActionsDropdown" style="min-width: 200px; max-width: 90vw;">
                    <li>
                      <button class="dropdown-item" @click="() => { openBulkUploadModal(); closeDropdown('moreActionsDropdown'); }">
                        <i class="fas fa-file-excel me-2 text-primary"></i>Bulk Upload Assets
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item" @click="() => { exportAssets(); closeDropdown('moreActionsDropdown'); }">
                        <i class="fas fa-download me-2 text-success"></i>Export Assets
                      </button>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                      <button class="dropdown-item" @click="() => { navigateToManageCategories(); closeDropdown('moreActionsDropdown'); }">
                        <i class="fas fa-cogs me-2 text-info"></i>Manage Asset Categories
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- Add New Asset + Issue Asset -->
            <div class="col-md-12 col-lg-auto">
              <div class="d-flex gap-2 w-100">
                <button class="btn btn-primary btn-modern flex-fill" @click="navigateToAddAsset">
                  <i class="fas fa-plus me-1"></i>Add New Asset
                </button>
                
                <button class="btn btn-success btn-modern flex-fill" @click="navigateToIssueAsset">
                  <i class="fas fa-user-plus me-1"></i>Issue Asset
                </button>
              </div>
            </div>
            
            <!-- Collect Asset + Schedule Maintenance -->
            <div class="col-md-12 col-lg-auto">
              <div class="d-flex gap-2 w-100">
                <button class="btn btn-outline-warning btn-modern flex-fill" @click="navigateToCollectAsset">
                  <i class="fas fa-user-minus me-1"></i>Collect Asset
                </button>
                <button class="btn btn-warning btn-modern flex-fill" @click="navigateToScheduleMaintenance">
                  <i class="fas fa-wrench me-1"></i>Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Sort Bar -->
    <div class="mb-4">
      <div class="row align-items-end">
        <!-- Search Assets -->
        <div class="col-12 col-lg-7 mb-3">
          <label class="form-label">Search Assets</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input 
              type="text" 
              class="form-control" 
              v-model="searchTerm"
              placeholder="Search by ID, model, brand, or serial number..."
              @input="debouncedLoadAssets"
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
              <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" @click="toggleSortOrder" :title="'Toggle Sort Order'" style="min-width: 40px; height: 38px;">
                <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']" style="font-size: 0.9rem;"></i>
              </button>
            </div>
            
            <!-- Filter Button -->
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
              <!-- Bootstrap Flexbox for exact proportions -->
              <div class="d-flex flex-column flex-md-row gap-2">
                <!-- 4 Filter Dropdowns: equal width (2.625 columns each) -->
                <div class="flex-fill">
                  <SearchableDropdown
                    id="asset-type-filter"
                    label="Asset Type"
                    placeholder="Search asset types..."
                    :items="assetTypes"
                    v-model="selectedType"
                    @change="onAssetTypeChange"
                  />
                </div>
                <div class="flex-fill">
                  <SearchableDropdown
                    id="brand-filter"
                    label="Brand"
                    placeholder="Search brands..."
                    :items="brands"
                    v-model="selectedBrand"
                    @change="onBrandChange"
                  />
                </div>
                <div class="flex-fill">
                  <SearchableDropdown
                    id="status-filter"
                    label="Status"
                    placeholder="Search status..."
                    :items="statusOptions"
                    v-model="selectedStatus"
                    @change="onStatusChange"
                  />
                </div>
                <div class="flex-fill">
                  <SearchableDropdown
                    id="condition-filter"
                    label="Condition"
                    placeholder="Search condition..."
                    :items="conditionOptions"
                    v-model="selectedCondition"
                    @change="onConditionChange"
                  />
                </div>
                
                <!-- Clear Button: fixed width (1.5 columns = 12.5%) -->
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

    <!-- Assets/Inventory Content -->
    <div id="contentContainer">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading assets...</p>
      </div>

      <!-- List View -->
      <div class="card" v-show="currentView === 'list' && !isLoading">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Asset ID</th>
                  <th>Type</th>
                  <th>Brand/Model</th>
                  <th>Serial Number</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Condition</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="asset in filteredAssets" 
                  :key="asset.id"
                  :data-type="asset.type"
                  :data-brand="asset.brand"
                  :data-status="asset.status"
                  :data-location="asset.location"
                >
                  <td><strong>{{ asset.id }}</strong></td>
                  <td>
                    <i :class="getAssetTypeIcon(asset.type)" class="me-2"></i>{{ asset.type }}
                  </td>
                  <td>{{ asset.brandModel }}</td>
                  <td>{{ asset.serialNumber }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(asset.status)">{{ getStatusText(asset.status) }}</span>
                  </td>
                  <td>{{ asset.assignedTo || '-' }}</td>
                  <td>{{ getConditionText(asset.condition) }}</td>
                  <td>
                    <div class="btn-group btn-group-sm asset-actions">
                      <button 
                        class="btn btn-outline-primary btn-view-details" 
                        @click="viewAssetDetails(asset)"
                        :title="getViewButtonTitle(asset.status)"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        v-if="asset.status !== 'RETIRED'"
                        class="btn btn-outline-secondary btn-edit-asset" 
                        title="Edit Asset"
                        @click="editAsset(asset)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        v-if="asset.status === 'AVAILABLE'"
                        class="btn btn-outline-success btn-issue-asset" 
                        title="Issue Asset"
                        @click="issueAsset(asset)"
                      >
                        <i class="fas fa-user-plus"></i>
                      </button>
                      <button 
                        v-if="asset.status === 'ASSIGNED'"
                        class="btn btn-outline-warning btn-collect-asset" 
                        title="Collect Asset"
                        @click="collectAsset(asset)"
                      >
                        <i class="fas fa-user-minus"></i>
                      </button>
                      <button 
                        v-if="asset.status !== 'LOST'"
                        class="btn btn-outline-warning btn-maintenance-action" 
                        :title="getMaintenanceButtonTitle(asset.status)"
                        @click="handleMaintenanceAction(asset)"
                      >
                        <i :class="getMaintenanceButtonIcon(asset.status)"></i>
                      </button>
                      <button class="btn btn-outline-info btn-qr-code" title="View QR Code">
                        <i class="fas fa-qrcode"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <!-- No results row -->
                <tr v-if="filteredAssets.length === 0">
                  <td colspan="8" class="text-center py-4">
                    <i class="fas fa-search fa-2x text-muted mb-2 d-block"></i>
                    <h6 class="text-muted">No items found</h6>
                    <p class="text-muted mb-0">Try adjusting your search criteria</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-show="currentView === 'grid' && !isLoading">
        <div class="row" v-if="filteredAssets.length > 0">
          <div 
            v-for="asset in filteredAssets" 
            :key="asset.id"
            class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4"
          >
            <div class="card h-100 asset-card-modern">
              <div class="card-body p-2">
                <!-- Header with icon, asset ID and status -->
                <div class="d-flex align-items-center mb-2">
                  <div 
                    class="rounded-circle d-flex align-items-center justify-content-center me-2" 
                    :style="{ width: '36px', height: '36px', backgroundColor: getAssetTypeColor(asset.type), flexShrink: 0 }"
                  >
                    <i :class="getAssetTypeIcon(asset.type)" class="text-white" style="font-size: 0.9rem;"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold text-truncate" style="color: var(--primary-black); font-size: 0.9rem;">{{ asset.id }}</h6>
                    <small class="text-muted text-truncate d-block">{{ asset.type }}</small>
                  </div>
                  <span :class="[getStatusBadgeClass(asset.status), 'badge-sm']" style="font-size: 0.7rem;">
                    {{ getStatusText(asset.status) }}
                  </span>
                </div>
                
                <!-- Asset Details Grid - 2 columns for better space usage -->
                <div class="mb-2">
                  <div class="row g-1">
                    <div class="col-6">
                      <small class="text-muted d-block" style="font-size: 0.7rem;">Brand/Model</small>
                      <div class="fw-medium text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ asset.brandModel }}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted d-block" style="font-size: 0.7rem;">Serial</small>
                      <div class="text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ asset.serialNumber }}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted d-block" style="font-size: 0.7rem;">Assigned To</small>
                      <div class="text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ asset.assignedTo || 'Not Assigned' }}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted d-block" style="font-size: 0.7rem;">Condition</small>
                      <div class="text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ getConditionText(asset.condition) }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="asset-actions-footer mt-auto pt-2 border-top">
                  <div class="d-flex justify-content-center gap-1">
                    <button 
                      class="btn btn-action btn-view-details btn-sm" 
                      @click="viewAssetDetails(asset)"
                      :title="getViewButtonTitle(asset.status)"
                      style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      v-if="asset.status !== 'RETIRED'"
                      class="btn btn-action btn-edit-asset btn-sm" 
                      title="Edit Asset"
                      @click="editAsset(asset)"
                      style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-if="asset.status === 'AVAILABLE'"
                      class="btn btn-action btn-issue-asset btn-sm" 
                      title="Issue Asset"
                      @click="issueAsset(asset)"
                      style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                    >
                      <i class="fas fa-user-plus"></i>
                    </button>
                    <button 
                      v-if="asset.status === 'ASSIGNED'"
                      class="btn btn-action btn-collect-asset btn-sm" 
                      title="Collect Asset"
                      @click="collectAsset(asset)"
                      style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                    >
                      <i class="fas fa-user-minus"></i>
                    </button>
                    <button 
                      v-if="asset.status !== 'LOST'"
                      class="btn btn-action btn-maintenance-action btn-sm" 
                      :title="getMaintenanceButtonTitle(asset.status)"
                      @click="handleMaintenanceAction(asset)"
                      style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                    >
                      <i :class="getMaintenanceButtonIcon(asset.status)"></i>
                    </button>
                    <button class="btn btn-action btn-qr-code btn-sm" title="View QR Code" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                      <i class="fas fa-qrcode"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No results for grid view -->
        <div v-if="filteredAssets.length === 0" class="col-12 text-center py-5">
          <i class="fas fa-laptop fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No items found</h5>
          <p class="text-muted">Try adjusting your search criteria</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-4">
      <div class="text-muted">
        <small>Showing {{ paginationInfo.start }}-{{ paginationInfo.end }} of {{ paginationInfo.total }} assets</small>
      </div>
      <AppPagination 
        :current-page="currentPage" 
        :total-pages="totalPages" 
        @change="goToPage"
      />
    </div>

    <!-- Asset Detail Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showDetailModal }" 
      :style="{ display: showDetailModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="selectedAsset"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Asset Details - {{ selectedAsset.id }}</h5>
            <button type="button" class="btn-close" @click="closeDetailModal"></button>
          </div>
          <div class="modal-body">
            <!-- Asset Information - Compact Layout -->
            <div class="row g-2 equal-height-columns">
              <!-- Left Column: Basic Info -->
              <div class="col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-info-circle me-2"></i>Basic Information</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <label class="info-label-compact">Asset ID</label>
                      <div class="info-value-compact fw-bold">{{ selectedAsset.id }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Category</label>
                      <div class="info-value-compact">{{ selectedAsset.category }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Asset Type</label>
                      <div class="info-value-compact fw-bold">{{ selectedAsset.type }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Brand & Model</label>
                      <div class="info-value-compact fw-bold">{{ selectedAsset.brandModel }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Serial Number</label>
                      <div class="info-value-compact font-monospace">{{ selectedAsset.serialNumber }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Condition</label>
                      <div class="info-value-compact">
                        <span :class="getConditionBadgeClass(selectedAsset.condition)">{{ selectedAsset.condition }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Location & Financial -->
              <div class="col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-map-marker-alt me-2"></i>Location & Financial</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <label class="info-label-compact">Current Location</label>
                      <div class="info-value-compact fw-bold">{{ selectedAsset.location }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Purchase Date</label>
                      <div class="info-value-compact">{{ selectedAsset.purchaseDate ? formatDate(selectedAsset.purchaseDate) : 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Purchase Cost</label>
                      <div class="info-value-compact">{{ selectedAsset.purchaseCost ? `₹${selectedAsset.purchaseCost.toLocaleString()}` : 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Vendor</label>
                      <div class="info-value-compact">{{ selectedAsset.vendor }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Warranty Period</label>
                      <div class="info-value-compact">
                        <div v-if="selectedAsset.warrantyStartDate || selectedAsset.warrantyUntil" class="warranty-info-compact">
                          <div v-if="selectedAsset.warrantyStartDate" class="warranty-row">
                            <span class="warranty-label">Start:</span>
                            <span class="warranty-value">{{ formatDate(selectedAsset.warrantyStartDate) }}</span>
                          </div>
                          <div v-if="selectedAsset.warrantyUntil" class="warranty-row">
                            <span class="warranty-label">End:</span>
                            <span class="warranty-value">{{ formatDate(selectedAsset.warrantyUntil) }}</span>
                          </div>
                          <div v-if="selectedAsset.warrantyUntil" class="warranty-time">
                            <span class="warranty-time-text">{{ getWarrantyTimeLeft(selectedAsset.warrantyUntil) }}</span>
                          </div>
                        </div>
                        <div v-else class="text-muted">Not specified</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assignment Status & Information - Combined -->
            <div v-if="selectedAsset.status !== 'RETIRED'" class="row ">
              <div class="col-12">
                <div class="assignment-status-combined">
                  <h6 class="section-title-compact d-flex align-items-center justify-content-between" 
                      @click="toggleAssignmentDetails" 
                      style="cursor: pointer;">
                    <span><i class="fas fa-user me-2"></i>Assignment Status & Information</span>
                    <i class="fas fa-chevron-down assignment-chevron" 
                       :class="{ 'rotated': isAssignmentDetailsExpanded }"
                       v-if="selectedAsset.status === 'ASSIGNED'"></i>
                  </h6>
                  
                  <!-- Basic Assignment Info -->
                  <div class="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                    <div class="d-flex align-items-center gap-3">
                      <div class="assignment-icon">
                        <i :class="getAssignmentIcon(selectedAsset.status)" class="fa-lg"></i>
                      </div>
                      <div class="assignment-details">
                        <div class="d-flex align-items-center gap-3 mb-1">
                          <div>
                            <span class="text-muted" style="font-size: 0.8rem;">Status:</span>
                            <span :class="getStatusBadgeClass(selectedAsset.status)" class="ms-1">{{ getAssignmentStatusText(selectedAsset.status) }}</span>
                          </div>
                          <div>
                            <span class="text-muted" style="font-size: 0.8rem;">Assigned To:</span>
                            <span class="ms-1 fw-medium" style="font-size: 0.9rem;">{{ selectedAsset.assignedTo || 'Not Assigned' }}</span>
                          </div>
                        </div>
                        <div class="text-muted" style="font-size: 0.8rem;">{{ getAssignmentStatusDescription(selectedAsset.status) }}</div>
                      </div>
                    </div>
                    <div class="qr-code-mini">
                      <i class="fas fa-qrcode fa-lg text-muted" title="QR Code Available"></i>
                    </div>
                  </div>
                  
                  <!-- Assignment Details (only show if asset is assigned) -->
                  <div v-if="selectedAsset.status === 'ASSIGNED' && (selectedAsset.assignmentReason || selectedAsset.assignmentNotes || selectedAsset.assignmentDate)" 
                       v-show="isAssignmentDetailsExpanded" 
                       class="assignment-details-expanded">
                    <div class="row g-2">
                      <!-- Assignment Reason -->
                      <div class="col-md-6" v-if="selectedAsset.assignmentReason">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Assignment Reason</label>
                          <div class="info-value-compact">{{ selectedAsset.assignmentReason }}</div>
                        </div>
                      </div>
                      
                      <!-- Assignment Date -->
                      <div class="col-md-6" v-if="selectedAsset.assignmentDate">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Assignment Date</label>
                          <div class="info-value-compact">{{ formatDate(selectedAsset.assignmentDate) }}</div>
                        </div>
                      </div>
                      
                      <!-- Assigned By (only show if not system) -->
                      <div class="col-md-6" v-if="selectedAsset.assignedBy && selectedAsset.assignedBy !== 'system'">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Assigned By</label>
                          <div class="info-value-compact">{{ selectedAsset.assignedBy }}</div>
                        </div>
                      </div>
                      
                      <!-- Divider between assignment details and notes -->
                      <div class="col-12" v-if="selectedAsset.assignmentNotes">
                        <hr class="assignment-divider">
                      </div>
                      
                      <!-- Assignment Notes -->
                      <div class="col-12" v-if="selectedAsset.assignmentNotes">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Assignment Notes</label>
                          <div class="info-value-compact">
                            <NotesDisplay 
                              :notes="selectedAsset.assignmentNotes"
                              :fallback-text="'No assignment notes provided.'"
                              :show-label="false"
                              :show-icon="false"
                              :show-empty-icon="true"
                              :preserve-formatting="true"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Retirement Information (if asset is retired) -->
            <div v-if="selectedAsset.status === 'RETIRED'" class="row">
              <div class="col-12">
                <div class="retirement-status-combined">
                  <h6 class="section-title-compact d-flex align-items-center justify-content-between" 
                      @click="toggleRetirementDetails" 
                      style="cursor: pointer;">
                    <span><i class="fas fa-archive me-2"></i>Retirement Information</span>
                    <i class="fas fa-chevron-down retirement-chevron" 
                       :class="{ 'rotated': isRetirementDetailsExpanded }"
                       v-if="selectedAsset.retirementNotes"></i>
                  </h6>
                  
                  <!-- Basic Retirement Info -->
                  <div class="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                    <div class="d-flex align-items-center gap-3">
                      <div class="retirement-icon">
                        <i class="fas fa-archive fa-lg text-muted"></i>
                      </div>
                      <div class="retirement-details">
                        <div class="d-flex align-items-center gap-3 mb-1">
                          <div>
                            <span class="text-muted" style="font-size: 0.8rem;">Status:</span>
                            <span :class="getStatusBadgeClass(selectedAsset.status)" class="ms-1">{{ getStatusText(selectedAsset.status) }}</span>
                          </div>
                          <div>
                            <span class="text-muted" style="font-size: 0.8rem;">Retirement Date:</span>
                            <span class="ms-1 fw-medium" style="font-size: 0.9rem;">{{ selectedAsset.retirementDate ? formatDate(selectedAsset.retirementDate) : 'Not specified' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Retirement Details (only show if retirement notes exist) -->
                  <div v-if="selectedAsset.retirementNotes" 
                       v-show="isRetirementDetailsExpanded" 
                       class="retirement-details-expanded">
                    <div class="row g-2">
                      <!-- Retirement Reason -->
                      <div class="col-md-6" v-if="selectedAsset.retirementReason">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Retirement Reason</label>
                          <div class="info-value-compact">{{ selectedAsset.retirementReason }}</div>
                        </div>
                      </div>
                      
                      <!-- Divider between retirement details and notes -->
                      <div class="col-12" v-if="selectedAsset.retirementNotes">
                        <hr class="retirement-divider">
                      </div>
                      
                      <!-- Retirement Notes -->
                      <div class="col-12" v-if="selectedAsset.retirementNotes">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Retirement Notes</label>
                          <div class="info-value-compact">
                            <NotesDisplay 
                              :notes="selectedAsset.retirementNotes"
                              :fallback-text="'No retirement notes provided.'"
                              :show-label="false"
                              :show-icon="false"
                              :show-empty-icon="true"
                              :preserve-formatting="true"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Refurbishment Information (if condition is REFURBISHED) -->
            <div v-if="selectedAsset.condition === 'REFURBISHED'" class="row mt-2">
              <div class="col-12">
                <div class="retirement-status-combined">
                    <h6 class="section-title-compact d-flex align-items-center justify-content-between" 
                        @click="toggleRefurbishmentDetails" 
                        style="cursor: pointer;">
                      <span><i class="fas fa-tools me-2"></i>Refurbishment Information</span>
                      <i class="fas fa-chevron-down assignment-chevron" 
                         :class="{ 'rotated': isRefurbishmentDetailsExpanded }"></i>
                    </h6>
                    
                    <!-- Basic Refurbishment Info (always visible) -->
                    <div class="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                      <div class="d-flex align-items-center gap-3">
                        <div class="retirement-icon">
                          <i class="fas fa-tools fa-lg text-muted"></i>
                        </div>
                        <div class="retirement-details">
                          <div class="d-flex gap-4">
                            <div v-if="selectedAsset.retirementDate">
                              <small class="text-muted">Retirement Date</small>
                              <div class="fw-semibold">{{ formatDate(selectedAsset.retirementDate) }}</div>
                            </div>
                            <div v-if="selectedAsset.reactivationDate">
                              <small class="text-muted">Reactivation Date</small>
                              <div class="fw-semibold">{{ formatDate(selectedAsset.reactivationDate) }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Refurbishment Details (collapsible) -->
                    <div v-show="isRefurbishmentDetailsExpanded" 
                         class="assignment-details-expanded">
                      
                      <!-- Retirement Information -->
                      <div v-if="selectedAsset.retirementReason">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Retirement Reason</label>
                          <div class="info-value-compact">{{ selectedAsset.retirementReason }}</div>
                        </div>
                      </div>
                      
                      <!-- Divider Line -->
                      <hr class="my-3" style="border-color: #e9ecef; border-width: 1px;" v-if="selectedAsset.retirementReason && selectedAsset.reactivationReason">
                      
                      <!-- Reactivation Information -->
                      <div v-if="selectedAsset.reactivationReason">
                        <NotesDisplay 
                          :notes="selectedAsset.reactivationReason"
                          :label="'Reactivation Reason'"
                          :fallback-text="'No reactivation reason provided.'"
                          :show-label="true"
                          :show-icon="false"
                          :show-empty-icon="false"
                          :preserve-formatting="true"
                        />
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <!-- Additional Notes - Full Width -->
            <div class="row mt-2">
              <div class="col-12">
                <div class="asset-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-sticky-note me-2"></i>Additional Notes</h6>
                  <NotesDisplay 
                    :notes="selectedAsset.notes"
                    :fallback-text="'No additional notes provided.'"
                    :show-label="false"
                    :show-icon="false"
                    :show-empty-icon="true"
                    :preserve-formatting="true"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="d-flex justify-content-between w-100">
              <div>
                <button type="button" class="btn btn-brown" @click="viewAssetHistory(selectedAsset!)">
                  <i class="fas fa-history me-1"></i>History
                </button>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary" @click="closeDetailModal">Close</button>
                <button v-if="selectedAsset.status === 'AVAILABLE'" type="button" class="btn btn-success" @click="issueAsset(selectedAsset!)">
                  <i class="fas fa-user-plus me-1"></i>Issue Asset
                </button>
                <button v-if="selectedAsset.status === 'ASSIGNED'" type="button" class="btn btn-pink" @click="collectAsset(selectedAsset!)">
                  <i class="fas fa-user-minus me-1"></i>Collect Asset
                </button>
                <button type="button" class="btn btn-warning" @click="handleMaintenanceAction(selectedAsset!)">
                  <i class="fas fa-wrench me-1"></i>Schedule Maintenance
                </button>
              <button type="button" class="btn btn-primary-blue" @click="editAsset(selectedAsset!)" :disabled="!selectedAsset">
                <i class="fas fa-edit me-1"></i>Edit Asset
              </button>
              <button v-if="selectedAsset.status === 'AVAILABLE'" type="button" class="btn btn-danger" @click="openRetireAssetModal">
                <i class="fas fa-archive me-1"></i>Retire Asset
              </button>
              <button v-if="selectedAsset.status === 'RETIRED'" type="button" class="btn btn-success" @click="openReactivateAssetModal">
                <i class="fas fa-power-off me-1"></i>Reactivate Asset
              </button>
            </div>
          </div>
          
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Upload Modal -->
    <BulkAssetUpload
      ref="bulkAssetUploadRef"
      @upload-success="handleBulkUploadSuccess"
    />

    <!-- Retire Asset Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showRetireAssetModal }" 
      :style="{ display: showRetireAssetModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="showRetireAssetModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              <i class="fas fa-archive me-2" style="color: var(--secondary-red);"></i>Retire Asset - {{ assetToRetire?.id }}
            </h5>
            <button type="button" class="btn-close" @click="closeRetireAssetModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Warning:</strong> This action will permanently retire the asset. It cannot be assigned to employees after retirement.
            </div>
            
            <form @submit.prevent="retireAsset" class="needs-validation" novalidate>
              <!-- Asset Summary -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="asset-info-section-compact">
                    <h6 class="section-title-compact"><i class="fas fa-laptop me-2"></i>Asset Summary</h6>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Asset ID</label>
                          <div class="info-value-compact fw-bold">{{ assetToRetire?.id }}</div>
                        </div>
                        <div class="info-item-compact">
                          <label class="info-label-compact">Asset Type</label>
                          <div class="info-value-compact">{{ assetToRetire?.type }}</div>
                        </div>
                        <div class="info-item-compact">
                          <label class="info-label-compact">Brand & Model</label>
                          <div class="info-value-compact">{{ assetToRetire?.brandModel }}</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="info-item-compact">
                          <label class="info-label-compact">Serial Number</label>
                          <div class="info-value-compact font-monospace">{{ assetToRetire?.serialNumber }}</div>
                        </div>
                        <div class="info-item-compact">
                          <label class="info-label-compact">Current Status</label>
                          <div class="info-value-compact">
                            <span :class="getStatusBadgeClass(assetToRetire?.status || '')">{{ getStatusText(assetToRetire?.status || '') }}</span>
                          </div>
                        </div>
                        <div class="info-item-compact">
                          <label class="info-label-compact">Current Location</label>
                          <div class="info-value-compact">{{ assetToRetire?.location }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Retirement Details -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="asset-info-section-compact">
                    <h6 class="section-title-compact"><i class="fas fa-calendar me-2"></i>Retirement Details</h6>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="retirementDate" class="form-label">Retirement Date <span class="text-danger">*</span></label>
                          <input 
                            type="date" 
                            class="form-control" 
                            :class="{ 
                              'is-invalid': !retireFormValidation.retirementDate.isValid,
                              'is-valid': retireFormValidation.retirementDate.isValid && retireFormData.retirementDate
                            }"
                            id="retirementDate" 
                            v-model="retireFormData.retirementDate"
                            @blur="validateRetirementDate"
                            @change="validateRetirementDate"
                            required
                          >
                          <div v-if="!retireFormValidation.retirementDate.isValid" class="invalid-feedback">
                            {{ retireFormValidation.retirementDate.message }}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6 form-searchable-dropdown">
                        <SearchableDropdown
                          id="retirementReason"
                          label="Retirement Reason"
                          placeholder="Select retirement reason..."
                          :items="retirementReasons"
                          v-model="selectedRetirementReason"
                          :class="{ 
                            'is-invalid': !retireFormValidation.retirementReason.isValid,
                            'is-valid': retireFormValidation.retirementReason.isValid && retireFormData.retirementReason
                          }"
                          required
                          @change="onRetirementReasonChange"
                        />
                        <div v-if="!retireFormValidation.retirementReason.isValid" class="invalid-feedback d-block">
                          {{ retireFormValidation.retirementReason.message }}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12 notes-no-validation">
                        <NotesTextarea
                          v-model="retireFormData.retirementNotes"
                          label="Additional Notes"
                          placeholder="Enter any additional notes about the retirement..."
                          help-text="Include details about the asset's condition, disposal method, or any other relevant information."
                          :max-length="1000"
                          :min-rows="3"
                          input-id="retirementNotes"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeRetireAssetModal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="retireAsset" 
              :disabled="isRetiringAsset || !retireFormData.retirementDate || !retireFormData.retirementReason"
            >
              <i class="fas fa-archive me-1"></i>
              {{ isRetiringAsset ? 'Retiring...' : 'Confirm Retirement' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reactivate Asset Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showReactivateAssetModal }" 
      :style="{ display: showReactivateAssetModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="showReactivateAssetModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              <i class="fas fa-power-off me-2" style="color: var(--secondary-green);"></i>Reactivate Asset - {{ assetToReactivate?.id }}
            </h5>
            <button type="button" class="btn-close" @click="closeReactivateAssetModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-success">
              <i class="fas fa-check-circle me-2"></i>
              <strong>Asset Reactivation:</strong> This will restore the asset to active inventory and make it available for assignment.
            </div>
            
            <form @submit.prevent="reactivateAsset" class="needs-validation" novalidate>
              <!-- Asset Summary -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="retirement-status-combined">
                    <h6 class="section-title-compact d-flex align-items-center justify-content-between" 
                        @click="toggleReactivateAssetSummary" 
                        style="cursor: pointer;">
                      <span><i class="fas fa-laptop me-2"></i>Asset Summary</span>
                      <i class="fas fa-chevron-down assignment-chevron" 
                         :class="{ 'rotated': isReactivateAssetSummaryExpanded }"></i>
                    </h6>
                    
                    <!-- Basic Asset Info -->
                    <div class="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                      <div class="d-flex align-items-center gap-3">
                        <div class="retirement-icon">
                          <i class="fas fa-laptop fa-lg text-muted"></i>
                        </div>
                        <div class="retirement-details">
                          <div class="d-flex align-items-center gap-3 mb-1">
                            <div>
                              <span class="text-muted" style="font-size: 0.8rem;">Asset ID:</span>
                              <span class="ms-1 fw-bold" style="font-size: 0.9rem;">{{ assetToReactivate?.id }}</span>
                            </div>
                            <div>
                              <span class="text-muted" style="font-size: 0.8rem;">Status:</span>
                              <span :class="getStatusBadgeClass(assetToReactivate?.status || 'RETIRED')" class="ms-1">{{ getStatusText(assetToReactivate?.status || 'RETIRED') }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Asset Details -->
                    <div class="retirement-details-expanded" v-show="isReactivateAssetSummaryExpanded">
                      <div class="row g-2">
                        <!-- Asset Type -->
                        <div class="col-md-6">
                          <div class="info-item-compact">
                            <label class="info-label-compact">Asset Type</label>
                            <div class="info-value-compact">{{ assetToReactivate?.type }}</div>
                          </div>
                        </div>
                        
                        <!-- Brand & Model -->
                        <div class="col-md-6">
                          <div class="info-item-compact">
                            <label class="info-label-compact">Brand & Model</label>
                            <div class="info-value-compact">{{ assetToReactivate?.brandModel }}</div>
                          </div>
                        </div>
                        
                        <!-- Serial Number -->
                        <div class="col-md-6">
                          <div class="info-item-compact">
                            <label class="info-label-compact">Serial Number</label>
                            <div class="info-value-compact font-monospace">{{ assetToReactivate?.serialNumber }}</div>
                          </div>
                        </div>
                        
                        <!-- Current Condition -->
                        <div class="col-md-6">
                          <div class="info-item-compact">
                            <label class="info-label-compact">Current Condition</label>
                            <div class="info-value-compact">
                              <span :class="getConditionBadgeClass(assetToReactivate?.condition || 'POOR')">{{ assetToReactivate?.condition || 'POOR' }}</span>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Divider -->
                        <div class="col-12">
                          <hr class="retirement-divider">
                        </div>
                        
                        <!-- Retirement Reason -->
                        <div class="col-md-6" v-if="assetToReactivate?.retirementReason">
                          <div class="info-item-compact">
                            <label class="info-label-compact">Retirement Reason</label>
                            <div class="info-value-compact">{{ assetToReactivate?.retirementReason }}</div>
                          </div>
                        </div>
                        
                        <!-- Retirement Date -->
                        <div class="col-md-6" v-if="assetToReactivate?.retirementDate">
                          <div class="info-item-compact">
                            <label class="info-label-compact">Retirement Date</label>
                            <div class="info-value-compact">{{ formatDate(assetToReactivate?.retirementDate) }}</div>
                          </div>
                        </div>
                        
                        <!-- Retirement Notes -->
                        <div class="col-12" v-if="assetToReactivate?.retirementNotes">
                          <div class="info-item-compact">
                            <label class="info-label-compact">Retirement Notes</label>
                            <div class="info-value-compact">
                              <NotesDisplay 
                                :notes="assetToReactivate?.retirementNotes"
                                :fallback-text="'No retirement notes provided.'"
                                :show-label="false"
                                :show-icon="false"
                                :show-empty-icon="true"
                                :preserve-formatting="true"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reactivation Details -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="asset-info-section-compact">
                    <h6 class="section-title-compact"><i class="fas fa-power-off me-2"></i>Reactivation Details</h6>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="reactivationDate" class="form-label">Reactivation Date <span class="text-danger">*</span></label>
                          <input 
                            type="date" 
                            class="form-control" 
                            id="reactivationDate"
                            v-model="reactivateFormData.reactivationDate"
                            :class="{ 'is-invalid': reactivateFormValidation.reactivationDate === 'invalid', 'is-valid': reactivateFormValidation.reactivationDate === 'valid' }"
                            required
                          >
                          <div class="form-text">Date when asset returns to active status</div>
                          <div v-if="reactivateFormValidation.reactivationDate === 'invalid'" class="invalid-feedback">
                            Please select a valid reactivation date.
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="newLocation" class="form-label">New Location <span class="text-danger">*</span></label>
                          <input 
                            type="text" 
                            class="form-control" 
                            id="newLocation"
                            v-model="reactivateFormData.location"
                            :class="{ 'is-invalid': reactivateFormValidation.location === 'invalid', 'is-valid': reactivateFormValidation.location === 'valid' }"
                            placeholder="e.g., Warehouse A, Shelf B2"
                            required
                          >
                          <div class="form-text">Where the asset will be stored/used</div>
                          <div v-if="reactivateFormValidation.location === 'invalid'" class="invalid-feedback">
                            Please specify the new location.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="newCondition" class="form-label">Current Condition <span class="text-danger">*</span></label>
                          <input 
                            type="text" 
                            class="form-control" 
                            id="newCondition"
                            value="REFURBISHED"
                            readonly
                            style="background-color: #f8f9fa; color: #6c757d;"
                          >
                          <div class="form-text">Asset condition after refurbishment and repairs</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="newStatus" class="form-label">New Status <span class="text-danger">*</span></label>
                          <input 
                            type="text" 
                            class="form-control" 
                            id="newStatus"
                            value="AVAILABLE"
                            readonly
                            style="background-color: #f8f9fa; color: #6c757d;"
                          >
                          <div class="form-text">Status after reactivation</div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12 notes-no-validation">
                        <NotesTextarea
                          ref="reactivationReasonTextarea"
                          v-model="reactivateFormData.reactivationReason"
                          label="Reactivation Reason"
                          placeholder="Describe why this asset is being reactivated and what repairs/improvements were made..."
                          help-text="Explain why the asset is being reactivated (max 1000 characters)"
                          :max-length="1000"
                          :min-rows="3"
                          input-id="reactivationReason"
                          :required="true"
                        />
                        <div v-if="reactivateFormValidation.reactivationReason === 'invalid'" class="invalid-feedback d-block">
                          Please provide a reactivation reason.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeReactivateAssetModal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-success" 
              @click="reactivateAsset"
              :disabled="isReactivatingAsset || !reactivateFormData.reactivationDate || !reactivateFormData.location || !reactivateFormData.reactivationReason"
            >
              <i v-if="isReactivatingAsset" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-power-off me-1"></i>
              {{ isReactivatingAsset ? 'Reactivating...' : 'Confirm Reactivation' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div 
      v-if="showDetailModal || showRetireAssetModal || showReactivateAssetModal" 
      class="modal-backdrop fade show"
      @click="closeModals"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from 'date-fns'
import { assetService } from '../../services/assetService'
import type { Asset, AssetQueryParams, FilterOptions } from '../../types/asset.types'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'
import NotesDisplay from '@/components/common/NotesDisplay.vue'
import NotesTextarea from '@/components/common/NotesTextarea.vue'
import BulkAssetUpload from './BulkAssetUpload.vue'
import AppPagination from '@/components/pagination/AppPagination.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Local types for display
interface AssetDisplayItem {
  id: string
  type: string
  brand: string
  brandModel: string
  serialNumber: string
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_MAINTENANCE' | 'RETIRED' | 'LOST'
  assignedTo?: string
  purchaseDate: string
  location: string
  category: string
  condition: string
  purchaseCost?: number
  vendor: string
  warrantyUntil: string
  warrantyStartDate?: string
  notes?: string
  // Assignment details
  assignmentReason?: string
  assignmentNotes?: string
  assignmentDate?: string
  assignedBy?: string
  // Retirement details
  retirementDate?: string
  retirementReason?: string
  retirementNotes?: string
  // Reactivation details
  reactivationDate?: string
  reactivationReason?: string
}

// Reactive data
const currentView = ref<'list' | 'grid'>('list')
const searchTerm = ref('')
const selectedType = ref<Item | null>(null)
const selectedBrand = ref<Item | null>(null)
const selectedStatus = ref<Item | null>(null)
const selectedCondition = ref<Item | null>(null)
const selectedSortBy = ref<Item | null>(null)
const sortAscending = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showDetailModal = ref(false)
const showRetireAssetModal = ref(false)
const showFilterDropdown = ref(false)
const isAssignmentDetailsExpanded = ref(false)
const isRetirementDetailsExpanded = ref(false)
const isReactivateAssetSummaryExpanded = ref(false)
const isRefurbishmentDetailsExpanded = ref(false)
const selectedAsset = ref<AssetDisplayItem | null>(null)
const assetToRetire = ref<AssetDisplayItem | null>(null)
const isRetiringAsset = ref(false)
const bulkAssetUploadRef = ref<InstanceType<typeof BulkAssetUpload> | null>(null)

// Bulk upload is now handled by BulkAssetUpload component

// Retire asset form data
const retireFormData = ref({
  retirementDate: '',
  retirementReason: '',
  retirementNotes: ''
})

// Retirement reasons for dropdown
const retirementReasons = ref<Item[]>([
  { id: 'END_OF_LIFE', name: 'End of Life' },
  { id: 'DAMAGED_BEYOND_REPAIR', name: 'Damaged Beyond Repair' },
  { id: 'OBSOLETE', name: 'Obsolete Technology' },
  { id: 'COST_INEFFECTIVE', name: 'Cost Ineffective to Maintain' },
  { id: 'SECURITY_CONCERNS', name: 'Security Concerns' },
  { id: 'OTHER', name: 'Other' }
])

const selectedRetirementReason = ref<Item | null>(null)

// Validation state for retire form
const retireFormValidation = ref({
  retirementDate: { isValid: true, message: '' },
  retirementReason: { isValid: true, message: '' },
  isFormValid: true
})

// Reactivate asset modal
const showReactivateAssetModal = ref(false)
const assetToReactivate = ref<AssetDisplayItem | null>(null)
const isReactivatingAsset = ref(false)

// Reactivate asset form data
const reactivateFormData = ref({
  reactivationDate: '',
  condition: '',
  status: 'AVAILABLE',
  location: '',
  reactivationReason: ''
})

// Note: Condition and Status are now fixed values (REFURBISHED and AVAILABLE)
// No dropdown selections needed for reactivation modal

// Reactivate form validation
const reactivateFormValidation = ref({
  reactivationDate: 'valid',
  condition: 'valid',
  status: 'valid',
  location: 'valid',
  reactivationReason: 'valid'
})

// API data
const assets = ref<Asset[]>([])
const filterOptions = ref<FilterOptions>({
  assetTypes: [],
  brands: [],
  models: [],
  vendors: []
})
const isLoading = ref(false)
const totalAssets = ref(0)
const totalPages = ref(0)

// Transform assets for display
const displayAssets = computed(() => {
  return assets.value.map(asset => assetService.transformAssetForDisplay(asset))
})

// Computed properties for filters
const assetTypes = computed(() => {
  return filterOptions.value.assetTypes.map(type => ({
    id: type.id,
    name: type.name,
    value: type.id.toString()
  }))
})

const brands = computed(() => {
  return filterOptions.value.brands.map(brand => ({
    id: brand.id,
    name: brand.name,
    value: brand.id.toString()
  }))
})

// Status options for dropdown
const statusOptions = ref<Item[]>([
  { id: 'AVAILABLE', name: 'Available', value: 'AVAILABLE' },
  { id: 'ASSIGNED', name: 'Assigned', value: 'ASSIGNED' },
  { id: 'IN_MAINTENANCE', name: 'In Maintenance', value: 'IN_MAINTENANCE' },
  { id: 'RETIRED', name: 'Retired', value: 'RETIRED' },
  { id: 'LOST', name: 'Lost', value: 'LOST' }
])

// Condition options for dropdown
const conditionOptions = ref<Item[]>([
  { id: 'NEW', name: 'New', value: 'NEW' },
  { id: 'GOOD', name: 'Good', value: 'GOOD' },
  { id: 'FAIR', name: 'Fair', value: 'FAIR' },
  { id: 'POOR', name: 'Poor', value: 'POOR' },
  { id: 'DAMAGED', name: 'Damaged', value: 'DAMAGED' },
  { id: 'REFURBISHED', name: 'Refurbished', value: 'REFURBISHED' }
])

// Sort options for dropdown
const sortOptions = ref<Item[]>([
  { id: 'assetId', name: 'Asset ID', value: 'assetId' },
  { id: 'status', name: 'Status', value: 'status' },
  { id: 'condition', name: 'Condition', value: 'condition' },
  { id: 'purchaseDate', name: 'Purchase Date', value: 'purchaseDate' },
  { id: 'createdAt', name: 'Created Date', value: 'createdAt' },
  { id: 'updatedAt', name: 'Updated Date', value: 'updatedAt' }
])

const filteredAssets = computed(() => {
  return displayAssets.value // Filtering is now handled by the backend API
})

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, totalAssets.value)
  return {
    start,
    end,
    total: totalAssets.value
  }
})

// Computed properties for filter tracking
const hasActiveFilters = computed(() => {
  return selectedType.value !== null || selectedBrand.value !== null || selectedStatus.value !== null || selectedCondition.value !== null
})

// API Methods
const loadAssets = async () => {
  try {
    isLoading.value = true
    
    const params: AssetQueryParams = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchTerm.value || undefined,
      assetTypeId: selectedType.value ? parseInt(selectedType.value.value as string) : undefined,
      brandId: selectedBrand.value ? parseInt(selectedBrand.value.value as string) : undefined,
      status: selectedStatus.value?.value as any || undefined,
      condition: selectedCondition.value?.value as any || undefined,
      sortBy: selectedSortBy.value?.value as string || 'assetId',
      sortOrder: sortAscending.value ? 'asc' : 'desc'
    }

    const response = await assetService.getAssets(params)
    assets.value = response.data.assets
    totalAssets.value = response.data.pagination.totalCount
    totalPages.value = response.data.pagination.totalPages
  } catch (error) {
    console.error('Error loading assets:', error)
    // You could add toast notification here
  } finally {
    isLoading.value = false
  }
}

const loadFilterOptions = async () => {
  try {
    filterOptions.value = await assetService.getFilterOptions()
  } catch (error) {
    console.error('Error loading filter options:', error)
  }
}

// Methods
const setView = (view: 'list' | 'grid') => {
  currentView.value = view
}

// Set default view based on screen size
const setDefaultView = () => {
  const screenWidth = window.innerWidth
  console.log('Screen width:', screenWidth) // Debug log
  
  if (screenWidth < 768) { // sm breakpoint (768px)
    console.log('Setting to grid view') // Debug log
    currentView.value = 'grid'
  } else {
    console.log('Setting to list view') // Debug log
    currentView.value = 'list'
  }
}

// Debounced resize handler
let resizeTimeout: number | null = null
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    setDefaultView()
  }, 150) // 150ms debounce
}

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value
  loadAssets() // Reload with new sort order
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedType.value = null
  selectedBrand.value = null
  selectedStatus.value = null
  selectedCondition.value = null
  selectedSortBy.value = null
  currentPage.value = 1
  loadAssets() // Reload with cleared filters
}

// Change handlers for searchable dropdowns
const onAssetTypeChange = (item: Item | null) => {
  selectedType.value = item
  debouncedLoadAssets()
}

const onBrandChange = (item: Item | null) => {
  selectedBrand.value = item
  debouncedLoadAssets()
}

const onStatusChange = (item: Item | null) => {
  selectedStatus.value = item
  debouncedLoadAssets()
}

const onConditionChange = (item: Item | null) => {
  selectedCondition.value = item
  debouncedLoadAssets()
}

const onSortByChange = (item: Item | null) => {
  selectedSortBy.value = item
  loadAssets()
}

// Filter dropdown methods
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
}

// Assignment details toggle method
const toggleAssignmentDetails = () => {
  isAssignmentDetailsExpanded.value = !isAssignmentDetailsExpanded.value
}

// Retirement details toggle method
const toggleRetirementDetails = () => {
  isRetirementDetailsExpanded.value = !isRetirementDetailsExpanded.value
}

// Reactivate asset summary toggle method
const toggleReactivateAssetSummary = () => {
  isReactivateAssetSummaryExpanded.value = !isReactivateAssetSummaryExpanded.value
}

// Refurbishment details toggle method
const toggleRefurbishmentDetails = () => {
  isRefurbishmentDetailsExpanded.value = !isRefurbishmentDetailsExpanded.value
}



const goToPage = (page: number) => {
  currentPage.value = page
  loadAssets()
}

const viewAssetDetails = (asset: AssetDisplayItem) => {
  selectedAsset.value = asset
  isAssignmentDetailsExpanded.value = false // Reset collapse state
  isRetirementDetailsExpanded.value = false // Reset retirement collapse state
  isRefurbishmentDetailsExpanded.value = false // Reset refurbishment collapse state
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedAsset.value = null
}

const closeModals = () => {
  showDetailModal.value = false
  showRetireAssetModal.value = false
  selectedAsset.value = null
}

const openRetireAssetModal = () => {
  // Store the asset data before closing the detail modal
  assetToRetire.value = selectedAsset.value
  
  // Close the detail modal first to avoid modal over modal issue
  closeDetailModal()
  
  // Set default retirement date to today
  retireFormData.value.retirementDate = new Date().toISOString().split('T')[0]
  retireFormData.value.retirementReason = ''
  retireFormData.value.retirementNotes = ''
  selectedRetirementReason.value = null
  clearRetireFormValidation()
  showRetireAssetModal.value = true
}

const closeRetireAssetModal = () => {
  showRetireAssetModal.value = false
  assetToRetire.value = null
  selectedRetirementReason.value = null
  clearRetireFormValidation()
  retireFormData.value = {
    retirementDate: '',
    retirementReason: '',
    retirementNotes: ''
  }
}

const onRetirementReasonChange = (reason: Item | null) => {
  selectedRetirementReason.value = reason
  retireFormData.value.retirementReason = reason?.id as string || ''
  
  // Clear validation error when user selects a reason
  if (reason) {
    retireFormValidation.value.retirementReason.isValid = true
    retireFormValidation.value.retirementReason.message = ''
  }
}

// Validation functions for retire form
const validateRetirementDate = () => {
  const date = retireFormData.value.retirementDate
  if (!date) {
    retireFormValidation.value.retirementDate.isValid = false
    retireFormValidation.value.retirementDate.message = 'Retirement date is required'
    return false
  }
  
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (selectedDate > today) {
    retireFormValidation.value.retirementDate.isValid = false
    retireFormValidation.value.retirementDate.message = 'Retirement date cannot be in the future'
    return false
  }
  
  retireFormValidation.value.retirementDate.isValid = true
  retireFormValidation.value.retirementDate.message = ''
  return true
}

const validateRetirementReason = () => {
  const reason = retireFormData.value.retirementReason
  if (!reason) {
    retireFormValidation.value.retirementReason.isValid = false
    retireFormValidation.value.retirementReason.message = 'Retirement reason is required'
    return false
  }
  
  retireFormValidation.value.retirementReason.isValid = true
  retireFormValidation.value.retirementReason.message = ''
  return true
}

const validateRetireForm = () => {
  const isDateValid = validateRetirementDate()
  const isReasonValid = validateRetirementReason()
  
  retireFormValidation.value.isFormValid = isDateValid && isReasonValid
  return retireFormValidation.value.isFormValid
}

const clearRetireFormValidation = () => {
  retireFormValidation.value = {
    retirementDate: { isValid: true, message: '' },
    retirementReason: { isValid: true, message: '' },
    isFormValid: true
  }
}

const exportAssets = async () => {
  try {
    isLoading.value = true
    
    // Build export parameters from current filters
    const exportParams: any = {
      // Include current search and filter values
      search: searchTerm.value || undefined,
      assetTypeId: selectedType.value ? parseInt(selectedType.value.value as string) : undefined,
      brandId: selectedBrand.value ? parseInt(selectedBrand.value.value as string) : undefined,
      status: selectedStatus.value?.value as any || undefined,
      condition: selectedCondition.value?.value as any || undefined,
      sortBy: selectedSortBy.value?.value as string || 'assetId',
      sortOrder: sortAscending.value ? 'asc' : 'desc'
    }
    
    // Use server-side Excel export
    await assetService.exportAssetsToExcel(exportParams)
    
  } catch (error) {
    console.error('Error exporting assets:', error)
    alert('Error exporting assets. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const downloadTemplate = () => {
  assetService.downloadBulkUploadTemplate()
}

// Bulk upload event handlers
const handleBulkUpload = async (data: any[]) => {
  try {
    isLoading.value = true
    
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []
    
    // Process each asset individually
    for (const assetData of data) {
      try {
        // Transform the data to match CreateAssetDto format
        const createAssetDto = {
          assetId: assetData.assetId,
          serialNumber: assetData.serialNumber,
          assetTypeId: parseInt(assetData.assetTypeId) || 1, // Default to 1 if not provided
          brandId: parseInt(assetData.brandId) || 1, // Default to 1 if not provided
          modelId: parseInt(assetData.modelId) || 1, // Default to 1 if not provided
          vendorId: parseInt(assetData.vendorId) || 1, // Default to 1 if not provided
          status: assetData.status || 'AVAILABLE',
          condition: assetData.condition || 'NEW',
          location: assetData.location || 'Warehouse',
          purchaseDate: assetData.purchaseDate || undefined,
          purchaseCost: parseFloat(assetData.purchaseCost) || undefined,
          warrantyStartDate: assetData.warrantyStartDate || undefined,
          warrantyEndDate: assetData.warrantyEndDate || undefined,
          notes: assetData.notes || undefined
        }
        
        await assetService.createAsset(createAssetDto)
        successCount++
      } catch (error: any) {
        errorCount++
        errors.push(`Asset ${assetData.assetId}: ${error.message || 'Unknown error'}`)
      }
    }
    
    // Show success message with results
    if (errorCount === 0) {
      alert(`Upload completed successfully!\nSuccessfully imported: ${successCount} assets`)
    } else {
      alert(`Upload completed with some errors!\nSuccessfully imported: ${successCount} assets\nErrors: ${errorCount}\n\nError details:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`)
    }
    
    // Reload assets to show new data
    await loadAssets()
    
  } catch (error) {
    console.error('Error uploading assets:', error)
    alert('Error uploading assets. Please check the data and try again.')
  } finally {
    isLoading.value = false
  }
}

const handleTemplateDownload = (type: 'csv' | 'excel') => {
  if (type === 'csv') {
    assetService.downloadBulkUploadTemplate()
  } else {
    // For Excel template, we can use the same method or create a separate one
    assetService.downloadBulkUploadTemplate()
  }
}

const openBulkUploadModal = () => {
  bulkAssetUploadRef.value?.openModal()
}

const handleBulkUploadSuccess = (result: any) => {
  // Refresh the assets list after successful bulk upload
  loadAssets()
}

const closeDropdown = (dropdownId: string) => {
  const button = document.getElementById(dropdownId)
  const dropdown = button?.nextElementSibling as HTMLElement
  
  if (dropdown) {
    dropdown.classList.remove('show')
    button?.setAttribute('aria-expanded', 'false')
  }
}


const navigateToAddAsset = () => {
  router.push('/app/assets/add')
}

const navigateToManageCategories = () => {
  router.push('/app/assets/manage-categories')
}

const navigateToIssueAsset = () => {
  router.push('/app/assets/issue')
}

const navigateToCollectAsset = () => {
  router.push('/app/assets/collect')
}

const navigateToScheduleMaintenance = () => {
  router.push('/app/maintenance/schedule')
}

const issueAsset = (asset: AssetDisplayItem) => {
  // Store selected asset info in localStorage for pre-population
  localStorage.setItem('selectedAssetId', asset.id)
  localStorage.setItem('selectedAssetType', asset.type)
  
  // Navigate to issue asset form
  router.push('/app/assets/issue')
}

const collectAsset = (asset: AssetDisplayItem) => {
  // Store selected asset info in localStorage for pre-population
  localStorage.setItem('selectedAssetId', asset.id)
  localStorage.setItem('currentEmployee', asset.assignedTo || '')
  
  // Navigate to collect asset form
  router.push('/app/assets/collect')
}

const handleMaintenanceAction = (asset: AssetDisplayItem) => {
  if (asset.status === 'IN_MAINTENANCE') {
    // If asset is already in maintenance, navigate to view existing maintenance
    // For now, we'll navigate to the maintenance list where they can find the specific maintenance record
    router.push('/app/maintenance')
  } else {
    // If asset is not in maintenance, navigate to schedule new maintenance with asset pre-selected
    router.push({
      path: '/app/maintenance/schedule',
      query: { assetId: asset.id }
    })
  }
}

// Handle dropdown click with proper positioning
const handleDropdownClick = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const button = event.currentTarget as HTMLButtonElement
  const dropdown = button.nextElementSibling as HTMLElement
  
  if (dropdown) {
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      if (menu !== dropdown) {
        menu.classList.remove('show')
      }
    })
    document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
      if (btn !== button) {
        btn.setAttribute('aria-expanded', 'false')
      }
    })
    
    // Toggle current dropdown
    const isShown = dropdown.classList.contains('show')
    
    if (isShown) {
      dropdown.classList.remove('show')
      button.setAttribute('aria-expanded', 'false')
    } else {
      dropdown.classList.add('show')
      button.setAttribute('aria-expanded', 'true')
      
      // Ensure proper positioning
      setTimeout(() => {
        const rect = dropdown.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        
        // If dropdown goes off screen, adjust position
        if (rect.right > viewportWidth) {
          dropdown.style.right = '0'
          dropdown.style.left = 'auto'
        }
      }, 10)
    }
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show')
    })
    document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false')
    })
  }
}

const editAsset = (asset: AssetDisplayItem) => {
  // Find the original asset by matching the display asset ID (which is the assetId field)
  const originalAsset = assets.value.find(a => a.assetId === asset.id)
  if (originalAsset) {
    router.push(`/app/assets/edit/${originalAsset.id}`)
  } else {
    console.error('Could not find original asset with assetId:', asset.id)
  }
  closeDetailModal()
}

const viewAssetHistory = (asset: AssetDisplayItem) => {
  // Navigate to asset history page using the asset ID
  router.push(`/app/assets/${asset.id}/history`)
}

const retireAsset = async () => {
  if (!assetToRetire.value) return

  // Validate form
  if (!validateRetireForm()) {
    return
  }

  try {
    isRetiringAsset.value = true

    // Find the original asset by matching the display asset ID (which is the assetId field)
    const originalAsset = assets.value.find(a => a.assetId === assetToRetire.value!.id)
    if (!originalAsset) {
      console.error('Could not find original asset with assetId:', assetToRetire.value.id)
      return
    }

    // Call the dedicated retire asset API
    await assetService.retireAsset(originalAsset.id, {
      retirementDate: retireFormData.value.retirementDate,
      retirementReason: retireFormData.value.retirementReason,
      retirementNotes: retireFormData.value.retirementNotes || undefined
    })

    // Show success message
    alert(`Asset ${assetToRetire.value.id} has been successfully retired.`)

    // Close modal and refresh data
    closeRetireAssetModal()
    await loadAssets()

  } catch (error) {
    console.error('Error retiring asset:', error)
    alert('Error retiring asset. Please try again.')
  } finally {
    isRetiringAsset.value = false
  }
}

// Reactivate asset modal methods
const openReactivateAssetModal = () => {
  // Store the asset data before closing the detail modal
  assetToReactivate.value = selectedAsset.value
  
  // Close the detail modal first to avoid modal over modal issue
  closeDetailModal()
  
  // Set default reactivation date to today
  reactivateFormData.value.reactivationDate = new Date().toISOString().split('T')[0]
  reactivateFormData.value.condition = 'REFURBISHED' // Fixed value
  reactivateFormData.value.status = 'AVAILABLE' // Fixed value
  reactivateFormData.value.location = ''
  reactivateFormData.value.reactivationReason = ''
  
  // Clear validation
  clearReactivateFormValidation()
  
  // Reset expansion state
  isReactivateAssetSummaryExpanded.value = false
  
  // Show the reactivate modal
  showReactivateAssetModal.value = true
}

const closeReactivateAssetModal = () => {
  showReactivateAssetModal.value = false
  assetToReactivate.value = null
  clearReactivateFormValidation()
  reactivateFormData.value = {
    reactivationDate: '',
    condition: 'REFURBISHED', // Fixed value
    status: 'AVAILABLE', // Fixed value
    location: '',
    reactivationReason: ''
  }
}

const clearReactivateFormValidation = () => {
  reactivateFormValidation.value = {
    reactivationDate: 'valid',
    condition: 'valid',
    status: 'valid',
    location: 'valid',
    reactivationReason: 'valid'
  }
}

const reactivateAsset = async () => {
  if (!assetToReactivate.value) return

  // Validate form
  if (!reactivateFormData.value.reactivationDate || 
      !reactivateFormData.value.location || 
      !reactivateFormData.value.reactivationReason) {
    return
  }

  try {
    isReactivatingAsset.value = true

    // Find the original asset by matching the display asset ID (which is the assetId field)
    const originalAsset = assets.value.find(a => a.assetId === assetToReactivate.value!.id)
    if (!originalAsset) {
      console.error('Could not find original asset with assetId:', assetToReactivate.value.id)
      return
    }

    // Call the dedicated reactivate asset API
    await assetService.reactivateAsset(originalAsset.id, {
      reactivationDate: reactivateFormData.value.reactivationDate,
      condition: reactivateFormData.value.condition,
      status: reactivateFormData.value.status,
      location: reactivateFormData.value.location,
      reactivationReason: reactivateFormData.value.reactivationReason
    })

    // Show success message
    alert(`Asset ${assetToReactivate.value.id} has been successfully reactivated.`)

    // Close modal and refresh data
    closeReactivateAssetModal()
    await loadAssets()

  } catch (error) {
    console.error('Error reactivating asset:', error)
    alert('Error reactivating asset. Please try again.')
  } finally {
    isReactivatingAsset.value = false
  }
}

// Utility functions
const getAssetTypeIcon = (type: string) => {
  const icons = {
    'Laptop': 'fas fa-laptop text-primary',
    'Monitor': 'fas fa-desktop text-info',
    'Mobile': 'fas fa-mobile-alt text-warning',
    'Tablet': 'fas fa-tablet-alt text-success',
    'Accessory': 'fas fa-headphones text-secondary'
  }
  return icons[type as keyof typeof icons] || 'fas fa-cube text-primary'
}

const getAssetTypeColor = (type: string) => {
  const colors = {
    'Laptop': 'var(--secondary-purple)',
    'Monitor': 'var(--secondary-green)',
    'Mobile': 'var(--secondary-pink)',
    'Tablet': 'var(--secondary-orange)',
    'Accessory': 'var(--secondary-red)'
  }
  return colors[type as keyof typeof colors] || 'var(--secondary-purple)'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'AVAILABLE': 'badge badge-available',
    'ASSIGNED': 'badge badge-assigned',
    'IN_MAINTENANCE': 'badge badge-under-repair',
    'RETIRED': 'badge badge-retired',
    'LOST': 'badge badge-retired'
  }
  return classes[status as keyof typeof classes] || 'badge badge-retired'
}

const getConditionBadgeClass = (condition: string) => {
  const classes = {
    'Good': 'badge badge-condition-good',
    'New': 'badge badge-condition-new',
    'Fair': 'badge badge-condition-fair',
    'Poor': 'badge badge-condition-poor',
    'Damaged': 'badge badge-condition-poor',
    'Refurbished': 'badge badge-condition-refurbished'
  }
  return classes[condition as keyof typeof classes] || 'badge badge-condition-good'
}

const getStatusText = (status: string) => {
  const texts = {
    'AVAILABLE': 'Available',
    'ASSIGNED': 'Assigned',
    'IN_MAINTENANCE': 'In Maintenance',
    'RETIRED': 'Retired',
    'LOST': 'Lost'
  }
  return texts[status as keyof typeof texts] || status
}

const getConditionText = (condition: string) => {
  const texts = {
    'NEW': 'New',
    'GOOD': 'Good',
    'FAIR': 'Fair',
    'POOR': 'Poor',
    'DAMAGED': 'Damaged',
    'REFURBISHED': 'Refurbished'
  }
  return texts[condition as keyof typeof texts] || condition
}

const getViewButtonTitle = (status: string) => {
  const titles = {
    'ASSIGNED': 'View Assigned Asset Details',
    'IN_MAINTENANCE': 'View Maintenance Details',
    'RETIRED': 'View Retired Asset Details'
  }
  return titles[status as keyof typeof titles] || 'View Asset Details'
}

const getMaintenanceButtonTitle = (status: string) => {
  if (status === 'IN_MAINTENANCE') return 'View Full Maintenance'
  if (status === 'RETIRED') return 'Schedule Restoration'
  return 'Schedule Maintenance'
}

const getMaintenanceButtonIcon = (status: string) => {
  if (status === 'IN_MAINTENANCE') return 'fas fa-clipboard-list'
  return 'fas fa-wrench'
}

const getAssignmentIcon = (status: string) => {
  if (status === 'ASSIGNED') return 'fas fa-user'
  return 'fas fa-box'
}

const getAssignmentStatusText = (status: string) => {
  if (status === 'ASSIGNED') return 'Currently Assigned'
  return 'Available for Issue'
}

const getAssignmentStatusDescription = (status: string) => {
  if (status === 'ASSIGNED') return 'Currently with employee'
  return 'Ready to be assigned to an employee'
}

const getRetirementStatusDescription = (retirementReason: string) => {
  if (!retirementReason) return 'Asset has been retired'
  
  const reasonMap: Record<string, string> = {
    'END_OF_LIFE': 'Asset has reached end of life',
    'DAMAGED_BEYOND_REPAIR': 'Asset is damaged beyond repair',
    'OBSOLETE': 'Asset technology is obsolete',
    'COST_INEFFECTIVE': 'Asset maintenance is cost ineffective',
    'SECURITY_CONCERNS': 'Asset poses security concerns',
    'OTHER': 'Asset retired for other reasons'
  }
  
  return reasonMap[retirementReason] || 'Asset has been retired'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getWarrantyTimeLeft = (warrantyDate: string) => {
  // Handle empty or invalid warranty dates
  if (!warrantyDate || warrantyDate === '' || warrantyDate === 'null' || warrantyDate === 'undefined') {
    return 'Not specified'
  }
  
  const endDate = new Date(warrantyDate)
  const startDate = new Date()
  
  // Check if the date is valid
  if (isNaN(endDate.getTime())) {
    return 'Invalid date'
  }
  
  // Set both dates to start of day for accurate calculation
  endDate.setHours(0, 0, 0, 0)
  startDate.setHours(0, 0, 0, 0)
  
  // Check if warranty has expired
  if (endDate <= startDate) {
    return 'Expired'
  }
  
  // Use date-fns for accurate date calculations
  // Calculate years first
  const totalYears = differenceInYears(endDate, startDate)
  
  // Calculate remaining months after accounting for full years
  const dateAfterYears = addYears(startDate, totalYears)
  const remainingMonths = differenceInMonths(endDate, dateAfterYears)
  
  // Calculate remaining days after accounting for full years and months
  const dateAfterYearsAndMonths = addMonths(dateAfterYears, remainingMonths)
  const remainingDays = differenceInDays(endDate, dateAfterYearsAndMonths)
  
  // Build the result string - show all non-zero components
  const parts = []
  
  if (totalYears > 0) {
    parts.push(`${totalYears} year${totalYears !== 1 ? 's' : ''}`)
  }
  
  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`)
  }
  
  if (remainingDays > 0) {
    parts.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`)
  }
  
  // Handle edge cases
  if (parts.length === 0) {
    return 'Expires today'
  }
  
  return `${parts.join(', ')} remaining`
}

// Watch for filter changes to trigger API calls
const debounceTimeout = ref<number | null>(null)

const debouncedLoadAssets = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  debounceTimeout.value = setTimeout(() => {
    currentPage.value = 1 // Reset to first page when filtering
    loadAssets()
  }, 500) // 500ms debounce
}

// Watch for changes in filters
const watchFilters = () => {
  // Watch search term with debounce
  let searchTimeout: number | null = null
  const unwatchSearch = computed(() => searchTerm.value)
  
  // Watch other filters immediately
  const unwatchType = computed(() => selectedType.value)
  const unwatchBrand = computed(() => selectedBrand.value)
  const unwatchStatus = computed(() => selectedStatus.value)
  const unwatchSort = computed(() => selectedSortBy.value)
}

// Lifecycle
onMounted(async () => {
  // Set default view based on screen size
  setDefaultView()
  
  // If redirected here with toast query, show it and then clear it
  const toastType = route.query.toastType as string | undefined
  const toastTitle = route.query.toastTitle as string | undefined
  const toastMessage = route.query.toastMessage as string | undefined
  if (toastType && toastTitle && toastMessage) {
    console.log('[Assets] showing toast from onMounted query:', { toastType, toastTitle, toastMessage })
    if (toastType === 'success') toastStore.showSuccess(toastTitle, toastMessage)
    else if (toastType === 'error') toastStore.showError(toastTitle, toastMessage)
    else if (toastType === 'warning') toastStore.showWarning(toastTitle, toastMessage)
    else toastStore.showInfo(toastTitle, toastMessage)
    
    // Clean the query so the toast doesn't repeat on navigation
    router.replace({ path: route.path })
  }
  
  // Also handle cases where component is reused (watch query)
  watch(() => route.query, (q) => {
    const tType = q.toastType as string | undefined
    const tTitle = q.toastTitle as string | undefined
    const tMsg = q.toastMessage as string | undefined
    if (tType && tTitle && tMsg) {
      console.log('[Assets] showing toast from route watcher:', { tType, tTitle, tMsg })
      if (tType === 'success') toastStore.showSuccess(tTitle, tMsg)
      else if (tType === 'error') toastStore.showError(tTitle, tMsg)
      else if (tType === 'warning') toastStore.showWarning(tTitle, tMsg)
      else toastStore.showInfo(tTitle, tMsg)
      router.replace({ path: route.path })
    }
  }, { deep: true })
  
  // Add resize listener to update view on screen size change
  window.addEventListener('resize', handleResize)
  
  // Initialize default sort option
  selectedSortBy.value = sortOptions.value.find(option => option.value === 'assetId') || null
  
  await Promise.all([
    loadFilterOptions(),
    loadAssets()
  ])
  
  // Add click outside listener for dropdown
  document.addEventListener('click', handleClickOutside)
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) clearTimeout(resizeTimeout)
})
</script>

<style scoped>
/* Form validation styles */
.form-searchable-dropdown.is-invalid :deep(.form-control) {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.form-searchable-dropdown.is-valid :deep(.form-control) {
  border-color: #198754 !important;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25) !important;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
  font-weight: 500;
}

/* Remove validation styling from optional notes textarea */
.notes-no-validation :deep(.form-control.is-valid) {
  border-color: #999999 !important;
  box-shadow: none !important;
}

.notes-no-validation :deep(.form-control:focus) {
  border-color: #331FEA !important;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25) !important;
}

/* Dropdown improvements */
.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1050;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  color: #495057;
}

.dropdown-item:hover {
  background-color: rgba(51, 31, 234, 0.1);
  /* Preserve original text color */
}

.dropdown-item:active {
  background-color: rgba(51, 31, 234, 0.2);
  color: #331FEA;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid #dee2e6;
}

/* Ensure dropdown shows above other elements */
.dropdown {
  position: relative;
}

.dropdown-menu.show {
  display: block;
}



:deep(.form-label) {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

:deep(.form-control) {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Make button corners match input field corners for consistency */
.btn {
  border-radius: 0.375rem !important;
}

/* Fix search input group border-radius consistency */
.input-group .input-group-text {
  border-radius: 0.375rem 0 0 0.375rem !important;
}

.input-group .form-control:not(:last-child) {
  border-radius: 0 0.375rem 0.375rem 0 !important;
}

:deep(.form-control:focus) {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

:deep(.dropdown-menu) {
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  z-index: 1050;
}

:deep(.dropdown-item:hover),
:deep(.dropdown-item.active) {
  background-color: #e9ecef;
  color: #1e2125;
}

/* Filter dropdown styling */
.filter-dropdown {
  border: 1px solid #dee2e6;
  background-color: #f8f9fa !important;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Active filter button styling */
.btn.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.btn.active:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

/* Filter badge styling */
.badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.4rem;
}

/* Responsive dropdown positioning */
.dropdown-menu-responsive {
  /* Default: left-aligned for medium+ screens */
  left: 0;
  right: auto;
}

/* Small screens: right-aligned to prevent overflow */
@media (max-width: 767.98px) {
  .dropdown-menu-responsive {
    left: auto;
    right: 0;
    max-width: calc(100vw - 2rem);
    min-width: 200px;
  }
}

/* Asset Details Modal - Reduced Spacing and Better Warranty Display */
.equal-height-columns {
  display: flex;
  flex-wrap: wrap;
}

.equal-height-columns > [class*="col-"] {
  display: flex;
  flex-direction: column;
}

.asset-info-section-compact {
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
}

.asset-info-section-compact .section-title-compact {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #dee2e6;
}

.asset-info-section-compact .info-grid-compact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
}

.asset-info-section-compact .info-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.asset-info-section-compact .info-item-compact:last-child {
  border-bottom: none;
}

.asset-info-section-compact .info-label-compact {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0 !important;
  min-width: 140px;
  flex-shrink: 0;
}

.asset-info-section-compact .info-value-compact {
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #212529 !important;
  margin-bottom: 0 !important;
  text-align: right;
  flex-grow: 1;
}

/* Warranty info - Right aligned display design */
.warranty-info-compact {
  font-size: 0.9rem;
  line-height: 1.3;
  text-align: right;
}

.warranty-info-compact .warranty-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.warranty-info-compact .warranty-row:last-child {
  margin-bottom: 0;
}

.warranty-info-compact .warranty-label {
  font-size: 0.85rem;
  color: #6c757d;
  min-width: 40px;
  text-align: right;
}

.warranty-info-compact .warranty-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #28a745;
}

.warranty-info-compact .warranty-time {
  margin-top: 0.25rem;
  text-align: right;
}

.warranty-info-compact .warranty-time-text {
  font-size: 0.8rem;
  color: #6c757d;
  font-style: italic;
  font-weight: 500;
}

/* Assignment Divider */
.assignment-divider {
  border: none;
  border-top: 1px solid #e9ecef;
  margin: 1rem 0;
  opacity: 0.6;
}

/* Assignment Details Collapsible */
.assignment-chevron {
  transition: transform 0.3s ease;
  font-size: 1.1rem;
  color: #666666;
  cursor: pointer;
  padding: 0.2rem;
}

.assignment-chevron.rotated {
  transform: rotate(180deg);
}

.assignment-details-expanded {
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Assignment Notes Display Override */
.assignment-details-expanded .info-value-compact :deep(.notes-display-container) {
  margin: 0;
  padding: 0;
}

.assignment-details-expanded .info-value-compact :deep(.notes-content) {
  padding: 0;
  min-height: auto;
  align-items: flex-start;
}

.assignment-details-expanded .info-value-compact :deep(.notes-text) {
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.4;
}

.assignment-details-expanded .info-value-compact :deep(.notes-empty) {
  font-size: 0.95rem;
  font-style: italic;
  opacity: 0.7;
}


/* Assignment status combined */
.assignment-status-combined {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
}

.assignment-status-combined .section-title-compact {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #dee2e6;
}

.assignment-status-combined .assignment-details {
  flex-grow: 1;
}

.assignment-status-combined .assignment-icon {
  flex-shrink: 0;
}

.assignment-status-combined .qr-code-mini {
  flex-shrink: 0;
}

.assignment-status-combined .assignment-details span {
  font-size: 0.95rem !important;
}

.assignment-status-combined .assignment-details .fw-medium {
  font-size: 1rem !important;
}


/* Assignment Details Expanded */
.assignment-details-expanded {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
}

/* Retirement status combined */
.retirement-status-combined {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
}

.retirement-status-combined .section-title-compact {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #dee2e6;
}

.retirement-status-combined .retirement-details {
  flex-grow: 1;
}

.retirement-status-combined .retirement-icon {
  flex-shrink: 0;
}


.retirement-status-combined .retirement-details span {
  font-size: 0.95rem !important;
}

.retirement-status-combined .retirement-details .fw-medium {
  font-size: 1rem !important;
}

/* Retirement Details Expanded */
.retirement-details-expanded {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
}

/* Retirement Divider */
.retirement-divider {
  border: none;
  border-top: 1px solid #e9ecef;
  margin: 1rem 0;
  opacity: 0.6;
}

/* Retirement Details Collapsible */
.retirement-chevron {
  transition: transform 0.3s ease;
  font-size: 1.1rem;
  color: #666666;
  cursor: pointer;
  padding: 0.2rem;
}

.retirement-chevron.rotated {
  transform: rotate(180deg);
}

/* Retirement Notes Display Override */
.retirement-details-expanded .info-value-compact :deep(.notes-display-container) {
  margin: 0;
  padding: 0;
}

.retirement-details-expanded .info-value-compact :deep(.notes-content) {
  padding: 0;
  min-height: auto;
  align-items: flex-start;
}

.retirement-details-expanded .info-value-compact :deep(.notes-text) {
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.4;
}

.retirement-details-expanded .info-value-compact :deep(.notes-empty) {
  font-size: 0.95rem;
  font-style: italic;
  opacity: 0.7;
}

/* Custom Action Button Hover Effects */
/* View Details Button - Brown */
.btn-view-details:hover {
  color: var(--secondary-brown) !important;
  border-color: var(--secondary-brown) !important;
  background-color: rgba(150, 114, 89, 0.1) !important;
}

/* Edit Asset Button - Purple */
.btn-edit-asset:hover {
  color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
  background-color: rgba(51, 31, 234, 0.1) !important;
}

/* Issue Asset Button - Green */
.btn-issue-asset:hover {
  color: var(--secondary-green) !important;
  border-color: var(--secondary-green) !important;
  background-color: rgba(33, 175, 101, 0.1) !important;
}

/* Collect Asset Button - Pink */
.btn-collect-asset:hover {
  color: var(--secondary-pink) !important;
  border-color: var(--secondary-pink) !important;
  background-color: rgba(255, 87, 159, 0.1) !important;
}

/* Maintenance Button - Orange */
.btn-maintenance-action:hover {
  color: var(--secondary-orange) !important;
  border-color: var(--secondary-orange) !important;
  background-color: rgba(255, 140, 97, 0.1) !important;
}

/* QR Code Button - Non-clickable indicator */
.btn-qr-code:hover {
  color: var(--primary-mid-gray) !important;
  border-color: var(--primary-mid-gray) !important;
  background-color: rgba(153, 153, 153, 0.1) !important;
  cursor: not-allowed !important;
  opacity: 0.6 !important;
}



</style>
