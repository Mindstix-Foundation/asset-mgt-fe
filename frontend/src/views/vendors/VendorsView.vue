`<template>
  <div class="container-fluid px-3 py-4">
    <!-- Page Header -->
    <div class="row align-items-center mb-4">
      <!-- Title Section -->
      <div class="col-12 col-md-6 col-lg-3 mb-3 mb-lg-0">
        <h2 class="mb-0" style="color: var(--primary-black); white-space: nowrap;">Vendor Management</h2>
        <p class="text-muted mb-0">Manage suppliers and service providers</p>
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
                <div class="btn-group flex-shrink-0" role="group" aria-label="View toggle">
                  <button 
                    :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: !isGridView }]"
                    @click="toggleView('list')"
                    style="min-width: 35px; padding: 0.375rem 0.5rem;"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button 
                    :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: isGridView }]"
                    @click="toggleView('grid')"
                    style="min-width: 35px; padding: 0.375rem 0.5rem;"
                  >
                    <i class="fas fa-th-large"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-6">
              <button 
                class="btn btn-outline-secondary btn-modern w-100" 
                @click="openBulkUploadModal"
              >
                <i class="fas fa-file-excel me-1"></i>Bulk Upload
              </button>
            </div>
          </div>
          
          <div class="row g-2">
            <!-- Row 2: Add Vendor -->
            <div class="col-12">
              <RouterLink to="/app/vendors/add" class="btn btn-primary btn-modern w-100">
                <i class="fas fa-plus me-1"></i>Add Vendor
              </RouterLink>
            </div>
          </div>
        </div>
        
        <!-- Medium+ screens: Original layout -->
        <div class="d-none d-md-block">
          <div class="row g-2 justify-content-md-end">
            <!-- View Toggle + Bulk Upload -->
            <div class="col-md-12 col-lg-auto">
              <div class="d-flex gap-2 w-100">
                <!-- View Toggle -->
                <div class="btn-group flex-shrink-0" role="group" aria-label="View toggle">
                  <button 
                    :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: !isGridView }]"
                    @click="toggleView('list')"
                    style="min-width: 40px;"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button 
                    :class="['btn', 'btn-outline-secondary', 'btn-modern', 'view-toggle', { active: isGridView }]"
                    @click="toggleView('grid')"
                    style="min-width: 40px;"
                  >
                    <i class="fas fa-th-large"></i>
                  </button>
                </div>
                
                <!-- Bulk Upload Button -->
                <button 
                  class="btn btn-outline-secondary btn-modern flex-fill" 
                  @click="openBulkUploadModal"
                >
                  <i class="fas fa-file-excel me-1"></i>Bulk Upload
                </button>
              </div>
            </div>
            
            <!-- Add Vendor -->
            <div class="col-md-12 col-lg-auto">
              <RouterLink to="/app/vendors/add" class="btn btn-primary btn-modern w-100">
                <i class="fas fa-plus me-1"></i>Add Vendor
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Sort Bar -->
    <div class="mb-4">
      <div class="row align-items-end">
        <!-- Search Vendors -->
        <div class="col-12 col-lg-7 mb-3">
          <label class="form-label">Search Vendors</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input 
              type="text" 
              class="form-control" 
              v-model="searchTerm" 
              placeholder="Search by name, contact, email..."
              @input="debouncedFetchVendors"
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
              <!-- 2 Filter Dropdowns: equal width -->
              <div class="flex-fill">
                <SearchableDropdown
                  id="vendor-type-filter"
                  label="Vendor Type"
                  placeholder="Search vendor types..."
                  :items="vendorTypeOptions"
                  v-model="selectedType"
                  @change="onVendorTypeChange"
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
              
              <!-- Clear Button: fixed width -->
              <div class="flex-shrink-0" style="width: 20%;">
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
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 27%;">Vendor Name</th>
                    <th style="width: 15%;">Contact Person</th>
                    <th style="width: 24%;">Email</th>
                    <th style="width: 14%;">Phone</th>
                    <th style="width: 13%;">Type</th>
                    <th style="width: 8%;">Status</th>
                    <th style="width: 9%;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="vendor in filteredVendors" 
                    :key="vendor.id"
                    :data-name="vendor.name"
                    :data-type="vendor.vendorType"
                    :data-status="vendor.status"
                    :data-contact="vendor.contactPerson"
                    :data-email="vendor.email"
                    :data-phone="vendor.phone"
                  >
                    <td>
                      <div class="d-flex align-items-center">
                        <i :class="getVendorIconWithColor(vendor.vendorType)" class="fa-2x me-3"></i>
                        <div>
                          <div class="fw-bold">{{ vendor.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td>{{ vendor.contactPerson || '-' }}</td>
                    <td>{{ vendor.email }}</td>
                    <td>{{ vendor.phone || '-' }}</td>
                    <td>
                      <span :class="getTypeBadgeClass(vendor.vendorType)">{{ getTypeLabel(vendor.vendorType) }}</span>
                    </td>
                    <td>
                      <span :class="getStatusBadgeClass(vendor.status)">{{ getStatusLabel(vendor.status) }}</span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm vendor-actions">
                        <button 
                          class="btn btn-outline-primary" 
                          @click="showVendorDetails(vendor)"
                          title="View Vendor Details"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button 
                          class="btn btn-outline-secondary" 
                          title="Edit Vendor"
                          @click="editVendor(vendor)"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <!-- No results row -->
                  <tr v-if="filteredVendors.length === 0">
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
        <div :class="{ 'd-none': !isGridView }" id="gridView">
          <div class="row" id="gridContainer" v-if="filteredVendors.length > 0">
            <div 
              v-for="vendor in filteredVendors" 
              :key="vendor.id"
              class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4"
            >
              <div class="card h-100 vendor-card-modern">
                <div class="card-body p-2">
                  <!-- Header with icon, vendor name and status -->
                  <div class="d-flex align-items-center mb-2">
                    <div 
                      class="rounded-circle d-flex align-items-center justify-content-center me-2" 
                      :style="{ width: '36px', height: '36px', backgroundColor: getVendorTypeColor(vendor.vendorType), flexShrink: 0 }"
                    >
                      <i :class="getVendorTypeIcon(vendor.vendorType)" class="text-white" style="font-size: 0.9rem; color: white !important;"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-0 fw-bold text-truncate" style="color: var(--primary-black); font-size: 0.9rem;">{{ vendor.name }}</h6>
                      <small class="text-muted text-truncate d-block">{{ getTypeLabel(vendor.vendorType) }}</small>
                    </div>
                    <span :class="[getStatusBadgeClass(vendor.status), 'badge-sm']" style="font-size: 0.7rem;">
                      {{ getStatusLabel(vendor.status) }}
                    </span>
                  </div>
                  
                  <!-- Vendor Details Grid - 2 columns for better space usage -->
                  <div class="mb-2">
                    <div class="row g-1">
                      <div class="col-6">
                        <small class="text-muted d-block" style="font-size: 0.7rem;">Contact Person</small>
                        <div class="fw-medium text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ vendor.contactPerson || 'Not specified' }}</div>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block" style="font-size: 0.7rem;">Email</small>
                        <div class="text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ vendor.email || 'Not specified' }}</div>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block" style="font-size: 0.7rem;">Phone</small>
                        <div class="text-truncate" style="color: var(--primary-black); font-size: 0.8rem;">{{ vendor.phone || 'Not specified' }}</div>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block" style="font-size: 0.7rem;">Type</small>
                        <div class="text-truncate">
                          <span :class="getTypeBadgeClass(vendor.vendorType) + ' badge-sm'" style="font-size: 0.65rem;">{{ getTypeLabel(vendor.vendorType) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="vendor-actions-footer mt-auto pt-2 border-top">
                    <div class="d-flex justify-content-center gap-1">
                      <button 
                        class="btn btn-action btn-view btn-sm" 
                        @click="showVendorDetails(vendor)"
                        title="View Vendor Details"
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-action btn-edit btn-sm" 
                        title="Edit Vendor"
                        @click="editVendor(vendor)"
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No results for grid view -->
          <div v-if="filteredVendors.length === 0" class="col-12 text-center py-5">
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
        <AppPagination 
          :current-page="currentPage" 
          :total-pages="totalPages" 
          @change="changePage"
        />
      </div>
    </div>

    <!-- Vendor Detail Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showVendorModal }" 
      :style="{ display: showVendorModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="selectedVendor"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vendor Details - {{ selectedVendor.name }}</h5>
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

            <!-- Vendor Information - Compact Layout -->
            <div v-else class="row g-2 equal-height-columns">
              <!-- Left Column: Basic Info -->
              <div class="col-md-6">
                <div class="vendor-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-info-circle me-2"></i>Basic Information</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <label class="info-label-compact">Vendor Name</label>
                      <div class="info-value-compact fw-bold">{{ selectedVendor.name }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Contact Person</label>
                      <div class="info-value-compact">{{ selectedVendor.contactPerson || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Vendor Type</label>
                      <div class="info-value-compact">
                        <span :class="getTypeBadgeClass(selectedVendor.vendorType)">{{ getTypeLabel(selectedVendor.vendorType) }}</span>
                      </div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Status</label>
                      <div class="info-value-compact">
                        <span :class="getStatusBadgeClass(selectedVendor.status)">{{ getStatusLabel(selectedVendor.status) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Contact & Legal -->
              <div class="col-md-6">
                <div class="vendor-info-section-compact h-100">
                  <h6 class="section-title-compact"><i class="fas fa-address-book me-2"></i>Contact & Legal</h6>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <label class="info-label-compact">Email Address</label>
                      <div class="info-value-compact">{{ selectedVendor.email }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Phone Number</label>
                      <div class="info-value-compact">{{ selectedVendor.phone || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">Tax ID</label>
                      <div class="info-value-compact font-monospace">{{ selectedVendor.taxId || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <label class="info-label-compact">PAN Number</label>
                      <div class="info-value-compact font-monospace">{{ selectedVendor.panNumber || 'Not specified' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Address Information - Full Width -->
            <div class="row mt-2">
              <div class="col-12">
                <div class="vendor-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-map-marker-alt me-2"></i>Address Information</h6>
                  <NotesDisplay 
                    :notes="selectedVendor.address"
                    :fallback-text="'No address provided.'"
                    :show-label="false"
                    :show-icon="false"
                    :show-empty-icon="true"
                    :preserve-formatting="true"
                  />
                </div>
              </div>
            </div>

            <!-- Additional Notes - Full Width -->
            <div class="row mt-2">
              <div class="col-12">
                <div class="vendor-info-section-compact">
                  <h6 class="section-title-compact"><i class="fas fa-sticky-note me-2"></i>Additional Notes</h6>
                  <NotesDisplay 
                    :notes="selectedVendor.notes"
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
            <button type="button" class="btn btn-secondary" @click="closeVendorModal">Close</button>
            
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
    <BulkVendorUpload
      ref="bulkVendorUploadRef"
      @upload-success="handleBulkUploadSuccess"
    />

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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteToast } from '@/composables/useRouteToast'
import { useToastStore } from '@/stores/toast'
import VendorApiService from '../../services/vendorApi'
import { VendorStatus } from '../../types/vendor.types'
import type { Vendor, VendorQueryParams } from '../../types/vendor.types'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'
import NotesDisplay from '@/components/common/NotesDisplay.vue'
import BulkVendorUpload from './BulkVendorUpload.vue'
import AppPagination from '@/components/pagination/AppPagination.vue'

const router = useRouter()
useRouteToast()
const toastStore = useToastStore()

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
const sortAscending = ref(true)
const isGridView = ref(false)

// Filter state variables
const selectedType = ref<Item | null>(null)
const selectedStatus = ref<Item | null>(null)
const selectedSortBy = ref<Item | null>(null)
const showFilterDropdown = ref(false)

// Modal states
const showVendorModal = ref(false)
const showStatusModal = ref(false)
const selectedVendor = ref<Vendor | null>(null)
const statusChangeVendor = ref<Vendor | null>(null)
const bulkVendorUploadRef = ref<InstanceType<typeof BulkVendorUpload> | null>(null)

// Bulk upload is now handled by BulkVendorUpload component

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
      vendorType: selectedType.value?.value as string || undefined,
      status: (selectedStatus.value?.value as string || undefined) as VendorStatus | undefined,
      sortBy: selectedSortBy.value?.value as string || 'name',
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

// Filter options
const vendorTypeOptions = computed(() => [
  { id: 'SUPPLIER', name: 'Supplier', value: 'SUPPLIER' },
  { id: 'SERVICE', name: 'Service Provider', value: 'SERVICE' },
  { id: 'MANUFACTURER', name: 'Manufacturer', value: 'MANUFACTURER' },
  { id: 'DISTRIBUTOR', name: 'Distributor', value: 'DISTRIBUTOR' },
  { id: 'CONTRACTOR', name: 'Contractor', value: 'CONTRACTOR' },
  { id: 'BOTH', name: 'Both', value: 'BOTH' }
])

const statusOptions = computed(() => [
  { id: 'ACTIVE', name: 'Active', value: 'ACTIVE' },
  { id: 'INACTIVE', name: 'Inactive', value: 'INACTIVE' }
])

const sortOptions = computed(() => [
  { id: 'name', name: 'Name', value: 'name' },
  { id: 'type', name: 'Type', value: 'vendorType' },
  { id: 'status', name: 'Status', value: 'status' },
  { id: 'createdAt', name: 'Created Date', value: 'createdAt' }
])

// Methods
const toggleView = (view: 'list' | 'grid') => {
  isGridView.value = view === 'grid'
}

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value
  debouncedFetchVendors()
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedType.value = null
  selectedStatus.value = null
  selectedSortBy.value = null
  currentPage.value = 1
  fetchVendors()
}

// Debounced fetch function
const debounceTimeout = ref<number | null>(null)

const debouncedFetchVendors = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  debounceTimeout.value = setTimeout(() => {
    currentPage.value = 1 // Reset to first page when filtering
    fetchVendors()
  }, 500) // 500ms debounce
}

// Filter change handlers
const onVendorTypeChange = (item: Item | null) => {
  selectedType.value = item
  debouncedFetchVendors()
}

const onStatusChange = (item: Item | null) => {
  selectedStatus.value = item
  debouncedFetchVendors()
}

const onSortByChange = (item: Item | null) => {
  selectedSortBy.value = item
  debouncedFetchVendors()
}

// Filter dropdown methods
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
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

const getVendorIconWithColor = (type: string) => {
  switch (type) {
    case 'SUPPLIER':
      return 'fas fa-store text-primary'
    case 'SERVICE':
      return 'fas fa-tools text-success'
    case 'MANUFACTURER':
      return 'fas fa-industry text-secondary'
    case 'DISTRIBUTOR':
      return 'fas fa-truck text-warning'
    case 'CONTRACTOR':
      return 'fas fa-hammer text-brown'
    case 'BOTH':
      return 'fas fa-shopping-cart text-info'
    default:
      return 'fas fa-store text-primary'
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

// New functions for modern grid design (matching AssetsView)
const getVendorTypeIcon = (type: string) => {
  switch (type) {
    case 'SUPPLIER':
      return 'fas fa-store'
    case 'SERVICE':
      return 'fas fa-tools'
    case 'MANUFACTURER':
      return 'fas fa-industry'
    case 'DISTRIBUTOR':
      return 'fas fa-truck'
    case 'CONTRACTOR':
      return 'fas fa-hammer'
    case 'BOTH':
      return 'fas fa-building'
    default:
      return 'fas fa-store'
  }
}

const getVendorTypeColor = (type: string) => {
  switch (type) {
    case 'SUPPLIER':
      return 'var(--secondary-purple)'
    case 'SERVICE':
      return 'var(--secondary-green)'
    case 'MANUFACTURER':
      return 'var(--secondary-blue)'
    case 'DISTRIBUTOR':
      return 'var(--secondary-orange)'
    case 'CONTRACTOR':
      return 'var(--secondary-red)'
    case 'BOTH':
      return 'var(--secondary-pink)'
    default:
      return 'var(--secondary-purple)'
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
    toastStore.showError('Error', 'Failed to load vendor details from API, showing cached data')
    
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
  bulkVendorUploadRef.value?.openModal()
}

const handleBulkUploadSuccess = (result: any) => {
  toastStore.showSuccess('Success', 'Vendors uploaded successfully!')
      // Refresh vendor list
      fetchVendors()
}

// Toast methods
// Removed custom toast functions - using toast store instead

// Action methods

const editVendor = (vendor: Vendor) => {
  // Navigate to edit vendor page (can be implemented later)
  router.push(`/app/vendors/edit/${vendor.id}`)
  closeVendorModal()
}



const updateVendorStatus = async (vendor: Vendor, newStatus: VendorStatus) => {
  try {
    await VendorApiService.updateVendorStatus(vendor.id, { status: newStatus })
    toastStore.showSuccess('Success', `${vendor.name} status updated to ${getStatusLabel(newStatus)}`)
    fetchVendors() // Refresh the list
    closeStatusModal()
  } catch (error: any) {
    console.error('Error updating vendor status:', error)
    let errorMessage = 'Failed to update vendor status. Please try again.'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    
    toastStore.showError('Error', errorMessage)
  }
}

// Initialize
onMounted(() => {
  fetchVendors()
})
</script>

<style scoped>
/* Form styling consistency */
:deep(.form-label) {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

:deep(.form-control) {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Make button corners match input field corners for consistency */
.btn {
  border-radius: 0.375rem !important;
}

/* Fix search input group border-radius consistency */
.input-group .input-group-text {
  border-radius: 0.375rem 0 0 0.375rem !important;
}

.input-group .form-control:not(:last-child) {
  border-radius: 0 0.375rem 0.375rem 0 !important;
}

:deep(.form-control:focus) {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

:deep(.dropdown-menu) {
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  z-index: 1050;
}

:deep(.dropdown-item:hover),
:deep(.dropdown-item.active) {
  background-color: #e9ecef;
  color: #1e2125;
}

/* Filter dropdown styling */
.filter-dropdown {
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

/* Active filter button styling */
.btn.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.btn.active:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}


/* Table Layout Optimization */
.table {
  table-layout: fixed !important;
  width: 100% !important;
}

.table th {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Allow text wrapping only for Vendor Name and Contact Person */
.table td:nth-child(1), /* Vendor Name */
.table td:nth-child(2) { /* Contact Person */
  white-space: normal !important;
  word-wrap: break-word;
}

/* Keep email on single line with ellipsis if too long */
.table td:nth-child(3) { /* Email */
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* Force column widths to be respected */
.table th:nth-child(1) { width: 27% !important; }
.table th:nth-child(2) { width: 15% !important; }
.table th:nth-child(3) { width: 24% !important; }
.table th:nth-child(4) { width: 14% !important; }
.table th:nth-child(5) { width: 13% !important; }
.table th:nth-child(6) { width: 8% !important; }
.table th:nth-child(7) { width: 9% !important; }

.table td:nth-child(1) { width: 27% !important; }
.table td:nth-child(2) { width: 15% !important; }
.table td:nth-child(3) { width: 24% !important; }
.table td:nth-child(4) { width: 14% !important; }
.table td:nth-child(5) { width: 13% !important; }
.table td:nth-child(6) { width: 8% !important; }
.table td:nth-child(7) { width: 9% !important; }

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
  background-color: var(--secondary-gray) !important;
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
  background-color: var(--secondary-brown) !important;
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

/* Vendor Detail Modal Styling - Matching AssetsView Design */

/* Equal height columns for consistent layout */
.equal-height-columns {
  display: flex;
  flex-wrap: wrap;
}

.equal-height-columns > [class*="col-"] {
  display: flex;
  flex-direction: column;
}

/* Compact vendor info section - matching AssetsView */
.vendor-info-section-compact {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
}

.vendor-info-section-compact .section-title-compact {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #dee2e6;
}

.vendor-info-section-compact .info-grid-compact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
}

.vendor-info-section-compact .info-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.vendor-info-section-compact .info-item-compact:last-child {
  border-bottom: none;
}

.vendor-info-section-compact .info-label-compact {
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  color: #495057 !important;
  margin-bottom: 0 !important;
  min-width: 140px;
  flex-shrink: 0;
}

.vendor-info-section-compact .info-value-compact {
  font-size: 1rem !important;
  font-weight: 500 !important;
  color: #212529 !important;
  margin-bottom: 0 !important;
  text-align: right;
  flex-grow: 1;
}

/* Legacy vendor info section - keeping for backward compatibility */
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

/* Bulk upload is now handled by BulkVendorUpload component */

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