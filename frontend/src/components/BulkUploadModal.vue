<template>
  <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="`${modalId}Label`" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content bulk-upload-modal">
        <div class="modal-header">
          <h5 class="modal-title" :id="`${modalId}Label`" style="color: var(--text-primary);">
            <i class="fas fa-file-excel me-2" style="color: var(--secondary-purple);"></i>{{ title }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Step 1: Template Download -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0" style="color: var(--primary-black);">
                <i class="fas fa-download me-2" style="color: var(--secondary-purple);"></i>Step 1: Download Template
              </h6>
              <div class="d-flex gap-2">
                <button class="btn btn-modern btn-outline-secondary" @click="downloadTemplate('csv')" data-bs-toggle="tooltip" title="Download the CSV template with correct column format">
                  <i class="fas fa-file-csv me-2"></i>CSV Template
                </button>
                <button class="btn btn-modern btn-outline-secondary" @click="downloadTemplate('excel')" data-bs-toggle="tooltip" title="Download the Excel (.xlsx) template with correct column format">
                  <i class="fas fa-file-excel me-2"></i>Excel Template
                </button>
              </div>
            </div>
            <p class="text-muted small mb-0">Download our template to ensure your data is formatted correctly before uploading.</p>
          </div>

          <!-- Required Columns Info -->
          <div class="asset-info-section-compact mb-4">
            <h6 class="section-title-compact">
              <i class="fas fa-list-check me-2"></i>Required Columns (in this order)
            </h6>
            <div class="columns-chips">
              <div class="column-chip" v-for="column in columns" :key="column.key" :class="{ required: column.required }">
                <span class="column-label">{{ column.label }}<span v-if="column.required">*</span></span>
              </div>
            </div>
            <p class="sequence-note mt-2">
              <i class="fas fa-info-circle me-1"></i>
              <small class="text-muted">Make sure your spreadsheet columns follow this exact sequence</small>
            </p>
          </div>

          <!-- Step 2: Upload File -->
          <div class="asset-info-section-compact mb-4">
            <h6 class="section-title-compact">
              <i class="fas fa-upload me-2"></i>Step 2: Upload File
            </h6>

            <div 
              class="upload-area" 
              :id="`${modalId}UploadArea`" 
              @click="triggerBrowse" 
              @dragover.prevent="onDragOver" 
              @dragleave.prevent="onDragLeave" 
              @drop.prevent="onFileDrop"
            >
              <div class="upload-content">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <h6 class="upload-title">Drag & drop your file here</h6>
                <p class="upload-subtitle">or click to browse</p>
                <div class="supported-formats">
                  <span class="format-badge">CSV (.csv)</span>
                  <span class="format-badge">Excel (.xlsx)</span>
                </div>
              </div>
              <input 
                type="file" 
                :id="`${modalId}File`" 
                class="file-input" 
                accept=".csv,.xlsx" 
                :aria-label="`Choose ${entityName} file`" 
                @change="onFileSelect"
              >
            </div>

            <!-- File Info -->
            <div class="file-info" v-if="fileName" style="margin-top: 0.75rem;">
              <div class="d-flex align-items-center justify-content-between p-3" style="background-color: var(--primary-light-gray); border-radius: 0.5rem; border: 1px solid var(--element-gray);">
                <div class="d-flex align-items-center">
                  <i class="fas fa-file-csv me-2" style="color: var(--secondary-green);"></i>
                  <div>
                    <div class="fw-semibold" style="color: var(--primary-black);">{{ fileName }}</div>
                    <small class="text-muted">{{ fileSize }}</small>
                  </div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" @click="removeFile" data-bs-toggle="tooltip" title="Remove file">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <!-- Validation Messages -->
            <div class="validation-messages mt-3" v-if="validationMessages.length">
              <!-- Summary Line (Red Info Tag) -->
              <div 
                v-if="validationMessages[0] && validationMessages[0].toLowerCase().includes('validation failed')"
                class="validation-summary mb-3"
              >
                <i class="fas fa-exclamation-triangle me-2"></i>{{ validationMessages[0] }}
              </div>
              
              <!-- Success Message -->
              <div 
                v-else-if="validationMessages[0] && (validationMessages[0].toLowerCase().includes('no errors') || validationMessages[0].includes('✅'))"
                class="validation-success mb-2"
              >
                <i class="fas fa-check-circle me-2"></i>{{ validationMessages[0] }}
              </div>
              
              <!-- Detailed Error Messages (Normal Text) -->
              <div 
                v-if="validationMessages.length > 1"
                class="validation-details"
              >
                <div 
                  v-for="(msg, i) in validationMessages.slice(1)" 
                  :key="i" 
                  class="validation-detail-item"
                >
                  {{ msg }}
                </div>
              </div>
              
              <!-- View All Errors Button -->
              <div v-if="validationComplete && hasValidationErrors && allValidationErrors.length > 5" class="mt-2">
                <button 
                  type="button" 
                  class="btn btn-sm btn-outline-danger" 
                  @click="toggleShowAllErrors"
                >
                  <i :class="showAllErrors ? 'fas fa-eye-slash me-1' : 'fas fa-eye me-1'"></i>
                  {{ showAllErrors ? 'Show First 5 Errors' : `View All ${allValidationErrors.length} Errors` }}
                </button>
              </div>
            </div>

            <!-- Preview Table (first 5 rows) -->
            <div class="mt-3" v-if="preview.length">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="color: var(--primary-black);">Preview (first 5 rows)</h6>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge badge-preview">
                    <i class="fas fa-eye me-1"></i>Showing {{ Math.min(5, rows.length) }} of {{ rows.length }}
                  </span>
                </div>
              </div>
              <div class="table-responsive preview-table-container">
                <table class="table table-sm mb-0 preview-table" style="min-width: 1200px;">
                  <thead class="table-light">
                    <tr>
                      <th class="row-number-col">#</th>
                      <th 
                        v-for="column in columns" 
                        :key="column.key"
                        :class="getColumnClass(column.key)"
                      >
                        {{ column.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in preview" :key="idx">
                      <td class="row-number-col">{{ row._row }}</td>
                      <td 
                        v-for="column in columns" 
                        :key="column.key"
                        :class="getColumnClass(column.key)"
                        :title="row[column.key]"
                      >
                        {{ formatCellValue(row[column.key], column.key) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Upload Progress -->
            <div class="upload-progress mt-3" v-if="uploading">
              <div class="d-flex align-items-center mb-2">
                <i class="fas fa-spinner fa-spin me-2" style="color: var(--secondary-purple);"></i>
                <span style="color: var(--primary-black);">Processing your file...</span>
              </div>
              <div class="progress">
                <div class="progress-bar" role="progressbar" :style="{ width: progress + '%' , backgroundColor: 'var(--secondary-purple)'}" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-modern btn-outline-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-modern btn-primary" 
            :disabled="!rows.length || isValidating || (validationComplete && hasValidationErrors)" 
            @click="handleUpload"
          >
            <i v-if="isValidating" class="fas fa-spinner fa-spin me-2"></i>
            <i v-else class="fas fa-upload me-2"></i>
            {{ 
              isValidating ? 'Validating...' : 
              validationComplete && hasValidationErrors ? 'Fix Errors First' :
              validationComplete && !hasValidationErrors ? 'Upload Assets' :
              uploadButtonText 
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Modal } from 'bootstrap'
import * as XLSX from 'xlsx'

// Props
interface Column {
  key: string
  label: string
  required?: boolean
  validation?: (value: string) => string | null
}

interface Props {
  modalId: string
  title: string
  entityName: string
  columns: Column[]
  templateData?: any[]
  uploadButtonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  uploadButtonText: 'Upload Data',
  templateData: () => []
})

// Emits
const emit = defineEmits<{
  upload: [file: File]
  templateDownload: [type: 'csv' | 'excel']
  validate: [file: File]
}>()

// Reactive data
const fileName = ref('')
const fileSize = ref('')
const validationMessages = ref<string[]>([])
const rows = ref<any[]>([])
const preview = ref<any[]>([])
const uploading = ref(false)
const progress = ref(0)
const selectedFile = ref<File | null>(null)
const isValidating = ref(false)
const validationComplete = ref(false)
const hasValidationErrors = ref(false)
const allValidationErrors = ref<any[]>([])
const showAllErrors = ref(false)

// Computed properties can be added here if needed

// Methods
const downloadTemplate = (type: 'csv' | 'excel') => {
  if (type === 'csv') {
    downloadCsvTemplate()
  } else {
    downloadExcelTemplate()
  }
  emit('templateDownload', type)
}

const downloadCsvTemplate = () => {
  const headers = props.columns.map(col => col.label).join(',')
  const sampleData = props.templateData.length > 0 
    ? props.templateData.map(row => props.columns.map(col => row[col.key] || '').join(',')).join('\n')
    : ''
  
  const csv = headers + (sampleData ? '\n' + sampleData : '\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${props.entityName.toLowerCase()}_upload_template.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadExcelTemplate = () => {
  try {
    const headers = [props.columns.map(col => col.label)]
    if (props.templateData.length > 0) {
      headers.push(...props.templateData.map(row => props.columns.map(col => row[col.key] || '')))
    }
    
    const worksheet = XLSX.utils.aoa_to_sheet(headers)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    
    // Set column widths for readability
    worksheet['!cols'] = props.columns.map(() => ({ wch: 15 }))
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${props.entityName.toLowerCase()}_upload_template.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    console.warn('Excel template generation failed', e)
  }
}

const onDragOver = () => {
  document.getElementById(`${props.modalId}UploadArea`)?.classList.add('dragover')
}

const onDragLeave = () => {
  document.getElementById(`${props.modalId}UploadArea`)?.classList.remove('dragover')
}

const onFileDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files[0]
  if (file) handleFile(file)
}

const triggerBrowse = () => {
  const input = document.getElementById(`${props.modalId}File`) as HTMLInputElement
  input?.click()
}

const onFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) handleFile(file)
}

const removeFile = () => {
  fileName.value = ''
  fileSize.value = ''
  validationMessages.value = []
  rows.value = []
  preview.value = []
  selectedFile.value = null
  isValidating.value = false
  validationComplete.value = false
  hasValidationErrors.value = false
  allValidationErrors.value = []
  showAllErrors.value = false
  const input = document.getElementById(`${props.modalId}File`) as HTMLInputElement
  if (input) input.value = ''
  document.getElementById(`${props.modalId}UploadArea`)?.classList.remove('dragover')
}

const handleFile = (file: File) => {
  validationMessages.value = []
  
  if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && 
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
      !file.name.endsWith('.xlsx')) {
    validationMessages.value.push('Invalid file type. Please upload a CSV (.csv) or Excel (.xlsx) file.')
    return
  }
  
  selectedFile.value = file
  fileName.value = file.name
  fileSize.value = (file.size / 1024).toFixed(1) + ' KB'

  const reader = new FileReader()
  if (file.name.endsWith('.xlsx') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const csv = XLSX.utils.sheet_to_csv(worksheet)
      await parseCsv(csv)
    }
    reader.readAsArrayBuffer(file)
  } else {
    reader.onload = async () => {
      const text = reader.result as string
      await parseCsv(text)
    }
    reader.readAsText(file)
  }
}

const parseCsv = async (text: string) => {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length)
  if (lines.length < 2) {
    validationMessages.value.push('No data rows found in file.')
    return
  }
  
  const header = lines[0].split(',').map(h => h.trim().toLowerCase())
  const expected = props.columns.map(col => col.label.toLowerCase())
  
  // Check if headers match exactly (case-insensitive)
  const headerMatches = expected.every((expectedHeader, i) => 
    (header[i] || '').toLowerCase() === expectedHeader.toLowerCase()
  )
  
  if (!headerMatches) {
    validationMessages.value.push(`Invalid header order. Expected: ${props.columns.map(col => col.label).join(', ')}`)
  }
  
  const parsedRows = lines.slice(1).map((line, idx) => {
    const cols = line.split(',')
    const row: any = {
      _row: idx + 1,
      _errors: []
    }
    
    // Map columns to row data
    props.columns.forEach((column, colIdx) => {
      row[column.key] = (cols[colIdx] || '').trim()
    })
    
    // Validate each column
    props.columns.forEach(column => {
      const value = row[column.key]
      
      // Required field validation
      if (column.required && !value) {
        row._errors.push(`${column.label} required`)
      }
      
      // Custom validation
      if (column.validation && value) {
        const error = column.validation(value)
        if (error) {
          row._errors.push(error)
        }
      }
    })
    
    return row
  })
  
  rows.value = parsedRows
  preview.value = parsedRows.slice(0, 5)
  
  // Generic duplicate checking (no asset-specific logic)
  checkDuplicates(parsedRows)
  
  // Show basic validation results
  const allErrors: string[] = []
  parsedRows.forEach(r => {
    if (r._errors && r._errors.length) {
      allErrors.push(`Row ${r._row}: ${r._errors.join('; ')}`)
    }
  })
  
  // Reset and show aggregated messages (keep header issues too)
  const headerMsgs = validationMessages.value.filter(m => 
    m.toLowerCase().startsWith('invalid header') || 
    m.toLowerCase().startsWith('no data rows')
  )
  
  if (allErrors.length) {
    validationMessages.value = headerMsgs.concat(allErrors)
  } else {
    // If basic validation passes, trigger comprehensive validation immediately
    validationMessages.value = ['File format is valid. Running comprehensive validation...']
    triggerComprehensiveValidation()
  }
}

// Trigger comprehensive validation via parent component
const triggerComprehensiveValidation = async () => {
  if (!selectedFile.value) return
  
  isValidating.value = true
  validationComplete.value = false
  hasValidationErrors.value = false
  
  try {
    // Emit validation event to parent component
    emit('validate', selectedFile.value)
  } catch (error) {
    console.error('Validation trigger error:', error)
    validationMessages.value = ['Error triggering validation. Please try again.']
    isValidating.value = false
  }
}

// Method to handle validation results from parent component
const handleValidationResult = (result: any) => {
  isValidating.value = false
  validationComplete.value = true
  
  if (result.errors && result.errors.length > 0) {
    hasValidationErrors.value = true
    allValidationErrors.value = result.errors
    showAllErrors.value = false
    
    const errorMessages = result.errors.slice(0, 5).map((error: any) => 
      `Row ${error.row} (${error.field}): ${error.message}`
    )
    
    validationMessages.value = [
      `Validation failed: Found ${result.errors.length} error${result.errors.length > 1 ? 's' : ''} in ${result.totalRows || 0} row${result.totalRows > 1 ? 's' : ''}`,
      ...errorMessages
    ]
  } else {
    hasValidationErrors.value = false
    allValidationErrors.value = []
    showAllErrors.value = false
    validationMessages.value = ['No errors found in file and data. Click "Upload Assets" to proceed.']
  }
}

// Toggle showing all errors
const toggleShowAllErrors = () => {
  showAllErrors.value = !showAllErrors.value
  
  // Always keep the summary line as the first message
  const summaryLine = `Validation failed: Found ${allValidationErrors.value.length} error${allValidationErrors.value.length > 1 ? 's' : ''} in ${allValidationErrors.value.length} row${allValidationErrors.value.length > 1 ? 's' : ''}`
  
  if (showAllErrors.value) {
    // Show all errors
    const allErrorMessages = allValidationErrors.value.map((error: any) => 
      `Row ${error.row} (${error.field}): ${error.message}`
    )
    
    validationMessages.value = [
      summaryLine,
      ...allErrorMessages
    ]
  } else {
    // Show only first 5 errors
    const errorMessages = allValidationErrors.value.slice(0, 5).map((error: any) => 
      `Row ${error.row} (${error.field}): ${error.message}`
    )
    
    validationMessages.value = [
      summaryLine,
      ...errorMessages
    ]
  }
}

// Get column CSS class for dynamic styling
const getColumnClass = (columnKey: string) => {
  const baseClass = 'text-truncate'
  
  // Define column-specific classes for better layout
  const columnClasses: Record<string, string> = {
    'assetId': 'col-asset-id',
    'serialNumber': 'col-serial-number', 
    'assetTypeId': 'col-asset-type',
    'brandId': 'col-brand',
    'modelId': 'col-model',
    'vendorId': 'col-vendor',
    'status': 'col-status',
    'condition': 'col-condition',
    'location': 'col-location',
    'purchaseDate': 'col-date',
    'purchaseCost': 'col-cost',
    'warrantyStartDate': 'col-date',
    'warrantyEndDate': 'col-date',
    'notes': 'col-notes'
  }
  
  return `${baseClass} ${columnClasses[columnKey] || 'col-default'}`
}

// Format cell values for better display
const formatCellValue = (value: any, columnKey: string) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  
  // Format specific column types
  switch (columnKey) {
    case 'purchaseCost':
      return typeof value === 'number' ? `₹${value.toLocaleString()}` : value
    case 'purchaseDate':
    case 'warrantyStartDate':
    case 'warrantyEndDate':
      return value // Already formatted as DD-MM-YYYY
    default:
      return value
  }
}

// Check for duplicate values within the file (generic)
const checkDuplicates = (rows: any[]) => {
  // This is a generic duplicate checker - specific implementations can be added by parent components
  const duplicates: string[] = []
  
  // Check for duplicate values in any field that might be unique
  const fieldSets: Record<string, Set<string>> = {}
  
  rows.forEach(row => {
    // Check common unique fields
    const uniqueFields = ['assetId', 'serialNumber', 'id', 'code', 'name']
    
    uniqueFields.forEach(field => {
      if (row[field]) {
        if (!fieldSets[field]) {
          fieldSets[field] = new Set()
        }
        
        if (fieldSets[field].has(row[field])) {
          duplicates.push(`Row ${row._row}: Duplicate ${field} '${row[field]}'`)
        } else {
          fieldSets[field].add(row[field])
        }
      }
    })
  })
  
  if (duplicates.length > 0) {
    validationMessages.value.push(...duplicates)
  }
}

const handleUpload = async () => {
  uploading.value = true
  progress.value = 15
  
  try {
    // Simulate progressive upload
    const step = () => new Promise(r => setTimeout(r, 250))
    for (let p = 15; p <= 90; p += 15) { 
      await step()
      progress.value = p 
    }
    
    // Always emit the file for comprehensive validation
    // The parent component (BulkAssetUpload) will handle detailed validation
    if (!selectedFile.value) {
      validationMessages.value.push('No file selected for upload.')
      return
    }
    
    progress.value = 100
    
    // Emit the upload event with the original file
    console.log('BulkUploadModal: Emitting file:', selectedFile.value.name, selectedFile.value.size)
    emit('upload', selectedFile.value)
    
    // Close modal
    const modalEl = document.getElementById(props.modalId)
    if (modalEl) {
      const modal = Modal.getInstance(modalEl) || new Modal(modalEl)
      modal.hide()
    }
    
    // Reset state
    removeFile()
    
  } catch (e) {
    validationMessages.value.push('Upload failed. Please try again.')
  } finally {
    uploading.value = false
    progress.value = 0
  }
}

// Public methods for parent component
const openModal = () => {
  console.log('BulkUploadModal: openModal called for modalId:', props.modalId)
  removeFile()
  validationMessages.value = []
  uploading.value = false
  progress.value = 0
  
  const el = document.getElementById(props.modalId)
  if (el) {
    const modal = Modal.getInstance(el) || new Modal(el)
    modal.show()
    console.log('BulkUploadModal: Modal shown')
  } else {
    console.error('BulkUploadModal: Modal element not found:', props.modalId)
  }
}

// Expose methods to parent
defineExpose({
  openModal,
  handleValidationResult
})
</script>

<style scoped>
/* Bulk Upload - Drag and Drop area styled with theme */
.upload-area {
  position: relative !important;
  border: 2px dashed var(--element-gray) !important;
  background-color: var(--primary-light-gray) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
  text-align: center !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.upload-area:hover, .upload-area.dragover {
  background-color: var(--primary-white) !important;
  border-color: var(--secondary-purple) !important;
  box-shadow: 0 0 0 0.25rem rgba(51, 31, 234, 0.12) !important;
}

.upload-content .upload-icon {
  font-size: 2rem !important;
  color: var(--secondary-purple) !important;
  margin-bottom: 0.5rem !important;
}

.upload-title {
  color: var(--text-primary) !important;
  margin-bottom: 0.25rem !important;
  font-weight: 600 !important;
}

.upload-subtitle {
  color: var(--primary-mid-gray) !important;
  margin-bottom: 0.5rem !important;
}

.supported-formats .format-badge {
  display: inline-block !important;
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  color: var(--primary-dark-gray) !important;
  border-radius: 0.5rem !important;
  padding: 0.25rem 0.5rem !important;
  margin-right: 0.25rem !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
}

.file-input {
  position: absolute !important;
  inset: 0 !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Validation message colors using palette */
.validation-error {
  color: var(--secondary-red) !important;
  background-color: rgba(233, 118, 118, 0.08) !important;
  border: 1px solid rgba(233, 118, 118, 0.25) !important;
  border-radius: 0.5rem !important;
  padding: 0.5rem 0.75rem !important;
  font-weight: 500 !important;
}

.validation-success {
  color: var(--secondary-green) !important;
  background-color: rgba(33, 175, 101, 0.08) !important;
  border: 1px solid rgba(33, 175, 101, 0.25) !important;
  border-radius: 0.5rem !important;
  padding: 0.5rem 0.75rem !important;
  font-weight: 500 !important;
}

/* Validation Summary (Red Info Tag) */
.validation-summary {
  color: var(--secondary-red) !important;
  background-color: rgba(233, 118, 118, 0.08) !important;
  border: 1px solid rgba(233, 118, 118, 0.25) !important;
  border-radius: 0.5rem !important;
  padding: 0.5rem 0.75rem !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
}

/* Validation Details (Normal Text) */
.validation-details {
  background-color: var(--primary-light-gray) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.375rem !important;
  padding: 0.75rem !important;
  margin-top: 0.5rem !important;
}

.validation-detail-item {
  color: var(--primary-dark-gray) !important;
  font-size: 0.85rem !important;
  line-height: 1.4 !important;
  margin-bottom: 0.25rem !important;
  padding: 0.125rem 0 !important;
}

.validation-detail-item:last-child {
  margin-bottom: 0 !important;
}

/* Required Columns sequence: horizontal boxed items like Excel headers */
.columns-sequence {
  display: flex !important;
  align-items: stretch !important;
  gap: 0.5rem !important;
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  padding: 0.25rem 0 !important;
  scrollbar-width: thin !important;
}

.columns-sequence .column-item {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 150px !important;
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  padding: 0.75rem !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
}

/* Asset info section compact - matching AssetsView modal design */
.asset-info-section-compact {
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--element-gray);
  border-radius: 0.5rem;
  background-color: var(--primary-light-gray);
  display: flex;
  flex-direction: column;
}

.asset-info-section-compact .section-title-compact {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: var(--primary-dark-gray) !important;
  margin-bottom: 0.5rem !important;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid var(--element-gray);
}

/* Chip-based layout for columns */
.columns-chips {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  border: none !important;
  border-radius: 0 !important;
}

.column-chip {
  display: inline-flex !important;
  align-items: center !important;
  padding: 0.25rem 0.5rem !important;
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  color: var(--primary-black) !important;
  white-space: nowrap !important;
  transition: all 0.2s ease !important;
  margin-bottom: 0.25rem !important;
}

.column-chip:hover {
  background-color: var(--element-light-gray) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.column-label {
  font-weight: 500 !important;
  margin: 0 !important;
}

.column-label span {
  color: var(--secondary-red) !important;
  font-weight: bold !important;
  margin-left: 0.125rem !important;
}

/* Sequence note styling - matching AssetsView modal design */
.sequence-note {
  font-size: 0.875rem !important;
  color: var(--primary-mid-gray) !important;
  margin-top: 0.5rem !important;
  margin-bottom: 0 !important;
}

.sequence-note i {
  color: var(--primary-mid-gray) !important;
}

.badge-preview {
  background-color: var(--secondary-green) !important;
  color: white !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

.badge-scroll-hint {
  background-color: var(--secondary-orange) !important;
  color: white !important;
  font-size: 0.7rem !important;
  font-weight: 500 !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.375rem !important;
  animation: pulse 2s infinite !important;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Dynamic Preview Table Styling */
.preview-table-container {
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.5rem !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  max-width: 100% !important;
}

.preview-table {
  margin-bottom: 0 !important;
  table-layout: fixed !important;
  width: 100% !important;
}

.preview-table th,
.preview-table td {
  padding: 0.5rem 0.75rem !important;
  border-bottom: 1px solid var(--element-gray) !important;
  vertical-align: middle !important;
}

.preview-table th {
  background-color: var(--primary-light-gray) !important;
  font-weight: 600 !important;
  color: var(--primary-black) !important;
  font-size: 0.8rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.preview-table td {
  font-size: 0.8rem !important;
  color: var(--primary-dark-gray) !important;
}

/* Row number column */
.row-number-col {
  width: 50px !important;
  min-width: 50px !important;
  max-width: 50px !important;
  text-align: center !important;
  font-weight: 600 !important;
  background-color: var(--primary-light-gray) !important;
}

/* Dynamic column widths based on content type */
.col-asset-id {
  width: 120px !important;
  min-width: 120px !important;
  max-width: 120px !important;
  font-family: monospace !important;
  font-weight: 600 !important;
}

.col-serial-number {
  width: 140px !important;
  min-width: 140px !important;
  max-width: 140px !important;
  font-family: monospace !important;
}

.col-asset-type,
.col-brand,
.col-model,
.col-vendor {
  width: 100px !important;
  min-width: 100px !important;
  max-width: 100px !important;
}

.col-status,
.col-condition {
  width: 90px !important;
  min-width: 90px !important;
  max-width: 90px !important;
  text-align: center !important;
}

.col-location {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
}

.col-date {
  width: 110px !important;
  min-width: 110px !important;
  max-width: 110px !important;
  font-family: monospace !important;
  text-align: center !important;
}

.col-cost {
  width: 100px !important;
  min-width: 100px !important;
  max-width: 100px !important;
  text-align: right !important;
  font-family: monospace !important;
  font-weight: 600 !important;
}

.col-notes {
  width: 200px !important;
  min-width: 200px !important;
  max-width: 200px !important;
}

.col-default {
  width: 120px !important;
  min-width: 120px !important;
  max-width: 120px !important;
}

/* Text truncation for all columns */
.text-truncate {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .preview-table-container {
    font-size: 0.75rem !important;
  }
  
  .preview-table th,
  .preview-table td {
    padding: 0.375rem 0.5rem !important;
  }
  
  .row-number-col {
    width: 40px !important;
    min-width: 40px !important;
    max-width: 40px !important;
  }
  
  .col-asset-id,
  .col-serial-number,
  .col-location,
  .col-notes {
    width: 100px !important;
    min-width: 100px !important;
    max-width: 100px !important;
  }
  
  .col-asset-type,
  .col-brand,
  .col-model,
  .col-vendor,
  .col-status,
  .col-condition,
  .col-date,
  .col-cost {
    width: 80px !important;
    min-width: 80px !important;
    max-width: 80px !important;
  }
}

/* Modal styling */
.modal-content {
  border: none !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  border-radius: 0.75rem !important;
  max-width: 100% !important;
  overflow: hidden !important;
}

.modal-header {
  background-color: var(--primary-light-gray) !important;
  border-bottom: 1px solid var(--element-gray) !important;
  border-radius: 0.75rem 0.75rem 0 0 !important;
}

.modal-body {
  background-color: var(--primary-white) !important;
  padding: 2rem !important;
  max-width: 100% !important;
  overflow-x: hidden !important;
}

.modal-footer {
  background-color: var(--primary-light-gray) !important;
  border-top: 1px solid var(--element-gray) !important;
  padding: 1rem 1.5rem !important;
}

.modal-footer .btn {
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.modal-footer .btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}
</style> 