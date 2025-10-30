# Asset Management Tool - Prototype

A comprehensive hollow prototype for an Asset Management Tool built with HTML, Bootstrap 5, CSS, and JavaScript. This prototype covers all core modules for managing company assets and employees.

## Features

### 🔐 User Access & Roles
- **Admin Login**: Full permissions (admin/admin123)
- **HR Login**: Read-only access to all features (hr001/hr123)
- Role-based navigation and functionality

### 📊 Dashboard
- Real-time statistics overview
- Asset distribution charts
- Recent activity timeline
- Quick action buttons

### 💻 Asset Management
- Complete asset inventory with detailed profiles
- Grid and list view toggle
- Asset filtering and search
- QR code support for asset tagging
- Detailed asset specifications and warranty info
- Asset history tracking

### 👥 Employee Management
- Employee profiles with assigned assets
- Asset assignment history
- Employee filtering by department and location
- Comprehensive employee-asset mapping

### 🚚 Vendor Management
- Complete vendor directory with contact information
- Supplier and service provider categorization
- Vendor performance tracking and asset sourcing history
- Tax information and system access management

### 📦 Inventory Management
- Available and spare assets tracking
- Stock level monitoring
- Location-based organization
- Export functionality

### 🔧 Maintenance & Repairs
- Maintenance scheduling and tracking
- Service provider management
- Cost estimation and tracking
- Progress monitoring
- Maintenance history logs

### 📈 Reports & Analytics
- Custom report builder
- Excel and PDF export options
- Department-wise asset allocation
- Audit logs and compliance reports
- Interactive charts and visualizations

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Charts**: Chart.js
- **Responsive**: Mobile-first design (sm, md, lg, xl breakpoints)

## File Structure

```
Prototype/
├── index.html          # Login page
├── dashboard.html      # Main admin dashboard
├── assets.html         # Asset management
├── employees.html      # Employee management
├── inventory.html      # Inventory management
├── maintenance.html    # Maintenance & repairs
├── reports.html        # Reports & analytics
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Key Features Implemented

### ✅ Centralized Asset & Employee Library
- Dashboard with asset and employee database
- Employee ID and Asset ID management
- Asset categorization (Laptop, Monitor, Mobile, Tablets, iPads, Accessories)

### ✅ Asset Assignment & Visibility
- Employee profile views with assigned assets
- Card/List components showing:
  - Asset ID, Model, Serial Number, Brand
  - Specifications (RAM, storage, processor)
  - Date of issue

### ✅ Inventory Management
- Separate inventory section for unassigned/spare assets
- Filtering by Asset Type, Serial Number, Brand, Status
- Status tracking (Available, In Use, Under Repair, Retired)

### ✅ Asset History Tracking
- Employee-wise asset history
- Asset-level history with previous owners
- Repair logs and replacement data

### ✅ Export & Reporting
- Export buttons for Excel (.xlsx)
- Filters for department, location, asset type
- Downloadable inventory and audit logs
- Bulk upload functionality for assets and employees

### ✅ Enhanced Asset Management
- Brand and model dropdowns for better data consistency
- Optional purchase date field
- Unassign asset functionality in quick actions
- INR currency support for maintenance costs

### ✅ Improved Employee Management
- Simplified employee form (removed department, salary, email notifications)
- Optional position and join date fields
- Enhanced employee status options (Maternity Leave, Sabbatical Leave)
- Employee deletion with asset reassignment
- Bulk employee upload via Excel

### ✅ Enhanced Assignment System
- Employee lookup by ID with auto-population
- Removed department dependency from assignments
- Added "Mindstix Foundation" assignment type
- Simplified assignment workflow without priority and return dates

### ✅ Asset Metadata Management
- Detailed asset profiles with specifications
- Serial Number, Model, Brand, RAM, CPU, OS
- Warranty details and current assignment mapping

### ✅ Maintenance & Repairs
- Assets tagged as "Under Maintenance"
- Start & end dates, vendor information
- Issue description and estimated costs
- Excluded from active assignment pool

### ✅ QR Code Support
- Placeholder QR code functionality
- Asset tagging for easy identification
- Audit trail support

## Demo Credentials

### Admin Access
- **Username**: admin
- **Password**: admin123
- **Permissions**: Full access to all features

### HR Access
- **Username**: hr001
- **Password**: hr123
- **Permissions**: Read-only access to all features

## Responsive Design

The prototype is fully responsive and works across all device sizes:

- **Small (sm)**: ≥576px - Mobile phones
- **Medium (md)**: ≥768px - Tablets
- **Large (lg)**: ≥992px - Desktops
- **Extra Large (xl)**: ≥1200px - Large desktops

## Interactive Features

- **Search**: Real-time search across all modules
- **Filters**: Advanced filtering options
- **Modals**: Detailed views and forms
- **Charts**: Interactive data visualizations
- **Navigation**: Smooth page transitions
- **Alerts**: User feedback notifications

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

1. Open `index.html` in a web browser
2. Use the demo credentials to log in
3. Navigate through different modules
4. All functionality is demonstrated with placeholder data

## Future Enhancements

- Backend API integration
- Real database connectivity
- Actual file export functionality
- QR code generation and scanning
- Email notifications
- Advanced reporting features
- Mobile app integration

## Notes

This is a **hollow prototype** designed for stakeholder validation and UI/UX demonstration. All data is placeholder content, and backend functionality would need to be implemented for production use.

The prototype successfully demonstrates the complete user interface and user experience for all requested modules and features. 