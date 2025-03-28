<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

interface DateTimePickerProps {
    modelValue: string;
    label: string;
    name: string;
    readonly?: boolean;
    disabled?: boolean;
}

const props = defineProps<DateTimePickerProps>();
const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const { t: $t } = useI18n();

const dialog = ref(false);
const tempSelectedDate = ref<Date | null>(null);
const tempSelectedTime = ref<string | null>(null);
const selectedTab = ref<"date" | "time">("date");

function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const displayValue = computed<string>(() => {
    if (props.modelValue) {
        try {
            let date: Date;
            if (props.modelValue.includes("T")) {
                const [datePart, timePart] = props.modelValue.split("T");
                if (!datePart || !timePart) {
                    throw new Error("Invalid date-time format");
                }
                date = new Date(`${datePart}T${timePart}`);
            } else if (props.modelValue.includes(" ")) {
                const [datePart, timePart] = props.modelValue.split(" ");
                if (!datePart || !timePart) {
                    throw new Error("Invalid date-time format");
                }
                date = new Date(`${datePart}T${timePart}`);
            } else {
                throw new Error("Unknown date-time format");
            }
            if (Number.isNaN(date.getTime())) {
                throw new Error("Invalid date object");
            }
            return formatDateTime(date);
        } catch (error) {
            console.error("Error parsing modelValue:", error);
            return "";
        }
    }
    return "";
});

const isDateSelected = computed<boolean>(() => !!tempSelectedDate.value);
const canSave = computed<boolean>(
    () => !!tempSelectedDate.value && !!tempSelectedTime.value
);

const openDialog = (): void => {
    if (props.modelValue) {
        try {
            if (props.modelValue.includes("T")) {
                const [datePart, timePart] = props.modelValue.split("T");
                tempSelectedDate.value = new Date(`${datePart}T00:00:00`);
                tempSelectedTime.value = timePart || null;
            } else if (props.modelValue.includes(" ")) {
                const [datePart, timePart] = props.modelValue.split(" ");
                tempSelectedDate.value = new Date(`${datePart}T00:00:00`);
                tempSelectedTime.value = timePart || null;
            } else {
                tempSelectedDate.value = null;
                tempSelectedTime.value = null;
            }
        } catch (error) {
            console.error("Error initializing dialog:", error);
            tempSelectedDate.value = null;
            tempSelectedTime.value = null;
        }
    } else {
        tempSelectedDate.value = null;
        tempSelectedTime.value = null;
    }
    selectedTab.value = "date";
    dialog.value = true;
};

const closeDialog = (): void => {
    dialog.value = false;
};

const saveDateTime = (): void => {
    if (tempSelectedDate.value && tempSelectedTime.value) {
        try {
            const date = new Date(tempSelectedDate.value);
            const timeParts = tempSelectedTime.value.split(":");
            if (timeParts.length < 2) {
                throw new Error("Time format should be HH:mm or HH:mm:ss");
            }
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
            if (
                isNaN(hours) ||
                isNaN(minutes) ||
                isNaN(seconds) ||
                hours < 0 ||
                hours > 23 ||
                minutes < 0 ||
                minutes > 59 ||
                seconds < 0 ||
                seconds > 59
            ) {
                throw new Error("Invalid time values");
            }
            date.setHours(hours, minutes, seconds);
            const formattedDate = formatDateTime(date);
            emit("update:modelValue", formattedDate);
        } catch (error) {
            console.error("Error saving date and time:", error);
        }
    } else {
        emit("update:modelValue", "");
    }
    closeDialog();
};

const clearDateTime = (): void => {
    tempSelectedDate.value = null;
    tempSelectedTime.value = null;
    emit("update:modelValue", "");
    closeDialog();
};

watch(tempSelectedDate, (newValue) => {
    if (!newValue) {
        tempSelectedTime.value = null;
        selectedTab.value = "date";
    } else {
        selectedTab.value = "time";
    }
});

watch(selectedTab, (newTab) => {
    if (newTab === "time" && !isDateSelected.value) {
        selectedTab.value = "date";
    }
});
</script>

<template>
    <div>
        <v-text-field
            :model-value="displayValue"
            :label="label"
            :name="name"
            @click="openDialog"
            variant="outlined"
            :readonly="readonly"
            :disabled="disabled"
        />
        <v-dialog v-model="dialog" width="600" persistent>
            <v-card>
                <v-toolbar color="primary" dark>
                    <v-btn icon @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t("dateHour") }}</v-toolbar-title>
                    <v-spacer />
                    <v-btn icon @click="closeDialog">
                        <v-icon>mdi-fullscreen</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-tabs v-model="selectedTab">
                        <v-tab
                            value="date"
                            icon="mdi-calendar"
                            style="min-width: 150px"
                        >
                            {{ $t("calendar") }}
                        </v-tab>
                        <v-tab
                            value="time"
                            icon="mdi-clock"
                            :disabled="!isDateSelected"
                            style="min-width: 150px"
                        >
                            {{ $t("hour") }}
                        </v-tab>
                    </v-tabs>
                    <v-window v-model="selectedTab">
                        <v-window-item
                            value="date"
                            class="d-flex justify-center"
                        >
                            <v-date-picker
                                v-if="selectedTab === 'date'"
                                v-model="tempSelectedDate"
                                hide-weekdays
                                show-adjacent-months
                                width="500"
                            />
                        </v-window-item>
                        <v-window-item
                            value="time"
                            class="d-flex justify-center"
                        >
                            <v-time-picker
                                v-if="selectedTab === 'time'"
                                v-model="tempSelectedTime"
                                scrollable
                                format="24hr"
                                use-seconds
                                color="green-lighten-1"
                            />
                        </v-window-item>
                    </v-window>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" @click="clearDateTime">{{
                        $t("clear")
                    }}</v-btn>
                    <v-btn
                        color="success"
                        @click="saveDateTime"
                        :disabled="!canSave"
                    >
                        {{ $t("save") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
