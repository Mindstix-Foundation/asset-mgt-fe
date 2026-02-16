# Pebble Asset Tracker - Intelligent Asset Management Platform

> **🌟 An enterprise asset management system developed by Mindstix Foundation that simplifies and automates the complete lifecycle management of organizational assets. Pebble Asset Tracker provides comprehensive tracking, maintenance scheduling, and analytics for efficient asset management across educational institutions and enterprises.**

## 🎯 Project Vision & Problem Statement

### The Asset Management Challenge
Traditional asset management is a complex, time-consuming process that burdens organizations with manual tracking, maintenance scheduling, and reporting. Organizations struggle with:

- ⏰ **Time Constraints** - Manual asset tracking takes hours of administrative work
- 📊 **Poor Visibility** - Lack of real-time asset status and location information
- 🔄 **Inefficient Processes** - Manual assignment and collection workflows
- ❌ **Data Inaccuracy** - Human errors in record keeping and tracking
- 📝 **Maintenance Delays** - Missed maintenance schedules and warranty expirations
- 🎯 **Compliance Issues** - Difficulty maintaining audit trails and documentation

### Our Innovative Solution
Pebble Asset Tracker revolutionizes asset management by providing an intelligent, automated platform that:

- 🚀 **Reduces Administrative Time by 70%+** - From hours to minutes
- 🎯 **Real-time Visibility** - Complete asset lifecycle tracking and status monitoring
- 🧠 **Intelligent Automation** - Automated maintenance reminders and warranty tracking
- 📊 **Comprehensive Analytics** - Data-driven insights for better decision making
- 🔔 **Proactive Alerts** - Maintenance reminders and overdue notifications
- 🏢 **Enterprise-Ready** - Scalable for organizations of all sizes

## 🌟 The Pebble Asset Tracker Difference

### Traditional Method vs Pebble Asset Tracker Solution

| Aspect | Traditional Method | Pebble Asset Tracker Solution |
|--------|-------------------|-------------------|
| **Asset Tracking** | Manual spreadsheets | Real-time digital tracking |
| **Assignment Process** | 30+ minutes per asset | 2-3 minutes per asset |
| **Maintenance Scheduling** | Manual calendar management | Automated scheduling & alerts |
| **Data Accuracy** | High error rate | Near zero (automated) |
| **Reporting** | Hours of manual work | Instant automated reports |
| **Audit Trails** | Incomplete/missing records | Complete historical tracking |
| **Scalability** | Limited & inefficient | Unlimited & automated |

## 🎯 Platform Overview

Pebble Asset Tracker is a comprehensive SaaS platform designed to address key challenges in organizational asset management:

### 🎯 **Core Objectives**
- **Complete Lifecycle Management** - Track assets from procurement to retirement
- **Efficient Assignment Workflow** - Streamlined asset issue and collection processes
- **Proactive Maintenance** - Automated scheduling and reminder system
- **Real-time Tracking** - Live asset status and location monitoring
- **Comprehensive Reporting** - Detailed analytics and customizable reports
- **Audit Compliance** - Complete historical tracking and documentation
- **Multi-role Access** - Role-based permissions for admins and users
- **Vendor Management** - Centralized vendor information and service tracking

### 📝 **Core Modules**

#### **1. Asset Management**
- **Complete Asset Lifecycle** - Track from procurement to retirement/disposal
- **Multi-category Support** - Organize assets by categories, types, brands, and models
- **Serial Number Tracking** - Unique identification for each asset
- **Status Management** - Available, Assigned, In Maintenance, Retired, Lost
- **Condition Tracking** - Monitor asset condition: New, Good, Fair, Poor, Damaged, Refurbished
- **Location Management** - Track physical location of assets
- **Document Management** - Store purchase receipts, warranties, manuals
- **Bulk Operations** - Import multiple assets via CSV for quick onboarding

#### **2. Assignment Management**
- **Issue Workflow** - Streamlined asset assignment to employees
- **Collection Workflow** - Efficient asset return process
- **Assignment History** - Complete tracking of all asset assignments
- **Condition Documentation** - Record condition at issue and return
- **Reason Tracking** - Document reasons for assignments and returns
- **Notes & Comments** - Add contextual information for assignments

#### **3. Maintenance Management**
- **Preventive Maintenance** - Schedule regular maintenance activities
- **Corrective Maintenance** - Track repairs and fixes
- **Vendor Integration** - Assign maintenance to service vendors
- **Cost Tracking** - Record estimated and actual maintenance costs
- **Status Monitoring** - Track maintenance status from scheduled to completed
- **Automated Reminders** - Notifications for upcoming and overdue maintenance
- **Maintenance History** - Complete maintenance logs per asset

#### **4. Employee Management**
- **Employee Profiles** - Comprehensive employee information
- **Asset Assignment Tracking** - View all assets assigned to each employee
- **Assignment History** - Complete historical record of asset usage
- **Self-service Portal** - Employees can view their assigned assets
- **Bulk Import** - CSV-based employee data import

#### **5. Vendor Management**
- **Vendor Profiles** - Centralized vendor information database
- **Type Classification** - Supplier, Service Provider, Manufacturer, etc.
- **Contact Management** - Store contact details and communication history
- **Service Tracking** - Track maintenance and support services
- **Status Management** - Active/Inactive vendor status
- **Bulk Import** - CSV-based vendor data import

### 👥 **Multi-Role Access System**
- **Admin Role** - Complete system administration, asset management, and reporting
- **Manager Role** - Asset tracking, assignment management, and team oversight
- **Employee Role** - View assigned assets and asset history
- **Auditor Role** - Read-only access for compliance and audit purposes

### 🏢 **Enterprise Features**
- **Multi-department Support** - Organize assets by departments and locations
- **Advanced Search & Filters** - Quick asset discovery with multiple filter options
- **Custom Categories** - Create custom asset categories, types, and attributes
- **Comprehensive Audit Logs** - Track all system activities and changes
- **Data Export** - Export reports in PDF, Excel, and CSV formats
- **Dashboard Analytics** - Real-time metrics and KPIs
- **Notification System** - Email and in-app notifications for important events

## 🚀 Tech Stack

### Core Framework
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development with enhanced IDE support
- **Vite** - Fast build tool and development server

### UI & Styling
- **Bootstrap 5** - Responsive CSS framework
- **Font Awesome** - Comprehensive icon library
- **Custom CSS** - Tailored styling with CSS variables for theming

### State Management & Data
- **Pinia** - Modern state management for Vue
- **Axios** - HTTP client for API communication
- **Vue Router** - Client-side routing

### Form Handling & Validation
- **Vuelidate** - Lightweight validation library
- **Custom Validators** - Domain-specific validations

### Document Generation
- **jsPDF** - Client-side PDF generation
- **xlsx** - Excel file generation and parsing

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Vite** - Next generation build tooling

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── common/         # Shared UI components
│   │   ├── forms/          # Form-specific components
│   │   ├── modals/         # Modal dialogs
│   │   ├── ui/             # UI elements (pagination, date picker, etc.)
│   │   └── feature/        # Feature-specific components
│   ├── views/              # Page components
│   │   ├── admin/          # Admin management pages
│   │   ├── assets/         # Asset management pages
│   │   ├── employees/      # Employee management pages
│   │   ├── maintenance/    # Maintenance management pages
│   │   ├── vendors/        # Vendor management pages
│   │   ├── reports/        # Reports and analytics pages
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   └── profile/        # User profile pages
│   ├── services/           # API service layer
│   │   ├── api/           # API client services
│   │   ├── business/      # Business logic services
│   │   └── core/          # Core services (auth, API client)
│   ├── stores/             # Pinia state management
│   ├── router/             # Vue Router configuration
│   ├── composables/        # Reusable composition functions
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # Application constants
│   ├── config/             # Configuration files
│   └── assets/             # Static assets
│       └── styles/         # Global styles
├── public/                 # Public static files
└── dist/                   # Built application
```

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (or yarn/pnpm)
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd asset-mgt-fe/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_TITLE=Pebble Asset Tracker
   VITE_APP_VERSION=1.0.0
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run preview` - Preview production build locally

### Building
- `npm run build` - Build for production
- `npm run build-only` - Build without type checking

### Code Quality
- `npm run lint` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 📚 Comprehensive Feature Set

### 🏢 **For Administrators**

#### **Dashboard & Analytics**
- **Key Metrics Overview** - Total assets, assignments, maintenance schedules
- **Visual Analytics** - Charts and graphs for asset distribution and status
- **Quick Actions** - Fast access to common administrative tasks
- **Recent Activity** - Real-time feed of system activities

#### **Asset Management**
- **Asset CRUD Operations** - Create, Read, Update, Delete assets
- **Bulk Import** - CSV-based bulk asset creation
- **Category Management** - Organize assets by categories, types, brands, models
- **Status Tracking** - Monitor asset lifecycle status changes
- **Retirement Management** - Properly retire and dispose of assets
- **Reactivation** - Bring retired assets back into service

#### **Assignment & Collection**
- **Issue Assets** - Assign assets to employees with full documentation
- **Collect Assets** - Process asset returns with condition verification
- **Assignment History** - Complete tracking of all assignments per asset
- **Bulk Operations** - Assign multiple assets to one or multiple employees

#### **Maintenance Scheduling**
- **Schedule Maintenance** - Plan preventive and corrective maintenance
- **Vendor Assignment** - Assign maintenance tasks to service vendors
- **Cost Management** - Track estimated and actual maintenance costs
- **Status Tracking** - Monitor maintenance from scheduled to completion
- **Automated Alerts** - Notifications for upcoming and overdue maintenance
- **Maintenance History** - Complete maintenance logs and reports

#### **Reports & Analytics**
- **Asset Reports** - Comprehensive asset inventory and status reports
- **Assignment Reports** - Employee-wise asset assignment reports
- **Maintenance Reports** - Maintenance schedules and cost analysis
- **Custom Reports** - Filter and export data in multiple formats
- **Export Options** - PDF, Excel, and CSV export capabilities

### 👥 **For Employees**

#### **Asset View**
- **My Assets** - View all currently assigned assets
- **Asset Details** - Detailed information about assigned assets
- **Assignment History** - Historical record of all asset assignments
- **Maintenance Status** - View maintenance schedules for assigned assets

#### **Profile Management**
- **Personal Information** - View and update profile details
- **Contact Information** - Manage contact details
- **Asset History** - Complete history of asset usage

### 🔧 **For Managers**

#### **Team Management**
- **Team Assets** - View all assets assigned to team members
- **Assignment Oversight** - Monitor and manage team asset assignments
- **Maintenance Coordination** - Coordinate maintenance for team assets
- **Reports** - Generate team-specific reports and analytics

### 🚀 **Frontend Technical Features**

#### **User Interface & Experience**
- **Responsive Design** - Mobile-first approach for all screen sizes
- **Intuitive Navigation** - Clean, user-friendly interface
- **Real-time Updates** - Live data updates without page refresh
- **Search & Filters** - Advanced search with multiple filter options
- **Pagination** - Efficient data loading with pagination
- **Modals & Forms** - Well-designed forms with validation

#### **Data Management**
- **Smart Caching** - Reduce API calls with intelligent caching
- **Optimistic Updates** - Instant UI feedback for better UX
- **Error Handling** - Graceful error handling with user-friendly messages
- **Toast Notifications** - Non-intrusive success and error notifications

#### **Advanced Features**
- **Bulk Operations** - Import/export data in bulk
- **Advanced Search** - Multi-field search with autocomplete
- **Custom Date Picker** - User-friendly date selection
- **Searchable Dropdowns** - Quick selection from large datasets
- **Notes & Comments** - Rich text support for documentation
- **File Uploads** - Support for document and image uploads

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Application Settings
VITE_APP_TITLE=Pebble Asset Tracker - Asset Management
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Build Configuration
The application uses Vite for building and development. Configuration can be found in `vite.config.ts`.

## 🚀 Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to your web server

### Build Optimization
- **Code Splitting** - Automatic route-based code splitting
- **Tree Shaking** - Remove unused code
- **Asset Optimization** - Minification and compression
- **Lazy Loading** - Components loaded on demand

## 🔒 Security Considerations

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Granular permissions system
- **Input Validation** - Client-side validation with server-side verification
- **XSS Protection** - Sanitized HTML rendering
- **CSRF Protection** - Token-based request validation

## 🌐 Browser Support

- **Chrome**: 90+ (Recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## 📱 Mobile Responsiveness

The application is fully responsive with:
- **Breakpoints**: Mobile-first responsive design
- **Touch Gestures**: Optimized for touch interactions
- **Performance**: Optimized for mobile networks
- **Accessibility**: Screen reader compatible

## 🛠️ Development Guidelines

### Code Style
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Implement consistent naming conventions
- Write self-documenting code with comments

### Component Structure
```vue
<template>
  <!-- Template with semantic HTML -->
</template>

<script setup lang="ts">
// Composition API with TypeScript
import { ref, computed, onMounted } from 'vue'

// Component logic here
</script>

<style scoped>
/* Scoped component styles */
</style>
```

### State Management
Use Pinia stores for:
- User authentication state
- Application configuration
- Shared component data
- API response caching

## 📖 API Integration & Backend

### Backend API Repository
- **Pebble Asset Tracker Backend**: [asset-mgt-be](../asset-mgt-be) - NestJS backend providing robust APIs

### API Documentation
The backend provides comprehensive REST APIs documented with Swagger:
- **Development**: `http://localhost:3000/api`
- **Swagger UI**: `http://localhost:3000/api/docs`

### Key API Endpoints

#### **Authentication**
- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile
- `POST /auth/change-password` - Change password
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### **Asset Management**
- `GET /assets` - Get all assets with pagination and filters
- `GET /assets/:id` - Get asset details
- `POST /assets` - Create new asset
- `PUT /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset
- `POST /assets/bulk-upload` - Bulk import assets from CSV
- `POST /assets/:id/retire` - Retire an asset
- `POST /assets/:id/reactivate` - Reactivate a retired asset

#### **Assignment Management**
- `GET /assignments` - Get all assignments
- `GET /assignments/active` - Get active assignments
- `POST /assignments` - Issue asset to employee
- `POST /assignments/:id/return` - Collect asset from employee

#### **Maintenance Management**
- `GET /maintenance` - Get maintenance schedules
- `GET /maintenance/:id` - Get maintenance details
- `POST /maintenance` - Schedule new maintenance
- `PUT /maintenance/:id` - Update maintenance
- `POST /maintenance/:id/complete` - Mark maintenance as complete
- `POST /maintenance/:id/cancel` - Cancel maintenance

#### **Employee Management**
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee details
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee
- `POST /employees/bulk-upload` - Bulk import employees

#### **Vendor Management**
- `GET /vendors` - Get all vendors
- `GET /vendors/:id` - Get vendor details
- `POST /vendors` - Create new vendor
- `PUT /vendors/:id` - Update vendor
- `DELETE /vendors/:id` - Delete vendor

#### **Reports**
- `GET /reports/assets` - Asset inventory report
- `GET /reports/assignments` - Assignment report
- `GET /reports/maintenance` - Maintenance report
- `POST /reports/export` - Export custom report

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5173
   lsof -ti:5173 | xargs kill -9
   ```

2. **Node Version Issues**
   ```bash
   # Use Node Version Manager
   nvm use 16
   ```

3. **Dependency Conflicts**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode
Enable debug mode in development:
```env
VITE_ENABLE_DEBUG=true
```

## 📚 Documentation

- **Vue 3 Documentation**: https://vuejs.org/
- **Vite Documentation**: https://vitejs.dev/
- **Bootstrap Documentation**: https://getbootstrap.com/
- **Pinia Documentation**: https://pinia.vuejs.org/

## 🤝 Contributing

### Development Guidelines
- Follow Vue 3 Composition API best practices
- Maintain TypeScript strict mode compliance
- Write self-documenting code with appropriate comments
- Ensure accessibility standards compliance
- Test on multiple devices and browsers
- Follow our coding standards outlined in project configuration
- Write comprehensive unit tests for new components
- Ensure responsive design compatibility across devices

## 🙏 Acknowledgments

Special thanks to the Mindstix Foundation team for their contributions to making Pebble Asset Tracker a reality.

---

## 🎓 Meet the Team

### 👨‍💻 **Project Team**

- **Project Idea** - Roshan Kulkarni, CEO of Mindstix Software Labs
- **Project Manager** - Siddhant Raut
- **Developers** - Uday Narsale & Nishant Bondre

## 🔗 Related Repositories

- **⚙️ Backend Repository**: [Pebble Asset Tracker Backend](../asset-mgt-be) - NestJS API server providing robust backend services

---

**Part of the Mindstix Foundation Asset Management Platform**  
*Simplifying asset management, empowering organizations, one asset at a time.*
