<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { onMounted } from "vue";

const auth = useAuthStore();

definePageMeta({
    middleware: () => auth.isAuthenticated,
});

onMounted(() => {
    auth.logout();
});
</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="text-center">
                <h1>Logging out...</h1>
            </v-col>
        </v-row>
    </v-container>
</template>
