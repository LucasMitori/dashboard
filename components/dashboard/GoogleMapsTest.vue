<script setup lang="ts">
import { ref, onMounted } from 'vue'

declare const google: any

const chartDiv = ref<HTMLElement | null>(null)

function drawMap() {
  const data = google.visualization.arrayToDataTable([
    ['Country', 'Population'],
    ['China', 'China: 1,363,800,000'],
    ['India', 'India: 1,242,620,000'],
    ['US', 'US: 317,842,000'],
    ['Indonesia', 'Indonesia: 247,424,598'],
    ['Brazil', 'Brazil: 201,032,714'],
    ['Pakistan', 'Pakistan: 186,134,000'],
    ['Nigeria', 'Nigeria: 173,615,000'],
    ['Bangladesh', 'Bangladesh: 152,518,015'],
    ['Russia', 'Russia: 146,019,512'],
    ['Japan', 'Japan: 127,120,000']
  ])

  const options = {
    showTooltip: true,
    showInfoWindow: true
  }

  if (chartDiv.value) {
    const map = new google.visualization.Map(chartDiv.value)
    map.draw(data, options)
  }
}

onMounted(() => {
  google.charts.load('current', {
    packages: ['map'],
    mapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
  })

  google.charts.setOnLoadCallback(drawMap)
})
</script>

<template>
  <div ref="chartDiv" style="width: 100%; height: 500px;"></div>
</template>

