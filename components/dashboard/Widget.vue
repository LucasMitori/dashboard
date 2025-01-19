<script setup lang="ts">
import DynamicChart from '../charts/DynamicChart.vue';
import AgentControl from './AgentControl.vue';

interface DataResult {
  queueid: string;
  received: number;
  answered: number;
  abandoned: number;
  abandoned_p: string;
  dropouts: number;
  wait: number;
  logged_in: number;
  available: number;
  att: number;
  awt: number;
  date: string;
  label?: string;
  data?: string;
}

export interface WidgetResponse {
  data: {
    title: string;
    icon?: string;
    type: number;
    headers?: { value: keyof DataResult; text: string; [key: string]: any }[];
    data: {
      results: DataResult[];
      chart_data?: any;
      html?: string;
      classes?: string;
      style?: string;
    };
    description?: string;
    filters?: {
      cols: number;
      label: string;
      value: any;
      options: any[];
      type: string;
    }[];
    exportable?: boolean;
    filterable?: boolean;
  };
  build?: {
    cols: number;
  };
}

interface FilterField {
  id?: number;
  label: string;
  value: any;
  options: any[];
  type: string;
  multiple: boolean;
  cols?: string;
  attrs?: {
    cols?: number;
    sm?: number;
    md?: number;
    class?: string;
    style?: string;
  };
  name: string;
  required: boolean;
  loading: boolean;
}

interface Tab {
  icon: string;
  name: string;
  label: string;
  fields: FilterField[];
}

interface ConfigField {
  type: string;
  name: string;
  method: string;
  tabs: Tab[];
}

interface FilterObject {
  tabname: string;
  fields: FilterField[];
}

const props = defineProps({
  dataWidget: {
    type: Array as PropType<WidgetResponse[]>,
    default: () => [],
    required: true,
  },
  form:{
    type: Object,
    default: () => {},
    required: true
  }
});

const loaded = ref(false);
const data = ref(computed(() => props.dataWidget.map(widget => widget.data)));
const dataBuild = ref(computed(() => props.dataWidget.map(widget => widget.build)));
const selectedItem = ref<DataResult | null>(null);
const dialogVisible = ref(false);
const activeTabName = ref<string>('');
const activeFilters = ref<FilterField[]>([]);
const filterDialogVisible = ref(false);
const { t: $t } = useI18n();

const openDialog = (item: DataResult) => {
  selectedItem.value = item;
  dialogVisible.value = true;
};

// console.log("data", data.value);

watch(
  () => props.dataWidget,
  (newVal) => {
    if (newVal.length) {
      loaded.value = true; 
    } else {
      loaded.value = false;
    }
  },
  { immediate: true }
);

const getWidgetHeaders = (widgetIndex: number) => {
  const headers = props.dataWidget[widgetIndex]?.data.headers || [];
    // console.log("headers", headers);
  return headers.map((header) => ({
    title: header.text,
    align: header.align || 'start',
    sortable: header.filterable || false,
    cellClass: header.cellClass || null,
    cellStyle: header.cellStyle || null,
    key: header.value,
    width: header.value === 'queueid' ? '200px' : '150px',
    backgroundColor: header.backgroundColor || null,
    icon: header.icon || null,
    textColor: header.textColor || null,
    chip: header.chip || false,
  }));
};

const parseDataField = (input: string | undefined) => {
    // console.log("input", input);
  if (typeof input !== 'string') {
    return {
      value: input || '', 
      icon: null,
      backgroundColor: null,
      textColor: null,
    };
  }

  const parts = input.split(';');
  return {
    value: parts[0] || '',
    icon: parts[1] || null,
    backgroundColor: parts[2] || null,
    textColor: parts[3] || null,
  };
};


const parseItem = (input: string): Record<string, string> => {
  return input
    .split(';')
    .reduce((result, rule) => {
      const [key, value] = rule.split(':').map(item => item.trim());
      if (key && value) {
        result[key] = value;
      }
      return result;
    }, {} as Record<string, string>);
};

// Valid icons
const validIcons = [
  'mdi-text-long',
  'mdi-test',
  'mdi-phone-plus',
  'mdi-face-agent',
  'mdi-account-group',
];

const getValidIcon = (icon: string) => {
  return validIcons.includes(icon) ? icon : 'mdi-text-long';
};

const isFullscreen = ref(false);

function toggleFullscreen() {
  if (!isFullscreen.value) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
  isFullscreen.value = !isFullscreen.value;
}

function exportToCsv(widgetResponse: any) {
  const csvRows = [];
  const headers = widgetResponse.headers.map((header: any) => header.text).join(',');
  csvRows.push(headers);

  widgetResponse.data.results.forEach((row: any) => {
    const values = widgetResponse.headers.map((header: any) => row[header.value]).join(',');
    csvRows.push(values);
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${widgetResponse.title}.csv`;
  link.click();
}

function openFilterDialog(filters: any, widgetType: number) {
  activeFilters.value = [];

  if (filters.length > 0) {
    const filterObj = filters[0];

    activeTabName.value = filterObj.tabname || 'Filters';

    activeFilters.value = [...(filterObj.fields || [])];

    switch (widgetType) {
      case 1:
        activeFilters.value.push({
          attrs: { cols: 12, sm: 12, md: 12, class: 'd-flex justify-start', style: 'padding-right: 10px' },
          type: 'datetimePicker',
          name: 'date_picker_first',
          label: $t('date_picker'),
          required: true,
          loading: false,
          value: null,
          options: [],
          multiple: false,
        });
        activeFilters.value.push({
          attrs: { cols: 12, sm: 12, md: 12, class: 'd-flex justify-start', style: 'padding-right: 10px' },
          type: 'datetimePicker',
          name: 'date_picker_second',
          label: $t('date_picker'),
          required: true,
          loading: false,
          value: null,
          options: [],
          multiple: false,
        });
        break;

      case 2:
        break;
      case 3:
        break;
      default:
        break;
    }

    filterDialogVisible.value = true;
  }
}

function closeDialog() {
  filterDialogVisible.value = false;
  activeFilters.value = [];
}

function applyFilters() {
  filterDialogVisible.value = false;
}

const timerOptions = ref([0, 5, 10, 15, 30]);
let refreshInterval: NodeJS.Timeout | null = null;

function setAutoRefresh(interval: any) {
  if (refreshInterval !== null) {
    clearInterval(refreshInterval);
  }
  if (interval > 0) {
    refreshInterval = setInterval(() => {
    }, interval * 1000);
  }
}

watch(
  () => filterDialogVisible.value,
  (newVal) => {
    if (!newVal) {
      activeFilters.value = [];
    }
  }
);


watchEffect(() => {
    // console.log('dataWidget', props.dataWidget);
    // console.log("form", props.form);
    // console.log("activeFilters", activeFilters.value);
    // console.log("data: ", data.value);
    // console.log("dataBuild: ", dataBuild.value);
    console.log("widgetResponse", props.dataWidget);
});

</script>

<template>
    <v-container v-if="!loaded">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
      <p>Loading...</p>
    </v-container>
  
    <template v-else tile>
      <v-row>
        <template v-for="(widgetResponse, widgetIndex) in data" :key="widgetIndex">
          <v-col :cols="dataBuild[widgetIndex]?.cols || 12">
            <v-toolbar color="secondary" class="mb-4">
                <v-btn icon>
                  <v-icon>{{ widgetResponse.icon }}</v-icon>
                </v-btn>
                <v-toolbar-title>{{ widgetResponse.title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                
                <v-btn icon @click="toggleFullscreen">
                  <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
                </v-btn>
                
                <v-menu offset-y>
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon>
                      <v-icon>mdi-timer-sand</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="option in timerOptions" :key="option">
                      <v-list-item-title>{{ option }}s</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              
                <v-btn v-if="widgetResponse.exportable" icon @click="exportToCsv(widgetResponse)">
                  <v-icon>mdi-file-export</v-icon>
                </v-btn>
              
                <v-btn v-if="widgetResponse.filterable" icon @click="openFilterDialog(widgetResponse.filters, widgetResponse.type)">
                  <v-icon>mdi-filter</v-icon>
                </v-btn>
            </v-toolbar>

            <v-dialog v-model="filterDialogVisible" max-width="600px">
                <v-card>
                  <v-card-title class="headline">{{ activeTabName }}</v-card-title>
              
                  <v-card-text>
                    <v-form>
                      <v-row>
                        <template v-for="(field, fieldIndex) in activeFilters" :key="fieldIndex" class="pb-4">
                          <FormField :form="props.form" :field="field"/>
                        </template>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  
              
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="applyFilters">Apply</v-btn>
                    <v-btn @click="closeDialog">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
            </v-dialog>
                         
            <template v-if="widgetResponse.type === 1">
              <v-data-table-server
                :headers="getWidgetHeaders(widgetIndex)"
                :items="widgetResponse.data.results"
                :items-length="widgetResponse.data.results.length"
                item-value="queueid"
                class="elevation-1 pa-2 mb-5"
                :items-per-page="10"
                fixed-header
              >
                <template v-for="(header, index) in getWidgetHeaders(widgetIndex)" v-slot:[`item.${header.key}`]="{ item }">
                    <v-card
                    v-if="index === 0"
                    :class="header.cellClass"
                    color="primary"
                    hover
                    clickable
                    @click="openDialog(item)"
                    :style="{ 
                        ...parseItem(header.cellStyle), 
                        'font-weight': 'bold',
                        'width': '220px',
                        'height': '90%',
                        'box-sizing': 'border-box',
                        'border-radius': '5px',
                    }"
                    >
                    <v-icon v-if="header.icon" class="mr-3">{{ header.icon }}</v-icon>
                    <span style="font-weight: bold; color: white">
                        {{ parseDataField(String(item[header.key as keyof DataResult])).value }}
                    </span>
                    </v-card>
                
                    <v-card
                        v-else
                        :color="parseDataField(String(item[header.key as keyof DataResult])).backgroundColor || header.backgroundColor || 'grey'"
                        class="ma-0 pa-3 d-flex align-center"
                        hover
                        clickable
                        @click="openDialog(item)"
                        style="min-width: 170px; height: 90%; box-sizing: border-box; border-radius: 5px;"
                        >
                        <template v-if="String(header.key) === 'usuario_id'">
                            <!-- <v-btn
                            v-for="(part, index) in String(item[header.key as keyof DataResult]).split(';')"
                            :key="index"
                            icon
                            @click="handleClick(part, index)"
                            >
                            <v-icon class="mr-1">
                                {{ index === 0 ? 'mdi-account' : 'mdi-table' }}
                            </v-icon>
                            <span>
                                {{ part || '-' }}
                            </span>
                            </v-btn> -->

                            <AgentControl
                                :data="String(item[header.key as keyof DataResult])"
                            />
                        </template>

                        <template v-else>
                            <v-icon v-if="header.icon" class="mr-3" color="white">
                            {{ header.icon || 'mdi-table' }}
                            </v-icon>
                            <span :style="{ color: parseDataField(String(item[header.key as keyof DataResult])).textColor || header.textColor || 'black' }">
                            {{ parseDataField(String(item[header.key as keyof DataResult])).value }}
                            </span>
                        </template>
                        </v-card>

                </template>
              </v-data-table-server>
              <v-dialog v-model="dialogVisible" max-width="600px">
                <v-card>
                  <v-card-title class="headline">Item Details</v-card-title>
                  <p>Teste</p>
                  <!-- <v-card-text v-if="selectedItem">
                    <v-row v-for="(value, key) in selectedItem" :key="key">
                      <v-col cols="12">
                        <p><strong>{{ key }}:</strong> {{ value }}</p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialogVisible = false">Close</v-btn>
                  </v-card-actions> -->
                </v-card>
              </v-dialog>
            </template>
  
            <template v-else-if="widgetResponse.type === 2">
              <v-card class="pa-5" outlined>
                <div v-html="widgetResponse.data.html"></div>
              </v-card>
            </template>
            
            <template v-else-if="widgetResponse.type === 3">
                <component
                  :is="widgetResponse.data || 'div'"
                />
            </template>

            <template v-else-if="widgetResponse.type === 5">
              <DynamicChart
                :chartData="widgetResponse.data.chart_data"
                :chartType="widgetResponse.type"
              />
            </template>

            <template v-else-if="widgetResponse.type === 12">
                <v-card class="pa-3">
                    <template v-for="(item, index) in widgetResponse.data.results">
                      <v-row v-if="widgetResponse.data.results" :key="index" class="dense no-gutters">
                        <template v-for="header in widgetResponse.headers" :key="header.value">
                          <v-col
                            :class="'pa-1 ' + widgetResponse.data.classes || ''"
                            :style="widgetResponse.data.style || ''"
                            :cols="header.cellCols"
                          >
                            <v-card :elevation="2" :color="header.backgroundColor">
                              <v-card-title :style="'color:' + header.textColor">
                                <v-icon
                                  left
                                  :class="header.cellSubClass || ''"
                                  :style="'color:' + header.textColor + ';' + (header.cellSubStyle || '')"
                                >
                                  {{ header.icon }}
                                </v-icon>
                                <span :class="header.cellSubClass || ''" :style="header.cellSubStyle || ''">{{ header.text }}</span>
                              </v-card-title>
            
                              <v-card-text :class="header.cellClass || ''" :style="header.cellStyle || ''">
                                <p class="py-10"><span :style="'color:' + header.textColor">{{ item[header.value] }}</span></p>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </template>
                      </v-row>
                    </template>
                </v-card>
            </template>

            <!-- <div v-else-if="widgetResponse.type === 12">
                <v-card :class="widgetResponse.data.classes || ''" tile>

                  <v-toolbar flat>
                    <v-icon>{{ widgetResponse.icon || 'mdi-information-outline' }}</v-icon>
                    <v-toolbar-title>{{ widgetResponse.title || 'No Title' }}</v-toolbar-title>
                  </v-toolbar>
              
                  <v-card-text v-if="widgetResponse.description">
                    <p>{{ widgetResponse.description }}</p>
                  </v-card-text>
              
                  <v-row v-if="widgetResponse.data?.results?.length">
                    <v-col
                      v-for="(result, index) in widgetResponse.data.results"
                      :key="index"
                      :cols="12 / widgetResponse.data.results.length"
                    >
                      <v-card flat class="mx-2 pa-3">
                        <p>
                          <strong>{{ result.label }}</strong>: {{ result.data }}
                        </p>
                        <span v-if="result.label">{{ result.label }}</span>
                      </v-card>
                    </v-col>
                  </v-row>
              
                  <v-row v-if="widgetResponse.headers?.length">
                    <v-col
                      v-for="(header, headerIndex) in widgetResponse.headers"
                      :key="headerIndex"
                      :cols="header.cellCols || 12"
                    >
                      <v-card class="pa-2" :style="parseItem(header.cellStyle || '')">
                        <v-icon v-if="header.icon" :color="header.textColor || 'black'">{{ header.icon }}</v-icon>
                        <span :style="{ color: header.textColor || 'black' }">{{ header.text }}</span>
                      </v-card>
                    </v-col>
                  </v-row>
              
                  <v-row v-if="widgetResponse.filters?.length">
                    <v-col
                      v-for="(filter, filterIndex) in widgetResponse.filters"
                      :key="filterIndex"
                      :cols="filter.cols || 6"
                    >
                      <v-select
                        v-if="filter.type === 'api'"
                        v-model="filter.value"
                        :items="filter.options"
                        :label="filter.label"
                        multiple
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </div>
               -->
            <div v-else>
              <p>Unknown type: {{ widgetResponse.title }}</p>
            </div>
          </v-col>
        </template>
      </v-row>
    </template>
  </template>
  
  
<style lang="css" scoped>
</style>
