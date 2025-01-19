<script setup lang="ts">
import { AVWaveform } from 'vue-audio-visual'
const props = defineProps({
  audioSrc: {
    type: String,
    required: true,
  },
});

const audioSrc = ref(props.audioSrc);
</script>

<template>
    <AVWaveform 
    played-line-color="#104666"
    playtime-text-bottom
    :src="audioSrc"/>
</template>

