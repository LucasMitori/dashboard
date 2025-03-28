<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useIndexStore } from "~/stores/indexStore";

interface Item {
    id?: number;
    name: string;
    description: string;
}

const store = useIndexStore();
const items = ref<Item[]>([]);
const headers = [
    {
        title: "ID",
        value: "id",
        align: "start" as const,
        width: "10%",
        sortable: true,
    },
    {
        title: "Name",
        value: "name",
        align: "start" as const,
        width: "20%",
        sortable: true,
    },
    {
        title: "Description",
        value: "description",
        align: "start" as const,
        width: "50%",
        sortable: true,
    },
    {
        title: "Actions",
        value: "actions",
        align: "center" as const,
        width: "20%",
        sortable: false,
    },
];

const formData = ref<Item>({ name: "", description: "" });
const editingId = ref<number | null>(null);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(5);
const drawerVisible = ref(false);
const dialogVisible = ref(false);

const filteredItems = computed(() => {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    const filtered = store.items.filter((item) =>
        item.name.toLowerCase().includes(lowerCaseQuery)
    );

    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filtered.slice(start, end);
});

const totalPages = computed(() =>
    Math.ceil(
        store.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        ).length / itemsPerPage.value
    )
);

const loadItems = async () => {
    await store.loadItems();
    items.value = store.items;
};

const saveItem = async () => {
    try {
        const cleanData = { ...formData.value };
        delete cleanData.id;
        if (editingId.value !== null) {
            await store.updateItem(editingId.value, cleanData);
        } else {
            await store.addItem(cleanData);
        }
        resetForm();
        await loadItems();
        dialogVisible.value = false;
    } catch (error) {
        console.error("Error saving item:", error);
    }
};

const editItem = (item: Item) => {
    editingId.value = item.id || null;
    formData.value = { ...item };
    dialogVisible.value = true;
};

const deleteItem = async (id: number) => {
    await store.deleteItem(id);
    await loadItems();
};

const resetForm = () => {
    editingId.value = null;
    formData.value = { name: "", description: "" };
};

const clearAllItems = async () => {
    await store.clearAllItems();
    await loadItems();
};

const changePage = (page: number) => {
    currentPage.value = page;
};

const updateItemsPerPage = (value: number) => {
    itemsPerPage.value = value;
    currentPage.value = 1;
};

onMounted(async () => {
    await loadItems();
});
</script>

<template>
    <v-container>
        <h1 class="text-center">Dashboard - IndexedDB</h1>

        <v-card class="mb-4">
            <v-card-title>Add Item</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="saveItem">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="formData.name"
                                label="Name"
                                variant="outlined"
                                required
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-textarea
                                v-model="formData.description"
                                label="Description"
                                variant="outlined"
                                required
                            />
                        </v-col>
                    </v-row>
                    <v-btn type="submit" color="primary">Save</v-btn>
                    <v-btn color="secondary" @click="resetForm">Reset</v-btn>
                </v-form>
            </v-card-text>
        </v-card>

        <v-dialog v-model="dialogVisible" max-width="500">
            <v-card>
                <v-card-title>Edit Item</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveItem">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="formData.name"
                                    label="Name"
                                    variant="outlined"
                                    required
                                />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="formData.description"
                                    label="Description"
                                    variant="outlined"
                                    required
                                />
                            </v-col>
                        </v-row>
                        <v-btn type="submit" color="primary">Save</v-btn>
                        <v-btn color="secondary" @click="dialogVisible = false"
                            >Cancel</v-btn
                        >
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-row class="mb-4">
            <v-col cols="12" md="8">
                <v-text-field
                    v-model="searchQuery"
                    label="Search by Name"
                    variant="outlined"
                    clearable
                />
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-end">
                <v-btn color="primary" class="mr-2" @click="loadItems"
                    >Refresh</v-btn
                >
                <v-btn color="red" @click="clearAllItems">Clear All</v-btn>
                <v-btn
                    color="secondary"
                    class="ml-2"
                    icon="mdi-dots-vertical-circle"
                    @click="drawerVisible = !drawerVisible"
                />
            </v-col>
        </v-row>

        <v-data-table-server
            :headers="headers"
            :items="filteredItems"
            item-value="id"
            items-length="3"
        >
            <template #[`item.actions`]="{ item }">
                <v-btn
                    icon
                    color="primary"
                    size="small"
                    class="mr-2"
                    @click="editItem(item)"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                    icon
                    color="red"
                    size="small"
                    @click="deleteItem(item.id)"
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table-server>

        <v-pagination
            v-model="currentPage"
            :length="totalPages"
            class="mt-4"
            @input="changePage"
        />

        <v-navigation-drawer
            v-model="drawerVisible"
            location="right"
            app
            temporary
            width="300"
        >
            <v-list>
                <v-list-item>
                    <v-list-item-title
                        >Total Items:
                        {{ store.items.length }}</v-list-item-title
                    >
                </v-list-item>
                <v-list-item>
                    <v-list-item-title
                        >Items Per Page: {{ itemsPerPage }}</v-list-item-title
                    >
                </v-list-item>
                <v-list-item>
                    <v-list-item-title
                        >Current Page: {{ currentPage }}</v-list-item-title
                    >
                </v-list-item>
                <v-list-item>
                    <v-select
                        v-model="itemsPerPage"
                        :items="[5, 10, 15, 20]"
                        label="Items Per Page"
                        variant="outlined"
                        @change="updateItemsPerPage"
                    />
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-container>
</template>

<style scoped>
.text-center {
    text-align: center;
    margin-bottom: 20px;
}
</style>
