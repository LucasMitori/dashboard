<script setup lang="ts">
import { ref, computed } from 'vue';
import { Line, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement);

interface Tab {
  icon: string
  text: string
  value: string
}

const tab = ref('tab-1')
const mockAvailable = ref(12);
const mockQueue = ref(8);
const mockInProgress = ref(5);
const mockMissedCall = ref("2 days 10:40:20");

const page = ref({
    itemsPerPage: 10,
    serverItems: [] as any[],
    loading: true,
    totalItems: 0,
    name: '',
    calories: '',
    search: '',
})

const tabs: Tab[] = [
  {
    icon: 'mdi-book-open-page-variant',
    text: 'Readme',
    value: 'tab-1',
  },
  {
    icon: 'mdi-handshake-outline',
    text: 'Code of Conduct',
    value: 'tab-2',
  },
  {
    icon: 'mdi-license',
    text: 'MIT License',
    value: 'tab-3',
  },
  {
    icon: 'mdi-shield-lock-outline',
    text: 'Security',
    value: 'tab-4',
  },
]

interface Employee {
  id: number;
  name: string;
  avatar: string;
  completed: number;
  status: string;
}

const headers = ref([
  { title: 'ID', value: 'id', align: 'start' as const, sortable: true, width: '10%' },
  { title: 'Name', value: 'name', align: 'start' as const, sortable: true, width: '50%' },
  { title: 'Status', value: 'status', align: 'start' as const, sortable: true, width: '20%' },
  { title: 'Completed', value: 'completed', align: 'start' as const, sortable: true, width: '20%' },
]);

const employees = ref<Employee[]>([
  { id: 1, name: 'Victor', avatar: '/img/profile-circular.png', status: 'Active', completed: 34},
  { id: 2, name: 'Luciano', avatar: '/img/profile-circular.png', status: 'Away', completed: 56},
  { id: 3, name: 'Maciel', avatar: '/img/profile-circular.png', status: 'Offline', completed: 12 },
  { id: 4, name: 'Lucas', avatar: '/img/profile-circular.png', status: 'Active', completed: 5},
  { id: 5, name: 'Silvio', avatar: '/img/profile-circular.png', status: 'Offline', completed: 98},
  { id: 6, name: 'Victor', avatar: '/img/profile-circular.png', status: 'Away', completed: 33},
  { id: 7, name: 'Luciano', avatar: '/img/profile-circular.png', status: 'Active', completed: 20},
]);

const topEmployees = computed(() => {
  return employees.value.sort((a, b) => b.completed - a.completed).slice(0, 3);
});

const getBorderStyle = (index: number) => {
  switch(index) {
    case 0: return 'border: 5px solid gold';      
    case 1: return 'border: 5px solid silver';   
    case 2: return 'border: 5px solid #cd7f32';
    default: return '';
  }
};

function getStatusColor(status: string): string {
  switch (status) {
    case 'Active':
      return 'green';
    case 'Away':
      return 'orange';
    case 'Offline':
      return 'red';
    default:
      return 'grey';
  }
}

// Mock Data for Charts and Tables
const interactionsData = [
  { date: '2024-10-01', phone: 25, chat: 15 },
  { date: '2024-10-02', phone: 30, chat: 20 },
  { date: '2024-10-03', phone: 50, chat: 40 },
  { date: '2024-10-04', phone: 45, chat: 35 },
];

const customerSatisfactionData = [
  { agent: 'John Doe', satisfaction: 90, completedCalls: 120 },
  { agent: 'Jane Smith', satisfaction: 85, completedCalls: 110 },
  { agent: 'Sam Green', satisfaction: 88, completedCalls: 95 },
];

// Graph Configuration
const interactionChartData = {
  labels: interactionsData.map(data => data.date),
  datasets: [
    {
      label: 'Phone Calls',
      backgroundColor: '#42A5F5',
      borderColor: '#1E88E5',
      data: interactionsData.map(data => data.phone),
      fill: false,
    },
    {
      label: 'Chats',
      backgroundColor: '#FFCA28',
      borderColor: '#FFB300',
      data: interactionsData.map(data => data.chat),
      fill: false,
    },
  ],
};

const satisfactionChartData = {
  labels: customerSatisfactionData.map(data => data.agent),
  datasets: [
    {
      label: 'Satisfaction',
      backgroundColor: '#66BB6A',
      data: customerSatisfactionData.map(data => data.satisfaction),
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { type: 'category', display: true, title: { display: true, text: 'Date' } },
    y: { display: true, title: { display: true, text: 'Interactions' } },
  },
};

// Table Data
const tableHeaders = [
  { text: 'Agent Name', value: 'agent' },
  { text: 'Satisfaction %', value: 'satisfaction' },
  { text: 'Completed Calls', value: 'completedCalls' },
];

const pageInitial = ref(1);
const itemsPerPage = ref(5);

</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-sheet  elevation="3" rounded="lg">
                <v-tabs v-model="tab" align-tabs="center" color="black" height="60" slider-color="#f78166">
                  <v-tab value="fixed_dash">Fixed Dashboard</v-tab>
                  <v-tab value="tab-2">Examples</v-tab>
                  <v-tab value="tab-3">Settings</v-tab>
                </v-tabs>
            
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item value="fixed_dash">
                    
                    <v-row class="ma-1">
                        <v-col cols="4">
                            <v-toolbar
                                dark
                                prominent
                                class="mb-5 custom-toolbar"
                                style="border-radius: 16px;"
                                >
                                <v-icon
                                    icon="mdi-phone-plus"
                                    class="ml-3 custom-icon"
                                />

                                <v-toolbar-title class="custom-title">Phones</v-toolbar-title>

                                <v-spacer></v-spacer>

                                <v-btn icon class="custom-btn">
                                    <v-icon>mdi-cogs</v-icon>
                                </v-btn>
                                </v-toolbar>
  
                            <v-row>
                                <v-col cols="4" >
                                    <v-card
                                        class="mx-auto"
                                        title="Available"
                                        style="height: 100%"
                                        color="#4CAF50"
                                        subtitle="current month"
                                    >
                                        <v-card-text>
                                        <div class="data-text">{{ mockAvailable }}</div>
                                        </v-card-text>
                                    </v-card>
                                    </v-col>
                                    
                                    <v-col cols="8">
                                    <v-row class="d-flex align-center justify-lg-space-evenly">
                                        <v-col cols="6">
                                        <v-card class="mx-auto" title="In queue" subtitle="current month" color="#4dacbf">
                                            <v-card-text>
                                            <div class="data-text">{{ mockQueue }}</div>
                                            </v-card-text>
                                        </v-card>
                                        </v-col>
                                    
                                        <v-col cols="6">
                                        <v-card class="mx-auto" title="In progress" subtitle="current month" color="#4dacbf">
                                            <v-card-text>
                                            <div class="data-text">{{ mockInProgress }}</div>
                                            </v-card-text>
                                        </v-card>
                                        </v-col>
                                    </v-row>
                                    
                                    <v-row>
                                        <v-card class="mx-auto mb-4" title="Oldest Missed Call" subtitle="current month" style="width: 94%;" color="#4dacbf">
                                        <v-card-text>
                                            <div class="data-text">{{ mockMissedCall }}</div>
                                        </v-card-text>
                                        </v-card>
                                    </v-row>
                                </v-col>                                      

                                <v-row class="ma-0">
                                    <v-col>
                                        <v-card>
                                        <v-toolbar density="comfortable" class="bg-secondary" elevation="1">
                                            <template v-slot:prepend>
                                            <v-icon class="ml-2" color="white" icon="mdi-calendar-month"></v-icon>
                                            </template>
                                    
                                            <v-toolbar-title>Current Month</v-toolbar-title>
                                        </v-toolbar>
                                    
                                        <v-data-table-server
                                            :headers="headers"
                                            :items="employees"
                                            :items-per-page="5"
                                            class="elevation-1 navy-table"
                                            :items-length="page.totalItems"
                                            style="border-radius: 0px 0px 5px 5px;"
                                        >
                                            <template v-slot:item.name="{ item }">
                                            <v-avatar class="mr-2">
                                                <v-img :src="item.avatar"></v-img>
                                            </v-avatar>
                                            {{ item.name }}
                                            </template>
                                    
                                            <template v-slot:item.status="{ item }">
                                            <v-chip
                                                :color="getStatusColor(item.status)"
                                                dark
                                            >
                                                {{ item.status }}
                                            </v-chip>
                                            </template>
                                    
                                            <template v-slot:item.completed="{ item }">
                                            <div class="text-right">{{ item.completed }}%</div>
                                            </template>
                                        </v-data-table-server>
                                        </v-card>
                                    </v-col>
                                </v-row>                                      
                            </v-row>
                        </v-col>
            
                        <v-col cols="4">
                            <v-toolbar
                                dark
                                prominent
                                class="mb-5 custom-toolbar"
                                style="border-radius: 16px;"
                                >
                                <v-icon
                                    icon="mdi-chat"
                                    class="ml-3 custom-icon"
                                />

                                <v-toolbar-title class="custom-title">Chats</v-toolbar-title>

                                <v-spacer></v-spacer>

                                <v-btn icon class="custom-btn">
                                    <v-icon>mdi-cogs</v-icon>
                                </v-btn>
                                </v-toolbar>


                            <v-row>
                                <v-row class="ma-0">
                                    <v-col cols="6">
                                        <v-card class="mx-auto mb-4" title="% good ratings" subtitle="current month"  color="#4dacbf">
                                            <v-card-text>
                                                <div class="data-text">{{ mockQueue }}</div>
                                            </v-card-text>
                                        </v-card>
                                        
                                        <v-card class="mx-auto" title="Average wait time" subtitle="today" color="#4dacbf">
                                            <v-card-text>
                                                <div class="data-text">{{ mockQueue }}</div>
                                            </v-card-text>
                                        </v-card>

                                    </v-col>

                                    <v-col cols="6">
                                        <v-card class="mx-auto mb-4" title="Total" subtitle="current week" color="#4dacbf">
                                            <v-card-text>
                                                <div class="data-text">{{ mockQueue }}</div>
                                            </v-card-text>
                                        </v-card>
                                            <v-card class="mx-auto" title="average duration" subtitle="current week"  color="#4dacbf">
                                            <v-card-text>
                                                <div class="data-text">{{ mockQueue }}</div>
                                            </v-card-text>
                                            </v-card>
                                    </v-col>
                                </v-row>

                                

                                <v-row class="ma-0">
                                    <v-col>
                                        <v-card>
                                        <v-toolbar density="comfortable" class="bg-secondary" elevation="1">
                                            <template v-slot:prepend>
                                            <v-icon class="ml-2" color="white" icon="mdi-calendar-month"></v-icon>
                                            </template>
                                    
                                            <v-toolbar-title>Current Month</v-toolbar-title>
                                        </v-toolbar>
                                    
                                        <v-data-table-server
                                            :headers="headers"
                                            :items="employees"
                                            :items-per-page="5"
                                            class="elevation-1 navy-table"
                                            :items-length="page.totalItems"
                                            style="border-radius: 0px 0px 5px 5px;"
                                        >
                                            <template v-slot:item.name="{ item }">
                                            <v-avatar class="mr-2">
                                                <v-img :src="item.avatar"></v-img>
                                            </v-avatar>
                                            {{ item.name }}
                                            </template>
                                    
                                            <template v-slot:item.status="{ item }">
                                            <v-chip
                                                :color="getStatusColor(item.status)"
                                                dark
                                            >
                                                {{ item.status }}
                                            </v-chip>
                                            </template>
                                    
                                            <template v-slot:item.completed="{ item }">
                                            <div class="text-right">{{ item.completed }}%</div>
                                            </template>
                                        </v-data-table-server>
                                        </v-card>
                                    </v-col>
                                </v-row>                                      
                            </v-row>
                        </v-col>
            
                        <v-col cols="4">
                            <v-toolbar
                                dark
                                prominent
                                class="mb-5 custom-toolbar"
                                style="border-radius: 16px;"
                                >
                                <v-icon
                                    icon="mdi-briefcase-account-outline"
                                    class="ml-3 custom-icon"
                                />

                                <v-toolbar-title class="custom-title">Cases</v-toolbar-title>

                                <v-spacer></v-spacer>

                                <v-btn icon class="custom-btn">
                                    <v-icon>mdi-cogs</v-icon>
                                </v-btn>
                                </v-toolbar>

                            <v-row> 
                                <v-row class="ma-0">
                                    <v-col cols="12">

                                        <v-card class="mx-auto" title="Top Employees" subtitle="Current Month" color="#4dacbf">
                                            <v-card-text>
                                                <v-row class="d-flex justify-center mb-1">
                                                <v-col cols="4" v-for="(employee, index) in topEmployees" :key="employee.id">
                                                    <v-avatar
                                                    size="80"
                                                    class="mb-4 ml-4"
                                                    :style="getBorderStyle(index)"
                                                    >
                                                    <v-img :src="employee.avatar"></v-img>
                                                    </v-avatar>
                                                    <div class="employee-name">{{ employee.name }}</div>
                                                    <div class="employee-score">{{ employee.completed }} Points</div>
                                                </v-col>
                                                </v-row>
                                            </v-card-text>
                                            </v-card>
                                    </v-col>
                                </v-row>

                                <v-row class="ma-0">
                                    <v-col>
                                        <v-card>
                                        <v-toolbar density="comfortable" class="bg-secondary" elevation="1">
                                            <template v-slot:prepend>
                                            <v-icon class="ml-2" color="white" icon="mdi-calendar-month"></v-icon>
                                            </template>
                                    
                                            <v-toolbar-title>Current Month</v-toolbar-title>
                                        </v-toolbar>
                                    
                                        <v-data-table-server
                                            :headers="headers"
                                            :items="employees"
                                            :items-per-page="5"
                                            class="elevation-1 navy-table"
                                            :items-length="page.totalItems"
                                            style="border-radius: 0px 0px 5px 5px;"
                                        >
                                            <!-- Avatar to the Left of the Name -->
                                            <template v-slot:item.name="{ item }">
                                            <v-avatar class="mr-2">
                                                <v-img :src="item.avatar"></v-img>
                                            </v-avatar>
                                            {{ item.name }}
                                            </template>
                                    
                                            <template v-slot:item.status="{ item }">
                                            <v-chip
                                                :color="getStatusColor(item.status)"
                                                dark
                                            >
                                                {{ item.status }}
                                            </v-chip>
                                            </template>
                                    
                                            <template v-slot:item.completed="{ item }">
                                            <div class="text-right">{{ item.completed }}%</div>
                                            </template>
                                        </v-data-table-server>
                                        </v-card>
                                    </v-col>
                                </v-row>                                      
                            </v-row>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>
                <v-tabs-window-item value="tab-2">
                    <v-container fluid>
                      <!-- Dashboard Header -->
                      <v-row>
                        <v-col cols="12">
                          <v-card class="pa-4" color="#3f51b5" dark>
                            <v-card-title>Customer Support Dashboard</v-card-title>
                            <v-card-subtitle>Phone and Chat Interactions Overview</v-card-subtitle>
                          </v-card>
                        </v-col>
                      </v-row>
                
                      <!-- Charts Row -->
                      <v-row class="mt-4">
                        <!-- Line Chart for Phone and Chat Interactions -->
                        <v-col cols="6">
                          <v-card class="elevation-2">
                            <v-card-title>Interactions Over Time</v-card-title>
                            <v-card-subtitle>Phone Calls vs. Chats</v-card-subtitle>
                            <v-card-text>
                              <Line :data="interactionChartData" :options="{ responsive: true }" />
                            </v-card-text>
                          </v-card>
                        </v-col>
                
                        <!-- Bar Chart for Customer Satisfaction -->
                        <v-col cols="6">
                          <v-card class="elevation-2">
                            <v-card-title>Customer Satisfaction</v-card-title>
                            <v-card-subtitle>Agent Performance Overview</v-card-subtitle>
                            <v-card-text>
                              <Bar :data="satisfactionChartData" :options="{ responsive: true }" />
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                
                      <!-- Table Row -->
                      <v-row class="mt-4">
                        <v-col cols="12">
                          <v-card class="elevation-2">
                            <v-toolbar flat>
                              <v-toolbar-title>Agent Performance</v-toolbar-title>
                              <v-spacer></v-spacer>
                              <v-btn icon>
                                <v-icon>mdi-filter-variant</v-icon>
                              </v-btn>
                              <v-btn icon>
                                <v-icon>mdi-refresh</v-icon>
                              </v-btn>
                            </v-toolbar>
                
                            <!-- Agent Performance Table -->
                            <v-data-table
                              :headers="tableHeaders"
                              :items="customerSatisfactionData"
                              :page.sync="pageInitial"
                              :items-per-page="itemsPerPage"
                              class="elevation-1"
                            >
                              <template v-slot:item.satisfaction="{ item }">
                                <v-progress-linear
                                  :value="item.satisfaction"
                                  color="green"
                                  height="8"
                                  rounded
                                ></v-progress-linear>
                              </template>
                              <template v-slot:item.completedCalls="{ item }">
                                <div class="text-right">{{ item.completedCalls }}</div>
                              </template>
                            </v-data-table>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-container>
                </v-tabs-window-item>
                
                <v-tabs-window-item value="tab-3">
                <h1>Test 3</h1>
                <!-- <MyComponent3 /> -->
                </v-tabs-window-item>
                </v-tabs-window>
              </v-sheet>
        </v-col>
       
    </v-row>

</template>

<style lang="scss" scoped>

.scrollable-content {
    overflow-x: auto;
}

.custom-toolbar {
    background-color: #3f51b5;
  }
  .data-text {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center;
  }

</style>