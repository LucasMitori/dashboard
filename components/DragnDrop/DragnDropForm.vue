<script setup lang="ts">
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import FormDateTimePicker2 from "./DnDTimeDatePicker.vue";
import DnDFormInputApi from "./DnDFormInputApi.vue";

interface InputItem {
    id: string;
    label: string;
    type: string;
}
interface DroppedInput extends InputItem {
    uuid: string;
    name: string;
    label: string;
    hint?: string;
    placeholder?: string;
    cols: number;
    vModel: string;
    options?: string[];
    apiUrl?: string;
}

const inputs = ref<InputItem[]>([
    { id: "text", label: "Text Input", type: "text" },
    { id: "checkbox", label: "Checkbox", type: "checkbox" },
    { id: "textarea", label: "Textarea", type: "textarea" },
    { id: "switch", label: "Switch", type: "switch" },
    { id: "select", label: "Select", type: "select" },
    { id: "slider", label: "Slider", type: "slider" },
    { id: "datetimepicker", label: "Date & Time", type: "datetimepicker" },
    { id: "inputapi", label: "Input Api", type: "inputapi" },
]);

const droppedInputs = ref<DroppedInput[]>([]);
const showModal = ref(false);
const currentInput = ref<InputItem | null>(null);
const selectedInputIndex = ref<number | null>(null);
const showNewInputModal = ref(false);
const newInputType = ref<string | null>(null);
const newInputName = ref("");
const newInputLabel = ref("");
const newInputHint = ref("");
const newInputPlaceholder = ref("");
const newInputCols = ref(6);
const newInputOptions = ref<string[]>([]);
const inputTypes = computed(() => inputs.value.map((input) => input.type));
const draggedIndex = ref<number | null>(null);
const showDeleteConfirm = ref(false);
const deleteIndex = ref<number | null>(null);
const newOption = ref("");

const config = ref({
    name: "",
    label: "",
    hint: "",
    placeholder: "",
    cols: 6,
    options: [] as string[],
    apiUrl: "",
});

function onDragStart(index: number) {
    draggedIndex.value = index;
}

function onDrop(targetIndex: number) {
    if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
        const draggedItem = droppedInputs.value[draggedIndex.value];
        droppedInputs.value.splice(draggedIndex.value, 1);
        droppedInputs.value.splice(targetIndex, 0, draggedItem);
    }
    draggedIndex.value = null;
}

function openNewInputModal(): void {
    showNewInputModal.value = true;
    resetNewInputForm();
}

function closeNewInputModal(): void {
    showNewInputModal.value = false;
}

function resetNewInputForm(): void {
    newInputType.value = null;
    newInputName.value = "";
    newInputLabel.value = "";
    newInputHint.value = "";
    newInputPlaceholder.value = "";
    newInputCols.value = 6;
    newInputOptions.value = [];
}

function addOptionToNewInput(): void {
    if (newOption.value.trim()) {
        newInputOptions.value.push(newOption.value.trim());
        newOption.value = "";
    }
}

function removeOptionFromNewInput(index: number): void {
    newInputOptions.value.splice(index, 1);
}

function addNewCustomInput(): void {
    if (newInputType.value) {
        const newInput: DroppedInput = {
            uuid: uuidv4(),
            vModel: "",
            id: newInputType.value,
            type: newInputType.value,
            name: newInputName.value,
            label: newInputLabel.value,
            hint: newInputHint.value,
            placeholder: newInputPlaceholder.value,
            cols: newInputCols.value,
            options:
                newInputType.value === "select"
                    ? [...newInputOptions.value]
                    : undefined,
            apiUrl: newInputType.value === "inputapi" ? "" : undefined,
        };

        droppedInputs.value.push(newInput);
        closeNewInputModal();
    }
}

function handleDragStart(input: InputItem): void {
    currentInput.value = input;
}

function handleDrop(event: DragEvent): void {
    event.preventDefault();
    if (currentInput.value) {
        showModal.value = true;
        selectedInputIndex.value = null;
        resetConfig();
    }
}

function confirmInput(): void {
    if (currentInput.value) {
        const inputConfig: DroppedInput = {
            uuid: uuidv4(),
            vModel: "",
            id: currentInput.value.id,
            type: currentInput.value.type,
            name: config.value.name,
            label: config.value.label || currentInput.value.label,
            hint: config.value.hint,
            placeholder: config.value.placeholder,
            cols: config.value.cols,
            options:
                currentInput.value.type === "select"
                    ? [...config.value.options]
                    : undefined,
            apiUrl:
                currentInput.value.type === "inputapi"
                    ? config.value.apiUrl
                    : undefined,
        };

        if (selectedInputIndex.value !== null) {
            droppedInputs.value[selectedInputIndex.value] = inputConfig;
        } else {
            droppedInputs.value.push(inputConfig);
        }
        resetModal();
    }
}

function confirmDelete(): void {
    if (deleteIndex.value !== null) {
        droppedInputs.value.splice(deleteIndex.value, 1);
        deleteIndex.value = null;
    }
    showDeleteConfirm.value = false;
}

function editInput(index: number): void {
    selectedInputIndex.value = index;
    currentInput.value = {
        id: droppedInputs.value[index].id,
        label: droppedInputs.value[index].label,
        type: droppedInputs.value[index].type,
    };
    Object.assign(config.value, droppedInputs.value[index]);
    showModal.value = true;
}

function requestDeleteInput(index: number): void {
    deleteIndex.value = index;
    showDeleteConfirm.value = true;
}

function resetConfig(): void {
    config.value = {
        name: "",
        label: "",
        hint: "",
        placeholder: "",
        cols: 6,
        options: [],
        apiUrl: "",
    };
}

function addOption(): void {
    if (newOption.value.trim()) {
        config.value.options.push(newOption.value.trim());
        newOption.value = "";
    }
}

function removeOption(index: number): void {
    config.value.options.splice(index, 1);
}

function resetModal(): void {
    currentInput.value = null;
    selectedInputIndex.value = null;
    showModal.value = false;
}

function saveForm(): void {
    const formData = {
        inputs: droppedInputs.value.map((input, index) => {
            const inputData: Record<string, unknown> = {
                order: index,
                id: input.id,
                type: input.type,
                name: input.name,
                label: input.label,
                hint: input.hint,
                placeholder: input.placeholder,
                cols: input.cols,
                vModel: input.vModel,
            };

            if (input.type === "select" && input.options) {
                inputData.options = input.options;
            }

            if (input.type === "inputapi" && input.apiUrl) {
                inputData.apiUrl = input.apiUrl;
            }

            return inputData;
        }),
    };

    console.log("Saved Form Data:", formData);
}
</script>
<template>
    <v-card class="pa-5">
        <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ $t("createyourownform") }}</span>
        </v-card-title>

        <v-divider class="mb-4" />

        <v-row class="ma-2" style="height: 70vh">
            <v-col
                cols="3"
                class="pa-4"
                style="border-right: 1px solid #e0e0e0"
            >
                <v-list>
                    <v-list-item-title>Drag Inputs</v-list-item-title>
                    <v-list-item
                        v-for="input in inputs"
                        :key="input.id"
                        draggable="true"
                        class="my-2"
                        style="border: 1px solid black; border-radius: 20px"
                        @dragstart="handleDragStart(input)"
                    >
                        <v-list-item-subtitle>{{
                            input.label
                        }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-col>

            <v-col
                cols="9"
                class="pa-4 scroll-container"
                style="background-color: #f9f9f9; position: relative"
                @dragover.prevent
                @drop="handleDrop"
            >
                <v-btn
                    icon
                    size="small"
                    color="primary"
                    style="
                        position: absolute;
                        top: 2px;
                        right: 1px;
                        opacity: 0.8;
                        z-index: 10;
                    "
                    @click="openNewInputModal"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>

                <v-row>
                    <v-col
                        v-for="(droppedInput, index) in droppedInputs"
                        :key="droppedInput.uuid"
                        :cols="droppedInput.cols"
                        draggable="true"
                        @dragstart="onDragStart(index)"
                        @dragover.prevent
                        @drop="onDrop(index)"
                    >
                        <v-card class="pa-3">
                            <div
                                class="d-flex justify-space-between align-center"
                            >
                                <strong>{{
                                    droppedInput.label || "New Input"
                                }}</strong>
                                <div class="d-flex gap-2">
                                    <v-btn
                                        icon
                                        size="x-small"
                                        variant="text"
                                        @click="editInput(index)"
                                    >
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn
                                        icon
                                        size="x-small"
                                        variant="text"
                                        @click="requestDeleteInput(index)"
                                    >
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <div v-if="droppedInput.type === 'text'">
                                <v-text-field
                                    v-model="droppedInput.vModel"
                                    :label="droppedInput.label"
                                    variant="outlined"
                                    :placeholder="droppedInput.placeholder"
                                    :hint="droppedInput.hint"
                                />
                            </div>
                            <div v-else-if="droppedInput.type === 'checkbox'">
                                <v-checkbox
                                    v-model="droppedInput.vModel"
                                    :label="droppedInput.label"
                                />
                            </div>
                            <div v-else-if="droppedInput.type === 'textarea'">
                                <v-textarea
                                    v-model="droppedInput.vModel"
                                    :label="droppedInput.label"
                                    variant="outlined"
                                    :placeholder="droppedInput.placeholder"
                                    :hint="droppedInput.hint"
                                />
                            </div>
                            <div v-else-if="droppedInput.type === 'switch'">
                                <v-switch
                                    v-model="droppedInput.vModel"
                                    inset
                                    :label="droppedInput.label"
                                />
                            </div>
                            <div v-else-if="droppedInput.type === 'select'">
                                <v-select
                                    v-model="droppedInput.vModel"
                                    :label="droppedInput.label"
                                    :items="droppedInput.options"
                                    variant="outlined"
                                />
                            </div>
                            <div v-else-if="droppedInput.type === 'slider'">
                                <v-slider
                                    v-model="droppedInput.vModel"
                                    :label="droppedInput.label"
                                    :hint="droppedInput.hint"
                                    class="mt-3"
                                />
                            </div>
                            <div
                                v-else-if="
                                    droppedInput.type === 'datetimepicker'
                                "
                            >
                                <FormDateTimePicker2
                                    v-model="droppedInput.vModel"
                                    :label="droppedInput.label"
                                    :hint="droppedInput.hint"
                                    :name="droppedInput.name"
                                    class="mt-3"
                                />
                            </div>
                            <div v-else-if="droppedInput.type === 'inputapi'">
                                <DnDFormInputApi
                                    v-model="droppedInput.vModel"
                                    :label="droppedInput.label"
                                    :placeholder="droppedInput.placeholder"
                                    :api-url="droppedInput.apiUrl || ''"
                                    class="mt-3"
                                />
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row
            class="d-flex align-content-center justify-end"
            style="height: 60px"
        >
            <v-btn color="primary" @click="saveForm">Save Form</v-btn>
        </v-row>
    </v-card>

    <v-dialog v-model="showModal" max-width="500px">
        <v-card>
            <v-card-title>
                Configure Input ({{ currentInput?.type || "Unknown" }})
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="config.name"
                    label="Name"
                    variant="outlined"
                    dense
                />
                <v-text-field
                    v-model="config.label"
                    label="Label"
                    variant="outlined"
                    dense
                />
                <v-text-field
                    v-model="config.hint"
                    label="Hint"
                    variant="outlined"
                    dense
                />
                <v-text-field
                    v-model="config.placeholder"
                    label="Placeholder"
                    variant="outlined"
                    dense
                />
                <v-select
                    v-model="config.cols"
                    :items="[6, 12]"
                    label="Input Size (Cols)"
                    variant="outlined"
                    dense
                />
                <div v-if="currentInput?.type === 'select'">
                    <v-divider class="my-4" />
                    <v-text-field
                        v-model="newOption"
                        label="Add Option"
                        variant="outlined"
                        dense
                        class="mb-2"
                    />
                    <v-btn color="primary" variant="text" @click="addOption"
                        >Add Option</v-btn
                    >
                    <v-list>
                        <v-list-item
                            v-for="(option, index) in config.options"
                            :key="index"
                            class="d-flex justify-space-between"
                        >
                            <span>{{ option }}</span>
                            <v-btn
                                icon
                                small
                                variant="text"
                                @click="removeOption(index)"
                            >
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </div>
                <div v-if="currentInput?.type === 'inputapi'">
                    <v-divider class="my-4" />
                    <v-text-field
                        v-model="config.apiUrl"
                        label="API URL"
                        variant="outlined"
                        dense
                    />
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="outlined" @click="resetModal">Cancel</v-btn>
                <v-btn variant="outlined" color="primary" @click="confirmInput"
                    >Save</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showNewInputModal" max-width="500px">
        <v-card>
            <v-card-title>Create New Input</v-card-title>
            <v-card-text>
                <v-select
                    v-model="newInputType"
                    :items="inputTypes"
                    label="Input Type"
                    variant="outlined"
                    dense
                />
                <v-text-field
                    v-model="newInputName"
                    label="Name"
                    variant="outlined"
                    dense
                />
                <v-text-field
                    v-model="newInputLabel"
                    label="Label"
                    variant="outlined"
                    dense
                />
                <v-text-field
                    v-model="newInputHint"
                    label="Hint"
                    variant="outlined"
                    dense
                />
                <v-text-field
                    v-model="newInputPlaceholder"
                    label="Placeholder"
                    variant="outlined"
                    dense
                />
                <v-select
                    v-model="newInputCols"
                    :items="[6, 12]"
                    label="Input Size (Cols)"
                    variant="outlined"
                    dense
                />
                <div v-if="newInputType === 'select'">
                    <v-divider class="my-4" />
                    <v-text-field
                        v-model="newOption"
                        label="Add Option"
                        variant="outlined"
                        dense
                        class="mb-2"
                    />
                    <v-btn
                        color="primary"
                        variant="text"
                        @click="addOptionToNewInput"
                        >Add Option</v-btn
                    >
                    <v-list>
                        <v-list-item
                            v-for="(option, index) in newInputOptions"
                            :key="index"
                            class="d-flex justify-space-between"
                        >
                            <span>{{ option }}</span>
                            <v-btn
                                icon
                                small
                                variant="text"
                                @click="removeOptionFromNewInput(index)"
                            >
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="closeNewInputModal">Cancel</v-btn>
                <v-btn color="primary" @click="addNewCustomInput">Create</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteConfirm" max-width="400px">
        <v-card>
            <v-card-title>Confirm Deletion</v-card-title>
            <v-card-text
                >Are you sure you want to delete this input?</v-card-text
            >
            <v-card-actions>
                <v-btn @click="showDeleteConfirm = false">Cancel</v-btn>
                <v-btn color="red" @click="confirmDelete">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style lang="css" scoped>
.scroll-container {
    overflow-y: auto;
    max-height: 70vh;
}
</style>
