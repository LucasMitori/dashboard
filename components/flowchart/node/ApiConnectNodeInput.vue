<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';

interface Option {
  value: string;
  label: string;
  path?: string;
}

interface Item {
  id: number;
  name?: string;
  description?: string;
}

const props = defineProps({
  field: {
    type: Object as PropType<any>,
    required: true,
    default: () => ({
      type: 'apiConnect',
      name: 'option_app',
      firstName: 'option_app',
      firstLabel: '',
      firstPlaceholder: '',
      secondName: 'option_appdata',
      secondLabel: '',
      secondPlaceholder: '',
      required: false,
      loading: false,
      multiple: false,
      options: []
    }),
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  readonlyField: {
    type: Boolean,
    default: false,
  },
  disabledField: {
    type: Boolean,
    default: false,
  },
});

const api = useApi();
const selectedOption = ref<string | null>(null);
const items = ref<Item[]>([]);
const selectedItemId = ref<number | null>(null);
const emit = defineEmits(['update:modelValue']);

const fetchData = async (url: string) => {
  try {
    const response = await api.get(url);
    items.value = response.data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  if (props.field.firstName) {
    selectedOption.value = props.field.options.find((option: Option) => option.value === props.field.firstName)?.value || null;
  }
  
  if (props.field.secondName && selectedOption.value) {
    const selectedPath = props.field.options.find((option: Option) => option.value === selectedOption.value)?.path;
    if (selectedPath) {
      fetchData(selectedPath);
    }
  }
});

watch(selectedOption, async (newValue) => {
    selectedItemId.value = null;
    if (newValue) {
        const selected = props.field.options.find((option: Option) => option.value === newValue);
        if (selected?.path) {
            await fetchData(selected.path);
        }
    }
    emit('update:modelValue', {
        [props.field.firstName]: newValue,
        [props.field.secondName]: selectedItemId.value
    });
});

watch(selectedItemId, (newValue) => {
    emit('update:modelValue', {
        [props.field.firstName]: selectedOption.value,
        [props.field.secondName]: newValue
    });
});


const formattedItems = computed(() => {
  return items.value.map(item => ({
    id: item.id,
    title: `${item.name || item.description || 'Item'} - (#${item.id})`,
  }));
});
</script>

<template>
  <v-row>
    <v-col :cols="6" class="pr-2">
      <v-select
        v-model="selectedOption"
        :name="field.firstName"
        :label="field.firstLabel"
        :placeholder="field.firstPlaceholder"
        :required="field.required"
        :items="field.options"
        item-value="value"
        item-title="label"
        variant="outlined"
        :disabled="disabledField"
        :readonly="readonlyField"
      />
    </v-col>

    <v-col :cols="6" class="pl-2">
      <v-autocomplete
        v-model="selectedItemId"
        :name="field.secondName"
        :label="field.secondLabel"
        :placeholder="field.secondPlaceholder"
        :items="formattedItems"
        item-text="title"
        item-value="id"
        variant="outlined"
        :disabled="disabledField"
        :readonly="readonlyField"
        clearable
        :multiple="multiple"
      />
    </v-col>
  </v-row>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
