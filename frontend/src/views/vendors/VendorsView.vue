<template>
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
                <fieldset class="btn-group flex-shrink-0" aria-label="View toggle">
                  <button 
                    :class="['btn', 'view-toggle', { active: !isGridView }]"
                    @click="toggleView('list')"
                    style="min-width: 35px; padding: 0.375rem 0.5rem;"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button 
                    :class="['btn', 'view-toggle', { active: isGridView }]"
                    @click="toggleView('grid')"
                    style="min-width: 35px; padding: 0.375rem 0.5rem;"
                  >
                    <i class="fas fa-th-large"></i>
                  </button>
                </fieldset>
              </div>
            </div>
            <div class="col-6">
              <button 
                class="btn btn-gray w-100" 
                @click="openBulkUploadModal"
              >
                <i class="fas fa-file-excel me-1"></i>Bulk Upload
              </button>
            </div>
          </div>
          
          <div class="row g-2">
            <!-- Row 2: Add Vendor -->
            <div class="col-12">
              <RouterLink to="/app/vendors/add" class="btn btn-purple w-100">
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
                <fieldset class="btn-group flex-shrink-0" aria-label="View toggle">
                  <button 
                    :class="['btn', 'view-toggle', { active: !isGridView }]"
                    @click="toggleView('list')"
                    style="min-width: 40px;"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button 
                    :class="['btn', 'view-toggle', { active: isGridView }]"
                    @click="toggleView('grid')"
                    style="min-width: 40px;"
                  >
                    <i class="fas fa-th-large"></i>
                  </button>
                </fieldset>
                
                <!-- Bulk Upload Button -->
                <button 
                  class="btn btn-gray flex-fill" 
                  @click="openBulkUploadModal"
                >
                  <i class="fas fa-file-excel me-1"></i>Bulk Upload
                </button>
              </div>
            </div>
            
            <!-- Add Vendor -->
            <div class="col-md-12 col-lg-auto">
              <RouterLink to="/app/vendors/add" class="btn btn-purple w-100">
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
          <div class="form-label">Search Vendors</div>
          <div class="search-input-container">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              class="form-control search-input" 
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
              
              <!-- Clear Button: using filter-clear-button-container class -->
              <div class="filter-clear-button-container">
                <div class="d-flex align-items-end h-100">
                  <button class="btn btn-gray filter-clear-btn" @click="clearFilters" title="Clear All Filters">
                    <i class="fas fa-times me-1"></i>Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- Error State (only show when there's an error) -->
      <div v-if="error" class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
        <button class="btn btn-red btn-sm ms-3" @click="fetchVendors">
          <i class="fas fa-redo me-1"></i>Retry
        </button>
      </div>

      <!-- Vendors Content -->
      <div id="vendorsContainer" v-else>
        <!-- List View (Default) -->
        <div class="card" v-show="!isGridView">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0 vendor-table">
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
                    <td>{{ getTypeLabel(vendor.vendorType) }}</td>
                    <td>
                      <span :class="getStatusBadgeClass(vendor.status)">{{ getStatusLabel(vendor.status) }}</span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm vendor-actions">
                        <button 
                          class="btn btn-action btn-brown" 
                          @click="showVendorDetails(vendor)"
                          title="View Vendor Details"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button 
                          class="btn btn-action btn-purple" 
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
                      <h6 class="mb-0 fw-bold text-truncate" style="color: var(--primary-black);">{{ vendor.name }}</h6>
                      <small class="text-muted text-truncate d-block">{{ getTypeLabel(vendor.vendorType) }}</small>
                    </div>
                    <span :class="getStatusBadgeClass(vendor.status)">
                      {{ getStatusLabel(vendor.status) }}
                    </span>
                  </div>
                  
                  <!-- Vendor Details Grid - 3 fields in sequence -->
                  <div class="mb-2">
                    <div class="row g-1">
                      <div class="col-12">
                        <small class="text-muted d-block">Contact Person</small>
                        <div class="fw-medium text-truncate" style="color: var(--primary-black);">{{ vendor.contactPerson || 'Not specified' }}</div>
                      </div>
                      <div class="col-12">
                        <small class="text-muted d-block">Email</small>
                        <div class="text-truncate" style="color: var(--primary-black);">{{ vendor.email || 'Not specified' }}</div>
                      </div>
                      <div class="col-12">
                        <small class="text-muted d-block">Phone Number</small>
                        <div class="text-truncate" style="color: var(--primary-black);">{{ vendor.phone || 'Not specified' }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="vendor-actions-footer mt-auto pt-2 border-top">
                    <div class="d-flex justify-content-center gap-1">
                      <button 
                        class="btn btn-action btn-brown btn-sm" 
                        @click="showVendorDetails(vendor)"
                        title="View Vendor Details"
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-action btn-purple btn-sm" 
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
      <AppPagination 
        v-if="filteredVendors.length > 0"
        :current-page="currentPage" 
        :total-pages="totalPages" 
        :start="paginationStart"
        :end="paginationEnd"
        :total="totalVendors"
        :item-name="'vendors'"
        @change="changePage"
      />
    </div>

    <!-- Vendor Detail Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showVendorModal }" 
      :style="{ display: showVendorModal ? 'block' : 'none' }"
      tabindex="-1"
      v-if="selectedVendor"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vendor Details - {{ selectedVendor.name }}</h5>
            <button type="button" class="btn-close" @click="closeModals"></button>
          </div>
          <div class="modal-body">
            <!-- Loading State -->
            <div v-if="!selectedVendor" class="text-center py-5">
              <div class="spinner-border text-primary">
                <output class="visually-hidden">Loading...</output>
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
                      <div class="info-label-compact">Vendor Name</div>
                      <div class="info-value-compact fw-bold">{{ selectedVendor.name }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Contact Person</div>
                      <div class="info-value-compact">{{ selectedVendor.contactPerson || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Vendor Type</div>
                      <div class="info-value-compact">{{ getTypeLabel(selectedVendor.vendorType) }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Status</div>
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
                      <div class="info-label-compact">Email Address</div>
                      <div class="info-value-compact">{{ selectedVendor.email }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Phone Number</div>
                      <div class="info-value-compact">{{ selectedVendor.phone || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">Tax ID</div>
                      <div class="info-value-compact font-monospace">{{ selectedVendor.taxId || 'Not specified' }}</div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">PAN Number</div>
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
            <button type="button" class="btn btn-cancel btn-sm" @click="closeModals">Close</button>
            
            <!-- Vendor Management Buttons -->
            <div class="d-flex gap-2">
              <button 
                type="button" 
                class="btn btn-purple btn-sm" 
                @click="editVendor(selectedVendor!)"
                :disabled="!selectedVendor"
              >
                <i class="fas fa-edit me-1"></i>Edit Vendor
              </button>
              <button 
                type="button" 
                :class="selectedVendor?.status === VendorStatus.ACTIVE ? 'btn btn-red btn-sm' : 'btn btn-green btn-sm'"
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
            <button type="button" class="btn btn-cancel btn-sm" @click="closeStatusModal">
              <i class="fas fa-times me-1"></i>Cancel
            </button>
            <button 
              type="button" 
              :class="statusChangeVendor?.status === VendorStatus.ACTIVE ? 'btn btn-red btn-sm' : 'btn btn-green btn-sm'"
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
      
    >
      <div class="toast show" role="alert">
        <div class="toast-header">
          <i 
            :class="toast.type === 'success' ? 'fas fa-check-circle text-success' : 'fas fa-exclamation-triangle text-danger'"
            class="me-2"
          ></i>
          <strong class="me-auto">{{ toast.type === 'success' ? 'Success' : 'Error' }}</strong>
          <button type="button" class="btn-close" @click="toast.show = false"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
  </div>

  <!-- Modal Backdrop -->
  <div v-if="showStatusModal || showVendorModal" class="modal-backdrop fade show" @click="closeModals"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteToast } from '@/composables/useRouteToast'
import { useToastStore } from '@/stores/toast'
import VendorApiService from '../../services/api/vendorApi'
import { VendorStatus } from '../../types/vendor.types'
import type { Vendor, VendorQueryParams } from '../../types/vendor.types'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'
import NotesDisplay from '@/components/common/NotesDisplay.vue'
import BulkVendorUpload from './BulkVendorUpload.vue'
import AppPagination from '@/components/ui/pagination/AppPagination.vue'

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
    vendors.value = response.data.vendors
    totalVendors.value = response.data.pagination.totalCount
    totalPages.value = response.data.pagination.totalPages
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
      return 'badge badge-green'
    case VendorStatus.INACTIVE:
      return 'badge badge-red'
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
    selectedVendor.value = vendor
    
    // Then try to fetch complete vendor details from API
    const response = await VendorApiService.getVendorById(vendor.id)
    
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

    // Update with API data if available, otherwise keep the list data
    if (vendorData) {
      selectedVendor.value = vendorData
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

const closeModals = () => {
  showVendorModal.value = false
  showStatusModal.value = false
  selectedVendor.value = null
  statusChangeVendor.value = null
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
@import '@/assets/styles/pages/vendors.css';
</style> 