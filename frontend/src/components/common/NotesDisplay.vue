<template>
  <div class="notes-display-container">
    <div v-if="showLabel" class="notes-label">
      <label class="info-label">
        <i v-if="showIcon" class="fas fa-sticky-note me-2"></i>
        {{ label }}
      </label>
    </div>
    
    <div class="notes-content">
      <div 
        v-if="hasNotes" 
        class="notes-text"
        :class="{ 'notes-text-formatted': preserveFormatting }"
      >
        {{ notes }}
      </div>
      
      <div v-else class="notes-empty">
        <i v-if="showEmptyIcon" class="fas fa-info-circle me-2"></i>
        {{ fallbackText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  notes?: string | null
  label?: string
  fallbackText?: string
  showLabel?: boolean
  showIcon?: boolean
  showEmptyIcon?: boolean
  preserveFormatting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  notes: '',
  label: 'Additional Notes',
  fallbackText: 'No additional notes provided.',
  showLabel: true,
  showIcon: true,
  showEmptyIcon: true,
  preserveFormatting: true
})

// Computed
const hasNotes = computed(() => {
  return props.notes && props.notes.trim().length > 0
})
</script>

<style scoped>
.notes-display-container {
  width: 100%;
}

.notes-label {
  margin-bottom: 0.75rem;
}

.info-label {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #666666 !important;
  margin-bottom: 0.5rem !important;
  display: flex;
  align-items: center;
}

.notes-content {
  padding: 1rem;
  min-height: 60px;
  display: flex;
  align-items: center;
}

.notes-text {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  width: 100%;
}

.notes-text-formatted {
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
}

.notes-empty {
  font-size: 0.95rem;
  font-style: italic;
  display: flex;
  align-items: center;
  width: 100%;
  opacity: 0.7;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .notes-content {
    padding: 0.75rem;
    min-height: 50px;
  }
  
  .notes-text {
    font-size: 0.85rem;
  }
  
  .notes-empty {
    font-size: 0.8rem;
  }
  
  .info-label {
    font-size: 0.9rem !important;
  }
}

/* No borders - inherit all styling from parent */

/* Animation for content changes */
.notes-content {
  transition: all 0.2s ease;
}

.notes-text,
.notes-empty {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Special styling for long content */
.notes-text-formatted {
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.notes-text-formatted::-webkit-scrollbar {
  width: 6px;
}

.notes-text-formatted::-webkit-scrollbar-track {
  background: transparent;
}

.notes-text-formatted::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.notes-text-formatted::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}
</style>
