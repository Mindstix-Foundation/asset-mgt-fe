<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-labelledby="assetQrModalTitle"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="assetQrModalTitle" class="modal-title">
            <i class="fas fa-qrcode me-2" aria-hidden="true"></i>
            Asset QR Code{{ assetTag ? ` — ${assetTag}` : '' }}
          </h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>
        <div class="modal-body text-center">
          <div v-if="loading" class="py-5" role="status">
            <div class="spinner-border text-secondary"></div>
            <p class="mt-3 mb-0 text-muted">Generating QR code…</p>
          </div>

          <div v-else-if="error" class="py-4">
            <i class="fas fa-exclamation-circle fa-2x text-danger mb-2" aria-hidden="true"></i>
            <p class="mb-0 text-muted">{{ error }}</p>
          </div>

          <div v-else>
            <img
              v-if="qrDataUrl"
              :src="qrDataUrl"
              :alt="`QR code for ${assetTag || 'asset'}`"
              class="asset-qr-image"
            />
            <p class="fw-semibold mt-3 mb-1">{{ assetTag }}</p>
            <p class="text-muted small mb-0">
              Scan to view asset info and current owner. Print and stick on the asset.
            </p>
          </div>
        </div>
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-cancel btn-sm" @click="close">Close</button>
          <button
            type="button"
            class="btn btn-green btn-sm"
            :disabled="!qrDataUrl || loading"
            @click="downloadPng"
          >
            <i class="fas fa-download me-1" aria-hidden="true"></i>
            Download PNG
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="modelValue"
    class="modal-backdrop fade show"
    @click="close"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import { assetApiService } from '@/services/api/assetApi'

const props = defineProps<{
  modelValue: boolean
  numericAssetId: number | null
  assetTag?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const loading = ref(false)
const error = ref('')
const qrDataUrl = ref('')
const publicUrl = ref('')

const close = () => {
  emit('update:modelValue', false)
}

const reset = () => {
  loading.value = false
  error.value = ''
  qrDataUrl.value = ''
  publicUrl.value = ''
}

const loadQr = async () => {
  if (!props.numericAssetId) {
    error.value = 'Asset not found'
    return
  }

  loading.value = true
  error.value = ''
  qrDataUrl.value = ''

  try {
    const response = await assetApiService.getAssetQr(props.numericAssetId)
    publicUrl.value = response.data.url
    qrDataUrl.value = await QRCode.toDataURL(response.data.url, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: 'M',
    })
  } catch (err: any) {
    error.value = err?.message || 'Failed to generate QR code'
  } finally {
    loading.value = false
  }
}

const downloadPng = () => {
  if (!qrDataUrl.value) return
  const link = document.createElement('a')
  const filename = `${props.assetTag || 'asset'}-qr.png`.replaceAll(/\s+/g, '-')
  link.href = qrDataUrl.value
  link.download = filename
  link.click()
}

watch(
  () => [props.modelValue, props.numericAssetId] as const,
  ([open]) => {
    if (open) {
      void loadQr()
    } else {
      reset()
    }
  },
)
</script>

<style scoped>
.asset-qr-image {
  width: 280px;
  height: 280px;
  max-width: 100%;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
}

.modal {
  z-index: 1060;
}

.modal-backdrop {
  z-index: 1055;
}
</style>
