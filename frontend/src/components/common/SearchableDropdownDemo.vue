<template>
  <div class="searchable-dropdown-demo p-4">
    <h3 class="mb-4">Searchable Dropdown Demo</h3>
    
    <div class="row g-4">
      <!-- Basic Example -->
      <div class="col-md-6">
        <div class="demo-section">
          <h5 class="mb-3">Basic Employee Dropdown</h5>
          <SearchableDropdown
            id="employee-dropdown"
            label="Select Employee"
            placeholder="Search employees..."
            :items="employees"
            v-model="selectedEmployee"
            @change="onEmployeeChange"
          />
          <div v-if="selectedEmployee" class="mt-2 text-muted">
            Selected: {{ selectedEmployee.name }} (ID: {{ selectedEmployee.id }})
          </div>
        </div>
      </div>

      <!-- Custom Label Key Example -->
      <div class="col-md-6">
        <div class="demo-section">
          <h5 class="mb-3">Department Dropdown (Custom Label)</h5>
          <SearchableDropdown
            id="department-dropdown"
            label="Select Department"
            placeholder="Search departments..."
            :items="departments"
            v-model="selectedDepartment"
            label-key="title"
            item-key="code"
            @change="onDepartmentChange"
          />
          <div v-if="selectedDepartment" class="mt-2 text-muted">
            Selected: {{ selectedDepartment.title }} (Code: {{ selectedDepartment.code }})
          </div>
        </div>
      </div>

      <!-- Nested Data Example -->
      <div class="col-md-6">
        <div class="demo-section">
          <h5 class="mb-3">Asset Categories (Nested Data)</h5>
          <SearchableDropdown
            id="category-dropdown"
            label="Select Category"
            placeholder="Search categories..."
            :items="nestedData"
            v-model="selectedCategory"
            data-path="data"
            @change="onCategoryChange"
          />
          <div v-if="selectedCategory" class="mt-2 text-muted">
            Selected: {{ selectedCategory.name }}
          </div>
        </div>
      </div>

      <!-- Custom Search Keys Example -->
      <div class="col-md-6">
        <div class="demo-section">
          <h5 class="mb-3">Assets (Custom Search Fields)</h5>
          <SearchableDropdown
            id="asset-dropdown"
            label="Select Asset"
            placeholder="Search by name, code, or serial..."
            :items="assets"
            v-model="selectedAsset"
            :search-keys="['name', 'assetCode', 'serialNumber']"
            @change="onAssetChange"
          >
            <template #item="{ item }">
              <div>
                <strong>{{ item.name }}</strong>
                <br>
                <small class="text-muted">{{ item.assetCode }} | {{ item.serialNumber }}</small>
              </div>
            </template>
          </SearchableDropdown>
          <div v-if="selectedAsset" class="mt-2 text-muted">
            Selected: {{ selectedAsset.name }} ({{ selectedAsset.assetCode }})
          </div>
        </div>
      </div>

      <!-- Required Field Example -->
      <div class="col-md-6">
        <div class="demo-section">
          <h5 class="mb-3">Vendor Dropdown (Required)</h5>
          <SearchableDropdown
            id="vendor-dropdown"
            label="Select Vendor"
            placeholder="Search vendors..."
            :items="vendors"
            v-model="selectedVendor"
            required
            @change="onVendorChange"
          />
          <div v-if="selectedVendor" class="mt-2 text-muted">
            Selected: {{ selectedVendor.name }}
          </div>
        </div>
      </div>

      <!-- Disabled Example -->
      <div class="col-md-6">
        <div class="demo-section">
          <h5 class="mb-3">Location Dropdown (Disabled)</h5>
          <SearchableDropdown
            id="location-dropdown"
            label="Select Location"
            placeholder="Search locations..."
            :items="locations"
            v-model="selectedLocation"
            disabled
            @change="onLocationChange"
          />
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-4 p-3 bg-light rounded">
      <h5>Demo Controls</h5>
      <div class="row g-3">
        <div class="col-auto">
          <button class="btn btn-secondary" @click="clearAllSelections">
            Clear All Selections
          </button>
        </div>
        <div class="col-auto">
          <button class="btn btn-info" @click="showSelectedValues">
            Show Selected Values
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Values Display -->
    <div v-if="showValues" class="mt-3 p-3 bg-info bg-opacity-10 rounded">
      <h6>Current Selected Values:</h6>
      <pre>{{ JSON.stringify({
        employee: selectedEmployee,
        department: selectedDepartment,
        category: selectedCategory,
        asset: selectedAsset,
        vendor: selectedVendor,
        location: selectedLocation
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchableDropdown, { type Item } from './SearchableDropdown.vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

// Component state
const showValues = ref(false)

// Sample data
const employees = ref<Item[]>([
  { id: 1, name: 'John Doe', email: 'john@company.com', abbreviation: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', abbreviation: 'JS' },
  { id: 3, name: 'Mike Johnson', email: 'mike@company.com', abbreviation: 'MJ' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', abbreviation: 'SW' },
  { id: 5, name: 'David Brown', email: 'david@company.com', abbreviation: 'DB' }
])

const departments = ref<Item[]>([
  { code: 'HR', title: 'Human Resources', description: 'People management' },
  { code: 'IT', title: 'Information Technology', description: 'Tech support' },
  { code: 'FIN', title: 'Finance', description: 'Financial operations' },
  { code: 'MKT', title: 'Marketing', description: 'Brand promotion' },
  { code: 'OPS', title: 'Operations', description: 'Daily operations' }
])

const nestedData = ref({
  data: [
    { id: 1, name: 'Hardware', description: 'Physical equipment' },
    { id: 2, name: 'Software', description: 'Software licenses' },
    { id: 3, name: 'Furniture', description: 'Office furniture' },
    { id: 4, name: 'Vehicles', description: 'Company vehicles' }
  ],
  meta: { total: 4 }
})

const assets = ref<Item[]>([
  { 
    id: 1, 
    name: 'Dell Laptop', 
    assetCode: 'DL-001', 
    serialNumber: 'DL123456',
    category: 'Hardware'
  },
  { 
    id: 2, 
    name: 'Microsoft Office License', 
    assetCode: 'MS-002', 
    serialNumber: 'MS789012',
    category: 'Software'
  },
  { 
    id: 3, 
    name: 'Office Chair', 
    assetCode: 'OC-003', 
    serialNumber: 'OC345678',
    category: 'Furniture'
  },
  { 
    id: 4, 
    name: 'MacBook Pro', 
    assetCode: 'MB-004', 
    serialNumber: 'MB901234',
    category: 'Hardware'
  }
])

const vendors = ref<Item[]>([
  { id: 1, name: 'Tech Solutions Inc.', contact: 'tech@solutions.com' },
  { id: 2, name: 'Office Supplies Co.', contact: 'sales@officesupplies.com' },
  { id: 3, name: 'Software Licensing Ltd.', contact: 'licensing@software.com' },
  { id: 4, name: 'Furniture World', contact: 'info@furnitureworld.com' }
])

const locations = ref<Item[]>([
  { id: 1, name: 'Main Office - Floor 1', abbreviation: 'MO-1' },
  { id: 2, name: 'Main Office - Floor 2', abbreviation: 'MO-2' },
  { id: 3, name: 'Warehouse', abbreviation: 'WH' },
  { id: 4, name: 'Remote Office', abbreviation: 'RO' }
])

// Selected values
const selectedEmployee = ref<Item | null>(null)
const selectedDepartment = ref<Item | null>(null)
const selectedCategory = ref<Item | null>(null)
const selectedAsset = ref<Item | null>(null)
const selectedVendor = ref<Item | null>(null)
const selectedLocation = ref<Item | null>(null)

// Event handlers
const onEmployeeChange = (employee: Item | null) => {
  if (employee) {
    toastStore.showSuccess('Employee Selected', `Selected: ${employee.name}`)
  }
}

const onDepartmentChange = (department: Item | null) => {
  if (department) {
    toastStore.showInfo('Department Selected', `Selected: ${department.title}`)
  }
}

const onCategoryChange = (category: Item | null) => {
  if (category) {
    toastStore.showInfo('Category Selected', `Selected: ${category.name}`)
  }
}

const onAssetChange = (asset: Item | null) => {
  if (asset) {
    toastStore.showSuccess('Asset Selected', `Selected: ${asset.name} (${asset.assetCode})`)
  }
}

const onVendorChange = (vendor: Item | null) => {
  if (vendor) {
    toastStore.showInfo('Vendor Selected', `Selected: ${vendor.name}`)
  }
}

const onLocationChange = (location: Item | null) => {
  if (location) {
    toastStore.showInfo('Location Selected', `Selected: ${location.name}`)
  }
}

// Control functions
const clearAllSelections = () => {
  selectedEmployee.value = null
  selectedDepartment.value = null
  selectedCategory.value = null
  selectedAsset.value = null
  selectedVendor.value = null
  selectedLocation.value = null
  toastStore.showWarning('Cleared', 'All selections have been cleared')
}

const showSelectedValues = () => {
  showValues.value = !showValues.value
}
</script>

<style scoped>
.searchable-dropdown-demo {
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

.demo-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e9ecef;
  height: 100%;
}

/* Ensure proper spacing for the new label structure */
.demo-section :deep(.searchable-dropdown-wrapper) {
  margin-bottom: 1rem;
}

.demo-section :deep(.form-label) {
  font-weight: 600;
  color: #495057;
}

pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  max-height: 300px;
  overflow-y: auto;
}
</style> 