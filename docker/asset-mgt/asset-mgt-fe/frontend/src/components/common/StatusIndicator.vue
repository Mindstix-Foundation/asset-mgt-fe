<template>
  <div 
    class="status-indicator" 
    :class="[
      `status-indicator--${variant}`,
      { 'status-indicator--pulsing': pulsing }
    ]"
    :style="{ 
      width: size + 'px', 
      height: size + 'px',
      backgroundColor: customColor || undefined
    }"
  ></div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: number
  pulsing?: boolean
  customColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'success',
  size: 8,
  pulsing: true
})
</script>

<style scoped>
.status-indicator {
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

/* Variant Colors */
.status-indicator--success {
  background-color: var(--secondary-green);
}

.status-indicator--warning {
  background-color: var(--secondary-orange);
}

.status-indicator--error {
  background-color: var(--secondary-red);
}

.status-indicator--info {
  background-color: var(--secondary-purple);
}

.status-indicator--neutral {
  background-color: var(--primary-mid-gray);
}

/* Pulsing Animation */
.status-indicator--pulsing {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(33, 175, 101, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 175, 101, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 175, 101, 0);
  }
}

/* Custom color pulsing animation */
.status-indicator--pulsing[style*="background-color"] {
  animation: pulse-custom 2s infinite;
}

@keyframes pulse-custom {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

/* Size variants */
.status-indicator--small {
  width: 6px !important;
  height: 6px !important;
}

.status-indicator--medium {
  width: 8px !important;
  height: 8px !important;
}

.status-indicator--large {
  width: 12px !important;
  height: 12px !important;
}
</style>
