// Robust date parsing for API dates that may come as "dd/MM/yyyy, HH:mm:ss"
// Falls back to native Date parsing for ISO strings

type DateInput = string | Date | undefined | null

function parseDdMmYyyy(datePart: string, timePart?: string): Date | null {
  const [dayStr, monthStr, yearStr] = datePart.split('/')
  const day = Number(dayStr)
  const month = Number(monthStr)
  const year = Number(yearStr)
  if (!day || !month || !year) return null

  let hours = 0
  let minutes = 0
  let seconds = 0

  if (timePart) {
    const [hStr, mStr, sStr] = timePart.split(':')
    hours = Number(hStr ?? 0)
    minutes = Number(mStr ?? 0)
    seconds = Number(sStr ?? 0)
  }

  // Construct in local time to match UI expectations
  return new Date(year, month - 1, day, hours, minutes, seconds)
}

export function parseApiDate(raw: DateInput): Date | null {
  if (!raw) return null
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw

  const str = String(raw).trim()
  // Try exact pattern: dd/MM/yyyy[, HH:mm:ss]
  // Example: "02/10/2025, 05:30:00" or "02/10/2025"
  const parts = str.split(',').map(s => s.trim())
  if (parts[0] && parts[0].includes('/') && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(parts[0])) {
    const date = parseDdMmYyyy(parts[0], parts[1])
    if (date && !Number.isNaN(date.getTime())) return date
  }

  // Fallback to native parsing (handles ISO 8601)
  const native = new Date(str)
  return Number.isNaN(native.getTime()) ? null : native
}

export function formatDateOnly(raw: DateInput, locale: string = 'en-US'): string {
  const date = parseApiDate(raw)
  if (!date) return '-'
  
  // Format as DD/MM/YYYY for consistency
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

export function formatDateTime(raw: DateInput, locale: string = 'en-US'): string {
  const date = parseApiDate(raw)
  if (!date) return '-'
  
  // Format as DD/MM/YYYY HH:mm:ss for consistency
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export function formatDateForInput(raw: DateInput): string {
  const date = parseApiDate(raw)
  if (!date) return ''
  return date.toISOString().split('T')[0] // Returns YYYY-MM-DD format
}


