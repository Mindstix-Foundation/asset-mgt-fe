<template>
  <div class="searchable-dropdown-wrapper" :class="{ 'is-open': showDropdown }">
    <label :for="id" class="form-label">{{ label }} <span v-if="required" class="text-danger">*</span></label>
    <div class="dropdown" ref="dropdownRef">
      <!-- SonarQube false positive: aria-expanded and aria-controls are present via Vue binding -->
      <input
        type="text"
        class="form-control"
        :class="$attrs.class"
        :id="id"
        :placeholder="placeholder"
        v-model="searchText"
        @input="handleInput"
        @focus="handleClick"
        @click="handleClick"
        @blur="handleBlur"
        autocomplete="new-password"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        :name="`no-autofill-${Date.now()}-${id}`"
        :data-form-type="'other'"
        :data-lpignore="true"
        aria-autocomplete="list"
        data-ms-editor="false"
        data-address-field="no"
        data-1p-ignore="true"
        data-bwignore="true"
        data-dashlane-ignore="true"
        role="combobox"
        :aria-expanded="showDropdown ? 'true' : 'false'"
        aria-haspopup="listbox"
        :aria-controls="`${id}-listbox`"
        :aria-activedescendant="selectedIndex >= 0 ? `${id}-option-${selectedIndex}` : undefined"
        readonly
        onfocus="this.removeAttribute('readonly')"
        :required="required"
        :disabled="disabled"
        @keydown="handleKeydown"
      />
      <div
        class="dropdown-menu"
        :class="{ 
          show: showDropdown,
          'needs-scroll': needsScroll
        }"
        :style="{ 
          position: 'absolute', 
          width: '100%', 
          'max-height': dropdownMaxHeight
        }"
        :id="`${id}-listbox`"
        role="listbox"
        :aria-label="`${label} options`"
        aria-live="polite"
      >
        <!-- Loading skeleton for dynamic options -->
        <div v-if="showSkeleton" class="dropdown-skeleton" aria-hidden="true">
          <div
            v-for="n in skeletonRows"
            :key="`skel-${n}`"
            class="dropdown-skel-row shimmer"
          ></div>
        </div>
        <!-- Show "No data available" message when there are no items -->
        <div v-else-if="processedItems.length === 0" class="dropdown-item no-data-item">
          No data available
        </div>
        <!-- Show "No results found" when there are items but none match the search -->
        <div v-else-if="filteredItems.length === 0" class="dropdown-item no-data-item">
          No results found
        </div>
        <!-- Show filtered items when available -->
        <button
          v-else
          v-for="(item, index) in filteredItems"
          :key="getItemKey(item)"
          class="dropdown-item"
          :class="{ active: index === selectedIndex }"
          @click="selectItem(item)"
          @mousedown.prevent
          type="button"
          role="option"
          :aria-selected="index === selectedIndex ? 'true' : 'false'"
          :id="`${id}-option-${index}`"
        >
          <slot name="item" :item="item">
            {{ getItemLabel(item) }}
          </slot>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { usePopupVisibility } from '@/composables/usePopupVisibility'

export interface Item {
  id?: number | string
  value?: number | string
  key?: number | string
  code?: string
  name?: string
  label?: string
  title?: string
  text?: string
  abbreviation?: string
  [key: string]: unknown
}

interface Props {
  id: string
  label: string
  placeholder: string
  items: Item[] | { data: Item[], meta?: Record<string, unknown> }
  modelValue: Item | null
  disabled?: boolean
  required?: boolean
  /** When true, show skeleton instead of empty message (backend fetch in progress). */
  loading?: boolean
  /** Skeleton rows to show while loading. */
  skeletonCount?: number
  labelKey?: string
  valueKey?: string
  searchKeys?: string[]
  itemKey?: string
  nextFieldId?: string
  dataPath?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  loading: false,
  skeletonCount: 5,
  labelKey: 'name',
  valueKey: 'id',
  searchKeys: () => ['name', 'abbreviation'],
  itemKey: 'id',
  nextFieldId: undefined,
  dataPath: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Item | null): void
  (e: 'change', value: Item | null): void
  (e: 'validated'): void
}>()

const searchText = ref('')
const showDropdown = ref(false)
const selectedIndex = ref(-1)
const dropdownRef = ref<HTMLElement | null>(null)
const isFirstOpen = ref(true)

// Use the popup visibility composable
const { ensurePopupVisible: ensurePopupVisibleComposable, resetScrollTracking } = usePopupVisibility({
  debug: false,
  componentName: 'SearchableDropdown',
})

const getNestedValue = (obj: Record<string, unknown> | null | undefined, path: string): unknown => {
  if (!obj) return undefined

  let current: unknown = obj
  const keys = path.split('.')

  for (const key of keys) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return current
}

const getItemLabel = (item: Item): string => {
  if (!item) return ''

  // Try to get the value using the configured labelKey
  const value = getNestedValue(item, props.labelKey)
  if (value !== undefined) return String(value)

  // Fallbacks for different data formats
  if (item.name !== undefined) return String(item.name)
  if (item.label !== undefined) return String(item.label)
  if (item.title !== undefined) return String(item.title)
  if (item.text !== undefined) return String(item.text)

  // Last resort: return the item's ID or value as a string
  if (item.id !== undefined) return String(item.id)
  if (item.value !== undefined) return String(item.value)
  if (item.key !== undefined) return String(item.key)
  if (item.code !== undefined) return String(item.code)

  return String(item) || ''
}

const getItemKey = (item: Item): string | number => {
  // Try to get the key using the configured itemKey
  const value = getNestedValue(item, props.itemKey)
  if (value !== undefined && (typeof value === 'string' || typeof value === 'number')) {
    return value
  }

  // Fallbacks for different data formats
  if (item.id !== undefined) return item.id
  if (item.value !== undefined) return item.value
  if (item.key !== undefined) return item.key
  if (item.code !== undefined) return item.code

  // Last resort: stringify the item
  return JSON.stringify(item)
}

// Watch for external value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      searchText.value = getItemLabel(newValue)
    } else {
      searchText.value = ''
    }
  },
  { immediate: true },
)

// Process items to handle nested data structures
const processedItems = computed(() => {
  // If items is an array, return it directly
  if (Array.isArray(props.items)) {
    return props.items
  }

  // If items has a data property that's an array, return that
  if (props.items && typeof props.items === 'object' && 'data' in props.items && Array.isArray(props.items.data)) {
    return props.items.data
  }

  // If a specific dataPath is provided, try to access that path
  if (props.dataPath && props.items && typeof props.items === 'object') {
    const value = getNestedValue(props.items as Record<string, unknown>, props.dataPath)
    if (Array.isArray(value)) {
      return value as Item[]
    }
  }

  // Fallback to empty array if we can't find valid items
  return [] as Item[]
})

// Auto-skeleton: shows while backend fetch is in-flight even if parent doesn't pass `loading`.
const internalLoading = ref(false)
let internalLoadingTimeout: ReturnType<typeof setTimeout> | null = null
const INTERNAL_LOADING_MAX_MS = 2500

const skeletonRows = computed(() => Math.max(1, Math.min(Number(props.skeletonCount ?? 5), 7)))
const showSkeleton = computed(() => {
  if (!showDropdown.value) return false
  if (props.disabled) return false
  if (processedItems.value.length > 0) return false
  return Boolean(props.loading) || internalLoading.value
})

const startInternalLoading = () => {
  internalLoading.value = true
  if (internalLoadingTimeout) clearTimeout(internalLoadingTimeout)
  internalLoadingTimeout = setTimeout(() => {
    internalLoading.value = false
    internalLoadingTimeout = null
  }, INTERNAL_LOADING_MAX_MS)
}

watch(
  () => processedItems.value.length,
  (len) => {
    if (len > 0) {
      internalLoading.value = false
      if (internalLoadingTimeout) clearTimeout(internalLoadingTimeout)
      internalLoadingTimeout = null
    }
  },
)

watch(
  () => showDropdown.value,
  (open) => {
    if (!open) {
      internalLoading.value = false
      if (internalLoadingTimeout) clearTimeout(internalLoadingTimeout)
      internalLoadingTimeout = null
    }
  },
)

const filteredItems = computed(() => {
  const search = searchText.value.toLowerCase()
  
  // If no search text or it's the first time opening, return all items
  if (!search || isFirstOpen.value) return processedItems.value

  return processedItems.value.filter((item) => {
    // First try the configured search keys
    const matchesSearchKeys = props.searchKeys.some((key) => {
      const value = getNestedValue(item, key)
      return value !== undefined && String(value).toLowerCase().includes(search)
    })

    if (matchesSearchKeys) return true

    // Fallback to checking common properties if no match found
    const commonKeys = ['name', 'label', 'title', 'text', 'description', 'abbreviation']
    return commonKeys.some(key => {
      const value = getNestedValue(item, key)
      return value !== undefined && String(value).toLowerCase().includes(search)
    })
  })
})

// Compute dropdown max height and overflow behavior
const dropdownMaxHeight = computed(() => {
  const itemCount = filteredItems.value.length
  const itemHeight = 40 // 2.5rem = 40px
  const maxItems = 5 // Changed from 10 to 5
  const padding = 16 // 0.5rem top + 0.5rem bottom = 16px
  
  // Handle empty states (no data or no results)
  if (showSkeleton.value) {
    const rows = Math.min(skeletonRows.value, maxItems)
    return `${rows * itemHeight + padding}px`
  }
  if (processedItems.value.length === 0 || filteredItems.value.length === 0) {
    return `${itemHeight + padding}px` // Height for "No data" or "No results" message
  }
  
  if (itemCount <= maxItems) {
    // Show all items without scroll - exact height to fit items
    return `${itemCount * itemHeight + padding}px`
  } else {
    // Show max 5 items with scroll
    return `${maxItems * itemHeight + padding}px`
  }
})

// Compute whether scrolling is needed
const needsScroll = computed(() => {
  if (showSkeleton.value) return false
  const itemCount = filteredItems.value.length
  const maxItems = 5
  return itemCount > maxItems
})

const handleInput = () => {
  showDropdown.value = true
  selectedIndex.value = -1
  emit('update:modelValue', null)
  isFirstOpen.value = false // User is now typing, so disable first open behavior
  if (!props.loading && processedItems.value.length === 0) startInternalLoading()
  
  // Ensure the dropdown is visible within scrollable containers (e.g., modal body)
  if (dropdownRef.value) {
    ensurePopupVisibleComposable(dropdownRef.value, '.dropdown-menu', 'input')
  }
  
  // Reset scroll position when filtering
  nextTick(() => {
    const dropdownMenu = dropdownRef.value?.querySelector('.dropdown-menu')
    if (dropdownMenu) {
      dropdownMenu.scrollTop = 0
    }
  })
}

// Helper functions for keyboard navigation
const preventDefaultForNavigationKeys = (event: KeyboardEvent) => {
  if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
    event.preventDefault()
    event.stopPropagation()
  }
}

const handleArrowDown = () => {
  if (showDropdown.value) {
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredItems.value.length - 1)
  } else {
    showDropdown.value = true
    selectedIndex.value = filteredItems.value.length > 0 ? 0 : -1
  }
  scrollToSelectedItem()
}

const handleArrowUp = () => {
  if (showDropdown.value) {
    selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
  } else {
    showDropdown.value = true
    selectedIndex.value = filteredItems.value.length > 0 ? filteredItems.value.length - 1 : -1
  }
  scrollToSelectedItem()
}

const handleEnterKey = () => {
  if (!showDropdown.value) {
    showDropdown.value = true
    if (filteredItems.value.length > 0) {
      selectedIndex.value = 0
    }
    return
  }
  
  if (selectedIndex.value >= 0 && filteredItems.value[selectedIndex.value]) {
    // If an item is selected in the dropdown, select that item
    selectItem(filteredItems.value[selectedIndex.value])
  } else if (filteredItems.value.length > 0) {
    // If no item is selected but there are items in the dropdown, select the first one
    selectItem(filteredItems.value[0])
  }
}

const handleEscapeKey = () => {
  showDropdown.value = false
  selectedIndex.value = -1
  isFirstOpen.value = true // Reset for next open
}

const handleKeydown = (event: KeyboardEvent) => {
  preventDefaultForNavigationKeys(event)

  if (!showDropdown.value && event.key !== 'Enter') return

  const keyHandlers: Record<string, () => void> = {
    'ArrowDown': handleArrowDown,
    'ArrowUp': handleArrowUp,
    'Enter': handleEnterKey,
    'Escape': handleEscapeKey
  }

  const handler = keyHandlers[event.key]
  if (handler) {
    handler()
  }
}

// Function to scroll the selected item into view
const scrollToSelectedItem = () => {
  nextTick(() => {
    // Add a small delay to ensure DOM is fully updated
    setTimeout(() => {
      if (selectedIndex.value >= 0 && dropdownRef.value) {
        const dropdownMenu = dropdownRef.value.querySelector('.dropdown-menu')
        
        if (dropdownMenu) {
          // Get all dropdown items (buttons only, not the no-data divs)
          const dropdownItems = dropdownMenu.querySelectorAll('button.dropdown-item')
          const selectedItem = dropdownItems[selectedIndex.value] as HTMLElement
          
          if (selectedItem) {
            // Calculate if we need to scroll
            const itemHeight = selectedItem.offsetHeight
            const menuScrollTop = dropdownMenu.scrollTop
            const menuHeight = dropdownMenu.clientHeight
            const itemOffsetTop = selectedItem.offsetTop
            
            // Check if item is below visible area
            if (itemOffsetTop + itemHeight > menuScrollTop + menuHeight) {
              dropdownMenu.scrollTop = itemOffsetTop + itemHeight - menuHeight
            }
            // Check if item is above visible area
            else if (itemOffsetTop < menuScrollTop) {
              dropdownMenu.scrollTop = itemOffsetTop
            }
          }
        }
      }
    }, 10) // Small delay to ensure DOM is updated
  })
}

const selectItem = (item: Item) => {
  emit('update:modelValue', item)
  emit('change', item)
  emit('validated')
  searchText.value = getItemLabel(item)
  showDropdown.value = false
  selectedIndex.value = -1
  isFirstOpen.value = true // Reset for next open


  // Move focus to next field
  nextTick(() => {
    if (props.nextFieldId) {
      // If nextFieldId is specified, try to focus that element
      const nextElement = document.getElementById(props.nextFieldId)
      if (nextElement && !nextElement.hasAttribute('disabled')) {
        nextElement.focus()
        // Trigger click to open dropdown if it's our searchable dropdown
        if (nextElement.classList.contains('form-control')) {
          nextElement.click()
        }
      }
    } else {
      // Fall back to default tab order behavior
      const currentInput = document.getElementById(props.id)
      if (currentInput) {
        const allFocusable = Array.from(
          document.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
        const currentIndex = allFocusable.indexOf(currentInput)
        if (currentIndex > -1 && currentIndex < allFocusable.length - 1) {
          const nextElement = allFocusable[currentIndex + 1] as HTMLElement
          nextElement.focus()
        }
      }
    }
  })
}

// Add click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    // Only close if click is outside the dropdown and not on the input
    const input = dropdownRef.value.querySelector('input')
    if (input !== target) {
      showDropdown.value = false
      selectedIndex.value = -1
      isFirstOpen.value = true // Reset for next open
      resetScrollTracking() // Reset scroll tracking when dropdown closes
    }
  }
}

// Add blur handler
const handleBlur = (event: FocusEvent) => {
  // Use setTimeout to allow click events on dropdown items to fire first
  setTimeout(() => {
    const relatedTarget = event.relatedTarget as HTMLElement
    if (!dropdownRef.value?.contains(relatedTarget)) {
      showDropdown.value = false
      selectedIndex.value = -1
      isFirstOpen.value = true // Reset for next open
      resetScrollTracking() // Reset scroll tracking when dropdown closes
    }
  }, 200)
}

// Close dropdown when its top edge would scroll above the navbar
const NAVBAR_SELECTOR = '.navbar.sticky-top, .navbar.fixed-top'
const handleScrollWhileOpen = () => {
  if (!showDropdown.value || !dropdownRef.value) return
  const navbar = document.querySelector(NAVBAR_SELECTOR) as HTMLElement | null
  const navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 0
  const inputEl = dropdownRef.value.querySelector('input') as HTMLElement | null
  if (!inputEl) return
  const inputRect = inputEl.getBoundingClientRect()
  // Close when the input has scrolled above (or under) the navbar
  if (inputRect.bottom <= navbarBottom) {
    showDropdown.value = false
    selectedIndex.value = -1
    isFirstOpen.value = true
    resetScrollTracking()
  }
}

// Add lifecycle hooks for event listener
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  globalThis.addEventListener('scroll', handleScrollWhileOpen, true)

  // Clear any browser autofill data
  clearAutofillData()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  globalThis.removeEventListener('scroll', handleScrollWhileOpen, true)
})

// Function to clear browser autofill data
const clearAutofillData = () => {
  // For some browsers, we need to set a random value and then clear it
  // to prevent autofill from working
  if (dropdownRef.value) {
    const input = dropdownRef.value.querySelector('input')
    if (input) {
      // Set a temporary random value
      const originalValue = input.value
      input.value = `no-autofill-${(typeof globalThis !== 'undefined' && (globalThis as any).crypto && 'getRandomValues' in (globalThis as any).crypto)
        ? Array.from((() => { const b = new Uint8Array(16); (globalThis as any).crypto.getRandomValues(b); return b })(), (x) => x.toString(16).padStart(2, '0')).join('')
        : Math.random().toString(36).slice(2)
      }`

      // Then restore the original value
      setTimeout(() => {
        input.value = originalValue
        
        // Additional measures to prevent autofill
        input.setAttribute('autocomplete', 'new-password')
        input.dataset.formType = 'other'
        input.dataset.lpignore = 'true'
        input.dataset['1pIgnore'] = 'true'
        input.dataset.bwignore = 'true'
        input.dataset.dashlaneIgnore = 'true'
        input.setAttribute('aria-autocomplete', 'none')
        
        // Disable browser address suggestions
        input.dataset.addressField = 'no'
        input.dataset.msEditor = 'false'
      }, 1)
    }
  }
}

// Expose method to clear selection
defineExpose({
  clear: () => {
    searchText.value = ''
    emit('update:modelValue', null)
    selectedIndex.value = -1
  },
})

// Add a new method to handle click events
const handleClick = () => {
  // Show dropdown and update selectedIndex to first item if input is empty and there are items
  showDropdown.value = true
  if (!props.loading && processedItems.value.length === 0) startInternalLoading()
  
  // Ensure visibility within modals if partially hidden by footer
  if (dropdownRef.value) {
    ensurePopupVisibleComposable(dropdownRef.value, '.dropdown-menu', 'input')
  }
  
  if (!searchText.value.trim() && filteredItems.value.length > 0) {
    selectedIndex.value = 0 // Pre-select the first item
    scrollToSelectedItem() // Ensure first item is visible
  }
}

onUnmounted(() => {
  if (internalLoadingTimeout) clearTimeout(internalLoadingTimeout)
})
</script>

<style scoped>
/* Wrapper for the entire searchable dropdown */
.searchable-dropdown-wrapper {
  position: relative;
  width: 100%;
}

/* When the dropdown is open, lift the wrapper above sibling form elements
   while staying below the navbar. */
.searchable-dropdown-wrapper.is-open {
  z-index: var(--z-dropdown-menu);
}

/* Form label styling */
.form-label {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #212529;
}

/* Dropdown container */
.dropdown {
  position: relative;
  width: 100%;
}

/* Form control styling */
.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  color: #212529;
  background-color: #fff;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 1;
}

.form-control::placeholder {
  color: #6c757d;
  opacity: 1;
}

/* Dropdown menu styling */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  overflow-y: hidden; /* Hide scroll by default */
  overflow-x: hidden; /* Hide horizontal scroll */
  width: 100%;
  scroll-behavior: smooth;
  z-index: var(--z-dropdown-menu);
  scrollbar-width: thin;
  scrollbar-color: #6c757d transparent;
  word-wrap: break-word;
  white-space: nowrap;
}

/* Only show vertical scroll when needed */
.dropdown-menu.needs-scroll {
  overflow-y: auto;
}

.dropdown-menu.show {
  display: block;
}

/* Custom scrollbar for webkit browsers */
.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background-color: #6c757d;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background-color: #495057;
}

/* Dropdown item styling */
.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.5rem; /* Consistent item height */
}

.dropdown-item:hover,
.dropdown-item:focus,
.dropdown-item.active {
  color: #1e2125;
  background-color: #e9ecef;
}

.dropdown-item:active {
  color: #fff;
  background-color: #0d6efd;
}

.no-data-item {
  color: #6c757d;
  font-style: italic;
  cursor: default;
  pointer-events: none;
  display: flex;
  align-items: center;
  min-height: 2.5rem; /* Consistent height with other items */
  padding: 0.5rem 1rem;
}

.no-data-item:hover {
  background-color: transparent;
  color: #6c757d;
}

/* Dropdown skeleton (matches app shimmer style) */
.dropdown-skeleton {
  padding: 0.5rem 1rem;
}
.dropdown-skel-row {
  height: 0.9rem;
  border-radius: 10px;
  background: #e5e7eb;
  margin: 0.6rem 0;
  position: relative;
  overflow: hidden;
}
.dropdown-skel-row:first-child { margin-top: 0.25rem; }
.dropdown-skel-row:last-child { margin-bottom: 0.25rem; }
.dropdown-skel-row:nth-child(odd) { width: 78%; }
.dropdown-skel-row:nth-child(even) { width: 58%; }
.dropdown-skel-row:nth-child(3n) { width: 66%; }

.dropdown-skeleton .shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.75) 40%,
    rgba(255, 255, 255, 0) 80%
  );
  animation: dropdown-shimmer 1.15s infinite;
}
@keyframes dropdown-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Prevent browser autofill styling */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #212529 !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Prevent browser address suggestions */
input[data-address-field="no"] {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

/* Disable browser autofill dropdown */
input::-webkit-contacts-auto-fill-button,
input::-webkit-credentials-auto-fill-button {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
  height: 0;
  width: 0;
  margin: 0;
}

/* Validation styling removed - now handled by formValidation.css for form pages only */

/* Required field styling */
.text-danger {
  color: #dc3545 !important;
}
</style> 