<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import WidgetTable from '~/components/dashboard/superado01.vue';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

interface ItemRequest {
  data: {
    results: {
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
    }[];
    headers: {
      icon: string;
      text: string;
      value: string;
    }[];
    menu: {
      [key: string]: any;
    }
  };
}

interface Item {
    id: number;
    icon: string;
    title: string;
    description: string;
    data: any;
}

interface Buttons {
    name: string;
    icon: string;
    location: string;
    action: string;
}

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
}

const props = defineProps({
  title: {
    type: String,
    default: 'Table',
  },
  slugs: {
    type: Array as () => string[],
    default: () => [],
    required: true,
  },
  idPage: {
    type: Number,
    default: 0,
    required: true,
  },
    arrayBtn: {
        type: Array as PropType<Buttons[]>,
        default: () => [],
        required: true,
    },
});

//Mocks Temp data
const mockId = 50;

const api = useApi();
const ravenaStore = useRavenaStore();
const tab = ref(null);
const itemMenu = ref<{ title: string; [key: string]: any }[]>([]);
const { t: $t } = useI18n();
const loaded = ref(false);
const responseData = ref<null | ItemRequest>(null);
const items = ref<Item[]>([]);
const selectedFilter = ref(''); 
const selectedItemId = ref(1);
const selectedItem = ref<Item | null>(null);
const drawer = ref(true);
const rail = ref(false);
const dialog = ref(false);
const operatorDialog = ref(false);
const selectedMonth = ref('');
const newHeaders = ref<any[]>([]); 
const widgetResponses = ref<{
  data: {
    title: string;
    icon: string;
    headers: { value: keyof DataResult; text: string; [key: string]: any }[];
    data: {
      results: DataResult[];
    };
  };
}[]>([]);

const page = ref({
    itemsPerPage: 10,
    serverItems: [] as any[],
    loading: true,
    totalItems: 0,
    name: '',
    calories: '',
    search: '',
})

const loadItems = async () => {
    try {
    const urls = props.slugs.map((slug) => `/v1/builder/${slug}/menus/build/`);

    const responses = await Promise.all(urls.map((url) => api({ method: 'get', url })));

    responses.forEach((response, index) => {
        const slug = props.slugs[index];

        if ((props.title === 'Dashboard' && slug === 'dashboard') || 
            (props.title === 'Report' && slug === 'report')) {

        itemMenu.value = response.data.items.map((item: any) => ({
            icon: item.icon,
            title: item.title,
            to: item.to,
            perms: item.perms ? item.perms : [item.perm],
            submenu: item.submenu ? item.submenu : [],
        }));
        }
    });
    } catch (error) {
        console.error('loadItems', error);
    }
};

const createNewHeaders = (originalHeaders: any[]) => {
  return originalHeaders.map((header) => ({
    title: header.text,
    align: header.align || 'start',
    sortable: header.filterable || false,
    key: header.value,
    width: header.value === 'queueid' ? '200px' : '150px',
    backgroundColor: header.backgroundColor || null,
    icon: header.icon || null,
    textColor: header.textColor || null,
    chip: header.chip || false
  }));
};


const getData = async () => {
  try {
    // Fetch the data as before
    let params = 'first-run=true';
    let url = props.title === 'Dashboard' 
      ? `/v1/builder/dashboard/pages/${mockId}/?${params}`
      : `/v1/builder/report/pages/${props.idPage}/?${params}`;
    
    const response = await api({ method: 'get', url });
    
    const widgets = response.data.build.widgets;
    const widgetRequests = widgets.map((widget: { id: number }) => 
      api({ method: 'get', url: `/v1/builder/widgets/${widget.id}/build/?offset=0&limit=10&first-run=true&page_id=${response.data.id}` })
    );
    
    const widgetResponsesData = await Promise.all(widgetRequests);
    widgetResponses.value = widgetResponsesData; // Store the responses

    // Generate headers from the first widget response for demonstration
    newHeaders.value = createNewHeaders(widgetResponsesData[0].data.headers);

    responseData.value = response.data;
    loaded.value = true; // Set loaded to true once everything is fetched
  } catch (error) {
    console.error('Error in getData:', error);
  }
};
const validIcons = [
  'mdi-text-long', 
  'mdi-test', 
  'mdi-phone-plus', 
  'mdi-face-agent', 
  'mdi-account-group',
];

// Method to validate icon
const getValidIcon = (icon: string) => {
  return validIcons.includes(icon) ? icon : 'mdi-text-long';
};

onMounted(async () => {
  loaded.value = false;
  await loadItems();
  await getData();

  if (items.value.length > 0) {
    selectedItem.value = items.value[0];
    selectedItemId.value = items.value[0].id;
  }

    ravenaStore.toggleSubmenu = true;

    loaded.value = true; 
});


watchEffect(() => {
    // console.log("reponseData: ", responseData.value);
    // console.log("test: ", items.value);
    // console.log("itemMenu: ", itemMenu.value);
    // console.log("SelectedItem: ", selectedItem.value);
    console.log("widgetResponses: ", widgetResponses.value);
    // console.log("newHeaders: ", newHeaders.value);
});

const getHeaderProperties = (key: string) => {
  return newHeaders.value.find(h => h.key === key) || {};
};

const getWidgetComponent = (item: any) => {
  switch (item.type) {
    case 1:
      return WidgetTable;
    case 5:
      return 'WidgetChartBar';
    default:
      return 'WidgetDefault';
  }
};

const changeOperatorItem = (item: any) => {
  console.log("item: ", item);
  selectedItem.value = item;
};

const onClick = () => {
  console.log('Clicked');
};

// WIDGET_TYPE_TABLE = 1
// WIDGET_TYPE_HTML = 2
// WIDGET_TYPE_FRONTEND_COMPONENT = 3
// WIDGET_TYPE_API = 4
// WIDGET_TYPE_CHART_BAR = 5
// WIDGET_TYPE_CHART_LINE = 6
// WIDGET_TYPE_CHART_PIE = 7
// WIDGET_TYPE_CHART_DOUGHNUT = 8
// WIDGET_TYPE_CHART_RADAR = 9
// WIDGET_TYPE_CHART_AREA = 10
// WIDGET_TYPE_CHART_POLAR_AREA = 11
// WIDGET_TYPE_CARD = 12

const openOperatorDialog = () => {
  operatorDialog.value = true;
};

const attendant = [
  { type: 'subheader', title: 'Online' },
  {
    prependAvatar: "/img/profile-circular.png",
    title: 'Victor',
    subtitle: `<span class="text-primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
  },
  { type: 'divider', inset: true },
  {
    prependAvatar: "/img/profile-circular.png",
    title: 'Luciano',
    subtitle: `<span class="text-primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
  },
  { type: 'divider', inset: true },
  {
    prependAvatar: "/img/profile-circular.png",
    title: 'Maciel',
    subtitle: '<span class="text-primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
  },
  { type: 'divider', inset: true },
  {
    prependAvatar: "/img/profile-circular.png",
    title: 'Lucas',
    subtitle: '<span class="text-primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
  },
  { type: 'divider', inset: true },
  {
    prependAvatar: "/img/profile-circular.png",
    title: ' Silvio',
    subtitle: '<span class="text-primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
  },
];

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
const totalAnswered = ref(0);
const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]
  
  const selectedGradient = ref(gradients[2]);

  const openDialog = () => {
  dialog.value = true;
};

const saveSettings = () => {
  const selected = months.find(month => month.name === selectedMonth.value);
  if (selected) {
    mockMonthData.value = selected.data;
  }
  dialog.value = false;
};

const applyChartSettings = () => {
  // Logic 
};

const chartTitle = ref('Chart Title');
const chartType = ref('line');

</script>

<template>
    
    <v-container fluid class="ravena-background-1" v-if="loaded">
        <v-row>
            <v-col cols="12">
                <!-- <component
                    v-if="selectedItem" 
                    :is="getWidgetComponent(selectedItem)" 
                    :data="selectedItem.data.results"
                    :dataTest="selectedItem" 
                /> -->

                <!-- <template v-for="(widgetResponse, index) in widgetResponses" :key="index">
                    <v-data-table
                      :headers="createNewHeaders(widgetResponse.data.headers)"
                      :items="widgetResponse.data.data.results"
                      item-value="queueid"
                      class="elevation-1"
                      :items-per-page="10"
                      
                    >
                      <template v-slot:item.abandoned="{ item }">
                        {{ (item as DataResult).abandoned }} ({{ (item as DataResult).abandoned_p }})
                      </template>
                    </v-data-table>
                </template> -->

                <template v-for="(widgetResponse, index) in widgetResponses" :key="index">

                    <v-toolbar color="secondary">
                        <v-btn :icon="getValidIcon(widgetResponse.data.icon)  || 'mdi-text-long'"></v-btn>
                  
                        <v-toolbar-title>{{widgetResponse.data.title}}</v-toolbar-title>
                  
                        <v-spacer></v-spacer>
                  
                      </v-toolbar>

                    <v-data-table-server
                      :headers="createNewHeaders(widgetResponse.data.headers)"
                      :items="widgetResponse.data.data.results"
                      :items-length="page.totalItems"
                      item-value="queueid"
                      class="elevation-1 pa-2 mb-5"
                      :items-per-page="10"
                      fixed-header
                    >
                    
                      <template v-for="header in widgetResponse.data.headers" v-slot:[`item.${header.value}`]="{ item }">
                        
                        <v-card 
                            v-if="header.value === widgetResponse.data.headers[0].value"
                            color="primary"
                            style="font-weight: bold; width: 220px; height: 90%; box-sizing: border-box; border-radius: 5px;"
                            class="ma-0 pa-3 d-flex align-center"
                            >
                            <v-icon
                                v-if="getHeaderProperties(header.value).icon"
                                class="mr-3" 
                                style="color: white;"
                            >
                                {{ getHeaderProperties(header.value).icon }}
                            </v-icon>

                            <span style="color:white">
                                {{ item[header.value] }}      
                            </span>
                        </v-card>
                        
                        <v-card
                          v-else-if="getHeaderProperties(header.value).chip"
                          :color="getHeaderProperties(header.value).backgroundColor"
                          :text-color="getHeaderProperties(header.value).textColor"
                          class="ma-0 pa-3 d-flex align-center"
                          style="min-width: 100px; height: 90%; box-sizing: border-box; border-radius: 5px;"
                        >
                          <v-icon
                            v-if="getHeaderProperties(header.value).icon"
                            class="mr-3" 
                            style="color: white;"
                          >
                            {{ getHeaderProperties(header.value).icon }}
                          </v-icon>
                          <span style="color: white;">
                            {{ item[header.value] }}
                          </span>
                        </v-card>

                      </template>
                    </v-data-table-server>

                    <v-expansion-panels class="mt-5 mb-5">
                        
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
                          
                        <!-- Dialog for Month Selection -->
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
                  </template>            
            </v-col>

            <v-navigation-drawer
                v-if="ravenaStore.toggleSubmenu"
                class="ravena-scroll"
                :disable-resize-watcher="true"
                mobile-breakpoint="xs"
                location="right"
            >
                <v-list class="menu-left" density="compact" nav>
                <v-list-item
                    prepend-avatar="/img/profile-circular.png"
                    title="Ravena Dashboard"
                    nav
                />
                <v-divider inset/>
                
                    <MenuBuilder 
                        v-for="item in itemMenu" 
                        :key="item.title" 
                        :item="item" 
                        class="mt-4"
                    />
                </v-list>
                <v-list-item
                    prepend-avatar="/img/profile-circular.png"
                    title="Atendentes"
                    nav
                />
                <v-divider inset/>


                <v-card class="mx-auto pa-1 mt-5">
                    <v-toolbar color="#104666">
                        <!-- <v-btn icon="mdi-menu" variant="text"></v-btn> -->
                        <v-toolbar-title>Atendentes</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-magnify" variant="text"></v-btn>
                    </v-toolbar>
                    
                    <v-list :items="attendant" lines="three" item-props>
                        <template v-slot:subtitle="{ subtitle }">
                        <div v-html="subtitle"></div>
                        </template>
                    </v-list>
                    </v-card>   

                
            </v-navigation-drawer>

            <Breadcrumbs 
                :buttons="arrayBtn"
            />
        </v-row>
    </v-container>

    <v-container v-else>
    <v-progress-linear indeterminate color="primary"></v-progress-linear>
    <p>Loading...</p>
    </v-container>

</template>

<style scoped>
.scrollable-container {
  max-height: 100%;
  overflow-y: scroll;
}

.text-blue {
    color: #36A2EB;
}
.text-green {
    color: #4CAF50;
}
.text-yellow {
    color: #FFC107;
}
.text-red {
    color: #F44336;
}
.text-grey {
    color: #9E9E9E;
}
  
</style>
