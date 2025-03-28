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

    const close = () => {
    visible.value = false;
    };
</script>

<template>
    <v-dialog v-model="visible" persistent max-width="800">
      <v-card class="video-tutorial-card" dark>
        <v-card-title class="headline">
          Video Tutorials
          <v-spacer />
          <v-btn icon color="red" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-responsive aspect-ratio="16/9">
            <!-- Example: Embedded YouTube video -->
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </v-responsive>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>

  
  <style scoped>
  .video-tutorial-card {
    background-color: #1e1e1e;
    color: white;
  }
  </style>
  