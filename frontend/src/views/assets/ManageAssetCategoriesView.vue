<template>
  <div class="container-fluid px-3 py-4">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0" style="color: var(--primary-black);">Manage Asset Categories</h2>
        <p class="text-muted mb-0">Simple form to manage categories, types, brands, models, and vendors</p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-gray" @click="goBack">
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
          <button v-if="selectedEntityType !== 'asset'" class="btn btn-purple" @click="startAdding">
            <i class="fas fa-plus me-1"></i>Add New
          </button>
          <button v-if="selectedEntityType === 'asset'" class="btn btn-red" @click="startBulkDelete">
            <i class="fas fa-trash me-1"></i>Bulk Delete
          </button>
        </div>
      </div>
      <form @submit.prevent="saveEntity">
        <!-- Form Card - Using same design as filter dropdown in AssetsView.vue -->
        <div v-if="showFormCard" class="form-card scrollable-form mt-3 p-3 bg-light rounded">
          <div class="row">
            <div class="col-12">
              
              <!-- Category Form -->
              <div v-if="selectedEntityType === 'category'">
                <div class="row g-3">
                  <div class="col-12">
                    <label for="category-name" class="form-label">Category <span class="text-danger">*</span></label>
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
                      :disabled="isLoadingCategories || isTypeEditMode"
                      required
                      @change="onCategoryChange"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="asset-type-name" class="form-label">Asset Type <span class="text-danger">*</span></label>
                    <input 
                      id="asset-type-name"
                      type="text" 
                      class="form-control" 
                      v-model="formData.name"
                      placeholder="Laptop, Monitor, Chair, Vehicle"
                      style="text-transform: capitalize;"
                      required
                      :disabled="isTypeEditMode"
                    >
                  </div>
                  <div class="col-12">
                    <NotesTextarea
                      v-model="formData.description"
                      label="Description"
                      placeholder="Brief description of this asset type"
                      :max-length="100"
                      :min-rows="2"
                      input-id="asset-type-description"
                    />
                  </div>
                  
                  <!-- NEW: Specification Fields Builder -->
                  <div class="col-12 mt-0">
                    <div class="specification-builder">
                      <div class="form-label mb-2">
                        <i class="fas fa-list me-2"></i>Specification Fields
                        <span class="text-muted">(Optional - Define custom fields for assets of this type)</span>
                      </div>
                      
                      <div v-if="formData.specFields && formData.specFields.length > 0" class="spec-fields-list">
                        <div 
                          v-for="(field, index) in formData.specFields" 
                          :key="field.key || `field-${index}`"
                          class="spec-field-item"
                        >
                          <!-- Field Header Row -->
                          <div class="row g-2 align-items-start mb-2">
                            <div class="col-12 col-md-7 col-lg-7">
                              <label :for="`field-label-${index}`" class="form-label small fw-bold mb-2">Field Label</label>
                              <input 
                                type="text" 
                                :id="`field-label-${index}`"
                                class="form-control" 
                                v-model="field.label"
                                placeholder="e.g., Operating System"
                              >
                            </div>
                            <div class="col-6 col-md-3 col-lg-3">
                              <label :for="`field-type-${index}`" class="form-label small fw-bold mb-2">Type</label>
                              <select
                                :id="`field-type-${index}`"
                                class="form-select"
                                v-model="field.type"
                                :disabled="field.isExisting"
                                @change="onSpecFieldTypeChange(index)"
                              >
                                <option value="dropdown">Dropdown</option>
                                <option value="text">Text</option>
                              </select>
                            </div>
                            <div class="col-6 col-md-2 col-lg-1">
                              <div class="form-label small fw-bold mb-2 d-block">Required</div>
                              <div class="form-check form-switch">
                                <!-- NOSONAR: aria-checked is present via Vue binding on line 205, SonarQube static analyzer doesn't recognize Vue template syntax -->
                                <input 
                                  :id="`field-required-${index}`"
                                  class="form-check-input" 
                                  type="checkbox" 
                                  v-model="field.required"
                                  role="switch"
                                  :aria-checked="field.required ? 'true' : 'false'"
                                  aria-label="Required field"
                                >
                                <label :for="`field-required-${index}`" class="form-check-label small">
                                  {{ field.required ? 'Yes' : 'No' }}
                                </label>
                              </div>
                            </div>
                            <div class="col-12 col-md-2 col-lg-1 text-md-end">
                              <div class="form-label small fw-bold mb-2 d-block text-md-end">Actions</div>
                              <button 
                                type="button" 
                                class="btn btn-sm btn-red" 
                                @click="removeSpecField(index)"
                                title="Remove this field"
                                :disabled="field.isExisting"
                                :class="{ 'disabled-button': field.isExisting }"
                              >
                                <i class="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          
                          <!-- Text type preview -->
                          <div v-if="(field.type || 'dropdown') === 'text'" class="mt-2">
                            <div class="form-label small fw-bold mb-1">Preview</div>
                            <input
                              type="text"
                              class="form-control form-control-sm"
                              :placeholder="`Free text input for ${field.label || 'this field'}`"
                              :maxlength="50"
                              disabled
                            >
                            <small class="text-muted">Users will type any value (max 50 characters) when adding/editing an asset.</small>
                          </div>

                          <!-- Dropdown Options Section -->
                          <div v-else class="mt-2">
                            <div class="form-label small fw-bold mb-1">Options</div>
                            
                            <div class="row g-2 justify-content-between">
                              <div 
                                v-for="(option, optionIndex) in field.options" 
                                :key="`${field.key || index}-${option.value}-${optionIndex}`" 
                                class="col-12 col-md-12 col-lg-6 mb-1"
                              >
                                <div class="row g-2 me-3 align-items-center">
                                  <!-- Input and Toggle -->
                                  <div class="col-11">
                                    <div class="row g-2">
                                      <div class="col-10">
                                        <input 
                                          type="text" 
                                          :id="`option-value-${index}-${optionIndex}`"
                                          class="form-control" 
                                          :class="{ 'bg-light': option.isExisting }"
                                          v-model="option.value"
                                          :readonly="option.isExisting"
                                          :disabled="option.isExisting"
                                          placeholder="Option value"
                                        >
                                      </div>
                                      <div class="col-2">
                                        <div class="form-check form-switch">
                                          <input 
                                            :id="`option-deprecated-${index}-${optionIndex}`"
                                            class="form-check-input" 
                                            type="checkbox" 
                                            v-model="option.deprecated"
                                          >
                                          <label :for="`option-deprecated-${index}-${optionIndex}`" class="form-check-label small">
                                            {{ option.deprecated ? 'Hidden' : 'Visible' }}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <!-- Remove button (only for new options) -->
                                  <div class="col-1" v-if="!option.isExisting">
                                    <button 
                                      type="button" 
                                      class="btn btn-sm btn-gray w-100" 
                                      @click="removeNewOption(index, optionIndex)"
                                    >
                                      <i class="fas fa-times"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Add New Option -->
                            <label :for="`new-option-${index}`" class="form-label small fw-bold mb-1 d-block mt-2">Add New Option</label>
                            <div class="row g-2 align-items-center">
                              <div class="col-sm-8 col-md-5">
                                <input 
                                  type="text" 
                                  :id="`new-option-${index}`"
                                  class="form-control" 
                                  v-model="field.newOptionValue"
                                  placeholder="Add new option"
                                  @keyup.enter="addNewOption(index)"
                                >
                              </div>
                              <div class="col-sm-4 col-md-2 col-lg-1">
                                <button 
                                  type="button" 
                                  class="btn btn-sm btn-purple w-100" 
                                  @click="addNewOption(index)"
                                >
                                  <i class="fas fa-plus me-1"></i>Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div v-else class="alert alert-info py-2 mb-2">
                        <i class="fas fa-info-circle me-2"></i>
                        <small><strong>No specification fields defined yet.</strong> Click "Add Field" below to define custom fields for this asset type.</small>
                      </div>
                      
                      <div class="d-flex align-items-center justify-content-end gap-2 mt-2">
                        <button 
                          type="button" 
                          class="btn btn-sm btn-purple" 
                          @click="addSpecField"
                          :disabled="formData.specFields && formData.specFields.length >= 20"
                        >
                          <i class="fas fa-plus me-1"></i>Add Field
                        </button>
                        <span v-if="formData.specFields && formData.specFields.length >= 20" class="text-warning small">
                          <i class="fas fa-exclamation-triangle me-1"></i>Maximum 20 fields reached
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Brand Form -->
              <div v-if="selectedEntityType === 'brand'">
                <div class="row g-3">
                  <div class="col-12">
                    <label for="brand-name" class="form-label">Brand <span class="text-danger">*</span></label>
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
                    <label for="model-name" class="form-label">Model <span class="text-danger">*</span></label>
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
                      label="Description"
                      placeholder="Add a brief description or structured specs (e.g., Processor: Intel i7, RAM: 16GB)"
                      help-text="Provide either a narrative description or structured key-value specs. Both formats are supported."
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
                    <label for="single-asset-input" class="form-label">Single Asset <span class="text-danger">*</span></label>
                    <div class="row justify-content-around">
                      <div class="col-7">
                        <input 
                          id="single-asset-input"
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
                          class="btn btn-brown w-100" 
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
                    <label for="asset-range-from" class="form-label">Asset Range <span class="text-danger">*</span></label>
                     <div class="row justify-content-around">
                       <div class="col-9">
                         <div class="d-flex align-items-center gap-2">
                           <label for="asset-range-from" class="text-muted">From</label>
                        <input 
                          id="asset-range-from"
                          type="text" 
                          class="form-control" 
                          v-model="assetFromInput"
                          placeholder="AST-0000"
                          @keyup.enter="addAssetRange"
                          pattern="AST-\d{4}"
                          title="Format: AST-XXXX (e.g., AST-0000)"
                        >
                           <label for="asset-range-to" class="text-muted">to</label>
                           <input 
                             id="asset-range-to"
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
                           class="btn btn-brown w-100" 
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
                        <label for="selected-assets-display" class="form-label mb-1">Selected Assets ({{ selectedAssetsForDeletion.length }})</label>
                      </div>
                    </div>
                    <div id="selected-assets-display" v-if="selectedAssetsForDeletion.length > 0" class="mt-3">
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
            <button v-if="selectedEntityType !== 'asset'" type="button" class="btn btn-gray btn-sm" @click="resetForm">
              <i class="fas fa-refresh me-1"></i>Reset
            </button>
            <button v-if="selectedEntityType === 'asset'" type="button" class="btn btn-gray btn-sm" @click="clearAssetSelection">
              <i class="fas fa-times me-1"></i>Clear
            </button>
            <button v-if="selectedEntityType !== 'asset'" class="btn btn-green btn-sm" @click="saveEntity" :disabled="isSaving">
              <i v-if="isSaving" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-save me-1"></i>
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
            <button v-if="selectedEntityType === 'asset'" type="button" class="btn btn-red btn-sm" @click="confirmBulkDelete" :disabled="selectedAssetsForDeletion.length === 0 || isBulkDeleting">
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
          <label for="asset-search-input" class="form-label">Search</label>
          <div class="search-input-container">
            <i class="fas fa-search search-icon"></i>
            <input 
              id="asset-search-input"
              type="text" 
              class="form-control search-input" 
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
              <button class="btn btn-gray w-100 d-flex align-items-center justify-content-center" @click="toggleSortOrder" :title="'Toggle Sort Order'">
                <i :class="['fas', sortAscending ? 'fa-sort-amount-down' : 'fa-sort-amount-up']" style="font-size: 0.9rem;"></i>
              </button>
            </div>
            
            <!-- Filter Button -->
            <div class="col-8">
              <button 
                class="btn btn-gray w-100" 
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
                    v-if="selectedEntityType === 'type'"
                    class="btn btn-action btn-purple" 
                    @click="editAssetType(item)"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    v-if="selectedEntityType === 'model'"
                    class="btn btn-action btn-brown" 
                    @click="viewModelDetails(item)"
                    title="View Model Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="selectedEntityType !== 'asset'"
                    class="btn btn-action btn-red" 
                    @click="deleteItem(item)"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <button 
                    v-if="selectedEntityType === 'asset'"
                    class="btn btn-action btn-red" 
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
            <button type="button" class="btn btn-gray btn-sm btn-close" @click="closeDeleteConfirmationModal"></button>
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
            <button type="button" class="btn btn-gray btn-sm" @click="closeDeleteConfirmationModal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-red btn-sm"
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
            <button type="button" class="btn btn-gray btn-sm btn-close" @click="closeBulkDeleteConfirmationModal"></button>
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
            <button type="button" class="btn btn-gray btn-sm" @click="closeBulkDeleteConfirmationModal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-red btn-sm"
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
            <button type="button" class="btn btn-gray btn-sm btn-close" @click="closeModelDetailsModal"></button>
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
                <button type="button" class="btn btn-gray btn-sm" @click="closeModelDetailsModal">Close</button>
                <button type="button" class="btn btn-red btn-sm" @click="deleteItem(selectedModel)">
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { assetCategoryService } from '../../services/api/assetCategoryService'
import { assetTypeService } from '../../services/api/assetTypeService'
import { brandService } from '../../services/api/brandService'
import { modelService } from '../../services/api/modelService'
import { assetService } from '../../services/business/assetService'
import NotesTextarea from '../../components/common/NotesTextarea.vue'
import NotesDisplay from '../../components/common/NotesDisplay.vue'
import SearchableDropdown, { type Item } from '../../components/common/SearchableDropdown.vue'
import type { AssetCategory } from '../../services/api/assetCategoryService'
import type { AssetType } from '../../services/api/assetTypeService'
import type { Brand } from '../../services/api/brandService'
import type { Model } from '../../services/api/modelService'

const router = useRouter()
const toastStore = useToastStore()

// State
const selectedEntityType = ref<'category' | 'type' | 'brand' | 'model' | 'asset'>('category')
const isSaving = ref(false)
const showFormCard = ref(false)
const isEditingAssetType = ref(false)
const originalSpecificationTemplate = ref<any>(null)

// Assets-specific state
const selectedAssetsForDeletion = ref<(string | number)[]>([])
const isBulkDeleting = ref(false)
const singleAssetInput = ref('AST-')
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
const isTypeEditMode = computed(() => selectedEntityType.value === 'type' && isEditingAssetType.value)

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
  { value: 'NON_ASSIGNED', label: 'Non Assigned' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_MAINTENANCE', label: 'In Maintenance' },
  { value: 'RETIRED', label: 'Retired' },
  { value: 'LOST', label: 'Lost' },
  { value: 'DONATED', label: 'Donated' }
])

const conditionOptions = ref<Item[]>([
  { value: 'NEW', label: 'New' },
  { value: 'WORKING_CONDITION', label: 'Working Condition' },
  { value: 'SOFTWARE_ISSUE', label: 'Software Issue' },
  { value: 'HARDWARE_ISSUE', label: 'Hardware Issue' },
  { value: 'NEEDS_REPAIR', label: 'Needs Repair' },
  { value: 'TRASH', label: 'Trash' },
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

// Specification field interface
interface SpecOption {
  value: string
  deprecated?: boolean
  isExisting?: boolean
}

interface SpecField {
  key?: string
  label: string
  type?: string
  required?: boolean
  isExisting?: boolean
  options: SpecOption[]
  newOptionValue?: string
}

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
  
  // Asset Type specific - Specification Fields (PROTOTYPE)
  specFields: [] as SpecField[],
  
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
  for (const key of Object.keys(formData)) {
    if (key === 'id') {
      (formData as any)[key] = null
    } else if (key === 'specFields') {
      (formData as any)[key] = []
    } else {
      (formData as any)[key] = ''
    }
  }
  // Don't close the form card on reset - keep it open
  
  // Reset SearchableDropdown selections
  selectedCategory.value = null
  selectedBrand.value = null
  selectedAssetType.value = null
  
  // Clear asset selection when resetting
  selectedAssetsForDeletion.value = []
  singleAssetInput.value = 'AST-'
  assetFromInput.value = ''
  assetToInput.value = ''
  isEditingAssetType.value = false
  originalSpecificationTemplate.value = null
}

// ============================================
// SPECIFICATION FIELDS MANAGEMENT (PROTOTYPE)
// ============================================

// Add new specification field
const addSpecField = () => {
  if (formData.specFields.length >= 20) {
    toastStore.showWarning('Limit Reached', 'Maximum 20 specification fields allowed per asset type')
    return
  }
  
  formData.specFields.push({
    label: '',
    type: 'dropdown',
    required: false,
    options: [],
    newOptionValue: '',
    isExisting: false
  })
  
  // Scroll to new field
  setTimeout(() => {
    const specFieldsList = document.querySelector('.spec-fields-list')
    if (specFieldsList) {
      specFieldsList.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, 100)
}

// Remove specification field
const removeSpecField = (index: number) => {
  const field = formData.specFields[index]
  if (field?.isExisting) {
    toastStore.showError('Locked Field', 'Existing specification fields cannot be removed')
    return
  }

  formData.specFields.splice(index, 1)
  toastStore.showInfo('Field Removed', 'Specification field removed')
}

const addNewOption = (fieldIndex: number) => {
  const field = formData.specFields[fieldIndex]
  const value = field.newOptionValue?.trim()
  
  if (!value) {
    toastStore.showError('Invalid Option', 'Please enter an option value before adding it')
    return
  }
  
  const duplicate = field.options.some(option => option.value.toLowerCase() === value.toLowerCase())
  if (duplicate) {
    toastStore.showError('Duplicate Option', `Option "${value}" already exists in this field`)
    return
  }
  
  field.options.push({
    value,
    deprecated: false,
    isExisting: false
  })
  field.newOptionValue = ''
}

const removeNewOption = (fieldIndex: number, optionIndex: number) => {
  const field = formData.specFields[fieldIndex]
  const option = field.options[optionIndex]
  
  if (option?.isExisting) {
    toastStore.showError('Locked Option', 'Existing options cannot be removed')
    return
  }
  
  field.options.splice(optionIndex, 1)
}

const normalizeOptionFromTemplate = (option: any): SpecOption | null => {
  if (typeof option === 'string') {
    return { value: option, deprecated: false, isExisting: true }
  }
  
  if (option?.value) {
    return {
      value: option.value,
      deprecated: Boolean(option.deprecated),
      isExisting: true
    }
  }
  
  return null
}

const buildSpecFieldsFromTemplate = (template: any): SpecField[] => {
  if (!template || !Array.isArray(template.fields)) {
    return []
  }

  return template.fields.map((field: any, index: number) => {
    const fieldType = (field.type || 'dropdown') as string
    const normalizedOptions: (SpecOption | null)[] =
      fieldType === 'dropdown' && Array.isArray(field.options)
        ? field.options.map((rawOption: any) => normalizeOptionFromTemplate(rawOption))
        : []

    const options = normalizedOptions.filter(
      (option): option is SpecOption => option !== null
    )

    return {
      key: field.key || `field_${index}`,
      label: field.label || `Field ${index + 1}`,
      type: fieldType,
      required: field.required || false,
      isExisting: true,
      options,
      newOptionValue: ''
    }
  })
}

const validateDropdownOptions = (field: any): boolean => {
  if (!field.options || field.options.length === 0) {
    toastStore.showError(
      'Missing Options',
      `Field "${field.label}" must have at least one dropdown option.`
    )
    return false
  }

  const seenOptions = new Set<string>()
  for (const option of field.options) {
    const value = option.value?.trim()
    if (!value) {
      toastStore.showError(
        'Incomplete Option',
        `One of the options in "${field.label}" is empty. Please provide a value.`
      )
      return false
    }

    const dedupeKey = value.toLowerCase()
    if (seenOptions.has(dedupeKey) && !option.isExisting) {
      toastStore.showError(
        'Duplicate Option',
        `Option "${value}" already exists in "${field.label}".`
      )
      return false
    }
    seenOptions.add(dedupeKey)
  }

  return true
}

// Validate all specification fields
const validateSpecificationFields = (): boolean => {
  for (const field of formData.specFields) {
    if (!field.label || !field.label.trim()) {
      toastStore.showError('Incomplete Fields', 'Each specification field must have a label')
      return false
    }

    const fieldType = field.type || 'dropdown'
    if (fieldType === 'dropdown' && !validateDropdownOptions(field)) {
      return false
    }
  }

  return true
}

// When the user toggles a field's Type select, clear options if switching to text
// and reset to an empty options array if switching back to dropdown.
const onSpecFieldTypeChange = (index: number) => {
  const field = formData.specFields[index]
  if (!field) return
  if ((field.type || 'dropdown') === 'text') {
    field.options = []
    field.newOptionValue = ''
  }
}

// Build specification template JSON (for prototype - just console.log)
const buildSpecificationTemplate = () => {
  if (!validateSpecificationFields()) {
    return null
  }
  
  if (!isEditingAssetType.value && formData.specFields.length === 0) {
    return null
  }
  
  const baseTemplate = originalSpecificationTemplate.value
    ? structuredClone(originalSpecificationTemplate.value)
    : { version: 1, fields: [] as any[] }

  if (!Array.isArray(baseTemplate.fields)) {
    baseTemplate.fields = []
  }

  const builderFieldsByKey = new Map(
    formData.specFields
      .filter(field => field.key)
      .map(field => [field.key as string, field])
  )

  const normalizeOptions = (options: any[]): SpecOption[] => {
    if (!Array.isArray(options)) {
      return []
    }

    const mappedOptions: (SpecOption | null)[] = options.map((option: any) => {
      if (typeof option === 'string') {
        return { value: option, deprecated: false }
      }

      if (option?.value) {
        return {
          value: option.value.trim(),
          deprecated: Boolean(option.deprecated)
        }
      }

      return null
    })

    return mappedOptions.filter(
      (option): option is SpecOption => option !== null
    )
  }

  const updatedFields = baseTemplate.fields.map((field: any) => {
    if (!field.key) {
      return {
        ...field,
        options: (field.type || 'dropdown') === 'dropdown'
          ? normalizeOptions(field.options)
          : field.options
      }
    }
    const builderField = builderFieldsByKey.get(field.key)
    if (!builderField) {
      return {
        ...field,
        options: (field.type || 'dropdown') === 'dropdown'
          ? normalizeOptions(field.options)
          : field.options
      }
    }
    builderFieldsByKey.delete(field.key)
    return {
      ...field,
      label: builderField.label.trim(),
      type: builderField.type || field.type || 'dropdown',
      required: builderField.required || false,
      options: (builderField.type || field.type || 'dropdown') === 'dropdown'
        ? builderField.options.map(option => ({
            value: option.value.trim(),
            deprecated: option.deprecated || false
          }))
        : builderField.options
    }
  })

  const newFields = formData.specFields
    .filter(field => !field.key)
    .map(field => ({
      label: field.label.trim(),
      type: field.type || 'dropdown',
      required: field.required || false,
      options: (field.type || 'dropdown') === 'dropdown'
        ? field.options.map(option => ({
            value: option.value.trim(),
            deprecated: option.deprecated || false
          }))
        : field.options
    }))

  baseTemplate.fields = [...updatedFields, ...newFields]

  return baseTemplate
}

const startAdding = () => {
  showFormCard.value = !showFormCard.value
  if (showFormCard.value) {
    isEditingAssetType.value = false
    // Clear form data without hiding the card
    for (const key of Object.keys(formData)) {
      if (key === 'id') {
        (formData as any)[key] = null
      } else if (key === 'specFields') {
        (formData as any)[key] = []
      } else {
        (formData as any)[key] = ''
      }
    }
    
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

const editAssetType = async (assetType: any) => {
  if (selectedEntityType.value !== 'type') {
    return
  }
  
  try {
    const response = await assetTypeService.getAssetTypeById(assetType.id)
    const detailedAssetType = response.data.assetType
    
    isEditingAssetType.value = true
    showFormCard.value = true
    originalSpecificationTemplate.value = detailedAssetType.specificationTemplate
      ? structuredClone(detailedAssetType.specificationTemplate)
      : null
    
    formData.id = detailedAssetType.id
    formData.name = detailedAssetType.name
    formData.description = detailedAssetType.description || ''
    formData.categoryId = detailedAssetType.categoryId?.toString() || ''
    
    if (detailedAssetType.category) {
      selectedCategory.value = {
        id: detailedAssetType.category.id,
        value: detailedAssetType.category.name,
        label: detailedAssetType.category.name
      }
    } else {
      selectedCategory.value = null
    }
    
    formData.specFields = buildSpecFieldsFromTemplate(detailedAssetType.specificationTemplate)
  } catch (error: any) {
    console.error('Error loading asset type details:', error)
    toastStore.showError('Error', error.message || 'Failed to load asset type details for editing')
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

const buildEntityData = (): any => {
  const data: any = {
    name: formData.name.trim(),
    description: formData.description.trim() || undefined
  }
  
  if (isTypeEditMode.value && selectedEntityType.value === 'type') {
    delete data.name
  }
  
  if (selectedEntityType.value === 'type') {
    if (!isTypeEditMode.value) {
      data.categoryId = Number.parseInt(formData.categoryId)
    }
    
    const template = buildSpecificationTemplate()
    if (template) {
      data.specificationTemplate = template
    }
  }
  
  if (selectedEntityType.value === 'model') {
    data.brandId = Number.parseInt(formData.brandId)
    data.assetTypeId = Number.parseInt(formData.assetTypeId)
    data.specifications = parseSpecifications(formData.specifications)
  }
  
  return data
}

const updateEntity = async (data: any) => {
  if (formData.id == null) {
    throw new Error('Cannot update entity: missing id')
  }
  const id = formData.id
  switch (selectedEntityType.value) {
    case 'category':
      await assetCategoryService.updateAssetCategory(id, data)
      break
    case 'type':
      await assetTypeService.updateAssetType(id, data)
      break
    case 'brand':
      await brandService.updateBrand(id, data)
      break
    case 'model':
      await modelService.updateModel(id, data)
      break
  }
  toastStore.showSuccess('Success', `${getEntityTitle().slice(0, -1)} updated successfully!`)
}

const createEntity = async (data: any) => {
  switch (selectedEntityType.value) {
    case 'category':
      await assetCategoryService.createAssetCategory(data)
      break
    case 'type':
      await assetTypeService.createAssetType(data)
      break
    case 'brand':
      await brandService.createBrand(data)
      break
    case 'model':
      await modelService.createModel(data)
      break
  }
  toastStore.showSuccess('Success', `${getEntityTitle().slice(0, -1)} created successfully!`)
}

const clearForm = () => {
  for (const key of Object.keys(formData)) {
    if (key === 'id') {
      (formData as any)[key] = null
    } else if (key === 'specFields') {
      (formData as any)[key] = []
    } else {
      (formData as any)[key] = ''
    }
  }
  isEditingAssetType.value = false
  showFormCard.value = false
  
  selectedCategory.value = null
  selectedBrand.value = null
  selectedAssetType.value = null
}

const refreshDropdowns = async () => {
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
      break
  }
}

const saveEntity = async () => {
  if (!formData.name.trim()) {
    toastStore.showError('Error', 'Name is required')
    return
  }
  
  isSaving.value = true
  
  try {
    const data = buildEntityData()
    
    if (formData.id) {
      await updateEntity(data)
    } else {
      await createEntity(data)
    }
    
    clearForm()
    await loadItems()
    await refreshDropdowns()
    
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
    const impact: any = {
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
  if (!specsInput || !specsInput.trim()) {
    return undefined
  }
  
  const specs: Record<string, string> = {}
  const lines = specsInput.split('\n')
  
  let hasKeyValuePairs = false
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    
    if (colonIndex > 0) {
      hasKeyValuePairs = true
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      
      if (key && value) {
        specs[key] = value
      }
    }
  }
  
  // If no key-value pairs found, treat the entire input as a description in an object
  if (!hasKeyValuePairs && specsInput.trim()) {
    const result = { description: specsInput.trim() }
    return result
  }
  
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
  
  if (selectedAssetsForDeletion.value.includes(assetId)) {
    showToast(`Asset ${assetId} is already selected`, 'info')
  } else {
    selectedAssetsForDeletion.value.push(assetId)
    showToast(`Added asset ${assetId} to selection`, 'success')
  }
  
  // Clear the input but keep AST- prefix
  singleAssetInput.value = 'AST-'
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
    if (selectedAssetsForDeletion.value.includes(assetId)) {
      alreadySelectedCount++
    } else {
      selectedAssetsForDeletion.value.push(assetId)
      addedCount++
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


// Debug watcher for specifications
watch(() => formData.specifications, () => {
  // No-op watcher retained for potential future side-effects
}, { deep: true })

// Lifecycle
onMounted(async () => {
  await loadInitialData()
})
</script>

<style scoped>
/**
 * Component-Specific Styles for ManageAssetCategoriesView
 * All general button, form, badge, modal styles are now in their respective component CSS files:
 * - buttons.css (button styling)
 * - form.css (form controls, labels)
 * - badges.css (badge styling)
 * - modals.css (modal styling)
 * - cards.css (card styling)
 * 
 * Only page-specific styles that aren't reusable should be here.
 */

/* Form Card Animation - Page specific */
.form-card {
  border: 1px solid #dee2e6;
  background-color: #f8f9fa !important;
  animation: slideDown 0.2s ease-out;
}

.scrollable-form {
  max-height: 75vh;
  overflow-y: auto;
  overflow-x: hidden;
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

/* Consistent Form Label Styling - Based on section-title-compact */
.form-label {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.15rem;
  display: block;
  line-height: 1.2;
}

/* Override for labels that shouldn't have border-bottom */
.form-label.mb-1 {
  border-bottom: none;
  margin-bottom: 0.25rem !important;
}

/* Target NotesTextarea component labels */
:deep(.notes-textarea-container .form-label) {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.15rem;
  display: block;
  line-height: 1.2;
}

/* Target SearchableDropdown component labels */
:deep(.searchable-dropdown-wrapper .form-label) {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.15rem;
  display: block;
  line-height: 1.2;
}

/* Hide validation styling for NotesTextarea components in this page only */
:deep(.notes-textarea-container .form-control.is-valid),
:deep(.notes-textarea-container .form-control.is-invalid),
:deep(.notes-textarea-container .form-control:valid),
:deep(.notes-textarea-container .form-control:invalid) {
  border-color: #dee2e6 !important;
  box-shadow: none !important;
  background-image: none !important;
  padding-right: 0.75rem !important;
  background-color: #fff !important;
  animation: none !important;
}

/* Hide validation styling for SearchableDropdown components in this page only */
:deep(.searchable-dropdown-wrapper .form-control.is-valid),
:deep(.searchable-dropdown-wrapper .form-control.is-invalid),
:deep(.searchable-dropdown-wrapper .form-control:valid),
:deep(.searchable-dropdown-wrapper .form-control:invalid) {
  border-color: #dee2e6 !important;
  box-shadow: none !important;
  background-image: none !important;
  padding-right: 0.75rem !important;
  background-color: #fff !important;
}

/* Hide validation styling for regular form controls in this page only */
.form-control.is-valid,
.form-control.is-invalid,
.form-control:valid,
.form-control:invalid {
  border-color: #dee2e6 !important;
  box-shadow: none !important;
  background-image: none !important;
  padding-right: 0.75rem !important;
  background-color: #fff !important;
}

/* Restore focus state effects for all form controls */
.form-control:focus,
:deep(.notes-textarea-container .form-control:focus),
:deep(.searchable-dropdown-wrapper .form-control:focus) {
  border-color: #86b7fe !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
  background-color: #fff !important;
  outline: 0 !important;
}

/* Ensure focus states work even with validation classes */
.form-control.is-valid:focus,
.form-control.is-invalid:focus,
.form-control:valid:focus,
.form-control:invalid:focus,
:deep(.notes-textarea-container .form-control.is-valid:focus),
:deep(.notes-textarea-container .form-control.is-invalid:focus),
:deep(.notes-textarea-container .form-control:valid:focus),
:deep(.notes-textarea-container .form-control:invalid:focus),
:deep(.searchable-dropdown-wrapper .form-control.is-valid:focus),
:deep(.searchable-dropdown-wrapper .form-control.is-invalid:focus),
:deep(.searchable-dropdown-wrapper .form-control:valid:focus),
:deep(.searchable-dropdown-wrapper .form-control:invalid:focus) {
  border-color: #86b7fe !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
  background-color: #fff !important;
  outline: 0 !important;
}

/* Table row vertical center alignment */
.table td {
  vertical-align: middle !important;
}

.table th {
  vertical-align: middle !important;
}

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


/* NOTE: The following styles are now handled by global component CSS files:
 * - Button hover effects → buttons.css (.btn-action with color variants)
 * - Form checkboxes → form.css (.form-check-input)
 * - Alert styles → modals.css (.alert-info)
 * - Badge close buttons → badges.css (.badge .btn-close)
 * - Asset selection badges → Use .badge.badge-brown.badge-sm from badges.css
 * - Asset add buttons → Use .btn.btn-brown.btn-sm from buttons.css
 * - Confirmation modal buttons → Use .btn-cancel and .btn-red from buttons.css
 * - Modal backdrop → modals.css
 * - Pulse animation → modals.css (.confirmation-icon)
 */

/* ===================================== */
/* SPECIFICATION BUILDER STYLES */
/* ===================================== */

.specification-builder {
  overflow-x: hidden;
}

.spec-fields-list {
  padding-right: 0.75rem;
}

.spec-field-item {
  border-bottom: 1px solid #dee2e6;
  padding: 0.75rem 0;
  margin-bottom: 0;
}

.spec-field-item:last-child {
  border-bottom: none;
}

.spec-field-item:first-child {
  padding-top: 0;
}

.spec-field-item .form-label.small {
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
}

.spec-field-item .form-control-sm,
.spec-field-item .form-select-sm {
  font-size: 0.9rem;
}

.specification-builder .alert-info {
  border-left: 4px solid var(--secondary-purple);
  background-color: #f0e7ff;
  border-color: var(--secondary-purple);
  color: var(--primary-dark-gray);
  font-size: 0.85rem;
}

/* Scrollbar styling for spec fields list */
.spec-fields-list::-webkit-scrollbar {
  width: 6px;
}

.spec-fields-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.spec-fields-list::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 10px;
}

.spec-fields-list::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Disabled button styling - show not-allowed cursor */
.disabled-button {
  cursor: not-allowed !important;
  pointer-events: all !important;
}

.disabled-button:disabled {
  cursor: not-allowed !important;
}


</style>

<style>
@import '@/assets/styles/pages/assets.css';
</style>

