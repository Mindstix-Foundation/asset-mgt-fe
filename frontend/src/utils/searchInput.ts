/**
 * Normalize employee name search input:
 * - no leading spaces
 * - collapse multiple spaces to one
 * - allow at most two words (one space between first and last name)
 */
export function normalizeEmployeeSearchInput(value: string): string {
  if (!value) return ''

  const noLeadingSpace = value.replace(/^\s+/, '')
  const singleSpaced = noLeadingSpace.replace(/\s{2,}/g, ' ')
  const parts = singleSpaced.split(' ').filter(Boolean)

  if (parts.length <= 2) return singleSpaced
  return parts.slice(0, 2).join(' ')
}
