# TrackStix Frontend - Source Structure

This document outlines the folder structure and organization of the TrackStix Asset Management frontend application.

## 📁 Folder Structure

```
src/
├── api/                    # API service layer
├── assets/                 # Static assets (images, icons, etc.)
├── components/            # Reusable Vue components
│   ├── common/           # Generic reusable components
│   ├── layout/           # Layout-specific components
│   ├── forms/            # Form components
│   ├── modals/           # Modal components
│   ├── charts/           # Chart and visualization components
│   ├── tables/           # Table components
│   ├── assets/           # Asset management components
│   ├── employees/        # Employee management components
│   ├── vendors/          # Vendor management components
│   ├── inventory/        # Inventory management components
│   ├── maintenance/      # Maintenance management components
│   ├── reports/          # Report components
│   └── dashboard/        # Dashboard components
├── composables/           # Vue 3 composition functions
├── constants/             # Application constants and configurations
├── layouts/               # Layout components
├── middleware/            # Route middleware
├── plugins/               # Vue plugins
├── router/                # Vue Router configuration
├── services/              # Business logic and external services
├── stores/                # Pinia state management
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── views/                 # Page components (route components)
    ├── auth/             # Authentication pages
    ├── dashboard/        # Dashboard pages
    ├── assets/           # Asset management pages
    ├── employees/        # Employee management pages
    ├── vendors/          # Vendor management pages
    ├── inventory/        # Inventory pages
    ├── maintenance/      # Maintenance pages
    └── reports/          # Report pages
```

## 📋 Folder Descriptions

### `/api`
Contains API service modules for communicating with the backend. Each module corresponds to a specific domain (assets, employees, vendors, etc.).

### `/assets`
Static assets like images, icons, fonts, and other resources used throughout the application.

### `/components`
Reusable Vue components organized by functionality:
- **common/**: Generic components like buttons, inputs, badges, etc.
- **layout/**: Header, sidebar, footer, and other layout components
- **forms/**: Form-specific components and form fields
- **modals/**: Modal dialogs and popup components
- **charts/**: Chart and data visualization components
- **tables/**: Data table components with sorting, filtering, pagination
- **Module-specific folders**: Components specific to each business domain

### `/composables`
Vue 3 composition functions that encapsulate reusable reactive logic:
- Data fetching composables
- Form handling composables
- Search and filtering composables
- Authentication composables

### `/constants`
Application-wide constants including:
- API endpoints
- Configuration values
- Status definitions
- Navigation items
- Validation patterns

### `/layouts`
Layout components that define the overall page structure:
- Default layout
- Authentication layout
- Print layout

### `/middleware`
Route middleware for:
- Authentication guards
- Permission checks
- Route redirects

### `/plugins`
Vue plugins and third-party library configurations:
- Axios configuration
- Chart.js setup
- Date library setup

### `/router`
Vue Router configuration:
- Route definitions
- Route guards
- Route meta information

### `/services`
Business logic and external service integrations:
- API service classes
- Authentication service
- File upload service
- Export service

### `/stores`
Pinia state management stores:
- Authentication store
- Assets store
- Employees store
- UI state store

### `/types`
TypeScript type definitions:
- Entity interfaces
- API response types
- Component prop types
- Utility types

### `/utils`
Utility functions:
- Date formatting
- String manipulation
- Validation helpers
- File handling
- Local storage helpers

### `/views`
Page components that correspond to routes:
- Each folder represents a major section of the application
- Components in these folders are typically route targets

## 🎯 Key Principles

### 1. **Separation of Concerns**
Each folder has a specific purpose and contains related functionality.

### 2. **Domain-Driven Organization**
Components and logic are organized by business domain (assets, employees, etc.).

### 3. **Reusability**
Common components and utilities are centralized for reuse across the application.

### 4. **Type Safety**
TypeScript types are centralized and shared across the application.

### 5. **Scalability**
The structure supports easy addition of new features and modules.

## 🚀 Getting Started

### Adding New Components
1. Create components in the appropriate domain folder under `/components`
2. Export them from an `index.ts` file for easy importing
3. Add TypeScript types in `/types` if needed

### Adding New Pages
1. Create page components in the appropriate folder under `/views`
2. Add route definitions in `/router`
3. Update navigation in `/constants` if needed

### Adding New API Endpoints
1. Add service methods in `/api`
2. Update TypeScript types in `/types`
3. Add constants in `/constants` for endpoint URLs

### Adding New State
1. Create or update Pinia stores in `/stores`
2. Add TypeScript interfaces in `/types`
3. Use composables in `/composables` for reactive logic

## 📚 Related Documentation

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia State Management](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)
- [Tailwind CSS](https://tailwindcss.com/docs) 