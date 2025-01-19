<script setup lang="ts">
import { computed, ref, watchEffect, type PropType } from 'vue';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'vue-chartjs';

ChartJS.register(
  BarElement,
  LineElement,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string[];
}

interface ChartData {
  datasets: Dataset[]; // Fixed to be "datasets" instead of "chart_data"
  labels: string[];
}

interface DataWidget {
  id: number;
  type: number;
  title: string;
  description: string;
  icon: string;
  style: string | null;
  exportable: boolean;
  filterable: boolean;
  filters: Array<any>;
  headers: Record<string, any>;
  data: ChartData; // Data has datasets and labels
  defaults: Record<string, any>;
}

const props = defineProps({
  dataWidget: {
    type: Array as PropType<DataWidget[]>,
    default: () => [],
    required: true,
  },
  build: {
    type: Object as PropType<{ widgets: { cols: number }[] }>,
    required: true,
  },
});

// Get appropriate chart component based on widget type
const getChartComponent = (type: number) => {
  switch (type) {
    case 5:
      return Bar;
    case 6:
      return Line;
    case 7:
      return Pie;
    case 8:
      return Doughnut;
    case 9:
      return Radar;
    case 11:
      return PolarArea;
    default:
      return Bar;
  }
};

// Prepare the chart data
const getChartData = (widget: DataWidget) => {
  return {
    labels: widget.data.labels || [], // Use labels from data
    datasets: widget.data.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor || []
    }))
  };
};

// Get chart options based on the type
const getChartOptions = (type: number) => {
  let position: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'top';

  if (type === 11) {
    position = 'right'; // Example for PolarArea chart
  }

  return {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: position,
      },
      tooltip: {
        enabled: true,
      },
    },
  };
};

watchEffect(() => {
  console.log('dataWidget', props.dataWidget);
  console.log('build', props.build);
});
</script>

<template>
    <!-- <div v-if="!dataWidget.length">
      <v-row justify="center" align="center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-row>
    </div>
  
    <div v-else>
      <template v-for="(widget, index) in dataWidget" :key="index">
        <p>{{widget}}</p>
        <p>{{build.widgets[index]}}</p>
        <v-row>
          <v-col :cols="build.widgets[index]?.cols || 12">

              <v-toolbar color="secondary">
                <v-btn :icon="widget.icon"></v-btn>
                <v-toolbar-title>{{ widget.title }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
  
              <component
                :is="getChartComponent(widget.type)"
                :data="getChartData(widget)"
                :options="getChartOptions(widget.type)"
              /> 
          </v-col>
        </v-row>
      </template>
    </div> -->
  </template>
  