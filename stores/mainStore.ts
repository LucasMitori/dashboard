import { defineStore } from "pinia";

interface Permissions {
    [key: string]: boolean;
}

export const useMainStore = defineStore("mainStore", {
    state: () => ({
        permissions: {} as Permissions,
        redirectTo: "",
        toogleMenuBar: true,
    }),
    actions: {
        toogleMenu(toggle: boolean) {
            this.toogleMenuBar = toggle;
        },
    },
    getters: {
        getPermissions: (state) => state.permissions,
        getToogleMenu: (state) => state.toogleMenuBar,
    },
});
