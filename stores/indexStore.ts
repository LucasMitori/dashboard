import { defineStore } from "pinia";
import {
    addItem,
    getAllItems,
    updateItem,
    deleteItem,
} from "~/utils/indexedDB";

interface Item {
    id?: number;
    name: string;
    description: string;
}

export const useIndexStore = defineStore("indexStore", {
    state: () => ({
        items: [] as Item[],
    }),
    actions: {
        async loadItems(): Promise<void> {
            this.items = await getAllItems();
        },

        async addItem(item: Omit<Item, "id">): Promise<void> {
            const id = await addItem(item);
            this.items.push({ id, ...item });
        },

        async updateItem(id: number, data: Omit<Item, "id">): Promise<void> {
            await updateItem(id, data);
            const index = this.items.findIndex((item) => item.id === id);
            if (index !== -1) {
                this.items[index] = { id, ...data };
            }
        },

        async deleteItem(id: number): Promise<void> {
            await deleteItem(id);
            this.items = this.items.filter((item) => item.id !== id);
        },

        getItemById(id: number): Item | undefined {
            return this.items.find((item) => item.id === id);
        },

        searchItemsByName(query: string): Item[] {
            const lowerCaseQuery = query.toLowerCase();
            return this.items.filter((item) =>
                item.name.toLowerCase().includes(lowerCaseQuery)
            );
        },

        async clearAllItems(): Promise<void> {
            const ids = this.items
                .map((item) => item.id)
                .filter((id): id is number => id !== undefined);
            for (const id of ids) {
                await deleteItem(id);
            }
            this.items = [];
        },

        getPaginatedItems(page: number, perPage: number): Item[] {
            const start = (page - 1) * perPage;
            const end = start + perPage;
            return this.items.slice(start, end);
        },
    },
});
