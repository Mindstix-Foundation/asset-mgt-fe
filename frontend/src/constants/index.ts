// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  ASSETS: {
    LIST: '/assets',
    CREATE: '/assets',
    UPDATE: (id: string) => `/assets/${id}`,
    DELETE: (id: string) => `/assets/${id}`,
    ASSIGN: (id: string) => `/assets/${id}/assign`,
    UNASSIGN: (id: string) => `/assets/${id}/unassign`,
  },
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
  },
  VENDORS: {
    LIST: '/vendors',
    CREATE: '/vendors',
    UPDATE: (id: string) => `/vendors/${id}`,
    DELETE: (id: string) => `/vendors/${id}`,
  },
  MAINTENANCE: {
    LIST: '/maintenance',
    CREATE: '/maintenance',
    UPDATE: (id: string) => `/maintenance/${id}`,
    DELETE: (id: string) => `/maintenance/${id}`,
  },
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    ASSETS: '/reports/assets',
    EMPLOYEES: '/reports/employees',
    EXPORT: '/reports/export',
  },
};

// Application constants
export const APP_CONFIG = {
  NAME: 'TrackStix',
  VERSION: '1.0.0',
  DESCRIPTION: 'Mindful asset management by Mindstix',
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
};

// Asset categories and their properties
export const ASSET_CATEGORIES = {
  laptop: {
    label: 'Laptop',
    icon: 'laptop',
    specifications: ['ram', 'storage', 'processor', 'os', 'screenSize'],
  },
  monitor: {
    label: 'Monitor',
    icon: 'monitor',
    specifications: ['screenSize', 'resolution', 'refreshRate'],
  },
  mobile: {
    label: 'Mobile',
    icon: 'smartphone',
    specifications: ['os', 'storage', 'ram', 'screenSize'],
  },
  tablet: {
    label: 'Tablet',
    icon: 'tablet',
    specifications: ['os', 'storage', 'ram', 'screenSize'],
  },
  ipad: {
    label: 'iPad',
    icon: 'tablet',
    specifications: ['storage', 'ram', 'screenSize', 'generation'],
  },
  accessories: {
    label: 'Accessories',
    icon: 'package',
    specifications: ['type', 'compatibility'],
  },
};

// Status configurations
export const STATUS_CONFIG = {
  asset: {
    available: { label: 'Available', color: 'green', icon: 'check-circle' },
    in_use: { label: 'In Use', color: 'blue', icon: 'user' },
    under_repair: { label: 'Under Repair', color: 'yellow', icon: 'wrench' },
    retired: { label: 'Retired', color: 'red', icon: 'archive' },
  },
  employee: {
    active: { label: 'Active', color: 'green', icon: 'check-circle' },
    inactive: { label: 'Inactive', color: 'gray', icon: 'x-circle' },
    on_leave: { label: 'On Leave', color: 'yellow', icon: 'clock' },
    maternity_leave: { label: 'Maternity Leave', color: 'purple', icon: 'heart' },
    sabbatical_leave: { label: 'Sabbatical Leave', color: 'blue', icon: 'book' },
  },
  maintenance: {
    scheduled: { label: 'Scheduled', color: 'blue', icon: 'calendar' },
    in_progress: { label: 'In Progress', color: 'yellow', icon: 'loader' },
    completed: { label: 'Completed', color: 'green', icon: 'check-circle' },
    cancelled: { label: 'Cancelled', color: 'red', icon: 'x-circle' },
  },
};

// User roles and permissions
export const USER_ROLES = {
  admin: {
    label: 'Administrator',
    permissions: ['*'],
    color: 'red',
  },
  hr: {
    label: 'HR',
    permissions: ['read:assets', 'read:employees', 'read:reports'],
    color: 'blue',
  },
};

// Navigation menu items
export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'layout-dashboard',
    roles: ['admin', 'hr'],
  },
  {
    name: 'Assets',
    path: '/assets',
    icon: 'laptop',
    roles: ['admin', 'hr'],
  },
  {
    name: 'Employees',
    path: '/employees',
    icon: 'users',
    roles: ['admin', 'hr'],
  },
  {
    name: 'Vendors',
    path: '/vendors',
    icon: 'building',
    roles: ['admin'],
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: 'package',
    roles: ['admin', 'hr'],
  },
  {
    name: 'Maintenance',
    path: '/maintenance',
    icon: 'wrench',
    roles: ['admin'],
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: 'bar-chart',
    roles: ['admin', 'hr'],
  },
];

// Form validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  employeeId: /^[A-Za-z0-9]{3,10}$/,
  assetId: /^[A-Za-z0-9]{3,15}$/,
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
};

// Export formats
export const EXPORT_FORMATS = {
  EXCEL: 'xlsx',
  PDF: 'pdf',
  CSV: 'csv',
}; 