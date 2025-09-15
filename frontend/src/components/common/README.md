# Common Components

This directory contains reusable UI components that can be used throughout the application.

## Component Categories

### Form Components
- **AppButton.vue** - Customizable button component with variants (primary, secondary, danger, etc.)
- **AppInput.vue** - Text input with validation support and icons
- **AppSelect.vue** - Dropdown select component with search functionality
- **AppTextarea.vue** - Multi-line text input component
- **AppCheckbox.vue** - Checkbox input with custom styling
- **AppRadio.vue** - Radio button input component
- **AppDatePicker.vue** - Date picker component with calendar

### UI Components
- **AppModal.vue** - Modal dialog component with backdrop and animations
- **AppCard.vue** - Card container component with header, body, and footer slots
- **AppBadge.vue** - Status badge component with color variants
- **AppAlert.vue** - Alert/notification component with different types
- **AppToast.vue** - Toast notification component
- **AppSpinner.vue** - Loading spinner component
- **AppPagination.vue** - Pagination component for data tables

### Data Display Components
- **AppTable.vue** - Basic table component
- **AppDataTable.vue** - Advanced data table with sorting, filtering, and pagination
- **AppEmptyState.vue** - Empty state component for when no data is available
- **AppConfirmDialog.vue** - Confirmation dialog component

### Layout Components
- **AppContainer.vue** - Container component with responsive max-width
- **AppGrid.vue** - Grid layout component
- **AppTabs.vue** - Tab navigation component
- **AppAccordion.vue** - Collapsible accordion component

## Usage Examples

```vue
<template>
  <div>
    <!-- Button Examples -->
    <AppButton variant="primary" @click="handleClick">
      Primary Button
    </AppButton>
    
    <AppButton variant="secondary" size="sm" :loading="isLoading">
      Loading Button
    </AppButton>

    <!-- Form Examples -->
    <AppInput
      v-model="form.name"
      label="Asset Name"
      placeholder="Enter asset name"
      :error="errors.name"
      required
    />

    <AppSelect
      v-model="form.category"
      label="Category"
      :options="categoryOptions"
      placeholder="Select category"
    />

    <!-- Modal Example -->
    <AppModal v-model="showModal" title="Create Asset">
      <AssetForm @submit="handleSubmit" />
    </AppModal>

    <!-- Data Table Example -->
    <AppDataTable
      :data="assets"
      :columns="columns"
      :loading="loading"
      @sort="handleSort"
      @filter="handleFilter"
    />
  </div>
</template>

<script setup lang="ts">
import {
  AppButton,
  AppInput,
  AppSelect,
  AppModal,
  AppDataTable
} from '@/components/common';
</script>
```

## Component Props Standards

### Common Props
All components should follow these prop naming conventions:

- `variant` - Component style variant (primary, secondary, danger, etc.)
- `size` - Component size (xs, sm, md, lg, xl)
- `disabled` - Boolean to disable the component
- `loading` - Boolean to show loading state
- `error` - Error message string for form components

### Form Component Props
- `modelValue` - v-model value
- `label` - Field label
- `placeholder` - Placeholder text
- `required` - Boolean for required fields
- `readonly` - Boolean for readonly fields

### Event Standards
- `update:modelValue` - For v-model support
- `change` - When value changes
- `focus` - When component gains focus
- `blur` - When component loses focus

## Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the design system color palette
- Ensure components are accessible (ARIA labels, keyboard navigation)
- Support dark mode when applicable
- Make components responsive by default

## Testing

Each component should have:
- Unit tests for functionality
- Visual regression tests for UI
- Accessibility tests
- Examples in Storybook (if implemented) 