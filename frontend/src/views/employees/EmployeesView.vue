<template>
  <div style="min-height: 100vh;">
    <!-- Main Content -->
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0" style="color: var(--primary-black);">Employee Management</h2>
          <p class="text-muted mb-0">Manage employee information and asset assignments</p>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <!-- View Toggle (List/Grid) -->
          <div class="btn-group" role="group" aria-label="View toggle">
            <button 
              class="btn btn-outline-secondary btn-modern view-toggle"
              :class="{ active: !isGridView }"
              @click="switchToListView"
            >
              <i class="fas fa-list"></i>
            </button>
            <button 
              class="btn btn-outline-secondary btn-modern view-toggle"
              :class="{ active: isGridView }"
              @click="switchToGridView"
            >
              <i class="fas fa-th-large"></i>
            </button>
          </div>
          
          <!-- Action Buttons -->
          <button class="btn btn-outline-secondary btn-modern" @click="openBulkUploadModal">
            <i class="fas fa-file-excel me-1"></i>Bulk Upload
          </button>
          <router-link to="/app/employees/add" class="btn btn-primary btn-modern">
            <i class="fas fa-user-plus me-1"></i>Add Employee
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4 filter-card">
        <div class="card-header">
          <div>
            <h6 class="mb-0"><i class="fas fa-filter me-2"></i>Filter Employees</h6>
            <small class="text-muted">Search and filter employees by various criteria</small>
          </div>
        </div>
        <div class="card-body">
          <!-- All Filters in One Row -->
          <div class="row">
            <div class="col-12 col-md-5 mb-3">
              <label class="form-label">Search Employees</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="searchTerm"
                  placeholder="Search by name, ID, email..."
                  @input="filterEmployees"
                >
              </div>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Asset Count</label>
              <select class="form-select" v-model="assetCountFilter" @change="filterEmployees">
                <option value="">All</option>
                <option value="0">No Assets</option>
                <option value="1-2">1-2 Assets</option>
                <option value="3+">3+ Assets</option>
              </select>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="statusFilter" @change="filterEmployees">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="col-12 col-md-2 mb-3">
              <label class="form-label">Sort By</label>
              <div class="d-flex gap-2">
                <select class="form-select" v-model="sortBy" @change="sortEmployees">
                  <option value="name">Name</option>
                  <option value="employeeId">Employee ID</option>
                  <option value="email">Email</option>
                  <option value="status">Status</option>
                  <option value="createdAt">Created Date</option>
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

      <!-- Employees Content -->
      <div id="employeesContainer">
        <!-- List View -->
        <div class="card" v-show="!isGridView">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table id="employeesTable" class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Assets</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredEmployees.length === 0">
                    <td colspan="6" class="text-center py-4">
                      <i class="fas fa-search fa-2x text-muted mb-2 d-block"></i>
                      <h6 class="text-muted">No employees found</h6>
                      <p class="text-muted mb-0">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                  <tr 
                    v-for="employee in filteredEmployees" 
                    :key="employee.id"
                  >
                    <td><strong>{{ employee.id }}</strong></td>
                    <td>
                      <div class="d-flex align-items-center">
                        <i :class="employee.iconClass" class="fa-2x me-3"></i>
                        <div>
                          <div class="fw-bold">{{ employee.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td>{{ employee.email }}</td>
                    <td>{{ employee.phone }}</td>
                    <td>
                      <span :class="employee.status === 'active' ? 'badge badge-active' : 'badge badge-inactive'">
                        {{ employee.status === 'active' ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>{{ employee.assetsCount }} Assets</td>
                    <td>
                      <div class="btn-group btn-group-sm employee-actions">
                        <button 
                          class="btn btn-action btn-view" 
                          @click="viewEmployee(employee)"
                          title="View Employee Details"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button 
                          class="btn btn-action btn-edit" 
                          @click="editEmployee(employee)"
                          title="Edit Employee"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          class="btn btn-action btn-assign" 
                          @click="issueAsset(employee)"
                          title="Issue Asset to Employee"
                        >
                          <i class="fas fa-laptop"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Pagination for List View -->
        <div class="d-flex justify-content-between align-items-center mt-4" v-if="!isGridView">
          <div class="text-muted">
            <small>Showing {{ paginationInfo.start }}-{{ paginationInfo.end }} of {{ paginationInfo.total }} employees</small>
          </div>
          <AppPagination :current-page="currentPage" :total-pages="totalPages" @change="changePage" />
        </div>

        <!-- Grid View -->
        <div v-show="isGridView">
          <div class="row">
            <div class="col-12 text-center py-5" v-if="filteredEmployees.length === 0">
              <i class="fas fa-users fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">No employees found</h5>
              <p class="text-muted">Try adjusting your search criteria</p>
            </div>
            <div 
              class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3" 
              v-for="employee in filteredEmployees" 
              :key="employee.id"
            >
              <div class="card h-100 employee-card">
                <div class="card-body d-flex flex-column">
                  <div class="employee-header mb-2">
                    <div class="d-flex justify-content-center mb-3">
                      <i :class="employee.iconClass" class="fa-3x"></i>
                    </div>
                    <div class="text-center mb-3">
                      <h6 class="card-title fw-bold mb-1 text-truncate" style="color: var(--primary-black);">{{ employee.name }}</h6>
                      <p class="text-muted small mb-0">{{ employee.id }}</p>
                    </div>
                  </div>
                  
                  <div class="employee-details flex-grow-1 mb-3">
                    <div class="mb-2">
                      <i class="fas fa-envelope text-muted me-2" style="width: 14px;"></i>
                      <small class="text-truncate">{{ employee.email }}</small>
                    </div>
                    <div class="mb-2">
                      <i class="fas fa-phone text-muted me-2" style="width: 14px;"></i>
                      <small class="text-truncate">{{ employee.phone }}</small>
                    </div>
                    <div class="mb-0">
                      <i class="fas fa-laptop text-muted me-2" style="width: 14px;"></i>
                      <small class="text-truncate">{{ employee.assetsCount }} Assets</small>
                    </div>
                  </div>
                  
                  <div class="employee-actions-footer mt-auto pt-2 border-top">
                    <div class="d-flex justify-content-center gap-2">
                      <button 
                        class="btn btn-sm btn-action btn-view employee-view-btn" 
                        title="View Employee Details" 
                        @click="viewEmployee(employee)"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-action btn-edit employee-edit-btn" 
                        title="Edit Employee" 
                        @click="editEmployee(employee)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-action btn-assign employee-assign-btn" 
                        title="Issue Asset to Employee" 
                        @click="issueAsset(employee)"
                      >
                        <i class="fas fa-laptop"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination for Grid View (bottom only) -->
          <div class="d-flex justify-content-between align-items-center mt-4" v-if="isGridView">
            <div class="text-muted">
              <small>Showing {{ paginationInfo.start }}-{{ paginationInfo.end }} of {{ paginationInfo.total }} employees</small>
            </div>
            <AppPagination :current-page="currentPage" :total-pages="totalPages" @change="changePage" />
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Detail Modal -->
    <div class="modal fade" id="employeeDetailModal" tabindex="-1" v-if="selectedEmployee">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold" style="color: var(--primary-black); font-size: 1.25rem;">
              {{ selectedEmployee ? `Employee Details - ${selectedEmployee.name} (${selectedEmployee.id})` : 'Employee Details' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Employee Information Section -->
            <div class="employee-info-section">
              <h6 class="section-title"><i class="fas fa-user me-2"></i>Employee Information</h6>
              <div class="row g-3 info-grid">
                <div class="col-md-4 info-item">
                  <label class="info-label">Employee ID</label>
                  <div class="info-value font-monospace">{{ selectedEmployee.id }}</div>
                </div>
                <div class="col-md-4 info-item">
                  <label class="info-label">Full Name</label>
                  <div class="info-value fw-bold">{{ selectedEmployee.name }}</div>
                </div>
                <div class="col-md-4 info-item">
                  <label class="info-label">Email Address</label>
                  <div class="info-value">{{ selectedEmployee.email }}</div>
                </div>
                <div class="col-md-4 info-item">
                  <label class="info-label">Phone Number</label>
                  <div class="info-value">{{ selectedEmployee.phone || 'Not specified' }}</div>
                </div>
                <div class="col-md-4 info-item">
                  <label class="info-label">Date of Birth</label>
                  <div class="info-value">{{ selectedEmployee.dateOfBirth || 'Not specified' }}</div>
                </div>
                <div class="col-md-4 info-item d-flex align-items-end">
                  <div>
                    <label class="info-label">Status</label>
                    <div class="info-value">
                      <span :class="['badge', selectedEmployee && selectedEmployee.status === 'active' ? 'badge-active' : 'badge-inactive']">
                        {{ selectedEmployee && selectedEmployee.status === 'active' ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-12 info-item">
                  <label class="info-label">Address</label>
                  <div class="info-value" style="white-space: pre-wrap; overflow-wrap: break-word; max-width: 100%;">{{ selectedEmployee.address || 'Not specified' }}</div>
                </div>
              </div>
            </div>

            <!-- Assigned Assets Section -->
            <div class="assigned-assets-section">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="section-title mb-0"><i class="fas fa-laptop me-2"></i>Assigned Assets</h6>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge badge-count">{{ selectedEmployee.assetsCount }} Assets</span>
                </div>
              </div>
              <div class="assets-list">
                <div class="asset-item" v-for="asset in selectedEmployee.assets" :key="asset.id">
                  <div class="d-flex align-items-center">
                    <div class="asset-icon" :style="{ backgroundColor: asset.iconColor }">
                      <i :class="asset.iconClass"></i>
                    </div>
                    <div class="asset-details flex-grow-1">
                      <div class="asset-name">{{ asset.name }}</div>
                      <div class="asset-meta">{{ asset.type }} • Assigned on {{ asset.assignedDate }}</div>
                    </div>
                    <div class="asset-actions">
                      <button class="btn btn-outline-pink btn-sm" @click="collectAsset(asset)">
                        <i class="fas fa-user-minus me-1"></i>Collect
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="!selectedEmployee.assets || selectedEmployee.assets.length === 0" class="text-center text-muted py-3">
                  <small>No assets assigned.</small>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" @click="issueAsset(selectedEmployee)">
              <i class="fas fa-laptop me-1"></i>Issue Asset
            </button>
            <div class="d-flex gap-2 status-action-slot" :class="{ 'inline-anim': confirmingStatus }">
              <button type="button" class="btn btn-primary-blue" @click="editEmployee(selectedEmployee)">
                <i class="fas fa-edit me-1"></i>Edit Employee
              </button>
              <template v-if="confirmingStatus">
                <button type="button" class="btn btn-cancel-confirm" @click="cancelStatusChange()">
                  <i class="fas fa-times me-1"></i>Cancel
                </button>
                <button type="button" :class="isActivatingTarget ? 'btn btn-confirm-activate' : 'btn btn-confirm-deactivate'" @click="confirmStatusChange()">
                  <i :class="isActivatingTarget ? 'fas fa-check me-1' : 'fas fa-power-off me-1'"></i>{{ isActivatingTarget ? 'Confirm Activate' : 'Confirm Deactivate' }}
                </button>
              </template>
              <template v-else>
                <button type="button" :class="selectedEmployee && selectedEmployee.status === 'active' ? 'btn btn-status-deactivate' : 'btn btn-status-activate'" @click="startStatusToggle()">
                  <i :class="selectedEmployee && selectedEmployee.status === 'active' ? 'fas fa-power-off me-1' : 'fas fa-check-circle me-1'"></i>
                  <span>{{ selectedEmployee && selectedEmployee.status === 'active' ? 'Deactivate' : 'Activate' }}</span>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Upload Employees Modal -->
    <div class="modal fade" id="employeeBulkUploadModal" tabindex="-1" aria-labelledby="employeeBulkUploadModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bulk-upload-modal">
          <div class="modal-header">
            <h5 class="modal-title" id="employeeBulkUploadModalLabel" style="color: var(--text-primary);">
              <i class="fas fa-file-excel me-2" style="color: var(--secondary-purple);"></i>Bulk Upload Employees
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Step 1: Template Download -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0" style="color: var(--primary-black);">
                  <i class="fas fa-download me-2" style="color: var(--secondary-purple);"></i>Step 1: Download Template
                </h6>
                <div class="d-flex gap-2">
                  <button class="btn btn-modern btn-outline-secondary" @click="downloadEmployeeTemplate" data-bs-toggle="tooltip" title="Download the CSV template with correct column format">
                    <i class="fas fa-file-csv me-2"></i>CSV Template
                  </button>
                  <button class="btn btn-modern btn-success" @click="downloadEmployeeTemplateExcel" data-bs-toggle="tooltip" title="Download the Excel (.xlsx) template with correct column format">
                    <i class="fas fa-file-excel me-2"></i>Excel Template
                  </button>
                </div>
              </div>
              <p class="text-muted small mb-0">Download our template to ensure your data is formatted correctly before uploading.</p>
            </div>

            <!-- Required Columns Info -->
            <div class="required-columns-section mb-4">
              <h6 class="mb-3" style="color: var(--text-primary);">
                <i class="fas fa-list-check me-2" style="color: var(--secondary-green);"></i>Required Columns (in this order)
              </h6>
              <div class="columns-sequence columns-excel">
                <div class="excel-cell">First Name</div>
                <div class="excel-cell">Last Name</div>
                <div class="excel-cell">Email</div>
                <div class="excel-cell">Phone</div>
                <div class="excel-cell">Date of Birth (YYYY-MM-DD)</div>
                <div class="excel-cell">Address</div>
              </div>
              <p class="sequence-note mt-2">
                <i class="fas fa-info-circle me-1" style="color: var(--secondary-purple);"></i>
                <small class="text-muted">Make sure your spreadsheet columns follow this exact sequence</small>
              </p>
            </div>

            <!-- Step 2: Upload File -->
            <div class="mb-4">
              <h6 class="mb-3" style="color: var(--text-primary);">
                <i class="fas fa-upload me-2" style="color: var(--secondary-purple);"></i>Step 2: Upload File
              </h6>

              <div class="upload-area" id="empUploadArea" @click="triggerEmpBrowse" @dragover.prevent="onEmpDragOver" @dragleave.prevent="onEmpDragLeave" @drop.prevent="onEmpFileDrop">
                <div class="upload-content">
                  <i class="fas fa-cloud-upload-alt upload-icon"></i>
                  <h6 class="upload-title">Drag & drop your file here</h6>
                  <p class="upload-subtitle">or click to browse</p>
                  <div class="supported-formats">
                    <span class="format-badge">CSV (.csv)</span>
                    <span class="format-badge">Excel (.xlsx)</span>
                  </div>
                </div>
                <input type="file" id="empFile" class="file-input" accept=".csv,.xlsx" aria-label="Choose employee file" @change="onEmpFileSelect">
              </div>

              <!-- File Info -->
              <div class="file-info" v-if="empFileName" style="margin-top: 0.75rem;">
                <div class="d-flex align-items-center justify-content-between p-3" style="background-color: var(--primary-light-gray); border-radius: 0.5rem; border: 1px solid var(--element-gray);">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-file-csv me-2" style="color: var(--secondary-green);"></i>
                    <div>
                      <div class="fw-semibold" style="color: var(--primary-black);">{{ empFileName }}</div>
                      <small class="text-muted">{{ empFileSize }}</small>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-danger" @click="removeEmpFile" data-bs-toggle="tooltip" title="Remove file">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <!-- Validation Messages -->
              <div class="validation-messages mt-3" v-if="empValidationMessages.length">
                <div 
                  v-for="(msg, i) in empValidationMessages" 
                  :key="i" 
                  :class="[msg.toLowerCase().startsWith('no errors') ? 'validation-success' : 'validation-error', 'mb-2']"
                >
                  <i :class="msg.toLowerCase().startsWith('no errors') ? 'fas fa-check-circle me-2' : 'fas fa-exclamation-triangle me-2'"></i>{{ msg }}
                </div>
              </div>

              <!-- Preview Table (first 5 rows) -->
              <div class="mt-3" v-if="empPreview.length">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6 class="mb-0" style="color: var(--primary-black);">Preview (first 5 rows)</h6>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge badge-preview">
                      <i class="fas fa-eye me-1"></i>Showing {{ Math.min(5, empRows.length) }} of {{ empRows.length }}
                    </span>
                  </div>
                </div>
                <div class="table-responsive">
                  <table class="table table-sm mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date of Birth</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(r, idx) in empPreview" :key="idx">
                        <td>{{ r._row }}</td>
                        <td>{{ r.firstName }}</td>
                        <td>{{ r.lastName }}</td>
                        <td>{{ r.email }}</td>
                        <td>{{ r.phone }}</td>
                        <td>{{ r.dateOfBirth }}</td>
                        <td>{{ r.address }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Upload Progress -->
              <div class="upload-progress mt-3" v-if="empUploading">
                <div class="d-flex align-items-center mb-2">
                  <i class="fas fa-spinner fa-spin me-2" style="color: var(--secondary-purple);"></i>
                  <span style="color: var(--primary-black);">Processing your file...</span>
                </div>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" :style="{ width: empProgress + '%' , backgroundColor: 'var(--secondary-purple)'}" :aria-valuenow="empProgress" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern btn-outline-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-modern btn-primary" :disabled="!empRows.length || hasPreviewErrors" @click="uploadEmployees">
              <i class="fas fa-upload me-2"></i>Upload Employees
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
  import { Modal } from 'bootstrap'
  import { employeeService } from '@/services/employeeService'
  import * as XLSX from 'xlsx'
  import AppPagination from '@/components/pagination/AppPagination.vue'
  
  export default {
    name: 'EmployeesView',
    components: { AppPagination },
    data() {
      return {
        isGridView: false,
        searchTerm: '',
        assetCountFilter: '',
        statusFilter: '',
        sortBy: 'name',
        sortAscending: true,
        currentPage: 1,
        itemsPerPage: 10,
        confirmingStatus: false,
        isActivatingTarget: false,
        selectedEmployee: null,
        employees: [],
        totalEmployees: 0,
        serverTotalPages: 1,
        confirmPayload: { current: false },
        // Bulk upload state
        empFileName: '',
        empFileSize: '',
        empValidationMessages: [],
        empRows: [],
        empPreview: [],
        empUploading: false,
        empProgress: 0
      }
    },
    computed: {
      filteredEmployees() {
        // With server-side pagination, we just return the employees from the current page
        return this.employees
      },
      totalPages() {
        return this.serverTotalPages
      },
      allFilteredEmployees() {
        // For server-side pagination, we use the total count from server
        return { length: this.totalEmployees }
      },
      visiblePages() {
        const pages = []
        const total = this.totalPages
        const current = this.currentPage
        
        if (total <= 7) {
          // If 7 or fewer pages, show all
          for (let i = 1; i <= total; i++) {
            pages.push(i)
          }
        } else {
          // Always show first page
          pages.push(1)
          
          if (current <= 4) {
            // Near beginning: 1 2 3 4 5 ... total
            for (let i = 2; i <= 5; i++) {
              pages.push(i)
            }
            pages.push('...')
            pages.push(total)
          } else if (current >= total - 3) {
            // Near end: 1 ... (total-4) (total-3) (total-2) (total-1) total
            pages.push('...')
            for (let i = total - 4; i <= total; i++) {
              pages.push(i)
            }
          } else {
            // Middle: 1 ... (current-1) current (current+1) ... total
            pages.push('...')
            for (let i = current - 1; i <= current + 1; i++) {
              pages.push(i)
            }
            pages.push('...')
            pages.push(total)
          }
        }
        
        return pages
      },
      paginationInfo() {
        const total = this.totalEmployees
        const start = total === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1
        const end = Math.min(this.currentPage * this.itemsPerPage, total)
        
        return { start, end, total }
      },
      hasPreviewErrors() {
        return this.empValidationMessages.some(m => !m.toLowerCase().startsWith('no errors'))
      }
    },
    created() {
      this.loadEmployees()
    },
    methods: {
      showStatusConfirmation({ title, message, details, isActivating, onConfirm, onCancel }) {
        const html = `
          <div class="modal fade" id="empStatusConfirm" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header" style="background-color: var(--primary-light-gray);">
                  <h5 class="modal-title" style="color: var(--primary-black);">${title}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <div class="text-center py-3">
                    <div class="mb-3">
                      <i class="${isActivating ? 'fas fa-check-circle' : 'fas fa-power-off'} fa-3x" style="color: ${isActivating ? 'var(--secondary-green)' : 'var(--secondary-red)'};"></i>
                    </div>
                    <h6 class="mb-3" style="color: var(--primary-black);">${message}</h6>
                    <p class="text-muted mb-0">${details}</p>
                    <div class="mt-3 p-3" style="background-color: var(--primary-light-gray); border-radius: 0.5rem; border-left: 4px solid ${isActivating ? 'var(--secondary-green)' : 'var(--secondary-orange)'};">
                      <small class="text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        You can reverse this action at any time by changing the employee status again.
                      </small>
                    </div>
                  </div>
                </div>
                <div class="modal-footer justify-content-center" style="background-color: var(--primary-light-gray);">
                  <button type="button" class="btn btn-cancel-confirm" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i>Cancel
                  </button>
                  <button type="button" class="${isActivating ? 'btn btn-confirm-activate' : 'btn btn-confirm-deactivate'}" id="empConfirmBtn">
                    <i class="fas ${isActivating ? 'fa-check' : 'fa-power-off'} me-1"></i>${isActivating ? 'Confirm Activate' : 'Confirm Deactivate'}
                  </button>
                </div>
              </div>
            </div>
          </div>`
        const container = document.createElement('div')
        container.innerHTML = html
        document.body.appendChild(container)
        const modalEl = container.querySelector('#empStatusConfirm')
        const m = new Modal(modalEl)
        modalEl.addEventListener('hidden.bs.modal', () => container.remove())
        modalEl.querySelector('.btn-cancel-confirm').addEventListener('click', () => {
          if (onCancel) onCancel()
        })
        modalEl.querySelector('#empConfirmBtn').addEventListener('click', async () => {
          await onConfirm()
          m.hide()
        })
        m.show()
      },
      switchToListView() {
        this.isGridView = false
      },
      switchToGridView() {
        this.isGridView = true
      },
      filterEmployees() {
        this.currentPage = 1
        this.loadEmployees()
      },
      sortEmployees() {
        // Sorting will be implemented server-side in future
        this.loadEmployees()
      },
      toggleSortOrder() {
        this.sortAscending = !this.sortAscending
        this.loadEmployees()
      },
      clearFilters() {
        this.searchTerm = ''
        this.assetCountFilter = ''
        this.statusFilter = ''
        this.currentPage = 1
        this.loadEmployees()
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page
          this.loadEmployees()
        }
      },
      viewEmployee(employee) {
        this.selectedEmployee = employee
        this.$nextTick(() => {
          const modal = new Modal(document.getElementById('employeeDetailModal'))
          modal.show()
        })
      },
      editEmployee(employee) {
        // Navigate to edit employee page
        this.$router.push(`/app/employees/edit/${employee.id}`)
      },
      startStatusToggle() {
        if (!this.selectedEmployee) return
        const current = this.selectedEmployee.status === 'active'
        const action = current ? 'deactivate' : 'activate'
        // Inline confirmation inside the same modal
        this.confirmingStatus = true
        this.isActivatingTarget = !current
        this.confirmPayload = { current }
      },
      async confirmStatusChange() {
        const current = this.confirmPayload.current
        const employeeId = this.selectedEmployee.id
        try {
          await employeeService.updateEmployee(employeeId, { status: current ? 'INACTIVE' : 'ACTIVE' })
          this.selectedEmployee.status = current ? 'inactive' : 'active'
          const row = this.employees.find(e => e.id === employeeId)
          if (row) row.status = this.selectedEmployee.status
        } catch (e) {
          console.warn('Failed to toggle employee status', e)
        } finally {
          this.confirmingStatus = false
        }
      },
      cancelStatusChange() {
        this.confirmingStatus = false
      },
      openBulkUploadModal() {
        // reset state each time
        this.removeEmpFile()
        this.empValidationMessages = []
        this.empUploading = false
        this.empProgress = 0
        const el = document.getElementById('employeeBulkUploadModal')
        if (el) {
          const m = Modal.getInstance(el) || new Modal(el)
          m.show()
        }
      },
      // Bulk upload helpers
      downloadEmployeeTemplate() {
        const csv = 'First Name,Last Name,Email,Phone,Date of Birth,Address\n' +
                    'Aarav,Sharma,aarav.sharma@example.com,+91 9123456789,1992-05-21,123 MG Road Pune\n';
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'employee_upload_template.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
             downloadEmployeeTemplateExcel() {
         try {
           const headers = [
             ["First Name","Last Name","Email","Phone","Date of Birth","Address"],
             ["Aarav","Sharma","aarav.sharma@example.com","+91 9123456789","1992-05-21","123 MG Road Pune"]
           ];
           const worksheet = XLSX.utils.aoa_to_sheet(headers);
           const workbook = XLSX.utils.book_new();
           XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
           // Set column widths for readability
           worksheet['!cols'] = [
             { wch: 12 }, { wch: 12 }, { wch: 28 }, { wch: 16 }, { wch: 18 }, { wch: 24 }
           ];
           const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
           const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
           const link = document.createElement('a');
           link.href = URL.createObjectURL(blob);
           link.download = 'employee_upload_template.xlsx';
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
         } catch (e) {
           console.warn('Excel template generation failed', e)
         }
       },
      onEmpDragOver(e) {
        document.getElementById('empUploadArea')?.classList.add('dragover')
      },
      onEmpDragLeave(e) {
        document.getElementById('empUploadArea')?.classList.remove('dragover')
      },
      onEmpFileDrop(e) {
        const file = e.dataTransfer.files[0]
        if (file) this.handleEmpFile(file)
      },
      triggerEmpBrowse() {
        const input = document.getElementById('empFile')
        input && input.click()
      },
      onEmpFileSelect(e) {
        const file = e.target.files[0]
        if (file) this.handleEmpFile(file)
      },
      removeEmpFile() {
        this.empFileName = ''
        this.empFileSize = ''
        this.empValidationMessages = []
        this.empRows = []
        this.empPreview = []
        const input = document.getElementById('empFile')
        if (input) input.value = ''
        document.getElementById('empUploadArea')?.classList.remove('dragover')
      },
      handleEmpFile(file) {
        this.empValidationMessages = []
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && !file.name.endsWith('.xlsx')) {
          this.empValidationMessages.push('Invalid file type. Please upload a CSV (.csv) or Excel (.xlsx) file.')
          return
        }
        this.empFileName = file.name
        this.empFileSize = (file.size / 1024).toFixed(1) + ' KB'

        const reader = new FileReader()
        if (file.name.endsWith('.xlsx') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const csv = XLSX.utils.sheet_to_csv(worksheet)
            this.parseEmpCsv(csv)
          }
          reader.readAsArrayBuffer(file)
        } else {
          reader.onload = () => {
            const text = reader.result
            this.parseEmpCsv(String(text))
          }
          reader.readAsText(file)
        }
      },
      parseEmpCsv(text) {
        const lines = text.split(/\r?\n/).filter(l => l.trim().length)
        if (lines.length < 2) {
          this.empValidationMessages.push('No data rows found in file.')
          return
        }
        const header = lines[0].split(',').map(h => h.trim().toLowerCase())
        const expected = ['first name','last name','email','phone','date of birth','address']
        if (expected.some((h, i) => (header[i] || '') !== h)) {
          this.empValidationMessages.push('Invalid header order. Expected: First Name, Last Name, Email, Phone, Date of Birth, Address')
        }
        const rows = lines.slice(1).map((line, idx) => {
          const cols = line.split(',')
          const row = {
            _row: idx + 1,
            firstName: (cols[0] || '').trim(),
            lastName: (cols[1] || '').trim(),
            email: (cols[2] || '').trim(),
            phone: (cols[3] || '').trim(),
            dateOfBirth: (cols[4] || '').trim(),
            address: (cols[5] || '').trim(),
            _errors: []
          }
          // Basic validations
          if (!row.firstName) row._errors.push('First Name required')
          if (!row.lastName) row._errors.push('Last Name required')
          if (!row.email || !row.email.includes('@')) row._errors.push('Invalid Email')
          if (row.phone && !row.phone.startsWith('+91')) row._errors.push('Phone should start with +91')
          if (row.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(row.dateOfBirth)) row._errors.push('Date of Birth must be YYYY-MM-DD')
          return row
        })
        this.empRows = rows
        this.empPreview = rows.slice(0, 5)
        // Aggregate all errors across the entire file
        const allErrors = []
        rows.forEach(r => {
          if (r._errors && r._errors.length) {
            allErrors.push(`Row ${r._row}: ${r._errors.join('; ')}`)
          }
        })
        // Reset and show aggregated messages (keep header issues too)
        const headerMsgs = this.empValidationMessages.filter(m => m.toLowerCase().startsWith('invalid header') || m.toLowerCase().startsWith('no data rows'))
        if (allErrors.length) {
          this.empValidationMessages = headerMsgs.concat(allErrors)
        } else {
          this.empValidationMessages = ['No errors found in the file. You can proceed to upload.']
        }
      },
      async uploadEmployees() {
        this.empUploading = true
        this.empProgress = 15
        try {
          // Simulate progressive upload
          const step = () => new Promise(r => setTimeout(r, 250))
          for (let p = 15; p <= 90; p += 15) { await step(); this.empProgress = p }
          // Send valid rows to backend (only rows without errors)
          const valid = this.empRows.filter(r => !r._errors || r._errors.length === 0)
          if (!valid.length) {
            this.empValidationMessages.push('No valid rows to upload. Please fix errors and try again.')
            return
          }
          // Map to API payloads
          const payloads = valid.map(r => ({
            firstName: r.firstName,
            lastName: r.lastName,
            email: r.email,
            phone: r.phone || undefined,
            dateOfBirth: r.dateOfBirth || undefined,
            address: r.address || undefined
          }))
          // Naive sequential create
          for (const data of payloads) {
            await employeeService.createEmployee(data)
          }
          this.empProgress = 100
          // Refresh list
          await this.loadEmployees()
          // Close modal
          const modalEl = document.getElementById('employeeBulkUploadModal')
          if (modalEl) {
            const m = Modal.getInstance(modalEl) || new Modal(modalEl)
            m.hide()
          }
          // Reset
          this.removeEmpFile()
        } catch (e) {
          this.empValidationMessages.push('Upload failed. Please try again.')
        } finally {
          this.empUploading = false
          this.empProgress = 0
        }
      },
      issueAsset(employee) {
        // Navigate to issue asset page
        this.$router.push(`/assets/issue?employeeId=${employee.id}`)
      },
      collectAsset(asset) {
        // Navigate to collect asset page
        this.$router.push(`/assets/collect/${asset.id}`)
      },
      async loadEmployees() {
        try {
          // Load employees with server-side pagination
          const resp = await employeeService.getEmployees({ 
            page: this.currentPage, 
            limit: this.itemsPerPage,
            search: this.searchTerm || undefined,
            status: this.statusFilter ? this.statusFilter.toUpperCase() : undefined,
            assetCountRange: this.assetCountFilter || undefined,
            sortBy: this.sortBy || 'name',
            sortOrder: this.sortAscending ? 'asc' : 'desc'
          })
          
          const list = resp.data.employees || []
          const pagination = resp.data.pagination || {}
          
          // Update pagination info from server
          this.totalEmployees = pagination.totalCount || 0
          this.serverTotalPages = pagination.totalPages || 1
          
          const colorClasses = ['text-primary','text-success','text-info','text-warning','text-secondary','text-danger']
          this.employees = list.map((e, idx) => ({
            id: e.employeeId,
            name: `${e.firstName} ${e.lastName}`.trim(),
            email: e.email,
            phone: e.phone || '',
            assetsCount: e.assignedAssetsCount || 0,
            status: (e.status || 'ACTIVE').toLowerCase(),
            iconClass: `fas fa-user-circle ${colorClasses[idx % colorClasses.length]}`,
            dateOfBirth: e.dateOfBirth,
            address: e.address,
            assets: (e.assignedAssets || []).map(a => ({
              id: a.assetId,
              name: `${a.assetId} - ${a.assetName}`,
              type: 'Asset',
              assignedDate: a.assignedDate,
              iconClass: 'fas fa-laptop',
              iconColor: 'var(--secondary-purple)'
            }))
          }))
        } catch (err) {
          console.warn('Failed to load employees:', err)
          this.employees = []
          this.totalEmployees = 0
          this.serverTotalPages = 1
        }
      }
    }
  }
  </script>
  
<style scoped>
/* Align with global modal styling (see main.css) */
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

/* Employee Info Sections - match vendor modal */
.employee-info-section {
    background-color: var(--primary-white) !important;
    border: 1px solid var(--element-gray) !important;
    border-radius: 0.5rem !important;
    padding: 1.25rem !important;
    margin-bottom: 1.25rem !important;
}
.assigned-assets-section {
    background-color: var(--primary-white) !important;
    border: 1px solid var(--element-gray) !important;
    border-radius: 0.5rem !important;
    padding: 1.25rem !important;
}
.section-title {
    color: var(--primary-black) !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    margin-bottom: 0.75rem !important;
    padding-bottom: 0.5rem !important;
    border-bottom: 1px solid var(--element-gray) !important;
}
.info-grid .info-item { margin-bottom: 0.5rem !important; }
.info-label {
    font-size: 0.8rem !important;
    color: var(--primary-mid-gray) !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    margin-bottom: 0.25rem !important;
    display: block !important;
}
.info-value {
    color: var(--primary-black) !important;
    font-size: 0.9rem !important;
    font-weight: 500 !important;
    line-height: 1.4 !important;
}

/* Assets List Styling (unchanged with minor tweaks) */
.assets-list { display: flex !important; flex-direction: column !important; gap: 0.75rem !important; }
.asset-item { background-color: var(--primary-light-gray) !important; border: 1px solid var(--element-gray) !important; border-radius: 0.5rem !important; padding: 1rem !important; }
.asset-icon { width: 40px !important; height: 40px !important; border-radius: 0.5rem !important; display: flex !important; align-items: center !important; justify-content: center !important; margin-right: 1rem !important; flex-shrink: 0 !important; }
.asset-icon i { color: white !important; font-size: 1.1rem !important; }
.asset-details { min-width: 0 !important; }
.asset-name { color: var(--primary-black) !important; font-size: 0.9rem !important; font-weight: 600 !important; margin-bottom: 0.25rem !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
.asset-meta { color: var(--primary-mid-gray) !important; font-size: 0.75rem !important; font-weight: 500 !important; }

/* Inline status confirmation buttons: fixed height to avoid layout shift */
.btn-cancel-confirm,
.btn-confirm-activate,
.btn-confirm-deactivate {
    padding: 0.5rem 0.75rem !important;
    min-height: 40px !important;
    line-height: 1.25 !important;
    border-radius: 0.5rem !important;
    font-weight: 500 !important;
}
.btn-cancel-confirm {
    background-color: var(--primary-light-gray) !important;
    border: 1px solid var(--element-gray) !important;
    color: var(--primary-dark-gray) !important;
}
.btn-cancel-confirm:hover { background-color: var(--primary-white) !important; border-color: var(--primary-mid-light) !important; color: var(--primary-black) !important; }
.btn-confirm-activate { background-color: var(--secondary-green) !important; border-color: var(--secondary-green) !important; color: white !important; }
.btn-confirm-activate:hover { background-color: #1e9c5a !important; border-color: #1e9c5a !important; }
.btn-confirm-deactivate { background-color: var(--secondary-red) !important; border-color: var(--secondary-red) !important; color: white !important; }
.btn-confirm-deactivate:hover { background-color: #d63447 !important; border-color: #d63447 !important; }

/* Keep actions area tidy */
  .employee-actions-footer { border-top: 1px solid var(--primary-light-gray) !important; background-color: var(--primary-white) !important; }

  /* Prevent modal layout shift when inline confirmation appears */
  .status-action-slot {
      min-height: 42px !important; /* matches button height to reserve space */
      align-items: center !important;
  }
  .inline-anim {
      animation: fadeSlideIn 320ms ease-in-out;
  }
  @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
  }

/* Component-specific styles are already included in main.css */
/* Additional component-specific styles can be added here if needed */

/* Modal Footer Button Styling */
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

.modal-footer .btn-secondary {
    background-color: var(--primary-light-gray) !important;
    border: 1px solid var(--element-gray) !important;
    color: var(--primary-dark-gray) !important;
}

.modal-footer .btn-secondary:hover {
    background-color: var(--primary-white) !important;
    border-color: var(--primary-mid-light) !important;
    color: var(--primary-black) !important;
}

.modal-footer .btn-success {
    background-color: var(--secondary-green) !important;
    border-color: var(--secondary-green) !important;
    color: white !important;
}

.modal-footer .btn-success:hover {
    background-color: #1e9c5a !important;
    border-color: #1e9c5a !important;
    color: white !important;
}

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

/* Compact Employee Modal Styling - legacy rules retained for safety */
.employee-info-section { /* already overridden above */ }
.assigned-assets-section { /* already overridden above */ }
.section-title { /* already overridden above */ }
.info-label { /* already overridden above */ }
.info-value { /* already overridden above */ }

/* Assets list spacing remains the same */
.assets-list { /* already defined above */ }

/* Badge Styling for Employee Modal */
.badge-active {
    background-color: var(--secondary-green) !important;
    color: white !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
    padding: 0.35rem 0.65rem !important;
    border-radius: 0.375rem !important;
}
.badge-inactive {
    background-color: var(--secondary-red) !important;
    color: white !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
    padding: 0.35rem 0.65rem !important;
    border-radius: 0.375rem !important;
}
.btn-status-activate {
    background-color: var(--secondary-green) !important;
    border-color: var(--secondary-green) !important;
    color: white !important;
    border-radius: 0.5rem !important;
    font-weight: 500 !important;
}
.btn-status-deactivate {
    background-color: var(--secondary-red) !important;
    border-color: var(--secondary-red) !important;
    color: white !important;
    border-radius: 0.5rem !important;
    font-weight: 500 !important;
}

  .badge-count {
      background-color: var(--secondary-pink) !important;
      color: white !important;
      font-size: 0.75rem !important;
      font-weight: 500 !important;
      padding: 0.35rem 0.65rem !important;
      border-radius: 0.375rem !important;
  }

.badge-info {
    background-color: var(--secondary-purple) !important;
    color: white !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
    padding: 0.35rem 0.65rem !important;
    border-radius: 0.375rem !important;
}

.badge-preview {
    background-color: var(--secondary-green) !important;
    color: white !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
    padding: 0.35rem 0.65rem !important;
    border-radius: 0.375rem !important;
}

/* Assets List Styling */
.assets-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.75rem !important;
}

.asset-item {
    background-color: var(--primary-light-gray) !important;
    border: 1px solid var(--element-gray) !important;
    border-radius: 0.5rem !important;
    padding: 1rem !important;
}

.asset-icon {
    width: 40px !important;
    height: 40px !important;
    border-radius: 0.5rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-right: 1rem !important;
    flex-shrink: 0 !important;
}

.asset-icon i {
    color: white !important;
    font-size: 1.1rem !important;
}

.asset-details {
    min-width: 0 !important;
}

.asset-name {
    color: var(--primary-black) !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    margin-bottom: 0.25rem !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.asset-meta {
    color: var(--primary-mid-gray) !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
}

.asset-actions {
    display: flex !important;
    align-items: center !important;
    flex-shrink: 0 !important;
}

.asset-actions .btn-sm {
    font-size: 0.75rem !important;
    padding: 0.25rem 0.5rem !important;
    border-radius: 0.25rem !important;
}

.btn-outline-pink {
    background-color: var(--primary-white) !important;
    border: 1px solid var(--secondary-pink) !important;
    color: var(--secondary-pink) !important;
    font-weight: 500 !important;
}

.btn-outline-pink:hover {
    background-color: var(--secondary-pink) !important;
    border-color: var(--secondary-pink) !important;
    color: white !important;
    transform: translateY(-1px) !important;
}

/* Table spacing adjustments */
.table th:first-child, .table td:first-child {
    padding-left: 1.25rem !important;
}

.table th:last-child, .table td:last-child {
    padding-right: 0.75rem !important;
    padding-left: 0.5rem !important;
}

.employee-actions {
    justify-content: flex-start !important;
    gap: 0.25rem !important;
}

.table-responsive {
    margin: 0 !important;
    padding: 0 !important;
}
  /* Fixed column widths for consistent table layout */
  #employeesTable th:nth-child(1),
  #employeesTable td:nth-child(1) { /* Employee ID */
      width: 120px !important;
      min-width: 120px !important;
      max-width: 120px !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      overflow: hidden !important;
  }
  #employeesTable th:nth-child(2),
  #employeesTable td:nth-child(2) { /* Name */
      width: 220px !important;
      min-width: 220px !important;
      max-width: 220px !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      overflow: hidden !important;
  }
  #employeesTable th:nth-child(3),
  #employeesTable td:nth-child(3) { /* Email */
      width: 260px !important;
      min-width: 260px !important;
      max-width: 260px !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      overflow: hidden !important;
  }
  #employeesTable th:nth-child(4),
  #employeesTable td:nth-child(4) { /* Phone */
      width: 160px !important;
      min-width: 160px !important;
      max-width: 160px !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      overflow: hidden !important;
  }
  #employeesTable th:nth-child(5),
  #employeesTable td:nth-child(5) { /* Status */
      width: 110px !important;
      min-width: 110px !important;
      max-width: 110px !important;
  }
  #employeesTable th:nth-child(6),
  #employeesTable td:nth-child(6) { /* Assets */
      width: 110px !important;
      min-width: 110px !important;
      max-width: 110px !important;
      white-space: nowrap !important;
  }
  #employeesTable th:nth-child(7),
  #employeesTable td:nth-child(7) { /* Actions */
      width: 136px !important;
      min-width: 136px !important;
      max-width: 136px !important;
      padding-right: 1.75rem !important; /* extra right gutter to mirror left */
      padding-left: 0.25rem !important;
  }

.employee-actions .btn {
    min-width: 32px !important;
    min-height: 32px !important;
    padding: 0.25rem !important;
}

/* Bulk Upload - Drag and Drop area styled with theme */
.upload-area {
    position: relative !important;
    border: 2px dashed var(--element-gray) !important;
    background-color: var(--primary-light-gray) !important;
    border-radius: 0.75rem !important;
    padding: 1.25rem !important;
    text-align: center !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
}
.upload-area:hover, .upload-area.dragover {
    background-color: var(--primary-white) !important;
    border-color: var(--secondary-purple) !important;
    box-shadow: 0 0 0 0.25rem rgba(51, 31, 234, 0.12) !important;
}
.upload-content .upload-icon {
    font-size: 2rem !important;
    color: var(--secondary-purple) !important;
    margin-bottom: 0.5rem !important;
}
.upload-title {
    color: var(--text-primary) !important;
    margin-bottom: 0.25rem !important;
    font-weight: 600 !important;
}
.upload-subtitle {
    color: var(--primary-mid-gray) !important;
    margin-bottom: 0.5rem !important;
}
.supported-formats .format-badge {
    display: inline-block !important;
    background-color: var(--primary-white) !important;
    border: 1px solid var(--element-gray) !important;
    color: var(--primary-dark-gray) !important;
    border-radius: 0.5rem !important;
    padding: 0.25rem 0.5rem !important;
    margin-right: 0.25rem !important;
    font-size: 0.8rem !important;
    font-weight: 500 !important;
}
.file-input {
    position: absolute !important;
    inset: 0 !important;
    opacity: 0 !important;
    pointer-events: none !important;
}

/* Validation message colors using palette */
.validation-error {
    color: var(--secondary-red) !important;
    background-color: rgba(233, 118, 118, 0.08) !important;
    border: 1px solid rgba(233, 118, 118, 0.25) !important;
    border-radius: 0.5rem !important;
    padding: 0.5rem 0.75rem !important;
    font-weight: 500 !important;
}
.validation-success {
    color: var(--secondary-green) !important;
    background-color: rgba(33, 175, 101, 0.08) !important;
    border: 1px solid rgba(33, 175, 101, 0.25) !important;
    border-radius: 0.5rem !important;
    padding: 0.5rem 0.75rem !important;
    font-weight: 500 !important;
}

/* Required Columns sequence: horizontal boxed items like Excel headers */
.columns-sequence {
    display: flex !important;
    align-items: stretch !important;
    gap: 0.5rem !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    padding: 0.25rem 0 !important;
    scrollbar-width: thin !important;
}

.columns-sequence .column-item {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 150px !important;
    background-color: var(--primary-white) !important;
    border: 1px solid var(--element-gray) !important;
    border-radius: 0.5rem !important;
    padding: 0.75rem !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
}

.columns-sequence .column-number {
    width: 28px !important;
    height: 28px !important;
    border-radius: 999px !important;
    background-color: var(--primary-light-gray) !important;
    border: 1px solid var(--element-gray) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 0.8rem !important;
    font-weight: 600 !important;
    color: var(--primary-black) !important;
    margin-bottom: 0.5rem !important;
  }

.columns-sequence .column-name {
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    color: var(--primary-black) !important;
    text-align: center !important;
    white-space: nowrap !important;
}

.columns-sequence .column-arrow {
    display: none !important;
}

/* Excel-like header cells */
.columns-excel {
    gap: 0 !important;
    border: 1px solid var(--element-gray) !important;
    border-radius: 0.375rem !important;
    overflow: hidden !important;
    width: 100% !important;
}
.columns-excel .excel-cell {
    background-color: #f8fafc !important; /* subtle header gray */
    border-right: 1px solid var(--element-gray) !important;
    padding: 0.5rem 0.75rem !important;
    font-weight: 600 !important;
    color: var(--primary-black) !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    min-width: 120px !important;
    flex: 1 1 0 !important;
    display: flex !important;
    align-items: center !important;
}
.columns-excel .excel-cell:last-child {
    border-right: none !important;
}
/* Give the longer header a bit more space */
.columns-excel .excel-cell:nth-child(5) {
    min-width: 200px !important;
    flex: 2 1 0 !important;
}

/* Align activate/deactivate hover with 'Issue Asset' (simple darken, no extra effects) */
.btn-status-activate:hover,
.btn-confirm-activate:hover {
    background-color: var(--secondary-green) !important;
    border-color: var(--secondary-green) !important;
    filter: brightness(0.92) !important;
    transform: none !important;
    box-shadow: none !important;
}

.btn-status-deactivate:hover,
.btn-confirm-deactivate:hover {
    background-color: var(--secondary-red) !important;
    border-color: var(--secondary-red) !important;
    filter: brightness(0.92) !important;
    transform: none !important;
    box-shadow: none !important;
}

</style>
  