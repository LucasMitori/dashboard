<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true }
});
const emit = defineEmits(['update:modelValue']);
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const archiveEntries = ref([
  { title: 'Chat with John Doe', date: '2025-02-20 10:15 AM' },
  { title: 'Call with Jane Smith', date: '2025-02-20 11:00 AM' },
  { title: 'Chat with Alice Johnson', date: '2025-02-20 12:30 PM' }
]);

const viewEntry = (entry: any) => {
  alert(`Viewing details for: ${entry.title}`);
};

const close = () => {
  visible.value = false;
};
</script>

<template>
    <v-dialog v-model="visible" persistent max-width="600">
      <v-card class="archive-card" dark>
        <v-card-title class="headline">
          Archives
          <v-spacer />
          <v-btn icon color="red" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item-title>Past Interactions</v-list-item-title>
            <v-list-item v-for="(entry, index) in archiveEntries" :key="index">
                <v-list-item-title>{{ entry.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ entry.date }}</v-list-item-subtitle>
              <v-list-item-action>
                <v-btn icon @click="viewEntry(entry)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <style scoped>
  .archive-card {
    background-color: #1e1e1e;
    color: white;
  }
  </style>
  