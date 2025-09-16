<template>
    <div style="background-color: var(--primary-white);">
      <!-- Main Content -->
      <div class="container-fluid px-3 py-4">
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-0" style="color: var(--primary-black);">Employee Management</h2>
            <p class="text-muted mb-0">Manage employee information and asset assignments</p>
          </div>
          <div class="d-flex gap-2 align-items-center">
            <!-- View Toggle (List/Grid) -->
            <div class="btn-group" role="group" aria-label="View toggle">
              <button 
                class="btn btn-outline-secondary btn-modern view-toggle"
                :class="{ active: !isGridView }"
                @click="switchToListView"
              >
                <i class="fas fa-list"></i>
              </button>
              <button 
                class="btn btn-outline-secondary btn-modern view-toggle"
                :class="{ active: isGridView }"
                @click="switchToGridView"
              >
                <i class="fas fa-th-large"></i>
              </button>
            </div>
            
            <!-- Action Buttons -->
            <button class="btn btn-outline-secondary btn-modern" @click="openBulkUploadModal">
              <i class="fas fa-file-excel me-1"></i>Bulk Upload
            </button>
            <router-link to="/employees/add" class="btn btn-primary btn-modern">
              <i class="fas fa-user-plus me-1"></i>Add Employee
            </router-link>
          </div>
        </div>
  
        <!-- Filters -->
        <div class="card mb-4 filter-card">
          <div class="card-header">
            <div>
              <h6 class="mb-0"><i class="fas fa-filter me-2"></i>Filter Employees</h6>
              <small class="text-muted">Search and filter employees by various criteria</small>
            </div>
          </div>
          <div class="card-body">
            <!-- All Filters in One Row -->
            <div class="row">
              <div class="col-12 col-md-3 mb-3">
                <label class="form-label">Search Employees</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-search"></i></span>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="searchTerm"
                    placeholder="Search by name, ID, email..."
                    @input="filterEmployees"
                  >
                </div>
              </div>
              <div class="col-12 col-md-2 mb-3">
              </div>
              <div class="col-12 col-md-2 mb-3">
                <label class="form-label">Asset Count</label>
                <select class="form-select" v-model="assetCountFilter" @change="filterEmployees">
                  <option value="">All</option>
                  <option value="0">No Assets</option>
                  <option value="1-2">1-2 Assets</option>
                  <option value="3+">3+ Assets</option>
                </select>
              </div>
              <div class="col-12 col-md-2 mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" v-model="statusFilter" @change="filterEmployees">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="col-12 col-md-2 mb-3">
                <label class="form-label">Sort By</label>
                <div class="d-flex gap-2">
                  <select class="form-select" v-model="sortBy" @change="sortEmployees">
                    <option value="name">Name</option>
                    <option value="id">Employee ID</option>
                    <option value="email">Email</option>
                  </select>
                  <button class="btn btn-outline-secondary" @click="toggleSortOrder" title="Toggle Sort Order">
                    <i :class="sortAscending ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up'"></i>
                  </button>
                </div>
              </div>
              <div class="col-12 col-md-1 mb-3 d-flex align-items-end">
                <button class="btn btn-outline-secondary w-100" @click="clearFilters" title="Clear Filters">
                  <i class="fas fa-times"></i>
                </button>
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
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Assets Assigned</th>
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
                        <div class="btn-group btn-group-sm employee-actions">
                          <button 
                            class="btn btn-action btn-view" 
                            @click="viewEmployee(employee)"
                            title="View Employee Details"
                          >
                            <i class="fas fa-eye"></i>
                          </button>
                          <button 
                            class="btn btn-action btn-edit" 
                            @click="editEmployee(employee)"
                            title="Edit Employee"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button 
                            class="btn btn-action btn-assign" 
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
          <div class="d-flex justify-content-between align-items-center mt-4" v-show="!isGridView">
            <div class="text-muted">
              <small>Showing {{ paginationInfo.start }}-{{ paginationInfo.end }} of {{ paginationInfo.total }} employees</small>
            </div>
            <nav aria-label="Employee pagination">
              <ul class="pagination pagination-modern mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
                    <i class="fas fa-chevron-left"></i>
                  </a>
                </li>
                <li 
                  class="page-item" 
                  v-for="page in visiblePages" 
                  :key="page"
                  :class="{ active: page === currentPage }"
                >
                  <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
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
                class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3" 
                v-for="employee in filteredEmployees" 
                :key="employee.id"
              >
                <div class="card h-100 employee-card">
                  <div class="card-body d-flex flex-column">
                    <div class="employee-header mb-2">
                      <div class="d-flex justify-content-center mb-3">
                        <i :class="employee.iconClass" class="fa-3x"></i>
                      </div>
                      <div class="text-center mb-3">
                        <h6 class="card-title fw-bold mb-1 text-truncate" style="color: var(--primary-black);">{{ employee.name }}</h6>
                        <p class="text-muted small mb-0">{{ employee.id }}</p>
                      </div>
                    </div>
                    
                    <div class="employee-details flex-grow-1 mb-3">
                      <div class="mb-2">
                        <i class="fas fa-envelope text-muted me-2" style="width: 14px;"></i>
                        <small class="text-truncate">{{ employee.email }}</small>
                      </div>
                      <div class="mb-2">
                        <i class="fas fa-phone text-muted me-2" style="width: 14px;"></i>
                        <small class="text-truncate">{{ employee.phone }}</small>
                      </div>
                      <div class="mb-0">
                        <i class="fas fa-laptop text-muted me-2" style="width: 14px;"></i>
                        <small class="text-truncate">{{ employee.assetsCount }} Assets</small>
                      </div>
                    </div>
                    
                    <div class="employee-actions-footer mt-auto pt-2 border-top">
                      <div class="d-flex justify-content-center gap-2">
                        <button 
                          class="btn btn-sm btn-action btn-view employee-view-btn" 
                          title="View Employee Details" 
                          @click="viewEmployee(employee)"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button 
                          class="btn btn-sm btn-action btn-edit employee-edit-btn" 
                          title="Edit Employee" 
                          @click="editEmployee(employee)"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          class="btn btn-sm btn-action btn-assign employee-assign-btn" 
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
            
            <!-- Pagination for Grid View -->
            <div class="d-flex justify-content-between align-items-center mt-4">
              <div class="text-muted">
                <small>Showing {{ paginationInfo.start }}-{{ paginationInfo.end }} of {{ paginationInfo.total }} employees</small>
              </div>
              <nav aria-label="Employee pagination">
                <ul class="pagination pagination-modern mb-0">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
                      <i class="fas fa-chevron-left"></i>
                    </a>
                  </li>
                  <li 
                    class="page-item" 
                    v-for="page in visiblePages" 
                    :key="page"
                    :class="{ active: page === currentPage }"
                  >
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
                      <i class="fas fa-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Employee Detail Modal -->
      <div class="modal fade" id="employeeDetailModal" tabindex="-1" v-if="selectedEmployee">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" style="color: var(--primary-black); font-size: 1.25rem; font-weight: 600;">
                Employee Details - {{ selectedEmployee.name }} ({{ selectedEmployee.id }})
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <!-- Employee Information Section -->
              <div class="employee-info-section mb-4">
                <h6 class="section-title"><i class="fas fa-user me-2"></i>Employee Information</h6>
                <div class="row g-3">
                  <div class="col-md-3">
                    <label class="info-label">Employee ID</label>
                    <div class="info-value">{{ selectedEmployee.id }}</div>
                  </div>
                  <div class="col-md-4">
                    <label class="info-label">Full Name</label>
                    <div class="info-value">{{ selectedEmployee.name }}</div>
                  </div>
                  <div class="col-md-5">
                    <label class="info-label">Email Address</label>
                    <div class="info-value">{{ selectedEmployee.email }}</div>
                  </div>
                  <div class="col-md-4">
                    <label class="info-label">Phone Number</label>
                    <div class="info-value">{{ selectedEmployee.phone }}</div>
                  </div>
                  <div class="col-md-4">
                    <label class="info-label">Date of Birth</label>
                    <div class="info-value">{{ selectedEmployee.dateOfBirth || 'Not specified' }}</div>
                  </div>
                  <div class="col-md-4">
                    <label class="info-label">Status</label>
                    <div class="info-value">
                      <span class="badge badge-active">{{ selectedEmployee.status || 'Active' }}</span>
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="info-label">Address</label>
                    <div class="info-value">{{ selectedEmployee.address || 'Not specified' }}</div>
                  </div>
                </div>
              </div>
  
              <!-- Assigned Assets Section -->
              <div class="assigned-assets-section">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="section-title mb-0"><i class="fas fa-laptop me-2"></i>Assigned Assets</h6>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge badge-count">{{ selectedEmployee.assetsCount }} Assets</span>
                  </div>
                </div>
                <div class="assets-list">
                  <!-- Sample Asset Items - Replace with actual data -->
                  <div class="asset-item" v-for="asset in selectedEmployee.assets" :key="asset.id">
                    <div class="d-flex align-items-center">
                      <div class="asset-icon" :style="{ backgroundColor: asset.iconColor }">
                        <i :class="asset.iconClass"></i>
                      </div>
                      <div class="asset-details flex-grow-1">
                        <div class="asset-name">{{ asset.name }}</div>
                        <div class="asset-meta">{{ asset.type }} • Assigned on {{ asset.assignedDate }}</div>
                      </div>
                      <div class="asset-actions">
                        <button class="btn btn-outline-pink btn-sm" @click="collectAsset(asset)">
                          <i class="fas fa-user-minus me-1"></i>Collect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-success" @click="issueAsset(selectedEmployee)">
                <i class="fas fa-laptop me-1"></i>Issue Asset
              </button>
              <button type="button" class="btn btn-primary-blue" @click="editEmployee(selectedEmployee)">
                <i class="fas fa-edit me-1"></i>Edit Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Modal } from 'bootstrap'
  
  export default {
    name: 'EmployeesView',
    data() {
      return {
        isGridView: false,
        searchTerm: '',
        assetCountFilter: '',
        statusFilter: '',
        sortBy: 'name',
        sortAscending: true,
        currentPage: 1,
        itemsPerPage: 10,
        selectedEmployee: null,
        employees: [
          {
            id: 'EMP-001',
            name: 'John Doe',
            email: 'john.doe@company.com',
            phone: '+91 98765 43210',
            assetsCount: 3,
            status: 'active',
            iconClass: 'fas fa-user-circle text-primary',
            dateOfBirth: 'Jan 15, 1990',
            address: '123 Main Street, Apartment 4B, New York, NY 10001, United States',
            assets: [
              {
                id: 'AST-001',
                name: 'AST-001 - MacBook Pro 16"',
                type: 'Laptop',
                assignedDate: 'Mar 15, 2024',
                iconClass: 'fas fa-laptop',
                iconColor: 'var(--secondary-purple)'
              },
              {
                id: 'AST-015',
                name: 'AST-015 - Dell UltraSharp 27"',
                type: 'Monitor',
                assignedDate: 'Feb 28, 2024',
                iconClass: 'fas fa-desktop',
                iconColor: 'var(--secondary-green)'
              },
              {
                id: 'AST-023',
                name: 'AST-023 - iPhone 14 Pro',
                type: 'Mobile Device',
                assignedDate: 'Jan 10, 2024',
                iconClass: 'fas fa-mobile-alt',
                iconColor: 'var(--secondary-pink)'
              }
            ]
          },
          {
            id: 'EMP-002',
            name: 'Jane Smith',
            email: 'jane.smith@company.com',
            phone: '+91 87654 32109',
            assetsCount: 2,
            status: 'active',
            iconClass: 'fas fa-user-circle text-success',
            assets: []
          },
          {
            id: 'EMP-003',
            name: 'Mike Johnson',
            email: 'mike.johnson@company.com',
            phone: '+91 76543 21098',
            assetsCount: 1,
            status: 'active',
            iconClass: 'fas fa-user-circle text-info',
            assets: []
          },
          {
            id: 'EMP-004',
            name: 'Sarah Wilson',
            email: 'sarah.wilson@company.com',
            phone: '+91 65432 10987',
            assetsCount: 4,
            status: 'active',
            iconClass: 'fas fa-user-circle text-warning',
            assets: []
          },
          {
            id: 'EMP-005',
            name: 'David Brown',
            email: 'david.brown@company.com',
            phone: '+91 54321 09876',
            assetsCount: 2,
            status: 'active',
            iconClass: 'fas fa-user-circle text-secondary',
            assets: []
          },
          {
            id: 'EMP-006',
            name: 'Emily Davis',
            email: 'emily.davis@company.com',
            phone: '+91 43210 98765',
            assetsCount: 1,
            status: 'active',
            iconClass: 'fas fa-user-circle text-danger',
            assets: []
          },
          {
            id: 'EMP-007',
            name: 'Robert Taylor',
            email: 'robert.taylor@company.com',
            phone: '+91 32109 87654',
            assetsCount: 3,
            status: 'active',
            iconClass: 'fas fa-user-circle text-primary',
            assets: []
          },
          {
            id: 'EMP-008',
            name: 'Lisa Anderson',
            email: 'lisa.anderson@company.com',
            phone: '+91 21098 76543',
            assetsCount: 2,
            status: 'active',
            iconClass: 'fas fa-user-circle text-success',
            assets: []
          },
          {
            id: 'EMP-009',
            name: 'James Wilson',
            email: 'james.wilson@company.com',
            phone: '+91 10987 65432',
            assetsCount: 4,
            status: 'active',
            iconClass: 'fas fa-user-circle text-info',
            assets: []
          },
          {
            id: 'EMP-010',
            name: 'Maria Garcia',
            email: 'maria.garcia@company.com',
            phone: '+91 09876 54321',
            assetsCount: 1,
            status: 'active',
            iconClass: 'fas fa-user-circle text-warning',
            assets: []
          }
        ]
      }
    },
    computed: {
      filteredEmployees() {
        let filtered = [...this.employees]
        
        // Apply search filter
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase()
          filtered = filtered.filter(emp => 
            emp.name.toLowerCase().includes(searchLower) ||
            emp.id.toLowerCase().includes(searchLower) ||
            emp.email.toLowerCase().includes(searchLower)
          )
        }
        
        // Apply asset count filter
        if (this.assetCountFilter) {
          filtered = filtered.filter(emp => {
            switch (this.assetCountFilter) {
              case '0':
                return emp.assetsCount === 0
              case '1-2':
                return emp.assetsCount >= 1 && emp.assetsCount <= 2
              case '3+':
                return emp.assetsCount >= 3
              default:
                return true
            }
          })
        }
        
        // Apply status filter
        if (this.statusFilter) {
          filtered = filtered.filter(emp => emp.status === this.statusFilter)
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
          let aValue, bValue
          
          switch (this.sortBy) {
            case 'name':
              aValue = a.name
              bValue = b.name
              break
            case 'id':
              aValue = a.id
              bValue = b.id
              break
            case 'email':
              aValue = a.email
              bValue = b.email
              break
            default:
              return 0
          }
          
          if (aValue < bValue) return this.sortAscending ? -1 : 1
          if (aValue > bValue) return this.sortAscending ? 1 : -1
          return 0
        })
        
        // Apply pagination
        const start = (this.currentPage - 1) * this.itemsPerPage
        const end = start + this.itemsPerPage
        return filtered.slice(start, end)
      },
      totalPages() {
        return Math.ceil(this.allFilteredEmployees.length / this.itemsPerPage)
      },
      allFilteredEmployees() {
        let filtered = [...this.employees]
        
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase()
          filtered = filtered.filter(emp => 
            emp.name.toLowerCase().includes(searchLower) ||
            emp.id.toLowerCase().includes(searchLower) ||
            emp.email.toLowerCase().includes(searchLower)
          )
        }
        
        if (this.assetCountFilter) {
          filtered = filtered.filter(emp => {
            switch (this.assetCountFilter) {
              case '0':
                return emp.assetsCount === 0
              case '1-2':
                return emp.assetsCount >= 1 && emp.assetsCount <= 2
              case '3+':
                return emp.assetsCount >= 3
              default:
                return true
            }
          })
        }
        
        if (this.statusFilter) {
          filtered = filtered.filter(emp => emp.status === this.statusFilter)
        }
        
        return filtered
      },
      visiblePages() {
        const pages = []
        const total = this.totalPages
        const current = this.currentPage
        
        if (total <= 7) {
          for (let i = 1; i <= total; i++) {
            pages.push(i)
          }
        } else {
          if (current <= 4) {
            for (let i = 1; i <= 5; i++) {
              pages.push(i)
            }
          } else if (current >= total - 3) {
            for (let i = total - 4; i <= total; i++) {
              pages.push(i)
            }
          } else {
            for (let i = current - 2; i <= current + 2; i++) {
              pages.push(i)
            }
          }
        }
        
        return pages
      },
      paginationInfo() {
        const total = this.allFilteredEmployees.length
        const start = total === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1
        const end = Math.min(this.currentPage * this.itemsPerPage, total)
        
        return { start, end, total }
      }
    },
    methods: {
      switchToListView() {
        this.isGridView = false
      },
      switchToGridView() {
        this.isGridView = true
      },
      filterEmployees() {
        this.currentPage = 1
      },
      sortEmployees() {
        // Sorting is handled in computed property
      },
      toggleSortOrder() {
        this.sortAscending = !this.sortAscending
      },
      clearFilters() {
        this.searchTerm = ''
        this.assetCountFilter = ''
        this.statusFilter = ''
        this.currentPage = 1
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page
        }
      },
      viewEmployee(employee) {
        this.selectedEmployee = employee
        this.$nextTick(() => {
          const modal = new Modal(document.getElementById('employeeDetailModal'))
          modal.show()
        })
      },
      editEmployee(employee) {
        // Navigate to edit employee page
        this.$router.push(`/employees/edit/${employee.id}`)
      },
      issueAsset(employee) {
        // Navigate to issue asset page
        this.$router.push(`/assets/issue?employeeId=${employee.id}`)
      },
      collectAsset(asset) {
        // Navigate to collect asset page
        this.$router.push(`/assets/collect/${asset.id}`)
      },
      openBulkUploadModal() {
        // Handle bulk upload modal
        console.log('Open bulk upload modal')
      }
    }
  }
  </script>
  
  <style scoped>
  /* Component-specific styles are already included in main.css */
  /* Additional component-specific styles can be added here if needed */
  
  /* Modal Footer Button Styling */
  .modal-footer {
      background-color: var(--primary-light-gray) !important;
      border-top: 1px solid var(--element-gray) !important;
      padding: 1rem 1.5rem !important;
  }
  
  .modal-footer .btn {
      border-radius: 0.5rem !important;
      font-weight: 500 !important;
      transition: all 0.2s ease !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
  }
  
  .modal-footer .btn:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  .modal-footer .btn-secondary {
      background-color: var(--primary-light-gray) !important;
      border: 1px solid var(--element-gray) !important;
      color: var(--primary-dark-gray) !important;
  }
  
  .modal-footer .btn-secondary:hover {
      background-color: var(--secondary-red) !important;
      border-color: var(--secondary-red) !important;
      color: white !important;
  }
  
  .modal-footer .btn-success {
      background-color: var(--secondary-green) !important;
      border-color: var(--secondary-green) !important;
      color: white !important;
  }
  
  .modal-footer .btn-success:hover {
      background-color: #1e9c5a !important;
      border-color: #1e9c5a !important;
      color: white !important;
  }
  
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
  
  /* Compact Employee Modal Styling */
  .employee-info-section {
      background-color: var(--primary-white) !important;
      border: 1px solid var(--element-gray) !important;
      border-radius: 0.75rem !important;
      padding: 1.5rem !important;
  }
  
  .assigned-assets-section {
      background-color: var(--primary-white) !important;
      border: 1px solid var(--element-gray) !important;
      border-radius: 0.75rem !important;
      padding: 1.5rem !important;
  }
  
  .section-title {
      color: var(--primary-black) !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.75rem !important;
      padding-bottom: 0.5rem !important;
      border-bottom: 1px solid var(--element-gray) !important;
  }
  
  .info-label {
      font-size: 0.8rem !important;
      color: var(--primary-mid-gray) !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      margin-bottom: 0.25rem !important;
      display: block !important;
  }
  
  .info-value {
      color: var(--primary-black) !important;
      font-size: 0.9rem !important;
      font-weight: 500 !important;
      line-height: 1.4 !important;
  }
  
  /* Badge Styling for Employee Modal */
  .badge-active {
      background-color: var(--secondary-green) !important;
      color: white !important;
      font-size: 0.75rem !important;
      font-weight: 500 !important;
      padding: 0.35rem 0.65rem !important;
      border-radius: 0.375rem !important;
  }
  
  .badge-count {
      background-color: var(--secondary-purple) !important;
      color: white !important;
      font-size: 0.75rem !important;
      font-weight: 500 !important;
      padding: 0.35rem 0.65rem !important;
      border-radius: 0.375rem !important;
  }
  
  /* Assets List Styling */
  .assets-list {
      display: flex !important;
      flex-direction: column !important;
      gap: 0.75rem !important;
  }
  
  .asset-item {
      background-color: var(--primary-light-gray) !important;
      border: 1px solid var(--element-gray) !important;
      border-radius: 0.5rem !important;
      padding: 1rem !important;
  }
  
  .asset-icon {
      width: 40px !important;
      height: 40px !important;
      border-radius: 0.5rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-right: 1rem !important;
      flex-shrink: 0 !important;
  }
  
  .asset-icon i {
      color: white !important;
      font-size: 1.1rem !important;
  }
  
  .asset-details {
      min-width: 0 !important;
  }
  
  .asset-name {
      color: var(--primary-black) !important;
      font-size: 0.9rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.25rem !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  }
  
  .asset-meta {
      color: var(--primary-mid-gray) !important;
      font-size: 0.75rem !important;
      font-weight: 500 !important;
  }
  
  .asset-actions {
      display: flex !important;
      align-items: center !important;
      flex-shrink: 0 !important;
  }
  
  .asset-actions .btn-sm {
      font-size: 0.75rem !important;
      padding: 0.25rem 0.5rem !important;
      border-radius: 0.25rem !important;
  }
  
  .btn-outline-pink {
      background-color: var(--primary-white) !important;
      border: 1px solid var(--secondary-pink) !important;
      color: var(--secondary-pink) !important;
      font-weight: 500 !important;
  }
  
  .btn-outline-pink:hover {
      background-color: var(--secondary-pink) !important;
      border-color: var(--secondary-pink) !important;
      color: white !important;
      transform: translateY(-1px) !important;
  }
  
  .employee-actions-footer {
      border-top: 1px solid var(--primary-light-gray) !important;
      background-color: var(--primary-white) !important;
  }
  </style>
  