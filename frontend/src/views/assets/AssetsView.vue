<template>
  <div class="container-fluid px-3 py-4">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0" style="color: var(--primary-black);">Asset Management</h2>
        <p class="text-muted mb-0">Manage and track all company assets</p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <!-- View Toggle -->
        <div class="btn-group" role="group" aria-label="View toggle">
          <button 
            :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: currentView === 'list' }]"
            @click="setView('list')"
          >
            <i class="fas fa-list"></i>
          </button>
          <button 
            :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: currentView === 'grid' }]"
            @click="setView('grid')"
          >
            <i class="fas fa-th-large"></i>
          </button>
        </div>
        
        <!-- Primary Action -->
        <button class="btn btn-primary btn-modern" @click="navigateToRegisterAsset">
          <i class="fas fa-plus me-1"></i>Add New Asset
        </button>
        
        <!-- Data Management Dropdown -->
        <div class="dropdown">
          <button 
            class="btn btn-outline-secondary btn-modern dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            aria-expanded="false"
            id="moreActionsDropdown"
            @click="toggleDropdown"
          >
            <i class="fas fa-cog me-1"></i>More Actions
          </button>
          <ul class="dropdown-menu" aria-labelledby="moreActionsDropdown">
            <li>
              <button class="dropdown-item" @click="showBulkUploadModal = true">
                <i class="fas fa-file-excel me-2 text-primary"></i>Bulk Upload Assets
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="exportAssets">
                <i class="fas fa-download me-2 text-success"></i>Export Assets
              </button>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <button class="dropdown-item" @click="navigateToManageCategories">
                <i class="fas fa-cogs me-2 text-info"></i>Manage Asset Categories
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Asset Management Actions -->
        <div class="d-flex gap-2">
          <button class="btn btn-success btn-modern" @click="navigateToIssueAsset">
            <i class="fas fa-user-plus me-1"></i>Issue Asset
          </button>
          <button class="btn btn-outline-warning btn-modern" @click="navigateToCollectAsset">
            <i class="fas fa-user-minus me-1"></i>Collect Asset
          </button>
          <button class="btn btn-warning btn-modern">
            <i class="fas fa-wrench me-1"></i>Schedule Maintenance
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4 filter-card">
      <div class="card-header">
        <div>
          <h6 class="mb-0"><i class="fas fa-filter me-2"></i>Filter Assets</h6>
          <small class="text-muted">Use filters to find specific assets or view only available assets for assignment</small>
        </div>
      </div>
      <div class="card-body">
        <!-- All Filters -->
        <div class="row">
          <div class="col-12 col-md-3 mb-3">
            <label class="form-label">Search Assets</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
              <input 
                type="text" 
                class="form-control" 
                v-model="searchTerm"
                placeholder="Search by ID, model, serial..."
                @input="debouncedLoadAssets"
              >
            </div>
          </div>
          <div class="col-12 col-md-2 mb-3">
            <label class="form-label">Asset Type</label>
            <select class="form-select" v-model="selectedType" @change="debouncedLoadAssets">
              <option value="">All Types</option>
              <option v-for="type in assetTypes" :key="type.id" :value="type.id.toString()">{{ type.name }}</option>
            </select>
          </div>
          <div class="col-12 col-md-2 mb-3">
            <label class="form-label">Brand</label>
            <select class="form-select" v-model="selectedBrand" @change="debouncedLoadAssets">
              <option value="">All Brands</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id.toString()">{{ brand.name }}</option>
            </select>
          </div>
          <div class="col-12 col-md-2 mb-3">
            <label class="form-label">
              Status 
              <i class="fas fa-info-circle text-muted" title="Available = Ready for assignment, Assigned = Currently with employee"></i>
            </label>
            <select class="form-select" v-model="selectedStatus" @change="debouncedLoadAssets">
              <option value="">All Assets</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_MAINTENANCE">In Maintenance</option>
              <option value="RETIRED">Retired</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
          <div class="col-12 col-md-2 mb-3">
            <label class="form-label">Sort By</label>
            <div class="d-flex gap-2">
              <select class="form-select" v-model="sortBy" @change="loadAssets">
                <option value="assetId">Asset ID</option>
                <option value="status">Status</option>
                <option value="condition">Condition</option>
                <option value="purchaseDate">Purchase Date</option>
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Updated Date</option>
              </select>
              <button class="btn btn-outline-secondary" @click="toggleSortOrder" :title="'Toggle Sort Order'">
                <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']"></i>
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
                  <th>Purchase Date</th>
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
                  <td>{{ formatDate(asset.purchaseDate) }}</td>
                  <td>
                    <div class="btn-group btn-group-sm asset-actions">
                      <button 
                        class="btn btn-outline-primary" 
                        @click="viewAssetDetails(asset)"
                        :title="getViewButtonTitle(asset.status)"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        v-if="asset.status !== 'RETIRED'"
                        class="btn btn-outline-secondary" 
                        title="Edit Asset"
                        @click="editAsset(asset)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        v-if="asset.status === 'AVAILABLE'"
                        class="btn btn-outline-success" 
                        title="Issue Asset"
                        @click="issueAsset(asset)"
                      >
                        <i class="fas fa-user-plus"></i>
                      </button>
                      <button 
                        v-if="asset.status === 'ASSIGNED'"
                        class="btn btn-outline-warning" 
                        title="Collect Asset"
                        @click="collectAsset(asset)"
                      >
                        <i class="fas fa-user-minus"></i>
                      </button>
                      <button 
                        v-if="asset.status !== 'LOST'"
                        class="btn btn-outline-warning" 
                        :title="getMaintenanceButtonTitle(asset.status)"
                      >
                        <i :class="getMaintenanceButtonIcon(asset.status)"></i>
                      </button>
                      <button class="btn btn-outline-info" title="View QR Code">
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
            class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4"
          >
            <div class="card h-100 asset-card-modern">
              <div class="card-body p-3">
                <div class="d-flex align-items-center mb-3">
                  <div 
                    class="rounded-circle d-flex align-items-center justify-content-center me-3" 
                    :style="{ width: '48px', height: '48px', backgroundColor: getAssetTypeColor(asset.type), flexShrink: 0 }"
                  >
                    <i :class="getAssetTypeIcon(asset.type)" class="fa-lg text-white"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h5 class="mb-1 fw-bold" style="color: var(--primary-black);">{{ asset.id }}</h5>
                    <p class="text-muted mb-0 small">{{ asset.type }} • {{ asset.serialNumber }}</p>
                  </div>
                </div>
                
                <div class="mb-3">
                  <span :class="[getStatusBadgeClass(asset.status), 'badge-sm']">
                    {{ getStatusText(asset.status) }}
                  </span>
                </div>
                
                <div class="mb-3">
                  <div class="row g-2">
                    <div class="col-12">
                      <small class="text-muted">Brand/Model</small>
                      <div class="fw-medium text-truncate" style="color: var(--primary-black);">{{ asset.brandModel }}</div>
                    </div>
                    <div class="col-12">
                      <small class="text-muted">Assigned To</small>
                      <div class="text-truncate" style="color: var(--primary-black);">{{ asset.assignedTo || 'Not Assigned' }}</div>
                    </div>
                    <div class="col-12">
                      <small class="text-muted">Purchase Date</small>
                      <div class="small text-truncate" style="color: var(--primary-dark-gray);">{{ formatDate(asset.purchaseDate) }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="asset-actions-footer mt-auto pt-2 border-top">
                  <div class="d-flex justify-content-center gap-2">
                    <button 
                      class="btn btn-action btn-view btn-sm" 
                      @click="viewAssetDetails(asset)"
                      :title="getViewButtonTitle(asset.status)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      v-if="asset.status !== 'RETIRED'"
                      class="btn btn-action btn-edit btn-sm" 
                      title="Edit Asset"
                      @click="editAsset(asset)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-if="asset.status === 'AVAILABLE'"
                      class="btn btn-action btn-assign btn-sm" 
                      title="Issue Asset"
                      @click="issueAsset(asset)"
                    >
                      <i class="fas fa-user-plus"></i>
                    </button>
                    <button 
                      v-if="asset.status === 'ASSIGNED'"
                      class="btn btn-action btn-assign btn-sm" 
                      title="Collect Asset"
                      @click="collectAsset(asset)"
                    >
                      <i class="fas fa-user-minus"></i>
                    </button>
                    <button 
                      v-if="asset.status !== 'LOST'"
                      class="btn btn-action btn-maintenance btn-sm" 
                      :title="getMaintenanceButtonTitle(asset.status)"
                    >
                      <i :class="getMaintenanceButtonIcon(asset.status)"></i>
                    </button>
                    <button class="btn btn-action btn-qr btn-sm" title="View QR Code">
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
      <nav aria-label="Asset pagination">
        <ul class="pagination pagination-modern mb-0">
          <li :class="['page-item', { disabled: currentPage === 1 }]">
            <button class="page-link" @click="previousPage" :disabled="currentPage === 1">
              <i class="fas fa-chevron-left"></i>
            </button>
          </li>
          <li 
            v-for="page in visiblePages" 
            :key="page"
            :class="['page-item', { active: page === currentPage }]"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li :class="['page-item', { disabled: currentPage === totalPages }]">
            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
              <i class="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
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
            <!-- Asset Information -->
            <div class="row g-3">
              <!-- Left Column: Basic Info -->
              <div class="col-md-6">
                <div class="asset-info-section">
                  <h6 class="section-title"><i class="fas fa-info-circle me-2"></i>Basic Information</h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <label class="info-label">Asset ID</label>
                      <div class="info-value fw-bold">{{ selectedAsset.id }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Category</label>
                      <div class="info-value">{{ selectedAsset.category }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Asset Type</label>
                      <div class="info-value fw-bold">{{ selectedAsset.type }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Brand & Model</label>
                      <div class="info-value fw-bold">{{ selectedAsset.brandModel }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Serial Number</label>
                      <div class="info-value font-monospace">{{ selectedAsset.serialNumber }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Status</label>
                      <div class="info-value">
                        <span :class="getStatusBadgeClass(selectedAsset.status)">{{ getStatusText(selectedAsset.status) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Location & Financial -->
              <div class="col-md-6">
                <div class="asset-info-section">
                  <h6 class="section-title"><i class="fas fa-map-marker-alt me-2"></i>Location & Financial</h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <label class="info-label">Current Location</label>
                      <div class="info-value fw-bold">{{ selectedAsset.location }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Condition</label>
                      <div class="info-value">
                        <span :class="getConditionBadgeClass(selectedAsset.condition)">{{ selectedAsset.condition }}</span>
                      </div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Purchase Date</label>
                      <div class="info-value">{{ selectedAsset.purchaseDate ? formatDate(selectedAsset.purchaseDate) : 'Not specified' }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Purchase Cost</label>
                      <div class="info-value">{{ selectedAsset.purchaseCost ? `₹${selectedAsset.purchaseCost.toLocaleString()}` : 'Not specified' }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Vendor</label>
                      <div class="info-value">{{ selectedAsset.vendor }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Warranty Period</label>
                      <div class="info-value">
                        <div v-if="selectedAsset.warrantyStartDate || selectedAsset.warrantyUntil" class="warranty-info">
                          <div v-if="selectedAsset.warrantyStartDate" class="mb-1">
                            <small class="text-muted">Start:</small> {{ formatDate(selectedAsset.warrantyStartDate) }}
                          </div>
                          <div v-if="selectedAsset.warrantyUntil" class="d-flex align-items-center gap-2">
                            <small class="text-muted">End:</small>
                            <span :style="{ color: 'var(--secondary-green)' }">{{ formatDate(selectedAsset.warrantyUntil) }}</span>
                            <div class="warranty-indicator">
                              <div class="progress" style="width: 50px; height: 3px;">
                                <div class="progress-bar" style="width: 95%; background-color: var(--secondary-green);"></div>
                              </div>
                            </div>
                          </div>
                          <small v-if="selectedAsset.warrantyUntil" class="text-muted d-block mt-1">{{ getWarrantyTimeLeft(selectedAsset.warrantyUntil) }}</small>
                        </div>
                        <div v-else class="text-muted">Not specified</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assignment & Notes Row -->
            <div class="row mt-4">
              <div class="col-md-6">
                <div class="asset-info-section">
                  <h6 class="section-title"><i class="fas fa-user me-2"></i>Assignment Information</h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <label class="info-label">Assigned To</label>
                      <div class="info-value">{{ selectedAsset.assignedTo || 'Not Assigned' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div v-if="selectedAsset.notes" class="asset-info-section">
                  <h6 class="section-title"><i class="fas fa-sticky-note me-2"></i>Notes</h6>
                  <div class="notes-content">
                    {{ selectedAsset.notes }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Assignment Status Row - Only show for AVAILABLE and ASSIGNED assets -->
            <div v-if="selectedAsset.status === 'AVAILABLE' || selectedAsset.status === 'ASSIGNED'" class="row mt-4">
              <div class="col-12">
                <div class="assignment-status-compact">
                  <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                    <div class="d-flex align-items-center gap-3">
                      <div class="assignment-icon">
                        <i :class="getAssignmentIcon(selectedAsset.status)" class="fa-2x"></i>
                      </div>
                      <div>
                        <h6 class="mb-1">Assignment Status</h6>
                        <div class="d-flex align-items-center gap-2">
                          <span :class="getStatusBadgeClass(selectedAsset.status)">{{ getAssignmentStatusText(selectedAsset.status) }}</span>
                          <span class="text-muted">{{ getAssignmentStatusDescription(selectedAsset.status) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="qr-code-mini">
                      <i class="fas fa-qrcode fa-2x text-muted" title="QR Code Available"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDetailModal">Close</button>
            <div class="d-flex gap-2">
              <button v-if="selectedAsset.status === 'AVAILABLE'" type="button" class="btn btn-success" @click="issueAsset(selectedAsset!)">
                <i class="fas fa-user-plus me-1"></i>Issue Asset
              </button>
              <button v-if="selectedAsset.status === 'ASSIGNED'" type="button" class="btn btn-pink" @click="collectAsset(selectedAsset!)">
                <i class="fas fa-user-minus me-1"></i>Collect Asset
              </button>
              <button type="button" class="btn btn-warning">
                <i class="fas fa-wrench me-1"></i>Schedule Maintenance
              </button>
              <button type="button" class="btn btn-primary-blue" @click="editAsset(selectedAsset!)" :disabled="!selectedAsset">
                <i class="fas fa-edit me-1"></i>Edit Asset
              </button>
              <button v-if="selectedAsset.status === 'AVAILABLE'" type="button" class="btn btn-danger">
                <i class="fas fa-archive me-1"></i>Retire Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Upload Modal -->
    <div 
      class="modal fade bulk-upload-modal" 
      :class="{ show: showBulkUploadModal }" 
      :style="{ display: showBulkUploadModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-file-excel me-2"></i>Bulk Upload Assets
            </h5>
            <button type="button" class="btn-close" @click="showBulkUploadModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 mb-4">
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>Upload Instructions:</strong>
                  <ul class="mb-0 mt-2">
                    <li>Download the template file and fill in asset details</li>
                    <li>Required fields: Asset ID, Asset Type, Brand, Model, Serial Number</li>
                    <li>Optional fields: Purchase Date, Warranty Date, Location, Notes</li>
                    <li>Supported format: Excel (.xlsx)</li>
                  </ul>
                </div>
              </div>
              
              <div class="col-12 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="mb-0">Step 1: Download Template</h6>
                  <button class="btn btn-outline-success btn-sm" @click="downloadTemplate">
                    <i class="fas fa-download me-1"></i>Download Template
                  </button>
                </div>
              </div>
              
              <div class="col-12 mb-3">
                <h6 class="mb-3">Step 2: Upload Filled Template</h6>
                <div class="upload-area" @click="fileInput?.click()">
                  <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <p class="upload-title">Drag and drop your Excel file here, or click to browse</p>
                    <p class="upload-subtitle">{{ selectedFile ? selectedFile.name : 'No file selected' }}</p>
                    <div class="supported-formats">
                      <span class="format-badge">.xlsx</span>
                      <span class="format-badge">.xls</span>
                    </div>
                  </div>
                  <input 
                    ref="fileInput"
                    type="file" 
                    class="file-input" 
                    accept=".xlsx,.xls"
                    @change="handleFileSelect"
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" @click="showBulkUploadModal = false">Cancel</button>
            <button type="button" class="btn btn-upload-primary" :disabled="!selectedFile" @click="uploadFile">
              <i class="fas fa-upload me-1"></i>Upload Assets
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div 
      v-if="showDetailModal || showBulkUploadModal" 
      class="modal-backdrop fade show"
      @click="closeModals"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { assetService } from '../../services/assetService'
import type { Asset, AssetQueryParams, FilterOptions } from '../../types/asset.types'

const router = useRouter()

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
}

// Reactive data
const currentView = ref<'list' | 'grid'>('list')
const searchTerm = ref('')
const selectedType = ref('')
const selectedBrand = ref('')
const selectedStatus = ref('')
const sortBy = ref('assetId')
const sortAscending = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showDetailModal = ref(false)
const showBulkUploadModal = ref(false)
const selectedAsset = ref<AssetDisplayItem | null>(null)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

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
  return filterOptions.value.assetTypes
})

const brands = computed(() => {
  return filterOptions.value.brands
})

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

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// API Methods
const loadAssets = async () => {
  try {
    isLoading.value = true
    
    const params: AssetQueryParams = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchTerm.value || undefined,
      assetTypeId: selectedType.value ? parseInt(selectedType.value) : undefined,
      brandId: selectedBrand.value ? parseInt(selectedBrand.value) : undefined,
      status: selectedStatus.value as any || undefined,
      sortBy: sortBy.value,
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

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value
  loadAssets() // Reload with new sort order
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedType.value = ''
  selectedBrand.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  loadAssets() // Reload with cleared filters
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadAssets()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadAssets()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadAssets()
  }
}

const viewAssetDetails = (asset: AssetDisplayItem) => {
  selectedAsset.value = asset
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedAsset.value = null
}

const closeModals = () => {
  showDetailModal.value = false
  showBulkUploadModal.value = false
  selectedAsset.value = null
}

const exportAssets = async () => {
  try {
    isLoading.value = true
    // Get all assets for export (without pagination)
    const response = await assetService.getAssets({ limit: 1000 })
    assetService.exportAssetsToCsv(response.data.assets)
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

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  try {
    isLoading.value = true
    const response = await assetService.bulkUploadAssets(selectedFile.value, false)
    
    // Show success message with results
    const { imported, summary } = response.data
    alert(`Upload completed!\nSuccessfully imported: ${imported} assets\nTotal processed: ${summary.totalRows}\nErrors: ${summary.failedImports}`)
    
    // Reload assets to show new data
    await loadAssets()
    
    showBulkUploadModal.value = false
    selectedFile.value = null
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Error uploading file. Please check the format and try again.')
  } finally {
    isLoading.value = false
  }
}

const navigateToRegisterAsset = () => {
  router.push('/app/assets/register')
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

// Manual dropdown toggle as fallback
const toggleDropdown = (event: Event) => {
  const button = event.target as HTMLButtonElement
  const dropdown = button.nextElementSibling as HTMLElement
  
  if (dropdown) {
    const isShown = dropdown.classList.contains('show')
    
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show')
    })
    document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false')
    })
    
    if (!isShown) {
      dropdown.classList.add('show')
      button.setAttribute('aria-expanded', 'true')
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
    'Damaged': 'badge badge-condition-poor'
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getWarrantyTimeLeft = (warrantyDate: string) => {
  const warranty = new Date(warrantyDate)
  const now = new Date()
  const diffTime = warranty.getTime() - now.getTime()
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
  const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
  
  if (diffTime <= 0) return 'Expired'
  return `${diffYears} years ${diffMonths} months remaining`
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
  const unwatchSort = computed(() => sortBy.value)
}

// Lifecycle
onMounted(async () => {
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
})
</script>

<style scoped>
/* Dropdown improvements */
.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1050;
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
  color: #331FEA;
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
</style>
