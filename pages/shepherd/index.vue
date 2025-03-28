<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref } from "vue";
import Shepherd, { Tour, type Tour as ShepherdTour } from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

interface User {
    id: number;
    name: string;
    position: string;
    phone: string;
    email: string;
    status: string;
}

const allUsers = ref<User[]>([
    {
        id: 1,
        name: "Alice Johnson",
        position: "Developer",
        phone: "123-456-7890",
        email: "alice@sac.com",
        status: "Active",
    },
    {
        id: 2,
        name: "Bob Smith",
        position: "Designer",
        phone: "234-567-8901",
        email: "bob@sac.com",
        status: "Active",
    },
    {
        id: 3,
        name: "Charlie Brown",
        position: "Manager",
        phone: "345-678-9012",
        email: "charlie@sac.com",
        status: "Inactive",
    },
]);

for (let i = 4; i <= 20; i++) {
    allUsers.value.push({
        id: i,
        name: `User ${i}`,
        position: i % 2 === 0 ? "Developer" : "Designer",
        phone: `555-000-${("000" + i).slice(-3)}`,
        email: `user${i}@sac.com`,
        status: i % 3 === 0 ? "Inactive" : "Active",
    });
}

const tableOptions = ref({
    page: 1,
    itemsPerPage: 5,
    sortBy: [] as string[],
    sortDesc: [] as boolean[],
    groupBy: [] as string[],
    groupDesc: [] as boolean[],
    multiSort: false,
    mustSort: false,
});

const search = ref("");
const loading = ref(false);

const totalUsers = computed(() => {
    return allUsers.value.filter((u) =>
        u.name.toLowerCase().includes(search.value.toLowerCase())
    ).length;
});

const paginatedUsers = computed(() => {
    const filtered = allUsers.value.filter(
        (u) =>
            u.name.toLowerCase().includes(search.value.toLowerCase()) ||
            u.position.toLowerCase().includes(search.value.toLowerCase()) ||
            u.email.toLowerCase().includes(search.value.toLowerCase())
    );
    if (tableOptions.value.sortBy.length) {
        filtered.sort((a, b) => {
            const sortKey = tableOptions.value.sortBy[0] as keyof User;
            if (a[sortKey] < b[sortKey])
                return tableOptions.value.sortDesc[0] ? 1 : -1;
            if (a[sortKey] > b[sortKey])
                return tableOptions.value.sortDesc[0] ? -1 : 1;
            return 0;
        });
    }
    const start =
        (tableOptions.value.page - 1) * tableOptions.value.itemsPerPage;
    return filtered.slice(start, start + tableOptions.value.itemsPerPage);
});

function onUpdateOptions(newOptions: typeof tableOptions.value) {
    tableOptions.value = newOptions;
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 500);
}

const dialNumber = ref("");
const dialerNumbers = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

function appendNumber(num: number): void {
    dialNumber.value += num.toString();
}

function clearDialer(): void {
    dialNumber.value = "";
}

function dialUser(): void {
    alert(`Discando ${dialNumber.value}`);
    clearDialer();
}

const selectedUser = ref<User | null>(null);
function selectUser(user: User): void {
    selectedUser.value = user;
    dialNumber.value = user.phone;
}

const tour: Ref<ShepherdTour | null> = ref(null);

function startTour(): void {
    if (tour.value) {
        tour.value.start();
        return;
    }
    tour.value = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: { enabled: false },
            classes: "smooth-tour",
            scrollTo: { behavior: "smooth", block: "center" },
        },
        useModalOverlay: true,
    });

    tour.value.on("show", () => {
        const currentStep = tour.value?.getCurrentStep();
        const stepEl = currentStep?.getElement();
        if (stepEl) {
            stepEl.classList.add("flip-in");
            setTimeout(() => {
                stepEl.classList.remove("flip-in");
            }, 600);
        }
    });

    const dismissButton = {
        text: "Cancelar",
        action: () => {
            tour.value?.cancel();
        },
    };
    const previousButton = {
        text: "Anterior",
        action: () => {
            tour.value?.back();
        },
    };
    const nextButton = {
        text: "Próximo",
        action: () => {
            tour.value?.next();
        },
    };

    tour.value.addStep({
        id: "bem-vindo",
        title: "Bem-vindo",
        text: "Bem-vindo ao Shepperd! Este tour irá guiá-lo pelos principais recursos.",
        attachTo: { element: ".v-card-title", on: "bottom" },
        buttons: [dismissButton, nextButton],
    });

    tour.value.addStep({
        id: "tabela",
        title: "Tabela de Usuários",
        text: "Esta tabela exibe a lista de usuários da empresa. Você pode pesquisar, ordenar e paginar os dados.",
        attachTo: { element: ".v-data-table", on: "top" },
        buttons: [dismissButton, previousButton, nextButton],
    });

    tour.value.addStep({
        id: "campo-busca",
        title: "Campo de Busca",
        text: "Use este campo para filtrar os usuários por nome, posição ou e-mail.",
        attachTo: { element: "#search-input", on: "bottom" },
        buttons: [dismissButton, previousButton, nextButton],
    });

    tour.value.addStep({
        id: "discador",
        title: "Discador",
        text: 'Clique nos números para formar um telefone e, em seguida, clique em "Dial" para simular uma chamada.',
        attachTo: { element: "#dialer-pad", on: "left" },
        advanceOn: { selector: "#dial-button", event: "click" },
        buttons: [dismissButton, previousButton],
    });

    tour.value.addStep({
        id: "final",
        title: "Final do Tour",
        text: 'Isso conclui o tour! Você pode reiniciá-lo a qualquer momento clicando no botão "Iniciar Tour".',
        attachTo: { element: "#start-tour-btn", on: "top" },
        buttons: [dismissButton, previousButton, nextButton],
    });

    tour.value.start();
}

onMounted(() => {
    setTimeout(() => {
        startTour();
    }, 1000);
});

watch(search, () => {
    onUpdateOptions(tableOptions.value);
});
</script>

<template>
    <v-container fluid>
        <v-row class="mb-4" align="center">
            <v-col cols="12">
                <v-card class="pa-4" color="primary" dark>
                    <v-card-title class="text-h4">Shepherd Teste</v-card-title>
                    <v-card-text>
                        Bem-vindo ao Shepperd. Um tour guiado iniciará
                        automaticamente e você pode reiniciá-lo a qualquer
                        momento clicando no botão "Iniciar Tour".
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            id="start-tour-btn"
                            color="secondary"
                            @click="startTour"
                        >
                            Iniciar Tour
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="9">
                <v-card class="pa-4 mb-4">
                    <v-card-title class="text-h5">Usuários</v-card-title>
                    <v-card-text>
                        <v-data-table-server
                            class="elevation-1"
                            :items="paginatedUsers"
                            :loading="loading"
                            :items-length="totalUsers"
                            :options="tableOptions"
                            color="primary"
                            @update:options="onUpdateOptions"
                        >
                            <template #top>
                                <v-text-field
                                    id="search-input"
                                    v-model="search"
                                    label="Buscar Usuários"
                                    clearable
                                    class="mb-2"
                                />
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn
                                    color="primary"
                                    @click="selectUser(item)"
                                >
                                    Selecionar
                                </v-btn>
                            </template>
                            <template #no-data>
                                <p>Nenhum usuário encontrado.</p>
                            </template>
                        </v-data-table-server>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="3">
                <v-card id="dialer-pad" class="pa-4 mb-4">
                    <v-card-title class="text-h5">Discador</v-card-title>
                    <v-card-text>
                        <v-text-field
                            id="dialer-display"
                            v-model="dialNumber"
                            label="Número"
                            readonly
                        />
                        <v-row class="mt-2" justify="center">
                            <v-col
                                v-for="num in dialerNumbers"
                                :key="num"
                                cols="4"
                            >
                                <v-btn
                                    class="dialer-number-btn"
                                    block
                                    color="secondary"
                                    @click="appendNumber(num)"
                                    >{{ num }}</v-btn
                                >
                            </v-col>
                        </v-row>
                        <v-row class="mt-2" justify="end">
                            <v-col cols="auto">
                                <v-btn color="error" @click="clearDialer"
                                    >Clear</v-btn
                                >
                            </v-col>
                            <v-col cols="auto">
                                <v-btn
                                    id="dial-button"
                                    color="success"
                                    @click="dialUser"
                                    >Dial</v-btn
                                >
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.v-container {
    padding: 16px;
}
.v-card {
    margin-bottom: 16px;
}
.v-card-title {
    font-weight: bold;
}
.v-data-table {
    margin-top: 16px;
}
#dialer-pad {
    background-color: #f5f5f5;
    padding: 16px;
    border-radius: 8px;
}
.dialer-number-btn {
    margin: 4px;
}
.smooth-tour {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: #fff;
}
@keyframes flipIn {
    0% {
        transform: rotateY(90deg);
        opacity: 0;
    }
    100% {
        transform: rotateY(0deg);
        opacity: 1;
    }
}
.flip-in {
    animation: flipIn 0.6s ease-out;
}
</style>
