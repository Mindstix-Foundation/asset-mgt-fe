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
                <button class="btn btn-modern btn-success" @click="downloadTemplate('excel')" data-bs-toggle="tooltip" title="Download the Excel (.xlsx) template with correct column format">
                  <i class="fas fa-file-excel me-2"></i>Excel Template
                </button>
              </div>
            </div>
            <p class="text-muted small mb-0">Download our template to ensure your data is formatted correctly before uploading.</p>
          </div>

          <!-- Required Columns Info -->
          <div class="required-columns-section mb-4">
            <h6 class="mb-3" style="color: var(--text-primary);">
              <i class="fas fa-list-check me-2" style="color: var(--secondary-green);"></i>Required Columns (in this order)
            </h6>
            <div class="columns-sequence columns-excel">
              <div class="excel-cell" v-for="column in columns" :key="column.key">{{ column.label }}</div>
            </div>
            <p class="sequence-note mt-2">
              <i class="fas fa-info-circle me-1" style="color: var(--secondary-purple);"></i>
              <small class="text-muted">Make sure your spreadsheet columns follow this exact sequence</small>
            </p>
          </div>

          <!-- Step 2: Upload File -->
          <div class="mb-4">
            <h6 class="mb-3" style="color: var(--text-primary);">
              <i class="fas fa-upload me-2" style="color: var(--secondary-purple);"></i>Step 2: Upload File
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
              <div 
                v-for="(msg, i) in validationMessages" 
                :key="i" 
                :class="[msg.toLowerCase().startsWith('no errors') ? 'validation-success' : 'validation-error', 'mb-2']"
              >
                <i :class="msg.toLowerCase().startsWith('no errors') ? 'fas fa-check-circle me-2' : 'fas fa-exclamation-triangle me-2'"></i>{{ msg }}
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
              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>#</th>
                      <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in preview" :key="idx">
                      <td>{{ row._row }}</td>
                      <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
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
          <button type="button" class="btn btn-modern btn-primary" :disabled="!rows.length || hasPreviewErrors" @click="handleUpload">
            <i class="fas fa-upload me-2"></i>{{ uploadButtonText }}
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
  upload: [data: any[]]
  templateDownload: [type: 'csv' | 'excel']
}>()

// Reactive data
const fileName = ref('')
const fileSize = ref('')
const validationMessages = ref<string[]>([])
const rows = ref<any[]>([])
const preview = ref<any[]>([])
const uploading = ref(false)
const progress = ref(0)

// Computed
const hasPreviewErrors = computed(() => {
  return validationMessages.value.some(m => !m.toLowerCase().startsWith('no errors'))
})

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
  
  fileName.value = file.name
  fileSize.value = (file.size / 1024).toFixed(1) + ' KB'

  const reader = new FileReader()
  if (file.name.endsWith('.xlsx') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const csv = XLSX.utils.sheet_to_csv(worksheet)
      parseCsv(csv)
    }
    reader.readAsArrayBuffer(file)
  } else {
    reader.onload = () => {
      const text = reader.result as string
      parseCsv(text)
    }
    reader.readAsText(file)
  }
}

const parseCsv = (text: string) => {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length)
  if (lines.length < 2) {
    validationMessages.value.push('No data rows found in file.')
    return
  }
  
  const header = lines[0].split(',').map(h => h.trim().toLowerCase())
  const expected = props.columns.map(col => col.label.toLowerCase())
  
  if (expected.some((h, i) => (header[i] || '') !== h)) {
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
  
  // Aggregate all errors across the entire file
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
    validationMessages.value = ['No errors found in the file. You can proceed to upload.']
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
    
    // Send valid rows (only rows without errors)
    const validRows = rows.value.filter(r => !r._errors || r._errors.length === 0)
    if (!validRows.length) {
      validationMessages.value.push('No valid rows to upload. Please fix errors and try again.')
      return
    }
    
    // Clean up data - remove internal fields
    const cleanData = validRows.map(row => {
      const { _row, _errors, ...cleanRow } = row
      return cleanRow
    })
    
    progress.value = 100
    
    // Emit the upload event
    emit('upload', cleanData)
    
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
  removeFile()
  validationMessages.value = []
  uploading.value = false
  progress.value = 0
  
  const el = document.getElementById(props.modalId)
  if (el) {
    const modal = Modal.getInstance(el) || new Modal(el)
    modal.show()
  }
}

// Expose methods to parent
defineExpose({
  openModal
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

/* Excel-like header cells */
.columns-excel {
  gap: 0 !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.375rem !important;
  overflow: hidden !important;
  width: 100% !important;
}

.columns-excel .excel-cell {
  background-color: #f8fafc !important; /* subtle header gray */
  border-right: 1px solid var(--element-gray) !important;
  padding: 0.5rem 0.75rem !important;
  font-weight: 600 !important;
  color: var(--primary-black) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  min-width: 120px !important;
  flex: 1 1 0 !important;
  display: flex !important;
  align-items: center !important;
}

.columns-excel .excel-cell:last-child {
  border-right: none !important;
}

/* Give the longer header a bit more space */
.columns-excel .excel-cell:nth-child(5) {
  min-width: 200px !important;
  flex: 2 1 0 !important;
}

.badge-preview {
  background-color: var(--secondary-green) !important;
  color: white !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  padding: 0.35rem 0.65rem !important;
  border-radius: 0.375rem !important;
}

/* Modal styling */
.modal-content {
  border: none !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  border-radius: 0.75rem !important;
}

.modal-header {
  background-color: var(--primary-light-gray) !important;
  border-bottom: 1px solid var(--element-gray) !important;
  border-radius: 0.75rem 0.75rem 0 0 !important;
}

.modal-body {
  background-color: var(--primary-white) !important;
  padding: 2rem !important;
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