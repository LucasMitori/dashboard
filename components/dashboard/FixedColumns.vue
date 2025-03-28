<script setup lang="ts">
interface ColumnData {
    title: string;
    icon: string;
    toolbarTitle: string;
    layout: string;
    cards: {
        title: string;
        subtitle: string;
        value: string | number;
        color: string;
    }[];
    employees?: Employee[];
    headers?: any[];
}

interface Employee {
    id: number;
    name: string;
    avatar: string;
    completed: number;
    status: string;
}

const page = ref({
    itemsPerPage: 10,
    serverItems: [] as any[],
    loading: true,
    totalItems: 0,
    name: "",
    calories: "",
    search: "",
});

const dashboardData = ref({
    phones: {
        title: "Phones",
        icon: "mdi-phone-plus",
        toolbarTitle: "Phones",
        layout: "custom",
        cards: [
            {
                title: "Available",
                subtitle: "current month",
                value: 12,
                color: "#4CAF50",
                layout: { cols: 4, height: 2 },
            },
            {
                title: "In queue",
                subtitle: "current month",
                value: 8,
                color: "primary",
                layout: { cols: 6 },
            },
            {
                title: "In progress",
                subtitle: "current month",
                value: 5,
                color: "primary",
                layout: { cols: 6 },
            },
            {
                title: "Oldest Missed Call",
                subtitle: "current month",
                value: "2 days 10:40:20",
                color: "primary",
                layout: { cols: 12 },
            },
        ],
        employees: [
            {
                id: 1,
                name: "Samuel",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 34,
            },
            {
                id: 2,
                name: "Cardoso",
                avatar: "/img/logo.png",
                status: "Away",
                completed: 56,
            },
            {
                id: 3,
                name: "Fonseca",
                avatar: "/img/logo.png",
                status: "Offline",
                completed: 12,
            },
            {
                id: 4,
                name: "Lucas",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 5,
            },
            {
                id: 5,
                name: "Tadeu",
                avatar: "/img/logo.png",
                status: "Offline",
                completed: 98,
            },
            {
                id: 6,
                name: "Samuel",
                avatar: "/img/logo.png",
                status: "Away",
                completed: 33,
            },
            {
                id: 7,
                name: "Cardoso",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 20,
            },
        ],
        headers: [
            {
                title: "ID",
                value: "id",
                align: "start" as const,
                sortable: true,
                width: "10%",
            },
            {
                title: "Name",
                value: "name",
                align: "start" as const,
                sortable: true,
                width: "50%",
            },
            {
                title: "Status",
                value: "status",
                align: "start" as const,
                sortable: true,
                width: "20%",
            },
            {
                title: "Completed",
                value: "completed",
                align: "start" as const,
                sortable: true,
                width: "20%",
            },
        ],
    },
    chats: {
        title: "Chats",
        icon: "mdi-chat",
        toolbarTitle: "Chats",
        layout: "grid",
        cards: [
            {
                title: "Good Ratings",
                subtitle: "current month",
                value: "85%",
                color: "primary",
                layout: { cols: 6 },
            },
            {
                title: "Average Wait Time",
                subtitle: "today",
                value: "2:40 mins",
                color: "primary",
                layout: { cols: 6 },
            },
            {
                title: "Total",
                subtitle: "current week",
                value: 123,
                color: "primary",
                layout: { cols: 6 },
            },
            {
                title: "Average Duration",
                subtitle: "current week",
                value: "4:10 mins",
                color: "primary",
                layout: { cols: 6 },
            },
        ],
        employees: [
            {
                id: 1,
                name: "Samuel",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 34,
            },
            {
                id: 2,
                name: "Cardoso",
                avatar: "/img/logo.png",
                status: "Away",
                completed: 56,
            },
            {
                id: 3,
                name: "Fonseca",
                avatar: "/img/logo.png",
                status: "Offline",
                completed: 12,
            },
            {
                id: 4,
                name: "Lucas",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 5,
            },
            {
                id: 5,
                name: "Tadeu",
                avatar: "/img/logo.png",
                status: "Offline",
                completed: 98,
            },
            {
                id: 6,
                name: "Samuel",
                avatar: "/img/logo.png",
                status: "Away",
                completed: 33,
            },
            {
                id: 7,
                name: "Cardoso",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 20,
            },
        ],
        headers: [
            {
                title: "ID",
                value: "id",
                align: "start" as const,
                sortable: true,
                width: "10%",
            },
            {
                title: "Name",
                value: "name",
                align: "start" as const,
                sortable: true,
                width: "50%",
            },
            {
                title: "Status",
                value: "status",
                align: "start" as const,
                sortable: true,
                width: "20%",
            },
            {
                title: "Completed",
                value: "completed",
                align: "start" as const,
                sortable: true,
                width: "20%",
            },
        ],
    },
    cases: {
        title: "Cases",
        icon: "mdi-briefcase-account-outline",
        toolbarTitle: "Cases",
        layout: "custom",
        cards: [],
        employees: [
            {
                id: 1,
                name: "Samuel",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 34,
            },
            {
                id: 2,
                name: "Cardoso",
                avatar: "/img/logo.png",
                status: "Away",
                completed: 56,
            },
            {
                id: 3,
                name: "Fonseca",
                avatar: "/img/logo.png",
                status: "Offline",
                completed: 12,
            },
            {
                id: 4,
                name: "Lucas",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 5,
            },
            {
                id: 5,
                name: "Tadeu",
                avatar: "/img/logo.png",
                status: "Offline",
                completed: 98,
            },
            {
                id: 6,
                name: "Samuel",
                avatar: "/img/logo.png",
                status: "Away",
                completed: 33,
            },
            {
                id: 7,
                name: "Cardoso",
                avatar: "/img/logo.png",
                status: "Active",
                completed: 20,
            },
        ],
        headers: [
            {
                title: "ID",
                value: "id",
                align: "start" as const,
                sortable: true,
                width: "10%",
            },
            {
                title: "Name",
                value: "name",
                align: "start" as const,
                sortable: true,
                width: "50%",
            },
            {
                title: "Status",
                value: "status",
                align: "start" as const,
                sortable: true,
                width: "20%",
            },
            {
                title: "Completed",
                value: "completed",
                align: "start" as const,
                sortable: true,
                width: "20%",
            },
        ],
    },
});

const topEmployees = computed(() => {
    return dashboardData.value.cases.employees
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 3);
});

function updateDashboardData(newData: any) {
    dashboardData.value = newData;
}

const getBorderStyle = (index: number) => {
    switch (index) {
        case 0:
            return "border: 5px solid gold";
        case 1:
            return "border: 5px solid silver";
        case 2:
            return "border: 5px solid #cd7f32";
        default:
            return "";
    }
};

function getStatusColor(status: string): string {
    switch (status) {
        case "Active":
            return "green";
        case "Away":
            return "orange";
        case "Offline":
            return "red";
        default:
            return "grey";
    }
}
</script>

<template>
    <v-row class="ma-1">
        <v-col v-for="(section, key) in dashboardData" :key="key" cols="4">
            <v-toolbar dark prominent class="mb-5" style="border-radius: 16px">
                <v-icon :icon="section.icon" class="ml-3 custom-icon" />
                <v-toolbar-title>{{ section.title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="custom-btn">
                    <v-icon>mdi-cogs</v-icon>
                </v-btn>
            </v-toolbar>

            <!-- <v-row>
        <v-col v-for="(card, index) in section.cards" :key="index" :cols="index === 0 ? 4 : 6">
          <v-card class="mx-auto" :title="card.title" :subtitle="card.subtitle" :color="card.color">
            <v-card-text>
              <div class="data-text">{{ card.value }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row> -->

            <!-- <v-row>
        <template v-if="key === 'phones'">
          <v-col cols="4" style="min-height: 100%;">
            <v-card class="mx-auto" :title="section.cards[0].title" :subtitle="section.cards[0].subtitle" :color="section.cards[0].color" style="height: 100%;">
              <v-card-text>
                <div class="data-text">{{ section.cards[0].value }}</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="8">
            <v-row>
              <v-col v-for="(card, index) in section.cards.slice(1, 3)" :key="index" cols="6">
                <v-card class="mx-auto" :title="card.title" :subtitle="card.subtitle" :color="card.color">
                  <v-card-text>
                    <div class="data-text">{{ card.value }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-card class="mx-auto" :title="section.cards[3].title" :subtitle="section.cards[3].subtitle" :color="section.cards[3].color">
                  <v-card-text>
                    <div class="data-text">{{ section.cards[3].value }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </template>

        <template v-else-if="key === 'chats'">
          <v-col v-for="(card, index) in section.cards" :key="index" cols="6">
            <v-card class="mx-auto" :title="card.title" :subtitle="card.subtitle" :color="card.color">
              <v-card-text>
                <div class="data-text">{{ card.value }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
      </v-row> -->

            <v-row v-if="section.layout === 'custom' && section.cards.length">
                <v-col cols="4" style="min-height: 100%">
                    <v-card
                        v-if="section.cards[0]"
                        class="mx-auto"
                        :title="section.cards[0].title"
                        :subtitle="section.cards[0].subtitle"
                        :color="section.cards[0].color"
                        style="height: 100%"
                    >
                        <v-card-text>
                            <div class="data-text">
                                {{ section.cards[0].value }}
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="8">
                    <v-row>
                        <v-col
                            v-for="(card, index) in section.cards.slice(1, 3)"
                            :key="index"
                            cols="6"
                        >
                            <v-card
                                class="mx-auto"
                                :title="card.title"
                                :subtitle="card.subtitle"
                                :color="card.color"
                            >
                                <v-card-text>
                                    <div class="data-text">
                                        {{ card.value }}
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row v-if="section.cards[3]">
                        <v-col cols="12">
                            <v-card
                                class="mx-auto"
                                :title="section.cards[3].title"
                                :subtitle="section.cards[3].subtitle"
                                :color="section.cards[3].color"
                            >
                                <v-card-text>
                                    <div class="data-text">
                                        {{ section.cards[3].value }}
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-row v-else-if="section.layout === 'grid'">
                <v-col
                    v-for="(card, index) in section.cards"
                    :key="index"
                    cols="6"
                >
                    <v-card
                        class="mx-auto"
                        :title="card.title"
                        :subtitle="card.subtitle"
                        :color="card.color"
                    >
                        <v-card-text>
                            <div class="data-text">{{ card.value }}</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row v-if="key === 'cases'">
                <v-col cols="12">
                    <v-card
                        title="Top Employees"
                        subtitle="Current Month"
                        color="primary"
                    >
                        <v-card-text>
                            <v-row class="d-flex justify-center mb-1">
                                <v-col
                                    cols="4"
                                    v-for="(employee, index) in topEmployees"
                                    :key="employee.id"
                                >
                                    <v-avatar
                                        size="80"
                                        class="mb-4 ml-4"
                                        :style="getBorderStyle(index)"
                                    >
                                        <v-img :src="employee.avatar"></v-img>
                                    </v-avatar>
                                    <div class="employee-name">
                                        {{ employee.name }}
                                    </div>
                                    <div class="employee-score">
                                        {{ employee.completed }} Points
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row v-if="section.employees">
                <v-col>
                    <v-card>
                        <v-toolbar
                            density="comfortable"
                            class="secondary"
                            elevation="1"
                        >
                            <template v-slot:prepend>
                                <v-icon
                                    class="ml-2"
                                    color="white"
                                    icon="mdi-calendar-month"
                                ></v-icon>
                            </template>
                            <v-toolbar-title>Current Month</v-toolbar-title>
                        </v-toolbar>

                        <v-data-table-server
                            :headers="section.headers"
                            :items="section.employees"
                            :items-per-page="5"
                            :items-length="page.totalItems"
                            class="elevation-1 navy-table"
                            style="border-radius: 0px 0px 5px 5px"
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
                                <div class="text-right">
                                    {{ item.completed }}%
                                </div>
                            </template>
                        </v-data-table-server>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<style lang="css" scoped></style>
