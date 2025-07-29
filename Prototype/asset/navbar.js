// Navbar functionality
class NavbarManager {
    constructor() {
        this.init();
    }

    // Initialize navbar
    init() {
        this.loadNavbar();
        this.setActiveNavItem();
    }

    // Load navbar HTML into the page
    loadNavbar() {
        // Determine the correct path to navbar.html based on current location
        const pathDepth = this.getPathDepth();
        const navbarPath = '../'.repeat(pathDepth) + 'asset/navbar.html';
        
        fetch(navbarPath)
            .then(response => response.text())
            .then(html => {
                // Insert navbar at the beginning of body
                document.body.insertAdjacentHTML('afterbegin', html);
                this.setActiveNavItem();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
            });
    }

    // Determine path depth to calculate relative paths
    getPathDepth() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        
        // If we're in a page folder (like pages/dashboard/), we need to go up 2 levels
        if (path.includes('/pages/')) {
            return 2;
        }
        // If we're in the root Prototype folder
        return 0;
    }

    // Set active navigation item based on current page
    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop();
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page nav link
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkFile = href.split('/').pop();
            
            // Check if current file matches the navigation link
            if (currentFile === linkFile) {
                link.classList.add('active');
            }
            // Also check by page type for broader matching
            else if (currentPath.includes('/dashboard/') && href.includes('dashboard')) {
                link.classList.add('active');
            } else if (currentPath.includes('/assets/') && href.includes('assets')) {
                link.classList.add('active');
            } else if (currentPath.includes('/employees/') && href.includes('employees')) {
                link.classList.add('active');
            } else if (currentPath.includes('/inventory/') && href.includes('inventory')) {
                link.classList.add('active');
            } else if (currentPath.includes('/maintenance/') && href.includes('maintenance')) {
                link.classList.add('active');
            } else if (currentPath.includes('/reports/') && href.includes('reports')) {
                link.classList.add('active');
            }
        });
    }

    // Update active state when navigating (for SPA-like behavior)
    updateActiveState(pageName) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href.includes(pageName)) {
                link.classList.add('active');
            }
        });
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new NavbarManager();
});

// Export for manual usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavbarManager;
} 