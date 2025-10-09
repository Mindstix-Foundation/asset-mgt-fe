<template>
  <div style="min-height: 100vh;">
    <!-- Main Content -->
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row align-items-center mb-4">
        <!-- Title Section -->
        <div class="col-12 col-sm-12 col-md-6 col-lg-6 mb-3 mb-lg-0">
          <h2 class="mb-0 single-line">Employee Management</h2>
          <p class="text-muted mb-0 single-line">Manage employee information and asset assignments</p>
        </div>
        
        <!-- Actions Section -->
        <div class="col-12 col-md-6 col-lg-6">
          <!-- Small screens: Custom layout -->
          <div class="d-md-none">
            <div class="row g-2 mb-2">
              <!-- Row 1: View Toggle + Bulk Upload -->
              <div class="col-6">
                <div class="d-flex gap-1 w-100 justify-content-center">
                  <!-- View Toggle -->
                  <fieldset class="btn-group flex-shrink-0">
                    <legend class="visually-hidden">View toggle</legend>
                    <button 
                      :class="['btn', 'view-toggle', { active: !isGridView }]"
                      @click="switchToListView"
                      style="min-width: 35px; padding: 0.375rem 0.5rem;"
                    >
                      <i class="fas fa-list"></i>
                    </button>
                    <button 
                      :class="['btn', 'view-toggle', { active: isGridView }]"
                      @click="switchToGridView"
                      style="min-width: 35px; padding: 0.375rem 0.5rem;"
                    >
                      <i class="fas fa-th-large"></i>
                    </button>
                  </fieldset>
                </div>
              </div>
              <div class="col-6">
              <!-- More Actions Dropdown -->
              <div class="dropdown">
                <button 
                  class="btn btn-gray dropdown-toggle w-100" 
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
                      <i class="fas fa-file-excel me-2 text-primary"></i>Bulk Upload
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item" @click="() => { exportEmployees(); closeDropdown('moreActionsDropdownSm'); }">
                      <i class="fas fa-download me-2 text-success"></i>Export Employees
                    </button>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button class="dropdown-item" @click="() => { openManageEmployeesModal(); closeDropdown('moreActionsDropdownSm'); }">
                      <i class="fas fa-cogs me-2 text-info"></i>Manage Employees
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            </div>
            
            <div class="row g-2">
              <!-- Row 2: Add Employee -->
              <div class="col-12">
                <router-link to="/app/employees/add" class="btn btn-purple w-100">
                  <i class="fas fa-user-plus me-1"></i>Add Employee
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Medium+ screens: Original layout -->
          <div class="d-none d-md-block">
            <div class="row g-2 justify-content-md-end">
              <!-- View Toggle + Actions -->
              <div class="col-md-12 col-lg-auto">
                <div class="d-flex gap-2 w-100">
                  <!-- View Toggle -->
                  <fieldset class="btn-group flex-shrink-0">
                    <legend class="visually-hidden">View toggle</legend>
                    <button 
                      :class="['btn', 'view-toggle', { active: !isGridView }]"
                      @click="switchToListView"
                      style="min-width: 40px;"
                    >
                      <i class="fas fa-list"></i>
                    </button>
                    <button 
                      :class="['btn', 'view-toggle', { active: isGridView }]"
                      @click="switchToGridView"
                      style="min-width: 40px;"
                    >
                      <i class="fas fa-th-large"></i>
                    </button>
                  </fieldset>
                  
                  <!-- More Actions Dropdown -->
                  <div class="dropdown flex-fill">
                    <button 
                      class="btn btn-gray dropdown-toggle w-100" 
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
                          <i class="fas fa-file-excel me-2 text-primary"></i>Bulk Upload
                        </button>
                      </li>
                      <li>
                        <button class="dropdown-item" @click="() => { exportEmployees(); closeDropdown('moreActionsDropdown'); }">
                          <i class="fas fa-download me-2 text-success"></i>Export Employees
                        </button>
                      </li>
                      <li><hr class="dropdown-divider"></li>
                      <li>
                        <button class="dropdown-item" @click="() => { openManageEmployeesModal(); closeDropdown('moreActionsDropdown'); }">
                          <i class="fas fa-cogs me-2 text-info"></i>Manage Employees
                        </button>
                      </li>
                    </ul>
                  </div>
                  
                  <router-link to="/app/employees/add" class="btn btn-purple flex-fill">
                    <i class="fas fa-user-plus me-1"></i>Add Employee
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Sort Bar -->
      <div class="mb-4">
        <div class="row align-items-end">
          <!-- Search Employees -->
          <div class="col-12 col-lg-7 mb-3">
            <label class="form-label" for="employees-search">Search Employees</label>
            <div class="input-group">
              <input 
                id="employees-search"
                type="text" 
                class="form-control search-with-icon" 
                v-model="searchTerm"
                placeholder="Search by name, ID, email..."
                @input="filterEmployees"
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
                <button class="btn btn-gray w-100 d-flex align-items-center justify-content-center" @click="toggleSortOrder" :title="'Toggle Sort Order'" style="min-width: 40px; height: 38px;">
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
                <!-- Asset Count Filter -->
                <div class="flex-fill">
                  <SearchableDropdown
                    id="asset-count-filter"
                    label="Asset Count"
                    placeholder="Search asset counts..."
                    :items="assetCountOptions"
                    v-model="selectedAssetCount"
                    @change="onAssetCountChange"
                  />
                </div>
                
                <!-- Status Filter -->
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
                
                <!-- Clear Button: responsive width -->
                <div class="filter-clear-button-container">
                  <div class="d-flex align-items-end h-100">
                    <button class="btn btn-gray" @click="clearFilters" title="Clear All Filters">
                      <i class="fas fa-times me-1"></i>Clear
                    </button>
                  </div>
                </div>
              </div>
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
                    <th>Assets</th>
                    <th>Status</th>
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
                    <td>{{ employee.assetsCount }} Assets</td>
                    <td>
                      <span :class="getStatusBadgeClass(employee.status)">
                        {{ employee.status === 'active' ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm employee-actions">
                        <button 
                          class="btn btn-action btn-brown" 
                          @click="viewEmployee(employee)"
                          title="View Employee Details"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button 
                          class="btn btn-action btn-purple" 
                          @click="editEmployee(employee)"
                          title="Edit Employee"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          class="btn btn-action btn-green" 
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
          <AppPagination 
            :current-page="currentPage" 
            :total-pages="totalPages" 
            :start="paginationInfo.start"
            :end="paginationInfo.end"
            :total="paginationInfo.total"
            item-name="employees"
            @change="changePage" 
          />
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
              class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4" 
              v-for="employee in filteredEmployees" 
              :key="employee.id"
            >
              <div class="card h-100 employee-card">
                <div class="card-body p-2">
                  <!-- Header with icon, employee name and status -->
                  <div class="d-flex align-items-center mb-2">
                    <div 
                      class="rounded-circle d-flex align-items-center justify-content-center me-2" 
                      :style="{ width: '36px', height: '36px', backgroundColor: getEmployeeIconColor(employee.id), flexShrink: 0 }"
                    >
                      <i class="fas fa-user text-white" style="font-size: 0.9rem; color: white !important;"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0 fw-bold text-truncate" style="color: var(--primary-black); font-size: 0.9rem;">{{ employee.name }}</h6>
                      <small class="text-muted text-truncate d-block">{{ employee.id }}</small>
                    </div>
                    <span :class="[getStatusBadgeClass(employee.status), 'badge-sm']" style="font-size: 0.7rem;">
                      {{ employee.status === 'active' ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  
                  <!-- Employee Details Grid - 2 columns for better space usage -->
                  <div class="mb-2">
                    <div class="row g-1">
                      <div class="col-6">
                        <small class="text-muted d-block" style="font-size: 0.7rem;">Email</small>
                        <div class="fw-medium text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ employee.email }}</div>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block" style="font-size: 0.7rem;">Phone</small>
                        <div class="text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ employee.phone || 'Not provided' }}</div>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block" style="font-size: 0.7rem;">Assets</small>
                        <div class="text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ employee.assetsCount }} Assigned</div>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block" style="font-size: 0.7rem;">Status</small>
                        <div class="text-truncate" style="color: var(--primary-dark-gray); font-size: 0.8rem;">{{ employee.status === 'active' ? 'Currently Active' : 'Inactive' }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="employee-actions-footer mt-auto pt-2 border-top">
                    <div class="d-flex justify-content-center gap-1">
                      <button 
                        class="btn btn-action btn-brown btn-sm" 
                        @click="viewEmployee(employee)"
                        title="View Employee Details"
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-action btn-purple btn-sm" 
                        title="Edit Employee"
                        @click="editEmployee(employee)"
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-action btn-green btn-sm" 
                        title="Issue Asset to Employee"
                        @click="issueAsset(employee)"
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
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
            <AppPagination 
              :current-page="currentPage" 
              :total-pages="totalPages" 
              :start="paginationInfo.start"
              :end="paginationInfo.end"
              :total="paginationInfo.total"
              item-name="employees"
              @change="changePage" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Detail Modal (aligned to AssetsView modal design) -->
    <div class="modal employee-modal" id="employeeDetailModal" tabindex="-1" v-if="selectedEmployee">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold" style="color: var(--primary-black); font-size: 1.25rem;">
              <span class="d-none d-md-inline">Employee Details - {{ selectedEmployee.name }} ({{ selectedEmployee.id }})</span>
              <span class="d-md-none">{{ selectedEmployee.name }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Two equal-height columns using compact info grid (mirrors AssetsView) -->
            <div class="row g-2 equal-height-columns">
              <div class="col-12 col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-user me-2"></i>Basic Information</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <div class="info-label-compact">Employee ID</div>
                      <div class="info-value-compact fw-bold">{{ selectedEmployee.id }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Full Name</div>
                      <div class="info-value-compact fw-bold">{{ selectedEmployee.name }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Email Address</div>
                      <div class="info-value-compact">{{ selectedEmployee.email }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Phone Number</div>
                      <div class="info-value-compact">{{ selectedEmployee.phone || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Date of Birth</div>
                      <div class="info-value-compact">{{ selectedEmployee.dateOfBirth || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Status</div>
                      <div class="info-value-compact">
                        <span :class="getStatusBadgeClass(selectedEmployee && selectedEmployee.status)">
                          {{ selectedEmployee && selectedEmployee.status === 'active' ? 'Active' : 'Inactive' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-map-marker-alt me-2"></i>Location & Assets</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <div class="info-label-compact">Address</div>
                      <div class="info-value-compact" style="white-space: pre-wrap; overflow-wrap: break-word;">{{ selectedEmployee.address || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Assigned Assets</div>
                      <div class="info-value-compact">
                        <span class="badge badge-pink">{{ selectedEmployee.assetsCount }} Assets</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assigned Assets Section - Detailed Information -->
            <div class="row mt-2" v-if="selectedEmployee.assets && selectedEmployee.assets.length > 0">
              <div class="col-12">
                <h6 class="section-title-compact d-flex align-items-center justify-content-between" 
                    @click="toggleAssetsDetails" 
                    style="cursor: pointer;">
                  <span><i class="fas fa-laptop me-2"></i>Assigned Assets Details ({{ selectedEmployee.assetsCount }})</span>
                  <i class="fas fa-chevron-down assets-chevron" 
                     :class="{ 'rotated': isAssetsDetailsExpanded }"
                     ></i>
                </h6>
                
                <!-- Detailed Assets Information (expandable) -->
                <div v-show="isAssetsDetailsExpanded" class="assets-list-detailed">
                  <div class="asset-item-detailed" v-for="asset in selectedEmployee.assets" :key="asset.id">
                      <!-- Asset Header -->
                      <div class="asset-header">
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center">
                            <div class="asset-icon-detailed" :style="{ backgroundColor: asset.iconColor }">
                              <i :class="asset.iconClass"></i>
                            </div>
                            <div class="asset-basic-info">
                              <div class="asset-name-detailed">{{ asset.name }}</div>
                              <div class="asset-meta-detailed">{{ asset.type }} • Assigned on {{ asset.assignedDate }}</div>
                            </div>
                          </div>
                          <!-- Desktop-only Collect button in header -->
                          <div class="d-none d-md-block">
                            <button class="btn btn-pink btn-sm" @click="collectAsset(asset)">
                              <i class="fas fa-user-minus me-1"></i>Collect
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Asset Assignment Details -->
                      <div class="asset-assignment-details">
                        <div class="row g-2">
                          <!-- Assignment Reason -->
                          <div class="col-md-6" v-if="asset.assignmentReason">
                            <div class="info-item-compact">
                      <span class="info-label-compact">Assignment Reason</span>
                              <div class="info-value-compact">{{ asset.assignmentReason }}</div>
                            </div>
                          </div>
                          
                          <!-- Assignment Date -->
                          <div class="col-md-6" v-if="asset.assignedDate">
                            <div class="info-item-compact">
                      <span class="info-label-compact">Assignment Date</span>
                              <div class="info-value-compact">{{ formatDate(asset.assignedDate) }}</div>
                            </div>
                          </div>
                          
                          <!-- Assigned By -->
                          <div class="col-md-6" v-if="asset.assignedBy">
                            <div class="info-item-compact">
                      <span class="info-label-compact">Assigned By</span>
                              <div class="info-value-compact">{{ asset.assignedBy }}</div>
                            </div>
                          </div>
                          
                          <!-- Divider for notes -->
                          <div class="col-12" v-if="asset.assignmentNotes">
                            <hr class="assignment-divider">
                          </div>
                          
                          <!-- Assignment Notes -->
                          <div class="col-12" v-if="asset.assignmentNotes">
                            <div class="info-item-compact">
                      <span class="info-label-compact">Assignment Notes</span>
                              <div class="info-value-compact notes-display">
                                {{ asset.assignmentNotes }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Asset Actions Footer (mobile only) -->
                      <div class="asset-actions-footer border-top d-flex justify-content-end d-md-none">
                        <button class="btn btn-pink btn-sm" @click="collectAsset(asset)">
                          <i class="fas fa-user-minus me-1"></i>Collect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <!-- Mobile: 2x2 grid of actions -->
            <div class="mobile-actions-grid d-md-none w-100">
              <button type="button" class="btn btn-green" @click="issueAsset(selectedEmployee)">
                <i class="fas fa-laptop me-1"></i>Issue Asset
              </button>
              <button type="button" class="btn btn-purple" @click="editEmployee(selectedEmployee)">
                <i class="fas fa-edit me-1"></i>Edit Employee
              </button>
              <button 
                type="button" 
                :class="[selectedEmployee && selectedEmployee.status === 'active' ? 'btn btn-red' : 'btn btn-green']"
                @click="handleStatusButtonClick(selectedEmployee)"
                :disabled="selectedEmployee && selectedEmployee.status === 'active' && (selectedEmployee.isAdmin || (selectedEmployee.assetsCount || 0) > 0)"
                :title="selectedEmployee && selectedEmployee.status === 'active' && (selectedEmployee.assetsCount || 0) > 0 
                  ? 'Cannot deactivate: employee has assigned assets'
                  : (selectedEmployee && selectedEmployee.isAdmin && selectedEmployee.status === 'active' ? 'Cannot deactivate admin employees' : '')"
              >
                <i :class="selectedEmployee && selectedEmployee.status === 'active' ? 'fas fa-power-off me-1' : 'fas fa-check-circle me-1'"></i>
                {{ selectedEmployee && selectedEmployee.status === 'active' ? 'Deactivate' : 'Activate' }}
                <span v-if="selectedEmployee && selectedEmployee.isAdmin" class="badge badge-green ms-2 admin-badge">Admin</span>
              </button>
              <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-brown" @click="viewAssetHistory(selectedEmployee)">
                <i class="fas fa-history me-1"></i>History
              </button>
            </div>
            
            <!-- Desktop: Original layout -->
            <div class="d-none d-md-flex w-100 justify-content-between align-items-center">
              <div>
                <button type="button" class="btn btn-brown" @click="viewAssetHistory(selectedEmployee)">
                  <i class="fas fa-history me-1"></i>History
                </button>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-green" @click="issueAsset(selectedEmployee)">
                  <i class="fas fa-laptop me-1"></i>Issue Asset
                </button>
                <button type="button" class="btn btn-purple" @click="editEmployee(selectedEmployee)">
                  <i class="fas fa-edit me-1"></i>Edit Employee
                </button>
                <button 
                  type="button" 
                  :class="selectedEmployee && selectedEmployee.status === 'active' ? 'btn btn-red' : 'btn btn-green'" 
                  @click="handleStatusButtonClick(selectedEmployee)"
                  :disabled="selectedEmployee && selectedEmployee.status === 'active' && (selectedEmployee.isAdmin || (selectedEmployee.assetsCount || 0) > 0)"
                  :title="selectedEmployee && selectedEmployee.status === 'active' && (selectedEmployee.assetsCount || 0) > 0 
                    ? 'Cannot deactivate: employee has assigned assets' 
                    : (selectedEmployee && selectedEmployee.isAdmin && selectedEmployee.status === 'active' ? 'Cannot deactivate admin employees' : '')"
                >
                  <i :class="selectedEmployee && selectedEmployee.status === 'active' ? 'fas fa-power-off me-1' : 'fas fa-check-circle me-1'"></i>
                  {{ selectedEmployee && selectedEmployee.status === 'active' ? 'Deactivate' : 'Activate' }}
                  <span v-if="selectedEmployee && selectedEmployee.isAdmin" class="badge badge-green ms-2 admin-badge">Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Upload Employees Modal -->
    <BulkEmployeeUpload
      ref="bulkUploadModal"
      @upload-success="handleBulkUploadSuccess"
    />

    <!-- Status Confirmation Modal -->
    <div v-if="showStatusModal" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black);">
              <i class="fas fa-exclamation-triangle me-2" style="color: var(--secondary-orange);"></i>
              <span class="d-none d-sm-inline">Confirm Status Change</span>
              <span class="d-sm-none">Status Change</span>
            </h5>
            <button type="button" class="btn-close" @click="closeStatusModal"></button>
          </div>
          <div class="modal-body" v-if="statusChangeEmployee">
            <div class="text-center py-3">
              <div class="confirmation-icon mb-3">
                <i 
                  :class="statusChangeEmployee.status === 'active' ? 'fas fa-power-off fa-3x' : 'fas fa-check-circle fa-3x'"
                  :style="statusChangeEmployee.status === 'active' ? 'color: var(--secondary-red);' : 'color: var(--secondary-green);'"
                ></i>
              </div>
              <h6 class="mb-3" style="color: var(--primary-black);">
                Are you sure you want to {{ statusChangeEmployee.status === 'active' ? 'deactivate' : 'activate' }} this employee?
              </h6>
              <p class="text-muted mb-0">
                <strong>{{ statusChangeEmployee.name }}</strong> will be {{ statusChangeEmployee.status === 'active' ? 'deactivated' : 'activated' }} 
                and will {{ statusChangeEmployee.status === 'active' ? 'no longer be' : 'be' }} available for new asset assignments.
              </p>
              <div class="mt-3 p-3" style="background-color: var(--primary-light-gray); border-radius: 0.5rem; border-left: 4px solid var(--secondary-orange);">
                <small class="text-muted">
                  <i class="fas fa-info-circle me-1"></i>
                  You can reverse this action at any time by changing the employee status again.
                </small>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <!-- Mobile: Stack buttons vertically -->
            <div class="d-block d-sm-none w-100">
              <button 
                type="button" 
                :class="['w-100 mb-2', statusChangeEmployee?.status === 'active' ? 'btn btn-red' : 'btn btn-green']"
                @click="confirmStatusChange"
              >
                <i class="fas fa-check me-1"></i>
                {{ statusChangeEmployee?.status === 'active' ? 'Confirm Deactivate' : 'Confirm Activate' }}
              </button>
              <button type="button" class="btn btn-cancel w-100" @click="closeStatusModal">
                <i class="fas fa-times me-1"></i>Cancel
              </button>
            </div>
            
            <!-- Desktop: Original centered layout -->
            <div class="d-none d-sm-flex w-100 justify-content-center gap-3">
              <button type="button" class="btn btn-cancel" @click="closeStatusModal">
                <i class="fas fa-times me-1"></i>Cancel
              </button>
                <button 
                type="button" 
                :class="statusChangeEmployee?.status === 'active' ? 'btn btn-red' : 'btn btn-green'"
                @click="confirmStatusChange"
              >
                <i class="fas fa-check me-1"></i>
                {{ statusChangeEmployee?.status === 'active' ? 'Confirm Deactivate' : 'Confirm Activate' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


    
  </div>
</template>
  
<script>
  import { Modal } from 'bootstrap'
  import { employeeService } from '@/services/business/employeeService'
  import { employeeApiService } from '@/services/api/employeeApi'
  import AppPagination from '@/components/ui/pagination/AppPagination.vue'
  import BulkEmployeeUpload from '@/views/employees/BulkEmployeeUpload.vue'
  import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
  import ToastNotification from '@/components/common/ToastNotification.vue'
  import { useToastStore } from '@/stores/toast'
  import { useRouteToast } from '@/composables/useRouteToast'
  
  export default {
    name: 'EmployeesView',
    components: { AppPagination, BulkEmployeeUpload, SearchableDropdown, ToastNotification },
    setup() {
      const toastStore = useToastStore()
      useRouteToast()
      return {
        toastStore
      }
    },
    data() {
      return {
        isGridView: false,
        searchTerm: '',
        selectedAssetCount: null,
        selectedStatus: null,
        selectedSortBy: null,
        sortAscending: false,
        currentPage: 1,
        itemsPerPage: 10,
        selectedEmployee: null,
        employees: [],
        totalEmployees: 0,
        serverTotalPages: 1,
        showFilterDropdown: false,
        isAssetsDetailsExpanded: false,
        isAssetHistoryExpanded: false,
        assetHistory: [],
        showStatusModal: false,
        statusChangeEmployee: null,
        isMobileView: window.innerWidth <= 576,
        isExporting: false
      }
    },
    computed: {
      // Sort options for dropdown
      sortOptions() {
        return [
          { id: 'name', name: 'Name', value: 'name' },
          { id: 'employeeId', name: 'Employee ID', value: 'employeeId' },
          { id: 'email', name: 'Email', value: 'email' },
          { id: 'status', name: 'Status', value: 'status' },
          { id: 'createdAt', name: 'Created Date', value: 'createdAt' }
        ]
      },
      
      // Asset count options for dropdown
      assetCountOptions() {
        return [
          { id: '', name: 'All', value: '' },
          { id: '0', name: 'No Assets', value: '0' },
          { id: '1-2', name: '1-2 Assets', value: '1-2' },
          { id: '3+', name: '3+ Assets', value: '3+' }
        ]
      },
      
      // Status options for dropdown
      statusOptions() {
        return [
          { id: '', name: 'All Status', value: '' },
          { id: 'active', name: 'Active', value: 'active' },
          { id: 'inactive', name: 'Inactive', value: 'inactive' }
        ]
      },
      
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
      paginationInfo() {
        const total = this.totalEmployees
        const start = total === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1
        const end = Math.min(this.currentPage * this.itemsPerPage, total)
        
        return { start, end, total }
      },
      //
    },
    created() {
      this.loadEmployees()
      // Initialize default sort option - sort by creation date descending
      this.selectedSortBy = this.sortOptions.find(option => option.value === 'createdAt') || null
    },
    methods: {
      showStatusConfirmationModal({ title, message, details, isActivating, onConfirm, onCancel }) {
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
                  <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i>Cancel
                  </button>
                  <button type="button" class="${isActivating ? 'btn btn-green' : 'btn btn-red'}" id="empConfirmBtn">
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
        this.selectedAssetCount = null
        this.selectedStatus = null
        this.currentPage = 1
        this.loadEmployees()
      },
      toggleFilterDropdown() {
        this.showFilterDropdown = !this.showFilterDropdown
      },
      toggleAssetsDetails() {
        this.isAssetsDetailsExpanded = !this.isAssetsDetailsExpanded
      },
      toggleAssetHistory() {
        this.isAssetHistoryExpanded = !this.isAssetHistoryExpanded
        // Load asset history when expanding for the first time
        if (this.isAssetHistoryExpanded && this.assetHistory.length === 0 && this.selectedEmployee) {
          this.loadAssetHistory()
        }
      },
      getAssetsStatusDescription(count) {
        if (count === 0) return 'No assets currently assigned'
        if (count === 1) return '1 asset assigned to this employee'
        return `${count} assets assigned to this employee`
      },
      getEmployeeIconColor(employeeId) {
        // Exclude secondary purple for avatar background per design feedback
          const colors = [
          'var(--secondary-green)', 
          'var(--secondary-pink)',
          'var(--secondary-orange)',
          'var(--secondary-red)',
          'var(--secondary-blue)',
          'var(--secondary-brown)',
          'var(--primary-dark-gray)'
        ]
        // Use employee ID to generate consistent color (unicode-safe)
        let hash = 0
        for (const ch of employeeId) {
          const codePoint = ch.codePointAt(0) || 0
          hash = ((hash << 5) - hash) + codePoint
          hash = Math.trunc(hash)
        }
        return colors[Math.abs(hash) % colors.length]
      },
      getStatusBadgeClass(status) {
        return status === 'active' ? 'badge badge-green' : 'badge badge-red'
      },
      formatDate(dateString) {
        if (!dateString) return 'Not specified'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      },
      // Handle dropdown click with proper positioning
      handleDropdownClick(event) {
        const button = event.target
        const dropdown = button.nextElementSibling
        
        if (dropdown) {
          // Close all other dropdowns first
          for (const menu of document.querySelectorAll('.dropdown-menu.show')) {
            if (menu !== dropdown) {
              menu.classList.remove('show')
            }
          }
          for (const btn of document.querySelectorAll('[aria-expanded="true"]')) {
            if (btn !== button) {
              btn.setAttribute('aria-expanded', 'false')
            }
          }
          
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
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page
          this.loadEmployees()
        }
      },
      // Pagination rendering is centralized in AppPagination; keep only changePage
      viewEmployee(employee) {
        this.selectedEmployee = employee
        this.isAssetsDetailsExpanded = false // Reset collapse state
        this.isAssetHistoryExpanded = false // Reset asset history state
        this.assetHistory = [] // Clear previous history
        this.$nextTick(() => {
          const modal = new Modal(document.getElementById('employeeDetailModal'), { backdrop: true, keyboard: true, focus: true })
          modal.show()
        })
      },
      editEmployee(employee) {
        // Navigate to edit employee page
        this.$router.push(`/app/employees/edit/${employee.id}`)
      },
      handleStatusButtonClick(employee) {
        // Block deactivation for admin employees
        if (employee && employee.isAdmin && employee.status === 'active') {
          this.toastStore.showToast(
            'Cannot Deactivate Admin',
            'Admin employees cannot be deactivated. Admin users must remain active.',
            'error'
          )
          return
        }
        // Block deactivation if employee has currently assigned assets
        if (employee && employee.status === 'active' && (employee.assetsCount || 0) > 0) {
          this.toastStore.showToast(
            'Cannot Deactivate Employee',
            'Employee has currently assigned assets. Please collect/reassign assets before deactivation.',
            'error'
          )
          return
        }
        
        // Proceed with normal status confirmation (standard in-app modal)
        this.showStatusConfirmation(employee)
      },
      showStatusConfirmation(employee) {
        // Block deactivation for admin employees
        if (employee.isAdmin && employee.status === 'active') {
          this.toastStore.showToast(
            'Cannot Deactivate Admin',
            'Admin employees cannot be deactivated. Admin users must remain active.',
            'error'
          )
          return
        }
        // Block deactivation if employee has currently assigned assets
        if (employee.status === 'active' && (employee.assetsCount || 0) > 0) {
          this.toastStore.showToast(
            'Cannot Deactivate Employee',
            'Employee has currently assigned assets. Please collect/reassign assets before deactivation.',
            'error'
          )
          return
        }
        
        this.statusChangeEmployee = employee
        this.showStatusModal = true
        // Close the employee detail modal
        const modal = document.getElementById('employeeDetailModal')
        if (modal) {
          const bsModal = Modal.getInstance(modal)
          if (bsModal) {
            bsModal.hide()
          }
        }
      },
      closeStatusModal() {
        this.showStatusModal = false
        this.statusChangeEmployee = null
      },
      async confirmStatusChange() {
        if (!this.statusChangeEmployee) return
        
        const newStatus = this.statusChangeEmployee.status === 'active' ? 'inactive' : 'active'
        const employeeId = this.statusChangeEmployee.id
        const employeeName = this.statusChangeEmployee.name
        
        try {
          await employeeService.updateEmployee(employeeId, { status: newStatus.toUpperCase() })
          
          // Update the employee in the list
          const row = this.employees.find(e => e.id === employeeId)
          if (row) {
            row.status = newStatus
          }
          
          // Update selected employee if it's the same
          if (this.selectedEmployee && this.selectedEmployee.id === employeeId) {
            this.selectedEmployee.status = newStatus
          }
          
          // Show toast as success (green) for both activation and deactivation
          const toastType = 'success'
          const toastTitle = newStatus === 'active' ? 'Activated' : 'Deactivated'
          const toastMessage = `Employee ${employeeName} has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`
          // showToast(title, message, type)
          this.toastStore.showToast(toastTitle, toastMessage, toastType)
          
        } catch (error) {
          console.error('Failed to update employee status:', error)
          
          // Show error toast notification (red)
          this.toastStore.showToast(
            'Error',
            `Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} employee ${employeeName}. Please try again.`,
            'error'
          )
        } finally {
          this.closeStatusModal()
          // Reopen the employee detail modal after status change
          this.$nextTick(() => {
            const modal = new Modal(document.getElementById('employeeDetailModal'))
            modal.show()
          })
        }
      },
      openBulkUploadModal() {
        this.$refs.bulkUploadModal.openModal()
      },
      // Bulk upload event handlers
      handleBulkUploadSuccess(result) {
        // Refresh the employee list
        this.loadEmployees()
      },
      issueAsset(employee) {
        // Navigate to issue asset page using database ID
        this.$router.push(`/app/assets/issue?employeeId=${employee.databaseId}`)
      },
      viewAssetHistory(employee) {
        // Close the employee detail modal (if open) and clean up any backdrops
        const modalEl = document.getElementById('employeeDetailModal')
        if (modalEl) {
          const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl)
          if (modalInstance && typeof modalInstance.hide === 'function') {
            modalInstance.hide()
          }
        }

        // Remove bootstrap modal classes/backdrops if any linger
        document.body.classList.remove('modal-open')
        for (const el of document.querySelectorAll('.modal-backdrop')) {
          el.remove()
        }

        // Navigate to employee asset history page using database ID
        this.$router.push(`/app/employees/${employee.databaseId}/history`)
      },
      collectAsset(asset) {
        // Close the employee detail modal and clean up any backdrops
        const modalEl = document.getElementById('employeeDetailModal')
        if (modalEl) {
          const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl)
          if (modalInstance && typeof modalInstance.hide === 'function') {
            modalInstance.hide()
          }
        }

        // Remove bootstrap modal classes/backdrops if any linger
        document.body.classList.remove('modal-open')
        for (const el of document.querySelectorAll('.modal-backdrop')) {
          el.remove()
        }

        const assetId = asset && asset.id ? asset.id : undefined
        const employeeId = this.selectedEmployee && this.selectedEmployee.databaseId ? this.selectedEmployee.databaseId : undefined
        this.$router.push({ path: '/app/assets/collect', query: { ...(assetId && { assetId }), ...(employeeId && { employeeId }) } })
      },
      async loadEmployees() {
        try {
          // Load employees with server-side pagination
          const resp = await employeeService.getEmployees({ 
            page: this.currentPage, 
            limit: this.itemsPerPage,
            search: this.searchTerm || undefined,
            status: this.selectedStatus?.value || undefined,
            assetCountRange: this.selectedAssetCount?.value || undefined,
            sortBy: this.selectedSortBy?.value || 'name',
            sortOrder: this.sortAscending ? 'asc' : 'desc'
          })
          
          const list = resp.data.employees || []
          const pagination = resp.data.pagination || {}
          
          
          // Update pagination info from server
          this.totalEmployees = pagination.totalCount || 0
          this.serverTotalPages = pagination.totalPages || 1
          
          // Exclude purple text color for avatar/icon per design guidance
          const colorClasses = ['text-success','text-info','text-warning','text-blue','text-danger','text-brown','text-muted']
          this.employees = list.map((e, idx) => ({
            id: e.employeeId,
            databaseId: e.id, // Store the database ID for API calls
            name: `${e.firstName} ${e.lastName}`.trim(),
            email: e.email,
            phone: e.phone || '',
            assetsCount: e.assignedAssetsCount || 0,
            status: (e.status || 'ACTIVE').toLowerCase(),
            isAdmin: e.isAdmin || false, // Include admin status
            iconClass: `fas fa-user-circle ${colorClasses[idx % colorClasses.length]}`,
            dateOfBirth: e.dateOfBirth,
            address: e.address,
            assets: (e.assignedAssets || []).map(a => ({
              id: a.assetId,
              name: `${a.assetId} - ${a.assetName}`,
              type: 'Asset',
              assignedDate: a.assignedDate,
              assignmentReason: a.assignmentReason || null,
              assignedBy: a.assignedBy || null,
              assignmentNotes: a.assignmentNotes || null,
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
      },
      // Change handlers for searchable dropdowns
      onSortByChange(item) {
        this.selectedSortBy = item
        this.sortEmployees()
      },
      
      onAssetCountChange(item) {
        this.selectedAssetCount = item
        this.filterEmployees()
      },
      
      onStatusChange(item) {
        this.selectedStatus = item
        this.filterEmployees()
      },
      // Close dropdown when clicking outside
      handleClickOutside(event) {
        const target = event.target
        if (!target.closest('.dropdown')) {
          for (const menu of document.querySelectorAll('.dropdown-menu.show')) {
            menu.classList.remove('show')
          }
          for (const btn of document.querySelectorAll('[aria-expanded="true"]')) {
            btn.setAttribute('aria-expanded', 'false')
          }
        }
      },
      // Handle window resize for responsive pagination
      handleResize() {
        this.isMobileView = window.innerWidth <= 576
      },
      // Load asset history for the selected employee
      async loadAssetHistory() {
        if (!this.selectedEmployee) return
        
        try {
          const response = await employeeApiService.getAssetHistory(this.selectedEmployee.id)
          this.assetHistory = response.data.assetHistory || []
        } catch (error) {
          console.error('Failed to load asset history:', error)
          this.toastStore.showToast(
            'Error',
            'Failed to load asset history. Please try again.',
            'error'
          )
        }
      },
      // Get count of currently assigned assets (from the main assigned assets section)
      getCurrentAssignmentsCount() {
        return this.selectedEmployee?.assetsCount || 0
      },
      // Get description for asset history
      getHistoryDescription() {
        if (this.assetHistory.length === 0) return 'No completed asset transactions recorded'
        const currentlyAssigned = this.getCurrentAssignmentsCount()
        const completed = this.assetHistory.length
        return `${currentlyAssigned} currently assigned, ${completed} completed transactions`
      },
      // Get asset icon color based on type
      getAssetIconColor(assetType) {
        const colors = {
          'Laptop': 'var(--secondary-purple)',
          'Desktop': 'var(--secondary-blue)',
          'Monitor': 'var(--secondary-green)',
          'Phone': 'var(--secondary-orange)',
          'Tablet': 'var(--secondary-pink)',
          'Other': 'var(--secondary-gray)'
        }
        return colors[assetType] || colors['Other']
      },
      // Get asset type icon
      getAssetTypeIcon(assetType) {
        const icons = {
          'Laptop': 'fas fa-laptop',
          'Desktop': 'fas fa-desktop',
          'Monitor': 'fas fa-tv',
          'Phone': 'fas fa-mobile-alt',
          'Tablet': 'fas fa-tablet-alt',
          'Other': 'fas fa-cube'
        }
        return icons[assetType] || icons['Other']
      },
      // Get condition badge class
      getConditionBadgeClass(condition) {
        const classes = {
          'EXCELLENT': 'badge-success',
          'GOOD': 'badge-info',
          'FAIR': 'badge-warning',
          'POOR': 'badge-danger',
          'DAMAGED': 'badge-danger'
        }
        return classes[condition] || 'badge-secondary'
      },
      // Export employees to Excel
      async exportEmployees() {
        try {
          this.isExporting = true
          await employeeService.exportEmployeesToExcel()
          this.toastStore.showToast(
            'Export Successful',
            'Employee data has been exported to Excel successfully!',
            'success'
          )
        } catch (error) {
          console.error('Error exporting employees:', error)
          this.toastStore.showToast(
            'Export Failed',
            'Failed to export employee data. Please try again.',
            'error'
          )
        } finally {
          this.isExporting = false
        }
      },
      // Open manage employees page
      openManageEmployeesModal() {
        this.$router.push('/app/employees/manage')
      },
      // Close dropdown helper
      closeDropdown(dropdownId) {
        const button = document.getElementById(dropdownId)
        const dropdown = button?.nextElementSibling
        
        if (dropdown) {
          dropdown.classList.remove('show')
          button?.setAttribute('aria-expanded', 'false')
        }
      },
    },
    mounted() {
      // Default to grid view on mobile screens
      this.isGridView = window.innerWidth <= 576
      this.loadEmployees()
      // If navigated here with ?open=<employeeId>, open the employee modal automatically
      const toOpen = this.$route?.query?.open
      if (toOpen) {
        // Delay to ensure employees are loaded
        setTimeout(() => {
          const match = this.employees.find(e => e.id === toOpen)
          if (match) {
            this.viewEmployee(match)
          }
        }, 300)
      }
      // Add click outside listener for dropdown
      document.addEventListener('click', this.handleClickOutside)
      // Add resize listener for responsive pagination
      window.addEventListener('resize', this.handleResize)
    },
    unmounted() {
      // Cleanup event listeners
      document.removeEventListener('click', this.handleClickOutside)
      window.removeEventListener('resize', this.handleResize)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        document.body.classList.remove('modal-open')
        for (const el of document.querySelectorAll('.modal-backdrop')) {
          el.remove()
        }
        const modalEl = document.getElementById('employeeDetailModal')
        if (modalEl) {
          const inst = Modal.getInstance(modalEl)
          if (inst && typeof inst.hide === 'function') inst.hide()
        }
      })
    },
    beforeRouteLeave(to, from, next) {
      const modalEl = document.getElementById('employeeDetailModal')
      if (modalEl) {
        const inst = Modal.getInstance(modalEl) || new Modal(modalEl)
        if (inst && typeof inst.hide === 'function') inst.hide()
      }
      document.body.classList.remove('modal-open')
      for (const el of document.querySelectorAll('.modal-backdrop')) {
        el.remove()
      }
      next()
    }
  }
  </script>
  
<style scoped>
/**
 * EmployeesView.vue - View-Specific Styles
 * Styles unique to this view only - shared styles are in /assets/styles/pages/employees.css
 */

/* =================================
   GRID VIEW - EMPLOYEE CARDS
   Specific to grid view layout
================================= */

.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* moved to shared cards.css (.employee-card) */

/* Employee actions footer in grid cards */
.employee-actions-footer { 
  border-top: 1px solid var(--primary-light-gray) !important; 
  background-color: var(--primary-white) !important; 
}

/* =================================
   EMPLOYEE TABLE - LIST VIEW
   Specific table column widths for this view
================================= */

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
#employeesTable td:nth-child(5) { /* Assets */
  width: 110px !important;
  min-width: 110px !important;
  max-width: 110px !important;
  white-space: nowrap !important;
}

#employeesTable th:nth-child(6),
#employeesTable td:nth-child(6) { /* Status */
  width: 110px !important;
  min-width: 110px !important;
  max-width: 110px !important;
}

#employeesTable th:nth-child(7),
#employeesTable td:nth-child(7) { /* Actions */
  width: 125px !important;
  min-width: 125px !important;
  max-width: 125px !important;
  padding-right: 1.25rem !important;
  padding-left: 0.25rem !important;
}

/* =================================
   EMPLOYEE DETAIL MODAL
   Specific to the modal in this view
================================= */

/* Asset Info Sections - Compact Design */
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

/* Detailed Assets Information - Header styling (removed duplicate) */


/* Expandable Assets Section */
.assets-chevron {
  transition: transform 0.3s ease;
  font-size: 1.1rem;
  color: #666666;
  cursor: pointer;
  padding: 0.2rem;
}

.assets-chevron.rotated {
  transform: rotate(180deg);
}

/* Detailed Asset Items in Modal */
.assets-list-detailed {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.75rem;
}

.asset-item-detailed {
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  padding: 0 !important;
  margin-bottom: 0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.asset-item-detailed:last-child {
  margin-bottom: 0 !important;
}

.asset-header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
  border-radius: 0.5rem 0.5rem 0 0;
}

.asset-icon-detailed {
  width: 36px !important;
  height: 36px !important;
  border-radius: 0.375rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 0.75rem !important;
  flex-shrink: 0 !important;
}

.asset-icon-detailed i {
  color: white !important;
  font-size: 1rem !important;
}

.asset-basic-info {
  min-width: 0 !important;
  flex-grow: 1 !important;
}

.asset-name-detailed {
  color: var(--primary-black) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.25rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.asset-meta-detailed {
  color: var(--primary-mid-gray) !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
}

.asset-assignment-details {
  padding: 1rem;
  background-color: var(--primary-white);
  border-radius: 0 0 0.5rem 0.5rem;
}

/* Asset actions footer */
.asset-actions-footer {
  background-color: var(--primary-white);
  padding: 0.75rem 1rem 0.5rem 1rem;
  margin-top: 0.5rem;
}

/* Assignment Divider */
.assignment-divider {
  border: none;
  border-top: 1px solid #e9ecef;
  margin: 1rem 0;
  opacity: 0.6;
}

/* Notes Display */
.notes-display {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 0.9rem;
  color: #495057;
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e9ecef;
}

/* Assets List Styling (moved to consolidated section below) */

/* =================================
   DROPDOWN MENU STYLES
   Specific to this view's action dropdowns
================================= */

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
}

.dropdown-item:active {
  background-color: rgba(51, 31, 234, 0.2);
  color: #331FEA;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid #dee2e6;
}

.dropdown {
  position: relative;
}

.dropdown-menu.show {
  display: block;
}

 

/* =================================
   ANIMATIONS
================================= */

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

/* Form styling consistency */
:deep(.form-label) {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

:deep(.form-control), :deep(.form-select) {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Make button corners match input field corners for consistency - moved to global buttons.css */

/* Fix search input group border-radius consistency */
.input-group .input-group-text {
  border-radius: 0.375rem 0 0 0.375rem !important;
}

.input-group .form-control:not(:last-child) {
  border-radius: 0 0.375rem 0.375rem 0 !important;
}

:deep(.form-control:focus), :deep(.form-select:focus) {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Component-specific styles are already included in main.css */
/* Additional component-specific styles can be added here if needed */

/* Modal footer and button styling moved to components/modals.css and components/buttons.css */
/* Badge styles moved to components/badges.css and pages/employees.css */


/* Assets List Styling */
.assets-list /* consolidated */ {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.75rem !important;
}

.asset-item /* consolidated */ {
    background-color: var(--primary-light-gray) !important;
    border: 1px solid var(--element-gray) !important;
    border-radius: 0.5rem !important;
    padding: 1rem !important;
}

.asset-icon /* consolidated */ {
    width: 40px !important;
    height: 40px !important;
    border-radius: 0.5rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-right: 1rem !important;
    flex-shrink: 0 !important;
}

.asset-icon i /* consolidated */ {
    color: white !important;
    font-size: 1.1rem !important;
}

.asset-details /* consolidated */ {
    min-width: 0 !important;
}

.asset-name /* consolidated */ {
    color: var(--primary-black) !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    margin-bottom: 0.25rem !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.asset-meta /* consolidated */ {
    color: var(--primary-mid-gray) !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
}

.asset-actions {
    display: flex !important;
    align-items: center !important;
    flex-shrink: 0 !important;
}

/* =================================
   STATUS CONFIRMATION MODAL
   Specific to this view
================================= */

.confirmation-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* =================================
   ASSET HISTORY IN MODAL
   Timeline styles specific to modal view
================================= */

.asset-history-section {
  margin-top: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
}

.history-chevron {
  transition: transform 0.3s ease;
  font-size: 1.1rem;
  color: #666666;
  cursor: pointer;
  padding: 0.2rem;
}

.history-chevron.rotated {
  transform: rotate(180deg);
}

.asset-history-expanded {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

.timeline-connector {
  position: absolute;
  left: -1.5rem;
  top: 2rem;
  width: 2px;
  height: calc(100% + 1rem);
  background-color: #dee2e6;
  z-index: 1;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeline-dot.assigned {
  background-color: var(--secondary-green);
  color: white;
}

.timeline-dot.returned {
  background-color: var(--secondary-orange);
  color: white;
}

.timeline-dot i {
  font-size: 0.8rem;
}

.timeline-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f8f9fa;
}

.asset-icon-timeline {
  width: 40px !important;
  height: 40px !important;
  border-radius: 0.5rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 0.75rem !important;
  flex-shrink: 0 !important;
}

.asset-icon-timeline i {
  color: white !important;
  font-size: 1.1rem !important;
}

.asset-basic-info-timeline {
  min-width: 0 !important;
  flex-grow: 1 !important;
}

.asset-name-timeline {
  color: var(--primary-black) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.25rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.asset-meta-timeline {
  color: var(--primary-mid-gray) !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
}

.timeline-badges {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.timeline-details {
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

/* =================================
   RESPONSIVE STYLES
   View-specific responsive adjustments
================================= */

/* Small screens: right-aligned to prevent overflow */
@media (max-width: 767.98px) {
  
  
  .employees-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
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
  #employeesTable td:nth-child(5) { /* Assets */
      width: 110px !important;
      min-width: 110px !important;
      max-width: 110px !important;
      white-space: nowrap !important;
  }
  #employeesTable th:nth-child(6),
  #employeesTable td:nth-child(6) { /* Status */
      width: 110px !important;
      min-width: 110px !important;
      max-width: 110px !important;
  }
  #employeesTable th:nth-child(7),
  #employeesTable td:nth-child(7) { /* Actions */
      width: 125px !important;
      min-width: 125px !important;
      max-width: 125px !important;
      padding-right: 1.25rem !important; /* extra right gutter to mirror left */
      padding-left: 0.25rem !important;
  }

/* Employee action button sizing moved to components/buttons.css */

/* Status button hover effects now handled by shared btn-green/btn-red in buttons.css */

/* Status Confirmation Modal Styles */
.confirmation-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Confirmation modal button styles now use shared btn-cancel, btn-green, btn-red from buttons.css */

/* Admin badge styling moved to components/badges.css */

/* Responsive Dropdown Improvements */
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

/* Mobile-first responsive improvements */
@media (max-width: 576px) {
  .container-fluid {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
  
  .card-body {
    padding: 0.75rem !important;
  }
  
  .modal-dialog {
    margin: 0.5rem !important;
  }
  
  .modal-content {
    border-radius: 0.5rem !important;
  }
  
  .table-responsive {
    border-radius: 0.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .employee-card-modern {
    margin-bottom: 1rem;
  }
  
  .employee-card-modern .card-body {
    padding: 1rem;
  }

  /* Mobile modal responsive adjustments */
  .modal-header {
    padding: 0.75rem 0.75rem 0 0.75rem !important;
  }
  
  .modal-body {
    padding: 0.5rem 0.75rem !important;
  }
  
  .modal-footer {
    padding: 0 0.75rem 0.75rem 0.75rem !important;
    gap: 0.5rem !important;
  }
  
  /* moved to shared buttons.css */
  
  .modal-footer .d-flex {
    flex-direction: column !important;
    width: 100% !important;
  }
  
  .modal-title {
    font-size: 1.1rem !important;
  }

  /* Employee info sections mobile adjustments */
  .employee-info-section-compact {
    margin-bottom: 0.75rem !important;
    padding: 0.5rem !important;
  }
  
  .employee-info-section-compact .section-title-compact {
    font-size: 1rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .employee-info-section-compact .info-label-compact {
    font-size: 0.85rem !important;
    min-width: unset !important;
    margin-bottom: 0.25rem !important;
  }
  
  .employee-info-section-compact .info-value-compact {
    font-size: 0.9rem !important;
    text-align: left !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  /* Asset details mobile adjustments */
  .section-title-compact {
    padding: 0.5rem !important;
    margin-top: 0.75rem !important;
  }
  
  .asset-item-detailed {
    margin-bottom: 0.75rem !important;
  }
  
  .asset-header {
    padding: 0.75rem !important;
  }
  
  .asset-assignment-details {
    padding: 0.75rem !important;
  }
  
  /* Asset actions footer - mobile full width button */
  .asset-actions-footer {
    padding: 0.5rem 0.75rem 0.25rem 0.75rem !important;
    margin-top: 0.25rem !important;
  }
  
  .asset-actions-footer .btn {
    width: 100% !important;
  }
  
  .asset-icon-detailed {
    width: 32px !important;
    height: 32px !important;
    margin-right: 0.5rem !important;
  }
  
  .asset-name-detailed {
    font-size: 0.9rem !important;
  }
  
  .asset-meta-detailed {
    font-size: 0.75rem !important;
  }

  /* Status confirmation modal mobile adjustments */
  .confirmation-icon {
    margin-bottom: 1rem !important;
  }
  
  .confirmation-icon i {
    font-size: 2rem !important;
  }

  /* Better text handling on mobile */
  .employee-info-section-compact .info-item-compact {
    flex-direction: column !important;
    align-items: flex-start !important;
    padding: 0.5rem 0 !important;
  }

  /* 2x2 buttons grid for mobile footer */
  .mobile-actions-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    grid-auto-rows: minmax(44px, auto) !important;
    gap: 0.5rem !important;
  }
  
  .mobile-actions-grid .btn {
    width: 100% !important;
  }
  
  /* Timeline mobile adjustments */
  .timeline-dot {
    left: -1.5rem;
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .timeline-connector {
    left: -1rem;
  }
  
  .timeline-badges {
    flex-direction: row;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .asset-icon-timeline {
    width: 32px !important;
    height: 32px !important;
    margin-right: 0.5rem !important;
  }
  
  .asset-name-timeline {
    font-size: 0.9rem !important;
  }
  
  .asset-meta-timeline {
    font-size: 0.75rem !important;
  }
}

/* Tablet responsive improvements */
@media (min-width: 577px) and (max-width: 991.98px) {
  .employee-card-modern {
    margin-bottom: 1.5rem;
  }
  
  .modal-lg {
    max-width: 90vw;
  }

  /* Tablet modal responsive adjustments */
  .modal-header {
    padding: 1rem 1rem 0 1rem !important;
  }
  
  .modal-body {
    padding: 0.75rem 1rem !important;
  }
  
  .modal-footer {
    padding: 0 1rem 1rem 1rem !important;
  }
  
  .modal-footer .d-flex {
    flex-wrap: wrap !important;
    gap: 0.5rem !important;
  }
  
  .modal-footer .btn {
    flex: 1 1 auto !important;
    min-width: 120px !important;
  }

  /* Employee info sections tablet adjustments */
  .employee-info-section-compact {
    padding: 0.65rem !important;
  }
  
  .employee-info-section-compact .info-label-compact {
    min-width: 120px !important;
  }
  
  .employee-info-section-compact .info-value-compact {
    word-break: break-word !important;
    overflow-wrap: break-word !important;
  }

  /* Asset details tablet adjustments */
  .asset-header {
    padding: 0.85rem !important;
  }
  
  .asset-assignment-details {
    padding: 0.85rem !important;
  }
  
  .asset-actions-footer {
    padding: 0.65rem 0.85rem 0.4rem 0.85rem !important;
    margin-top: 0.4rem !important;
  }
  
  /* Timeline tablet adjustments */
  .timeline-content {
    padding: 0.85rem;
  }
  
  .timeline-details {
    padding: 0.65rem;
  }
}

/* Large tablet adjustments */
@media (min-width: 768px) and (max-width: 991.98px) {
  .modal-lg {
    max-width: 95vw;
  }
  
  .row.g-2 .col-md-6 {
    margin-bottom: 1rem;
  }
}
}
</style>
  