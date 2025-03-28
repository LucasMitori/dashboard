<script setup lang="ts">
interface User {
    dashboard_page?: number;
}

definePageMeta({
    title: "Testes",
    submenu: true,
});

const route = useRoute();
const { t: $t } = useI18n();
const auth = useAuthStore() as { user: User | null };

useHead({
    title: "Dashboard",
    meta: [
        {
            name: "description",
            content: "Login page for the Maruth dashboard",
        },
    ],
});

const slugs = ["dashboard"];

const idPage = computed(() => auth.user?.dashboard_page || 0);

// console.log("User info:", auth.user);
// console.log("User info:", idPage.value);
</script>

<template>
    <PageBuilder title="Dashboard" :slugs="slugs" :idPage="idPage" />
</template>

<style scoped></style>
