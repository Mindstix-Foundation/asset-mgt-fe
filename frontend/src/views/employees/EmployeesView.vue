<template>
  <div style="min-height: 100vh;">
    <!-- Main Content -->
    <div class="container-fluid px-3 py-4">
      <!-- Page Header -->
      <div class="row align-items-center mb-4 employees-page-header">
        <!-- Title Section -->
        <div class="col-12 col-md-6 col-lg-6 mb-3 mb-md-0 employees-page-intro">
          <h2 class="mb-0">Employee Management</h2>
          <p class="text-muted mb-0">Manage employee information and asset assignments</p>
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
            <div class="search-input-container">
              <i class="fas fa-search search-icon"></i>
              <input 
                id="employees-search"
                type="text" 
                class="form-control search-input" 
                v-model="searchTerm"
                placeholder="Search by first name, last name, ID, or email..."
                @input="onSearchInput"
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
        <div v-if="showFilterDropdown" class="mt-3 border rounded p-3 shadow-sm bg-white">
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
          <div class="row" v-if="filteredEmployees.length > 0">
            <div 
              v-for="employee in filteredEmployees" 
              :key="employee.id"
              class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4"
            >
              <div class="card h-100 employee-card-modern">
                <div class="card-body p-2">
                  <!-- Header with icon, employee ID and status -->
                  <div class="d-flex align-items-center mb-2">
                    <div 
                      class="rounded-circle d-flex align-items-center justify-content-center me-2" 
                      :style="{ width: '36px', height: '36px', backgroundColor: getEmployeeIconColor(employee.id), flexShrink: 0 }"
                    >
                      <i class="fas fa-user text-white" style="font-size: 0.9rem; color: white !important;"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0 fw-bold text-truncate" style="color: var(--primary-black); font-size: 0.9rem;">{{ employee.id }}</h6>
                      <small class="text-muted text-truncate d-block">{{ employee.name }}</small>
                    </div>
                    <span :class="getStatusBadgeClass(employee.status)">
                      {{ employee.status === 'active' ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  
                  <!-- Employee Details - Custom layout -->
                  <div class="mb-2">
                    <div class="row g-1">
                      <div class="col-12">
                        <small class="text-muted d-block">Email</small>
                        <div class="fw-medium text-truncate" style="color: var(--primary-black);">{{ employee.email }}</div>
                      </div>
                      <div class="col-12">
                        <small class="text-muted d-block">Phone</small>
                        <div class="text-truncate" style="color: var(--primary-black);">{{ employee.phone || 'Not provided' }}</div>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block">Assets</small>
                        <div class="text-truncate" style="color: var(--primary-black);">{{ employee.assetsCount }} Assigned</div>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block">Status</small>
                        <div class="text-truncate" style="color: var(--primary-black);">{{ employee.status === 'active' ? 'Currently Active' : 'Inactive' }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="employee-actions-footer mt-auto pt-2 border-top">
                    <div class="d-flex justify-content-center gap-1">
                      <button 
                        class="btn btn-action btn-brown btn-sm" 
                        @click="viewEmployee(employee)"
                        title="View Employee Details"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-action btn-purple btn-sm" 
                        title="Edit Employee"
                        @click="editEmployee(employee)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-action btn-green btn-sm" 
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
          
          <!-- No results for grid view -->
          <div v-if="filteredEmployees.length === 0" class="col-12 text-center py-5">
            <i class="fas fa-users fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No employees found</h5>
            <p class="text-muted">Try adjusting your search criteria</p>
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
    <div 
      v-if="selectedEmployee" 
      class="modal fade" 
      :class="{ show: showEmployeeModal }" 
      :style="{ display: showEmployeeModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold" style="color: var(--primary-black); font-size: 1.25rem;">
              <span class="d-none d-md-inline">Employee Details - {{ selectedEmployee.name }} ({{ selectedEmployee.id }})</span>
              <span class="d-md-none">{{ selectedEmployee.name }}</span>
            </h5>
            <button type="button" class="btn-close" @click="closeModals"></button>
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
                              <div class="asset-meta-detailed">{{ asset.serialNumber || 'Serial not available' }} • Assigned on {{ formatDate(asset.assignedDate) }}</div>
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
                          
                        </div>
                        <div class="asset-specifications mt-3" v-if="hasAssetSpecifications(asset)">
                          <div class="d-flex align-items-center mb-2 spec-header">
                            <i class="fas fa-microchip me-2 text-muted"></i>
                            <span class="info-label-compact mb-0">Specifications</span>
                          </div>
                          <div class="specifications-inline">
                            <span
                              class="spec-inline-item"
                              v-for="(spec, specIndex) in getAssetSpecificationEntries(asset)"
                              :key="`${asset.id}-spec-${specIndex}`"
                            >
                              <span class="spec-inline-label">{{ spec.label }}:</span>
                              <span class="spec-inline-value">{{ spec.value }}</span>
                            </span>
                          </div>
                        </div>
                        <div class="asset-spec-description mt-3" v-if="asset.specificationDescription">
                          <div class="info-item-compact">
                            <span class="info-label-compact">Description</span>
                            <div class="info-value-compact spec-description-text">
                              {{ asset.specificationDescription }}
                            </div>
                          </div>
                        </div>
                        <!-- Assignment Notes -->
                        <div v-if="asset.assignmentNotes" class="mt-3">
                          <hr class="assignment-divider">
                          <div class="info-item-compact">
                            <span class="info-label-compact">Assignment Notes</span>
                            <div class="info-value-compact notes-display">
                              {{ asset.assignmentNotes }}
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
              <button type="button" class="btn btn-green btn-sm" @click="issueAsset(selectedEmployee)">
                <i class="fas fa-laptop me-1"></i>Issue Asset
              </button>
              <button type="button" class="btn btn-purple btn-sm" @click="editEmployee(selectedEmployee)">
                <i class="fas fa-edit me-1"></i>Edit Employee
              </button>
              <button 
                type="button" 
                :class="[selectedEmployee && selectedEmployee.status === 'active' ? 'btn btn-red btn-sm' : 'btn btn-green btn-sm']"
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
              <button type="button" class="btn btn-cancel btn-sm" @click="closeModals">Close</button>
              <button type="button" class="btn btn-brown btn-sm" @click="viewAssetHistory(selectedEmployee)">
                <i class="fas fa-history me-1"></i>History
              </button>
            </div>
            
            <!-- Desktop: Original layout -->
            <div class="d-none d-md-flex w-100 justify-content-between align-items-center">
              <div>
                <button type="button" class="btn btn-brown btn-sm" @click="viewAssetHistory(selectedEmployee)">
                  <i class="fas fa-history me-1"></i>History
                </button>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-cancel btn-sm" @click="closeModals">Close</button>
                <button type="button" class="btn btn-green btn-sm" @click="issueAsset(selectedEmployee)">
                  <i class="fas fa-laptop me-1"></i>Issue Asset
                </button>
                <button type="button" class="btn btn-purple btn-sm" @click="editEmployee(selectedEmployee)">
                  <i class="fas fa-edit me-1"></i>Edit Employee
                </button>
                <button 
                  type="button" 
                  :class="selectedEmployee && selectedEmployee.status === 'active' ? 'btn btn-red btn-sm' : 'btn btn-green btn-sm'" 
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
    <div 
      v-if="showStatusModal" 
      class="modal fade" 
      :class="{ show: showStatusModal }" 
      :style="{ display: showStatusModal ? 'block' : 'none' }"
      tabindex="-1"
    >
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
                :class="['w-100 mb-2', statusChangeEmployee?.status === 'active' ? 'btn btn-red btn-sm' : 'btn btn-green btn-sm']"
                @click="confirmStatusChange"
              >
                <i class="fas fa-check me-1"></i>
                {{ statusChangeEmployee?.status === 'active' ? 'Confirm Deactivate' : 'Confirm Activate' }}
              </button>
              <button type="button" class="btn btn-cancel btn-sm w-100" @click="closeStatusModal">
                <i class="fas fa-times me-1"></i>Cancel
              </button>
            </div>
            
            <!-- Desktop: Original centered layout -->
            <div class="d-none d-sm-flex w-100 justify-content-center gap-3">
              <button type="button" class="btn btn-cancel btn-sm" @click="closeStatusModal">
                <i class="fas fa-times me-1"></i>Cancel
              </button>
                <button 
                type="button" 
                :class="statusChangeEmployee?.status === 'active' ? 'btn btn-red btn-sm' : 'btn btn-green btn-sm'"
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

    <!-- Modal Backdrop -->
    <div v-if="showStatusModal || showEmployeeModal" class="modal-backdrop fade show" @click="closeModals"></div>
  </div>
</template>
  
<script>
  import { employeeService } from '@/services/business/employeeService'
  import { employeeApiService } from '@/services/api/employeeApi'
  import AppPagination from '@/components/ui/pagination/AppPagination.vue'
  import BulkEmployeeUpload from '@/views/employees/BulkEmployeeUpload.vue'
  import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
  import ToastNotification from '@/components/common/ToastNotification.vue'
  import { useToastStore } from '@/stores/toast'
  import { useRouteToast } from '@/composables/useRouteToast'
  import { normalizeEmployeeSearchInput } from '@/utils/searchInput'

  const EMPLOYEES_MODAL_STATE_KEY = 'employeesModalState'
  let resizeTimeout = null
  
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
        showEmployeeModal: false,
        statusChangeEmployee: null,
        isExporting: false,
        pendingEmployeeId: null
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
      this.clearStoredViewState()
      this.initPendingEmployeeFromRoute()
      this.restorePendingEmployeeSnapshot()
      if (!this.selectedSortBy) {
        // Default sort by creation date descending
        this.selectedSortBy = this.sortOptions.find(option => option.value === 'createdAt') || null
      }
      this.loadEmployees()
    },
    watch: {
      '$route.query.open'(value) {
        const openId = typeof value === 'string' && value ? value : null
        this.pendingEmployeeId = openId
        if (openId && !this.showEmployeeModal) {
          this.showEmployeeModal = true
        }
        this.tryOpenPendingEmployee()
      }
    },
    methods: {
      showStatusConfirmationModal({ title, message, details, isActivating, onConfirm, onCancel }) {
        const html = `
          <div class="modal fade" id="empStatusConfirm" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header" style="background-color: var(--primary-light-gray);">
                  <h5 class="modal-title" style="color: var(--primary-black);">${title}</h5>
                  <button type="button" class="btn-close" @click="closeModals"></button>
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
      setDefaultView() {
        const screenWidth = globalThis.window.innerWidth

        if (screenWidth < 768) {
          this.isGridView = true
        } else {
          this.isGridView = false
        }
      },
      filterEmployees() {
        this.currentPage = 1
        this.loadEmployees()
      },
      onSearchInput(event) {
        const normalized = normalizeEmployeeSearchInput(event.target.value)
        if (event.target.value !== normalized) {
          event.target.value = normalized
        }
        this.searchTerm = normalized
        this.filterEmployees()
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
      processAssignedAssetSpecs(payload) {
        if (payload === null || payload === undefined) {
          return { specs: null, description: null }
        }
        if (typeof payload === 'string') {
          const trimmed = payload.trim()
          if (!trimmed) {
            return { specs: null, description: null }
          }
          try {
            const parsed = JSON.parse(trimmed)
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              return this.extractDescriptionFromSpecsObject(parsed)
            }
          } catch (error) {
            console.warn('Failed to parse assignment specifications JSON:', error)
            return { specs: null, description: trimmed }
          }
          return { specs: null, description: trimmed }
        }
        if (typeof payload === 'object' && !Array.isArray(payload)) {
          return this.extractDescriptionFromSpecsObject(payload)
        }
        return { specs: null, description: null }
      },
      extractDescriptionFromSpecsObject(obj) {
        const clone = { ...obj }
        let description = null
        for (const key of Object.keys(clone)) {
          if (key.toLowerCase() === 'description') {
            const value = clone[key]
            if (value !== null && value !== undefined && value !== '') {
              description = String(value)
            }
            delete clone[key]
          }
        }
        const hasSpecs = Object.keys(clone).length > 0 ? clone : null
        return { specs: hasSpecs, description }
      },
      normalizeSpecificationsForDisplay(specs) {
        if (specs === null || specs === undefined || specs === '') {
          return null
        }
        if (typeof specs === 'string') {
          const trimmed = specs.trim()
          if (!trimmed) return null
          try {
            const parsed = JSON.parse(trimmed)
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              return this.stripDescriptionField(parsed)
            }
          } catch (error) {
            console.warn('Failed to parse specifications JSON for display:', error)
            return { Details: trimmed }
          }
          return { Details: trimmed }
        }
        if (typeof specs === 'object' && !Array.isArray(specs)) {
          return this.stripDescriptionField(specs)
        }
        return null
      },
      stripDescriptionField(obj) {
        const clone = { ...obj }
        if ('description' in clone) {
          delete clone.description
        }
        return Object.keys(clone).length > 0 ? clone : null
      },
      formatSpecificationLabel(key) {
        if (!key) return ''
        let formatted = key
        formatted = formatted.replaceAll('_', ' ')
        formatted = formatted.replaceAll(/\s+/g, ' ')
        formatted = formatted.replaceAll(/([a-z0-9])([A-Z])/g, '$1 $2')
        return formatted
          .split(' ')
          .filter(Boolean)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      },
      getAssetSpecificationEntries(asset) {
        if (!asset) return []
        const normalizedSpecs = this.normalizeSpecificationsForDisplay(asset.specifications)
        if (!normalizedSpecs || typeof normalizedSpecs !== 'object') {
          return []
        }
        return Object.entries(normalizedSpecs)
          .filter(([, value]) => value !== null && value !== undefined && value !== '')
          .map(([key, value]) => {
            const label = asset.specificationLabelMap?.[key] || this.formatSpecificationLabel(key)
            const formattedValue = Array.isArray(value) ? value.join(', ') : String(value)
            return { label, value: formattedValue }
          })
      },
      hasAssetSpecifications(asset) {
        return this.getAssetSpecificationEntries(asset).length > 0
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
        this.showEmployeeModal = true
        this.isAssetsDetailsExpanded = false // Reset collapse state
        this.isAssetHistoryExpanded = false // Reset asset history state
        this.assetHistory = [] // Clear previous history
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
        this.showEmployeeModal = false
      },
      closeStatusModal() {
        this.showStatusModal = false
        this.statusChangeEmployee = null
      },
      closeModals() {
        this.showStatusModal = false
        this.showEmployeeModal = false
        this.statusChangeEmployee = null
        this.selectedEmployee = null
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
          this.showEmployeeModal = true
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
        const targetEmployee = employee || this.selectedEmployee
        if (!targetEmployee?.databaseId) {
          return
        }

        this.persistModalSnapshot(targetEmployee)

        const employeePublicId = targetEmployee.id
        const returnPath = employeePublicId
          ? `/app/employees?open=${encodeURIComponent(employeePublicId)}`
          : this.$route.fullPath || '/app/employees'

        this.$router.push({
          path: '/app/assets/issue',
          query: {
            employeeId: targetEmployee.databaseId,
            from: 'employees',
            returnTo: encodeURIComponent(returnPath),
          },
        })
      },
      viewAssetHistory(employee) {
        const targetEmployee = employee || this.selectedEmployee
        if (!targetEmployee) {
          return
        }

        // Persist modal snapshot so it reopens when user returns
        this.persistModalSnapshot(targetEmployee)

        // Close the employee detail modal
        this.showEmployeeModal = false

        // Navigate to employee asset history page using database ID
        this.$router.push(`/app/employees/${targetEmployee.databaseId}/history`)
      },
      collectAsset(asset) {
        const snapshotEmployee = this.selectedEmployee
        if (snapshotEmployee) {
          this.persistModalSnapshot(snapshotEmployee)
        }

        // Close the employee detail modal
        this.showEmployeeModal = false

        const assetId = asset?.id
        const employeeId = this.selectedEmployee?.databaseId
        const employeePublicId = this.selectedEmployee?.id
        const returnPath = employeePublicId
          ? `/app/employees?open=${encodeURIComponent(employeePublicId)}`
          : this.$route.fullPath || '/app/employees'

        this.$router.push({
          path: '/app/assets/collect',
          query: {
            ...(assetId && { assetId }),
            ...(employeeId && { employeeId }),
            from: 'employees',
            returnTo: encodeURIComponent(returnPath),
          },
        })
      },
      persistModalSnapshot(employee) {
        if (globalThis.window === undefined || !employee?.id) return
        try {
          const snapshot = {
            employeeId: employee.id,
            data: employee,
            timestamp: Date.now()
          }
          globalThis.window.sessionStorage.setItem(EMPLOYEES_MODAL_STATE_KEY, JSON.stringify(snapshot))
        } catch (error) {
          console.warn('Failed to persist employees modal state:', error)
        }
      },
      restorePendingEmployeeSnapshot() {
        if (globalThis === undefined) return
        try {
          const raw = globalThis.window.sessionStorage.getItem(EMPLOYEES_MODAL_STATE_KEY)
          if (!raw) return
          globalThis.window.sessionStorage.removeItem(EMPLOYEES_MODAL_STATE_KEY)
          const snapshot = JSON.parse(raw)
          if (snapshot?.employeeId && snapshot?.data) {
            this.pendingEmployeeId = snapshot.employeeId
            this.selectedEmployee = snapshot.data
            this.showEmployeeModal = true
          }
        } catch (error) {
          console.warn('Failed to restore employees modal state:', error)
        }
      },
      initPendingEmployeeFromRoute() {
        const openId = this.$route?.query?.open
        this.pendingEmployeeId = typeof openId === 'string' && openId ? openId : this.pendingEmployeeId
        if (this.pendingEmployeeId) {
          this.showEmployeeModal = true
        }
      },
      tryOpenPendingEmployee() {
        if (!this.pendingEmployeeId) return
        const match = this.employees.find(emp => emp.id === this.pendingEmployeeId)
        if (match) {
          this.selectedEmployee = match
          this.showEmployeeModal = true
          this.pendingEmployeeId = null
        }
      },
      clearStoredViewState() {
        if (globalThis.window === undefined) return
        try {
          globalThis.window.sessionStorage.removeItem('employeesViewState')
        } catch (error) {
          console.warn('Failed to clear employees view state:', error)
        }
      },
      async loadEmployees() {
        try {
          // Load employees with server-side pagination
          const resp = await employeeService.getEmployees({ 
            page: this.currentPage, 
            limit: this.itemsPerPage,
            search: normalizeEmployeeSearchInput(this.searchTerm) || undefined,
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
            assets: (e.assignedAssets || []).map(a => {
              const { specs, description } = this.processAssignedAssetSpecs(a.specifications)
              return {
                id: a.assetId,
                name: `${a.assetId} - ${a.assetName}`,
                type: 'Asset',
                assignedDate: a.assignedDate,
                serialNumber: a.serialNumber || null,
                assignmentReason: a.assignmentReason || null,
                assignedBy: a.assignedBy || null,
                assignmentNotes: a.assignmentNotes || null,
                assetType: a.assetType || null,
                brand: a.brand || null,
                model: a.model || null,
                specifications: specs,
                specificationLabelMap: a.specificationLabelMap || null,
                specificationDescription: a.specificationDescription || description || null,
                iconClass: 'fas fa-laptop',
                iconColor: 'var(--secondary-purple)'
              }
            })
          }))
          this.tryOpenPendingEmployee()
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
      // Handle window resize for responsive view and pagination
      handleResize() {
        if (resizeTimeout) clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          this.setDefaultView()
        }, 150)
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
          'NEW': 'badge-purple',
          'WORKING_CONDITION': 'badge-success',
          'SOFTWARE_ISSUE': 'badge-warning',
          'HARDWARE_ISSUE': 'badge-danger',
          'NEEDS_REPAIR': 'badge-warning',
          'TRASH': 'badge-danger',
          'REFURBISHED': 'badge-info'
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
      this.setDefaultView()
      // Add click outside listener for dropdown
      document.addEventListener('click', this.handleClickOutside)
      // Add resize listener for responsive view switching
      globalThis.window.addEventListener('resize', this.handleResize)
    },
    unmounted() {
      // Cleanup event listeners
      document.removeEventListener('click', this.handleClickOutside)
      globalThis.window.removeEventListener('resize', this.handleResize)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // Close any open modals
        vm.showEmployeeModal = false
        vm.showStatusModal = false
      })
    },
    beforeRouteLeave(to, from, next) {
      // Close any open modals
      this.showEmployeeModal = false
      this.showStatusModal = false
      next()
    }
  }
  </script>
  
<style>
@import '@/assets/styles/pages/employees.css';
</style>
  