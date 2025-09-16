<template>
  <div class="vendors-page">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="page-header">
            <h1 class="page-title">
              <i class="fas fa-store me-3"></i>
              Vendor Management
            </h1>
            <p class="page-subtitle">Manage vendor relationships and procurement</p>
          </div>
          
          <div class="content-card">
            <div class="text-center py-5">
              <i class="fas fa-store fa-4x text-muted mb-3"></i>
              <h3>Vendors Module</h3>
              <p class="text-muted">This module is under development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vendor management functionality will be implemented here
</script>

<style scoped>
.vendors-page {
  background: var(--bg-secondary);
  min-height: calc(100vh - 60px);
  padding: 2rem 0;
}

.page-header {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--element-gray);
}

.page-title {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.page-title i {
  color: var(--accent-navy);
}

.page-subtitle {
  color: var(--primary-dark-gray);
  font-size: 1.1rem;
  margin: 0;
}

.content-card {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--element-gray);
}
</style> 