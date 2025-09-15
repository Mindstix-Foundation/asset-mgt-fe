# TrackStix Frontend - Folder Structure Documentation

## 🎯 Overview

This document provides a comprehensive guide to the folder structure created for the TrackStix Asset Management frontend application. The structure is based on the prototype requirements and follows Vue.js best practices.

## 📁 Complete Folder Structure

```
frontend/
├── src/
│   ├── api/                    # API service layer
│   │   ├── index.ts           # Main API configuration with Axios
│   │   ├── assets.ts          # Assets API endpoints
│   │   ├── employees.ts       # Employees API endpoints
│   │   ├── vendors.ts         # Vendors API endpoints
│   │   ├── maintenance.ts     # Maintenance API endpoints
│   │   └── auth.ts            # Authentication API endpoints
│   │
│   ├── assets/                 # Static assets
│   │   ├── images/            # Images and graphics
│   │   ├── icons/             # Custom icons
│   │   └── fonts/             # Custom fonts
│   │
│   ├── components/            # Reusable Vue components
│   │   ├── common/            # Generic reusable components
│   │   │   ├── README.md      # Component documentation
│   │   │   ├── AppButton.vue  # Button component
│   │   │   ├── AppInput.vue   # Input component
│   │   │   ├── AppModal.vue   # Modal component
│   │   │   └── ...            # Other common components
│   │   │
│   │   ├── layout/            # Layout components
│   │   │   ├── AppHeader.vue  # Application header
│   │   │   ├── AppSidebar.vue # Navigation sidebar
│   │   │   └── AppFooter.vue  # Application footer
│   │   │
│   │   ├── forms/             # Form components
│   │   ├── modals/            # Modal components
│   │   ├── charts/            # Chart components
│   │   ├── tables/            # Table components
│   │   │
│   │   ├── assets/            # Asset management components
│   │   ├── employees/         # Employee management components
│   │   ├── vendors/           # Vendor management components
│   │   ├── inventory/         # Inventory components
│   │   ├── maintenance/       # Maintenance components
│   │   ├── reports/           # Report components
│   │   └── dashboard/         # Dashboard components
│   │
│   ├── composables/           # Vue 3 composition functions
│   │   ├── useAssets.ts      # Asset management composable
│   │   ├── useEmployees.ts   # Employee management composable
│   │   ├── useAuth.ts        # Authentication composable
│   │   └── useApi.ts         # Generic API composable
│   │
│   ├── constants/             # Application constants
│   │   └── index.ts          # All constants and configurations
│   │
│   ├── layouts/               # Layout components
│   │   ├── DefaultLayout.vue # Main application layout
│   │   ├── AuthLayout.vue    # Authentication layout
│   │   └── PrintLayout.vue   # Print-specific layout
│   │
│   ├── middleware/            # Route middleware
│   │   ├── auth.ts           # Authentication guard
│   │   └── permissions.ts    # Permission-based guards
│   │
│   ├── plugins/               # Vue plugins
│   │   ├── axios.ts          # Axios configuration
│   │   └── chartjs.ts        # Chart.js configuration
│   │
│   ├── router/                # Vue Router configuration
│   │   ├── index.ts          # Main router configuration
│   │   └── routes.ts         # Route definitions
│   │
│   ├── services/              # Business logic services
│   │   ├── authService.ts    # Authentication service
│   │   ├── fileService.ts    # File handling service
│   │   └── exportService.ts  # Export functionality
│   │
│   ├── stores/                # Pinia state management
│   │   ├── auth.ts           # Authentication store
│   │   ├── assets.ts         # Assets store
│   │   ├── employees.ts      # Employees store
│   │   └── ui.ts             # UI state store
│   │
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # All type definitions
│   │
│   ├── utils/                 # Utility functions
│   │   └── index.ts          # Utility functions
│   │
│   ├── views/                 # Page components (route targets)
│   │   ├── auth/             # Authentication pages
│   │   │   ├── LoginView.vue # Login page
│   │   │   └── index.ts      # Route exports
│   │   │
│   │   ├── dashboard/        # Dashboard pages
│   │   │   ├── DashboardView.vue
│   │   │   └── index.ts
│   │   │
│   │   ├── assets/           # Asset management pages
│   │   │   ├── AssetsView.vue
│   │   │   ├── AssetDetailView.vue
│   │   │   ├── CreateAssetView.vue
│   │   │   └── index.ts
│   │   │
│   │   ├── employees/        # Employee management pages
│   │   │   ├── EmployeesView.vue
│   │   │   ├── EmployeeDetailView.vue
│   │   │   └── index.ts
│   │   │
│   │   ├── vendors/          # Vendor management pages
│   │   ├── inventory/        # Inventory pages
│   │   ├── maintenance/      # Maintenance pages
│   │   └── reports/          # Report pages
│   │
│   ├── App.vue               # Root Vue component
│   ├── main.ts               # Application entry point
│   └── README.md             # Source structure documentation
│
├── public/                    # Public static files
├── cypress/                   # E2E tests
├── node_modules/             # Dependencies
├── package.json              # Project configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── FOLDER_STRUCTURE.md       # This file
```

## 🚀 Key Features Implemented

### ✅ **Type-Safe Architecture**
- Comprehensive TypeScript interfaces for all entities
- Strongly typed API services
- Type-safe state management with Pinia

### ✅ **Modular Component Structure**
- Domain-specific component organization
- Reusable common components
- Consistent component patterns

### ✅ **API Service Layer**
- Axios-based HTTP client with interceptors
- Domain-specific API modules
- Error handling and authentication

### ✅ **Utility Functions**
- Date formatting and manipulation
- String utilities and validation
- File handling and export utilities
- Local storage helpers

### ✅ **Constants and Configuration**
- Centralized application constants
- API endpoint definitions
- Status configurations
- Navigation structure

## 🎨 Technology Stack Integration

### **Vue 3 + TypeScript**
- Composition API for reactive logic
- Script setup syntax for cleaner components
- Full TypeScript support throughout

### **Tailwind CSS**
- Utility-first CSS framework
- Responsive design system
- Custom component styling

### **Pinia State Management**
- Modern Vue state management
- TypeScript support
- Modular store structure

### **Vue Router**
- Client-side routing
- Route guards and middleware
- Nested routing support

### **Axios**
- HTTP client with interceptors
- Request/response transformation
- Error handling

## 📋 Based on Prototype Analysis

The folder structure incorporates all features from the prototype:

### **Core Modules**
- ✅ Dashboard with statistics and charts
- ✅ Asset Management with full CRUD operations
- ✅ Employee Management and assignment system
- ✅ Vendor Management
- ✅ Inventory tracking
- ✅ Maintenance & Repairs module
- ✅ Reports & Analytics

### **Features Covered**
- ✅ Role-based access (Admin/HR)
- ✅ Asset assignment and tracking
- ✅ QR code support structure
- ✅ Export functionality (Excel, PDF, CSV)
- ✅ Bulk upload capabilities
- ✅ Responsive design support
- ✅ Search and filtering
- ✅ Pagination support

## 🛠️ Next Steps

1. **Create Component Templates**: Start building the common components
2. **Implement Authentication**: Set up login and role-based access
3. **Build Dashboard**: Create the main dashboard with statistics
4. **Asset Management**: Implement asset CRUD operations
5. **Employee Management**: Build employee management interface
6. **API Integration**: Connect with backend services
7. **Testing**: Add unit and integration tests

## 📚 Development Guidelines

### **Component Naming**
- Use PascalCase for component names
- Prefix common components with "App"
- Use descriptive, domain-specific names

### **File Organization**
- Group related files in domain folders
- Use index.ts files for clean imports
- Keep components focused and single-purpose

### **State Management**
- Use Pinia stores for shared state
- Keep local state in components when possible
- Use composables for reusable reactive logic

### **API Integration**
- Use typed API services
- Handle errors consistently
- Implement loading states

This structure provides a solid foundation for building the complete TrackStix Asset Management application while maintaining scalability and maintainability. 