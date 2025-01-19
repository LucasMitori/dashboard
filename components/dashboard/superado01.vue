<script setup lang="ts">
import { ref } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

interface ItemApi {
  [key: string]: any;
}

interface DataRow {
  [key: string]: any;
}

interface GraphicData {
  key: string;
  value: number;
}

interface TableData {
  key: string;
  value: any;
  headers: any;
  data: any;
}

const props = defineProps({
  data: {
    type: Array as () => ItemApi[],
    required: true,
  },
  dataTest: {
    type: Object,
    required: true,
  }
});

const { t: $t } = useI18n();
const chartTitle = ref('Chart Title');
const chartType = ref('line');
const selectedMonth = ref('');
const dialog = ref(false);
const rows = ref<ItemApi[]>(props.data);
const pairedData = ref<any[]>([]);
const isLoading = ref(true);
const searchItem = ref({ value: '' }); 
const loading = ref(false);
const pageNumber = ref(1);
const page = ref({
    itemsPerPage: 10,
    serverItems: [] as any[],
    loading: true,
    totalItems: 0,
    name: '',
    calories: '',
    search: '',
})
const tableHeaders = ref<any[]>([]);

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
    totalAnswered.value = mockMonthData.value.reduce((sum, val) => sum + val, 0);
});

watch(() => props.data, (newData) => {
    rows.value = newData;
    console.log("rows: ", rows.value);
    // console.log("rows.length: ", rows.value.length);
    // console.log("props.data: ", props.data);
    // console.log("props.dataTest: ", props.dataTest);
    //console.log("table headers: ", tableHeaders.value);
});


const updateTable = async function () {
    searchItem.value.value = '';
    loading.value = true; 
    await load();

    setTimeout(() => {
        loading.value = false; 
    }, 2000);
}

function processData(data: Record<string, any>[], headers: any[]): { graphics: Record<number, GraphicData[][]>, tables: Record<number, TableData[]>, tableHeaders: any[] } {
  const graphics: Record<number, GraphicData[][]> = {};
  const tables: Record<number, TableData[]> = {};
  const tableHeaders: any[] = [];

  const headerMap = new Map(headers.map(header => [header.value, header]));

  const headerStructure = (header: any) => ({
    title: header.text,
    align: header.align || 'start',
    sortable: header.filterable || false,
    key: header.value,
    width: header.width || 'auto',
  });

  headers.forEach(header => {
    tableHeaders.push(headerStructure(header));
  });

  data.forEach((item, index) => {
    const numericValues: GraphicData[] = [];
    const otherValues: TableData[] = [];

    Object.keys(item).forEach(key => {
      const value = item[key];
      const headerInfo = headerMap.get(key);

      if (headerInfo) {
        const dataItem = { key: headerInfo.text, value, headers: headerInfo, data: item };

        if (typeof value === 'number' && !isNaN(value)) {
          numericValues.push(dataItem);
        } else {
          otherValues.push(dataItem);
        }
      }
    });

    const graphicPairs: GraphicData[][] = [];
    for (let i = 0; i < numericValues.length; i += 2) {
      const pair = numericValues.slice(i, i + 2);
      if (pair.length === 2) {
        graphicPairs.push(pair);
      }
    }

    tables[index] = otherValues.map(item => ({
      ...item,
    }));

    graphics[index] = graphicPairs;
  });

  return { graphics, tables, tableHeaders };
}


const graphics = ref<Record<number, GraphicData[][]>>({});
const tables = ref<Record<number, TableData[]>>({});


watchEffect(() => {
  if (rows.value.length > 0) {
    const { graphics: newGraphics, tables: newTables, tableHeaders: newTableHeaders } = processData(rows.value, props.dataTest.headers);
    graphics.value = newGraphics;
    tables.value = newTables;
    tableHeaders.value = newTableHeaders;
    console.log('Graphics:', newGraphics);
    console.log('Tables:', newTables);
    // console.log('Table Headers:', newTableHeaders);
  }
});

function getColorScheme(index: number): string[] {
  const colorSchemes = [
    ['#36A2EB', '#4BC0C0'],
    ['#FF6384', '#FFCE56'],
    ['#FF9F40', '#FFCD56'],
    ['#4BC0C0', '#36A2EB']
  ];
  return colorSchemes[index % colorSchemes.length];
}

const mock = {
    "queueid": "40000 - Salt Code",
    "received": 0,
    "answered": 0,
    "abandoned": 0,
    "abandoned_p": "0%",
    "dropouts": 0,
    "wait": 0,
    "att": 0.0,
    "awt": 0.0,
    "logged_in": 1,
    "available": 1,
    "date": "2024-09-09"
}

const selectedChartIndex = ref<number | null>(null);
const selectedPair = ref<string | null>(null);
const selectedDestination = ref<string | null>(null);

const graphicsIndices = computed(() => Object.keys(graphics.value).map(Number));

const availablePairs = computed(() => {
  if (selectedChartIndex.value !== null) {
    return graphics.value[selectedChartIndex.value].map(
      pair => `${pair[0].key} & ${pair[1].key}`
    );
  }
  return [];
});

const reorderPairs = () => {
  if (
    selectedChartIndex.value !== null &&
    selectedPair.value !== null &&
    selectedDestination.value !== null
  ) {
    const chart = graphics.value[selectedChartIndex.value];
    const sourceIndex = availablePairs.value.indexOf(selectedPair.value);
    const destinationIndex = availablePairs.value.indexOf(selectedDestination.value);

    if (sourceIndex !== -1 && destinationIndex !== -1) {
      // Swap the pairs
      const temp = chart[sourceIndex];
      chart[sourceIndex] = chart[destinationIndex];
      chart[destinationIndex] = temp;
    }
  }
};

</script>

<template>
    <v-row v-if="rows.length > 0">
      <v-col v-for="(item, index) in rows" :key="index" class="mb-8" cols="12" md="12">
        <v-card class="mb-5 elevation-5" rounded="10" flat>
          <v-toolbar density="compact" class="ravena-secondary">
            <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
            <v-toolbar-title style="color:white">{{ item.queueid || item.user_description }}</v-toolbar-title>
          </v-toolbar>
        </v-card>
  
        <v-row>
          <v-col v-for="(pair, pairIndex) in graphics[index]" :key="pairIndex" cols="3">
            <v-card class="text-center ravena-background-3" dark>
              <v-card-title>{{ pair[0].key }} & {{ pair[1].key }}</v-card-title>
              <v-card-text>
                <Bar
                  :data="generateBarChartData(pair[0].key, pair[0].value, pair[1].key, pair[1].value, getColorScheme(pairIndex))"
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
                  <v-col
                    v-for="(itemTable, tableIndex) in tables[index]"
                    :key="tableIndex"
                    cols="auto"
                    class="d-flex align-center"
                  >
                    <v-icon color="primary">mdi-information-outline</v-icon>
                    <span class="ml-2">{{ itemTable.key }}: {{ itemTable.value }}</span>
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
                />
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
                        <span v-if="expanded" key="0">Data: {{ item.date }}</span>
                        <span v-else key="1">Detalhes</span>
                        </v-fade-transition>
                    </v-col>
                    </v-row>
                </template>
                </v-expansion-panel-title>
    
                <v-expansion-panel-text>
                <v-row>
                    <v-col cols="12">
                    <v-card>
                        <v-data-table-server
                        v-model:items-per-page="page.itemsPerPage"
                        :headers="tableHeaders as Array<any>"
                        :items="[item]"
                        :items-length="1"
                        :loading="loading"
                        :search="page.search"
                        item-value="key"
                        @update:options="load"
                        >
                        </v-data-table-server>
                    </v-card>
                    </v-col>
                </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>

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
                    <!-- Select the chart (index) -->
                    <v-col cols="6">
                      <v-select
                        v-model="selectedChartIndex"
                        :items="graphicsIndices"
                        label="Select Chart"
                        placeholder="Choose a chart"
                      />
                    </v-col>
              
                    <!-- Select the pair to move -->
                    <v-col cols="6">
                      <v-select
                        v-model="selectedPair"
                        :items="availablePairs"
                        label="Select Pair to Move"
                        placeholder="Choose a pair"
                      />
                    </v-col>
              
                    <!-- Select the target position -->
                    <v-col cols="6">
                      <v-select
                        v-model="selectedDestination"
                        :items="availablePairs"
                        label="Select Target Position"
                        placeholder="Choose destination"
                      />
                    </v-col>
              
                    <v-col cols="6">
                      <v-btn color="primary" @click="reorderPairs">Apply Reorder</v-btn>
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
  
    <v-row v-else class="d-flex justify-center align-center">
      <v-col cols="12">
        <v-card class="mb-5 elevation-5" rounded="10" flat>
          <v-toolbar density="compact" class="ravena-secondary">
            <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
            <v-toolbar-title style="color:white">Data Overview</v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" class="text-center">
        <v-card class="elevation-3 pa-5 ravena-background-4">
          <v-icon color="white" size="48">mdi-database-off</v-icon>
          <h3 class="mt-2" style="color: white">No Data Available</h3>
          <p class="text-grey">
            There is currently no data to display. Please check back later or adjust your filters.
          </p>
        </v-card>
      </v-col>
    </v-row>
</template>
  

<style lang="css" scoped>
.text-center h3 {
  color: #424242;
  font-weight: 500;
}
.text-grey {
  color: #9e9e9e;
}
</style>