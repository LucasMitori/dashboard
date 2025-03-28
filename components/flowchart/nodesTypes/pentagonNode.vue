<template>
  <div class="custom-node pentagon-node" :style="nodeStyle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
      <polygon fill="#00b4d8" stroke="none"
        points="12,2 20,8 17,20 7,20 4,8" />
      <polygon fill="none" stroke="#1e88e5" stroke-width="1"
        points="12,2 20,8 17,20 7,20 4,8" />
    </svg>
    <div class="node-label">{{ data.label }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
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
.pentagon-node {
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
