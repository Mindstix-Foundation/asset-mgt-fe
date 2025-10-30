# Pagination Implementation Guide

This guide explains how to implement consistent pagination across all pages in the Asset Management project.

## Overview

All pagination in the project now uses the same modern design with:
- Consistent styling with rounded buttons
- Proper ellipsis handling for many pages
- Hover effects and active states
- Responsive design
- FontAwesome chevron icons for navigation

## Files Updated

### ✅ Completed Updates

1. **assets.html** - ✅ Already had modern pagination, added ellipsis dots styling
2. **employees.html** - ✅ Updated icons to chevrons, added ellipsis dots styling  
3. **maintenance.html** - ✅ Already had correct implementation with ellipsis
4. **vendors.html** - ✅ Updated from `pagination-sm` to `pagination-modern`, added ellipsis styling
5. **reports.html** - ✅ Updated from `pagination-sm` to `pagination-modern`, added ellipsis styling

### 📁 Utility Files Created

- **js/pagination-utils.js** - Reusable pagination utility functions
- **pagination-demo.html** - Demonstration of all pagination scenarios

## Standard Pagination Structure

### HTML Structure
```html
<div class="d-flex justify-content-between align-items-center mt-4">
    <div class="text-muted">
        <small>Showing <span id="showingStart">1</span>-<span id="showingEnd">10</span> of <span id="totalItems">156</span> items</small>
    </div>
    <nav aria-label="Pagination">
        <ul class="pagination pagination-modern mb-0">
            <li class="page-item disabled">
                <a class="page-link" href="#" aria-label="Previous">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
            <li class="page-item active">
                <a class="page-link" href="#">1</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#">2</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#">3</a>
            </li>
            <li class="page-item">
                <span class="page-link page-dots">...</span>
            </li>
            <li class="page-item">
                <a class="page-link" href="#">156</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        </ul>
    </nav>
</div>
```

### Required CSS Classes

1. **pagination-modern** - Main pagination container class
2. **page-dots** - Special class for ellipsis dots

### Required CSS Styles

Add this CSS to any page with pagination:

```css
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

/* Special styling for ellipsis dots */
.pagination-modern .page-dots {
    cursor: default !important;
    background-color: transparent !important;
    border: none !important;
    color: var(--primary-mid-gray) !important;
}

.pagination-modern .page-dots:hover {
    background-color: transparent !important;
    border: none !important;
    transform: none !important;
}
```

## Using the Pagination Utility

### 1. Include the Utility
```html
<script src="js/pagination-utils.js"></script>
```

### 2. Generate Pagination Dynamically
```javascript
// Simple usage
PaginationUtils.updatePagination('paginationContainer', {
    currentPage: 78,
    totalPages: 156,
    ariaLabel: 'Asset pagination',
    onPageClick: function(page) {
        // Handle page navigation
        navigateToPage(page);
    }
});

// Calculate and update pagination info
const paginationInfo = PaginationUtils.calculatePaginationInfo(78, 10, 1560);
PaginationUtils.updatePaginationInfo('paginationInfo', paginationInfo, 'assets');
```

### 3. Utility Functions Available

- **generatePagination(options)** - Generates pagination HTML
- **updatePagination(containerId, options)** - Updates pagination in DOM
- **calculatePaginationInfo(currentPage, itemsPerPage, totalItems)** - Calculates pagination metrics
- **updatePaginationInfo(elementId, paginationInfo, itemName)** - Updates pagination info display

## Pagination Scenarios Handled

### 1. Few Pages (≤7 pages)
Shows all page numbers: `1 2 3 4 5`

### 2. Many Pages - Current at Beginning
Shows: `1 2 3 4 5 ... 156`

### 3. Many Pages - Current in Middle  
Shows: `1 ... 76 77 78 79 80 ... 156`

### 4. Many Pages - Current at End
Shows: `1 ... 152 153 154 155 156`

### 5. Single Page
No pagination shown (returns empty string)

## Demo Page

Visit `pagination-demo.html` to see all pagination scenarios in action with an interactive demo.

## Key Features

- ✅ Consistent modern design across all pages
- ✅ Proper ellipsis handling for many pages
- ✅ Hover effects and smooth transitions
- ✅ Active state highlighting with purple theme
- ✅ Disabled state for first/last page navigation
- ✅ Responsive design
- ✅ Accessibility support with aria-labels
- ✅ FontAwesome chevron icons
- ✅ Reusable utility functions

## Checklist for New Pages

When adding pagination to a new page:

- [ ] Include `pagination-modern` class
- [ ] Use chevron icons (`fas fa-chevron-left/right`)
- [ ] Add ellipsis dots with `page-dots` class when needed
- [ ] Include the modern pagination CSS styles
- [ ] Consider using the pagination utility for dynamic generation
- [ ] Test with different page counts (few, many, single)
- [ ] Ensure proper spacing and alignment with content

## Color Variables Used

- `--secondary-purple` - Active page background
- `--primary-light-gray` - Hover background, disabled background
- `--element-gray` - Border colors
- `--primary-dark-gray` - Text color
- `--primary-white` - Default background
- `--primary-mid-gray` - Disabled text, ellipsis color 