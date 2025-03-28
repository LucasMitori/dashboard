<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from "vue";

interface Item {
    id: number;
    name?: string;
    description?: string;
}

const props = defineProps({
    modelValue: {
        type: [String, Number, Array] as PropType<string | number | number[]>,
        default: () => [],
    },
    label: { type: String, required: true },
    placeholder: { type: String, default: "" },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    apiUrl: { type: String, required: true },
});

const emit = defineEmits<{
    (e: "update:modelValue", value: number | number[]): void;
}>();

const api = useApi();

const items = ref<Item[]>([]);

const fetchData = async (): Promise<void> => {
    if (!props.apiUrl) return;
    try {
        const response = await api.get(props.apiUrl);
        items.value = response.data.results as Item[];
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

watch(() => props.apiUrl, fetchData, { immediate: true });

const formattedItems = computed(() =>
    items.value.map((item) => ({
        id: item.id,
        title: `${item.name || item.description || item.id} - (#${item.id})`,
    }))
);

const internalValue = computed<number | number[]>({
    get: () => props.modelValue as number | number[],
    set: (val: number | number[]) => emit("update:modelValue", val),
});
</script>

<template>
    <v-autocomplete
        v-model="internalValue"
        :items="formattedItems"
        :label="label"
        :placeholder="placeholder"
        :required="required"
        :readonly="readonly"
        :disabled="disabled"
        :multiple="multiple"
        clearable
        variant="outlined"
        item-text="title"
        item-value="id"
    />
</template>
