`<template>
  <div class="vendors-page" style="background-color: var(--primary-white);">
    <!-- Main Content -->
    <div class="container-fluid px-3 py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0" style="color: var(--primary-black);">Vendor Management</h2>
          <p class="text-muted mb-0">Manage suppliers and service providers</p>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <!-- View Toggle (List/Grid) -->
          <div class="btn-group" role="group" aria-label="View toggle">
            <button 
              class="btn btn-outline-secondary btn-modern view-toggle" 
              :class="{ active: !isGridView }" 
              data-view="list" 
              @click="toggleView('list')"
            >
              <i class="fas fa-list"></i>
            </button>
            <button 
              class="btn btn-outline-secondary btn-modern view-toggle" 
              :class="{ active: isGridView }" 
              data-view="grid"
              @click="toggleView('grid')"
            >
              <i class="fas fa-th-large"></i>
            </button>
          </div>
          
          <!-- Action Buttons -->
          <button 
            class="btn btn-outline-secondary btn-modern" 
            @click="openBulkUploadModal"
          >
            <i class="fas fa-file-excel me-1"></i>Bulk Upload
          </button>
          <RouterLink to="/app/vendors/add" class="btn btn-primary btn-modern">
            <i class="fas fa-plus me-1"></i>Add Vendor
          </RouterLink>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4 filter-card">
        <div class="card-header">
          <div>
            <h6 class="mb-0"><i class="fas fa-filter me-2"></i>Filter Vendors</h6>
            <small class="text-muted">Search and filter vendors by various criteria</small>
          </div>
        </div>
        <div class="card-body">
          <!-- All Filters -->
          <div class="row">
            <div class="col-12 col-md-5 mb-3">
              <label class="form-label">Search Vendors</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="searchTerm" 
                  placeholder="Search by name, contact, email..."
                  @input="filterVendors"
                >
              </div>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Vendor Type</label>
              <select class="form-select" v-model="filterType" @change="filterVendors">
                <option value="">All Types</option>
                <option value="SUPPLIER">Supplier</option>
                <option value="SERVICE">Service Provider</option>
                <option value="MANUFACTURER">Manufacturer</option>
                <option value="DISTRIBUTOR">Distributor</option>
                <option value="CONTRACTOR">Contractor</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="filterStatus" @change="filterVendors">
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Sort By</label>
              <div class="d-flex gap-2">
                <select class="form-select" v-model="sortBy" @change="fetchVendors">
                  <option value="name">Name</option>
                  <option value="type">Type</option>
                  <option value="status">Status</option>
                </select>
                <button 
                  class="btn btn-outline-secondary" 
                  @click="toggleSortOrder" 
                  title="Toggle Sort Order"
                >
                  <i :class="sortAscending ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up'"></i>
                </button>
              </div>
            </div>
            <div class="col-12 col-md-1 mb-3 d-flex align-items-end">
              <button 
                class="btn btn-outline-secondary w-100" 
                @click="clearFilters" 
                title="Clear Filters"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading vendors...</span>
        </div>
        <p class="mt-3 text-muted">Loading vendors...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
        <button class="btn btn-outline-danger btn-sm ms-3" @click="fetchVendors">
          <i class="fas fa-redo me-1"></i>Retry
        </button>
      </div>

      <!-- Vendors Content -->
      <div id="vendorsContainer">
        <!-- List View (Default) -->
        <div class="card" v-show="!isGridView">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0" id="vendorsTable">
                <thead class="table-light">
                  <tr>
                    <th>Vendor Name</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="vendor in filteredVendors" 
                    :key="vendor.id"
                    :data-name="vendor.name"
                    :data-type="vendor.vendorType"
                    :data-status="vendor.status"
                    :data-search="`${vendor.name} ${vendor.contactPerson} ${vendor.email} ${vendor.phone}`"
                  >
                    <td>
                      <div class="d-flex align-items-center">
                        <i :class="getVendorIcon(vendor.vendorType)" class="fa-2x text-primary me-3"></i>
                        <div>
                          <div class="fw-bold">{{ vendor.name }}</div>
                          <small class="text-muted">{{ getVendorDescription(vendor.vendorType) }}</small>
                        </div>
                      </div>
                    </td>
                    <td>{{ vendor.contactPerson }}</td>
                    <td>{{ vendor.email }}</td>
                    <td>{{ vendor.phone }}</td>
                    <td><span :class="getTypeBadgeClass(vendor.vendorType)">{{ getTypeLabel(vendor.vendorType) }}</span></td>
                    <td><span :class="getStatusBadgeClass(vendor.status)">{{ getStatusLabel(vendor.status) }}</span></td>
                    <td>
                      <div class="btn-group btn-group-sm vendor-actions">
                        <button 
                          class="btn btn-action btn-view" 
                          title="View Details"
                          @click="showVendorDetails(vendor)"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button 
                          class="btn btn-action btn-edit" 
                          title="Edit"
                          @click="editVendor(vendor)"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredVendors.length === 0" id="noResultsRow">
                    <td colspan="7" class="text-center py-4">
                      <i class="fas fa-search fa-2x text-muted mb-2 d-block"></i>
                      <h6 class="text-muted">No vendors found</h6>
                      <p class="text-muted mb-0">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Grid View -->
        <div :class="{ 'd-none': !isGridView }" id="gridView">
          <div class="row" id="gridContainer" v-if="filteredVendors.length > 0">
            <div 
              v-for="vendor in filteredVendors" 
              :key="vendor.id" 
              class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3"
            >
              <div class="card h-100 vendor-card">
                <div class="card-body d-flex flex-column">
                  <div class="vendor-header mb-2">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div class="flex-grow-1 me-2">
                        <h6 class="card-title fw-bold mb-1 text-truncate">{{ vendor.name }}</h6>
                        <p class="text-muted small mb-0">{{ getVendorDescription(vendor.vendorType) }}</p>
                      </div>
                      <div class="d-flex flex-column gap-2 align-items-end">
                        <span :class="getTypeBadgeClass(vendor.vendorType) + ' badge-sm'">{{ getTypeLabel(vendor.vendorType) }}</span>
                        <span :class="getStatusBadgeClass(vendor.status) + ' badge-sm'">{{ getStatusLabel(vendor.status) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="vendor-details flex-grow-1 mb-3">
                    <div class="mb-1">
                      <i class="fas fa-user text-muted me-2" style="width: 14px;"></i>
                      <small class="text-truncate">{{ vendor.contactPerson }}</small>
                    </div>
                    <div class="mb-1">
                      <i class="fas fa-envelope text-muted me-2" style="width: 14px;"></i>
                      <small class="text-truncate">{{ vendor.email }}</small>
                    </div>
                    <div class="mb-0">
                      <i class="fas fa-phone text-muted me-2" style="width: 14px;"></i>
                      <small class="text-truncate">{{ vendor.phone }}</small>
                    </div>
                  </div>
                  
                  <div class="vendor-actions-footer mt-auto pt-2 border-top">
                    <div class="d-flex justify-content-center gap-2">
                      <button 
                        class="btn btn-sm btn-action btn-view vendor-view-btn" 
                        title="View Vendor Details"
                        @click="showVendorDetails(vendor)"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-action btn-edit vendor-edit-btn" 
                        title="Edit Vendor"
                        @click="editVendor(vendor)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Results for Grid View -->
          <div v-else class="col-12 text-center py-5">
            <i class="fas fa-store fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No vendors found</h5>
            <p class="text-muted">Try adjusting your search criteria</p>
          </div>
        </div>
      </div>

      <!-- Shared Pagination for Both Views -->
      <div class="d-flex justify-content-between align-items-center mt-4" v-if="filteredVendors.length > 0">
        <div class="text-muted">
          <small>Showing <span>{{ paginationStart }}</span>-<span>{{ paginationEnd }}</span> of <span>{{ totalVendors }}</span> vendors</small>
        </div>
        <nav aria-label="Vendor pagination">
          <ul class="pagination pagination-modern mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
                <i class="fas fa-chevron-left"></i>
              </a>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page" 
              class="page-item" 
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
                <i class="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Vendor Detail Modal -->
    <div v-if="showVendorModal" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold" style="color: var(--primary-black); font-size: 1.25rem;">
              {{ selectedVendor ? `Vendor Details - ${selectedVendor.name}` : 'Vendor Details' }}
            </h5>
            <button type="button" class="btn-close" @click="closeVendorModal"></button>
          </div>
          <div class="modal-body">
            <!-- Loading State -->
            <div v-if="!selectedVendor" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Loading vendor details...</p>
            </div>

            <!-- Vendor Details -->
            <div v-else class="row g-3">
              <!-- Basic Information Section -->
              <div class="col-md-6">
                <div class="vendor-info-section">
                  <h6 class="section-title"><i class="fas fa-info-circle me-2"></i>Basic Information</h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <label class="info-label">Vendor Name</label>
                      <div class="info-value fw-bold">{{ selectedVendor.name }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Contact Person</label>
                      <div class="info-value">{{ selectedVendor.contactPerson }}</div>
                    </div>
                    <div class="row g-3">
                      <div class="col-6">
                        <div class="info-item">
                          <label class="info-label">Vendor Type</label>
                          <div class="info-value">
                            <span :class="getTypeBadgeClass(selectedVendor.vendorType)">{{ getTypeLabel(selectedVendor.vendorType) }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="info-item">
                          <label class="info-label">Status</label>
                          <div class="info-value">
                            <span :class="getStatusBadgeClass(selectedVendor.status)">{{ getStatusLabel(selectedVendor.status) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Details Section -->
              <div class="col-md-6">
                <div class="vendor-info-section">
                  <h6 class="section-title"><i class="fas fa-address-book me-2"></i>Contact Details</h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <label class="info-label">Email Address</label>
                      <div class="info-value">{{ selectedVendor.email }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Phone Number</label>
                      <div class="info-value">{{ selectedVendor.phone }}</div>
                    </div>
                    <div class="info-item">
                      <label class="info-label">Address</label>
                      <div class="info-value" style="white-space: pre-wrap; overflow-wrap: break-word;">{{ selectedVendor.address }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Legal Details Section -->
              <div class="col-12">
                <div class="vendor-info-section">
                  <h6 class="section-title"><i class="fas fa-file-contract me-2"></i>Legal Details</h6>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="info-item">
                        <label class="info-label">Tax ID</label>
                        <div class="info-value font-monospace">{{ selectedVendor.taxId || 'N/A' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-item">
                        <label class="info-label">PAN Number</label>
                        <div class="info-value font-monospace">{{ selectedVendor.panNumber }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Notes Section -->
              <div class="col-12">
                <div class="vendor-info-section">
                  <h6 class="section-title"><i class="fas fa-sticky-note me-2"></i>Additional Notes</h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-value" style="white-space: pre-wrap; overflow-wrap: break-word;">{{ selectedVendor.notes || 'No additional notes provided.' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeVendorModal">Close</button>
            
            <!-- Asset Management Buttons -->
            <button 
              type="button" 
              class="btn btn-info" 
              :disabled="true"
              title="Feature coming soon"
            >
              <i class="fas fa-boxes me-1"></i>Show Assets
            </button>
            <button 
              type="button" 
              class="btn btn-success" 
              :disabled="true"
              title="Feature coming soon"
            >
              <i class="fas fa-plus me-1"></i>Add New Asset
            </button>
            
            <!-- Vendor Management Buttons -->
            <div class="d-flex gap-2">
              <button 
                type="button" 
                class="btn btn-primary-blue" 
                @click="editVendor(selectedVendor!)"
                :disabled="!selectedVendor"
              >
                <i class="fas fa-edit me-1"></i>Edit Vendor
              </button>
              <button 
                type="button" 
                :class="selectedVendor?.status === VendorStatus.ACTIVE ? 'btn btn-status-deactivate' : 'btn btn-status-activate'"
                @click="showStatusConfirmation(selectedVendor!)"
                :disabled="!selectedVendor"
              >
                <i :class="selectedVendor?.status === VendorStatus.ACTIVE ? 'fas fa-power-off me-1' : 'fas fa-check-circle me-1'"></i>
                {{ selectedVendor?.status === VendorStatus.ACTIVE ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Upload Modal -->
    <div v-if="showBulkUploadModal" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bulk-upload-modal">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black);">
              <i class="fas fa-file-excel me-2" style="color: var(--secondary-purple);"></i>Bulk Upload Vendors
            </h5>
            <button type="button" class="btn-close" @click="closeBulkUploadModal"></button>
          </div>
          <div class="modal-body">
            <!-- Step 1: Instructions and Template -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0" style="color: var(--primary-black);">
                  <i class="fas fa-download me-2" style="color: var(--secondary-purple);"></i>Step 1: Download Template
                </h6>
                <button class="btn btn-template-download" @click="downloadTemplate">
                  <i class="fas fa-download me-2"></i>Download Template
                </button>
              </div>
              <p class="text-muted small mb-0">Download our template to ensure your data is formatted correctly before uploading.</p>
            </div>

            <!-- Required Columns Info -->
            <div class="required-columns-section mb-4">
              <h6 class="mb-3" style="color: var(--primary-black);">
                <i class="fas fa-list-check me-2" style="color: var(--secondary-green);"></i>Required Columns (in this order)
              </h6>
              <div class="columns-sequence">
                <div class="column-item">
                  <div class="column-number">1</div>
                  <div class="column-name">Vendor Name</div>
                </div>
                <div class="column-arrow">
                  <i class="fas fa-arrow-right"></i>
                </div>
                <div class="column-item">
                  <div class="column-number">2</div>
                  <div class="column-name">Contact Person</div>
                </div>
                <div class="column-arrow">
                  <i class="fas fa-arrow-right"></i>
                </div>
                <div class="column-item">
                  <div class="column-number">3</div>
                  <div class="column-name">Email</div>
                </div>
                <div class="column-arrow">
                  <i class="fas fa-arrow-right"></i>
                </div>
                <div class="column-item">
                  <div class="column-number">4</div>
                  <div class="column-name">Phone</div>
                </div>
                <div class="column-arrow">
                  <i class="fas fa-arrow-right"></i>
                </div>
                <div class="column-item">
                  <div class="column-number">5</div>
                  <div class="column-name">Address</div>
                </div>
                <div class="column-arrow">
                  <i class="fas fa-arrow-right"></i>
                </div>
                <div class="column-item">
                  <div class="column-number">6</div>
                  <div class="column-name">Type</div>
                </div>
              </div>
              <p class="sequence-note mt-2">
                <i class="fas fa-info-circle me-1" style="color: var(--secondary-purple);"></i>
                <small class="text-muted">Make sure your spreadsheet columns follow this exact sequence</small>
              </p>
            </div>

            <!-- Step 2: File Upload -->
            <div class="mb-4">
              <h6 class="mb-3" style="color: var(--primary-black);">
                <i class="fas fa-upload me-2" style="color: var(--secondary-purple);"></i>Step 2: Upload File
              </h6>
              
              <!-- Drag and Drop Upload Area -->
              <div 
                class="upload-area" 
                :class="{ dragover: isDragOver }"
                @click="triggerFileInput"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleFileDrop"
              >
                <div class="upload-content">
                  <i class="fas fa-cloud-upload-alt upload-icon"></i>
                  <h6 class="upload-title">Drag & drop your file here</h6>
                  <p class="upload-subtitle">or click to browse</p>
                  <div class="supported-formats">
                    <span class="format-badge">Excel (.xlsx)</span>
                    <span class="format-badge">CSV (.csv)</span>
                  </div>
                </div>
                <input 
                  ref="fileInput" 
                  type="file" 
                  class="file-input" 
                  accept=".xlsx,.xls,.csv" 
                  @change="handleFileSelect"
                >
              </div>

              <!-- File Info Display -->
              <div v-if="selectedFile" class="file-info">
                <div class="d-flex align-items-center justify-content-between p-3" style="background-color: var(--primary-light-gray); border-radius: 0.5rem; border: 1px solid var(--element-gray);">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-file-excel me-2" style="color: var(--secondary-green);"></i>
                    <div>
                      <div class="fw-semibold" style="color: var(--primary-black);">{{ selectedFile.name }}</div>
                      <small class="text-muted">{{ formatFileSize(selectedFile.size) }}</small>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-danger" @click="removeFile">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <!-- Validation Messages -->
              <div v-if="uploadError" class="validation-messages mt-3">
                <div class="validation-error">
                  <i class="fas fa-exclamation-triangle me-2"></i>{{ uploadError }}
                </div>
              </div>
              <div v-if="uploadSuccess" class="validation-messages mt-3">
                <div class="validation-success">
                  <i class="fas fa-check-circle me-2"></i>{{ uploadSuccess }}
                </div>
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="isUploading" class="upload-progress">
              <div class="d-flex align-items-center mb-2">
                <i class="fas fa-spinner fa-spin me-2" style="color: var(--secondary-purple);"></i>
                <span style="color: var(--primary-black);">Processing your file...</span>
              </div>
              <div class="progress">
                <div 
                  class="progress-bar" 
                  role="progressbar" 
                  :style="`width: ${uploadProgress}%; background-color: var(--secondary-purple);`"
                  :aria-valuenow="uploadProgress" 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" @click="closeBulkUploadModal">
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-upload-primary" 
              :disabled="!selectedFile || isUploading"
              @click="uploadVendors"
            >
              <i class="fas fa-upload me-2"></i>Upload Vendors
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Confirmation Modal -->
    <div v-if="showStatusModal" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black);">
              <i class="fas fa-exclamation-triangle me-2" style="color: var(--secondary-orange);"></i>
              <span>Confirm Status Change</span>
            </h5>
            <button type="button" class="btn-close" @click="closeStatusModal"></button>
          </div>
          <div class="modal-body" v-if="statusChangeVendor">
            <div class="text-center py-3">
              <div class="confirmation-icon mb-3">
                <i 
                  :class="statusChangeVendor.status === VendorStatus.ACTIVE ? 'fas fa-power-off fa-3x' : 'fas fa-check-circle fa-3x'"
                  :style="statusChangeVendor.status === VendorStatus.ACTIVE ? 'color: var(--secondary-red);' : 'color: var(--secondary-green);'"
                ></i>
              </div>
              <h6 class="mb-3" style="color: var(--primary-black);">
                Are you sure you want to {{ statusChangeVendor.status === VendorStatus.ACTIVE ? 'deactivate' : 'activate' }} this vendor?
              </h6>
              <p class="text-muted mb-0">
                <strong>{{ statusChangeVendor.name }}</strong> will be {{ statusChangeVendor.status === VendorStatus.ACTIVE ? 'deactivated' : 'activated' }} 
                and will {{ statusChangeVendor.status === VendorStatus.ACTIVE ? 'no longer be' : 'be' }} available for new transactions.
              </p>
              <div class="mt-3 p-3" style="background-color: var(--primary-light-gray); border-radius: 0.5rem; border-left: 4px solid var(--secondary-orange);">
                <small class="text-muted">
                  <i class="fas fa-info-circle me-1"></i>
                  You can reverse this action at any time by changing the vendor status again.
                </small>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-cancel-confirm" @click="closeStatusModal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              :class="statusChangeVendor?.status === VendorStatus.ACTIVE ? 'btn btn-confirm-deactivate' : 'btn btn-confirm-activate'"
              @click="confirmStatusChange"
            >
              <i class="fas fa-check me-1"></i>
              {{ statusChangeVendor?.status === VendorStatus.ACTIVE ? 'Confirm Deactivate' : 'Confirm Activate' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="toast.show" 
      class="toast-container position-fixed top-0 end-0 p-3"
      style="z-index: 1100;"
    >
      <div class="toast show" role="alert">
        <div class="toast-header">
          <i 
            :class="toast.type === 'success' ? 'fas fa-check-circle text-success' : 'fas fa-exclamation-triangle text-danger'"
            class="me-2"
          ></i>
          <strong class="me-auto">{{ toast.type === 'success' ? 'Success' : 'Error' }}</strong>
          <button type="button" class="btn-close" @click="hideToast"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VendorApiService from '../../services/vendorApi'
import { VendorStatus } from '../../types/vendor.types'
import type { Vendor, VendorQueryParams } from '../../types/vendor.types'

const router = useRouter()

// Types
interface Toast {
  show: boolean
  type: 'success' | 'error'
  message: string
}

// Reactive data
const vendors = ref<Vendor[]>([])

// State management
const loading = ref(false)
const error = ref('')
const totalVendors = ref(0)
const totalPages = ref(1)

// No mock data - using real API data only

const searchTerm = ref('')
const filterType = ref('')
const filterStatus = ref('')
const sortBy = ref('name')
const sortAscending = ref(true)
const isGridView = ref(false)

// Modal states
const showVendorModal = ref(false)
const showBulkUploadModal = ref(false)
const showStatusModal = ref(false)
const selectedVendor = ref<Vendor | null>(null)
const statusChangeVendor = ref<Vendor | null>(null)

// Bulk upload states
const selectedFile = ref<File | null>(null)
const isDragOver = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')
const uploadSuccess = ref('')
const fileInput = ref<HTMLInputElement>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Toast
const toast = ref<Toast>({ show: false, type: 'success', message: '' })

// API Methods
const fetchVendors = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const queryParams: VendorQueryParams = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchTerm.value || undefined,
      vendorType: filterType.value || undefined,
      status: (filterStatus.value || undefined) as VendorStatus | undefined,
      sortBy: sortBy.value,
      sortOrder: sortAscending.value ? 'asc' : 'desc'
    }

    const response = await VendorApiService.getVendors(queryParams)
    console.log('API Response:', response)
    console.log('Vendors data:', response.data.vendors)
    vendors.value = response.data.vendors
    totalVendors.value = response.data.pagination.totalCount
    totalPages.value = response.data.pagination.totalPages
    console.log('Updated vendors.value:', vendors.value)
  } catch (err: any) {
    console.error('Error fetching vendors:', err)
    console.error('Error details:', {
      message: err.message,
      response: err.response,
      request: err.request,
      code: err.code
    })
    
    if (err.code === 'ERR_NETWORK') {
      error.value = 'Cannot connect to server. Please ensure the backend is running on http://localhost:3000'
    } else if (err.response?.status === 404) {
      error.value = 'API endpoint not found. Please check if the backend vendors API is available.'
    } else if (err.response?.status === 401) {
      error.value = 'Authentication required. Please login again.'
    } else {
      error.value = `Failed to load vendors: ${err.message || 'Unknown error'}`
    }
    
    // Set empty state on error (but show debug info)
    vendors.value = []
    totalVendors.value = 0
    totalPages.value = 1
    
    // Show detailed error in UI for debugging
    console.log('Setting error state with message:', error.value)
  } finally {
    loading.value = false
  }
}

// Computed properties
const filteredVendors = computed(() => vendors.value)
const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalVendors.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const toggleView = (view: 'list' | 'grid') => {
  isGridView.value = view === 'grid'
}

const filterVendors = () => {
  currentPage.value = 1
  fetchVendors()
}

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value
  fetchVendors()
}

const clearFilters = () => {
  searchTerm.value = ''
  filterType.value = ''
  filterStatus.value = ''
  currentPage.value = 1
  fetchVendors()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchVendors()
  }
}

const getVendorIcon = (type: string) => {
  switch (type) {
    case 'SERVICE':
      return 'fas fa-tools'
    case 'MANUFACTURER':
      return 'fas fa-industry'
    case 'DISTRIBUTOR':
      return 'fas fa-truck'
    case 'CONTRACTOR':
      return 'fas fa-hammer'
    case 'BOTH':
      return 'fas fa-shopping-cart'
    case 'SUPPLIER':
    default:
      return 'fas fa-store'
  }
}

const getVendorDescription = (type: string) => {
  switch (type) {
    case 'SERVICE':
      return 'IT Maintenance & Support'
    case 'MANUFACTURER':
      return 'Manufacturing & Production'
    case 'DISTRIBUTOR':
      return 'Distribution Services'
    case 'CONTRACTOR':
      return 'Contract Services'
    case 'BOTH':
      return 'E-commerce Platform'
    case 'SUPPLIER':
    default:
      return 'Premium Electronics'
  }
}

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case 'SUPPLIER':
      return 'badge badge-supplier'
    case 'SERVICE':
      return 'badge badge-service-provider'
    case 'MANUFACTURER':
      return 'badge badge-manufacturer'
    case 'DISTRIBUTOR':
      return 'badge badge-distributor'
    case 'CONTRACTOR':
      return 'badge badge-contractor'
    case 'BOTH':
      return 'badge badge-both'
    default:
      return 'badge badge-supplier'
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'SUPPLIER':
      return 'Supplier'
    case 'SERVICE':
      return 'Service Provider'
    case 'MANUFACTURER':
      return 'Manufacturer'
    case 'DISTRIBUTOR':
      return 'Distributor'
    case 'CONTRACTOR':
      return 'Contractor'
    case 'BOTH':
      return 'Both'
    default:
      return 'Supplier'
  }
}

const getStatusBadgeClass = (status: VendorStatus) => {
  switch (status) {
    case VendorStatus.ACTIVE:
      return 'badge badge-active'
    case VendorStatus.INACTIVE:
      return 'badge badge-inactive'
    default:
      return 'badge badge-secondary'
  }
}

const getStatusLabel = (status: VendorStatus) => {
  switch (status) {
    case VendorStatus.ACTIVE:
      return 'Active'
    case VendorStatus.INACTIVE:
      return 'Inactive'
    default:
      return 'Unknown'
  }
}

// Modal methods
const showVendorDetails = async (vendor: Vendor) => {
  try {
    // Show loading state
    selectedVendor.value = null
    showVendorModal.value = true
    
    // First, show the vendor data we already have
    console.log('Showing vendor from list:', vendor)
    selectedVendor.value = vendor
    
    // Then try to fetch complete vendor details from API
    console.log('Fetching vendor details for ID:', vendor.id)
    const response = await VendorApiService.getVendorById(vendor.id)
    console.log('Vendor details response:', response)
    console.log('Response data:', response.data)
    console.log('Response structure:', JSON.stringify(response, null, 2))
    
    // Normalize response into a Vendor object
    let vendorData: Vendor | null = null
    const anyResp: any = response
    if (anyResp?.data?.vendor) {
      vendorData = anyResp.data.vendor as Vendor
    } else if (anyResp?.data) {
      vendorData = anyResp.data as Vendor
    } else if (anyResp) {
      vendorData = anyResp as Vendor
    }

    console.log('Final vendor data from API:', vendorData)
    if (vendorData) {
      console.log('Vendor data fields:', {
        name: vendorData.name,
        email: vendorData.email,
        phone: vendorData.phone,
        address: vendorData.address,
        contactPerson: vendorData.contactPerson,
        taxId: vendorData.taxId,
        panNumber: vendorData.panNumber,
        notes: vendorData.notes,
        vendorType: vendorData.vendorType,
        status: vendorData.status
      })
    }

    // Update with API data if available, otherwise keep the list data
    if (vendorData) {
      selectedVendor.value = vendorData
      console.log('Updated selectedVendor.value:', selectedVendor.value)
    }
  } catch (error: any) {
    console.error('Error fetching vendor details:', error)
    console.error('Error details:', error?.response?.data)
    showToast('error', 'Failed to load vendor details from API, showing cached data')
    
    // Keep the vendor data we already have (this should already be set)
    if (!selectedVendor.value) {
      selectedVendor.value = vendor
    }
  }
}

const closeVendorModal = () => {
  showVendorModal.value = false
  selectedVendor.value = null
}

const showStatusConfirmation = (vendor: Vendor) => {
  statusChangeVendor.value = vendor
  showStatusModal.value = true
  showVendorModal.value = false
}

const closeStatusModal = () => {
  showStatusModal.value = false
  statusChangeVendor.value = null
}

const confirmStatusChange = async () => {
  if (statusChangeVendor.value) {
    const newStatus = statusChangeVendor.value.status === VendorStatus.ACTIVE ? VendorStatus.INACTIVE : VendorStatus.ACTIVE
    
    try {
      await updateVendorStatus(statusChangeVendor.value, newStatus)
    } catch (error) {
      console.error('Error updating vendor status:', error)
    }
  }
  closeStatusModal()
}

// Bulk upload methods
const openBulkUploadModal = () => {
  showBulkUploadModal.value = true
  resetUploadState()
}

const closeBulkUploadModal = () => {
  showBulkUploadModal.value = false
  resetUploadState()
}

const resetUploadState = () => {
  selectedFile.value = null
  isDragOver.value = false
  isUploading.value = false
  uploadProgress.value = 0
  uploadError.value = ''
  uploadSuccess.value = ''
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file: File) => {
  uploadError.value = ''
  uploadSuccess.value = ''
  
  // Validate file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Invalid file type. Please upload an Excel (.xlsx) or CSV (.csv) file.'
    return
  }
  
  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    uploadError.value = 'File size too large. Maximum 10MB allowed.'
    return
  }
  
  selectedFile.value = file
  uploadSuccess.value = 'File looks good! Ready to upload.'
}

const removeFile = () => {
  selectedFile.value = null
  uploadError.value = ''
  uploadSuccess.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadTemplate = () => {
  // Create a simple CSV template
  const csvContent = "Vendor Name,Contact Person,Email,Phone,Address,Type\n" +
                    "Example Vendor,John Doe,john@example.com,+91 9876543210,123 Main St,SUPPLIER\n" +
                    "Sample Service Provider,Jane Smith,jane@sample.com,+91 8765432109,456 Oak Ave,SERVICE"
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'vendor_upload_template.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  showToast('success', 'Template downloaded successfully!')
}

const uploadVendors = async () => {
  if (!selectedFile.value) return
  
  isUploading.value = true
  uploadProgress.value = 0
  uploadError.value = ''
  uploadSuccess.value = ''
  
  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)
    
    const response = await VendorApiService.bulkUploadVendors(selectedFile.value, false)
    
    clearInterval(progressInterval)
    uploadProgress.value = 100
    
    setTimeout(() => {
      isUploading.value = false
      showToast('success', `Successfully uploaded ${response.data.imported} vendors!`)
      
      if (response.data.errors.length > 0) {
        console.warn('Upload errors:', response.data.errors)
        showToast('error', `${response.data.errors.length} rows had errors. Check console for details.`)
      }
      
      // Refresh vendor list
      fetchVendors()
      
      // Close modal after delay
      setTimeout(() => {
        closeBulkUploadModal()
      }, 2000)
    }, 500)
    
  } catch (error: any) {
    console.error('Error uploading vendors:', error)
    isUploading.value = false
    uploadProgress.value = 0
    
    let errorMessage = 'Failed to upload vendors. Please try again.'
    
    if (error.response?.status === 400) {
      errorMessage = 'Invalid file format or data. Please check your file and try again.'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    
    uploadError.value = errorMessage
  }
}

const handleUploadSuccess = () => {
  showToast('success', 'Vendors uploaded successfully!')
}

// Toast methods
const showToast = (type: 'success' | 'error', message: string) => {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    hideToast()
  }, 5000)
}

const hideToast = () => {
  toast.value.show = false
}

// Action methods

const editVendor = (vendor: Vendor) => {
  // Navigate to edit vendor page (can be implemented later)
  router.push(`/app/vendors/edit/${vendor.id}`)
  closeVendorModal()
}


const updateVendorStatus = async (vendor: Vendor, newStatus: VendorStatus) => {
  try {
    await VendorApiService.updateVendorStatus(vendor.id, { status: newStatus })
    showToast('success', `${vendor.name} status updated to ${getStatusLabel(newStatus)}`)
    fetchVendors() // Refresh the list
    closeStatusModal()
  } catch (error: any) {
    console.error('Error updating vendor status:', error)
    let errorMessage = 'Failed to update vendor status. Please try again.'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    
    showToast('error', errorMessage)
  }
}

// Initialize
onMounted(() => {
  fetchVendors()
})
</script>

<style scoped>
/* Modern Button Styling - Unified Compact Design */
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

/* Add Vendor - Purple (Primary Action) */
.btn-modern.btn-primary {
  background-color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
  color: white !important;
}

.btn-modern.btn-primary:hover {
  background-color: #2415c7 !important;
  border-color: #2415c7 !important;
  color: white !important;
}

/* Bulk Upload - Secondary */
.btn-modern.btn-outline-secondary {
  background-color: var(--primary-light-gray) !important;
  border-color: var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
}

.btn-modern.btn-outline-secondary:hover {
  background-color: var(--primary-white) !important;
  border-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
}

/* Custom Badge Styles - Updated Color Palette - Matching main.css */
.badge.badge-supplier {
  background-color: var(--secondary-purple) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-service-provider {
  background-color: var(--secondary-pink) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-service {
  background-color: var(--secondary-orange) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-manufacturer {
  background-color: var(--secondary-blue) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-distributor {
  background-color: var(--secondary-green) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-contractor {
  background-color: var(--secondary-red) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-both {
  background-color: var(--primary-dark-gray) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-active {
  background-color: var(--secondary-green) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge.badge-inactive {
  background-color: var(--secondary-red) !important;
  color: white !important;
  border: none !important;
  font-size: 0.75rem !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

/* Small badge variant */
.badge.badge-sm {
  font-size: 0.65rem !important;
  padding: 0.25rem 0.5rem !important;
}

/* New Action Button Styles - Updated Design */
.btn-action {
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

.btn-action:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12) !important;
  background-color: var(--primary-white) !important;
  border-color: var(--primary-mid-light) !important;
}

/* Specific action button hover colors */
.btn-view:hover {
  color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
}

.btn-edit:hover {
  color: var(--secondary-orange) !important;
  border-color: var(--secondary-orange) !important;
}

.btn-delete:hover {
  color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
}

/* Card improvements */
.vendor-card {
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  transition: all 0.2s ease !important;
}

.vendor-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-1px) !important;
}

.vendor-actions-footer {
  border-top: 1px solid var(--primary-light-gray) !important;
  background-color: var(--primary-white) !important;
}

/* Vendor action buttons - Updated Design */
.vendor-actions .btn {
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

.vendor-actions .btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12) !important;
  background-color: var(--primary-white) !important;
  border-color: var(--primary-mid-light) !important;
}

/* Specific vendor action button hover colors */
.vendor-actions .btn-view:hover {
  color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
}

.vendor-actions .btn-edit:hover {
  color: var(--secondary-orange) !important;
  border-color: var(--secondary-orange) !important;
}

/* Filter card styling */
.filter-card {
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

/* Table responsive container - no padding to avoid white border */
.table-responsive {
  margin: 0 !important;
  padding: 0 !important;
}

/* Table cell padding adjustments for balanced spacing */
.table td, .table th {
  padding: 0.75rem !important;
}

/* First column padding adjustments */
.table td:first-child, .table th:first-child {
  padding-left: 1.5rem !important;
}

/* Actions column (last column) padding adjustments */
.table td:last-child, .table th:last-child {
  padding-right: 1.5rem !important;
  text-align: center !important;
}

/* Vendor actions button group spacing */
.vendor-actions {
  justify-content: center !important;
  gap: 0.25rem !important;
}

.vendor-actions .btn {
  padding: 0.25rem 0.5rem !important;
  min-width: 32px !important;
  min-height: 32px !important;
}

/* View toggle buttons */
.view-toggle {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
}

.view-toggle.active {
  background-color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
  color: white !important;
}

.view-toggle:hover:not(.active) {
  background-color: var(--primary-white) !important;
  border-color: var(--primary-mid-light) !important;
}

/* Modern Pagination Styles */
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

.pagination-modern .page-item.disabled .page-link {
  background-color: var(--primary-light-gray) !important;
  border-color: var(--element-gray) !important;
  color: var(--primary-mid-gray) !important;
  cursor: not-allowed !important;
}

/* Toast Notification Styles */
.toast-container {
  z-index: 1100;
}

.toast {
  background-color: var(--primary-white);
  border: 1px solid var(--element-gray);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-header {
  background-color: var(--primary-light-gray);
  border-bottom: 1px solid var(--element-gray);
  border-radius: 0.5rem 0.5rem 0 0;
}

.toast-body {
  color: var(--primary-black);
}

/* Vendor Detail Modal Styling - Consistent with prototype */
.vendor-info-section {
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  padding: 1.25rem !important;
  margin-bottom: 0.5rem !important;
}

.vendor-info-section .section-title {
  color: var(--primary-black) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.75rem !important;
  padding-bottom: 0.5rem !important;
  border-bottom: 1px solid var(--element-gray) !important;
}

.vendor-info-section .info-label {
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  color: var(--primary-dark-gray) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  margin-bottom: 0.25rem !important;
}

.vendor-info-section .info-value {
  font-size: 0.9rem !important;
  color: var(--primary-black) !important;
  font-weight: 500 !important;
}

.vendor-info-section .info-item {
  margin-bottom: 1rem !important;
}

.vendor-info-section .info-item:last-child {
  margin-bottom: 0 !important;
}

/* Modal styling */
.modal-content {
  border: none !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  border-radius: 0.75rem !important;
}

.modal-header {
  background-color: var(--primary-light-gray) !important;
  border-bottom: 1px solid var(--element-gray) !important;
  border-radius: 0.75rem 0.75rem 0 0 !important;
}

.modal-body {
  background-color: var(--primary-white) !important;
  padding: 2rem !important;
}

.modal-footer {
  background-color: var(--primary-light-gray) !important;
  border-top: 1px solid var(--element-gray) !important;
  border-radius: 0 0 0.75rem 0.75rem !important;
  padding: 1.25rem 2rem !important;
}

/* Button Styling for Vendor Modal */
.modal-footer .btn-primary-blue {
  background-color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
  color: white !important;
}

.modal-footer .btn-primary-blue:hover {
  background-color: #2415c7 !important;
  border-color: #2415c7 !important;
  color: white !important;
}

.modal-footer .btn-secondary {
  background-color: var(--primary-light-gray) !important;
  border-color: var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
}

.modal-footer .btn-secondary:hover {
  background-color: var(--primary-white) !important;
  border-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
}

/* Status Toggle Buttons */
.btn-status-activate {
  background-color: var(--secondary-green) !important;
  border-color: var(--secondary-green) !important;
  color: white !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.btn-status-activate:hover {
  background-color: #1e9c5a !important;
  border-color: #1e9c5a !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(33, 175, 101, 0.25) !important;
}

.btn-status-deactivate {
  background-color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
  color: white !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.btn-status-deactivate:hover {
  background-color: #d63447 !important;
  border-color: #d63447 !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(233, 118, 118, 0.25) !important;
}

/* Confirmation Modal Buttons */
.btn-cancel-confirm {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  padding: 0.625rem 1.5rem !important;
}

.btn-cancel-confirm:hover {
  background-color: var(--element-gray) !important;
  border-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
  transform: translateY(-1px) !important;
}

.btn-confirm-activate {
  background-color: var(--secondary-green) !important;
  border-color: var(--secondary-green) !important;
  color: white !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  padding: 0.625rem 1.5rem !important;
  box-shadow: 0 2px 8px rgba(33, 175, 101, 0.25) !important;
}

.btn-confirm-activate:hover {
  background-color: #1e9c5a !important;
  border-color: #1e9c5a !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(33, 175, 101, 0.35) !important;
}

.btn-confirm-deactivate {
  background-color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
  color: white !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  padding: 0.625rem 1.5rem !important;
  box-shadow: 0 2px 8px rgba(233, 118, 118, 0.25) !important;
}

.btn-confirm-deactivate:hover {
  background-color: #d63447 !important;
  border-color: #d63447 !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(233, 118, 118, 0.35) !important;
}

.confirmation-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Bulk Upload Modal Styles */
.bulk-upload-modal .modal-header {
  background-color: var(--primary-light-gray) !important;
  border-bottom: 1px solid var(--element-gray) !important;
}

.bulk-upload-modal .modal-body {
  background-color: var(--primary-white) !important;
}

.bulk-upload-modal .modal-footer {
  background-color: var(--primary-light-gray) !important;
  border-top: 1px solid var(--element-gray) !important;
}

/* Template Download Button */
.btn-template-download {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  color: var(--secondary-purple) !important;
  border-radius: 0.5rem !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.btn-template-download:hover {
  background-color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 8px rgba(51, 31, 234, 0.15) !important;
}

/* Required Columns Section */
.required-columns-section {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
}

/* Horizontal Column Sequence */
.columns-sequence {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-wrap: wrap !important;
  gap: 0.75rem !important;
  padding: 1rem 0 !important;
}

.column-item {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
  min-width: 80px !important;
}

.column-number {
  width: 28px !important;
  height: 28px !important;
  border-radius: 50% !important;
  background-color: var(--secondary-purple) !important;
  color: white !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.5rem !important;
}

.column-name {
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  color: var(--primary-black) !important;
  line-height: 1.2 !important;
}

.column-arrow {
  color: var(--primary-mid-light) !important;
  font-size: 0.875rem !important;
  margin: 0 0.25rem !important;
}

.sequence-note {
  text-align: center !important;
  margin-bottom: 0 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .columns-sequence {
    flex-direction: column !important;
    gap: 1rem !important;
  }
  
  .column-arrow {
    transform: rotate(90deg) !important;
    margin: 0.25rem 0 !important;
  }
  
  .column-item {
    min-width: 120px !important;
  }
}

/* Upload Area */
.upload-area {
  border: 2px dashed var(--primary-mid-light) !important;
  border-radius: 0.75rem !important;
  padding: 2rem !important;
  text-align: center !important;
  background-color: var(--primary-white) !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  position: relative !important;
}

.upload-area:hover {
  border-color: var(--secondary-purple) !important;
  background-color: var(--primary-light-gray) !important;
}

.upload-area.dragover {
  border-color: var(--secondary-purple) !important;
  background-color: rgba(51, 31, 234, 0.05) !important;
}

.upload-content {
  pointer-events: none !important;
}

.upload-icon {
  font-size: 2.5rem !important;
  color: var(--primary-mid-light) !important;
  margin-bottom: 1rem !important;
}

.upload-area:hover .upload-icon {
  color: var(--secondary-purple) !important;
}

.upload-title {
  color: var(--primary-black) !important;
  font-weight: 600 !important;
  margin-bottom: 0.5rem !important;
}

.upload-subtitle {
  color: var(--primary-dark-gray) !important;
  font-size: 0.875rem !important;
  margin-bottom: 1rem !important;
}

.supported-formats {
  display: flex !important;
  justify-content: center !important;
  gap: 0.5rem !important;
}

.format-badge {
  background-color: var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.375rem !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
}

.file-input {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  opacity: 0 !important;
  cursor: pointer !important;
}

/* Action Buttons */
.btn-cancel {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.btn-cancel:hover {
  background-color: var(--element-gray) !important;
  border-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
}

.btn-upload-primary {
  background-color: var(--secondary-purple) !important;
  border: 1px solid var(--secondary-purple) !important;
  color: white !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 8px rgba(51, 31, 234, 0.15) !important;
}

.btn-upload-primary:hover:not(:disabled) {
  background-color: #2415c7 !important;
  border-color: #2415c7 !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(51, 31, 234, 0.25) !important;
}

.btn-upload-primary:disabled {
  background-color: var(--element-gray) !important;
  border-color: var(--element-gray) !important;
  color: var(--primary-mid-gray) !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}

/* Validation Messages */
.validation-error {
  background-color: rgba(233, 118, 118, 0.1) !important;
  border: 1px solid var(--secondary-red) !important;
  color: var(--secondary-red) !important;
  padding: 0.75rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
}

.validation-success {
  background-color: rgba(33, 175, 101, 0.1) !important;
  border: 1px solid var(--secondary-green) !important;
  color: var(--secondary-green) !important;
  padding: 0.75rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
}

/* Upload Progress */
.upload-progress {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  padding: 1rem !important;
}

.progress {
  height: 0.5rem !important;
  background-color: var(--element-gray) !important;
  border-radius: 0.25rem !important;
}

/* Disabled Button Styles */
.btn:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

.btn.btn-info:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: white !important;
}

.btn.btn-success:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: white !important;
}

/* Modal Footer Button Spacing */
.modal-footer .btn {
  margin-left: 0.5rem !important;
}

.modal-footer .btn:first-child {
  margin-left: 0 !important;
}
</style> 