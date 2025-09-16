<template>
  <div class="dashboard-page">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="dashboard-header">
            <h1 class="dashboard-title">
              <i class="fas fa-clipboard-check me-3"></i>
              TrackStix Dashboard
            </h1>
            <p class="dashboard-subtitle">Welcome to your Asset Management portal</p>
            <div class="user-info">
              <span class="welcome-text">Welcome back, {{ user?.name || user?.username || 'User' }}!</span>
            </div>
          </div>
          
          <div class="dashboard-content">
            <div class="row">
              <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="dashboard-card">
                  <div class="card-icon">
                    <i class="fas fa-boxes"></i>
                  </div>
                  <div class="card-content">
                    <h3>Assets</h3>
                    <p>Manage your assets</p>
                  </div>
                </div>
              </div>
              
              <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="dashboard-card">
                  <div class="card-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="card-content">
                    <h3>Employees</h3>
                    <p>Manage employees</p>
                  </div>
                </div>
              </div>
              
              <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="dashboard-card">
                  <div class="card-icon">
                    <i class="fas fa-warehouse"></i>
                  </div>
                  <div class="card-content">
                    <h3>Inventory</h3>
                    <p>Track inventory</p>
                  </div>
                </div>
              </div>
              
              <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="dashboard-card">
                  <div class="card-icon">
                    <i class="fas fa-chart-bar"></i>
                  </div>
                  <div class="card-content">
                    <h3>Reports</h3>
                    <p>View reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
</script>

<style scoped>
.dashboard-page {
  background: var(--bg-secondary);
  min-height: 100vh;
  padding: 2rem 0;
}

.dashboard-header {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--element-gray);
}

.dashboard-title {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.dashboard-title i {
  color: var(--accent-navy);
}

.dashboard-subtitle {
  color: var(--primary-dark-gray);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.welcome-text {
  color: var(--text-secondary);
  font-weight: 600;
}

.logout-btn {
  background: var(--secondary-red);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.logout-btn:hover {
  background: var(--primary-dark-gray);
}

.dashboard-content {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--element-gray);
}

.dashboard-card {
  background: var(--bg-primary);
  border: 2px solid var(--element-gray);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;
  height: 100%;
}

.dashboard-card:hover {
  border-color: var(--secondary-purple);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-light-gray);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  border: 1px solid var(--element-gray);
}

.card-icon i {
  font-size: 1.5rem;
  color: var(--accent-navy);
}

.card-content h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.card-content p {
  color: var(--primary-dark-gray);
  margin: 0;
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem 0;
  }
  
  .dashboard-header,
  .dashboard-content {
    padding: 1.5rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>