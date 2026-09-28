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
                <fieldset class="btn-group flex-shrink-0" aria-label="View toggle">
                  <button 
                    :class="['btn', 'view-toggle', { active: currentView === 'list' }]"
                    @click="setView('list')"
                    style="min-width: 35px; padding: 0.375rem 0.5rem;"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button 
                    :class="['btn', 'view-toggle', { active: currentView === 'grid' }]"
                    @click="setView('grid')"
                    style="min-width: 35px; padding: 0.375rem 0.5rem;"
                  >
                    <i class="fas fa-th-large"></i>
                  </button>
                </fieldset>
              </div>
            </div>
            <div class="col-6">
              <!-- Data Management Dropdown -->
              <div class="dropdown more-actions-dropdown">
                <button 
                  class="btn btn-gray dropdown-toggle w-100" 
                  type="button" 
                  aria-expanded="false"
                  id="moreActionsDropdownSm"
                  @click="handleDropdownClick"
                >
                  <i class="fas fa-cog me-1"></i>More Actions
                </button>
                <ul class="dropdown-menu dropdown-menu-responsive" aria-labelledby="moreActionsDropdownSm">
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
              <button class="btn btn-purple w-100" @click="navigateToAddAsset">
                <i class="fas fa-plus me-1"></i>Add New Asset
              </button>
            </div>
            <div class="col-6">
              <button class="btn btn-green w-100" @click="navigateToIssueAsset">
                <i class="fas fa-user-plus me-1"></i>Issue Asset
              </button>
            </div>
          </div>
          
          <div class="row g-2">
            <!-- Row 3: Collect Asset + Maintenance -->
            <div class="col-6">
              <button class="btn btn-pink w-100" @click="navigateToCollectAsset">
                <i class="fas fa-user-minus me-1"></i>Collect Asset
              </button>
            </div>
            <div class="col-6">
              <button class="btn btn-orange w-100" @click="navigateToScheduleMaintenance">
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
                <fieldset class="btn-group flex-shrink-0" aria-label="View toggle">
                  <button 
                    :class="['btn', 'view-toggle', { active: currentView === 'list' }]"
                    @click="setView('list')"
                    style="min-width: 40px;"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button 
                    :class="['btn', 'view-toggle', { active: currentView === 'grid' }]"
                    @click="setView('grid')"
                    style="min-width: 40px;"
                  >
                    <i class="fas fa-th-large"></i>
                  </button>
                </fieldset>
                
                <!-- Data Management Dropdown -->
                <div class="dropdown more-actions-dropdown flex-fill">
                  <button 
                    class="btn btn-gray dropdown-toggle w-100" 
                    type="button" 
                    aria-expanded="false"
                    id="moreActionsDropdown"
                    @click="handleDropdownClick"
                  >
                    <i class="fas fa-cog me-1"></i>More Actions
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="moreActionsDropdown">
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
                <button class="btn btn-purple flex-fill" @click="navigateToAddAsset">
                  <i class="fas fa-plus me-1"></i>Add New Asset
                </button>
                
                <button class="btn btn-green flex-fill" @click="navigateToIssueAsset">
                  <i class="fas fa-user-plus me-1"></i>Issue Asset
                </button>
              </div>
            </div>
            
            <!-- Collect Asset + Schedule Maintenance -->
            <div class="col-md-12 col-lg-auto">
              <div class="d-flex gap-2 w-100">
                <button class="btn btn-pink flex-fill" @click="navigateToCollectAsset">
                  <i class="fas fa-user-minus me-1"></i>Collect Asset
                </button>
                <button class="btn btn-orange flex-fill" @click="navigateToScheduleMaintenance">
                  <i class="fas fa-wrench me-1"></i>Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Sort Bar -->
    <div class="row align-items-end mb-4">
      <div class="col-12 col-lg-6 mb-3">
        <label for="assets-search" class="form-label">Search Assets</label>
        <div class="search-input-container">
          <i class="fas fa-search search-icon"></i>
          <input
            id="assets-search"
            v-model="searchTerm"
            type="text"
            class="form-control search-input"
            placeholder="Search by ID, model, brand, or serial number..."
            @input="debouncedLoadAssets"
          />
        </div>
      </div>
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
      <div class="col-12 col-lg-3 mb-3">
        <div class="row g-3">
          <div class="col-2">
            <button class="btn btn-gray w-100 d-flex align-items-center justify-content-center" @click="toggleSortOrder" title="Toggle Sort Order">
              <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up', 'text-small-medium']"></i>
            </button>
          </div>
          <div class="col-6">
            <button
              class="btn btn-gray w-100 d-flex align-items-center justify-content-center gap-2 specs-toggle-btn"
              @click="toggleAllSpecifications"
              :title="areAllSpecsVisible ? 'Hide all specifications' : 'Show all specifications'"
            >
              <i class="fas specs-toggle-btn__icon" :class="areAllSpecsVisible ? 'fa-eye-slash' : 'fa-eye'"></i>
              <span class="fw-semibold text-nowrap">{{ areAllSpecsVisible ? 'Hide Specs' : 'Show Specs' }}</span>
            </button>
          </div>
          <div class="col-4">
            <button
              class="btn btn-filter w-100"
              :class="{ active: showFilterDropdown }"
              @click="toggleFilterDropdown"
            >
              <i class="fas fa-filter me-1"></i>Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFilterDropdown" class="mb-4 border rounded p-3 shadow-sm bg-white">
      <div class="d-flex flex-column flex-md-row gap-2">
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
        <div class="filter-clear-button-container">
          <div class="d-flex align-items-end h-100">
            <button class="btn btn-gray w-100" @click="clearFilters" title="Clear All Filters">
              <i class="fas fa-times me-1"></i>Clear
            </button>
          </div>
        </div>
      </div>
      <div v-if="selectedType" class="mt-3">
        <div v-if="specificationFields.length === 0" class="text-muted small mb-0">
          No specifications defined for the selected asset type.
        </div>
        <div v-else class="row g-3">
          <template v-for="field in specificationFields" :key="field.key || field.label">
            <div
              v-if="field.key"
              class="col-12 col-md-6 col-lg-4"
            >
              <SearchableDropdown
                v-if="isTextField(field)"
                :id="`specification-filter-${field.key}`"
                :label="field.label || formatLabel(field.key)"
                :placeholder="`Search ${field.label || formatLabel(field.key)}...`"
                :items="specSuggestions[field.key] || []"
                :loading="specSuggestionsLoading[field.key] || false"
                :remote-search="true"
                v-model="specificationFilterSelections[field.key]"
                @change="item => onSpecificationFieldChange(field.key!, item)"
                @search="text => onSpecificationSearch(field.key!, text)"
              />
              <SearchableDropdown
                v-else
                :id="`specification-filter-${field.key}`"
                :label="field.label || formatLabel(field.key)"
                :placeholder="`Filter by ${field.label || formatLabel(field.key)}...`"
                :items="specificationFieldOptions[field.key] || []"
                :disabled="(specificationFieldOptions[field.key] || []).length === 0"
                v-model="specificationFilterSelections[field.key]"
                @change="item => onSpecificationFieldChange(field.key!, item)"
              />
              <div
                v-if="!isTextField(field) && (specificationFieldOptions[field.key] || []).length === 0"
                class="text-muted small mt-1"
              >
                No values found for this specification.
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Assets/Inventory Content -->
    <div id="contentContainer">
      <!-- List View -->
      <div class="card" v-show="currentView === 'list'">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover asset-table mb-0">
              <thead class="table-light">
                <tr>
                  <th>Asset ID</th>
                  <th>Asset Details</th>
                  <th>Serial Number</th>
                  <th>Assigned To</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th class="text-start">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="asset in filteredAssets" :key="asset.id">
                  <!-- Main Asset Row -->
                  <tr 
                    class="asset-row"
                    :class="{ 
                      'expanded': expandedAssetIds.includes(asset.id),
                      'group-hover': hoveredGroupId === asset.id 
                    }"
                    :data-type="asset.type"
                    :data-brand="asset.brand"
                    :data-status="asset.status"
                    :data-location="asset.location"
                    @click="toggleAssetRow(asset.id)"
                    @mouseenter="setHoveredGroup(asset.id)"
                    @mouseleave="setHoveredGroup(null)"
                    style="cursor: pointer;"
                  >
                    <td><strong>{{ asset.id }}</strong></td>
                    <td>
                      <div style="line-height: 1.2;">
                        <strong style="color: var(--primary-black);">
                          {{ asset.model || 'Unknown Model' }}
                        </strong>
                        
                      </div>
                    </td>
                    <td>{{ asset.serialNumber }}</td>
                    <td>{{ asset.assignedTo || '-' }}</td>
                    <td>{{ getConditionText(asset.condition) }}</td>
                    <td>
                      <span :class="getStatusBadgeClass(asset.status)">{{ getStatusText(asset.status) }}</span>
                    </td>
                    <td class="text-start" @click.stop>
                      <div class="btn-group btn-group-sm asset-actions">
                        <button 
                          class="btn btn-action btn-brown" 
                          @click="viewAssetDetails(asset)"
                          :title="getViewButtonTitle(asset.status)"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button 
                          v-if="asset.status !== 'RETIRED'"
                          class="btn btn-action btn-purple" 
                          title="Edit Asset"
                          @click="editAsset(asset)"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          v-if="asset.status === 'NON_ASSIGNED'"
                          class="btn btn-action btn-green" 
                          title="Issue Asset"
                          @click="issueAsset(asset)"
                        >
                          <i class="fas fa-user-plus"></i>
                        </button>
                        <button 
                          v-if="asset.status === 'ASSIGNED'"
                          class="btn btn-action btn-pink" 
                          title="Collect Asset"
                          @click="collectAsset(asset)"
                        >
                          <i class="fas fa-user-minus"></i>
                        </button>
                        <button 
                          v-if="asset.status !== 'LOST' && asset.status !== 'ASSIGNED' && asset.status !== 'RETIRED'"
                          class="btn btn-action btn-orange" 
                          :title="getMaintenanceButtonTitle(asset.status)"
                          @click="handleMaintenanceAction(asset)"
                        >
                          <i :class="getMaintenanceButtonIcon(asset.status)"></i>
                        </button>
                        <button class="btn btn-action btn-gray" title="View QR Code">
                          <i class="fas fa-qrcode"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Specification Row -->
                  <tr 
                    v-if="expandedAssetIds.includes(asset.id)"
                    class="spec-row"
                    :class="{ 'group-hover': hoveredGroupId === asset.id }"
                    @click.stop="toggleAssetRow(asset.id)"
                    @mouseenter="setHoveredGroup(asset.id)"
                    @mouseleave="setHoveredGroup(null)"
                  >
                    <td colspan="7">
                      <div class="spec-row-content">
                        <span v-html="formatSpecifications(asset)"></span>
                      </div>
                    </td>
                  </tr>
                </template>
                
                <!-- No results row -->
                <tr v-if="filteredAssets.length === 0">
                  <td colspan="7" class="text-center py-4">
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
      <div v-show="currentView === 'grid'">
        <div class="row" v-if="filteredAssets.length > 0">
          <div 
            v-for="asset in filteredAssets" 
            :key="asset.id"
            class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4"
          >
            <div class="card h-100 asset-card-modern">
              <div class="card-body p-2">
                <!-- Header with icon, asset ID and status -->
                <div class="asset-card-header">
                  <div 
                    class="asset-card-icon rounded-circle d-flex align-items-center justify-content-center" 
                    :style="{ width: '36px', height: '36px', backgroundColor: getAssetTypeColor(asset.type) }"
                  >
                    <i :class="[getAssetTypeIconClass(asset.type), 'text-white', 'text-small-medium']"></i>
                  </div>
                  <div class="asset-card-main">
                    <div class="asset-card-top-row">
                      <h6 class="asset-card-id">{{ asset.id }}</h6>
                      <span class="asset-card-status" :class="getStatusBadgeClass(asset.status)">
                        {{ getStatusText(asset.status) }}
                      </span>
                    </div>
                    <p class="asset-card-subtitle">{{ asset.type }} - {{ asset.brand }}</p>
                  </div>
                </div>
                
                <!-- Asset Details - Custom layout -->
                <div class="mb-2">
                  <div class="row g-1">
                    <div class="col-12">
                      <small class="text-muted d-block">Model</small>
                      <div class="fw-medium text-truncate" style="color: var(--primary-black);">{{ asset.model }}</div>
                    </div>
                    <div class="col-12">
                      <small class="text-muted d-block">Serial</small>
                      <div class="text-truncate" style="color: var(--primary-black);">{{ asset.serialNumber }}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted d-block">Assigned To</small>
                      <div class="text-truncate" style="color: var(--primary-black);">{{ asset.assignedTo || 'Not Assigned' }}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted d-block">Condition</small>
                      <div class="text-truncate" style="color: var(--primary-black);">{{ getConditionText(asset.condition) }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="asset-actions-footer mt-auto pt-2 border-top">
                  <div class="d-flex justify-content-center gap-1">
                    <button 
                      class="btn btn-action btn-brown btn-sm" 
                      @click="viewAssetDetails(asset)"
                      :title="getViewButtonTitle(asset.status)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      v-if="asset.status !== 'RETIRED'"
                      class="btn btn-action btn-purple btn-sm" 
                      title="Edit Asset"
                      @click="editAsset(asset)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-if="asset.status === 'NON_ASSIGNED'"
                      class="btn btn-action btn-green btn-sm" 
                      title="Issue Asset"
                      @click="issueAsset(asset)"
                    >
                      <i class="fas fa-user-plus"></i>
                    </button>
                    <button 
                      v-if="asset.status === 'ASSIGNED'"
                      class="btn btn-action btn-pink btn-sm" 
                      title="Collect Asset"
                      @click="collectAsset(asset)"
                    >
                      <i class="fas fa-user-minus"></i>
                    </button>
                    <button 
                      v-if="asset.status !== 'LOST' && asset.status !== 'ASSIGNED' && asset.status !== 'RETIRED'"
                      class="btn btn-action btn-orange btn-sm" 
                      :title="getMaintenanceButtonTitle(asset.status)"
                      @click="handleMaintenanceAction(asset)"
                    >
                      <i :class="getMaintenanceButtonIcon(asset.status)"></i>
                    </button>
                    <button class="btn btn-action btn-gray btn-sm" title="View QR Code">
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
    <AppPagination 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      :start="paginationInfo.start"
      :end="paginationInfo.end"
      :total="paginationInfo.total"
      :item-name="'assets'"
      @change="goToPage"
    />

    <!-- Asset Detail Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showDetailModal }" 
      :style="{ display: showDetailModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="showDetailModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Asset Details{{ selectedAsset ? ` - ${selectedAsset.id}` : '' }}</h5>
            <button type="button" class="btn-close" @click="closeDetailModal"></button>
          </div>
          <div class="modal-body">
            <!-- Loading State -->
            <div v-if="isLoadingAssetDetails" class="text-center py-5">
              <div class="spinner-border text-primary">
                <output class="visually-hidden">Loading...</output>
              </div>
              <p class="mt-3 text-muted">Loading asset details...</p>
            </div>

            <!-- Asset Information - Compact Layout -->
            <div v-else-if="selectedAsset" class="row g-2 equal-height-columns">
              <!-- Left Column: Basic Info -->
              <div class="col-md-6">
                <div class="asset-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-info-circle me-2"></i>Basic Information</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <div class="info-label-compact">Asset ID</div>
                      <div class="info-value-compact fw-bold">{{ selectedAsset.id }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Category</div>
                      <div class="info-value-compact">{{ selectedAsset.category }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Asset Type & Brand</div>
                      <div class="info-value-compact fw-bold">{{ selectedAsset.type }} {{ selectedAsset.brand }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Model</div>
                      <div class="info-value-compact fw-bold">{{ selectedAsset.model || 'Unknown Model' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Serial Number</div>
                      <div class="info-value-compact font-monospace">{{ selectedAsset.serialNumber }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Condition</div>
                      <div class="info-value-compact">{{ getConditionText(selectedAsset.condition) }}</div>
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
                      <div class="info-label-compact">Current Location</div>
                      <div class="info-value-compact fw-bold">{{ selectedAsset.location }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Purchase Date</div>
                      <div class="info-value-compact">{{ selectedAsset.purchaseDate ? formatDate(selectedAsset.purchaseDate) : 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Purchase Cost</div>
                      <div class="info-value-compact">{{ selectedAsset.purchaseCost ? `₹${Number(selectedAsset.purchaseCost).toLocaleString()}` : 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Vendor</div>
                      <div class="info-value-compact">{{ selectedAsset.vendor }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Warranty Period</div>
                      <div class="info-value-compact">
                        <div v-if="selectedAsset.warrantyStartDate || selectedAsset.warrantyEndDate" class="warranty-info-compact">
                          <div v-if="selectedAsset.warrantyStartDate" class="warranty-row">
                            <span class="warranty-label">Start:</span>
                            <span class="warranty-value" style="color: var(--primary-black);">{{ formatDate(selectedAsset.warrantyStartDate) }}</span>
                          </div>
                          <div v-if="selectedAsset.warrantyEndDate" class="warranty-row">
                            <span class="warranty-label">End:</span>
                            <span class="warranty-value" style="color: var(--primary-black);">{{ formatDate(selectedAsset.warrantyEndDate) }}</span>
                          </div>
                          <div v-if="selectedAsset.warrantyEndDate" class="warranty-time">
                            <span class="warranty-time-text text-muted">{{ getWarrantyTimeLeft(selectedAsset.warrantyEndDate) }}</span>
                          </div>
                        </div>
                        <div v-else class="text-muted">Not specified</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Specifications -->
            <div v-if="selectedAsset?.specifications && Object.keys(selectedAsset.specifications).length > 0" class="row mt-2">
              <div class="col-12">
                <div class="asset-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-list-ul me-2"></i>Specifications</h6>
                  <div class="info-grid-compact">
                    <div
                      class="info-item-compact"
                      v-for="spec in getSpecificationEntries(selectedAsset?.specifications, selectedAsset?.specificationLabelMap)"
                      :key="`${spec.label}-${spec.value}`"
                    >
                      <div class="info-label-compact">{{ spec.label }}</div>
                      <div class="info-value-compact">{{ spec.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assignment Status & Information - Combined -->
            <div v-if="selectedAsset && selectedAsset.status !== 'RETIRED'" class="row mt-2">
              <div class="col-12">
                <div class="assignment-status-combined">
                  <h6 class="section-title-compact d-flex align-items-center justify-content-between clickable" 
                      @click="toggleAssignmentDetails">
                    <span><i :class="selectedAsset ? getStatusIcon(selectedAsset.status) : ''" class="me-2"></i>{{ selectedAsset ? getStatusSectionTitle(selectedAsset.status) : '' }}</span>
                    <i class="fas fa-chevron-down assignment-chevron" 
                       :class="{ 'rotated': isAssignmentDetailsExpanded }"
                       v-if="selectedAsset && (selectedAsset.status === 'ASSIGNED' || selectedAsset.status === 'IN_MAINTENANCE' || selectedAsset.status === 'LOST')"></i>
                  </h6>
                  
                  <!-- Basic Status Info -->
                  <div class="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                    <div class="d-flex align-items-center gap-3">
                      <div class="assignment-icon">
                        <i :class="selectedAsset ? getAssignmentIcon(selectedAsset.status) : ''" class="fa-lg"></i>
                      </div>
                      <div class="assignment-details">
                        <div class="d-flex align-items-center gap-3 mb-1">
                          <div>
                            <span class="text-muted text-small">Status:</span>
                            <span :class="selectedAsset ? getStatusBadgeClass(selectedAsset.status) : ''" class="ms-1">{{ selectedAsset ? getStatusText(selectedAsset.status) : '' }}</span>
                          </div>
                          <div>
                            <span class="text-muted text-small">{{ selectedAsset ? getStatusSecondaryLabel(selectedAsset.status) : '' }}</span>
                            <span class="ms-1 fw-medium text-small-medium">{{ selectedAsset ? getStatusSecondaryValue(selectedAsset) : '' }}</span>
                          </div>
                        </div>
                        <div class="text-muted text-small">{{ selectedAsset ? getAssignmentStatusDescription(selectedAsset.status) : '' }}</div>
                      </div>
                    </div>
                    <div class="qr-code-mini">
                      <i class="fas fa-qrcode fa-lg text-muted" title="QR Code Available"></i>
                    </div>
                  </div>
                  
                  <!-- Status Details (collapsible for ASSIGNED, IN_MAINTENANCE, LOST) -->
                  <div v-if="selectedAsset && ((selectedAsset.status === 'ASSIGNED' && (selectedAsset.assignmentReason || selectedAsset.assignmentNotes || selectedAsset.assignmentDate)) ||
                             (selectedAsset.status === 'IN_MAINTENANCE' && selectedAsset.notes) ||
                             (selectedAsset.status === 'LOST' && selectedAsset.notes))" 
                       v-show="isAssignmentDetailsExpanded" 
                       class="assignment-details-expanded">
                    <div class="row g-2">
                      <!-- ASSIGNED Status Details -->
                      <template v-if="selectedAsset && selectedAsset.status === 'ASSIGNED'">
                        <!-- Assignment Reason -->
                        <div class="col-md-6" v-if="selectedAsset.assignmentReason">
                          <div class="info-item-compact">
                            <div class="info-label-compact">Assignment Reason</div>
                            <div class="info-value-compact">{{ selectedAsset.assignmentReason }}</div>
                          </div>
                        </div>
                        
                        <!-- Assignment Date -->
                        <div class="col-md-6" v-if="selectedAsset.assignmentDate">
                          <div class="info-item-compact">
                            <div class="info-label-compact">Assignment Date</div>
                            <div class="info-value-compact">{{ formatDate(selectedAsset.assignmentDate) }}</div>
                          </div>
                        </div>
                        
                        <!-- Assigned By (only show if not system) -->
                        <div class="col-md-6" v-if="selectedAsset.assignedBy && selectedAsset.assignedBy !== 'system'">
                          <div class="info-item-compact">
                            <div class="info-label-compact">Assigned By</div>
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
                            <div class="info-label-compact">Assignment Notes</div>
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
                      </template>
                      
                      <!-- IN_MAINTENANCE Status Details -->
                      <template v-if="selectedAsset && selectedAsset.status === 'IN_MAINTENANCE'">
                        <div class="col-12">
                          <div class="alert alert-warning mb-0">
                            <i class="fas fa-wrench me-2"></i>
                            <strong>Maintenance Status:</strong> This asset is currently under maintenance. Check the maintenance records for detailed information.
                          </div>
                        </div>
                      </template>
                      
                      <!-- LOST Status Details -->
                      <template v-if="selectedAsset && selectedAsset.status === 'LOST'">
                        <div class="col-12">
                          <div class="alert alert-danger mb-0">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Lost Asset:</strong> This asset has been reported as lost. Please contact the administrator for further action.
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Retirement Information (if asset is retired) -->
            <div v-if="selectedAsset && selectedAsset.status === 'RETIRED'" class="row">
              <div class="col-12">
                <div class="retirement-status-combined">
                    <h6 class="section-title-compact d-flex align-items-center justify-content-between clickable" 
                        @click="toggleRetirementDetails">
                    <span><i class="fas fa-archive me-2"></i>Retirement Information</span>
                    <i class="fas fa-chevron-down retirement-chevron" 
                       :class="{ 'rotated': isRetirementDetailsExpanded }"
                       v-if="selectedAsset && selectedAsset.retirementNotes"></i>
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
                            <span class="text-muted text-small">Status:</span>
                            <span :class="selectedAsset ? getStatusBadgeClass(selectedAsset.status) : ''" class="ms-1">{{ selectedAsset ? getStatusText(selectedAsset.status) : '' }}</span>
                          </div>
                          <div>
                            <span class="text-muted text-small">Retirement Date:</span>
                            <span class="ms-1 fw-medium text-small-medium">{{ selectedAsset && selectedAsset.retirementDate ? formatDate(selectedAsset.retirementDate) : 'Not specified' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Retirement Details (only show if retirement notes exist) -->
                  <div v-if="selectedAsset && selectedAsset.retirementNotes" 
                       v-show="isRetirementDetailsExpanded" 
                       class="retirement-details-expanded">
                    <div class="row g-2">
                      <!-- Retirement Reason -->
                      <div class="col-md-6" v-if="selectedAsset && selectedAsset.retirementReason">
                        <div class="info-item-compact">
                          <div class="info-label-compact">Retirement Reason</div>
                          <div class="info-value-compact">{{ selectedAsset.retirementReason }}</div>
                        </div>
                      </div>
                      
                      <!-- Divider between retirement details and notes -->
                      <div class="col-12" v-if="selectedAsset && selectedAsset.retirementNotes">
                        <hr class="retirement-divider">
                      </div>
                      
                      <!-- Retirement Notes -->
                      <div class="col-12" v-if="selectedAsset && selectedAsset.retirementNotes">
                        <div class="info-item-compact">
                          <div class="info-label-compact">Retirement Notes</div>
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
            <div v-if="selectedAsset && selectedAsset.condition === 'REFURBISHED'" class="row mt-2">
              <div class="col-12">
                <div class="retirement-status-combined">
                      <h6 class="section-title-compact d-flex align-items-center justify-content-between clickable" 
                          @click="toggleRefurbishmentDetails">
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
                            <div v-if="selectedAsset && selectedAsset.retirementDate">
                              <small class="text-muted">Retirement Date</small>
                              <div class="fw-semibold">{{ formatDate(selectedAsset.retirementDate) }}</div>
                            </div>
                            <div v-if="selectedAsset && selectedAsset.reactivationDate">
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
                      <div v-if="selectedAsset && selectedAsset.retirementReason">
                        <div class="info-item-compact">
                          <div class="info-label-compact">Retirement Reason</div>
                          <div class="info-value-compact">{{ selectedAsset.retirementReason }}</div>
                        </div>
                      </div>
                      
                      <!-- Divider Line -->
                      <hr class="my-3 modal-divider" v-if="selectedAsset && selectedAsset.retirementReason && selectedAsset.reactivationReason">
                      
                      <!-- Reactivation Information -->
                      <div v-if="selectedAsset && selectedAsset.reactivationReason">
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
                    :notes="selectedAsset ? selectedAsset.notes : ''"
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
                <button type="button" class="btn btn-brown btn-sm" @click="selectedAsset ? viewAssetHistory(selectedAsset) : null">
                  <i class="fas fa-history me-1"></i>History
                </button>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-cancel btn-sm" @click="closeDetailModal">Close</button>
                <button v-if="selectedAsset && selectedAsset.status === 'NON_ASSIGNED'" type="button" class="btn btn-green btn-sm" @click="selectedAsset ? issueAsset(selectedAsset) : null">
                  <i class="fas fa-user-plus me-1"></i>Issue Asset
                </button>
                <button v-if="selectedAsset && selectedAsset.status === 'ASSIGNED'" type="button" class="btn btn-pink btn-sm" @click="selectedAsset ? collectAsset(selectedAsset) : null">
                  <i class="fas fa-user-minus me-1"></i>Collect Asset
                </button>
                <button 
                  v-if="selectedAsset && selectedAsset.status === 'NON_ASSIGNED'"
                  type="button" 
                  class="btn btn-orange btn-sm" 
                  @click="selectedAsset ? handleMaintenanceAction(selectedAsset) : null"
                >
                  <i class="fas fa-wrench me-1"></i>Schedule Maintenance
                </button>
              <button type="button" class="btn btn-purple btn-sm" @click="selectedAsset ? editAsset(selectedAsset) : null" :disabled="!selectedAsset">
                <i class="fas fa-edit me-1"></i>Edit Asset
              </button>
              <button v-if="selectedAsset && selectedAsset.status === 'NON_ASSIGNED'" type="button" class="btn btn-red btn-sm" @click="openRetireAssetModal">
                <i class="fas fa-archive me-1"></i>Retire Asset
              </button>
              <button v-if="selectedAsset && selectedAsset.status === 'RETIRED'" type="button" class="btn btn-green btn-sm" @click="openReactivateAssetModal">
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
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-archive me-2"></i>Retire Asset - {{ assetToRetire?.id }}
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
                          <div class="info-label-compact">Asset ID</div>
                          <div class="info-value-compact fw-bold">{{ assetToRetire?.id }}</div>
                        </div>
                        <div class="info-item-compact">
                          <div class="info-label-compact">Asset Type & Brand</div>
                          <div class="info-value-compact">{{ assetToRetire?.type }} - {{ assetToRetire?.brand }}</div>
                        </div>
                        <div class="info-item-compact">
                          <div class="info-label-compact">Model</div>
                          <div class="info-value-compact">{{ assetToRetire?.model }}</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="info-item-compact">
                          <div class="info-label-compact">Serial Number</div>
                          <div class="info-value-compact font-monospace">{{ assetToRetire?.serialNumber }}</div>
                        </div>
                        <div class="info-item-compact">
                          <div class="info-label-compact">Current Status</div>
                          <div class="info-value-compact">
                            <span :class="getStatusBadgeClass(assetToRetire?.status || '')">{{ getStatusText(assetToRetire?.status || '') }}</span>
                          </div>
                        </div>
                        <div class="info-item-compact">
                          <div class="info-label-compact">Current Location</div>
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
                          <DatePicker
                            id="retirementDate"
                            label="Retirement Date"
                            v-model="retireFormData.retirementDate"
                            :max="todayDate"
                            :error-message="!retireFormValidation.retirementDate.isValid ? retireFormValidation.retirementDate.message : ''"
                            help-text="Date must be today or in the past"
                            required
                            @change="validateRetirementDate"
                            @blur="validateRetirementDate"
                          />
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
            <button type="button" class="btn btn-cancel btn-sm" @click="closeRetireAssetModal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-red btn-sm" 
              @click="retireAsset" 
              :disabled="isRetiringAsset"
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
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-power-off me-2"></i>Reactivate Asset - {{ assetToReactivate?.id }}
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
                      <h6 class="section-title-compact d-flex align-items-center justify-content-between clickable" 
                          @click="toggleReactivateAssetSummary">
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
                              <span class="text-muted text-small">Asset ID:</span>
                              <span class="ms-1 fw-bold text-small-medium">{{ assetToReactivate?.id }}</span>
                            </div>
                            <div>
                              <span class="text-muted text-small">Status:</span>
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
                            <div class="info-label-compact">Asset Type</div>
                            <div class="info-value-compact">{{ assetToReactivate?.type }}</div>
                          </div>
                        </div>
                        
                        <!-- Brand & Model -->
                        <div class="col-md-6">
                          <div class="info-item-compact">
                            <div class="info-label-compact">Brand & Model</div>
                            <div class="info-value-compact">{{ assetToReactivate?.brand }} {{ assetToReactivate?.model }}</div>
                          </div>
                        </div>
                        
                        <!-- Serial Number -->
                        <div class="col-md-6">
                          <div class="info-item-compact">
                            <div class="info-label-compact">Serial Number</div>
                            <div class="info-value-compact font-monospace">{{ assetToReactivate?.serialNumber }}</div>
                          </div>
                        </div>
                        
                        <!-- Current Condition -->
                        <div class="col-md-6">
                          <div class="info-item-compact">
                            <div class="info-label-compact">Current Condition</div>
                            <div class="info-value-compact">
                              <span :class="getConditionBadgeClass(assetToReactivate?.condition || 'NEEDS_REPAIR')">{{ getConditionText(assetToReactivate?.condition || 'NEEDS_REPAIR') }}</span>
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
                            <div class="info-label-compact">Retirement Reason</div>
                            <div class="info-value-compact">{{ assetToReactivate?.retirementReason }}</div>
                          </div>
                        </div>
                        
                        <!-- Retirement Date -->
                        <div class="col-md-6" v-if="assetToReactivate?.retirementDate">
                          <div class="info-item-compact">
                            <div class="info-label-compact">Retirement Date</div>
                            <div class="info-value-compact">{{ formatDate(assetToReactivate?.retirementDate) }}</div>
                          </div>
                        </div>
                        
                        <!-- Retirement Notes -->
                        <div class="col-12" v-if="assetToReactivate?.retirementNotes">
                          <div class="info-item-compact">
                            <div class="info-label-compact">Retirement Notes</div>
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
                          <DatePicker
                            id="reactivationDate"
                            label="Reactivation Date"
                            v-model="reactivateFormData.reactivationDate"
                            :error-message="reactivateFormSubmitted && reactivateFormValidation.reactivationDate === 'invalid' ? 'Please select a valid reactivation date.' : ''"
                            help-text="Date when asset returns to active status"
                            required
                            @change="() => { if (reactivateFormSubmitted) validateReactivateDate() }"
                            @blur="() => { if (reactivateFormSubmitted) validateReactivateDate() }"
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <SearchableDropdown
                            id="newLocation"
                            label="New Location"
                            :items="reactivationLocationOptions"
                            v-model="selectedReactivationLocation"
                            placeholder="Select location"
                            required
                            @change="onReactivationLocationChange"
                          />
                          <div v-if="reactivateFormSubmitted && reactivateFormValidation.location === 'invalid'" class="text-danger small mt-1">
                            {{ reactivateFormValidation.locationMessage || 'Please select a location.' }}
                          </div>
                          <div class="form-text">Where the asset will be stored/used</div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="newCondition" class="form-label">Current Condition <span class="text-danger">*</span></label>
                          <input 
                            type="text" 
                            class="form-control readonly-input" 
                            id="newCondition"
                            value="Refurbished"
                            readonly
                          >
                          <div class="form-text">Asset condition after refurbishment and repairs</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="newStatus" class="form-label">New Status <span class="text-danger">*</span></label>
                          <input 
                            type="text" 
                            class="form-control readonly-input" 
                            id="newStatus"
                            value="Non Assigned"
                            readonly
                          >
                          <div class="form-text">Status after reactivation</div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <label for="reactivationReason" class="form-label">
                          Reactivation Reason <span class="text-danger">*</span>
                        </label>
                        <textarea
                          id="reactivationReason"
                          class="form-control"
                          :class="{ 'is-invalid': reactivateFormSubmitted && reactivateFormValidation.reactivationReason === 'invalid', 'is-valid': reactivateFormSubmitted && reactivateFormValidation.reactivationReason === 'valid' }"
                          v-model="reactivateFormData.reactivationReason"
                          placeholder="Describe why this asset is being reactivated and what repairs/improvements were made..."
                          rows="3"
                          maxlength="1000"
                          required
                          @input="() => { if (reactivateFormSubmitted) validateReactivateReason() }"
                          @blur="() => { if (reactivateFormSubmitted) validateReactivateReason() }"
                        ></textarea>
                        <div class="form-text">Explain why the asset is being reactivated (max 1000 characters)</div>
                        <div class="character-count text-end">
                          <small :class="{ 'text-danger': reactivateFormData.reactivationReason.length > 900, 'text-warning': reactivateFormData.reactivationReason.length > 750, 'text-muted': reactivateFormData.reactivationReason.length <= 750 }">
                            {{ reactivateFormData.reactivationReason.length }}/1000 characters
                          </small>
                        </div>
                        <div v-if="reactivateFormSubmitted && reactivateFormValidation.reactivationReason === 'invalid'" class="invalid-feedback d-block">
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
            <button type="button" class="btn btn-cancel btn-sm" @click="closeReactivateAssetModal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-green btn-sm" 
              @click="reactivateAsset"
              :disabled="isReactivatingAsset"
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
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from 'date-fns'
import { assetService } from '../../services/business/assetService'
import { assetTypeService } from '../../services/api/assetTypeService'
import type { Asset, AssetQueryParams, FilterOptions, DetailedAsset, SpecificationFieldDefinition } from '../../types/asset.types'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'
import NotesDisplay from '@/components/common/NotesDisplay.vue'
import NotesTextarea from '@/components/common/NotesTextarea.vue'
import DatePicker from '@/components/ui/date/DatePicker.vue'
import BulkAssetUpload from './BulkAssetUpload.vue'
import AppPagination from '@/components/ui/pagination/AppPagination.vue'

const router = useRouter()
const route = useRoute()

const buildReturnToParam = () => encodeURIComponent(route.fullPath || '/app/assets')
const toastStore = useToastStore()

// Local types for display (optimized for table)
interface AssetDisplayItem {
  id: string
  type: string
  brand: string
  model: string
  serialNumber: string
  status: 'NON_ASSIGNED' | 'ASSIGNED' | 'IN_MAINTENANCE' | 'RETIRED' | 'LOST' | 'DONATED'
  assignedTo?: string
  condition: string
  specifications?: Record<string, any>
  specificationLabelMap?: Record<string, string>
  // Additional fields for modal (populated when viewing details)
  purchaseDate?: string
  location?: string
  category?: string
  purchaseCost?: number
  vendor?: string
  warrantyEndDate?: string
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
const sortAscending = ref(false)
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
// Specification display state
const expandedAssetIds = ref<string[]>([])
/** When user uses Show/Hide all specs, keep that behavior for every new result set (filter, sort, search, page). */
type SpecsListMode = 'expand-all' | 'collapse-all' | 'per-row'
const specsListMode = ref<SpecsListMode>('per-row')
const hoveredGroupId = ref<string | null>(null)
const specificationFields = ref<SpecificationFieldDefinition[]>([])
const specificationFilterSelections = reactive<Record<string, Item | null>>({})
const specSuggestions = reactive<Record<string, Item[]>>({})
const specSuggestionsLoading = reactive<Record<string, boolean>>({})
const specSearchTimeouts = reactive<Record<string, ReturnType<typeof setTimeout>>>({})
const isLoadingAssetDetails = ref(false)
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
  status: 'NON_ASSIGNED',
  location: '',
  reactivationReason: ''
})

// Note: Condition and Status are now fixed values (REFURBISHED and NON_ASSIGNED)
// No dropdown selections needed for reactivation modal

// Reactivate form validation
const reactivateFormValidation = ref({
  reactivationDate: 'valid',
  condition: 'valid',
  status: 'valid',
  location: 'valid',
  reactivationReason: 'valid',
  locationMessage: '' // Error message for location validation
})

// Track if reactivation form has been submitted (for validation display)
const reactivateFormSubmitted = ref(false)

// Date constraints
const todayDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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
  { id: 'NON_ASSIGNED', name: 'Non Assigned', value: 'NON_ASSIGNED' },
  { id: 'ASSIGNED', name: 'Assigned', value: 'ASSIGNED' },
  { id: 'IN_MAINTENANCE', name: 'In Maintenance', value: 'IN_MAINTENANCE' },
  { id: 'RETIRED', name: 'Retired', value: 'RETIRED' },
  { id: 'LOST', name: 'Lost', value: 'LOST' },
  { id: 'DONATED', name: 'Donated', value: 'DONATED' }
])

// Condition options for dropdown
const conditionOptions = ref<Item[]>([
  { id: 'NEW', name: 'New', value: 'NEW' },
  { id: 'WORKING_CONDITION', name: 'Working Condition', value: 'WORKING_CONDITION' },
  { id: 'SOFTWARE_ISSUE', name: 'Software Issue', value: 'SOFTWARE_ISSUE' },
  { id: 'HARDWARE_ISSUE', name: 'Hardware Issue', value: 'HARDWARE_ISSUE' },
  { id: 'NEEDS_REPAIR', name: 'Needs Repair', value: 'NEEDS_REPAIR' },
  { id: 'TRASH', name: 'Trash', value: 'TRASH' },
  { id: 'REFURBISHED', name: 'Refurbished', value: 'REFURBISHED' }
])

// Reactivation location options
const reactivationLocationOptions = ref<Item[]>([
  { id: 'PUNE_INVENTORY_CENTER', name: 'Pune Inventory Center', value: 'PUNE_INVENTORY_CENTER' },
  { id: 'THANE_INVENTORY_CENTER', name: 'Thane Inventory Center', value: 'THANE_INVENTORY_CENTER' }
])

const selectedReactivationLocation = ref<Item | null>(null)

const onReactivationLocationChange = (item: Item | null) => {
  selectedReactivationLocation.value = item
  reactivateFormData.value.location = item ? String(item.id) : ''
  if (reactivateFormSubmitted.value) {
    validateReactivateLocation()
  }
}

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
const specificationFiltersPayload = computed<Record<string, string>>(() => {
  const payload: Record<string, string> = {}
  for (const [key, item] of Object.entries(specificationFilterSelections)) {
    if (item?.value) {
      payload[key] = String(item.value)
    }
  }
  return payload
})

const normalizeSpecificationValue = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') {
    return null
  }
  if (Array.isArray(value)) {
    return value
      .map(entry => (entry === null || entry === undefined ? '' : String(entry)))
      .filter(Boolean)
      .join(', ')
  }
  return String(value)
}

const assetMatchesSpecificationFilters = (asset: AssetDisplayItem, excludeKey?: string) => {
  for (const [key, item] of Object.entries(specificationFilterSelections)) {
    if (!item || key === excludeKey) continue
    const assetValue = normalizeSpecificationValue(asset.specifications?.[key])
    if (assetValue !== item.value) {
      return false
    }
  }
  return true
}

const getAssetsForSpecificationField = (excludeKey?: string) => {
  return displayAssets.value.filter(asset => {
    if (selectedType.value && asset.type !== selectedType.value.name) {
      return false
    }
    if (selectedBrand.value && asset.brand !== selectedBrand.value.name) {
      return false
    }
    return assetMatchesSpecificationFilters(asset, excludeKey)
  })
}

const createSpecificationItem = (fieldKey: string, value: string): Item => ({
  id: `${fieldKey}-${value}`,
  name: value,
  value: value
})

const addAssetValuesToMap = (valuesMap: Map<string, Item>, fieldKey: string, assets: AssetDisplayItem[]) => {
  for (const asset of assets) {
    const rawValue = normalizeSpecificationValue(asset.specifications?.[fieldKey])
    if (rawValue && !valuesMap.has(rawValue)) {
      valuesMap.set(rawValue, createSpecificationItem(fieldKey, rawValue))
    }
  }
}

const addFieldOptionsToMap = (valuesMap: Map<string, Item>, fieldKey: string, options: (string | { value?: string })[]) => {
  for (const option of options) {
    const optionValue = typeof option === 'string' ? option : option?.value
    if (optionValue && !valuesMap.has(optionValue)) {
      valuesMap.set(optionValue, createSpecificationItem(fieldKey, optionValue))
    }
  }
}

const buildOptionsForField = (field: SpecificationFieldDefinition): Item[] => {
  if (!field.key) {
    return []
  }

  const valuesMap = new Map<string, Item>()
  const relevantAssets = getAssetsForSpecificationField(field.key)

  addAssetValuesToMap(valuesMap, field.key, relevantAssets)

  if (Array.isArray(field.options)) {
    addFieldOptionsToMap(valuesMap, field.key, field.options)
  }

  return Array.from(valuesMap.values())
}

const specificationFieldOptions = computed<Record<string, Item[]>>(() => {
  const optionsMap: Record<string, Item[]> = {}

  for (const field of specificationFields.value) {
    if (field.key) {
      optionsMap[field.key] = buildOptionsForField(field)
    }
  }

  return optionsMap
})

watch(specificationFieldOptions, newOptions => {
  let selectionChanged = false
  for (const [key, item] of Object.entries(specificationFilterSelections)) {
    if (!item) continue
    const options = newOptions[key] || []
    const exists = options.some(option => option.value === item.value)
    if (!exists) {
      specificationFilterSelections[key] = null
      selectionChanged = true
    }
  }

  if (selectionChanged) {
    debouncedLoadAssets()
  }
})

const clearSpecificationState = () => {
  specificationFields.value = []
  for (const key of Object.keys(specificationFilterSelections)) {
    delete specificationFilterSelections[key]
  }
  for (const key of Object.keys(specSuggestions)) {
    delete specSuggestions[key]
  }
  for (const key of Object.keys(specSuggestionsLoading)) {
    delete specSuggestionsLoading[key]
  }
  for (const key of Object.keys(specSearchTimeouts)) {
    clearTimeout(specSearchTimeouts[key])
    delete specSearchTimeouts[key]
  }
}

const resetSpecificationSelections = () => {
  for (const key of Object.keys(specificationFilterSelections)) {
    specificationFilterSelections[key] = null
  }
}

const loadSpecificationFieldsForType = async (item: Item | null) => {
  clearSpecificationState()
  if (!item?.value) {
    return
  }

  try {
    const response = await assetTypeService.getAssetTypeById(Number(item.value))
    let template = response.data.assetType?.specificationTemplate

    if (typeof template === 'string') {
      try {
        template = JSON.parse(template)
      } catch (error) {
        console.error('Failed to parse specification template JSON:', error)
        template = undefined
      }
    }

    const fields: SpecificationFieldDefinition[] = Array.isArray(template?.fields)
      ? template.fields.filter((field: SpecificationFieldDefinition) => Boolean(field?.key))
      : []

    specificationFields.value = fields
    for (const field of fields) {
      if (field.key) {
        specificationFilterSelections[field.key] = null
      }
    }
  } catch (error) {
    console.error('Error loading specification template:', error)
    specificationFields.value = []
  }
}

const onSpecificationFieldChange = (fieldKey: string, item: Item | null) => {
  if (!fieldKey) return
  specificationFilterSelections[fieldKey] = item
  debouncedLoadAssets()
}

const isTextField = (field: SpecificationFieldDefinition): boolean => {
  if (field.type === 'select' || field.type === 'dropdown') return false
  if (Array.isArray(field.options) && field.options.length > 0) return false
  return true
}

const onSpecificationSearch = (fieldKey: string, searchText: string) => {
  if (specSearchTimeouts[fieldKey]) {
    clearTimeout(specSearchTimeouts[fieldKey])
  }

  if (!searchText.trim()) {
    specSuggestions[fieldKey] = []
    specSuggestionsLoading[fieldKey] = false
    return
  }

  specSuggestionsLoading[fieldKey] = true

  specSearchTimeouts[fieldKey] = setTimeout(async () => {
    try {
      const assetTypeId = selectedType.value ? Number(selectedType.value.value) : null
      if (!assetTypeId) {
        specSuggestions[fieldKey] = []
        return
      }
      const values = await assetService.getSpecificationValues(assetTypeId, fieldKey, searchText)
      specSuggestions[fieldKey] = values.map(val => ({
        id: `${fieldKey}-${val}`,
        name: val,
        value: val
      }))
    } catch (error) {
      console.error(`Error fetching specification values for ${fieldKey}:`, error)
      specSuggestions[fieldKey] = []
    } finally {
      specSuggestionsLoading[fieldKey] = false
    }
  }, 300)
}

const hasActiveFilters = computed(() => {
  return (
    selectedType.value !== null ||
    selectedBrand.value !== null ||
    selectedStatus.value !== null ||
    selectedCondition.value !== null ||
    Object.keys(specificationFiltersPayload.value).length > 0
  )
})

const areAllSpecsVisible = computed(() => {
  const rows = filteredAssets.value
  if (rows.length === 0) return false
  const expanded = new Set(expandedAssetIds.value)
  return rows.every((asset) => expanded.has(asset.id))
})

// API Methods
const getActiveAssetFilters = (): AssetQueryParams => {
  const params: AssetQueryParams = {
    search: searchTerm.value || undefined,
    assetTypeId: selectedType.value
      ? Number.parseInt(selectedType.value.value as string)
      : undefined,
    brandId: selectedBrand.value
      ? Number.parseInt(selectedBrand.value.value as string)
      : undefined,
    status: (selectedStatus.value?.value as any) || undefined,
    condition: (selectedCondition.value?.value as any) || undefined,
    sortBy: (selectedSortBy.value?.value as string) || 'assetId',
    sortOrder: sortAscending.value ? 'asc' : 'desc',
  }

  const specFilters = specificationFiltersPayload.value
  if (Object.keys(specFilters).length > 0) {
    params.specificationFilters = specFilters
  }

  return params
}

const loadAssets = async () => {
  try {
    isLoading.value = true
    
    const params: AssetQueryParams = {
      ...getActiveAssetFilters(),
      page: currentPage.value,
      limit: itemsPerPage.value,
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

// Transform detailed asset data for modal display
const transformDetailedAssetForModal = (detailedAsset: DetailedAsset): AssetDisplayItem => {
  // Get current assignment info from the latest asset issue (only if not returned)
  const currentAssignment = detailedAsset.assetIssues?.find(issue => !issue.returnDate)
  
  const templateFields = detailedAsset.assetType?.specificationTemplate?.fields ?? []
  const labelMap: Record<string, string> = {}
  for (const field of templateFields) {
    if (field?.key) {
      labelMap[field.key] = field.label || formatLabel(field.key)
    }
  }
  
  return {
    id: detailedAsset.assetId,
    type: detailedAsset.assetType.name,
    brand: detailedAsset.brand.name,
    model: detailedAsset.model.name,
    serialNumber: detailedAsset.serialNumber,
    status: detailedAsset.status as any,
    assignedTo: currentAssignment ? `${currentAssignment.employee?.firstName} ${currentAssignment.employee?.lastName}` : undefined,
    condition: detailedAsset.condition,
    specifications: detailedAsset.specifications || undefined,
    specificationLabelMap: Object.keys(labelMap).length > 0 ? labelMap : undefined,
    // Additional fields for modal
    purchaseDate: detailedAsset.purchaseDate || '',
    location: detailedAsset.location || 'Not specified',
    category: detailedAsset.assetType.category.name,
    purchaseCost: detailedAsset.purchaseCost || undefined,
    vendor: detailedAsset.vendor?.name || 'Not specified',
    warrantyEndDate: detailedAsset.warrantyEndDate || '',
    warrantyStartDate: detailedAsset.warrantyStartDate,
    notes: detailedAsset.notes,
    // Assignment details from current assignment
    assignmentReason: currentAssignment?.issueReason,
    assignmentNotes: currentAssignment?.notes,
    assignmentDate: currentAssignment?.issueDate,
    assignedBy: currentAssignment?.issuedByUser?.name || 'system',
    // Retirement details from API
    retirementDate: detailedAsset.retirementDate,
    retirementReason: detailedAsset.retirementReason,
    retirementNotes: detailedAsset.retirementNotes,
    // Reactivation details from API
    reactivationDate: detailedAsset.reactivationDate,
    reactivationReason: detailedAsset.reactivationReason
  }
}

// Set default view based on screen size
const setDefaultView = () => {
  const screenWidth = window.innerWidth
  
  if (screenWidth < 768) { // sm breakpoint (768px)
    currentView.value = 'grid'
  } else {
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
  clearSpecificationState()
  loadAssets() // Reload with cleared filters
}

// Change handlers for searchable dropdowns
const onAssetTypeChange = async (item: Item | null) => {
  selectedType.value = item
  await loadSpecificationFieldsForType(item)
  debouncedLoadAssets()
}

const onBrandChange = (item: Item | null) => {
  selectedBrand.value = item
  resetSpecificationSelections()
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

const viewAssetDetails = async (asset: AssetDisplayItem) => {
  try {
    // Find the original asset by matching the display asset ID (which is the assetId field)
    const originalAsset = assets.value.find(a => a.assetId === asset.id)
    if (!originalAsset) {
      console.error('Could not find original asset with assetId:', asset.id)
      toastStore.showError('Error', 'Could not load asset details')
      return
    }

    // Show modal and loading state
    showDetailModal.value = true
    isLoadingAssetDetails.value = true
    selectedAsset.value = null // Clear previous data
    
    // Reset collapse states
    isAssignmentDetailsExpanded.value = false
    isRetirementDetailsExpanded.value = false
    isRefurbishmentDetailsExpanded.value = false

    // Fetch detailed asset data
    const response = await assetService.getAssetById(originalAsset.id)
    const detailedAsset = response.data.asset
    
    // Transform the detailed asset data for the modal
    selectedAsset.value = transformDetailedAssetForModal(detailedAsset as DetailedAsset)
    
  } catch (error) {
    console.error('Error loading asset details:', error)
    toastStore.showError('Error', 'Failed to load asset details')
    showDetailModal.value = false
  } finally {
    isLoadingAssetDetails.value = false
  }
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
  
  // Parse the date string (format: YYYY-MM-DD)
  const selectedDate = new Date(date)
  const today = new Date()
  
  // Set both dates to midnight for accurate comparison
  selectedDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  // Check if date is in the future
  if (selectedDate > today) {
    retireFormValidation.value.retirementDate.isValid = false
    retireFormValidation.value.retirementDate.message = 'Retirement date must be today or in the past'
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

    // Export using the exact same filters as the current assets list
    await assetService.exportAssetsToExcel(getActiveAssetFilters())
  } catch (error) {
    console.error('Error exporting assets:', error)
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Error exporting assets. Please try again.'
    toastStore.showError('Export Failed', message)
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
          assetTypeId: Number.parseInt(assetData.assetTypeId) || 1, // Default to 1 if not provided
          brandId: Number.parseInt(assetData.brandId) || 1, // Default to 1 if not provided
          modelId: Number.parseInt(assetData.modelId) || 1, // Default to 1 if not provided
          vendorId: Number.parseInt(assetData.vendorId) || 1, // Default to 1 if not provided
          status: assetData.status || 'NON_ASSIGNED',
          condition: assetData.condition || 'NEW',
          location: assetData.location || 'PUNE_INVENTORY_CENTER',
          purchaseDate: assetData.purchaseDate || undefined,
          purchaseCost: Number.parseFloat(assetData.purchaseCost) || undefined,
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
      toastStore.showSuccess('Upload Completed', `Successfully imported ${successCount} assets`)
    } else {
      // Build error details step by step to avoid nested template literals and ternary operators
      let errorDetails = ''
      
      if (errors.length > 0) {
        const firstFiveErrors = errors.slice(0, 5).join('\n')
        const remainingErrorCount = errors.length - 5
        const moreErrorsText = remainingErrorCount > 0 ? `\n... and ${remainingErrorCount} more errors` : ''
        
        errorDetails = `\n\nErrors:\n${firstFiveErrors}${moreErrorsText}`
      }
      
      const warningMessage = `Successfully imported: ${successCount} assets, Errors: ${errorCount}.${errorDetails}`
      toastStore.showWarning('Upload Completed with Errors', warningMessage)
    }
    
    // Reload assets to show new data
    await loadAssets()
    
  } catch (error) {
    console.error('Error uploading assets:', error)
    toastStore.showError('Upload Failed', 'Error uploading assets. Please check the data and try again.')
  } finally {
    isLoading.value = false
  }
}

const handleTemplateDownload = (type: 'csv' | 'excel') => {
  // Both CSV and Excel templates use the same method
  assetService.downloadBulkUploadTemplate()
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
  router.push({
    path: '/app/assets/issue',
    query: { from: 'assets', returnTo: buildReturnToParam() },
  })
}

const navigateToCollectAsset = () => {
  router.push({
    path: '/app/assets/collect',
    query: { from: 'assets', returnTo: buildReturnToParam() },
  })
}

const navigateToScheduleMaintenance = () => {
  router.push('/app/maintenance/schedule')
}

const issueAsset = (asset: AssetDisplayItem) => {
  // Store selected asset info in localStorage for pre-population
  localStorage.setItem('selectedAssetId', asset.id)
  localStorage.setItem('selectedAssetType', asset.type)
  
  // Navigate to issue asset form
  router.push({
    path: '/app/assets/issue',
    query: { from: 'assets', returnTo: buildReturnToParam() },
  })
}

const collectAsset = (asset: AssetDisplayItem) => {
  // Store selected asset info in localStorage for pre-population
  localStorage.setItem('selectedAssetId', asset.id)
  localStorage.setItem('currentEmployee', asset.assignedTo || '')
  
  // Navigate to collect asset form
  router.push({
    path: '/app/assets/collect',
    query: { from: 'assets', returnTo: buildReturnToParam() },
  })
}

const handleMaintenanceAction = (asset: AssetDisplayItem) => {
  if (asset.status === 'IN_MAINTENANCE') {
    // Redirect to Maintenance list with assetId prefilled in search
    router.push({
      path: '/app/maintenance',
      query: { search: asset.id }
    })
  } else {
    // If asset is not in maintenance, navigate to schedule new maintenance with asset pre-selected
    localStorage.setItem('selectedAssetForMaintenance', asset.id)
    localStorage.setItem('selectedAssetType', asset.type)
    router.push({ path: '/app/maintenance/schedule', query: { assetId: asset.id } })
  }
}

// Helper: Close all dropdowns except the specified one
const closeOtherDropdowns = (currentDropdown: HTMLElement, currentButton: HTMLButtonElement) => {
  for (const menu of document.querySelectorAll('.dropdown-menu.show')) {
    if (menu !== currentDropdown) {
      menu.classList.remove('show')
    }
  }
  for (const btn of document.querySelectorAll('[aria-expanded="true"]')) {
    if (btn !== currentButton) {
      btn.setAttribute('aria-expanded', 'false')
    }
  }
}

// Helper: Position More Actions dropdown
const positionMoreActionsDropdown = (dropdown: HTMLElement, button: HTMLButtonElement) => {
  setTimeout(() => {
    const buttonRect = button.getBoundingClientRect()
    const dropdownRect = dropdown.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    
    // Set default positioning
    dropdown.style.top = '100%'
    dropdown.style.bottom = 'auto'
    dropdown.style.left = '0'
    dropdown.style.right = 'auto'
    dropdown.style.marginTop = '0'
    dropdown.style.marginBottom = '0'
    dropdown.style.transformOrigin = 'top center'
    dropdown.style.transform = 'translateY(0) scale(1)'
    
    // Adjust if going off the right side
    if (buttonRect.left + dropdownRect.width > viewportWidth) {
      dropdown.style.left = 'auto'
      dropdown.style.right = '0'
    }
    
    // Adjust if going off the left side
    if (buttonRect.right - dropdownRect.width < 0) {
      dropdown.style.right = 'auto'
      dropdown.style.left = '0'
    }
  }, 10)
}

// Helper: Position standard dropdown
const positionStandardDropdown = (dropdown: HTMLElement) => {
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

// Handle dropdown click with proper positioning and smooth animation
const handleDropdownClick = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const button = event.currentTarget as HTMLButtonElement
  const dropdown = button.nextElementSibling as HTMLElement
  const dropdownContainer = button.closest('.more-actions-dropdown') as HTMLElement
  
  if (!dropdown) return
  
  closeOtherDropdowns(dropdown, button)
  
  const isShown = dropdown.classList.contains('show')
  
  if (isShown) {
    // Close dropdown with animation
    dropdown.classList.remove('show')
    button.setAttribute('aria-expanded', 'false')
  } else {
    // Open dropdown with animation
    dropdown.classList.add('show')
    button.setAttribute('aria-expanded', 'true')
    
    // Position dropdown based on type
    if (dropdownContainer?.classList.contains('more-actions-dropdown')) {
      positionMoreActionsDropdown(dropdown, button)
    } else {
      positionStandardDropdown(dropdown)
    }
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown')) {
    for (const menu of document.querySelectorAll('.dropdown-menu.show')) {
      menu.classList.remove('show')
    }
    for (const btn of document.querySelectorAll('[aria-expanded="true"]')) {
      btn.setAttribute('aria-expanded', 'false')
    }
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
    toastStore.showSuccess('Asset Retired', `Asset ${assetToRetire.value.id} has been successfully retired.`)

    // Close modal and refresh data
    closeRetireAssetModal()
    await loadAssets()

  } catch (error) {
    console.error('Error retiring asset:', error)
    toastStore.showError('Retirement Failed', 'Error retiring asset. Please try again.')
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
  reactivateFormData.value.status = 'NON_ASSIGNED' // Fixed value
  reactivateFormData.value.location = 'PUNE_INVENTORY_CENTER'
  selectedReactivationLocation.value = reactivationLocationOptions.value.find(item => item.id === 'PUNE_INVENTORY_CENTER') || null
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
    status: 'NON_ASSIGNED', // Fixed value
    location: 'PUNE_INVENTORY_CENTER',
    reactivationReason: ''
  }
  selectedReactivationLocation.value = null
}

const clearReactivateFormValidation = () => {
  reactivateFormValidation.value = {
    reactivationDate: 'valid',
    condition: 'valid',
    status: 'valid',
    location: 'valid',
    reactivationReason: 'valid',
    locationMessage: ''
  }
  reactivateFormSubmitted.value = false
}

const reactivateAsset = async () => {
  if (!assetToReactivate.value) return

  // Mark form as submitted to show validation errors
  reactivateFormSubmitted.value = true

  // Validate form
  if (!validateReactivateForm()) {
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
    toastStore.showSuccess('Asset Reactivated', `Asset ${assetToReactivate.value.id} has been successfully reactivated.`)

    // Close modal and refresh data
    closeReactivateAssetModal()
    await loadAssets()

  } catch (error) {
    console.error('Error reactivating asset:', error)
    toastStore.showError('Reactivation Failed', 'Error reactivating asset. Please try again.')
  } finally {
    isReactivatingAsset.value = false
  }
}

// Utility functions
// Reactivation form validation helpers
const VALID_REACTIVATION_LOCATIONS = new Set(['PUNE_INVENTORY_CENTER', 'THANE_INVENTORY_CENTER'])
const validateReactivateLocation = () => {
  const value = reactivateFormData.value.location || ''
  
  if (!value || !value.trim()) {
    reactivateFormValidation.value.location = 'invalid'
    reactivateFormValidation.value.locationMessage = 'Location is required'
    return false
  }
  
  if (!VALID_REACTIVATION_LOCATIONS.has(value)) {
    reactivateFormValidation.value.location = 'invalid'
    reactivateFormValidation.value.locationMessage = 'Please select a valid location'
    return false
  }
  
  reactivateFormValidation.value.location = 'valid'
  reactivateFormValidation.value.locationMessage = ''
  return true
}

const validateReactivateReason = () => {
  const value = reactivateFormData.value.reactivationReason || ''
  if (!value || !value.trim()) {
    reactivateFormValidation.value.reactivationReason = 'invalid'
    return false
  }
  reactivateFormValidation.value.reactivationReason = 'valid'
  return true
}

const validateReactivateDate = () => {
  const value = reactivateFormData.value.reactivationDate || ''
  if (!value) {
    reactivateFormValidation.value.reactivationDate = 'invalid'
    return false
  }
  reactivateFormValidation.value.reactivationDate = 'valid'
  return true
}

const validateReactivateForm = () => {
  const isDateValid = validateReactivateDate()
  const isLocationValid = validateReactivateLocation()
  const isReasonValid = validateReactivateReason()
  
  return isDateValid && isLocationValid && isReasonValid
}
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

const getAssetTypeIconClass = (type: string) => {
  const icons = {
    'Laptop': 'fas fa-laptop',
    'Monitor': 'fas fa-desktop',
    'Mobile': 'fas fa-mobile-alt',
    'Tablet': 'fas fa-tablet-alt',
    'Accessory': 'fas fa-headphones'
  }
  return icons[type as keyof typeof icons] || 'fas fa-cube'
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
    'NON_ASSIGNED': 'badge badge-green',     // Green for non-assigned
    'ASSIGNED': 'badge badge-blue',          // Blue for assigned
    'IN_MAINTENANCE': 'badge badge-orange',  // Orange for maintenance
    'RETIRED': 'badge badge-brown',          // Brown for retired
    'LOST': 'badge badge-red',               // Red for lost
    'DONATED': 'badge badge-purple'          // Purple for donated
  }
  return classes[status as keyof typeof classes] || 'badge badge-gray'
}

const getConditionBadgeClass = (condition: string) => {
  const classes = {
    'NEW': 'badge badge-purple',                // Purple for new
    'WORKING_CONDITION': 'badge badge-green',   // Green for working
    'SOFTWARE_ISSUE': 'badge badge-orange',     // Orange for software issue
    'HARDWARE_ISSUE': 'badge badge-red',        // Red for hardware issue
    'NEEDS_REPAIR': 'badge badge-orange',       // Orange for needs repair
    'TRASH': 'badge badge-red',                 // Red for trash
    'REFURBISHED': 'badge badge-brown'          // Brown for refurbished
  }
  return classes[condition as keyof typeof classes] || 'badge badge-gray'
}

const getStatusText = (status: string) => {
  const texts = {
    'NON_ASSIGNED': 'Non Assigned',
    'ASSIGNED': 'Assigned',
    'IN_MAINTENANCE': 'In Maintenance',
    'RETIRED': 'Retired',
    'LOST': 'Lost',
    'DONATED': 'Donated'
  }
  return texts[status as keyof typeof texts] || status
}

const getConditionText = (condition: string) => {
  const texts = {
    'NEW': 'New',
    'WORKING_CONDITION': 'Working Condition',
    'SOFTWARE_ISSUE': 'Software Issue',
    'HARDWARE_ISSUE': 'Hardware Issue',
    'NEEDS_REPAIR': 'Needs Repair',
    'TRASH': 'Trash',
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
  if (status === 'IN_MAINTENANCE') return 'fas fa-wrench'
  if (status === 'LOST') return 'fas fa-exclamation-triangle'
  return 'fas fa-box'
}

const getStatusIcon = (status: string) => {
  if (status === 'ASSIGNED') return 'fas fa-user'
  if (status === 'IN_MAINTENANCE') return 'fas fa-wrench'
  if (status === 'LOST') return 'fas fa-exclamation-triangle'
  if (status === 'DONATED') return 'fas fa-gift'
  if (status === 'NON_ASSIGNED') return 'fas fa-box'
  return 'fas fa-info-circle'
}

const getStatusSectionTitle = (status: string) => {
  if (status === 'ASSIGNED') return 'Assignment Status & Information'
  if (status === 'IN_MAINTENANCE') return 'Maintenance Status & Information'
  if (status === 'LOST') return 'Lost Asset Information'
  if (status === 'DONATED') return 'Donated Asset Information'
  if (status === 'NON_ASSIGNED') return 'Asset Availability Status'
  return 'Asset Status Information'
}

const getStatusSecondaryLabel = (status: string) => {
  if (status === 'ASSIGNED') return 'Assigned To:'
  if (status === 'IN_MAINTENANCE') return 'Current Location:'
  if (status === 'LOST') return 'Last Known Location:'
  if (status === 'DONATED') return 'Last Known Location:'
  if (status === 'NON_ASSIGNED') return 'Current Location:'
  return 'Location:'
}

const getStatusSecondaryValue = (asset: AssetDisplayItem) => {
  if (asset.status === 'ASSIGNED') return asset.assignedTo || 'Not Assigned'
  if (asset.status === 'IN_MAINTENANCE') return asset.location || 'Unknown'
  if (asset.status === 'LOST') return asset.location || 'Unknown'
  if (asset.status === 'DONATED') return asset.location || 'Unknown'
  if (asset.status === 'NON_ASSIGNED') return asset.location || 'Warehouse'
  return asset.location || 'Unknown'
}

const getAssignmentStatusText = (status: string) => {
  if (status === 'ASSIGNED') return 'Currently Assigned'
  return 'Available for Issue'
}

const getAssignmentStatusDescription = (status: string) => {
  if (status === 'ASSIGNED') return 'Currently with employee'
  if (status === 'IN_MAINTENANCE') return 'Asset is currently under maintenance'
  if (status === 'LOST') return 'Asset has been reported as lost'
  if (status === 'DONATED') return 'Asset has been donated'
  if (status === 'NON_ASSIGNED') return 'Ready to be assigned to an employee'
  return 'Asset status information'
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
  if (Number.isNaN(endDate.getTime())) {
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
    parts.push(`${totalYears} year${totalYears === 1 ? '' : 's'}`)
  }
  
  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`)
  }
  
  if (remainingDays > 0) {
    parts.push(`${remainingDays} day${remainingDays === 1 ? '' : 's'}`)
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

// Specification display methods
const syncSpecsListModeFromExpandedState = () => {
  const rows = filteredAssets.value
  if (rows.length === 0) {
    specsListMode.value = 'per-row'
    return
  }
  const expanded = new Set(expandedAssetIds.value)
  const allExpanded = rows.every((a) => expanded.has(a.id))
  const noneExpanded = rows.every((a) => !expanded.has(a.id))
  if (allExpanded) specsListMode.value = 'expand-all'
  else if (noneExpanded) specsListMode.value = 'collapse-all'
  else specsListMode.value = 'per-row'
}

const applySpecsListModeToVisibleRows = () => {
  const rows = filteredAssets.value
  if (specsListMode.value === 'expand-all') {
    expandedAssetIds.value = rows.map((a) => a.id)
  } else if (specsListMode.value === 'collapse-all') {
    expandedAssetIds.value = []
  } else {
    const idSet = new Set(rows.map((a) => a.id))
    expandedAssetIds.value = expandedAssetIds.value.filter((id) => idSet.has(id))
  }
}

watch(
  () => filteredAssets.value.map((a) => a.id).join('|'),
  () => {
    applySpecsListModeToVisibleRows()
  },
)

const toggleAssetRow = (assetId: string) => {
  const index = expandedAssetIds.value.indexOf(assetId)
  if (index === -1) {
    expandedAssetIds.value.push(assetId)
  } else {
    expandedAssetIds.value.splice(index, 1)
  }
  syncSpecsListModeFromExpandedState()
}

const toggleAllSpecifications = () => {
  if (areAllSpecsVisible.value) {
    specsListMode.value = 'collapse-all'
    expandedAssetIds.value = []
  } else {
    specsListMode.value = 'expand-all'
    expandedAssetIds.value = filteredAssets.value.map((asset) => asset.id)
  }
}

const setHoveredGroup = (assetId: string | null) => {
  hoveredGroupId.value = assetId
}

const formatLabel = (key: string): string => {
  return key
    .split(/(?=[A-Z])|_/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatSpecifications = (asset: any): string => {
  const baseEntries: Array<[string, string | undefined]> = [
    ['type', asset.type],
    ['brand', asset.brand]
  ]

  const specEntries = asset.specifications ? Object.entries(asset.specifications) : []
  const combined = [...baseEntries, ...specEntries].filter(([, value]) => Boolean(value))

  if (combined.length === 0) {
    return 'No specifications available'
  }

  return combined
    .map(([key, value]) => `<span class="spec-item"><strong>${formatLabel(key)}:</strong> ${value}</span>`)
    .join(' &nbsp;&nbsp;&nbsp;&nbsp;')
}

const getSpecificationEntries = (
  specs?: Record<string, any> | null,
  labelMap?: Record<string, string> | null,
) => {
  if (!specs) {
    return []
  }

  return Object.entries(specs)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([label, value]) => ({
      label: labelMap?.[label] || formatLabel(label),
      value: Array.isArray(value) ? value.join(', ') : String(value)
    }))
}

// Watch for changes in filters
const watchFilters = () => {
  // Watch search term with debounce
  const searchTimeout: number | null = null
  
  // Watch other filters immediately
  // Note: These computed properties are kept for potential future use
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
      if (tType === 'success') toastStore.showSuccess(tTitle, tMsg)
      else if (tType === 'error') toastStore.showError(tTitle, tMsg)
      else if (tType === 'warning') toastStore.showWarning(tTitle, tMsg)
      else toastStore.showInfo(tTitle, tMsg)
      router.replace({ path: route.path })
    }
  }, { deep: true })
  
  // Add resize listener to update view on screen size change
  window.addEventListener('resize', handleResize)
  
  // Initialize default sort option: Created Date (newest first)
  selectedSortBy.value = sortOptions.value.find(option => option.value === 'createdAt') || null
  sortAscending.value = false
  
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
/* Character count styling for reactivation reason */
.character-count {
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.asset-card-header {
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start !important;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.asset-card-icon {
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
}

.asset-card-main {
  flex: 1 1 auto;
  min-width: 0;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.15rem;
}

.asset-card-top-row {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.5rem;
  width: 100%;
}

.asset-card-id {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-black);
  line-height: 1.2;
}

.asset-card-subtitle {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--primary-dark-gray, #6c757d);
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.asset-card-status {
  flex: 0 0 auto;
  white-space: nowrap;
}

@media (max-width: 575.98px) {
  .asset-card-subtitle {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  .asset-card-status {
    font-size: 0.75rem;
    padding: 0.25rem 0.4rem;
  }
}

@media (max-width: 991.98px) {
  .specs-toggle-btn__icon {
    display: none;
  }

  .specs-toggle-btn {
    gap: 0 !important;
  }
}
</style>

<style>
@import '@/assets/styles/pages/assets.css';
</style>
