<template>
    <div class="custom-star-node">
      <!-- You can customize the node's appearance here -->
      <div class="star">
        ⭐️
      </div>
      <div>{{ node.data.label }}</div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  // Expect the node prop, which will contain all the node-specific data
  const props = defineProps({
    node: {
      type: Object,
      required: true,
    }
  });
  </script>
  
  <style scoped>
  .custom-star-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: yellow;
    border: 2px solid black;
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
  
  .star {
    font-size: 40px;
  }
  </style>
  