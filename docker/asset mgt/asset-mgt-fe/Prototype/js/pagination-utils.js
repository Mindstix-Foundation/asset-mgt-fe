/**
 * Pagination Utility Functions
 * Provides consistent pagination functionality across the project
 */

/**
 * Generates pagination HTML with proper ellipsis handling
 * @param {Object} options - Pagination configuration
 * @param {number} options.currentPage - Current active page (1-based)
 * @param {number} options.totalPages - Total number of pages
 * @param {string} options.ariaLabel - Aria label for navigation
 * @param {Function} options.onPageClick - Callback function when page is clicked
 * @param {number} options.maxVisiblePages - Maximum visible page numbers (default: 7)
 * @returns {string} HTML string for pagination
 */
function generatePagination(options) {
    const {
        currentPage = 1,
        totalPages = 1,
        ariaLabel = 'Page navigation',
        onPageClick = () => {},
        maxVisiblePages = 7
    } = options;

    if (totalPages <= 1) {
        return '';
    }

    let pages = [];
    
    // Calculate page range to show
    if (totalPages <= maxVisiblePages) {
        // Show all pages if total is less than max visible
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Complex logic for ellipsis
        const halfVisible = Math.floor((maxVisiblePages - 3) / 2); // -3 for first, last, and ellipsis
        
        if (currentPage <= halfVisible + 2) {
            // Show: 1, 2, 3, 4, ..., totalPages
            for (let i = 1; i <= maxVisiblePages - 2; i++) {
                pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - halfVisible - 1) {
            // Show: 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - (maxVisiblePages - 3); i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show: 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
                pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
        }
    }

    // Generate HTML
    let html = `<nav aria-label="${ariaLabel}">
        <ul class="pagination pagination-modern mb-0">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>`;

    pages.forEach(page => {
        if (page === '...') {
            html += `<li class="page-item">
                <span class="page-link page-dots">...</span>
            </li>`;
        } else {
            const isActive = page === currentPage;
            html += `<li class="page-item ${isActive ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${page}">${page}</a>
            </li>`;
        }
    });

    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        </ul>
    </nav>`;

    return html;
}

/**
 * Updates pagination in the DOM
 * @param {string} containerId - ID of the container element
 * @param {Object} options - Pagination options (same as generatePagination)
 */
function updatePagination(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Pagination container with ID '${containerId}' not found`);
        return;
    }

    const paginationHTML = generatePagination(options);
    container.innerHTML = paginationHTML;

    // Add click event listeners
    const pageLinks = container.querySelectorAll('.page-link[data-page]');
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(link.getAttribute('data-page'));
            if (page && page !== options.currentPage && page >= 1 && page <= options.totalPages) {
                if (options.onPageClick) {
                    options.onPageClick(page);
                }
            }
        });
    });
}

/**
 * Calculates pagination info for display
 * @param {number} currentPage - Current page (1-based)
 * @param {number} itemsPerPage - Items per page
 * @param {number} totalItems - Total number of items
 * @returns {Object} Pagination info object
 */
function calculatePaginationInfo(currentPage, itemsPerPage, totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return {
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems,
        startItem,
        endItem,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1
    };
}

/**
 * Updates pagination info display
 * @param {string} infoElementId - ID of the element to show pagination info
 * @param {Object} paginationInfo - Pagination info from calculatePaginationInfo
 * @param {string} itemName - Name of items (e.g., 'assets', 'employees')
 */
function updatePaginationInfo(infoElementId, paginationInfo, itemName = 'items') {
    const infoElement = document.getElementById(infoElementId);
    if (!infoElement) {
        console.error(`Pagination info element with ID '${infoElementId}' not found`);
        return;
    }

    const { startItem, endItem, totalItems } = paginationInfo;
    infoElement.innerHTML = `Showing ${startItem}-${endItem} of ${totalItems.toLocaleString()} ${itemName}`;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generatePagination,
        updatePagination,
        calculatePaginationInfo,
        updatePaginationInfo
    };
}

// Make functions available globally
window.PaginationUtils = {
    generatePagination,
    updatePagination,
    calculatePaginationInfo,
    updatePaginationInfo
}; 