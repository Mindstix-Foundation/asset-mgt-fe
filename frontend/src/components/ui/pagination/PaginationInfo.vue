<template>
  <div class="text-muted">
    <small>Showing {{ start }}-{{ end }} of {{ total }} {{ itemName }}</small>
  </div>
</template>

<script setup lang="ts">
interface Props {
  start: number
  end: number
  total: number
  itemName?: string
}

withDefaults(defineProps<Props>(), {
  itemName: 'items'
})
</script>

<style scoped>
/* Inherit host styles; no extra styling here to keep consistency */
</style>
