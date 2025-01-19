<script setup lang="ts">

import { Line, Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  type ChartData,
  type Plugin,
  Chart,
  Filler,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Filler);

interface SACData {
  title: string;
  subtitle: string;
  percentage: number;
  iconColor: string;
  icon: string;
  chartData: ChartData<'line'>;
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface BarChartData {
  labels: string[];
  datasets: ChartDataset[];
}

const LineChart = defineComponent({
  props: {
    chartData: {
      type: Object as PropType<ChartData<'line'>>,
      required: true,
    },
  },
  setup(props) {
    return () => h(Line, {
      data: props.chartData,
      options: {
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: { legend: { display: false } },
        elements: { line: { tension: 0.4 }, point: { radius: 0 } },
      },
    });
  },
});

const BarChart = defineComponent({
  props: {
    chartData: {
      type: Object as () => BarChartData,
      required: true,
    },
  },
  setup(props) {
    return () => h(Bar, {
      data: props.chartData,
      options: {
        responsive: true,
        plugins: { 
          legend: { 
            display: true, 
            labels: { color: 'white' },
          } 
        },
        scales: {
          x: {
            ticks: {
              color: 'white',
            },
          },
          y: {
            ticks: {
              color: 'white', 
            },
          },
        },
      },
    });
  },
});

const HorizontalBarChart = defineComponent({
  props: {
    chartData: {
      type: Object as () => BarChartData,
      required: true,
    },
  },
  setup(props) {
    return () => h(Bar, {
      data: props.chartData,
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false, labels: {color: 'white'} } },
        scales: {
          x: {
            ticks: {
              color: 'white',
            },
          },
          y: {
            ticks: {
              color: 'white', 
            },
          },
        },
      },
    });
  },
});

const StackedLineChart = defineComponent({
  props: {
    chartData: {
      type: Object as PropType<ChartData<'line'>>,
      required: true,
    },
  },
  setup(props) {
    return () => h(Line, {
      data: props.chartData,
      options: {
        responsive: true,
        scales: {
          x: { 
                display: true, 
                ticks: {
                    color: 'white',
                }, 
            },
          y: { 
                display: true, 
                stacked: true,
                ticks: {
                    color: 'white',
                }, 
            }, 
        },
        plugins: { legend: { display: true, labels: {color: 'white'} } },
      },
    });
  },
});

const DoughnutChart = defineComponent({
  props: {
    chartData: {
      type: Object as PropType<ChartData<'doughnut'>>,
      required: true,
    },
  },
  setup(props) {
    const centerTextPlugin: Plugin<'doughnut'> = {
      id: 'centerText',
      afterDraw(chart: Chart<'doughnut'>) {
        const { ctx, width, height } = chart;
        ctx.save();

        const text = '10%';
        const subText = '% Abertos';

        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#FF5252';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const textY = height / 2 - 10;
        ctx.fillText(text, width / 2, textY); 

        ctx.font = 'normal 16px Arial';
        ctx.fillStyle = '#FFFFFF';    
        const subTextY = height / 2 + 24;
        ctx.fillText(subText, width / 2, subTextY); 

        ctx.restore();
      }
    };

    return () => h(Doughnut, {
      data: props.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        
        cutout: '80%',
      },
      plugins: [centerTextPlugin],
      style: { width: '100%', height: 'auto' },
    });
  },
});

const mockChartData = {
  sacData: [
    {
      title: 'SAC Data 1',
      subtitle: 'Current Quarter Performance',
      percentage: 12,
      iconColor: 'primary',
      icon: 'mdi-chart-line',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'SAC Data 1',
          data: [70, 65, 80, 90, 85],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        }],
      },
    },
    {
      title: 'SAC Data 2',
      subtitle: 'Quarterly Progress',
      percentage: -5,
      iconColor: 'success',
      icon: 'mdi-chart-bar',
      chartData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'SAC Data 2',
          data: [85, 80, 75, 70, 65],
          borderColor: '#FF5252',
          backgroundColor: 'rgba(255, 82, 82, 0.2)',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        }],
      },
    },
    {
      title: 'SAC Data 3',
      subtitle: 'Customer Support',
      percentage: 20,
      iconColor: 'info',
      icon: 'mdi-chart-line',
      chartData: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'SAC Data 3',
          data: [50, 60, 70, 80, 90],
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        }],
      },
    },
    {
      title: 'SAC Data 4',
      subtitle: 'Quarter Highlights',
      percentage: 5,
      iconColor: 'warning',
      icon: 'mdi-chart-line',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'SAC Data 4',
          data: [30, 40, 50, 60, 70],
          borderColor: '#FFC107',
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        }],
      },
    },
  ],

  barChartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Novos Chamados',
        data: [45, 60, 75, 85, 90, 100, 120, 140, 150, 160, 180, 190],
        backgroundColor: '#2196F3',
      },
      {
        label: 'Total Fechados',
        data: [30, 55, 70, 85, 100, 110, 130, 150, 165, 170, 190, 200],
        backgroundColor: '#4CAF50',
      },
    ],
  },

  horizontalBarChartData: {
    labels: ['Support', 'Access', 'Issues', 'Miscellaneous', 'Create User', 'Link Company'],
    datasets: [{
      label: 'Quantidade',
      data: [50, 40, 30, 20, 10, 5],
      backgroundColor: '#FF5252',
    }],
  },

  userCallHorizontalData: {
    labels: ['User1', 'User2', 'User3', 'User4', 'User5', 'User6'],
    datasets: [{
      label: 'Quantidade',
      data: [30, 25, 20, 15, 10, 5],
      backgroundColor: '#FF5252',
    }],
  },

  stackedLineChartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Opened Cases',
        data: [100, 110, 120, 130, 140, 150, 160],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
      },
      {
        label: 'Closed Cases',
        data: [90, 100, 110, 120, 130, 140, 150],
        borderColor: '#FF5252',
        backgroundColor: 'rgba(255, 82, 82, 0.2)',
        fill: true,
      },
    ],
  },

  doughnutChartData: {
    labels: ['Closed', 'Opened'],
    datasets: [
      {
        data: [10, 90],
        backgroundColor: ['#FF5252', '#4CAF50'],
      },
    ],
  },

  lineChartOptions: {
    responsive: true,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: { legend: { display: false } },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } },
  },

  barChartOptions: {
    responsive: true,
    plugins: { 
      legend: { display: true, labels: { color: 'white' } },
    },
    scales: {
      x: { ticks: { color: 'white' } },
      y: { ticks: { color: 'white' } },
    },
  },

  doughnutChartOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: '80%',
  },
};



</script>

<template>
    <div ref="downloadContent">
      <v-row class="ma-4">
        <v-col cols="3" v-for="(data, index) in mockChartData.sacData" :key="index">
          <v-card class="custom-card">
            <v-row class="d-flex align-center" no-gutters>
              <v-col cols="3" class="d-flex justify-center align-center">
                <v-avatar :color="data.iconColor" size="large">
                  <v-icon :icon="data.icon"></v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="9">
                <v-card-title class="mb-0">{{ data.title }}</v-card-title>
                <v-card-subtitle class="mt-0">{{ data.subtitle }}</v-card-subtitle>
              </v-col>
            </v-row>
  
            <v-row class="d-flex justify-between align-center mb-2">
              <v-col cols="6" class="d-flex align-center">
                <v-chip :color="data.percentage >= 0 ? 'green' : 'red'" dark>
                  {{ data.percentage >= 0 ? '+' : '' }}{{ data.percentage }}% vs. Last Year
                </v-chip>
              </v-col>
  
              <v-col cols="6" class="chart-container">
                <LineChart :chartData="data.chartData" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row class="ma-4">
        <v-col cols="7">
          <v-card class="custom-second-card">
            <v-card-title>Chamados ao longo do tempo</v-card-title>
            <v-row>
              <v-col>
                <BarChart :chartData="mockChartData.barChartData" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
  
        <v-col cols="5">
          <v-card class="custom-second-card">
            <v-card-title>Diversidade de Chamados</v-card-title>
            <v-row>
              <v-col>
                <HorizontalBarChart :chartData="mockChartData.horizontalBarChartData" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row class="ma-4">
        <v-col cols="7">
          <v-card class="custom-second-card">
            <v-card-title>Chamados aberto ao longo do tempo</v-card-title>
            <v-row>
              <v-col cols="8">
                <StackedLineChart :chartData="mockChartData.stackedLineChartData" />
              </v-col>
              <v-col cols="4">
                <DoughnutChart :chartData="mockChartData.doughnutChartData" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
  
        <v-col cols="5">
          <v-card class="custom-second-card">
            <v-card-title>Total Chamados por usuário</v-card-title>
            <v-row>
              <v-col>
                <HorizontalBarChart :chartData="mockChartData.userCallHorizontalData" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>

<style lang="css" scoped>

.scrollable-content {
    overflow-x: auto;
}

.custom-card {
    background-color: #2C3E50;
    color: white;
    height: 200px;
    position: relative;
    overflow: hidden;
    padding: 10px;
    border-radius: 15px;
}

.custom-second-card {
    background-color: #2C3E50;
    color: white;
    height: 100%;
    position: relative;
    overflow: hidden;
    padding: 10px;
    border-radius: 15px;
}
  
.chart-container {
    height: 50px;
    width: 100%;
    margin: 0px;
    padding: 0px;
}
  
.chartjs-render-monitor {
    height: 100% !important;
}

</style>