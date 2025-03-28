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

const calls = ref([
  { name: 'John Doe', time: '10:15 AM', number: '555-1234' },
  { name: 'Jane Smith', time: '11:00 AM', number: '555-5678' },
  { name: 'Alice Johnson', time: '12:30 PM', number: '555-9012' }
]);

const dial = (number: string) => {
  alert(`Dialing ${number}`);
};

const close = () => {
  visible.value = false;
};
</script>

<template>
    <v-dialog v-model="visible" persistent max-width="600">
      <v-card class="call-manager-card" dark>
        <v-card-title class="headline">
          Call Manager
          <v-spacer />
          <v-btn icon color="red" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list two-line>
            <v-list-item-title>Recent Calls</v-list-item-title>
            <v-list-item v-for="(call, index) in calls" :key="index">
                <v-list-item-title>{{ call.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ call.time }}</v-list-item-subtitle>
              <v-list-item-action>
                <v-btn icon @click="dial(call.number)">
                  <v-icon>mdi-phone</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <style scoped>
  .call-manager-card {
    background-color: #1e1e1e;
    color: white;
  }
  </style>
  