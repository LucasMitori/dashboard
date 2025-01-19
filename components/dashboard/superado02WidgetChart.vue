<script setup lang="ts">
import { ref } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

interface ItemApi {
  id: number;
  queueid: string;
  [key: string]: any;
}


const props = defineProps({
  data: {
    type: Array as () => ItemApi[],
    required: true,
  }
});

const chartTitle = ref('Chart Title');
const chartType = ref('line');
const loading = ref(false);
const selectedMonth = ref('');
const dialog = ref(false);
const rows = ref<ItemApi[]>(props.data);

const months = [
  { name: 'January', data: [120, 130, 125, 145, 160, 170, 155, 140, 135, 150, 165, 180] },
  { name: 'February', data: [130, 120, 135, 125, 160, 140, 155, 165, 145, 150, 135, 170] },
  { name: 'March', data: [150, 140, 155, 165, 175, 160, 145, 135, 150, 160, 170, 180] },
  { name: 'April', data: [160, 170, 155, 140, 135, 145, 150, 160, 170, 175, 180, 190] },
  { name: 'May', data: [140, 150, 160, 170, 180, 190, 165, 155, 145, 135, 130, 120] },
  { name: 'June', data: [125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235] },
  { name: 'July', data: [110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220] },
  { name: 'August', data: [115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225] },
  { name: 'September', data: [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245] },
  { name: 'October', data: [145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255] },
  { name: 'November', data: [160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270] },
  { name: 'December', data: [180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290] },
];

const mockMonthData = ref(months[0].data);

const load = () => {
        loading.value = true
        setTimeout(() => (loading.value = false), 3000)
}

const generateBarChartData = (label1: any, value1: any, label2: any, value2: any, colors: any) => ({
  labels: [label1, label2],
  datasets: [
    {
      label: 'Dados',
      backgroundColor: colors,
      data: [value1, value2],
    },
  ],
});

const generateLineChartData = (item: any) => ({
  labels: ['Recebidas', 'Atendidas', 'Abandonadas', 'Abandonada_%', 'Desistente', 'Em Espera', 'Logados', 'Disponíveis'],
  datasets: [{
    label: `Porcentagem %`,
    backgroundColor: '#36A2EB',
    borderColor: '#36A2EB',
    data: [item.received, item.answered, item.abandoned, parseFloat(item.abandoned_p), item.dropouts, item.wait, item.logged_in, item.available],
    fill: false,
    tension: 0.4
  }]
});

const applyChartSettings = () => {
  // Logic 
};

const saveSettings = () => {
  const selected = months.find(month => month.name === selectedMonth.value);
  if (selected) {
    mockMonthData.value = selected.data;
  }
  dialog.value = false;
};

const openDialog = () => {
  dialog.value = true;
};

const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]
  
  const selectedGradient = ref(gradients[2]);

const getStatusText = (status: string) => {
  switch (status) {
    case 'waiting':
      return 'Waiting';
    case 'ready':
      return 'Ready';
    case 'onHold':
      return 'On Hold';
    case 'warning':
      return 'Warning';
    default:
      return 'Unknown';
  }
};

const statusClass = (status: string) => {
  switch (status) {
    case 'waiting':
      return 'text-blue';
    case 'ready':
      return 'text-green';
    case 'onHold':
      return 'text-yellow';
    case 'warning':
      return 'text-red'; 
    default:
      return 'text-grey';
  }
};

const totalAnswered = ref(0);
watchEffect(() => {
    rows.value = props.data;
    console.log("rows: ", rows.value);
    totalAnswered.value = mockMonthData.value.reduce((sum, val) => sum + val, 0);
});

</script>

<template>
    <v-row v-for="(item, index) in rows" :key="index" class="mb-8">
        <v-col cols="12" md="12">
            <v-card class="mb-5 elevation-5" rounded="10" flat>
                <v-toolbar density="compact" class="ravena-secondary">
                <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
                <v-toolbar-title style="color:white">{{ item.queueid }}</v-toolbar-title>
                </v-toolbar>
            </v-card>
            <v-row>

            <v-col cols="3">
                <v-card class="text-center ravena-background-3" dark>
                <v-card-title>Recebidas e Atendidas</v-card-title>
                <v-card-text>
                    <Bar
                    :data="generateBarChartData('Recebidas', item.received, 'Atendidas', item.answered, ['#36A2EB', '#4BC0C0'])"
                    :options="{ responsive: true }"
                    />
                </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="3">
                <v-card class="text-center ravena-background-3" dark>
                <v-card-title>Abandonadas e Abandonada_%</v-card-title>
                <v-card-text>
                    <Bar
                    :data="generateBarChartData('Abandonadas', item.abandoned, 'Abandonada_%', parseFloat(item.abandoned_p), ['#FF6384', '#FFCE56'])"
                    :options="{ responsive: true }"
                    />
                </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="3">
                <v-card class="text-center ravena-background-3" dark>
                <v-card-title>Desistente e Em Espera</v-card-title>
                <v-card-text>
                    <Bar
                    :data="generateBarChartData('Desistente', item.dropouts, 'Em Espera', item.wait, ['#FF9F40', '#FFCD56'])"
                    :options="{ responsive: true }"
                    />
                </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="3">
                <v-card class="text-center ravena-background-3" dark>
                <v-card-title>Logados e Disponíveis</v-card-title>
                <v-card-text>
                    <Bar
                    :data="generateBarChartData('Logados', item.logged_in, 'Disponíveis', item.available, ['#4BC0C0', '#36A2EB'])"
                    :options="{ responsive: true }"
                    />
                </v-card-text>
                </v-card>
            </v-col>
            </v-row>

            <v-row class="mt-2">
                <v-col cols="12">
                  <v-divider inset></v-divider>
                  <v-row class="d-flex justify-space-between align-center mt-2">
                    <v-col cols="auto">
                      <v-row>
                        <v-col cols="auto" class="d-flex align-center">
                          <v-icon color="primary">mdi-timer</v-icon>
                          <span class="ml-2">TMA: {{ item.att }} sec</span>
                        </v-col>
                        <v-col cols="auto" class="d-flex align-center ml-4">
                          <v-icon color="primary">mdi-clock-outline</v-icon>
                          <span class="ml-2">TME: {{ item.awt }} sec</span>
                        </v-col>
                      </v-row>
                    </v-col>
              
                    <v-col cols="auto" class="d-flex align-center">
                      <span>Status:</span>
                      <span :class="statusClass('ready')" class="ml-2 font-weight-bold">{{ getStatusText('ready') }}</span>
                    </v-col>
              
                    <v-col cols="auto">
                      <v-btn
                        :loading="loading"
                        class="flex-grow-1"
                        size="small"
                        variant="tonal"
                        @click="load"
                        icon="mdi-refresh"
                      >
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
            </v-row>
              
            <v-expansion-panels class="mt-5">
            
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        <template v-slot:default="{ expanded }">
                        <v-row no-gutters>
                            <v-col cols="4" class="d-flex justify-start">
                            Resumo - {{ item.queueid }}
                            </v-col>
                            <v-col cols="8" class="text-grey">
                            <v-fade-transition leave-absolute>
                                <span v-if="expanded" key="0">Data: {{item.date}}</span>
                                <span v-else key="1">Detalhes</span>
                            </v-fade-transition>
                            </v-col>
                        </v-row>
                        </template>
                    </v-expansion-panel-title>
    
                    <v-expansion-panel-text>
                        <v-row>
                        <v-col cols="12">
                            <Line :data="generateLineChartData(item)" :options="{ responsive: true }" />
                        </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel>
                    <v-expansion-panel-title>
                        <v-row no-gutters>
                        <v-col cols="4" class="d-flex justify-start">Configuration</v-col>
                        <v-col cols="8" class="text-grey">
                            <v-fade-transition leave-absolute>
                            <span key="1">Chart Settings</span>
                            </v-fade-transition>
                        </v-col>
                        </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="chartTitle" label="Chart Title" placeholder="Enter chart title" />
                        </v-col>
                        <v-col cols="6">
                            <v-select v-model="chartType" :items="['line', 'bar', 'pie']" label="Select Chart Type" />
                        </v-col>
                        <v-col cols="6">
                            <v-btn color="primary" @click="applyChartSettings">Apply Settings</v-btn>
                        </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel>
                    <v-expansion-panel-title>
                      <v-row no-gutters>
                        <v-col cols="4" class="d-flex justify-start">Month Data</v-col>
                        <v-col cols="8" class="text-grey">
                          <v-fade-transition leave-absolute>
                            <span key="1">Monthly Call Development</span>
                          </v-fade-transition>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-title>
                  
                    <v-expansion-panel-text>
                      <v-row>
                        <v-col cols="12">
                          <v-card class="mx-auto text-center" color="#104666" max-width="100%" dark>
                            <v-card-text>
                              <v-sheet color="rgba(0, 0, 0, .12)">
                                <v-sparkline
                                  :model-value="mockMonthData"
                                  color="rgba(255, 255, 255, .87)"
                                  height="100"
                                  padding="24"
                                  stroke-linecap="round"
                                  smooth
                                  :gradient="selectedGradient"
                                >
                                  <template v-slot:label="item">
                                    {{ item.value }}
                                  </template>
                                </v-sparkline>
                              </v-sheet>
                            </v-card-text>
                  
                            <v-card-text>
                              <div class="text-h4 font-weight-thin">Número total de Atendimentos: {{ totalAnswered }}</div>
                            </v-card-text>
                  
                            <v-divider></v-divider>
                  
                            <v-card-actions class="justify-center">
                              <v-btn @click="openDialog" variant="text" block>Open Settings</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                  
                <v-dialog v-model="dialog" max-width="400px">
                    <v-card>
                      <v-card-title>Select Month</v-card-title>
                  
                      <v-card-text>
                        <v-form>
                          <v-select
                            v-model="selectedMonth"
                            :items="months.map(month => month.name)"
                            label="Select a Month"
                          />
                        </v-form>
                      </v-card-text>
                  
                      <v-card-actions>
                        <v-btn color="primary" @click="saveSettings">Save</v-btn>
                        <v-btn color="secondary" @click="dialog = false">Cancel</v-btn>
                      </v-card-actions>
                    </v-card>
                </v-dialog>
                  
            </v-expansion-panels>
        </v-col>
    </v-row>
</template>

<style lang="css" scoped>

</style>