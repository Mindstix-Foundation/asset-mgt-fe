<script setup lang="ts">
import {
  PlusIcon,
  PackageIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  DollarSignIcon,
  SearchIcon,
  FileTextIcon,
  SettingsIcon,
} from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Asset Management Dashboard
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Welcome to your asset management system. Monitor and manage all your organizational
          assets.
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button type="button" class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Add Asset
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <PackageIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Assets</dt>
                <dd class="text-lg font-medium text-gray-900">1,247</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Assets</dt>
                <dd class="text-lg font-medium text-gray-900">1,156</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <AlertTriangleIcon class="h-8 w-8 text-yellow-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Maintenance Due</dt>
                <dd class="text-lg font-medium text-gray-900">23</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DollarSignIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                <dd class="text-lg font-medium text-gray-900">$2.4M</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button class="w-full btn-secondary justify-start">
              <PlusIcon class="w-5 h-5 mr-3" />
              Add New Asset
            </button>
            <button class="w-full btn-secondary justify-start">
              <SearchIcon class="w-5 h-5 mr-3" />
              Search Assets
            </button>
            <button class="w-full btn-secondary justify-start">
              <FileTextIcon class="w-5 h-5 mr-3" />
              Generate Report
            </button>
            <button class="w-full btn-secondary justify-start">
              <SettingsIcon class="w-5 h-5 mr-3" />
              System Settings
            </button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-3">
            <div class="flex items-center text-sm">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span class="text-gray-600">Laptop Dell-001 assigned to John Doe</span>
            </div>
            <div class="flex items-center text-sm">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span class="text-gray-600">Maintenance scheduled for Printer-HP-205</span>
            </div>
            <div class="flex items-center text-sm">
              <div class="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span class="text-gray-600">Asset Monitor-LG-102 marked for disposal</span>
            </div>
            <div class="flex items-center text-sm">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span class="text-gray-600">New asset category 'Mobile Devices' created</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
