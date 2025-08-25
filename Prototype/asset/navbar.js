// Navbar functionality
class NavbarManager {
    constructor() {
        this.init();
    }

    // Initialize navbar
    init() {
        this.loadNavbar();
    }

    // Load navbar HTML into the page
    loadNavbar() {
        // Use relative path based on current page location
        const currentPath = window.location.pathname;
        let navbarPath;
        
        // Determine the correct relative path based on current location
        if (currentPath.includes('/pages/')) {
            navbarPath = '../asset/navbar.html';
        } else if (currentPath.includes('/form_pages/')) {
            navbarPath = '../asset/navbar.html';
        } else {
            // For root level pages
            navbarPath = 'asset/navbar.html';
        }
        
        fetch(navbarPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // Insert navbar at the beginning of body
                document.body.insertAdjacentHTML('afterbegin', html);
                // Fix the navbar links after insertion
                this.fixNavbarLinks();
                this.setActiveNavItem();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                console.error('Attempted to load from:', navbarPath);
                console.error('Current path:', currentPath);
            });
    }

    // Fix navbar links based on current page location
    fixNavbarLinks() {
        const currentPath = window.location.pathname;
        // Update all navigation links
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                if (currentPath.includes('/form_pages/')) {
                    // From form_pages, we need to go to ../pages/
                    if (href.endsWith('.html')) {
                        link.setAttribute('href', '../pages/' + href);
                    }
                } else if (currentPath.includes('/pages/')) {
                    // From pages subdirectory, links should work as-is
                    // No change needed for relative links
                } else {
                    // From root, go to pages/
                    if (href.endsWith('.html')) {
                        link.setAttribute('href', 'pages/' + href);
                    }
                }
            }
        });

        // Fix brand link (navbar-brand)
        const brandLink = document.querySelector('.navbar-brand');
        if (brandLink && brandLink.getAttribute('href') === '#') {
            if (currentPath.includes('/form_pages/')) {
                brandLink.setAttribute('href', '../pages/dashboard.html');
            } else if (currentPath.includes('/pages/')) {
                brandLink.setAttribute('href', 'dashboard.html');
            } else {
                brandLink.setAttribute('href', 'pages/dashboard.html');
            }
        }

        // Fix logout link
        const logoutLink = document.querySelector('a[href="../../index.html"]');
        if (logoutLink) {
            if (currentPath.includes('/form_pages/')) {
                logoutLink.setAttribute('href', '../../index.html');
            } else if (currentPath.includes('/pages/')) {
                // Keep the relative path for pages
                logoutLink.setAttribute('href', '../../index.html');
            } else {
                logoutLink.setAttribute('href', '../index.html');
            }
        }
    }

    // Get path prefix based on current location
    getPathPrefix(currentPath) {
        if (currentPath.includes('/pages/')) {
            return '../../';
        } else if (currentPath.includes('/form_pages/')) {
            return '../';
        }
        return './';
    }

    // Determine path depth to calculate relative paths
    getPathDepth() {
        const path = window.location.pathname;
        
        // If we're in a page folder (like pages/dashboard/), we need to go up 2 levels
        if (path.includes('/pages/')) {
            return 2;
        }
        // If we're in form_pages folder, we need to go up 1 level
        if (path.includes('/form_pages/')) {
            return 1;
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
            if (!href || href === '#') return;
            
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
            if (href && href.includes(pageName)) {
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