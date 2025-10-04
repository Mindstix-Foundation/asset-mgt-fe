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
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0"><i class="fas fa-cogs me-2"></i>Select Entity Type</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-2">
            <button 
              class="btn w-100" 
              :class="selectedEntityType === 'category' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setEntityType('category')"
            >
              <i class="fas fa-folder me-2"></i>Categories
            </button>
          </div>
          <div class="col-md-2">
            <button 
              class="btn w-100" 
              :class="selectedEntityType === 'type' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setEntityType('type')"
            >
              <i class="fas fa-tags me-2"></i>Asset Types
            </button>
          </div>
          <div class="col-md-2">
            <button 
              class="btn w-100" 
              :class="selectedEntityType === 'brand' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setEntityType('brand')"
            >
              <i class="fas fa-trademark me-2"></i>Brands
            </button>
          </div>
          <div class="col-md-2">
            <button 
              class="btn w-100" 
              :class="selectedEntityType === 'model' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setEntityType('model')"
            >
              <i class="fas fa-cube me-2"></i>Models
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Form Card -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">
            <i :class="getEntityIcon()" class="me-2"></i>
            {{ getEntityTitle() }}
          </h5>
          <small class="text-muted">{{ getEntityDescription() }}</small>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" @click="resetForm">
            <i class="fas fa-refresh me-1"></i>Reset
          </button>
          <button class="btn btn-success" @click="saveEntity" :disabled="isSaving">
            <i v-if="isSaving" class="fas fa-spinner fa-spin me-1"></i>
            <i v-else class="fas fa-save me-1"></i>
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveEntity">
          
          <!-- Category Form -->
          <div v-if="selectedEntityType === 'category'">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Category Name <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.name"
                  placeholder="e.g., IT Equipment, Furniture, Vehicles"
                  required
                >
              </div>
              <div class="col-md-6">
                <label class="form-label">Description</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.description"
                  placeholder="Brief description of this category"
                >
              </div>
            </div>
          </div>

          <!-- Asset Type Form -->
          <div v-if="selectedEntityType === 'type'">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Category <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.categoryId" required :disabled="isLoadingCategories">
                  <option value="">
                    {{ isLoadingCategories ? 'Loading categories...' : 'Select Category' }}
                  </option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Asset Type Name <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.name"
                  placeholder="e.g., Laptop, Monitor, Chair, Vehicle"
                  required
                >
              </div>
              <div class="col-12">
                <label class="form-label">Description</label>
                <textarea 
                  class="form-control" 
                  v-model="formData.description"
                  rows="2"
                  placeholder="Brief description of this asset type"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Brand Form -->
          <div v-if="selectedEntityType === 'brand'">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Brand Name <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.name"
                  placeholder="e.g., Dell, Apple, HP, Microsoft"
                  required
                >
              </div>
              <div class="col-md-6">
                <label class="form-label">Description/Website</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.description"
                  placeholder="Brand description or website URL"
                >
              </div>
            </div>
          </div>

          <!-- Model Form -->
          <div v-if="selectedEntityType === 'model'">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Brand <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.brandId" required :disabled="isLoadingBrands">
                  <option value="">
                    {{ isLoadingBrands ? 'Loading brands...' : 'Select Brand' }}
                  </option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                    {{ brand.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Asset Type <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.assetTypeId" required :disabled="isLoadingAssetTypes">
                  <option value="">
                    {{ isLoadingAssetTypes ? 'Loading asset types...' : 'Select Asset Type' }}
                  </option>
                  <option v-for="type in assetTypes" :key="type.id" :value="type.id">
                    {{ type.name }} {{ type.category ? `(${type.category.name})` : '' }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Model Name <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.name"
                  placeholder="e.g., iPhone 15 Pro, MacBook Pro M3"
                  required
                >
              </div>
              <div class="col-12">
                <label class="form-label">Specifications</label>
                <textarea 
                  class="form-control" 
                  v-model="formData.specifications"
                  rows="4"
                  placeholder="Enter specifications as key-value pairs:
Processor: Intel i7-13700H
RAM: 16GB DDR5
Storage: 512GB SSD
Display: 15.6&quot; FHD"
                ></textarea>
                <div class="form-text">Enter specifications as key-value pairs (one per line)</div>
              </div>
            </div>
          </div>


        </form>
      </div>
    </div>

    <!-- Items Table -->
    <div class="mt-4" v-if="items.length > 0">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">
          <i :class="getEntityIcon()" class="me-2"></i>{{ getEntityTitle() }}
        </h5>
        <small class="text-muted">Showing {{ items.length }} items</small>
      </div>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th v-if="selectedEntityType === 'type'">Category</th>
              <th v-if="selectedEntityType === 'model'">Brand</th>
              <th v-if="selectedEntityType === 'model'">Asset Type</th>
              <th>Description</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <strong style="color: var(--primary-black);">{{ item.name }}</strong>
              </td>
              <td v-if="selectedEntityType === 'type'">
                <span class="badge bg-primary">{{ item.category?.name || 'Unknown' }}</span>
              </td>
              <td v-if="selectedEntityType === 'model'">
                <span class="badge bg-success">{{ item.brand?.name || 'Unknown' }}</span>
              </td>
              <td v-if="selectedEntityType === 'model'">
                <span class="badge bg-info">{{ item.assetType?.name || 'Unknown' }}</span>
              </td>
              <td>
                <span class="text-muted">{{ item.description || 'No description' }}</span>
              </td>
              <td>
                <small class="text-muted">{{ formatDate(item.createdAt) }}</small>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button 
                    class="btn btn-outline-primary" 
                    @click="editItem(item)"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-outline-danger" 
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

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deleteConfirmationModalLabel">
              <i class="fas fa-exclamation-triangle me-2"></i>Confirm Deletion
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="deleteImpact" class="alert alert-warning">
              <h6 class="alert-heading">
                <i class="fas fa-warning me-2"></i>Warning: This action will affect related data
              </h6>
              <p class="mb-0">Deleting <strong>{{ deleteImpact.itemName }}</strong> will impact the following:</p>
            </div>
            
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
                    Please reassign or delete the related items first, or consider using the merge functionality.
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
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="confirmDelete"
              :disabled="!deleteImpact || deleteImpact.assetTypes > 0 || deleteImpact.assets > 0 || deleteImpact.models > 0 || deleteImpact.employees > 0"
            >
              <i class="fas fa-trash me-1"></i>Delete {{ getEntityTitle().slice(0, -1) }}
            </button>
          </div>
        </div>
      </div>
    </div>

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
import type { AssetCategory } from '../../services/assetCategoryService'
import type { AssetType } from '../../services/assetTypeService'
import type { Brand } from '../../services/brandService'
import type { Model } from '../../services/modelService'

const router = useRouter()
const toastStore = useToastStore()

// State
const selectedEntityType = ref<'category' | 'type' | 'brand' | 'model'>('category')
const isSaving = ref(false)

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
const deleteImpact = ref<any>(null)
const itemToDelete = ref<any>(null)

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
    
    resetForm()
    await loadItems()
    
    // Refresh relevant dropdowns after creating new items
    if (!formData.id) {
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
    }
    
  } catch (error: any) {
    console.error('Error saving entity:', error)
    toastStore.showError('Error', error.message || `Failed to save ${getEntityTitle().slice(0, -1).toLowerCase()}`)
  } finally {
    isSaving.value = false
  }
}

const editItem = (item: any) => {
  formData.id = item.id
  formData.name = item.name
  formData.description = item.description || ''
  
  if (selectedEntityType.value === 'type') {
    formData.categoryId = item.categoryId?.toString() || item.category?.id?.toString() || ''
  }
  
  if (selectedEntityType.value === 'model') {
    formData.brandId = item.brandId?.toString() || item.brand?.id?.toString() || ''
    formData.assetTypeId = item.assetTypeId?.toString() || item.assetType?.id?.toString() || ''
    formData.specifications = item.specifications ? 
      Object.entries(item.specifications).map(([key, value]) => `${key}: ${value}`).join('\n') : ''
  }
  
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const deleteItem = async (item: any) => {
  itemToDelete.value = item
  deleteImpact.value = null
  
  // Show modal
  const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteConfirmationModal'))
  modal.show()
  
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

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
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
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'))
    modal.hide()
    
  } catch (error: any) {
    console.error('Error deleting item:', error)
    toastStore.showError('Error', error.message || `Failed to delete ${getEntityTitle().slice(0, -1).toLowerCase()}`)
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const goBack = () => {
  router.push('/app/assets')
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
/* Card styling */
.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border-radius: 0.75rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  border-radius: 0.75rem 0.75rem 0 0 !important;
  padding: 1.25rem;
}

/* Button styling */
.btn-modern {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #331FEA;
  border-color: #331FEA;
}

.btn-primary:hover {
  background-color: #2415c7;
  border-color: #2415c7;
}

.btn-outline-primary {
  color: #331FEA;
  border-color: #331FEA;
}

.btn-outline-primary:hover {
  background-color: #331FEA;
  border-color: #331FEA;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
}

/* Form styling */
.form-control, .form-select {
  border: 2px solid #ced4da;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #331FEA;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Table styling */
.table {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  overflow: hidden;
}

.table th {
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  background-color: #f8f9fa;
  padding: 1rem 0.75rem;
}

.table td {
  vertical-align: middle;
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: rgba(51, 31, 234, 0.05);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

/* Badge styling */
.badge {
  font-weight: 600;
  padding: 0.5em 0.75em;
}

/* Loading states */
.form-select:disabled {
  background-color: #f8f9fa;
  opacity: 0.7;
  cursor: not-allowed;
}

.form-select:disabled option {
  color: #6c757d;
}

/* Modal styling */
.modal-header.bg-danger {
  background-color: #dc3545 !important;
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
}

.impact-details .card-text {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0;
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
</style>
