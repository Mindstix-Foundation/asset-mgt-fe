<template>
  <div class="container-fluid px-3 py-4">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0" style="color: var(--primary-black);">Manage Asset Categories</h2>
        <p class="text-muted mb-0">Simple form to manage categories, types, brands, models, and vendors</p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-secondary btn-modern" @click="goBack">
          <i class="fas fa-arrow-left me-1"></i>Back to Assets
        </button>
      </div>
    </div>

    <!-- Entity Type Selection -->
    <div class="mb-4">
      <div class="row g-3 justify-content-end">
        <div class="col-md-2">
          <button 
            class="btn btn-modern w-100" 
            :class="selectedEntityType === 'category' ? 'btn-entity-active' : 'btn-entity-inactive'"
            @click="setEntityType('category')"
          >
            Categories
          </button>
        </div>
        <div class="col-md-2">
          <button 
            class="btn btn-modern w-100" 
            :class="selectedEntityType === 'type' ? 'btn-entity-active' : 'btn-entity-inactive'"
            @click="setEntityType('type')"
          >
            Asset Types
          </button>
        </div>
        <div class="col-md-2">
          <button 
            class="btn btn-modern w-100" 
            :class="selectedEntityType === 'brand' ? 'btn-entity-active' : 'btn-entity-inactive'"
            @click="setEntityType('brand')"
          >
            Brands
          </button>
        </div>
        <div class="col-md-2">
          <button 
            class="btn btn-modern w-100" 
            :class="selectedEntityType === 'model' ? 'btn-entity-active' : 'btn-entity-inactive'"
            @click="setEntityType('model')"
          >
            Models
          </button>
        </div>
        <div class="col-md-2">
          <button 
            class="btn btn-modern w-100" 
            :class="selectedEntityType === 'asset' ? 'btn-entity-active' : 'btn-entity-inactive'"
            @click="setEntityType('asset')"
          >
            Assets
          </button>
        </div>
      </div>
    </div>

    <!-- Main Form -->
    <div class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="mb-1">
            {{ getEntityTitle() }}
          </h5>
          <p class="text-muted mb-0">{{ getEntityDescription() }}</p>
          <small class="text-muted">Showing {{ items.length }} items</small>
        </div>
        <div class="d-flex gap-2">
          <button v-if="selectedEntityType !== 'asset'" class="btn btn-primary btn-modern" @click="startAdding">
            <i class="fas fa-plus me-1"></i>Add New
          </button>
          <button v-if="selectedEntityType === 'asset'" class="btn btn-danger btn-modern" @click="startBulkDelete">
            <i class="fas fa-trash me-1"></i>Bulk Delete
          </button>
        </div>
      </div>
      <form @submit.prevent="saveEntity">
        <!-- Form Card - Using same design as filter dropdown in AssetsView.vue -->
        <div v-if="showFormCard" class="form-card mt-3 p-3 bg-light rounded">
          <div class="row">
            <div class="col-12">
              
              <!-- Category Form -->
              <div v-if="selectedEntityType === 'category'">
                <div class="row g-3">
                  <div class="col-12">
                    <label for="category-name" class="form-label">Category Name <span class="text-danger">*</span></label>
                    <input 
                      id="category-name"
                      type="text" 
                      class="form-control" 
                      v-model="formData.name"
                      placeholder="IT Equipment, Furniture, Vehicles"
                      style="text-transform: capitalize;"
                      required
                    >
                  </div>
                  <div class="col-12">
                    <NotesTextarea
                      v-model="formData.description"
                      label="Description"
                      placeholder="Brief description of this category"
                      help-text="Provide a detailed description of this category"
                      :max-length="100"
                      :min-rows="2"
                      input-id="category-description"
                    />
                  </div>
                </div>
              </div>

              <!-- Asset Type Form -->
              <div v-if="selectedEntityType === 'type'">
                <div class="row g-3">
                  <div class="col-md-6">
                    <SearchableDropdown
                      id="asset-type-category"
                      label="Category"
                      placeholder="Search categories..."
                      :items="categories"
                      v-model="selectedCategory"
                      :disabled="isLoadingCategories"
                      required
                      @change="onCategoryChange"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="asset-type-name" class="form-label">Asset Type Name <span class="text-danger">*</span></label>
                    <input 
                      id="asset-type-name"
                      type="text" 
                      class="form-control" 
                      v-model="formData.name"
                      placeholder="Laptop, Monitor, Chair, Vehicle"
                      style="text-transform: capitalize;"
                      required
                    >
                  </div>
                  <div class="col-12">
                    <NotesTextarea
                      v-model="formData.description"
                      label="Description"
                      placeholder="Brief description of this asset type"
                      help-text="Provide a detailed description of this asset type"
                      :max-length="100"
                      :min-rows="2"
                      input-id="asset-type-description"
                    />
                  </div>
                </div>
              </div>

              <!-- Brand Form -->
              <div v-if="selectedEntityType === 'brand'">
                <div class="row g-3">
                  <div class="col-12">
                    <label for="brand-name" class="form-label">Brand Name <span class="text-danger">*</span></label>
                    <input 
                      id="brand-name"
                      type="text" 
                      class="form-control" 
                      v-model="formData.name"
                      placeholder="Dell, Apple, HP, Microsoft"
                      style="text-transform: capitalize;"
                      required
                    >
                  </div>
                  <div class="col-12">
                    <NotesTextarea
                      v-model="formData.description"
                      label="Description"
                      placeholder="Brand description"
                      help-text="Provide brand description"
                      :max-length="100"
                      :min-rows="2"
                      input-id="brand-description"
                    />
                  </div>
                </div>
              </div>

              <!-- Model Form -->
              <div v-if="selectedEntityType === 'model'">
                <div class="row g-3">
                  <div class="col-7">
                    <div class="row g-3">
                      <div class="col-6">
                        <SearchableDropdown
                          id="model-brand"
                          label="Brand"
                          placeholder="Search brands..."
                          :items="brands"
                          v-model="selectedBrand"
                          :disabled="isLoadingBrands"
                          required
                          @change="onBrandChange"
                        />
                      </div>
                      <div class="col-6">
                        <SearchableDropdown
                          id="model-asset-type"
                          label="Asset Type"
                          placeholder="Search asset types..."
                          :items="assetTypes"
                          v-model="selectedAssetType"
                          :disabled="isLoadingAssetTypes"
                          required
                          @change="onAssetTypeChange"
                        >
                          <template #item="{ item }">
                            <div v-html="`${(item as any).name}${(item as any).category ? ` <span class='text-muted'>(${(item as any).category.name})</span>` : ''}`">
                            </div>
                          </template>
                        </SearchableDropdown>
                      </div>
                    </div>
                  </div>
                  <div class="col-5">
                    <label for="model-name" class="form-label">Model Name <span class="text-danger">*</span></label>
                    <input 
                      id="model-name"
                      type="text" 
                      class="form-control" 
                      v-model="formData.name"
                      placeholder="iPhone 15 Pro, MacBook Pro M3"
                      style="text-transform: capitalize;"
                      required
                    >
                  </div>
                  <div class="col-12">
                    <NotesTextarea
                      v-model="formData.specifications"
                      label="Specifications"
                      placeholder="Enter specifications as key-value pairs:
Processor: Intel i7-13700H
RAM: 16GB DDR5
Storage: 512GB SSD
Display: 15.6&quot; FHD"
                      help-text="Enter specifications as key-value pairs (one per line)"
                      :max-length="1000"
                      :min-rows="4"
                      input-id="model-specifications"
                    />
                  </div>
                </div>
              </div>

              <!-- Assets Form -->
              <div v-if="selectedEntityType === 'asset'">
                <div class="row g-3 justify-content-between">
                  <div class="col-4">
                    <div class="form-label">Add Single Asset</div>
                    <div class="row justify-content-around">
                      <div class="col-7">
                        <input 
                          type="text" 
                          class="form-control" 
                          v-model="singleAssetInput"
                          placeholder="AST-0001"
                          @keyup.enter="addSingleAsset"
                          pattern="AST-\d{4}"
                          title="Format: AST-XXXX (e.g., AST-0001)"
                        >
                      </div>
                      <div class="col-4">
                  <button 
                    class="btn btn-brown w-100 asset-add-btn" 
                    type="button" 
                    @click="addSingleAsset"
                    :disabled="!singleAssetInput"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                      </div>
                    </div>
                    <small class="form-text text-muted">
                      Enter a single asset ID (e.g., AST-0001) to add to deletion list
                    </small>
                  </div>
                  <div class="col-7">
                    <div class="form-label">Add Asset Range</div>
                     <div class="row justify-content-around">
                       <div class="col-9">
                         <div class="d-flex align-items-center gap-2">
                           <span class="text-muted">From</span>
                        <input 
                          type="text" 
                          class="form-control" 
                          v-model="assetFromInput"
                          placeholder="AST-0000"
                          @keyup.enter="addAssetRange"
                          pattern="AST-\d{4}"
                          title="Format: AST-XXXX (e.g., AST-0000)"
                        >
                           <span class="text-muted">to</span>
                           <input 
                             type="text" 
                             class="form-control" 
                             v-model="assetToInput"
                             placeholder="AST-9999"
                             @keyup.enter="addAssetRange"
                             pattern="AST-\d{4}"
                             title="Format: AST-XXXX (e.g., AST-9999)"
                           >
                         </div>
                       </div>
                       <div class="col-2">
                  <button 
                    class="btn btn-brown w-100 asset-add-btn" 
                    type="button" 
                    @click="addAssetRange"
                    :disabled="!assetFromInput || !assetToInput"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                      </div>
                    </div>
                    <small class="form-text text-muted">
                      Enter asset ID range (e.g., AST-0000 to AST-9999) to add multiple assets for deletion
                    </small>
                  </div>
                  <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <div class="form-label mb-1">Selected Assets for Deletion ({{ selectedAssetsForDeletion.length }})</div>
                      </div>
                    </div>
                    <div v-if="selectedAssetsForDeletion.length > 0" class="mt-3">
                      <div class="d-flex flex-wrap gap-2">
                        <span 
                          v-for="assetId in selectedAssetsForDeletion" 
                          :key="assetId"
                          class="badge bg-warning d-flex align-items-center gap-1"
                        >
                          <i class="fas fa-box"></i>
                          {{ getAssetDisplayId(assetId) }}
                          <button 
                            type="button" 
                            class="btn-close btn-close-white" 
                            style="font-size: 0.7em;"
                            @click="toggleAssetSelection(assetId)"
                            title="Remove from selection"
                          ></button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <!-- Form Action Buttons - Bottom Right -->
          <div class="d-flex justify-content-end gap-2 mt-4  ">
            <button v-if="selectedEntityType !== 'asset'" type="button" class="btn btn-outline-secondary btn-modern" @click="resetForm">
              <i class="fas fa-refresh me-1"></i>Reset
            </button>
            <button v-if="selectedEntityType === 'asset'" type="button" class="btn btn-outline-secondary btn-modern" @click="clearAssetSelection">
              <i class="fas fa-times me-1"></i>Clear
            </button>
            <button v-if="selectedEntityType !== 'asset'" class="btn btn-success btn-modern" @click="saveEntity" :disabled="isSaving">
              <i v-if="isSaving" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-save me-1"></i>
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
            <button v-if="selectedEntityType === 'asset'" type="button" class="btn btn-danger btn-modern" @click="confirmBulkDelete" :disabled="selectedAssetsForDeletion.length === 0 || isBulkDeleting">
              <i v-if="isBulkDeleting" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-trash me-1"></i>
              {{ isBulkDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Search and Sort Bar -->
    <div class="mb-4" v-if="selectedEntityType === 'asset'">
      <div class="row align-items-end">
        <!-- Search Assets -->
        <div class="col-12 col-lg-7 mb-3">
          <div class="form-label">Search Assets</div>
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
                    :items="assetTypeFilterOptions"
                    v-model="selectedAssetTypeFilter"
                    @change="onAssetTypeFilterChange"
                  />
                </div>
                <div class="flex-fill">
                  <SearchableDropdown
                    id="brand-filter"
                    label="Brand"
                    placeholder="Search brands..."
                    :items="brandFilterOptions"
                    v-model="selectedBrandFilter"
                    @change="onBrandFilterChange"
                  />
                </div>
                <!-- Status filter removed - only showing AVAILABLE assets -->
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

    <!-- Items Table -->
    <div class="mt-5" v-if="items.length > 0">
        <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0" :class="[`table-${selectedEntityType}`, { 'show-checkboxes': selectedEntityType === 'asset' && showFormCard }]">
              <thead class="table-light">
                <tr>
                  <th v-if="selectedEntityType === 'asset' && showFormCard"></th>
                  <th v-if="selectedEntityType === 'asset'">Asset ID</th>
                  <th v-if="selectedEntityType !== 'asset'">Name</th>
                  <th v-if="selectedEntityType === 'asset'">Name (Type - Brand - Model)</th>
                  <th v-if="selectedEntityType === 'type'">Category</th>
                  <th v-if="selectedEntityType === 'model'">Brand</th>
                  <th v-if="selectedEntityType === 'model'">Asset Type</th>
                  <th v-if="selectedEntityType === 'asset'">Serial Number</th>
                  <th v-if="selectedEntityType === 'asset'">Condition</th>
                  <th v-if="selectedEntityType !== 'model' && selectedEntityType !== 'asset'">Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <!-- Checkbox column for assets -->
              <td v-if="selectedEntityType === 'asset' && showFormCard">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  :checked="selectedAssetsForDeletion.includes(item.id)"
                  @change="toggleAssetSelection(item.id)"
                >
              </td>
              
              <!-- Asset ID column -->
              <td v-if="selectedEntityType === 'asset'">
                <span class="text-muted">{{ item.assetId }}</span>
              </td>
              
              <!-- Name column for non-assets -->
              <td v-if="selectedEntityType !== 'asset'">
                <strong style="color: var(--primary-black);">{{ item.name }}</strong>
              </td>
              
              <!-- Asset Name (Type - Brand - Model) column -->
              <td v-if="selectedEntityType === 'asset'">
                <div>
                  <strong style="color: var(--primary-black);">
                    {{ item.model?.name || 'Unknown Model' }}
                  </strong>
                  <br>
                  <small class="text-muted">
                    {{ item.assetType?.name || 'Unknown Type' }} - 
                    {{ item.brand?.name || 'Unknown Brand' }}
                  </small>
                </div>
              </td>
              
              <!-- Category column for asset types -->
              <td v-if="selectedEntityType === 'type'">
                <span class="text-muted">{{ item.category?.name || 'Unknown' }}</span>
              </td>
              
              <!-- Brand column for models -->
              <td v-if="selectedEntityType === 'model'">
                <span class="text-muted">{{ item.brand?.name || 'Unknown' }}</span>
              </td>
              
              <!-- Asset Type column for models -->
              <td v-if="selectedEntityType === 'model'">
                <span class="text-muted">{{ item.assetType?.name || 'Unknown' }}</span>
              </td>
              
              <!-- Serial Number column for assets -->
              <td v-if="selectedEntityType === 'asset'">
                <span class="text-muted">{{ item.serialNumber || 'N/A' }}</span>
              </td>
              
              <!-- Condition column for assets -->
              <td v-if="selectedEntityType === 'asset'">
                <span class="text-muted">{{ item.condition || 'Unknown' }}</span>
              </td>
              
              <!-- Description column for non-models and non-assets -->
              <td v-if="selectedEntityType !== 'model' && selectedEntityType !== 'asset'">
                <span class="text-muted">{{ item.description || 'No description' }}</span>
              </td>
              
              <!-- Actions column -->
              <td>
                <div class="btn-group btn-group-sm asset-actions">
                  <button 
                    v-if="selectedEntityType === 'model'"
                    class="btn btn-outline-primary btn-view-details" 
                    @click="viewModelDetails(item)"
                    title="View Model Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="selectedEntityType !== 'asset'"
                    class="btn btn-outline-danger btn-delete-asset" 
                    @click="deleteItem(item)"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <button 
                    v-if="selectedEntityType === 'asset'"
                    class="btn btn-outline-danger btn-delete-asset" 
                    @click="deleteSingleAsset(item)"
                    title="Delete Asset"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
          </div>
        </div>
      </div>
    </div>


    <!-- Single Item Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showDeleteConfirmationModal }" 
      :style="{ display: showDeleteConfirmationModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="itemToDelete"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black);">
              <i class="fas fa-exclamation-triangle me-2" style="color: var(--secondary-orange);"></i>
              <span>Confirm Deletion</span>
            </h5>
            <button type="button" class="btn-close" @click="closeDeleteConfirmationModal"></button>
          </div>
          <div class="modal-body" v-if="itemToDelete">
            <div class="text-center py-2">
              <div class="confirmation-icon mb-2">
                <i 
                  class="fas fa-trash fa-2x"
                  style="color: var(--secondary-red);"
                ></i>
              </div>
              <h6 class="mb-2" style="color: var(--primary-black); font-size: 1rem;">
                Are you sure you want to delete this {{ getEntityTitle().slice(0, -1).toLowerCase() }}?
              </h6>
              <p class="text-muted mb-0" style="font-size: 0.9rem;">
                <strong>{{ selectedEntityType === 'asset' ? itemToDelete.assetId : itemToDelete.name }}</strong> will be permanently deleted 
                and this action cannot be undone.
              </p>
            </div>
            
            <!-- Entity Summary - Compact Version -->
            <div class="mt-2">
              <div class="asset-info-section-compact">
                <h6 class="section-title-compact">
                  <i :class="getEntityIcon()" class="me-2"></i>{{ getEntityTitle().slice(0, -1) }} Details
                </h6>
                <div class="info-grid-compact">
                  <!-- Asset-specific fields -->
                  <div v-if="selectedEntityType === 'asset'" class="info-item-compact">
                    <div class="info-label-compact">Asset ID</div>
                    <div class="info-value-compact fw-bold">{{ itemToDelete?.assetId || 'Unknown' }}</div>
                  </div>
                  <div v-if="selectedEntityType === 'asset'" class="info-item-compact">
                    <div class="info-label-compact">Model</div>
                    <div class="info-value-compact">{{ itemToDelete?.model?.name || 'Unknown' }}</div>
                  </div>
                  <div v-if="selectedEntityType === 'asset'" class="info-item-compact">
                    <div class="info-label-compact">Brand</div>
                    <div class="info-value-compact">{{ itemToDelete?.brand?.name || 'Unknown' }}</div>
                  </div>
                  <div v-if="selectedEntityType === 'asset'" class="info-item-compact">
                    <div class="info-label-compact">Asset Type</div>
                    <div class="info-value-compact">{{ itemToDelete?.assetType?.name || 'Unknown' }}</div>
                  </div>
                  <div v-if="selectedEntityType === 'asset'" class="info-item-compact">
                    <div class="info-label-compact">Serial Number</div>
                    <div class="info-value-compact">{{ itemToDelete?.serialNumber || 'N/A' }}</div>
                  </div>
                  <div v-if="selectedEntityType === 'asset'" class="info-item-compact">
                    <div class="info-label-compact">Condition</div>
                    <div class="info-value-compact">{{ itemToDelete?.condition || 'Unknown' }}</div>
                  </div>
                  
                  <!-- Non-asset entity fields -->
                  <div v-if="selectedEntityType !== 'asset'" class="info-item-compact">
                    <div class="info-label-compact">{{ getEntityTitle().slice(0, -1) }} Name</div>
                    <div class="info-value-compact fw-bold">{{ itemToDelete?.name }}</div>
                  </div>
                  <div v-if="selectedEntityType !== 'asset' && itemToDelete?.description" class="info-item-compact">
                    <div class="info-label-compact">Description</div>
                    <div class="info-value-compact">{{ itemToDelete?.description || 'No description' }}</div>
                  </div>
                  <div v-if="selectedEntityType === 'type' && itemToDelete?.category" class="info-item-compact">
                    <div class="info-label-compact">Category</div>
                    <div class="info-value-compact">{{ itemToDelete?.category?.name || 'Unknown' }}</div>
                  </div>
                  <div v-if="selectedEntityType === 'model'" class="info-item-compact">
                    <div class="info-label-compact">Brand</div>
                    <div class="info-value-compact">{{ itemToDelete?.brand?.name || 'Unknown' }}</div>
                  </div>
                  <div v-if="selectedEntityType === 'model'" class="info-item-compact">
                    <div class="info-label-compact">Asset Type</div>
                    <div class="info-value-compact">{{ itemToDelete?.assetType?.name || 'Unknown' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Deletion Impact Analysis - Compact Version (Not for assets) -->
            <div v-if="deleteImpact && selectedEntityType !== 'asset'" class="mt-2">
              <div class="asset-info-section-compact">
                <h6 class="section-title-compact"><i class="fas fa-chart-line me-1"></i>Deletion Impact</h6>
                
                <div class="impact-details">
                  <div class="row g-1">
                    <div v-if="deleteImpact.assetTypes > 0" class="col-6">
                      <div class="card border-warning">
                        <div class="card-body text-center p-1">
                          <i class="fas fa-tags text-warning mb-1" style="font-size: 0.9rem;"></i>
                          <h6 class="card-title mb-0" style="font-size: 1rem;">{{ deleteImpact.assetTypes }}</h6>
                          <small class="card-text" style="font-size: 0.7rem;">Asset Type{{ deleteImpact.assetTypes > 1 ? 's' : '' }}</small>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="deleteImpact.assets > 0" class="col-6">
                      <div class="card border-danger">
                        <div class="card-body text-center p-1">
                          <i class="fas fa-box text-danger mb-1" style="font-size: 0.9rem;"></i>
                          <h6 class="card-title mb-0" style="font-size: 1rem;">{{ deleteImpact.assets }}</h6>
                          <small class="card-text" style="font-size: 0.7rem;">Asset{{ deleteImpact.assets > 1 ? 's' : '' }}</small>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="deleteImpact.models > 0" class="col-6">
                      <div class="card border-info">
                        <div class="card-body text-center p-1">
                          <i class="fas fa-cube text-info mb-1" style="font-size: 0.9rem;"></i>
                          <h6 class="card-title mb-0" style="font-size: 1rem;">{{ deleteImpact.models }}</h6>
                          <small class="card-text" style="font-size: 0.7rem;">Model{{ deleteImpact.models > 1 ? 's' : '' }}</small>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="deleteImpact.employees > 0" class="col-6">
                      <div class="card border-primary">
                        <div class="card-body text-center p-1">
                          <i class="fas fa-users text-primary mb-1" style="font-size: 0.9rem;"></i>
                          <h6 class="card-title mb-0" style="font-size: 1rem;">{{ deleteImpact.employees }}</h6>
                          <small class="card-text" style="font-size: 0.7rem;">Employee{{ deleteImpact.employees > 1 ? 's' : '' }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="deleteImpact.assetTypes > 0 || deleteImpact.assets > 0 || deleteImpact.models > 0 || deleteImpact.employees > 0" class="mt-1">
                    <div class="alert alert-danger py-1">
                      <h6 class="alert-heading mb-0" style="font-size: 0.85rem;">
                        <i class="fas fa-ban me-1"></i>Deletion Not Allowed
                      </h6>
                      <small class="mb-0" style="font-size: 0.75rem;">
                        This {{ getEntityTitle().slice(0, -1).toLowerCase() }} has associated data and cannot be deleted.
                      </small>
                    </div>
                  </div>
                  
                  <div v-else class="mt-1">
                    <div class="alert alert-success py-1">
                      <h6 class="alert-heading mb-0" style="font-size: 0.85rem;">
                        <i class="fas fa-check-circle me-1"></i>Safe to Delete
                      </h6>
                      <small class="mb-0" style="font-size: 0.75rem;">
                        This {{ getEntityTitle().slice(0, -1).toLowerCase() }} has no associated data.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="selectedEntityType !== 'asset'" class="mt-2 text-center">
              <div class="spinner-border text-primary spinner-border-sm" style="width: 1rem; height: 1rem;">
                <output class="visually-hidden">Loading...</output>
              </div>
              <small class="text-muted d-block mt-1" style="font-size: 0.8rem;">Analyzing deletion impact...</small>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-cancel-confirm" @click="closeDeleteConfirmationModal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-confirm-delete"
              @click="confirmDelete"
              :disabled="isDeleting || (selectedEntityType !== 'asset' && deleteImpact && (deleteImpact.assetTypes > 0 || deleteImpact.assets > 0 || deleteImpact.models > 0 || deleteImpact.employees > 0))"
            >
              <i class="fas fa-trash me-1"></i>
              {{ isDeleting ? 'Deleting...' : 'Confirm Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showBulkDeleteConfirmationModal }" 
      :style="{ display: showBulkDeleteConfirmationModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black);">
              <i class="fas fa-exclamation-triangle me-2" style="color: var(--secondary-orange);"></i>
              <span>Confirm Bulk Deletion</span>
            </h5>
            <button type="button" class="btn-close" @click="closeBulkDeleteConfirmationModal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center py-2">
              <div class="confirmation-icon mb-2">
                <i 
                  class="fas fa-trash fa-2x"
                  style="color: var(--secondary-red);"
                ></i>
              </div>
              <h6 class="mb-2" style="color: var(--primary-black); font-size: 1rem;">
                Are you sure you want to delete {{ selectedAssetsForDeletion.length }} selected assets?
              </h6>
              <p class="text-muted mb-0" style="font-size: 0.9rem;">
                All selected assets will be permanently deleted and this action cannot be undone.
              </p>
              <div class="mt-2 p-2" style="background-color: var(--primary-light-gray); border-radius: 0.5rem; border-left: 4px solid var(--secondary-orange);">
                <small class="text-muted" style="font-size: 0.8rem;">
                  <i class="fas fa-info-circle me-1"></i>
                  Only assets that meet deletion criteria (AVAILABLE status, no assignment/maintenance history) will be deleted. Others will be skipped.
                </small>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-cancel-confirm" @click="closeBulkDeleteConfirmationModal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-confirm-delete"
              @click="executeBulkDelete"
              :disabled="isBulkDeleting"
            >
              <i class="fas fa-trash me-1"></i>
              {{ isBulkDeleting ? 'Deleting...' : 'Confirm Delete All' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Model Details Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showModelDetailsModal }" 
      :style="{ display: showModelDetailsModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="selectedModel"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header py-2">
            <h5 class="modal-title" style="font-size: 1.1rem;">Model Details - {{ selectedModel.name }}</h5>
            <button type="button" class="btn-close" @click="closeModelDetailsModal"></button>
          </div>
          <div class="modal-body py-2">
            <!-- Model Information - Full Width -->
            <div class="row g-1">
              <div class="col-12">
                <div class="asset-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-info-circle me-1"></i>Basic Information</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <div class="info-label-compact">Model Name</div>
                      <div class="info-value-compact fw-bold">{{ selectedModel.name }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Brand</div>
                      <div class="info-value-compact">{{ selectedModel.brand?.name || 'Unknown' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Asset Type</div>
                      <div class="info-value-compact fw-bold">{{ selectedModel.assetType?.name || 'Unknown' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Category</div>
                      <div class="info-value-compact">{{ selectedModel.assetType?.category?.name || 'Unknown' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Specifications Details - Full Width -->
            <div class="row mt-1">
              <div class="col-12">
                <div class="asset-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-list-alt me-1"></i>Technical Specifications</h6>
                  <NotesDisplay 
                    :notes="formatSpecificationsForDisplay(selectedModel.specifications)"
                    :fallback-text="'No specifications provided for this model.'"
                    :show-label="false"
                    :show-icon="false"
                    :show-empty-icon="true"
                    :preserve-formatting="true"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer py-2">
            <div class="d-flex justify-content-between w-100">
              <div>
                <!-- Left side: Additional actions (none for models) -->
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary btn-sm" @click="closeModelDetailsModal">Close</button>
                <button type="button" class="btn btn-danger btn-sm" @click="deleteItem(selectedModel)">
                  <i class="fas fa-trash me-1"></i>Delete Model
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div 
      v-if="showModelDetailsModal || showDeleteConfirmationModal || showBulkDeleteConfirmationModal" 
      class="modal-backdrop fade show"
      @click="closeModals"
    ></div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { assetCategoryService } from '../../services/assetCategoryService'
import { assetTypeService } from '../../services/assetTypeService'
import { brandService } from '../../services/brandService'
import { modelService } from '../../services/modelService'
import { assetService } from '../../services/assetService'
import NotesTextarea from '../../components/common/NotesTextarea.vue'
import NotesDisplay from '../../components/common/NotesDisplay.vue'
import SearchableDropdown, { type Item } from '../../components/common/SearchableDropdown.vue'
import type { AssetCategory } from '../../services/assetCategoryService'
import type { AssetType } from '../../services/assetTypeService'
import type { Brand } from '../../services/brandService'
import type { Model } from '../../services/modelService'

const router = useRouter()
const toastStore = useToastStore()

// State
const selectedEntityType = ref<'category' | 'type' | 'brand' | 'model' | 'asset'>('category')
const isSaving = ref(false)
const showFormCard = ref(false)

// Assets-specific state
const selectedAssetsForDeletion = ref<(string | number)[]>([])
const isBulkDeleting = ref(false)
const singleAssetInput = ref('')
const assetFromInput = ref('')
const assetToInput = ref('')

// Search and filter state
const searchTerm = ref('')
const selectedSortBy = ref<Item | null>(null)
const sortAscending = ref(true)
const showFilterDropdown = ref(false)
const selectedAssetTypeFilter = ref<Item | null>(null)
const selectedBrandFilter = ref<Item | null>(null)
const selectedCondition = ref<Item | null>(null)

// Filter options
const sortOptions = ref<Item[]>([
  { value: 'assetId', label: 'Asset ID' },
  { value: 'status', label: 'Status' },
  { value: 'condition', label: 'Condition' },
  { value: 'purchaseDate', label: 'Purchase Date' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' }
])

const assetTypeFilterOptions = ref<Item[]>([])
const brandFilterOptions = ref<Item[]>([])
const statusOptions = ref<Item[]>([
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_MAINTENANCE', label: 'In Maintenance' },
  { value: 'RETIRED', label: 'Retired' },
  { value: 'LOST', label: 'Lost' }
])

const conditionOptions = ref<Item[]>([
  { value: 'NEW', label: 'New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'REFURBISHED', label: 'Refurbished' }
])

// Data
const categories = ref<AssetCategory[]>([])
const assetTypes = ref<AssetType[]>([])
const brands = ref<Brand[]>([])
const models = ref<Model[]>([])
const items = ref<any[]>([])

// Loading states
const isLoadingCategories = ref(false)
const isLoadingAssetTypes = ref(false)
const isLoadingBrands = ref(false)
const isLoadingModels = ref(false)

// Delete confirmation modal state
const showDeleteConfirmationModal = ref(false)
const showBulkDeleteConfirmationModal = ref(false)
const deleteImpact = ref<any>(null)
const itemToDelete = ref<any>(null)
const isDeleting = ref(false)

// Model details modal state
const showModelDetailsModal = ref(false)
const selectedModel = ref<any>(null)

// SearchableDropdown selected values
const selectedCategory = ref<Item | null>(null)
const selectedBrand = ref<Item | null>(null)
const selectedAssetType = ref<Item | null>(null)

// Form data
const formData = reactive({
  // Common fields
  name: '',
  description: '',
  
  // Category specific
  categoryId: '',
  
  // Model specific
  brandId: '',
  assetTypeId: '',
  specifications: '',
  
  // Edit mode
  id: null as number | null
})

// Computed properties
const getEntityIcon = () => {
  const icons = {
    category: 'fas fa-folder',
    type: 'fas fa-tags',
    brand: 'fas fa-trademark',
    model: 'fas fa-cube',
    asset: 'fas fa-box'
  }
  return icons[selectedEntityType.value]
}

const getEntityTitle = () => {
  const titles = {
    category: 'Asset Categories',
    type: 'Asset Types',
    brand: 'Brands',
    model: 'Models',
    asset: 'Manage Assets Count'
  }
  return titles[selectedEntityType.value]
}

const getEntityDescription = () => {
  const descriptions = {
    category: 'Manage high-level asset categories',
    type: 'Manage specific asset types within categories',
    brand: 'Manage asset brands and manufacturers',
    model: 'Manage specific models for brands and asset types',
    asset: 'Manage deletable assets (AVAILABLE status, no assignment/maintenance history)'
  }
  return descriptions[selectedEntityType.value]
}

// Computed properties for dropdown filtering
const filteredAssetTypes = computed(() => {
  if (!formData.categoryId) return assetTypes.value
  return assetTypes.value.filter(type => type.categoryId === Number.parseInt(formData.categoryId))
})

const filteredModels = computed(() => {
  if (!formData.brandId && !formData.assetTypeId) return models.value
  return models.value.filter(model => {
    const brandMatch = !formData.brandId || model.brandId === Number.parseInt(formData.brandId)
    const typeMatch = !formData.assetTypeId || model.assetTypeId === Number.parseInt(formData.assetTypeId)
    return brandMatch && typeMatch
  })
})


// Methods
const setEntityType = async (type: 'category' | 'type' | 'brand' | 'model' | 'asset') => {
  selectedEntityType.value = type
  resetForm()
  await loadItems()
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (key === 'id') {
      (formData as any)[key] = null
    } else {
      (formData as any)[key] = ''
    }
  })
  // Don't close the form card on reset - keep it open
  
  // Reset SearchableDropdown selections
  selectedCategory.value = null
  selectedBrand.value = null
  selectedAssetType.value = null
  
  // Clear asset selection when resetting
  selectedAssetsForDeletion.value = []
  singleAssetInput.value = ''
  assetFromInput.value = ''
  assetToInput.value = ''
}

const startAdding = () => {
  showFormCard.value = !showFormCard.value
  if (showFormCard.value) {
    // Clear form data without hiding the card
    Object.keys(formData).forEach(key => {
      if (key === 'id') {
        (formData as any)[key] = null
      } else {
        (formData as any)[key] = ''
      }
    })
    
    // Reset SearchableDropdown selections
    selectedCategory.value = null
    selectedBrand.value = null
    selectedAssetType.value = null
    
    // Focus on the first input field after a short delay to ensure it's rendered
    setTimeout(() => {
      const firstInput = document.querySelector('.form-card input, .form-card select, .form-card textarea')
      if (firstInput) {
        (firstInput as HTMLElement).focus()
      }
    }, 100)
  }
}

const startBulkDelete = () => {
  showFormCard.value = !showFormCard.value
  if (showFormCard.value) {
    // Clear asset selection when starting bulk delete
    selectedAssetsForDeletion.value = []
  }
}

const loadItems = async () => {
  try {
    switch (selectedEntityType.value) {
      case 'category': {
        const categoryResponse = await assetCategoryService.getAssetCategories({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
        items.value = categoryResponse.data.assetCategories
        break
      }
      case 'type': {
        const typeResponse = await assetTypeService.getAssetTypes({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
        items.value = typeResponse.data.assetTypes
        break
      }
      case 'brand': {
        const brandResponse = await brandService.getBrands({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
        items.value = brandResponse.data.brands
        break
      }
      case 'model': {
        const modelResponse = await modelService.getModels({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
        items.value = modelResponse.data.models
        break
      }
      case 'asset':
        // Load deletable assets from API (only assets that meet deletion criteria)
        try {
          const assetParams: any = {
            limit: 100,
            sortBy: selectedSortBy.value?.value || 'assetId',
            sortOrder: sortAscending.value ? 'asc' : 'desc'
          }

          // Add search parameter
          if (searchTerm.value) {
            assetParams.search = searchTerm.value
          }

          // Add filter parameters
          if (selectedAssetTypeFilter.value) {
            assetParams.assetTypeId = selectedAssetTypeFilter.value.id
          }
          if (selectedBrandFilter.value) {
            assetParams.brandId = selectedBrandFilter.value.id
          }
          if (selectedCondition.value) {
            assetParams.condition = selectedCondition.value.value
          }

          // Use the new deletable assets endpoint
          const assetResponse = await assetService.getDeletableAssets(assetParams)
          items.value = assetResponse.data.assets
        } catch (error) {
          console.error('Error loading deletable assets:', error)
          toastStore.showError('Error', 'Failed to load deletable assets')
          items.value = []
        }
        break
    }
  } catch (error) {
    console.error('Error loading items:', error)
  }
}

const saveEntity = async () => {
  if (!formData.name.trim()) {
    toastStore.showError('Error', 'Name is required')
    return
  }
  
  isSaving.value = true
  
  try {
    let response
    const data: any = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined
    }
    
    // Add entity-specific fields
    if (selectedEntityType.value === 'type') {
      data.categoryId = Number.parseInt(formData.categoryId)
    }
    
    if (selectedEntityType.value === 'model') {
      data.brandId = Number.parseInt(formData.brandId)
      data.assetTypeId = Number.parseInt(formData.assetTypeId)
      data.specifications = parseSpecifications(formData.specifications)
    }
    
    if (formData.id) {
      // Update existing item
      switch (selectedEntityType.value) {
        case 'category': {
          await assetCategoryService.updateAssetCategory(formData.id, data)
          break
        }
        case 'type': {
          await assetTypeService.updateAssetType(formData.id, data)
          break
        }
        case 'brand': {
          await brandService.updateBrand(formData.id, data)
          break
        }
        case 'model': {
          await modelService.updateModel(formData.id, data)
          break
        }
      }
      toastStore.showSuccess('Success', `${getEntityTitle().slice(0, -1)} updated successfully!`)
    } else {
      // Create new item
      switch (selectedEntityType.value) {
        case 'category': {
          await assetCategoryService.createAssetCategory(data)
          break
        }
        case 'type': {
          await assetTypeService.createAssetType(data)
          break
        }
        case 'brand': {
          await brandService.createBrand(data)
          break
        }
        case 'model': {
          await modelService.createModel(data)
          break
        }
      }
      toastStore.showSuccess('Success', `${getEntityTitle().slice(0, -1)} created successfully!`)
    }
    
    // Clear form and hide card
    Object.keys(formData).forEach(key => {
      if (key === 'id') {
        (formData as any)[key] = null
      } else {
        (formData as any)[key] = ''
      }
    })
    showFormCard.value = false
    
    // Reset SearchableDropdown selections
    selectedCategory.value = null
    selectedBrand.value = null
    selectedAssetType.value = null
    
    await loadItems()
    
    // Refresh relevant dropdowns after creating new items
    switch (selectedEntityType.value) {
      case 'category':
        await refreshCategories()
        break
      case 'type':
        await refreshAssetTypes()
        break
      case 'brand':
        await refreshBrands()
        break
      case 'model':
        // Models don't affect other dropdowns
        break
    }
    
  } catch (error: any) {
    console.error('Error saving entity:', error)
    toastStore.showError('Error', error.message || `Failed to save ${getEntityTitle().slice(0, -1).toLowerCase()}`)
  } finally {
    isSaving.value = false
  }
}


const deleteItem = async (item: any) => {
  itemToDelete.value = item
  deleteImpact.value = null
  
  // Close model details modal if it's open
  if (showModelDetailsModal.value) {
    closeModelDetailsModal()
  }
  
  // Show modal
  showDeleteConfirmationModal.value = true
  
  // Analyze deletion impact
  await analyzeDeletionImpact(item)
}

const analyzeDeletionImpact = async (item: any) => {
  try {
    let impact: any = {
      itemName: item.name,
      assetTypes: 0,
      assets: 0,
      models: 0,
      employees: 0
    }
    
    switch (selectedEntityType.value) {
      case 'category': {
        // Get category details with counts
        const categoryResponse = await assetCategoryService.getAssetCategoryById(item.id)
        const category = categoryResponse.data.assetCategory
        impact.assetTypes = category._count?.assetTypes || 0
        
        // Count assets through asset types
        if ((category as any).assetTypes) {
          impact.assets = (category as any).assetTypes.reduce((total: number, type: any) => {
            return total + (type._count?.assets || 0)
          }, 0)
        }
        break
      }
        
      case 'type': {
        // Get asset type details with counts
        const typeResponse = await assetTypeService.getAssetTypeById(item.id)
        const assetType = typeResponse.data.assetType
        impact.assets = assetType._count?.assets || 0
        impact.models = assetType._count?.models || 0
        break
      }
        
      case 'brand': {
        // For brands, we need to count models and assets
        const brandModels = models.value.filter(model => model.brandId === item.id)
        impact.models = brandModels.length
        
        // Count assets through models (this would need a more complex query in real implementation)
        // For now, we'll estimate based on models
        impact.assets = brandModels.reduce((total: number, model: any) => {
          return total + (model._count?.assets || 0)
        }, 0)
        break
      }
        
      case 'model': {
        // For models, count assets
        const modelResponse = await modelService.getModelById(item.id)
        const model = modelResponse.data.model
        impact.assets = model._count?.assets || 0
        break
      }
    }
    
    deleteImpact.value = impact
  } catch (error) {
    console.error('Error analyzing deletion impact:', error)
    // Set default impact if analysis fails
    deleteImpact.value = {
      itemName: item.name,
      assetTypes: 0,
      assets: 0,
      models: 0,
      employees: 0
    }
  }
}

const closeDeleteConfirmationModal = () => {
  showDeleteConfirmationModal.value = false
  itemToDelete.value = null
  deleteImpact.value = null
  isDeleting.value = false
}

const closeBulkDeleteConfirmationModal = () => {
  showBulkDeleteConfirmationModal.value = false
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
  // If it's an asset, use the single asset delete method
  if (selectedEntityType.value === 'asset') {
    await executeSingleAssetDelete()
    return
  }
  
  isDeleting.value = true
  
  try {
    switch (selectedEntityType.value) {
      case 'category':
        await assetCategoryService.deleteAssetCategory(itemToDelete.value.id)
        break
      case 'type':
        await assetTypeService.deleteAssetType(itemToDelete.value.id)
        break
      case 'brand':
        await brandService.deleteBrand(itemToDelete.value.id)
        break
      case 'model':
        await modelService.deleteModel(itemToDelete.value.id)
        break
    }
    
    toastStore.showSuccess('Success', `${getEntityTitle().slice(0, -1)} deleted successfully!`)
    await loadItems()
    
    // Close modal
    closeDeleteConfirmationModal()
    
  } catch (error: any) {
    console.error('Error deleting item:', error)
    toastStore.showError('Error', error.message || `Failed to delete ${getEntityTitle().slice(0, -1).toLowerCase()}`)
  } finally {
    isDeleting.value = false
  }
}

const parseSpecifications = (specsInput: string) => {
  if (!specsInput.trim()) return undefined
  
  const specs: Record<string, string> = {}
  const lines = specsInput.split('\n')
  
  lines.forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      if (key && value) {
        specs[key] = value
      }
    }
  })
  
  return Object.keys(specs).length > 0 ? specs : undefined
}

const formatSpecifications = (specifications: any) => {
  if (!specifications) return ''
  
  // If it's already a string, return it
  if (typeof specifications === 'string') {
    return specifications
  }
  
  // If it's an object, format it as key-value pairs
  if (typeof specifications === 'object') {
    return Object.entries(specifications)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
  }
  
  return ''
}


const goBack = () => {
  router.push('/app/assets')
}

const viewModelDetails = (model: any) => {
  selectedModel.value = model
  showModelDetailsModal.value = true
}

const closeModelDetailsModal = () => {
  showModelDetailsModal.value = false
  selectedModel.value = null
}

const closeModals = () => {
  closeModelDetailsModal()
  closeDeleteConfirmationModal()
  closeBulkDeleteConfirmationModal()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatSpecificationsForDisplay = (specifications: any) => {
  if (!specifications) return ''
  
  // If it's already a string, return it
  if (typeof specifications === 'string') {
    return specifications
  }
  
  // If it's an object, format it as key-value pairs
  if (typeof specifications === 'object') {
    return Object.entries(specifications)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  }
  
  return ''
}

// SearchableDropdown change handlers
const onCategoryChange = (category: Item | null) => {
  if (category) {
    formData.categoryId = category.id?.toString() || ''
  } else {
    formData.categoryId = ''
  }
}

const onBrandChange = (brand: Item | null) => {
  if (brand) {
    formData.brandId = brand.id?.toString() || ''
  } else {
    formData.brandId = ''
  }
}

const onAssetTypeChange = (assetType: Item | null) => {
  if (assetType) {
    formData.assetTypeId = assetType.id?.toString() || ''
  } else {
    formData.assetTypeId = ''
  }
}

// Refresh individual dropdowns
const refreshCategories = async () => {
  isLoadingCategories.value = true
  try {
    const response = await assetCategoryService.getAssetCategories({ limit: 50 })
    categories.value = response.data.assetCategories
  } catch (error) {
    console.error('Error refreshing categories:', error)
    toastStore.showError('Error', 'Failed to refresh categories')
  } finally {
    isLoadingCategories.value = false
  }
}

const refreshAssetTypes = async () => {
  isLoadingAssetTypes.value = true
  try {
    const response = await assetTypeService.getAssetTypes({ limit: 50 })
    assetTypes.value = response.data.assetTypes
  } catch (error) {
    console.error('Error refreshing asset types:', error)
    toastStore.showError('Error', 'Failed to refresh asset types')
  } finally {
    isLoadingAssetTypes.value = false
  }
}

const refreshBrands = async () => {
  isLoadingBrands.value = true
  try {
    const response = await brandService.getBrands({ limit: 50 })
    brands.value = response.data.brands
  } catch (error) {
    console.error('Error refreshing brands:', error)
    toastStore.showError('Error', 'Failed to refresh brands')
  } finally {
    isLoadingBrands.value = false
  }
}

// Load initial data
const loadInitialData = async () => {
  try {
    // Load categories
    isLoadingCategories.value = true
    try {
      const categoryResponse = await assetCategoryService.getAssetCategories({ limit: 50 })
      categories.value = categoryResponse.data.assetCategories
    } catch (error) {
      console.error('Error loading categories:', error)
      toastStore.showError('Error', 'Failed to load categories')
    } finally {
      isLoadingCategories.value = false
    }

    // Load asset types
    isLoadingAssetTypes.value = true
    try {
      const typeResponse = await assetTypeService.getAssetTypes({ limit: 50 })
      assetTypes.value = typeResponse.data.assetTypes
      
      // Populate asset type filter options
      assetTypeFilterOptions.value = assetTypes.value.map(type => ({
        id: type.id,
        value: type.name,
        label: type.name
      }))
    } catch (error) {
      console.error('Error loading asset types:', error)
      toastStore.showError('Error', 'Failed to load asset types')
    } finally {
      isLoadingAssetTypes.value = false
    }

    // Load brands
    isLoadingBrands.value = true
    try {
      const brandResponse = await brandService.getBrands({ limit: 50 })
      brands.value = brandResponse.data.brands
      
      // Populate brand filter options
      brandFilterOptions.value = brands.value.map(brand => ({
        id: brand.id,
        value: brand.name,
        label: brand.name
      }))
    } catch (error) {
      console.error('Error loading brands:', error)
      toastStore.showError('Error', 'Failed to load brands')
    } finally {
      isLoadingBrands.value = false
    }

    // Load models
    isLoadingModels.value = true
    try {
      const modelResponse = await modelService.getModels({ limit: 50 })
      models.value = modelResponse.data.models
    } catch (error) {
      console.error('Error loading models:', error)
      toastStore.showError('Error', 'Failed to load models')
    } finally {
      isLoadingModels.value = false
    }
    
    await loadItems()
  } catch (error) {
    console.error('Error loading initial data:', error)
    toastStore.showError('Error', 'Failed to load initial data')
  }
}

// Assets-specific methods
const toggleAssetSelection = (assetId: string | number) => {
  const index = selectedAssetsForDeletion.value.indexOf(assetId)
  if (index > -1) {
    selectedAssetsForDeletion.value.splice(index, 1)
  } else {
    selectedAssetsForDeletion.value.push(assetId)
  }
}


const clearAssetSelection = () => {
  selectedAssetsForDeletion.value = []
}

const addSingleAsset = () => {
  const assetId = singleAssetInput.value.trim()
  
  if (!assetId) {
    showErrorToast('Please enter an asset ID')
    return
  }
  
  // Validate AST-XXXX format
  const astPattern = /^AST-\d{4}$/
  if (!astPattern.test(assetId)) {
    showErrorToast('Asset ID must be in format AST-XXXX (e.g., AST-0001)')
    return
  }
  
  // Check if the asset is in the current table (deletable assets)
  const deletableAssetIds = items.value.map(asset => asset.assetId)
  if (!deletableAssetIds.includes(assetId)) {
    showErrorToast(`Asset ${assetId} is not deletable (not in current list or doesn't meet deletion criteria)`)
    return
  }
  
  if (!selectedAssetsForDeletion.value.includes(assetId)) {
    selectedAssetsForDeletion.value.push(assetId)
    showToast(`Added asset ${assetId} to selection`, 'success')
  } else {
    showToast(`Asset ${assetId} is already selected`, 'info')
  }
  
  // Clear the input
  singleAssetInput.value = ''
}

// Helper functions for asset range operations
const validateRangeInputs = (fromValue: string, toValue: string): boolean => {
  if (!fromValue || !toValue) {
    showErrorToast('Please enter both "from" and "to" values')
    return false
  }
  
  const astPattern = /^AST-\d{4}$/
  if (!astPattern.test(fromValue) || !astPattern.test(toValue)) {
    showErrorToast('Asset IDs must be in format AST-XXXX (e.g., AST-0001)')
    return false
  }
  
  const startNum = Number.parseInt(fromValue.split('-')[1])
  const endNum = Number.parseInt(toValue.split('-')[1])
  
  if (startNum > endNum) {
    showErrorToast('"From" value must be less than or equal to "to" value')
    return false
  }
  
  return true
}

const generateAssetRange = (fromValue: string, toValue: string): string[] => {
  const startNum = Number.parseInt(fromValue.split('-')[1])
  const endNum = Number.parseInt(toValue.split('-')[1])
  
  const rangeAssetIds = []
  for (let i = startNum; i <= endNum; i++) {
    rangeAssetIds.push(`AST-${i.toString().padStart(4, '0')}`)
  }
  
  return rangeAssetIds
}

const filterValidAssets = (rangeAssetIds: string[]): string[] => {
  const deletableAssetIds = new Set(items.value.map(asset => asset.assetId))
  return rangeAssetIds.filter(assetId => deletableAssetIds.has(assetId))
}

const addAssetsToSelection = (validRangeAssets: string[]): { addedCount: number; alreadySelectedCount: number } => {
  let addedCount = 0
  let alreadySelectedCount = 0
  
  for (const assetId of validRangeAssets) {
    if (!selectedAssetsForDeletion.value.includes(assetId)) {
      selectedAssetsForDeletion.value.push(assetId)
      addedCount++
    } else {
      alreadySelectedCount++
    }
  }
  
  return { addedCount, alreadySelectedCount }
}

const buildResultMessage = (
  fromValue: string, 
  toValue: string, 
  addedCount: number, 
  notDeletableCount: number, 
  alreadySelectedCount: number
): { message: string; type: 'success' | 'info' } => {
  if (addedCount > 0) {
    let message = `Added ${addedCount} deletable asset(s) from range ${fromValue} to ${toValue}`
    if (notDeletableCount > 0) {
      message += `\n(${notDeletableCount} assets in range are not deletable and were skipped)`
    }
    if (alreadySelectedCount > 0) {
      message += `\n(${alreadySelectedCount} assets were already selected)`
    }
    return { message, type: 'success' }
  } else {
    let message = `No new assets added from range ${fromValue} to ${toValue}`
    if (notDeletableCount > 0) {
      message += `\n(${notDeletableCount} assets in range are not deletable)`
    }
    if (alreadySelectedCount > 0) {
      message += `\n(${alreadySelectedCount} assets were already selected)`
    }
    return { message, type: 'info' }
  }
}

const addAssetRange = async () => {
  const fromValue = assetFromInput.value.trim()
  const toValue = assetToInput.value.trim()
  
  if (!validateRangeInputs(fromValue, toValue)) {
    return
  }
  
  const rangeAssetIds = generateAssetRange(fromValue, toValue)
  const validRangeAssets = filterValidAssets(rangeAssetIds)
  const { addedCount, alreadySelectedCount } = addAssetsToSelection(validRangeAssets)
  
  const totalInRange = rangeAssetIds.length
  const notDeletableCount = totalInRange - validRangeAssets.length
  
  const { message, type } = buildResultMessage(fromValue, toValue, addedCount, notDeletableCount, alreadySelectedCount)
  showToast(message, type)
  
  // Clear the inputs
  assetFromInput.value = ''
  assetToInput.value = ''
}

const confirmBulkDelete = async () => {
  if (selectedAssetsForDeletion.value.length === 0) {
    showErrorToast('Please select assets to delete')
    return
  }
  
  // Show confirmation modal
  showBulkDeleteConfirmationModal.value = true
}

const executeBulkDelete = async () => {
  try {
    isBulkDeleting.value = true

    // Get asset IDs (database IDs, not assetId strings)
    const assetIdsToDelete = selectedAssetsForDeletion.value
      .map(selectedId => {
        const asset = items.value.find(item => item.id === selectedId || item.assetId === selectedId)
        return asset?.id
      })
      .filter(id => id !== undefined) as number[]

    if (assetIdsToDelete.length === 0) {
      toastStore.showError('Error', 'No valid assets selected for deletion')
      isBulkDeleting.value = false
      return
    }

    // Call bulk delete API
    const response = await assetService.bulkDeleteAssets(assetIdsToDelete)
    
    const { successCount, errorCount, results } = response.data
    
    // Show success message
    if (successCount > 0) {
      toastStore.showSuccess('Bulk Delete Complete', `Successfully deleted ${successCount} asset(s)`)
    }
    
    // Show error details
    if (errorCount > 0) {
      const failedResults = results.filter((r: any) => r.status === 'error')
      const errorMessages = failedResults.map((r: any) => `${r.assetId || r.id}: ${r.message}`)
      const errorMessage = errorMessages.length > 3 
        ? `${errorMessages.slice(0, 3).join('\n')}\n... and ${errorMessages.length - 3} more errors`
        : errorMessages.join('\n')
      toastStore.showError('Some Assets Could Not Be Deleted', errorMessage)
    }

    // Clear selection and reload
    selectedAssetsForDeletion.value = []
    showFormCard.value = false
    showBulkDeleteConfirmationModal.value = false
    await loadItems()
    
  } catch (error: any) {
    console.error('Error in bulk delete:', error)
    toastStore.showError('Error', 'Failed to perform bulk delete')
  } finally {
    isBulkDeleting.value = false
  }
}

const deleteSingleAsset = async (asset: any) => {
  // Set the asset to delete and show confirmation modal
  itemToDelete.value = asset
  showDeleteConfirmationModal.value = true
}

const executeSingleAssetDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    isDeleting.value = true

    // Call the delete API
    await assetService.deleteAsset(itemToDelete.value.id)
    
    toastStore.showSuccess('Success', `Asset ${itemToDelete.value.assetId} deleted successfully!`)
    
    // Close modal and reload assets
    showDeleteConfirmationModal.value = false
    itemToDelete.value = null
    await loadItems()
    
  } catch (error: any) {
    console.error('Error deleting asset:', error)
    
    // Handle specific error messages from the API
    if (error.response?.data?.message) {
      toastStore.showError('Cannot Delete Asset', error.response.data.message)
    } else {
      toastStore.showError('Error', 'Failed to delete asset')
    }
  } finally {
    isDeleting.value = false
  }
}

// Search and filter methods
const debouncedLoadAssets = () => {
  // Debounce search input
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loadItems()
  }, 300)
}

let debounceTimer: number

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value
  loadItems()
}

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
}

const onSortByChange = () => {
  loadItems()
}

const onAssetTypeFilterChange = () => {
  loadItems()
}

const onBrandFilterChange = () => {
  loadItems()
}


const onConditionChange = () => {
  loadItems()
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedSortBy.value = null
  selectedAssetTypeFilter.value = null
  selectedBrandFilter.value = null
  selectedCondition.value = null
  loadItems()
}

// Helper functions for toast messages
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (type === 'success') {
    toastStore.showSuccess('Success', message)
  } else if (type === 'error') {
    toastStore.showError('Error', message)
  } else {
    toastStore.showInfo('Info', message)
  }
}

const showErrorToast = (message: string) => {
  toastStore.showError('Error', message)
}

// Helper function to get asset display ID (AST-XXXX)
const getAssetDisplayId = (id: string | number): string => {
  // If it's already a string in AST-XXXX format, return it
  if (typeof id === 'string' && id.startsWith('AST-')) {
    return id
  }
  
  // Otherwise, find the asset in the items array and return its assetId
  const asset = items.value.find(item => item.id === id || item.assetId === id)
  return asset?.assetId || String(id)
}


// Lifecycle
onMounted(async () => {
  await loadInitialData()
})
</script>

<style scoped>
/* Card styling - Using Bootstrap defaults like AssetsView.vue */

/* Button styling - Matching AssetsView.vue theme */
.btn {
  border-radius: 0.375rem !important;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-modern {
  border-radius: 0.375rem !important;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--secondary-purple);
  border-color: var(--secondary-purple);
  color: white;
}

.btn-primary:hover {
  background-color: var(--mindstix-primary);
  border-color: var(--mindstix-primary);
  color: white;
}

.btn-outline-primary {
  color: var(--secondary-purple);
  border-color: var(--secondary-purple);
}

.btn-outline-primary:hover {
  background-color: var(--secondary-purple);
  border-color: var(--secondary-purple);
  color: white;
}

.btn-outline-secondary {
  color: var(--primary-mid-gray);
  border-color: var(--primary-mid-gray);
}

.btn-outline-secondary:hover {
  background-color: var(--primary-mid-gray);
  border-color: var(--primary-mid-gray);
  color: white;
}

.btn-success {
  background-color: var(--secondary-green);
  border-color: var(--secondary-green);
  color: white;
}

.btn-success:hover {
  background-color: var(--mindstix-success);
  border-color: var(--mindstix-success);
  color: white;
}

/* Form styling - Matching AssetsView.vue theme */
.form-control, .form-select {
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem !important;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  background-color: var(--primary-white);
}

.form-control:focus, .form-select:focus {
  border-color: var(--secondary-purple);
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
  background-color: var(--primary-white);
}

.form-control::placeholder,
textarea.form-control::placeholder {
  color: #6c757d !important;
  opacity: 1;
}

/* Target textarea placeholder in NotesTextarea component */
:deep(.auto-expand-textarea::placeholder) {
  color: #6c757d !important;
  opacity: 1 !important;
}

/* Consistent form label styling - matching NotesTextarea.vue and unified-form-styles.css */
.form-label {
  font-weight: 600 !important;
  color: #666666 !important;
  margin-bottom: 0.5rem !important;
  font-size: 1rem !important;
}

/* Required field asterisk styling */
.form-label .text-danger {
  color: #dc2626 !important;
  font-weight: 700 !important;
  font-size: 1.1em !important;
}

/* Optional field text styling */
.form-label .text-muted {
  color: #4b5563 !important;
  font-weight: 600 !important;
  font-size: 0.9em !important;
}

/* Match form label styling for SearchableDropdown */
.searchable-dropdown-wrapper :deep(.form-label) {
  font-weight: 600 !important;
  color: #666666 !important;
  margin-bottom: 0.5rem !important;
  font-size: 1rem !important;
}

/* Required field asterisk styling for SearchableDropdown */
.searchable-dropdown-wrapper :deep(.form-label .text-danger) {
  color: #dc2626 !important;
  font-weight: 700 !important;
  font-size: 1.1em !important;
}

/* Optional field text styling for SearchableDropdown */
.searchable-dropdown-wrapper :deep(.form-label .text-muted) {
  color: #4b5563 !important;
  font-weight: 600 !important;
  font-size: 0.9em !important;
}

.form-text {
  font-size: 0.875rem;
  color: var(--primary-mid-gray);
  margin-top: 0.25rem;
}

/* Table styling - Using Bootstrap defaults like AssetsView.vue */

/* Badge styling - Matching AssetsView.vue theme */
.badge {
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
}

.badge.bg-primary {
  background-color: var(--secondary-purple) !important;
  color: white !important;
}

.badge.bg-success {
  background-color: var(--secondary-green) !important;
  color: white !important;
}

.badge.bg-info {
  background-color: var(--mindstix-primary) !important;
  color: white !important;
}

/* Loading states */
.form-select:disabled {
  background-color: var(--primary-light-gray);
  opacity: 0.7;
  cursor: not-allowed;
  color: var(--primary-mid-gray);
}

.form-select:disabled option {
  color: var(--primary-mid-gray);
}

/* Modal styling - Matching AssetsView.vue theme */
.modal-header.bg-danger {
  background-color: var(--secondary-red) !important;
  color: white;
}

.modal-content {
  border: 1px solid var(--element-gray);
  border-radius: 0.5rem;
}

.modal-body {
  background-color: var(--primary-white);
}

.modal-footer {
  background-color: var(--primary-light-gray);
  border-top: 1px solid var(--element-gray);
}

.impact-details .card {
  transition: all 0.2s ease;
}

.impact-details .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.impact-details .card-body {
  padding: 1.5rem 1rem;
}

.impact-details .card-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--primary-black);
}

.impact-details .card-text {
  font-size: 0.9rem;
  color: var(--primary-mid-gray);
  margin-bottom: 0;
}

.alert {
  border-radius: 0.5rem;
  border: 1px solid var(--element-gray);
}

.alert-warning {
  background-color: #fff3cd;
  border-color: var(--secondary-orange);
  color: #856404;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: var(--secondary-red);
  color: #721c24;
}

.alert-success {
  background-color: #d1e7dd;
  border-color: var(--secondary-green);
  color: #0f5132;
}

/* Button group styling - Using main.css styling for consistent rounded corners */

/* Form Card - Using same design as filter dropdown in AssetsView.vue */
.form-card {
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

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}


.btn-outline-danger {
  color: var(--secondary-red);
  border-color: var(--secondary-red);
}

.btn-outline-danger:hover {
  background-color: var(--secondary-red);
  color: white;
  border-color: var(--secondary-red);
}

/* Responsive design */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }
  
  .card-header .d-flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn {
    font-size: 0.875rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .col-md-2 {
    margin-bottom: 0.5rem;
  }
  
  .btn {
    width: 100%;
  }
}

/* Additional styles for consistency */
h2, h5, h6 {
  color: var(--primary-black);
}

.text-muted {
  color: var(--primary-mid-gray) !important;
}

.spinner-border.text-primary {
  color: var(--secondary-purple) !important;
}

/* Card border colors */
.card.border-warning {
  border-color: var(--secondary-orange) !important;
}

.card.border-danger {
  border-color: var(--secondary-red) !important;
}

.card.border-info {
  border-color: var(--mindstix-primary) !important;
}

.card.border-primary {
  border-color: var(--secondary-purple) !important;
}

/* Icon colors in cards */
.text-warning {
  color: var(--secondary-orange) !important;
}

.text-danger {
  color: var(--secondary-red) !important;
}

.text-info {
  color: var(--mindstix-primary) !important;
}

.text-primary {
  color: var(--secondary-purple) !important;
}

/* Action Buttons - Using main.css styling from AssetsView.vue */
/* The .asset-actions .btn styling is now handled by main.css */
/* This ensures consistent button appearance across all pages */

/* Entity Type Selection Buttons - Using --secondary-gray color */
.btn-entity-active {
  background-color: var(--secondary-gray) !important;
  border-color: var(--secondary-gray) !important;
  color: white !important;
}

.btn-entity-active:hover {
  background-color: #5a6b7d !important;
  border-color: #5a6b7d !important;
  color: white !important;
}

.btn-entity-inactive {
  background-color: var(--primary-light-gray) !important;
  border-color: var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
}

.btn-entity-inactive:hover {
  background-color: var(--secondary-gray) !important;
  border-color: var(--secondary-gray) !important;
  color: white !important;
}

/* Column width control - Entity-specific table classes */

/* Categories table (3 columns: Name, Description, Actions) */
.table-category {
  table-layout: fixed;
}
.table-category th:nth-child(1), .table-category td:nth-child(1) { width: 25% !important; } /* Name */
.table-category th:nth-child(2), .table-category td:nth-child(2) { width: 65% !important; } /* Description */
.table-category th:nth-child(3), .table-category td:nth-child(3) { width: 10% !important; } /* Actions */

/* Brands table (3 columns: Name, Description, Actions) */
.table-brand {
  table-layout: fixed;
}
.table-brand th:nth-child(1), .table-brand td:nth-child(1) { width: 25% !important; } /* Name */
.table-brand th:nth-child(2), .table-brand td:nth-child(2) { width: 65% !important; } /* Description */
.table-brand th:nth-child(3), .table-brand td:nth-child(3) { width: 10% !important; } /* Actions */

/* Asset Types table (4 columns: Name, Category, Description, Actions) */
.table-type {
  table-layout: fixed;
}
.table-type th:nth-child(1), .table-type td:nth-child(1) { width: 25% !important; } /* Name */
.table-type th:nth-child(2), .table-type td:nth-child(2) { width: 20% !important; } /* Category */
.table-type th:nth-child(3), .table-type td:nth-child(3) { width: 45% !important; } /* Description */
.table-type th:nth-child(4), .table-type td:nth-child(4) { width: 10% !important; } /* Actions */

/* Models table (4 columns: Name, Brand, Asset Type, Actions) - No Description */
.table-model {
  table-layout: fixed;
}
.table-model th:nth-child(1), .table-model td:nth-child(1) { width: 30% !important; } /* Name */
.table-model th:nth-child(2), .table-model td:nth-child(2) { width: 25% !important; } /* Brand */
.table-model th:nth-child(3), .table-model td:nth-child(3) { width: 30% !important; } /* Asset Type */
.table-model th:nth-child(4), .table-model td:nth-child(4) { width: 15% !important; } /* Actions (View + Delete) */

/* Assets table - Dynamic column widths based on checkbox visibility */
.table-asset {
  table-layout: fixed;
}

/* When checkbox column is visible (6 columns: Checkbox, Asset ID, Name, Serial Number, Condition, Actions) */
.table-asset th:nth-child(1), .table-asset td:nth-child(1) { width: 5% !important; } /* Checkbox */
.table-asset th:nth-child(2), .table-asset td:nth-child(2) { width: 10% !important; } /* Asset ID */
.table-asset th:nth-child(3), .table-asset td:nth-child(3) { width: 35% !important; } /* Name (Type - Brand - Model) */
.table-asset th:nth-child(4), .table-asset td:nth-child(4) { width: 20% !important; } /* Serial Number */
.table-asset th:nth-child(5), .table-asset td:nth-child(5) { width: 15% !important; } /* Condition */
.table-asset th:nth-child(6), .table-asset td:nth-child(6) { width: 15% !important; } /* Actions */

/* When checkbox column is hidden (5 columns: Asset ID, Name, Serial Number, Condition, Actions) */
.table-asset:not(.show-checkboxes) th:nth-child(1), 
.table-asset:not(.show-checkboxes) td:nth-child(1) { width: 12% !important; } /* Asset ID */
.table-asset:not(.show-checkboxes) th:nth-child(2), 
.table-asset:not(.show-checkboxes) td:nth-child(2) { width: 38% !important; } /* Name (Type - Brand - Model) */
.table-asset:not(.show-checkboxes) th:nth-child(3), 
.table-asset:not(.show-checkboxes) td:nth-child(3) { width: 22% !important; } /* Serial Number */
.table-asset:not(.show-checkboxes) th:nth-child(4), 
.table-asset:not(.show-checkboxes) td:nth-child(4) { width: 18% !important; } /* Condition */
.table-asset:not(.show-checkboxes) th:nth-child(5), 
.table-asset:not(.show-checkboxes) td:nth-child(5) { width: 10% !important; } /* Actions */

/* Model Details Modal - Using same design as AssetsView.vue */
.equal-height-columns {
  display: flex;
  flex-wrap: wrap;
}

.equal-height-columns > [class*="col-"] {
  display: flex;
  flex-direction: column;
}

.asset-info-section-compact {
  margin-bottom: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
}

.asset-info-section-compact .section-title-compact {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.25rem !important;
  padding-bottom: 0.15rem;
  border-bottom: 1px solid #dee2e6;
}

.asset-info-section-compact .info-grid-compact {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex-grow: 1;
}

.asset-info-section-compact .info-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.15rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.asset-info-section-compact .info-item-compact:last-child {
  border-bottom: none;
}

.asset-info-section-compact .info-label-compact {
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0 !important;
  min-width: 120px;
  flex-shrink: 0;
}

.asset-info-section-compact .info-value-compact {
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  color: #212529 !important;
  margin-bottom: 0 !important;
  text-align: right;
  flex-grow: 1;
}


/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

/* View Details Button Hover Effect */
.btn-view-details:hover {
  color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
  background-color: rgba(51, 31, 234, 0.1) !important;
}

/* Delete Button Hover Effect */
.btn-delete-asset:hover {
  color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
  background-color: rgba(220, 53, 69, 0.1) !important;
}

/* Assets-specific styling */
.form-check-input {
  border-radius: 0.25rem !important;
  border: 1px solid var(--element-gray) !important;
}

.form-check-input:checked {
  background-color: var(--secondary-purple) !important;
  border-color: var(--secondary-purple) !important;
}

.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25) !important;
}

/* Bulk delete section styling */
.alert-info {
  background-color: #d1ecf1;
  border-color: var(--mindstix-primary);
  color: #0c5460;
}

/* Asset selection chips styling */
.badge.bg-warning {
  background-color: #8B4513 !important;
  color: white !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.875rem !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
}

/* Asset Add Buttons - Consistent sizing across all screen sizes */
.asset-add-btn {
  width: 103px !important;
  height: 38px !important;
  min-width: 103px !important;
  max-width: 103px !important;
  min-height: 38px !important;
  max-height: 38px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  border-radius: 0.5rem !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

.asset-add-btn:hover:not(:disabled) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.asset-add-btn:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

/* Ensure buttons maintain size on all screen sizes */
@media (max-width: 1200px) {
  .asset-add-btn {
    width: 103px !important;
    height: 38px !important;
  }
}

@media (max-width: 992px) {
  .asset-add-btn {
    width: 103px !important;
    height: 38px !important;
  }
}

@media (max-width: 768px) {
  .asset-add-btn {
    width: 103px !important;
    height: 38px !important;
  }
}

@media (max-width: 576px) {
  .asset-add-btn {
    width: 103px !important;
    height: 38px !important;
  }
}

@media (max-width: 480px) {
  .asset-add-btn {
    width: 103px !important;
    height: 38px !important;
  }
}

.badge .btn-close {
  background: none !important;
  border: none !important;
  padding: 0 !important;
  margin-left: 0.5rem !important;
  opacity: 0.8 !important;
  transition: opacity 0.2s ease !important;
}

.badge .btn-close:hover {
  opacity: 1 !important;
}

.badge .btn-close::before {
  content: "×" !important;
  font-size: 1.2em !important;
  font-weight: bold !important;
}

/* Confirmation Modal Buttons */
.btn-cancel-confirm {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  padding: 0.4rem 1rem !important;
  font-size: 0.9rem !important;
}

.btn-cancel-confirm:hover {
  background-color: var(--element-gray) !important;
  border-color: var(--primary-mid-light) !important;
  color: var(--primary-black) !important;
  transform: translateY(-1px) !important;
}

.btn-confirm-delete {
  background-color: var(--secondary-red) !important;
  border-color: var(--secondary-red) !important;
  color: white !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  padding: 0.4rem 1rem !important;
  font-size: 0.9rem !important;
  box-shadow: 0 2px 8px rgba(233, 118, 118, 0.25) !important;
}

.btn-confirm-delete:hover {
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


</style>
