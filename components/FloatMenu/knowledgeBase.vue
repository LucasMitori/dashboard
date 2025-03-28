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

const searchQuery = ref('');
const faqs = ref([
  { question: 'How to reset my password?', answer: 'Click on the reset link in your profile.' },
  { question: 'How to contact support?', answer: 'Call our support hotline or use the chat feature.' },
  { question: 'Where to find my order history?', answer: 'Check your account under orders.' }
]);

const filteredFAQs = computed(() => {
  if (!searchQuery.value) return faqs.value;
  return faqs.value.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const close = () => {
  visible.value = false;
};
</script>


<template>
    <v-dialog v-model="visible" persistent max-width="600">
      <v-card class="knowledge-base-card" dark>
        <v-card-title class="headline">
          Knowledge Base
          <v-spacer />
          <v-btn icon color="red" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="searchQuery" label="Search FAQ" outlined dense />
          <v-list>
            <v-list-item v-for="(item, index) in filteredFAQs" :key="index">
=                <v-list-item-title>{{ item.question }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.answer }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>

  <style scoped>
  .knowledge-base-card {
    background-color: #1e1e1e;
    color: white;
  }
  </style>
  