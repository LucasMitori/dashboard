<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])
const router = useRouter()
const searchQuery = ref('')
const isSearchOpen = ref(props.modelValue)

watch(() => props.modelValue, newVal => {
  isSearchOpen.value = newVal
})

const allPages = computed(() => {
  const routes = router.getRoutes()
  return routes
    .filter(route => route.meta && route.meta.title && !route.path.includes(':'))
    .map(route => ({
      title: route.meta.title || route.name || route.path,
      description: route.meta.description || '',
      keywords: route.meta.keywords || '',
      route: route.path,
      icon: route.meta.icon || 'mdi-file-document-outline'
    }))
})

const fuse = computed(() => {
  const options = { keys: ['title', 'description', 'keywords'], threshold: 0.3 }
  return new Fuse(allPages.value, options)
})

const filteredPages = computed(() => {
  if (!searchQuery.value) return []
  return fuse.value.search(searchQuery.value).map(result => result.item)
})

const selectPage = (page: { route: string }) => {
  isSearchOpen.value = false
  emit('update:modelValue', false)
  searchQuery.value = ''
  router.push(page.route)
}
</script>

<template>
  <v-card
    v-if="isSearchOpen"
    class="global-search-card"
    elevation="10"
    color="primary"
  >
    <v-card-title>
      <v-text-field
        v-model="searchQuery"
        label="Search..."
        append-inner-icon="mdi-magnify"
        clearable
        density="comfortable"
        hide-details
        variant="outlined"
      />
    </v-card-title>
    <v-divider />
    <v-list class="results-list">
      <template v-if="filteredPages.length">
        <v-list-item
          v-for="page in filteredPages"
          :key="page.route"
          @click="selectPage(page)"
        >
          <template #prepend>
            <v-icon>{{ page.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ page.title }}</v-list-item-title>
          <v-list-item-subtitle>{{  page.route }}</v-list-item-subtitle>
        </v-list-item>
      </template>
      <template v-else-if="searchQuery">
        <v-list-item>
          <v-list-item-title>No results found</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<style scoped>
.global-search-card {
  position: fixed;
  bottom: 150px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  width: 500px;
  border-radius: 8px;
  background: white;
}
.results-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>