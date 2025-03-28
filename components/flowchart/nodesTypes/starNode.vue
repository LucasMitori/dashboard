<template>
  <div class="custom-node star-node" :style="nodeStyle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
      <polygon fill="#f1ee8e" stroke="none" 
        points="12,2 15,10 23,10 17,15 19,22 12,18 5,22 7,15 1,10 9,10" />
      <polygon fill="none" stroke="#e6cc00" stroke-width="0.6"
        points="12,2 15,10 23,10 17,15 19,22 12,18 5,22 7,15 1,10 9,10" />
    </svg>
    <div class="node-label">{{ data.label }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});

const nodeStyle = {
  width: '180px',
  height: '180px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
</script>

<style scoped>
.star-node {
  text-align: center;
  font-size: 14px;
}
.node-label {
  position: absolute; 
  top: 50%;           
  left: 50%;          
  transform: translate(-50%, -50%); 
  font-weight: bold;
  color: black; 
}
</style>
