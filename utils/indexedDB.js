import { openDB } from "idb";

const dbName = "mydb";
const dbVersion = 1;
let db;

export async function initDB() {
    db = await openDB(dbName, dbVersion, {
        upgrade(database) {
            if (!database.objectStoreNames.contains("items")) {
                database.createObjectStore("items", {
                    keyPath: "id",
                    autoIncrement: true,
                });
            }
        },
    });
}

export async function addItem(item) {
    return db.add("items", item);
}

export async function getItems() {
    return db.getAll("items");
}

export async function getAllItems() {
    return db.getAll("items");
}

export async function updateItem(id, data) {
    return db.put("items", { id, ...data });
}

export async function deleteItem(id) {
    return db.delete("items", id);
}
