<template>
  <div class="platform-companies container-fluid py-4">
    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
      <div>
        <h2 class="mb-1" style="color: var(--primary-black);">Organizations</h2>
        <p class="text-muted mb-0">
          Review signup requests and manage which companies can use the platform.
          You cannot view company asset or employee data.
        </p>
      </div>
      <button class="btn btn-green" type="button" @click="showCreate = true">
        <i class="fas fa-plus me-2"></i>
        Provision organization
      </button>
    </div>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          type="button"
          class="nav-link"
          :class="{ active: activeTab === 'pending' }"
          @click="activeTab = 'pending'"
        >
          Pending requests
          <span v-if="pendingCount" class="badge bg-warning text-dark ms-1">{{ pendingCount }}</span>
        </button>
      </li>
      <li class="nav-item">
        <button
          type="button"
          class="nav-link"
          :class="{ active: activeTab === 'orgs' }"
          @click="activeTab = 'orgs'"
        >
          Active organizations
        </button>
      </li>
    </ul>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Pending registrations -->
    <div v-else-if="activeTab === 'pending'" class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Organization</th>
            <th>Admin</th>
            <th>Email</th>
            <th>Message</th>
            <th>Submitted</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pendingRegistrations.length === 0">
            <td colspan="6" class="text-center text-muted py-4">
              No pending registration requests.
            </td>
          </tr>
          <tr v-for="req in pendingRegistrations" :key="req.id">
            <td class="fw-semibold">{{ req.organizationName }}</td>
            <td>
              {{ req.adminFirstName }} {{ req.adminLastName }}
              <div class="small text-muted">@{{ req.adminUsername }}</div>
            </td>
            <td>{{ req.adminEmail }}</td>
            <td class="small text-muted" style="max-width: 220px;">
              {{ req.message || '—' }}
            </td>
            <td>{{ formatDate(req.createdAt) }}</td>
            <td class="text-end text-nowrap">
              <button
                class="btn btn-sm btn-outline-success me-1"
                type="button"
                :disabled="reviewingId === req.id"
                @click="approve(req)"
              >
                Approve
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                type="button"
                :disabled="reviewingId === req.id"
                @click="reject(req)"
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Existing orgs -->
    <div v-else class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Organization</th>
            <th>Access</th>
            <th>Users</th>
            <th>Employees</th>
            <th>Assets</th>
            <th>Created</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="tenants.length === 0">
            <td colspan="7" class="text-center text-muted py-4">
              No organizations yet.
            </td>
          </tr>
          <tr v-for="tenant in tenants" :key="tenant.id">
            <td class="fw-semibold">{{ tenant.name }}</td>
            <td>
              <span
                class="badge"
                :class="tenant.isActive ? 'bg-success' : 'bg-secondary'"
              >
                {{ tenant.isActive ? 'Allowed' : 'Revoked' }}
              </span>
            </td>
            <td>{{ tenant.stats?.users ?? 0 }}</td>
            <td>{{ tenant.stats?.employees ?? 0 }}</td>
            <td>{{ tenant.stats?.assets ?? 0 }}</td>
            <td>{{ formatDate(tenant.createdAt) }}</td>
            <td class="text-end">
              <button
                v-if="tenant.isActive"
                class="btn btn-sm btn-outline-danger"
                type="button"
                :disabled="updatingId === tenant.id"
                @click="setAccess(tenant, false)"
              >
                Revoke access
              </button>
              <button
                v-else
                class="btn btn-sm btn-outline-success"
                type="button"
                :disabled="updatingId === tenant.id"
                @click="setAccess(tenant, true)"
              >
                Allow access
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create modal (direct provision) -->
    <div
      v-if="showCreate"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      style="background: rgba(0, 0, 0, 0.45);"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Provision organization</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeCreate"></button>
          </div>
          <form @submit.prevent="submitCreate">
            <div class="modal-body">
              <p class="text-muted small">
                Directly create an organization (skips the public registration queue).
              </p>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Organization name</label>
                  <input v-model="form.name" class="form-control" required maxlength="100" />
                </div>
                <div class="col-12">
                  <div class="form-check">
                    <input id="allowAccess" v-model="form.isActive" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="allowAccess">Allow access immediately</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-check">
                    <input id="provisionAdmin" v-model="provisionAdmin" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="provisionAdmin">Create first organization admin</label>
                  </div>
                </div>
                <template v-if="provisionAdmin">
                  <div class="col-md-6">
                    <label class="form-label">Admin username</label>
                    <input v-model="form.admin.username" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Admin email</label>
                    <input v-model="form.admin.email" type="email" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">First name</label>
                    <input v-model="form.admin.firstName" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Last name</label>
                    <input v-model="form.admin.lastName" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Temporary password</label>
                    <input
                      v-model="form.admin.password"
                      type="password"
                      class="form-control"
                      required
                      minlength="8"
                    />
                  </div>
                </template>
              </div>
              <div v-if="createError" class="alert alert-danger mt-3 mb-0">{{ createError }}</div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-gray" @click="closeCreate">Cancel</button>
              <button type="submit" class="btn btn-green" :disabled="creating">
                {{ creating ? 'Creating…' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import platformApi, {
  type OrganizationRegistration,
  type PlatformTenant,
} from '@/services/api/platformApi'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const activeTab = ref<'pending' | 'orgs'>('pending')
const tenants = ref<PlatformTenant[]>([])
const registrations = ref<OrganizationRegistration[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const updatingId = ref<number | null>(null)
const reviewingId = ref<number | null>(null)
const showCreate = ref(false)
const creating = ref(false)
const createError = ref<string | null>(null)
const provisionAdmin = ref(true)

const form = reactive({
  name: '',
  isActive: true,
  admin: {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  },
})

const pendingRegistrations = computed(() =>
  registrations.value.filter((r) => r.status === 'PENDING'),
)
const pendingCount = computed(() => pendingRegistrations.value.length)

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString()
}

const loadAll = async () => {
  loading.value = true
  error.value = null
  try {
    const [tenantList, regList] = await Promise.all([
      platformApi.listTenants(),
      platformApi.listRegistrations(),
    ])
    tenants.value = tenantList
    registrations.value = regList
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to load organizations'
  } finally {
    loading.value = false
  }
}

const setAccess = async (tenant: PlatformTenant, isActive: boolean) => {
  updatingId.value = tenant.id
  try {
    await platformApi.updateTenantStatus(tenant.id, isActive)
    toast.showSuccess(
      'Access updated',
      isActive ? `${tenant.name} can now use the platform` : `${tenant.name} access revoked`,
    )
    await loadAll()
  } catch (e: any) {
    toast.showError('Update failed', e?.response?.data?.message || 'Failed to update access')
  } finally {
    updatingId.value = null
  }
}

const approve = async (req: OrganizationRegistration) => {
  reviewingId.value = req.id
  try {
    await platformApi.approveRegistration(req.id)
    toast.showSuccess(
      'Approved',
      `${req.organizationName} is now active. Admin can sign in as ${req.adminUsername}.`,
    )
    activeTab.value = 'orgs'
    await loadAll()
  } catch (e: any) {
    toast.showError('Approve failed', e?.response?.data?.message || 'Failed to approve')
  } finally {
    reviewingId.value = null
  }
}

const reject = async (req: OrganizationRegistration) => {
  const reason = window.prompt('Optional rejection reason:') ?? undefined
  reviewingId.value = req.id
  try {
    await platformApi.rejectRegistration(req.id, reason || undefined)
    toast.showSuccess('Rejected', `${req.organizationName} registration rejected`)
    await loadAll()
  } catch (e: any) {
    toast.showError('Reject failed', e?.response?.data?.message || 'Failed to reject')
  } finally {
    reviewingId.value = null
  }
}

const closeCreate = () => {
  showCreate.value = false
  createError.value = null
}

const submitCreate = async () => {
  creating.value = true
  createError.value = null
  try {
    const payload: any = {
      name: form.name.trim(),
      isActive: form.isActive,
    }
    if (provisionAdmin.value) {
      payload.admin = { ...form.admin }
    }
    await platformApi.createTenant(payload)
    toast.showSuccess('Created', 'Organization provisioned successfully')
    closeCreate()
    form.name = ''
    form.isActive = true
    form.admin = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    }
    activeTab.value = 'orgs'
    await loadAll()
  } catch (e: any) {
    const msg = e?.response?.data?.message
    createError.value = Array.isArray(msg)
      ? msg.join(', ')
      : msg || 'Failed to create organization'
  } finally {
    creating.value = false
  }
}

onMounted(loadAll)
</script>
