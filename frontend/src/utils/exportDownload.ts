/**
 * When axios uses responseType: 'blob', error bodies are also Blobs.
 * Parse JSON error payloads so callers can show EXPORT_TOO_LARGE / EXPORT_IN_PROGRESS messages.
 */
export async function parseBlobApiError(error: unknown): Promise<Error> {
  const axiosError = error as {
    response?: { data?: Blob | ArrayBuffer | string; status?: number }
    message?: string
  }

  const data = axiosError?.response?.data
  if (data instanceof Blob) {
    try {
      const text = await data.text()
      const json = JSON.parse(text) as {
        message?: string | string[]
        code?: string
        error?: string
      }
      const message = Array.isArray(json.message)
        ? json.message.join(', ')
        : json.message || json.error || 'Export failed'
      const err = new Error(message) as Error & {
        code?: string
        status?: number
      }
      err.code = json.code
      err.status = axiosError.response?.status
      return err
    } catch {
      // fall through
    }
  }

  if (typeof data === 'string') {
    try {
      const json = JSON.parse(data) as { message?: string; code?: string }
      const err = new Error(json.message || 'Export failed') as Error & {
        code?: string
      }
      err.code = json.code
      return err
    } catch {
      return new Error(data || axiosError.message || 'Export failed')
    }
  }

  return error instanceof Error
    ? error
    : new Error(axiosError?.message || 'Export failed')
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = globalThis.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  globalThis.URL.revokeObjectURL(url)
}

export function filenameFromContentDisposition(
  header: string | undefined,
  fallback: string,
): string {
  if (!header) return fallback
  const match = header.match(/filename="(.+)"/)
  return match?.[1] || fallback
}
