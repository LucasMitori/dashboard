<script setup lang="ts">
import { ref } from "vue";
import { Bar, Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
} from "chart.js";
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement
);

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
}

const props = defineProps({
    data: {
        type: Array as () => ItemApi[],
        required: true,
    },
    dataTest: {
        type: Object,
        required: true,
    },
});

const chartTitle = ref("Chart Title");
const chartType = ref("line");
const selectedMonth = ref("");
const dialog = ref(false);
const rows = ref<ItemApi[]>(props.data);
const pairedData = ref<any[]>([]);
const isLoading = ref(true);
const searchItem = ref({ value: "" });
const loading = ref(false);
const pageNumber = ref(1);
const page = ref({
    itemsPerPage: 10,
    serverItems: [] as any[],
    loading: true,
    totalItems: 0,
    name: "",
    calories: "",
    search: "",
});

console.log("dataTest: ", props.dataTest);

const months = [
    {
        name: "January",
        data: [120, 130, 125, 145, 160, 170, 155, 140, 135, 150, 165, 180],
    },
    {
        name: "February",
        data: [130, 120, 135, 125, 160, 140, 155, 165, 145, 150, 135, 170],
    },
    {
        name: "March",
        data: [150, 140, 155, 165, 175, 160, 145, 135, 150, 160, 170, 180],
    },
    {
        name: "April",
        data: [160, 170, 155, 140, 135, 145, 150, 160, 170, 175, 180, 190],
    },
    {
        name: "May",
        data: [140, 150, 160, 170, 180, 190, 165, 155, 145, 135, 130, 120],
    },
    {
        name: "June",
        data: [125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235],
    },
    {
        name: "July",
        data: [110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220],
    },
    {
        name: "August",
        data: [115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225],
    },
    {
        name: "September",
        data: [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245],
    },
    {
        name: "October",
        data: [145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255],
    },
    {
        name: "November",
        data: [160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270],
    },
    {
        name: "December",
        data: [180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290],
    },
];

const mockMonthData = ref(months[0].data);

const load = () => {
    loading.value = true;
    setTimeout(() => (loading.value = false), 3000);
};

const generateBarChartData = (
    label1: any,
    value1: any,
    label2: any,
    value2: any,
    colors: any
) => ({
    labels: [label1, label2],
    datasets: [
        {
            label: "Dados",
            backgroundColor: colors,
            data: [value1, value2],
        },
    ],
});

const generateLineChartData = (item: any) => ({
    labels: [
        "Recebidas",
        "Atendidas",
        "Abandonadas",
        "Abandonada_%",
        "Desistente",
        "Em Espera",
        "Logados",
        "Disponíveis",
    ],
    datasets: [
        {
            label: `Porcentagem %`,
            backgroundColor: "#36A2EB",
            borderColor: "#36A2EB",
            data: [
                item.received,
                item.answered,
                item.abandoned,
                parseFloat(item.abandoned_p),
                item.dropouts,
                item.wait,
                item.logged_in,
                item.available,
            ],
            fill: false,
            tension: 0.4,
        },
    ],
});

const applyChartSettings = () => {
    // Logic
};

const saveSettings = () => {
    const selected = months.find((month) => month.name === selectedMonth.value);
    if (selected) {
        mockMonthData.value = selected.data;
    }
    dialog.value = false;
};

const openDialog = () => {
    dialog.value = true;
};

const gradients = [
    ["#222"],
    ["#42b3f4"],
    ["red", "orange", "yellow"],
    ["purple", "violet"],
    ["#00c6ff", "#F0F", "#FF0"],
    ["#f72047", "#ffd200", "#1feaea"],
];

const selectedGradient = ref(gradients[2]);

const getStatusText = (status: string) => {
    switch (status) {
        case "waiting":
            return "Waiting";
        case "ready":
            return "Ready";
        case "onHold":
            return "On Hold";
        case "warning":
            return "Warning";
        default:
            return "Unknown";
    }
};

const statusClass = (status: string) => {
    switch (status) {
        case "waiting":
            return "text-blue";
        case "ready":
            return "text-green";
        case "onHold":
            return "text-yellow";
        case "warning":
            return "text-red";
        default:
            return "text-grey";
    }
};

const totalAnswered = ref(0);

watchEffect(() => {
    rows.value = props.data;
    console.log("rows: ", rows.value);
    totalAnswered.value = mockMonthData.value.reduce(
        (sum, val) => sum + val,
        0
    );
});

// watch(
//   () => props.data,
//   (newData) => {
//     processData(newData);
//     console.log("processData: ", newData);
//   },
//   { immediate: true }
// );

// // Function to process and group data by type
// function processData(data: DataRow[]) {
//   const groupedByType = groupByType(data);
//   pairedData.value = createDataPairs(groupedByType);    console.log("Paired Data: ", pairedData.value);

//     console.log("Paired Data: ", pairedData.value);
// }

// // Group properties by their type
// function groupByType(data: DataRow[]): Record<string, any[]> {
//   const typeGroups: Record<string, any[]> = {
//     string: [],
//     number: [],
//     boolean: [],
//     object: [],
//     null: [],
//   };

//   data.forEach((row) => {
//     Object.keys(row).forEach((key) => {
//       const value = row[key];
//       const type = value === null ? 'null' : typeof value;

//       if (typeGroups[type]) {
//         typeGroups[type].push({ key, value });
//       }
//     });
//   });

//   console.log("Type Groups: ", typeGroups);
//   return typeGroups;
// }

// // Create pairs of data for the charts
// function createDataPairs(groupedByType: Record<string, any[]>): any[] {
//   const pairs: any[] = [];

//   // Only use number types for chart data
//   const numberProperties = groupedByType['number'];

//   // Split number properties into pairs
//   for (let i = 0; i < numberProperties.length; i += 2) {
//     const pair = numberProperties.slice(i, i + 2);
//     pairs.push(pair);
//   }

//   // If we have an odd number, the last one will be its own standalone chart
//   if (numberProperties.length % 2 !== 0) {
//     pairs.push([numberProperties[numberProperties.length - 1]]);
//   }

//   console.log('Pairs:', pairs);

//   return pairs;
// }

const updateTable = async function () {
    searchItem.value.value = "";
    loading.value = true;
    await load();

    setTimeout(() => {
        loading.value = false;
    }, 2000);
};

const filteredTableItems = computed(() => {
    if (page.value.serverItems && page.value.serverItems.length > 0) {
        return page.value.serverItems.filter((item: any) => {
            return (
                (item.id && item.id.toString().includes(searchItem.value)) ||
                (item.is_active &&
                    item.is_active.toString().includes(searchItem.value)) ||
                (item.description &&
                    item.description
                        .toLowerCase()
                        .includes(searchItem.value.value.toLowerCase()))
            );
        });
    }
    return [];
});

const paginatedItems = computed(() => {
    const items = page.value.serverItems || [];
    const start = (pageNumber.value - 1) * page.value.itemsPerPage;
    const end = start + page.value.itemsPerPage;
    return items.slice(start, end);
});

const pageCount = computed(() => {
    return Math.ceil(page.value.serverItems.length / page.value.itemsPerPage);
});

function processData(
    data: Record<string, any>[],
    headers: any[]
): {
    graphics: Record<number, GraphicData[][]>;
    tables: Record<number, TableData[]>;
} {
    const graphics: Record<number, GraphicData[][]> = {};
    const tables: Record<number, TableData[]> = {};

    const headerMap = new Map(headers.map((header) => [header.value, header]));

    data.forEach((item, index) => {
        const numericValues: GraphicData[] = [];
        const otherValues: TableData[] = [];

        Object.keys(item).forEach((key) => {
            const value = item[key];
            const headerInfo = headerMap.get(key);

            if (headerInfo) {
                const dataItem = {
                    key: headerInfo.text,
                    value,
                    headers: headerInfo,
                };

                if (typeof value === "number" && !isNaN(value)) {
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

        graphics[index] = graphicPairs;
        tables[index] = otherValues;
    });

    return { graphics, tables };
}

const graphics = ref<Record<number, GraphicData[][]>>({});
const tables = ref<Record<number, TableData[]>>({});

watchEffect(() => {
    if (rows.value.length > 0) {
        const { graphics: newGraphics, tables: newTables } = processData(
            rows.value,
            props.dataTest.headers
        );
        graphics.value = newGraphics;
        tables.value = newTables;
        console.log("Graphics:", newGraphics);
        console.log("Tables:", newTables);
    }
});

function getColorScheme(index: number): string[] {
    const colorSchemes = [
        ["#36A2EB", "#4BC0C0"],
        ["#FF6384", "#FFCE56"],
        ["#FF9F40", "#FFCD56"],
        ["#4BC0C0", "#36A2EB"],
    ];
    return colorSchemes[index % colorSchemes.length];
}
</script>

<template>
    <v-row v-for="(item, index) in rows" :key="index" class="mb-8">
        <v-col cols="12" md="12">
            <v-card class="mb-5 elevation-5" rounded="10" flat>
                <v-toolbar density="compact">
                    <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
                    <v-toolbar-title style="color: white">{{
                        item.queueid || item.user_description
                    }}</v-toolbar-title>
                </v-toolbar>
            </v-card>

            <v-row>
                <v-col
                    v-for="(pair, pairIndex) in graphics[index]"
                    :key="pairIndex"
                    cols="3"
                >
                    <v-card class="text-center" dark>
                        <v-card-title
                            >{{ pair[0].key }} & {{ pair[1].key }}</v-card-title
                        >
                        <v-card-text>
                            <Bar
                                :data="
                                    generateBarChartData(
                                        pair[0].key,
                                        pair[0].value,
                                        pair[1].key,
                                        pair[1].value,
                                        getColorScheme(pairIndex)
                                    )
                                "
                                :options="{ responsive: true }"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="mt-2">
                <v-col cols="12">
                    <v-divider inset></v-divider>
                    <v-row
                        class="d-flex justify-space-between align-center mt-2"
                    >
                        <v-col cols="auto">
                            <v-row>
                                <v-col
                                    v-for="(itemTable, tableIndex) in tables[
                                        index
                                    ]"
                                    :key="tableIndex"
                                    cols="auto"
                                    class="d-flex align-center"
                                >
                                    <v-icon color="primary"
                                        >mdi-information-outline</v-icon
                                    >
                                    <span class="ml-2"
                                        >{{ itemTable.key }}:
                                        {{ itemTable.value }}</span
                                    >
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="auto" class="d-flex align-center">
                            <span>Status:</span>
                            <span
                                :class="statusClass('ready')"
                                class="ml-2 font-weight-bold"
                                >{{ getStatusText("ready") }}</span
                            >
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
                                        <span v-if="expanded" key="0"
                                            >Data: {{ item.date }}</span
                                        >
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
                                        v-model:items-per-page="
                                            page.itemsPerPage
                                        "
                                        :headers="props.dataTest.headers as Array<any>"
                                        :items="
                                            searchItem.value
                                                ? filteredTableItems
                                                : paginatedItems
                                        "
                                        :items-length="page.totalItems"
                                        :loading="loading"
                                        :search="page.search"
                                        item-value="name"
                                        @update:options="load"
                                    >
                                    </v-data-table-server>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
    </v-row>
</template>

<style lang="css" scoped></style>
