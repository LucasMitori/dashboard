<script setup lang="ts">

import { Position, Handle } from '@vue-flow/core'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});

// console.log("props.data", props.data);
</script>

<template>
    <div>
        <Handle id="top" type="target" :position="Position.Top" style="background-color: black; border-radius: 50%"/>
        <div class="start-node">
            <div class="node-label">{{ props.data.label }}</div>
          </div>
        <Handle id="bottom" type="source" :position="Position.Bottom" style="background-color: black; border-radius: 50%"/>
      </div>
  </template>
  
  
  <style scoped>
  .start-node {
    min-width: 150px; 
    padding: 0px 10px; 
    height: 40px;
    background-color: #D0F0FD;
border: 2px solid #0096C7;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: black;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .node-label {
    text-align: center;
  }
  </style>
  