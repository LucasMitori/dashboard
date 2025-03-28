import { initDB } from "~/utils/indexedDB";

export default defineNuxtPlugin(async () => {
    await initDB();
    console.log("IndexedDB initialized");
});
