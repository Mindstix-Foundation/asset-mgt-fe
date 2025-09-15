// Core entity types
export interface Asset {
  id: string;
  assetId: string;
  name: string;
  category: AssetCategory;
  brand: string;
  model: string;
  serialNumber: string;
  specifications: AssetSpecifications;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  status: AssetStatus;
  assignedTo?: string; // Employee ID
  location?: string;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  department?: string;
  location?: string;
  joinDate?: Date;
  status: EmployeeStatus;
  assignedAssets: string[]; // Asset IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: VendorCategory;
  taxInfo?: string;
  performance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  vendorId?: string;
  issueDescription: string;
  startDate: Date;
  endDate?: Date;
  estimatedCost?: number;
  actualCost?: number;
  status: MaintenanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum AssetCategory {
  LAPTOP = 'laptop',
  MONITOR = 'monitor',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  IPAD = 'ipad',
  ACCESSORIES = 'accessories',
}

export enum AssetStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  UNDER_REPAIR = 'under_repair',
  RETIRED = 'retired',
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  MATERNITY_LEAVE = 'maternity_leave',
  SABBATICAL_LEAVE = 'sabbatical_leave',
}

export enum VendorCategory {
  SUPPLIER = 'supplier',
  SERVICE_PROVIDER = 'service_provider',
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Utility types
export interface AssetSpecifications {
  ram?: string;
  storage?: string;
  processor?: string;
  os?: string;
  screenSize?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FilterOptions {
  category?: AssetCategory;
  status?: AssetStatus;
  brand?: string;
  location?: string;
  department?: string;
}

// User and Authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
}

export interface Permission {
  resource: string;
  actions: string[];
} 