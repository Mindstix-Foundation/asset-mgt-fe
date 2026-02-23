import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(), // Disabled for clean production-like experience
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/tmp/**',
        '**/temp/**',
        '**/.vite/**',
        '**/.vite-temp/**',
        '**/uploads/**',
        '**/Prototype/**',
        '**/*.log',
        '**/*.csv',
        '**/*.md',
        '**/*.pdf',
        '**/*.html',
        '**/*.css',
        '**/*.js'
      ],
      usePolling: true,
      interval: 1000
    },
    // Add security headers for development server
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    // Allow AWS ELB hostnames
    allowedHosts: [
      'testassetmanagement-1311631993.us-east-2.elb.amazonaws.com',
      '.us-east-2.elb.amazonaws.com', // Allow all ELBs in this region
      '.elb.amazonaws.com' // Allow all AWS ELBs (more permissive)
    ],
  },
  preview: {
    // Also add to preview server
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    // Allow AWS ELB hostnames for production/preview builds
    allowedHosts: [
      'testassetmanagement-1311631993.us-east-2.elb.amazonaws.com',
      '.us-east-2.elb.amazonaws.com', // Allow all ELBs in this region
      '.elb.amazonaws.com' // Allow all AWS ELBs (more permissive)
    ],
  }
})
