<script setup lang="ts">
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/mainStore";
import { useRouter } from "vue-router";

const mainStore = useMainStore();
const authStore = useAuthStore();
const rail = computed(() => mainStore.toogleMenuBar);
const router = useRouter();

const toggleRail = () => {
    mainStore.toogleMenu(!mainStore.toogleMenuBar);
};

const listPaths = [
    {
        id: 1,
        icon: "mdi-view-dashboard",
        title: "Dashboard",
        to: "/dashboard",
    },
    {
        id: 2,
        icon: "mdi-sitemap",
        title: "Flowchart",
        to: "/flowchart",
    },
    {
        id: 3,
        icon: "mdi-menu",
        title: "Floating Menu",
        to: "/floatingMenu",
    },
    {
        id: 4,
        icon: "mdi-video-input-component",
        title: "Form",
        to: "/form",
    },
    {
        id: 5,
        icon: "mdi-inbox",
        title: "Inbox",
        to: "/inbox",
    },
    {
        id: 6,
        icon: "mdi-form-select",
        title: "Drag and Drop Form",
        to: "/dndForm",
    },
    {
        id: 7,
        icon: "mdi-database",
        title: "IndexedDB",
        to: "/indexeddb",
    },
    {
        id: 8,
        icon: "mdi-sheep",
        title: "Shepherd",
        to: "/shepherd",
    },
    {
        id: 9,
        icon: "mdi-volume-high",
        title: "Audio Player",
        to: "/audios",
    },
];
</script>

<template>
    <v-navigation-drawer :rail="rail" mobile-breakpoint="xs" class="bg-primary">
        <v-list nav density="compact">
            <v-list-item>
                <template #prepend>
                    <v-avatar rounded="0" @click="toggleRail">
                        <v-img src="/img/logo.png" />
                    </v-avatar>
                </template>
                <v-list-item-title>
                    <h1 class="title-sidebar">
                        {{ authStore.user || "Guest" }}
                    </h1>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-divider class="mx-3" color="white" />

        <v-list density="compact" nav>
            <v-list-item
                v-for="item in listPaths"
                :key="item.id"
                :to="router.resolve(item.to).href"
                :value="item.id"
                color="secondary"
                base-color="white"
                rounded="xl"
            >
                <template #prepend>
                    <v-icon :icon="item.icon" />
                    <v-tooltip activator="parent" location="end">
                        {{ item.title }}
                    </v-tooltip>
                </template>
                <v-list-item-title v-text="item.title" />
            </v-list-item>
        </v-list>

        <template #append>
            <v-divider class="mx-3" color="white" />
            <v-list nav density="compact" style="color: red">
                <v-list-item :to="router.resolve('/logout').href">
                    <v-list-item-title class="title-icons">
                        {{ $t("logout") }}
                    </v-list-item-title>
                    <template #prepend>
                        <v-avatar color="red" size="small">
                            <v-icon size="small" color="white"
                                >mdi-power</v-icon
                            >
                        </v-avatar>
                    </template>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<style lang="css" scoped>
/* Sidebar styles */
</style>
