<script setup lang="ts">
definePageMeta({
    title: "FlowChart",
    submenu: true,
});

useHead({
    title: `Dashboard`,
    meta: [{ property: "og:title", content: `Dashboard` }],
});
</script>

<template>
    <v-card>
        <DragnDropForm />
    </v-card>
</template>

<style lang="css" scoped>
/* Add your styles here */
</style>
