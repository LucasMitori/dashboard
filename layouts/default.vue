<script setup lang="ts">
// import Sidebar from "~/components/Sidebar.vue";
</script>

<template>
    <v-app>
        <Header icon="mdi-home" title="Maruth" />
        <Sidebar />
        <v-main>
            <slot />
        </v-main>
        <Footer />
    </v-app>
</template>
