<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const route = useRoute();
const { t: $t } = useI18n();

interface Button {
    icon: string;
    name: string;
    location: string;
    action: string;
}

const props = defineProps({
    icon: {
        type: String,
        default: "mdi-routes",
    },
    title: {
        type: String,
        default: null,
    },
    search: {
        type: Boolean,
        default: false,
    },
    buttons: {
        type: Array as () => Button[],
        default: () => [],
        required: false,
    },
});

const pathSegments = computed(() => {
    const segments = route.path.split("/").filter(Boolean);
    return [
        ...segments
            .filter((segment) => segment !== "settings")
            .map((segment, index) => {
                return {
                    title: $t(segment),
                    disabled: index === segments.length - 2,
                    href: `/${segments.slice(0, index + 2).join("/")}`,
                };
            }),
    ];
});
</script>

<template>
    <v-app-bar
        v-if="pathSegments.length"
        class="bg-primary"
        elevation="1"
        density="compact"
    >
        <template v-for="(button, index) in buttons" :key="index">
            <template v-if="button.location === 'left'">
                <v-btn icon>
                    <v-icon>{{ button.icon }}</v-icon>
                </v-btn>
                <v-divider vertical></v-divider>
            </template>
        </template>

        <v-app-bar-title class="ml-0">
            <v-breadcrumbs
                class="text-subtitle-1"
                density="compact"
                :items="pathSegments"
            >
                <template #prepend>
                    <v-icon size="small" color="white" :icon="icon"></v-icon>
                </template>
            </v-breadcrumbs>
        </v-app-bar-title>

        <template v-for="(button, index) in buttons" :key="index">
            <template v-if="button.location === 'right'">
                <v-btn icon>
                    <v-icon>{{ button.icon }}</v-icon>
                </v-btn>
                <v-divider vertical></v-divider>
            </template>
        </template>
    </v-app-bar>
</template>

<style scoped>
.nav-link {
    text-decoration: none;
    color: white;
    transition: color 0.3s ease;
    padding-left: 5px;
}

.nav-link:hover {
    color: #4dacbf;
}

.active-link {
    color: gold;
}

.separator {
    margin: 0 5px;
}
</style>
