/**
 * Application Configuration
 * Central configuration for the Asset Management application
 */

export const appConfig = {
  // Application metadata
  app: {
    name: 'TrackStix',
    version: '1.0.0',
    description: 'Asset Management System',
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // Date/Time formats
  dateTime: {
    dateFormat: 'dd/MM/yyyy',
    dateTimeFormat: 'dd/MM/yyyy HH:mm:ss',
    displayFormat: 'DD MMM YYYY',
    inputFormat: 'YYYY-MM-DD',
  },

  // File upload limits
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedExtensions: ['.xlsx', '.xls', '.csv'],
    allowedMimeTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ],
  },

  // Toast notification defaults
  toast: {
    duration: 3000, // 3 seconds
    position: 'top-right',
  },

  // Search configuration
  search: {
    debounceMs: 300,
    minLength: 2,
    maxResults: 50,
  },

  // Table configuration
  table: {
    defaultSortOrder: 'asc' as const,
    rowsPerPage: 10,
  },

  // Feature flags
  features: {
    enableBulkUpload: true,
    enableExport: true,
    enableNotifications: true,
    enableAdvancedSearch: true,
  },
} as const

export default appConfig

