<script setup lang="ts">
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

interface WidgetResponse {
  data: {
    title: string;
    icon: string;
    headers: { value: keyof DataResult; text: string; [key: string]: any }[];
    data: {
      results: DataResult[];
    };
  };
}

const props = defineProps({
  dataWidget: {
    type: Object as PropType<WidgetResponse[]>,
    default: () => [],
    required: true,
  },
  build: {
    type: Object,
    required: true,
  },
});

const getWidgetHeaders = (widgetIndex: number) => {
  const headers = props.dataWidget[widgetIndex]?.data.headers || [];
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

watchEffect(() => {
  // console.log('dataWidget', props.dataWidget);
  console.log('props.builder', props.build);
});
</script>

<template>
  <div v-if="!dataWidget.length">
    <v-row justify="center" align="center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
  </div>

  <div v-else>
    <template v-for="(widgetResponse, widgetIndex) in dataWidget" :key="widgetIndex">
      <v-row>
        <v-col
          :cols="props.build.widgets[widgetIndex]?.cols"
        >
          <v-toolbar color="secondary">
            <v-btn :icon="getValidIcon(widgetResponse.data.icon)"></v-btn>
            <v-toolbar-title>{{ widgetResponse.data.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        
          <p>{{props.build.widgets[widgetIndex]}}</p>

          <!-- Data table inside v-col -->
          <v-data-table-server
            :headers="getWidgetHeaders(widgetIndex)"
            :items="widgetResponse.data.data.results"
            :items-length="widgetResponse.data.data.results.length"
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
                :style="{ 
                    ...parseItem(header.cellStyle), 
                    'font-weight': 'bold',
                    'width': '220px',
                    'height': '90%',
                    'box-sizing': 'border-box',
                    'border-radius': '5px',
                  }"
              >
                <v-icon v-if="header.icon" class="mr-3">
                  {{ header.icon }}
                </v-icon>
                <span style="font-weight: bold; color: white">{{ item[header.key as keyof DataResult]}}</span>
              </v-card>

              <v-card
                v-else
                :color="header.backgroundColor || 'grey'"
                class="ma-0 pa-3 d-flex align-center"
                style="min-width: 170px; height: 90%; box-sizing: border-box; border-radius: 5px;"
              >
                <v-icon v-if="header.icon" class="mr-3" color="white">
                  {{ header.icon }}
                </v-icon>
                <span :style="{ color: header.textColor || 'black' }">
                  {{ item[header.key as keyof DataResult] }}
                </span>
              </v-card>
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<style scoped>
/* styles */
</style>
