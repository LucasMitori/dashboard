<script setup lang="ts">
import { ref } from "vue";
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
import WidgetTable from "~/components/dashboard/WidgetTable.vue";
import WidgetChart from "~/components/dashboard/WidgetChart.vue";
import Widget from "~/components/dashboard/Widget.vue";
import FixedDash from "~/components/dashboard/FixedDash.vue";
import type { WidgetResponse } from "./dashboard/Widget.vue";
import Breadcrumbs from "./Breadcrumbs.vue";
import MenuBuilder from "./MenuBuilder.vue";
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

interface ResponseData {
    id: number;
    is_active: boolean;
    description: string;
    created_at: string;
    updated_at: string;
    slug: string;
    title: string;
    icon: string;
    site: number;
    is_default: boolean;
    enable_global_auto_refresh: boolean;
    enable_global_export_to_excel: boolean;
    enable_global_filter: boolean;
    enable_local_auto_refresh: boolean;
    enable_local_export_to_excel: boolean;
    enable_local_filter: boolean;
    enable_widget_header: boolean;
    filters: number[];
    build: {
        defaults: object;
        filters: { id: number; value: string }[];
        title: string;
        widgets: {
            id: number;
            icon: string;
            description: string;
            title: string;
            cols: number;
        }[];
    };
    deleted_at: string | null;
    category: string | null;
}

interface Item {
    id: number;
    icon: string;
    title: string;
    description: string;
    data: string;
}

// interface Buttons {
//     name: string;
//     icon: string;
//     location: string;
//     action: string;
// }

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

interface Attendant {
    prependAvatar: string;
    title: string;
    subtitle: string;
}

interface Field {
    id: number;
    label: string;
    value: number;
    options: Array<object>;
    type: string;
    multiple: boolean;
    cols?: string;
}

const props = defineProps({
    title: {
        type: String,
        default: "Table",
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
    dataItems: {
        type: Object,
        default: () => ({}),
        required: false,
    },
});

//Mocks Temp data
const mockId = 50;

const api = useApi();
const itemMenu = ref<{ title: string; [key: string]: string }[]>([]);
const { t: $t } = useI18n();
const loaded = ref(false);
const dialog = ref(false);
const selectedAttendant = ref<Attendant | null>(null);
const dynamicContent = ref<string | null>(null);

watchEffect(() => {
    const route = useRoute();
    const id = route.params.id;
    if (id) {
        dynamicContent.value = `Conteúdo carregado para a página ID: ${id}`;
    } else {
        dynamicContent.value = null;
    }
});

// const responseData = ref<null | ResponseData>(null);
const responseData = ref<ResponseData>({
    id: 0,
    is_active: false,
    description: "",
    created_at: "",
    updated_at: "",
    slug: "",
    title: "",
    icon: "",
    site: 0,
    is_default: false,
    enable_global_auto_refresh: false,
    enable_global_export_to_excel: false,
    enable_global_filter: false,
    enable_local_auto_refresh: false,
    enable_local_export_to_excel: false,
    enable_local_filter: false,
    enable_widget_header: false,
    filters: [],
    build: {
        defaults: {},
        filters: [],
        title: "",
        widgets: [],
    },
    deleted_at: null,
    category: null,
});

const items = ref<Item[]>([]);
const selectedItemId = ref(1);
const selectedItem = ref<Item | null>(null);
const widgetResponses = ref<
    {
        data: {
            title: string;
            icon: string;
            type: number;
            headers: {
                value: keyof DataResult;
                text: string;
                [key: string]: any;
            }[];
            data: {
                results: DataResult[];
                filters?: { fields: any[] }[] | undefined;
            };
        };
    }[]
>([]);
const isFullscreen = ref(false);

const timerOptions = [0, 5, 10, 15, 30];

const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
};

// const loadItems = async () => {
//     try {
//         const urls = props.slugs.map(
//             (slug) => `/v1/builder/${slug}/menus/build/`
//         );

//         const responses = await Promise.all(
//             urls.map((url) => api({ method: "get", url }))
//         );

//         responses.forEach((response, index) => {
//             const slug = props.slugs[index];

//             if (
//                 (props.title === "Dashboard" && slug === "dashboard") ||
//                 (props.title === "Report" && slug === "report")
//             ) {
//                 itemMenu.value = response.data.items.map((item: any) => ({
//                     icon: item.icon,
//                     title: item.title,
//                     to: item.to,
//                     perms: item.perms ? item.perms : [item.perm],
//                     submenu: item.submenu ? item.submenu : [],
//                 }));
//             }
//             // console.log("itemMenu: ", itemMenu.value);
//             // console.log("responseData: ", responseData.value);
//         });
//     } catch (error) {
//         console.error("loadItems", error);
//     }
// };

// const getData = async () => {
//     try {
//         const data = await fetchPageData();

//         // console.log("data after request in getData: ", data);
//         if (data.length > 0) {
//             await fetchWidgetData(data);
//         }
//     } catch (error) {
//         console.error("Error in getData:", error);
//     }
// };

// const fetchPageData = async () => {
//     try {
//         // console.log("props.idPage: ", props.idPage);
//         let params = "first-run=true";
//         let url =
//             props.title === "Dashboard"
//                 ? ``
//                 : ``;

//         const response = await api({ method: "get", url });

//         responseData.value = response.data;

//         return response.data.build.widgets;
//     } catch (error) {
//         console.error("Error fetching page data:", error);
//         return [];
//     }
// };

// const fetchWidgetData = async (widgets: { id: number }[]) => {
//     try {
//         const widgetRequests = widgets.map((widget) =>
//             api({
//                 method: "get",
//                 url: ``,
//             })
//         );

//         const widgetResponsesData = await Promise.all(widgetRequests);

//         widgetResponses.value = widgetResponsesData.map((response, index) => {
//             const widgetId = widgets[index].id;
//             const buildData = responseData.value.build.widgets.find(
//                 (w) => w.id === widgetId
//             );

//             console.log("buildData: ", buildData);
//             return {
//                 data: response.data,
//                 build: buildData,
//             };
//         });

//         loaded.value = true;
//     } catch (error) {
//         console.error("Error fetching widget data:", error);
//     }
// };

const config: {
    method: string;
    api: string;
    url: string;
    tabsAttrs: object;
    form: {
        rootEl: string;
        rootAttrs: {
            "no-gutters": boolean;
            justify: string;
        };
        childEl: string;
        childElAttrs: {
            class: string;
            style: string;
        };
    };
    fields: {
        type: string;
        name: string;
        tabs: {
            icon: string;
            name: string;
            label: string;
            fields: Field[];
        }[];
    }[];
} = {
    method: "post",
    api: `/v1/builder/dashboards/menus/build/`,
    url: "/dashboards/",
    tabsAttrs: {},
    form: {
        rootEl: "v-row",
        rootAttrs: {
            "no-gutters": true,
            justify: "end",
        },
        childEl: "v-col",
        childElAttrs: {
            class: "d-flex justify-start",
            style: "padding-right: 10px",
        },
    },
    fields: [
        {
            type: "tabs",
            name: "basic",
            tabs: [
                {
                    icon: "mdi-information-outline",
                    name: "basic",
                    label: "Basic",
                    fields: [],
                },
            ],
        },
    ],
};

watchEffect(() => {
    // console.log("props.dataItems: ", props.dataItems);
    const widgetResponsesValue = widgetResponses.value;

    if (widgetResponsesValue.length > 0) {
        const firstResponse = widgetResponsesValue[0];

        if (
            firstResponse?.data?.data?.filters &&
            Array.isArray(firstResponse.data.data.filters)
        ) {
            const filterObj = firstResponse.data.data.filters[0];

            if (filterObj && filterObj.fields) {
                config.fields[0].tabs[0].fields = filterObj.fields;
                // console.log('Updated config:', config);
            }
        }
    }
});

const dataItemsTyped = computed(() => {
    return props.dataItems as WidgetResponse[];
});

onMounted(async () => {
    loaded.value = false;
    // await loadItems();
    // await getData();

    if (items.value.length > 0) {
        selectedItem.value = items.value[0];
        selectedItemId.value = items.value[0].id;
    }

    loaded.value = true;
});

const getWidgetComponent = (item: any) => {
    switch (item.type) {
        case 1:
            return WidgetTable;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
            return WidgetChart;
        default:
            return "WidgetDefault";
    }
};

const uniqueWidgetTypes = computed(() => {
    const typeMap = new Map();

    widgetResponses.value.forEach((widgetResponse) => {
        const widgetType = widgetResponse.data.type;

        if (typeMap.has(widgetType)) {
            typeMap.get(widgetType).push(widgetResponse);
        } else {
            typeMap.set(widgetType, [widgetResponse]);
        }
    });

    return Array.from(typeMap.entries()).map(([type, widgets]) => ({
        component: getWidgetComponent({ type }),
        data: widgets.map((widget: any) => ({
            dataWidget: widget.data,
            build: widget.build,
        })),
    }));
});

watchEffect(() => {
    // console.log("reponseData: ", responseData.value);
    // console.log("uniqueWidgetTypes: ", uniqueWidgetTypes.value);
    // console.log("test: ", items.value);
    // console.log("itemMenu: ", itemMenu.value);
    // console.log("SelectedItem:s ", selectedItem.value);
    // console.log("widgetResponses: ", widgetResponses.value);
    // console.log("newHeaders: ", newHeaders.value);
});

const attendants = ref<Attendant[]>([
    {
        prependAvatar: "/img/logo.png",
        title: "Samuel Hugo",
        subtitle: `<span class="text-primary">Ali Connors</span> &mdash; Running errands this weekend, let me know if you're free.`,
    },
    {
        prependAvatar: "/img/logo.png",
        title: "Cardoso P.",
        subtitle: `<span class="text-primary">Alex, Scott</span> &mdash; Sorry, I'm out of town this weekend.`,
    },
    {
        prependAvatar: "/img/logo.png",
        title: "Fonseca A.",
        subtitle: `<span class="text-primary">Sandra Adams</span> &mdash; Any recommendations for Paris?`,
    },
    {
        prependAvatar: "/img/logo.png",
        title: "Lucas F.",
        subtitle: `<span class="text-primary">Trevor Hansen</span> &mdash; Ideas for Heidi's birthday celebration?`,
    },
    {
        prependAvatar: "/img/logo.png",
        title: "Tadeu G.",
        subtitle: `<span class="text-primary">Britta Holt</span> &mdash; Let’s try those Tacos this weekend.`,
    },
]);

const openDialog = (attendant: Attendant) => {
    selectedAttendant.value = attendant;
    dialog.value = true;
};

const closeDialog = () => {
    dialog.value = false;
};
</script>

<template>
    <v-container fluid v-if="loaded" class="primary">
        <v-row class="primary">
            <v-col cols="12">
                <v-toolbar color="secondary" class="mb-4">
                    <v-btn icon>
                        <v-icon color="black">mdi-view-dashboard</v-icon>
                    </v-btn>
                    <v-toolbar-title>Dashboard Teste</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn icon @click="toggleFullscreen">
                        <v-icon>{{
                            isFullscreen
                                ? "mdi-fullscreen-exit"
                                : "mdi-fullscreen"
                        }}</v-icon>
                    </v-btn>

                    <v-menu
                        v-if="
                            responseData.enable_global_auto_refresh ||
                            responseData.enable_local_auto_refresh
                        "
                        offset-y
                    >
                        <template #activator="{ props }">
                            <v-btn v-bind="props" icon>
                                <v-icon>mdi-timer-sand</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="option in timerOptions"
                                :key="option"
                            >
                                <v-list-item-title>{{
                                    option
                                }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-btn
                        v-if="responseData.enable_global_export_to_excel"
                        icon
                    >
                        <v-icon>mdi-file-export</v-icon>
                    </v-btn>
                    <v-btn v-if="responseData.enable_global_filter" icon>
                        <v-icon>mdi-filter</v-icon>
                    </v-btn>
                    <v-btn
                        v-if="responseData.enable_local_export_to_excel"
                        icon
                    >
                        <v-icon>mdi-file-export</v-icon>
                    </v-btn>
                    <v-btn v-if="responseData.enable_local_filter" icon>
                        <v-icon>mdi-filter</v-icon>
                    </v-btn>
                </v-toolbar>

                <!-- <WidgetTable
                    :dataWidget="widgetResponses"
                /> -->

                <!-- <template v-for="(widgetComponent, index) in uniqueWidgetTypes" :key="index">
                    <component 
                    :is="widgetComponent.component" 
                    :data-widget="widgetComponent.data.dataWidget" 
                    :build="responseData.build"
                    />
                </template> -->

                <FixedDash class="mb-4" />
            </v-col>

            <v-navigation-drawer
                :disable-resize-watcher="true"
                mobile-breakpoint="xs"
                location="left"
            >
                <v-list class="menu-left" density="compact" nav>
                    <v-list-item
                        prepend-avatar="/img/logo.png"
                        title="Dashboard"
                        nav
                    />
                    <v-divider inset />

                    <MenuBuilder
                        v-for="item in itemMenu"
                        :key="item.title"
                        :item="item"
                        class="mt-4"
                    />
                </v-list>

                <v-list>
                    <v-list-item nav>
                        <v-toolbar
                            color="#104666"
                            style="border-radius: 10px"
                            class="pa-0 ma-0"
                        >
                            <v-toolbar-title class="text-h6">{{
                                $t("attendants")
                            }}</v-toolbar-title>
                        </v-toolbar>
                    </v-list-item>
                </v-list>

                <v-divider inset />

                <v-list dense>
                    <v-list-item-title class="ml-5 mb-5">
                        Online
                    </v-list-item-title>
                    <v-divider inset />
                    <template
                        v-for="(attendant, index) in attendants"
                        :key="index"
                    >
                        <v-list-item
                            class="d-flex align-center"
                            @click="openDialog(attendant)"
                            :class="['hoverable', 'button-like']"
                        >
                            <v-row no-gutters align="center" class="w-100">
                                <v-col cols="2" class="pa-0">
                                    <v-avatar size="30" class="me-2">
                                        <v-img
                                            :src="attendant.prependAvatar"
                                            alt="Attendant Avatar"
                                        />
                                    </v-avatar>
                                </v-col>

                                <v-col cols="8" class="pa-0">
                                    <v-list-item-action class="ma-0 pa-0">
                                        <v-list-item-title
                                            class="text-body-2"
                                            >{{
                                                attendant.title
                                            }}</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                            class="text-body-3"
                                            v-html="attendant.subtitle"
                                        ></v-list-item-subtitle>
                                    </v-list-item-action>
                                </v-col>

                                <v-col cols="2" class="pa-0 d-flex justify-end">
                                    <v-icon size="16" color="primary"
                                        >mdi-check</v-icon
                                    >
                                </v-col>
                            </v-row>
                        </v-list-item>

                        <v-divider
                            v-if="index !== attendants.length - 1"
                            class="ma-0"
                        />
                    </template>

                    <v-dialog v-model="dialog" max-width="400">
                        <v-card>
                            <v-card-title class="headline">{{
                                selectedAttendant?.title
                            }}</v-card-title>
                            <v-card-text>
                                <p><strong>Details:</strong></p>
                                <div v-html="selectedAttendant?.subtitle"></div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn @click="closeDialog">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-list>
            </v-navigation-drawer>

            <Breadcrumbs />
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
    color: #36a2eb;
}
.text-green {
    color: #4caf50;
}
.text-yellow {
    color: #ffc107;
}
.text-red {
    color: #f44336;
}
.text-grey {
    color: #9e9e9e;
}

.hoverable {
    transition: background-color 0.3s ease;
}

.hoverable:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.button-like {
    cursor: pointer;
}
</style>
