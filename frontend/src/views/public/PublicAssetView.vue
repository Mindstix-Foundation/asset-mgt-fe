<template>
  <div class="public-asset-page">
    <header class="public-asset-header">
      <div class="public-asset-brand">
        <i class="fas fa-boxes" aria-hidden="true"></i>
        <span>Pebble Asset Tracker</span>
      </div>
    </header>

    <main class="public-asset-main">
      <div v-if="loading" class="public-asset-state" role="status">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 mb-0 text-muted">Loading asset information…</p>
      </div>

      <div v-else-if="error" class="public-asset-state">
        <i class="fas fa-qrcode fa-3x text-muted mb-3" aria-hidden="true"></i>
        <h1 class="h4 mb-2">Asset not found</h1>
        <p class="text-muted mb-0">
          This QR code is invalid or the asset is no longer available.
        </p>
      </div>

      <article v-else-if="asset" class="public-asset-card">
        <div class="public-asset-card__header">
          <p class="public-asset-card__eyebrow mb-1">Asset</p>
          <h1 class="public-asset-card__id">{{ asset.assetId }}</h1>
          <span class="badge" :class="statusBadgeClass">{{ statusLabel }}</span>
        </div>

        <dl class="public-asset-details">
          <div class="public-asset-details__row">
            <dt>Type</dt>
            <dd>{{ asset.assetType?.name || '—' }}</dd>
          </div>
          <div class="public-asset-details__row">
            <dt>Category</dt>
            <dd>{{ asset.assetType?.category?.name || '—' }}</dd>
          </div>
          <div class="public-asset-details__row">
            <dt>Brand</dt>
            <dd>{{ asset.brand?.name || '—' }}</dd>
          </div>
          <div class="public-asset-details__row">
            <dt>Model</dt>
            <dd>{{ asset.model?.name || '—' }}</dd>
          </div>
          <div class="public-asset-details__row">
            <dt>Serial number</dt>
            <dd>{{ asset.serialNumber || '—' }}</dd>
          </div>
          <div class="public-asset-details__row">
            <dt>Condition</dt>
            <dd>{{ conditionLabel }}</dd>
          </div>
          <div class="public-asset-details__row">
            <dt>Location</dt>
            <dd>{{ locationLabel }}</dd>
          </div>
          <div class="public-asset-details__row public-asset-details__row--owner">
            <dt>Current owner</dt>
            <dd>
              <template v-if="asset.currentOwner">
                <i class="fas fa-user me-2 text-muted" aria-hidden="true"></i>
                {{ asset.currentOwner }}
              </template>
              <span v-else class="text-muted">Unassigned</span>
            </dd>
          </div>
        </dl>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { STATUS_LABELS } from '@/constants'
import {
  fetchPublicAsset,
  type PublicAssetInfo,
} from '@/services/api/publicAssetApi'

const route = useRoute()
const loading = ref(true)
const error = ref(false)
const asset = ref<PublicAssetInfo | null>(null)

const labelFor = (value: string | null | undefined) => {
  if (!value) return '—'
  return (STATUS_LABELS as Record<string, string>)[value] || value.replaceAll('_', ' ')
}

const statusLabel = computed(() => labelFor(asset.value?.status))
const conditionLabel = computed(() => labelFor(asset.value?.condition))
const locationLabel = computed(() => labelFor(asset.value?.location))

const statusBadgeClass = computed(() => {
  const status = asset.value?.status
  if (status === 'ASSIGNED') return 'bg-success'
  if (status === 'NON_ASSIGNED') return 'bg-secondary'
  if (status === 'IN_MAINTENANCE') return 'bg-warning text-dark'
  if (status === 'RETIRED' || status === 'LOST') return 'bg-danger'
  return 'bg-secondary'
})

onMounted(async () => {
  const token = String(route.params.token || '').trim()
  if (!token) {
    error.value = true
    loading.value = false
    return
  }

  try {
    asset.value = await fetchPublicAsset(token)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.public-asset-page {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at top left, rgba(13, 110, 253, 0.08), transparent 50%),
    linear-gradient(180deg, #f7f8fa 0%, #eef1f5 100%);
  color: #1a1d21;
}

.public-asset-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
}

.public-asset-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.01em;
}

.public-asset-brand i {
  color: #0d6efd;
}

.public-asset-main {
  max-width: 520px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.public-asset-state {
  text-align: center;
  padding: 3rem 1rem;
}

.public-asset-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(16, 24, 40, 0.06);
  overflow: hidden;
}

.public-asset-card__header {
  padding: 1.5rem 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: #fafbfc;
}

.public-asset-card__eyebrow {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6c757d;
  font-weight: 600;
}

.public-asset-card__id {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
}

.public-asset-details {
  margin: 0;
  padding: 0.5rem 0;
}

.public-asset-details__row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.public-asset-details__row:last-child {
  border-bottom: none;
}

.public-asset-details__row dt {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  align-self: center;
}

.public-asset-details__row dd {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  word-break: break-word;
}

.public-asset-details__row--owner {
  background: #f8f9fa;
}

@media (max-width: 480px) {
  .public-asset-details__row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
