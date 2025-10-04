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
          <button class="btn btn-primary btn-modern" @click="startAdding">
            <i class="fas fa-plus me-1"></i>Add New
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
                    <label class="form-label">Category Name <span class="text-danger">*</span></label>
                    <input 
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
                    <label class="form-label">Asset Type Name <span class="text-danger">*</span></label>
                    <input 
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
                    <label class="form-label">Brand Name <span class="text-danger">*</span></label>
                    <input 
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
                    <label class="form-label">Model Name <span class="text-danger">*</span></label>
                    <input 
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

            </div>
          </div>
          
          <!-- Form Action Buttons - Bottom Right -->
          <div class="d-flex justify-content-end gap-2 mt-4  ">
            <button type="button" class="btn btn-outline-secondary btn-modern" @click="resetForm">
              <i class="fas fa-refresh me-1"></i>Reset
            </button>
            <button class="btn btn-success btn-modern" @click="saveEntity" :disabled="isSaving">
              <i v-if="isSaving" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-save me-1"></i>
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Items Table -->
    <div class="mt-5" v-if="items.length > 0">
        <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0" :class="`table-${selectedEntityType}`">
              <thead class="table-light">
                <tr>
                  <th>Name</th>
                  <th v-if="selectedEntityType === 'type'">Category</th>
                  <th v-if="selectedEntityType === 'model'">Brand</th>
                  <th v-if="selectedEntityType === 'model'">Asset Type</th>
                  <th v-if="selectedEntityType !== 'model'">Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <strong style="color: var(--primary-black);">{{ item.name }}</strong>
              </td>
              <td v-if="selectedEntityType === 'type'">
                <span class="text-muted">{{ item.category?.name || 'Unknown' }}</span>
              </td>
              <td v-if="selectedEntityType === 'model'">
                <span class="text-muted">{{ item.brand?.name || 'Unknown' }}</span>
              </td>
              <td v-if="selectedEntityType === 'model'">
                <span class="text-muted">{{ item.assetType?.name || 'Unknown' }}</span>
              </td>
              <td v-if="selectedEntityType !== 'model'">
                <span class="text-muted">{{ item.description || 'No description' }}</span>
              </td>
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
                    class="btn btn-outline-danger btn-delete-asset" 
                    @click="deleteItem(item)"
                    title="Delete"
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

    <!-- Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showDeleteConfirmationModal }" 
      :style="{ display: showDeleteConfirmationModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="itemToDelete"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
              <i class="fas fa-trash me-2" style="color: var(--secondary-red);"></i>Delete {{ getEntityTitle().slice(0, -1) }} - {{ itemToDelete?.name }}
            </h5>
            <button type="button" class="btn-close" @click="closeDeleteConfirmationModal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Warning:</strong> This action will permanently delete the {{ getEntityTitle().slice(0, -1).toLowerCase() }} and cannot be undone.
            </div>
            
            <!-- Entity Summary -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="asset-info-section-compact">
                  <h6 class="section-title-compact">
                    <i :class="getEntityIcon()" class="me-2"></i>{{ getEntityTitle().slice(0, -1) }} Summary
                  </h6>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="info-item-compact">
                        <label class="info-label-compact">{{ getEntityTitle().slice(0, -1) }} Name</label>
                        <div class="info-value-compact fw-bold">{{ itemToDelete?.name }}</div>
                      </div>
                      <div v-if="itemToDelete?.description" class="info-item-compact">
                        <label class="info-label-compact">Description</label>
                        <div class="info-value-compact">{{ itemToDelete?.description || 'No description' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div v-if="selectedEntityType === 'type' && itemToDelete?.category" class="info-item-compact">
                        <label class="info-label-compact">Category</label>
                        <div class="info-value-compact">{{ itemToDelete?.category?.name || 'Unknown' }}</div>
                      </div>
                      <div v-if="selectedEntityType === 'model'" class="info-item-compact">
                        <label class="info-label-compact">Brand</label>
                        <div class="info-value-compact">{{ itemToDelete?.brand?.name || 'Unknown' }}</div>
                      </div>
                      <div v-if="selectedEntityType === 'model'" class="info-item-compact">
                        <label class="info-label-compact">Asset Type</label>
                        <div class="info-value-compact">{{ itemToDelete?.assetType?.name || 'Unknown' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Deletion Impact Analysis -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="asset-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-chart-line me-2"></i>Deletion Impact Analysis</h6>
                  
                  <div v-if="deleteImpact" class="impact-details">
                    <div class="row g-3">
                      <div v-if="deleteImpact.assetTypes > 0" class="col-md-6">
                        <div class="card border-warning">
                          <div class="card-body text-center">
                            <i class="fas fa-tags fa-2x text-warning mb-2"></i>
                            <h5 class="card-title">{{ deleteImpact.assetTypes }}</h5>
                            <p class="card-text">Asset Type{{ deleteImpact.assetTypes > 1 ? 's' : '' }}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="deleteImpact.assets > 0" class="col-md-6">
                        <div class="card border-danger">
                          <div class="card-body text-center">
                            <i class="fas fa-box fa-2x text-danger mb-2"></i>
                            <h5 class="card-title">{{ deleteImpact.assets }}</h5>
                            <p class="card-text">Asset{{ deleteImpact.assets > 1 ? 's' : '' }}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="deleteImpact.models > 0" class="col-md-6">
                        <div class="card border-info">
                          <div class="card-body text-center">
                            <i class="fas fa-cube fa-2x text-info mb-2"></i>
                            <h5 class="card-title">{{ deleteImpact.models }}</h5>
                            <p class="card-text">Model{{ deleteImpact.models > 1 ? 's' : '' }}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="deleteImpact.employees > 0" class="col-md-6">
                        <div class="card border-primary">
                          <div class="card-body text-center">
                            <i class="fas fa-users fa-2x text-primary mb-2"></i>
                            <h5 class="card-title">{{ deleteImpact.employees }}</h5>
                            <p class="card-text">Employee{{ deleteImpact.employees > 1 ? 's' : '' }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="deleteImpact.assetTypes > 0 || deleteImpact.assets > 0 || deleteImpact.models > 0 || deleteImpact.employees > 0" class="mt-3">
                      <div class="alert alert-danger">
                        <h6 class="alert-heading">
                          <i class="fas fa-ban me-2"></i>Deletion Not Allowed
                        </h6>
                        <p class="mb-0">
                          This {{ getEntityTitle().slice(0, -1).toLowerCase() }} cannot be deleted because it has associated data. 
                          Please reassign or delete the related items first.
                        </p>
                      </div>
                    </div>
                    
                    <div v-else class="mt-3">
                      <div class="alert alert-success">
                        <h6 class="alert-heading">
                          <i class="fas fa-check-circle me-2"></i>Safe to Delete
                        </h6>
                        <p class="mb-0">
                          This {{ getEntityTitle().slice(0, -1).toLowerCase() }} has no associated data and can be safely deleted.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div v-else class="text-center">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Analyzing deletion impact...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteConfirmationModal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="confirmDelete"
              :disabled="!deleteImpact || deleteImpact.assetTypes > 0 || deleteImpact.assets > 0 || deleteImpact.models > 0 || deleteImpact.employees > 0"
            >
              <i class="fas fa-trash me-1"></i>
              {{ isDeleting ? 'Deleting...' : `Delete ${getEntityTitle().slice(0, -1)}` }}
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Model Details - {{ selectedModel.name }}</h5>
            <button type="button" class="btn-close" @click="closeModelDetailsModal"></button>
          </div>
          <div class="modal-body">
            <!-- Model Information - Full Width -->
            <div class="row g-2">
              <div class="col-12">
                <div class="asset-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-info-circle me-2"></i>Basic Information</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <label class="info-label-compact">Model Name</label>
                      <div class="info-value-compact fw-bold">{{ selectedModel.name }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Brand</label>
                      <div class="info-value-compact">{{ selectedModel.brand?.name || 'Unknown' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Asset Type</label>
                      <div class="info-value-compact fw-bold">{{ selectedModel.assetType?.name || 'Unknown' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Category</label>
                      <div class="info-value-compact">{{ selectedModel.assetType?.category?.name || 'Unknown' }}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Specifications Details - Full Width -->
            <div class="row mt-2">
              <div class="col-12">
                <div class="asset-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-list-alt me-2"></i>Technical Specifications</h6>
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
          <div class="modal-footer">
            <div class="d-flex justify-content-between w-100">
              <div>
                <!-- Left side: Additional actions (none for models) -->
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary" @click="closeModelDetailsModal">Close</button>
                <button type="button" class="btn btn-danger" @click="deleteItem(selectedModel)">
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
      v-if="showModelDetailsModal || showDeleteConfirmationModal" 
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
const selectedEntityType = ref<'category' | 'type' | 'brand' | 'model'>('category')
const isSaving = ref(false)
const showFormCard = ref(false)

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
    model: 'fas fa-cube'
  }
  return icons[selectedEntityType.value]
}

const getEntityTitle = () => {
  const titles = {
    category: 'Asset Categories',
    type: 'Asset Types',
    brand: 'Brands',
    model: 'Models'
  }
  return titles[selectedEntityType.value]
}

const getEntityDescription = () => {
  const descriptions = {
    category: 'Manage high-level asset categories',
    type: 'Manage specific asset types within categories',
    brand: 'Manage asset brands and manufacturers',
    model: 'Manage specific models for brands and asset types'
  }
  return descriptions[selectedEntityType.value]
}

// Computed properties for dropdown filtering
const filteredAssetTypes = computed(() => {
  if (!formData.categoryId) return assetTypes.value
  return assetTypes.value.filter(type => type.categoryId === parseInt(formData.categoryId))
})

const filteredModels = computed(() => {
  if (!formData.brandId && !formData.assetTypeId) return models.value
  return models.value.filter(model => {
    const brandMatch = !formData.brandId || model.brandId === parseInt(formData.brandId)
    const typeMatch = !formData.assetTypeId || model.assetTypeId === parseInt(formData.assetTypeId)
    return brandMatch && typeMatch
  })
})

// Methods
const setEntityType = async (type: 'category' | 'type' | 'brand' | 'model') => {
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

const loadItems = async () => {
  try {
    switch (selectedEntityType.value) {
      case 'category':
        const categoryResponse = await assetCategoryService.getAssetCategories({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
        items.value = categoryResponse.data.assetCategories
        break
      case 'type':
        const typeResponse = await assetTypeService.getAssetTypes({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
        items.value = typeResponse.data.assetTypes
        break
      case 'brand':
        const brandResponse = await brandService.getBrands({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
        items.value = brandResponse.data.brands
        break
      case 'model':
        const modelResponse = await modelService.getModels({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })
        items.value = modelResponse.data.models
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
      data.categoryId = parseInt(formData.categoryId)
    }
    
    if (selectedEntityType.value === 'model') {
      data.brandId = parseInt(formData.brandId)
      data.assetTypeId = parseInt(formData.assetTypeId)
      data.specifications = parseSpecifications(formData.specifications)
    }
    
    if (formData.id) {
      // Update existing item
      switch (selectedEntityType.value) {
        case 'category':
          response = await assetCategoryService.updateAssetCategory(formData.id, data)
          break
        case 'type':
          response = await assetTypeService.updateAssetType(formData.id, data)
          break
        case 'brand':
          response = await brandService.updateBrand(formData.id, data)
          break
        case 'model':
          response = await modelService.updateModel(formData.id, data)
          break
      }
      toastStore.showSuccess('Success', `${getEntityTitle().slice(0, -1)} updated successfully!`)
    } else {
      // Create new item
      switch (selectedEntityType.value) {
        case 'category':
          response = await assetCategoryService.createAssetCategory(data)
          break
        case 'type':
          response = await assetTypeService.createAssetType(data)
          break
        case 'brand':
          response = await brandService.createBrand(data)
          break
        case 'model':
          response = await modelService.createModel(data)
          break
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
      case 'category':
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
        
      case 'type':
        // Get asset type details with counts
        const typeResponse = await assetTypeService.getAssetTypeById(item.id)
        const assetType = typeResponse.data.assetType
        impact.assets = assetType._count?.assets || 0
        impact.models = assetType._count?.models || 0
        break
        
      case 'brand':
        // For brands, we need to count models and assets
        const brandModels = models.value.filter(model => model.brandId === item.id)
        impact.models = brandModels.length
        
        // Count assets through models (this would need a more complex query in real implementation)
        // For now, we'll estimate based on models
        impact.assets = brandModels.reduce((total: number, model: any) => {
          return total + (model._count?.assets || 0)
        }, 0)
        break
        
      case 'model':
        // For models, count assets
        const modelResponse = await modelService.getModelById(item.id)
        const model = modelResponse.data.model
        impact.assets = model._count?.assets || 0
        break
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

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
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

.btn-outline-primary {
  color: var(--secondary-purple);
  border-color: var(--secondary-purple);
}

.btn-outline-primary:hover {
  background-color: rgba(51, 31, 234, 0.1);
  color: var(--secondary-purple);
  border-color: var(--secondary-purple);
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

</style>
