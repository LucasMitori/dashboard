<script setup lang="ts">
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    style: {
        type: String,
        default: "padding-inline-start: 20px !important",
    },
});
</script>

<template>
    <v-list-item
        v-if="!props.item.submenu"
        :prepend-icon="props.item.icon"
        :to="props.item.to"
        color="blue"
    >
        <v-list-item-title class="title-icons">
            {{ props.item.title }}
            <v-tooltip activator="parent" location="end">
                {{ props.item.title }}
            </v-tooltip>
        </v-list-item-title>
    </v-list-item>

    <v-list-group v-else :value="item" color="blue" active-strategy="leaf">
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="item.icon">
                <v-list-item-title class="title-icons">
                    {{ item.title }}
                    <v-tooltip activator="parent" location="end">
                        {{ item.title }}
                    </v-tooltip>
                </v-list-item-title>
            </v-list-item>
        </template>

        <template v-for="(subItem, i) in props.item.submenu">
            <MenuBuilder v-if="subItem.submenu" :key="i" :item="subItem" />
            <v-list-item
                v-else
                :prepend-icon="subItem.icon"
                :to="subItem.to"
                color="blue"
            >
                <v-list-item-title class="title-icons">
                    {{ subItem.title }}
                    <v-tooltip activator="parent" location="end">
                        {{ subItem.title }}
                    </v-tooltip>
                </v-list-item-title>
            </v-list-item>
        </template>
    </v-list-group>
</template>
