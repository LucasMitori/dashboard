<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface Item {
    id: number;
    name?: string;
    description?: string;
}

const props = defineProps({
    field: {
        type: Object,
        required: true,
        default: () => ({
            type: "api",
            name: "",
            label: "",
            placeholder: "",
            required: false,
            loading: false,
            multiple: false,
            itemUrl: "",
            itemText: "description",
            itemValue: "id",
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
const items = ref<Item[]>([]);
const selectedItems = ref<number[] | number | null>(null);
const emit = defineEmits(["update:modelValue"]);

const fetchData = async () => {
    try {
        const response = await api.get(props.field.itemUrl);
        items.value = response.data.results;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

watch(
    () => props.field.itemUrl,
    (newUrl) => {
        if (newUrl) {
            fetchData();
        }
    },
    { immediate: true }
);

const formattedItems = computed(() => {
    return items.value.map((item: Item) => ({
        id: item.id,
        title: `${item.name || item.description || item.id} - (#${item.id})`,
    }));
});

const isMultiple = computed(() => props.field.multiple || props.multiple);

watch(
    () => props.field.value,
    (initialValue) => {
        if (initialValue) {
            selectedItems.value = initialValue;
        }
    },
    { immediate: true }
);

watch(
    selectedItems,
    (newSelection) => {
        emit("update:modelValue", newSelection);
    },
    { deep: true }
);
</script>

<template>
    <v-autocomplete
        v-model="selectedItems"
        :label="field.label"
        :required="field.required"
        :placeholder="field.placeholder"
        :items="formattedItems"
        item-text="title"
        item-value="id"
        :readonly="readonlyField"
        :disabled="disabledField"
        :multiple="isMultiple"
        clearable
        closable-chips
        chips
        variant="outlined"
    />
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
