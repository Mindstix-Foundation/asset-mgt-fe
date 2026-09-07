<template>
  <div class="container-fluid px-3 py-4">
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h1 class="h4 mb-1">QR Scanner</h1>
        <p class="text-muted mb-0">
          Point your camera at an asset QR sticker to open its public info page.
        </p>
      </div>
      <button
        v-if="isScanning"
        type="button"
        class="btn btn-outline-secondary btn-sm"
        @click="stopScanning"
      >
        <i class="fas fa-stop me-1" aria-hidden="true"></i>
        Stop camera
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div v-if="permissionError" class="alert alert-warning mb-3" role="alert">
          <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
          {{ permissionError }}
        </div>

        <div v-if="scanError" class="alert alert-danger mb-3" role="alert">
          {{ scanError }}
        </div>

        <div v-if="!isScanning && !isStarting && !isScanningFile" class="scanner-start text-center py-4">
          <i class="fas fa-qrcode fa-3x text-muted mb-3" aria-hidden="true"></i>
          <p class="mb-3 text-muted">
            Scan an asset QR sticker with your camera, or upload a photo from your gallery/files.
          </p>
          <div class="d-flex flex-wrap justify-content-center gap-2">
            <button
              type="button"
              class="btn btn-green"
              :disabled="!secureContext"
              @click="startScanning"
            >
              <i class="fas fa-camera me-2" aria-hidden="true"></i>
              Allow camera &amp; start scanning
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              :disabled="isScanningFile"
              @click="triggerFilePick"
            >
              <i class="fas fa-image me-2" aria-hidden="true"></i>
              Upload from gallery / files
            </button>
          </div>
          <p v-if="!secureContext" class="text-danger small mt-3 mb-0">
            Live camera requires HTTPS (or localhost). You can still upload a photo to scan.
          </p>
        </div>

        <div v-if="isStarting || isScanningFile" class="text-center py-4" role="status">
          <div class="spinner-border text-secondary"></div>
          <p class="mt-3 mb-0 text-muted">
            {{ isScanningFile ? 'Reading QR code from image…' : 'Requesting camera permission…' }}
          </p>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          class="d-none"
          accept="image/*"
          @change="onFileSelected"
        />

        <!-- Keep mounted and sized while starting — display:none breaks getUserMedia -->
        <div
          id="qr-reader"
          class="qr-reader"
          :class="{ 'qr-reader--hidden': !isScanning && !isStarting && !isScanningFile }"
        ></div>

        <div
          v-if="isScanning"
          class="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3"
        >
          <select
            v-if="cameras.length > 1"
            class="form-select form-select-sm camera-select"
            :value="selectedCameraId"
            aria-label="Select camera"
            @change="onCameraChange"
          >
            <option v-for="cam in cameras" :key="cam.id" :value="cam.id">
              {{ cam.label || `Camera ${cam.id.slice(0, 8)}` }}
            </option>
          </select>
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            :disabled="isScanningFile"
            @click="triggerFilePick"
          >
            <i class="fas fa-image me-1" aria-hidden="true"></i>
            Upload photo instead
          </button>
        </div>

        <p v-if="isScanning" class="text-muted small text-center mt-3 mb-0">
          Align the QR code within the frame. Scanning stops once a valid asset code is found.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode'
import { fetchPublicAsset } from '@/services/api/publicAssetApi'

interface CameraDevice {
  id: string
  label: string
}

const router = useRouter()
const permissionError = ref('')
const scanError = ref('')
const isStarting = ref(false)
const isScanning = ref(false)
const isScanningFile = ref(false)
const cameras = ref<CameraDevice[]>([])
const selectedCameraId = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

let scanner: Html5Qrcode | null = null
let handled = false

const secureContext = computed(
  () => typeof window !== 'undefined' && window.isSecureContext,
)

const extractToken = (decodedText: string): string | null => {
  const text = decodedText.trim()
  try {
    const url = new URL(text)
    const match = url.pathname.match(/\/a\/([^/]+)\/?$/)
    if (match?.[1]) return decodeURIComponent(match[1])
  } catch {
    // Not a full URL — try path-only /a/{token}
  }

  const pathMatch = text.match(/(?:^|\/)a\/([A-Za-z0-9-]+)\/?$/)
  return pathMatch?.[1] ? decodeURIComponent(pathMatch[1]) : null
}

const mapCameraError = (err: unknown): string => {
  const anyErr = err as { name?: string; message?: string }
  const name = anyErr?.name || ''
  const message = (anyErr?.message || String(err || '')).toLowerCase()

  if (
    name === 'NotAllowedError' ||
    message.includes('permission') ||
    message.includes('notallowed') ||
    message.includes('denied') ||
    message.includes('permissions policy')
  ) {
    return 'Camera permission was blocked. Allow camera for this site in your browser settings (address-bar lock/camera icon), then try again.'
  }

  if (
    name === 'NotFoundError' ||
    message.includes('notfound') ||
    message.includes('no camera') ||
    message.includes('requested device not found')
  ) {
    return 'No camera was found on this device. Connect a camera or try on a phone/tablet.'
  }

  if (
    name === 'NotReadableError' ||
    message.includes('notreadable') ||
    message.includes('could not start video')
  ) {
    return 'Camera is in use by another app or tab. Close other camera apps and try again.'
  }

  if (
    name === 'OverconstrainedError' ||
    message.includes('overconstrained') ||
    message.includes('facingmode')
  ) {
    return 'This camera mode is not supported. Try selecting another camera from the list.'
  }

  if (!window.isSecureContext) {
    return 'Camera access requires HTTPS (or localhost).'
  }

  return `Unable to access the camera: ${anyErr?.message || 'unknown error'}. Allow camera permission in your browser and try again.`
}

const stopScanner = async () => {
  if (!scanner) return
  try {
    await scanner.stop()
  } catch {
    // ignore stop errors during teardown
  }
  try {
    scanner.clear()
  } catch {
    // ignore
  }
}

const pickPreferredCameraId = (devices: CameraDevice[]): string => {
  const back = devices.find((d) =>
    /back|rear|environment|world/i.test(d.label || ''),
  )
  return (back || devices[0]).id
}

const ensureScanner = () => {
  if (!scanner) {
    scanner = new Html5Qrcode('qr-reader', { verbose: false })
  }
  return scanner
}

const startWithCameraId = async (cameraId: string) => {
  const instance = ensureScanner()
  await instance.start(
    { deviceId: { exact: cameraId } },
    {
      fps: 10,
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        const edge = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.7)
        return { width: edge, height: edge }
      },
    },
    (decodedText) => {
      void onScanSuccess(decodedText)
    },
    () => {
      // ignore continuous "no QR found" callbacks
    },
  )
  selectedCameraId.value = cameraId
  isScanning.value = true
}

const requestCameraPermission = async (): Promise<MediaStream> => {
  // Simplest constraint — reliably triggers the browser "Ask" prompt
  return navigator.mediaDevices.getUserMedia({ video: true, audio: false })
}

const startScanning = async () => {
  permissionError.value = ''
  scanError.value = ''
  handled = false

  if (!secureContext.value) {
    permissionError.value =
      'Camera access requires HTTPS (or localhost). Open this app over a secure connection.'
    return
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    permissionError.value =
      'This browser does not support camera access. Try Chrome, Edge, Safari, or Firefox on a supported device.'
    return
  }

  isStarting.value = true
  await nextTick()

  try {
    const previewStream = await requestCameraPermission()
    for (const track of previewStream.getTracks()) {
      track.stop()
    }

    // Brief pause so the device is released before html5-qrcode reopens it
    await new Promise((resolve) => setTimeout(resolve, 250))

    const devices = await Html5Qrcode.getCameras()
    if (!devices?.length) {
      permissionError.value =
        'No camera was found on this device. Connect a camera or try on a phone/tablet.'
      return
    }

    cameras.value = devices.map((d) => ({ id: d.id, label: d.label }))
    const cameraId = pickPreferredCameraId(cameras.value)

    await stopScanner()
    scanner = null
    await nextTick()
    await startWithCameraId(cameraId)
  } catch (err) {
    permissionError.value = mapCameraError(err)
    isScanning.value = false
    await stopScanner()
    scanner = null
  } finally {
    isStarting.value = false
  }
}

const stopScanning = async () => {
  isScanning.value = false
  await stopScanner()
  scanner = null
}

const triggerFilePick = () => {
  permissionError.value = ''
  scanError.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
    fileInputRef.value.click()
  }
}

const onFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    scanError.value = 'Please choose an image file (PNG, JPG, etc.).'
    return
  }

  handled = false
  isScanningFile.value = true
  permissionError.value = ''
  scanError.value = ''

  try {
    // Camera and file scan cannot share the same active scanner session
    if (isScanning.value) {
      await stopScanning()
    }

    await nextTick()
    const instance = ensureScanner()
    const decodedText = await instance.scanFile(file, true)
    await onScanSuccess(decodedText)
  } catch (err: any) {
    const message = String(err?.message || err || '')
    if (/no qr|not found|unable to detect|no code/i.test(message)) {
      scanError.value =
        'No QR code found in that image. Use a clear photo of the asset sticker and try again.'
    } else {
      scanError.value = `Could not read QR from image: ${message || 'unknown error'}`
    }
    try {
      scanner?.clear()
    } catch {
      // ignore
    }
    scanner = null
  } finally {
    isScanningFile.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const onCameraChange = async (event: Event) => {
  const nextId = (event.target as HTMLSelectElement).value
  if (!nextId || nextId === selectedCameraId.value) return

  scanError.value = ''
  permissionError.value = ''
  isStarting.value = true
  isScanning.value = false
  await nextTick()

  try {
    await stopScanner()
    scanner = null
    await startWithCameraId(nextId)
  } catch (err) {
    permissionError.value = mapCameraError(err)
  } finally {
    isStarting.value = false
  }
}

const onScanSuccess = async (decodedText: string) => {
  if (handled) return
  const token = extractToken(decodedText)
  if (!token) {
    scanError.value = 'This QR code is not an asset sticker from this system.'
    return
  }

  handled = true
  await stopScanning()

  try {
    // Resolve sticker token → asset tag, then open Assets detail modal in-app
    const asset = await fetchPublicAsset(token)
    await router.push({
      path: '/app/assets',
      query: { viewAsset: asset.assetId },
    })
  } catch {
    handled = false
    scanError.value =
      'Asset not found for this QR code. It may have been removed or belongs to another organization.'
  }
}

onUnmounted(() => {
  void stopScanning()
})
</script>

<style scoped>
.scanner-start {
  max-width: 420px;
  margin: 0 auto;
}

.qr-reader {
  max-width: 480px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
  min-height: 240px;
}

.qr-reader--hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  min-height: 0;
}

.qr-reader :deep(video) {
  border-radius: 8px;
  width: 100%;
}

.camera-select {
  max-width: 320px;
}
</style>
