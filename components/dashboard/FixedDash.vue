<script setup lang="ts">
import { ref, computed } from "vue";
import GoogleMaps from "./GoogleMaps.vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import FixedCharts from "./FixedCharts.vue";
import FixedColumns from "./FixedColumns.vue";

interface Tab {
    icon: string;
    text: string;
    value: string;
}

const tab = ref("tab-1");
const tabs: Tab[] = [
    {
        icon: "mdi-book-open-page-variant",
        text: "Readme",
        value: "tab-1",
    },
    {
        icon: "mdi-handshake-outline",
        text: "Code of Conduct",
        value: "tab-2",
    },
    {
        icon: "mdi-license",
        text: "MIT License",
        value: "tab-3",
    },
    {
        icon: "mdi-shield-lock-outline",
        text: "Security",
        value: "tab-4",
    },
];

interface Employee {
    id: number;
    name: string;
    avatar: string;
    completed: number;
    status: string;
}

const downloadPDF = async () => {
    const element = document.getElementById("tabs-window");

    if (element) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(element, {
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save("tabs-window-content.pdf");
    }
};

const downloadImage = async () => {
    const element = document.getElementById("tabs-window");

    if (element) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(element, {
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "tabs-window-content.png";
        link.click();
    }
};
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-sheet elevation="3" rounded="lg">
                <v-tabs
                    v-model="tab"
                    align-tabs="center"
                    color="black"
                    height="60"
                    slider-color="#f78166"
                >
                    <v-tab value="fixed_dash">Fixed Dashboard</v-tab>
                    <v-tab value="tab-2">Charts</v-tab>
                    <v-tab value="tab-3">Tests</v-tab>
                    <v-tab value="tab-4">Settings</v-tab>
                </v-tabs>

                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="fixed_dash" id="tabs-window">
                        <v-toolbar
                            flat
                            class="mt-4"
                            border
                            density="comfortable"
                            color="primary"
                        >
                            <v-toolbar-title>Dashboard</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="downloadPDF">
                                <v-icon>mdi-file-pdf-box</v-icon>
                            </v-btn>
                            <v-btn icon @click="downloadImage">
                                <v-icon>mdi-camera</v-icon>
                            </v-btn>
                        </v-toolbar>

                        <FixedColumns />

                        <FixedCharts />
                    </v-tabs-window-item>

                    <v-tabs-window-item value="tab-2" id="tabs-window">
                        <h1>Teste value 2</h1>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="tab-3">
                        <v-row>
                            <v-col cols="7">
                                <v-row>
                                    <v-col cols="6">
                                        <v-card>
                                            <v-row>
                                                <v-col cols="3">
                                                    <v-avatar
                                                        color="primary"
                                                        size="large"
                                                    >
                                                        <v-icon
                                                            >mdi-chart-line</v-icon
                                                        >
                                                    </v-avatar>
                                                </v-col>
                                                <v-col cols="9">
                                                    <v-card-title
                                                        >Sales
                                                        Data</v-card-title
                                                    >
                                                    <v-card-subtitle
                                                        >Current Quarter
                                                        Performance</v-card-subtitle
                                                    >
                                                </v-col>
                                            </v-row>
                                            <!-- <DynamicChart :chartData="salesChartData" :chartType="6" /> -->
                                        </v-card>
                                    </v-col>
                                    <v-col cols="6" class="mt-4">
                                        <v-card>
                                            <v-row>
                                                <v-col cols="3">
                                                    <v-avatar
                                                        color="success"
                                                        size="large"
                                                    >
                                                        <v-icon
                                                            >mdi-chart-bar</v-icon
                                                        >
                                                    </v-avatar>
                                                </v-col>
                                                <v-col cols="9">
                                                    <v-card-title
                                                        >User
                                                        Engagement</v-card-title
                                                    >
                                                    <v-card-subtitle
                                                        >Weekly
                                                        Overview</v-card-subtitle
                                                    >
                                                </v-col>
                                            </v-row>
                                            <!-- <DynamicChart :chartData="engagementChartData" :chartType="6" /> -->
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <v-col cols="5">
                                <h1>Google Maps Area</h1>
                                <!-- <GoogleMaps /> -->
                            </v-col>
                        </v-row>

                        <v-row class="mt-4">
                            <v-col cols="12">
                                <h1>Map</h1>
                                <!-- <MapComponent /> -->
                            </v-col>
                            <!-- <v-col cols="4">
                        <v-card>
                          <v-card-title>Customer Satisfaction</v-card-title>
                          <v-card-subtitle>Last Month Data</v-card-subtitle>
                          <DynamicChart :chartData="satisfactionChartData" :chartType="5" />
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card>
                          <v-card-title>Tickets Overview</v-card-title>
                          <v-card-subtitle>Resolved vs Pending</v-card-subtitle>
                          <DynamicChart :chartData="ticketsChartData" :chartType="8" />
                        </v-card>
                      </v-col>
                      <v-col cols="4">
                        <v-card>
                          <v-card-title>Revenue Growth</v-card-title>
                          <v-card-subtitle>Yearly Comparison</v-card-subtitle>
                          <DynamicChart :chartData="revenueChartData" :chartType="11" />
                        </v-card>
                      </v-col> -->
                        </v-row>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="tab-4">
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

.custom-card {
    background-color: #2c3e50;
    color: white;
    height: 200px;
    position: relative;
    overflow: hidden;
    padding: 10px;
    border-radius: 15px;
}

.custom-second-card {
    background-color: #2c3e50;
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
