// Asset Management Tool - JavaScript Functions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLogin();
    initializeViewToggle();
    initializeCharts();
    initializePasswordToggle();
    initializeProgressCircles();
    initializeTooltips();
    initializeDateRangeToggle();
    initializeFormValidation();
});

// Login functionality
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userType = document.getElementById('userType').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation for demo
            if (userType && username && password) {
                // Simulate login process
                showLoadingState(e.target);
                
                setTimeout(() => {
                    if (userType === 'admin' && username === 'admin' && password === 'admin123') {
                        localStorage.setItem('userRole', 'admin');
                        window.location.href = 'dashboard.html';
                    } else if (userType === 'hr' && username === 'hr001' && password === 'hr123') {
                        localStorage.setItem('userRole', 'hr');
                        window.location.href = 'dashboard.html';
                    } else {
                        showAlert('Invalid credentials. Please try again.', 'danger');
                        hideLoadingState(e.target);
                    }
                }, 1500);
            } else {
                showAlert('Please fill in all fields.', 'warning');
            }
        });
    }
}

// View toggle functionality (Grid/List view)
function initializeViewToggle() {
    const toggleButton = document.getElementById('toggleView');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const gridView = document.getElementById('gridView');
            const listView = document.getElementById('listView');
            const icon = this.querySelector('i');
            
            if (gridView && listView) {
                if (gridView.classList.contains('d-none')) {
                    // Switch to grid view
                    gridView.classList.remove('d-none');
                    listView.classList.add('d-none');
                    icon.className = 'fas fa-th-large me-1';
                    this.innerHTML = '<i class="fas fa-th-large me-1"></i>Grid View';
                } else {
                    // Switch to list view
                    gridView.classList.add('d-none');
                    listView.classList.remove('d-none');
                    icon.className = 'fas fa-list me-1';
                    this.innerHTML = '<i class="fas fa-list me-1"></i>List View';
                }
            }
        });
    }
}

// Password toggle functionality
function initializePasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }
}

// Progress circles initialization
function initializeProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle canvas');
    progressCircles.forEach(canvas => {
        drawProgressCircle(canvas, 75); // Example: 75% progress
    });
}

// Draw progress circle
function drawProgressCircle(canvas, percentage) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 30;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 8;
    ctx.stroke();
    
    // Draw progress circle
    const progressAngle = (percentage / 100) * 2 * Math.PI - (Math.PI / 2);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, progressAngle);
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
}

// Charts initialization
function initializeCharts() {
    // Asset Distribution Chart
    const assetDistCtx = document.getElementById('assetDistributionChart');
    if (assetDistCtx) {
        // Set canvas dimensions to prevent expansion
        assetDistCtx.style.maxHeight = '250px';
        assetDistCtx.style.height = '250px';
        
        new Chart(assetDistCtx, {
            type: 'doughnut',
            data: {
                labels: ['Laptops', 'Monitors', 'Mobile Devices', 'Accessories'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#f8f9fa', '#f8f9fa', '#f8f9fa', '#f8f9fa'],
                    borderColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
    }
    
    // Asset Status Chart
    const assetStatusCtx = document.getElementById('assetStatusChart');
    if (assetStatusCtx) {
        // Set canvas dimensions to prevent expansion
        assetStatusCtx.style.maxHeight = '250px';
        assetStatusCtx.style.height = '250px';
        
        new Chart(assetStatusCtx, {
            type: 'bar',
            data: {
                labels: ['Assigned', 'Available', 'Maintenance', 'Retired'],
                datasets: [{
                    data: [892, 312, 43, 127],
                    backgroundColor: ['#f8f9fa', '#f8f9fa', '#f8f9fa', '#f8f9fa'],
                    borderColor: ['#007bff', '#28a745', '#ffc107', '#6c757d'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
    }
}

// Tooltips initialization
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Date range toggle
function initializeDateRangeToggle() {
    const dateRangeSelect = document.querySelector('select[class="form-select"]:last-of-type');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            const customDateRange = document.getElementById('customDateRange');
            if (customDateRange) {
                if (this.value === 'Custom Range') {
                    customDateRange.style.display = 'flex';
                } else {
                    customDateRange.style.display = 'none';
                }
            }
        });
    }
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// Utility functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showLoadingState(element) {
    element.classList.add('loading');
    const submitBtn = element.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';
    }
}

function hideLoadingState(element) {
    element.classList.remove('loading');
    const submitBtn = element.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login';
    }
}

// Export functionality (placeholder)
function exportToExcel(data, filename = 'export.xlsx') {
    showAlert('Excel export functionality would be implemented here.', 'info');
    console.log('Exporting to Excel:', data);
}

function exportToPDF(data, filename = 'export.pdf') {
    showAlert('PDF export functionality would be implemented here.', 'info');
    console.log('Exporting to PDF:', data);
}

// Filter functionality
function applyFilters() {
    showAlert('Filters applied successfully!', 'success');
    // In a real application, this would filter the data
}

function clearFilters() {
    // Reset all form elements
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.reset();
        form.classList.remove('was-validated');
    });
    showAlert('Filters cleared.', 'info');
}

// QR Code functionality (placeholder)
function generateQRCode(assetId) {
    showAlert(`QR Code for ${assetId} would be generated here.`, 'info');
    console.log('Generating QR Code for:', assetId);
}

// Asset assignment functionality
function assignAsset(assetId, employeeId) {
    showAlert(`Asset ${assetId} assigned to employee ${employeeId}`, 'success');
    console.log('Assigning asset:', assetId, 'to employee:', employeeId);
}

// Maintenance scheduling
function scheduleMaintenance(assetId, details) {
    showAlert(`Maintenance scheduled for asset ${assetId}`, 'success');
    console.log('Scheduling maintenance:', assetId, details);
}

// Search functionality
function performSearch(query, type = 'all') {
    if (query.length < 2) {
        return;
    }
    
    console.log('Searching for:', query, 'in:', type);
    // In a real application, this would perform the actual search
    showAlert(`Searching for "${query}"...`, 'info');
}

// Add event listeners for search inputs
document.addEventListener('DOMContentLoaded', function() {
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    searchInputs.forEach(input => {
        let searchTimeout;
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.trim()) {
                    performSearch(this.value.trim());
                }
            }, 500);
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            const modal = bootstrap.Modal.getInstance(openModal);
            if (modal) {
                modal.hide();
            }
        }
    }
});

// Responsive table handling
function makeTablesResponsive() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.closest('.table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

// Initialize responsive tables on page load
document.addEventListener('DOMContentLoaded', makeTablesResponsive);

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Redraw charts on resize
    if (typeof Chart !== 'undefined') {
        Chart.instances.forEach(chart => {
            chart.resize();
        });
    }
});

// Simulate real-time updates (for demo purposes)
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update random stats
        const statCards = document.querySelectorAll('.card h2');
        statCards.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const newValue = Math.max(0, currentValue + change);
            if (newValue !== currentValue) {
                stat.textContent = newValue.toLocaleString();
                stat.parentElement.parentElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    stat.parentElement.parentElement.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }, 30000); // Update every 30 seconds
}

// Start real-time updates if on dashboard
if (window.location.pathname.includes('dashboard')) {
    setTimeout(simulateRealTimeUpdates, 5000);
}

// Service Worker registration for offline support (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed');
        });
    });
}

// Employee lookup functionality for assign asset modal
function initializeEmployeeLookup() {
    const employeeIdInput = document.getElementById('employeeIdInput');
    const employeeNameDisplay = document.getElementById('employeeNameDisplay');
    
    if (employeeIdInput && employeeNameDisplay) {
        // Sample employee data (in real app, this would come from API)
        const employees = {
            'EMP-001': 'John Doe',
            'EMP-002': 'Jane Smith',
            'EMP-003': 'Mike Johnson',
            'EMP-004': 'Sarah Wilson',
            'EMP-005': 'David Brown'
        };
        
        employeeIdInput.addEventListener('input', function() {
            const employeeId = this.value.trim().toUpperCase();
            if (employees[employeeId]) {
                employeeNameDisplay.value = employees[employeeId];
                employeeNameDisplay.classList.remove('is-invalid');
                employeeNameDisplay.classList.add('is-valid');
            } else if (employeeId) {
                employeeNameDisplay.value = 'Employee not found';
                employeeNameDisplay.classList.remove('is-valid');
                employeeNameDisplay.classList.add('is-invalid');
            } else {
                employeeNameDisplay.value = '';
                employeeNameDisplay.classList.remove('is-valid', 'is-invalid');
            }
        });
    }
}

// Delete employee functionality
function initializeDeleteEmployee() {
    const deleteModal = document.getElementById('deleteEmployeeModal');
    if (deleteModal) {
        deleteModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const employeeId = button.getAttribute('data-employee-id');
            const employeeName = button.getAttribute('data-employee-name');
            
            document.getElementById('deleteEmployeeId').textContent = employeeId;
            document.getElementById('deleteEmployeeName').textContent = employeeName;
            
            // Store the employee data for deletion
            document.getElementById('confirmDeleteEmployee').setAttribute('data-employee-id', employeeId);
        });
        
        document.getElementById('confirmDeleteEmployee').addEventListener('click', function() {
            const employeeId = this.getAttribute('data-employee-id');
            // In a real app, this would make an API call to delete the employee
            showAlert(`Employee ${employeeId} has been deleted successfully.`, 'success');
            bootstrap.Modal.getInstance(deleteModal).hide();
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    initializeEmployeeLookup();
    initializeDeleteEmployee();
});

// Export functions for use in HTML
window.AssetManagement = {
    exportToExcel,
    exportToPDF,
    applyFilters,
    clearFilters,
    generateQRCode,
    assignAsset,
    scheduleMaintenance,
    showAlert
}; 