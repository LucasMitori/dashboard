<script setup lang="ts">
interface Button {
    to: string;
    icon: string;
    title: string;
}

const props = defineProps({
    icon: {
        type: String,
        default: "mdi-home",
        required: true,
    },
    title: {
        type: String,
        default: "Home",
        required: true,
    },
    search: {
        type: Boolean,
        default: false,
        required: false,
    },
    ActiveButtons: {
        type: Array as () => Button[],
        default: () => [],
        required: false,
    },
});

const route = useRoute();
const mainStore = useMainStore();

const changeRail = () => {
    mainStore.toogleMenu(!mainStore.toogleMenuBar);
};

// useHead({
//     title: props.title,
//     meta: [
//         {
//             name: "description",
//             content: "Nuxt.js + Vuetify.js project",
//         },
//     ],
// });
</script>

<template>
    <v-app-bar density="comfortable" color="primary">
        <v-app-bar-nav-icon>
            <template #default>
                <v-icon v-if="mainStore.toogleMenuBar" @click="changeRail">
                    mdi-menu-open
                </v-icon>
                <v-icon v-else @click="changeRail"> mdi-menu-close </v-icon>
            </template>
        </v-app-bar-nav-icon>

        <slot name="content">
            <slot name="title">
                <v-toolbar-title :class="$route.meta.submenu ? 'ml-0' : ''">
                    {{ $route.meta.title || props.title }}
                </v-toolbar-title>
            </slot>

            <!-- <slot v-if="search" name="search">
                <v-response max-width="600">
                    <v-text-field
                        v-model="search"
                        class="overflow-hidden"
                        append-inner-icon="mdi-magnify"
                        label="Search"
                        name="search"
                        placeholder="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-response>
            </slot> -->

            <v-spacer />

            <slot v-if="ActiveButtons.length > 0" name="ActiveButtons">
                <v-btn
                    v-for="(button, index) in ActiveButtons"
                    :key="index"
                    :to="button.to"
                    :icon="button.icon"
                    :title="button.title"
                    color="white"
                    class="mr-2"
                >
                    <v-icon>{{ button.icon }}</v-icon>
                </v-btn>
            </slot>
        </slot>
    </v-app-bar>
</template>

<style lang="css" scoped>
/* Add your styles here */
</style>
