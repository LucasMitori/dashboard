<template>
  <div class="custom-node circle-node" :style="nodeStyle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="30" fill="none" stroke="#ff5722" stroke-width="2" />
      <circle cx="50" cy="50" r="30" fill="#ffccbc" />
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
.circle-node {
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
