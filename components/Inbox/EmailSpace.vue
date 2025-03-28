<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';

const props = defineProps({
  activeView: {
    type: String,
    default: '',
    required: true
  },
});

watchEffect(() => {
  // console.log("Active view updated:", props.activeView);
});

const filter = ref({
  date: '',
  sender: '',
  readStatus: null as boolean | null,
  isPinned: false,
});
const tempFilter = ref({ ...filter.value });

const emailStore = useEmailStore();
const navTab = ref(null);
const expandedPanels = ref([0, 1]);
const pinnedEmails = computed(() => filteredEmails.value.filter(email => email.isPinned));
const unpinnedEmails = computed(() => filteredEmails.value.filter(email => !email.isPinned));
const isFilterDialogOpen = ref(false);

const emails = computed(() => {
  if (props.activeView === 'sent') {
    return emailStore.sentEmails;
  } else if(props.activeView === 'draft') {
    return emailStore.draftEmails;
  } else {
    return emailStore.receivedEmails;
  }
});

const filteredEmails = computed(() => {
  return emails.value.filter((email) => {
    const matchesDate = !filter.value.date || email.date.includes(filter.value.date);
    const matchesSender = !filter.value.sender || email.sender.toLowerCase().includes(filter.value.sender.toLowerCase());
    const matchesReadStatus = filter.value.readStatus === null || email.isRead === filter.value.readStatus;
    const matchesPin = !filter.value.isPinned || email.isPinned;

    return matchesDate && matchesSender && matchesReadStatus && matchesPin;
  });
});

const sendersList = computed(() => {
  return [...new Set(emails.value.map(email => email.sender))];
});

const applyFilters = () => {
  filter.value = { ...tempFilter.value };
  isFilterDialogOpen.value = false;
};

const resetFilters = () => {
  filter.value = {
    date: '',
    sender: '',
    readStatus: null,
    isPinned: false,
  };
  isFilterDialogOpen.value = false; 
};

const onEmailClick = (id: number) => {
  emailStore.selectEmail(id);
  emailStore.markAsRead(id, props.activeView);
};

const togglePin = (email: any) => {
  email.isPinned = !email.isPinned;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>


<template>

    <v-col cols="4" class="ma-0 " style="min-height: 70vh; padding: 0px">
                
        <v-list v-if="props.activeView === 'inbox'" style="height: 100%" nav rounded="lg">

            <v-tabs
                v-model="navTab"
                align-tabs="start"
                color="#FFD700"
                slider-color="#6bbcca"
            >
                <v-tab value="tab-1">Focused</v-tab>
                <v-tab value="tab-pages">Other</v-tab>

                <v-spacer></v-spacer>

                <v-btn color="primary" icon size="small" @click="isFilterDialogOpen = true">
                    <v-icon>mdi-filter-variant</v-icon>
                </v-btn>
            </v-tabs>
            
                <v-dialog v-model="isFilterDialogOpen" max-width="500px">
                <v-card>
                    <v-card-title>
                        Select Filters
                    </v-card-title>
                    <v-card-text>
                    <v-form>
                        <v-list class="ma-0">
                            <v-list-item>
                                <v-text-field
                                v-model="tempFilter.date"
                                label="Date"
                                type="date"
                                clearable
                                class="mt-3"
                                variant="outlined"
                                ></v-text-field>
                            </v-list-item>
                
                            <v-list-item>
                                <v-select
                                    v-model="tempFilter.sender"
                                    :items="sendersList"
                                    label="Sender Name"
                                    clearable
                                    class="mt-3"
                                    variant="outlined"
                                ></v-select>
                            </v-list-item>
                
                            <v-list-item>
                                <v-select
                                v-model="tempFilter.readStatus"
                                :items="[{ title: 'All', value: null }, { title: 'Read', value: true }, { title: 'Unread', value: false }]"
                                label="Read Status"
                                clearable
                                class="mt-3"
                                variant="outlined"
                                ></v-select>
                            </v-list-item>
                
                            <v-list-item>
                                <v-checkbox
                                    v-model="tempFilter.isPinned"
                                    label="Show Pinned Only"
                                    style="max-height: 60px"
                                ></v-checkbox>
                            </v-list-item>
                        </v-list>
                        <v-divider class="mb-4"></v-divider>
                        <v-row>
                        <v-col cols="12" class="text-end">
                            <v-btn @click="resetFilters" color="secondary" class="mr-2">Reset</v-btn>
                            <v-btn @click="applyFilters" color="primary">Apply</v-btn>
                        </v-col>
                        </v-row>
                    </v-form>
                    </v-card-text>
                </v-card>
                </v-dialog>

            <v-tabs-window v-model="navTab">
                <v-tabs-window-item value="tab-1" id="tab-window-1" class="mt-5">
                    <v-expansion-panels multiple v-model="expandedPanels" variant="accordion">
                        
                        <v-expansion-panel>
                            <v-expansion-panel-title color="primary">Pinned Emails</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <template v-if="pinnedEmails.length > 0">
                                    <v-list style="max-height: 600px; overflow-y: auto;" class="ma-0 pa-0">
                                        <v-list-item
                                            v-for="email in pinnedEmails"
                                            :key="email.id"
                                            :title="email.sender"
                                            :subtitle="email.subject"
                                            @click="onEmailClick(email.id)"
                                            :class="{ 'email-item--unread': !email.isRead, 'email-item--read': email.isRead }"
                                            rounded="shaped"
                                            class="my-4 mx-2"
                                        >
                                            <template v-slot:prepend>
                                                <v-avatar color="grey-lighten-1" size="small">
                                                    <v-icon :color="email.isRead ? 'grey' : 'blue'">mdi-email</v-icon>
                                                </v-avatar>
                                            </template>
                        
                                            <v-tooltip activator="parent" location="end">
                                                {{ formatDate(email.date) }}
                                            </v-tooltip>
                        
                                            <template v-slot:append>
                                                <v-btn
                                                    :color="email.isPinned ? 'primary' : 'grey-lighten-1'"
                                                    icon
                                                    variant="text"
                                                    @click.stop="togglePin(email)"
                                                >
                                                    <v-icon>{{ email.isPinned ? 'mdi-pin' : 'mdi-pin-outline' }}</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </template>
                        
                                <v-alert
                                    v-else
                                    type="info"
                                    variant="tonal"
                                    class="text-center"
                                    icon="mdi-information"
                                    border="start"
                                >
                                    There are no pinned emails.
                                </v-alert>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                                            
                        <v-expansion-panel>
                            <v-expansion-panel-title color="primary">
                                Other Emails
                                <template v-slot:actions="{ expanded }">
                                    <v-icon :color="!expanded ? 'teal' : ''" :icon="expanded ? 'mdi-pencil' : 'mdi-check'"></v-icon>
                                </template>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <template v-if="emailStore.receivedEmails.length > 0">

                                    <v-list style="max-height: 600px; overflow-y: auto; " class="ma-0 pa-0">
                                        <v-list-item
                                            v-for="email in unpinnedEmails"
                                            :key="email.id"
                                            :title="email.sender"
                                            :subtitle="email.subject"
                                            @click="onEmailClick(email.id)"
                                            :class="{'email-item--unread': !email.isRead, 'email-item--read': email.isRead}"
                                            rounded="shaped"
                                            class="my-4 mx-2"
                                        >
                                            <template v-slot:prepend>
                                                <v-avatar color="grey-lighten-1" size="small">
                                                    <v-icon :color="email.isRead ? 'grey' : 'blue'">mdi-email</v-icon>
                                                </v-avatar>
                                            </template>
                
                                            <v-tooltip activator="parent" location="end">
                                                {{ formatDate(email.date) }}
                                            </v-tooltip>
                
                                            <template v-slot:append>
                                                <v-btn
                                                    :color="email.isPinned ? 'primary' : 'grey-lighten-1'"
                                                    icon
                                                    variant="text"
                                                    @click.stop="togglePin(email)"
                                                >
                                                    <v-icon>{{ email.isPinned ? 'mdi-pin' : 'mdi-pin-outline' }}</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </template>

                                <v-alert
                                    v-else
                                    type="info"
                                    variant="tonal"
                                    class="text-center"
                                    icon="mdi-information"
                                    border="start"
                                >
                                    There are no unpinned emails.
                                </v-alert>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
        
                    </v-expansion-panels>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-list>

        <v-list v-else-if="props.activeView === 'sent'" style="height: 100%" nav rounded="lg">

            <v-tabs
                v-model="navTab"
                align-tabs="start"
                color="#FFD700"
                slider-color="#6bbcca"
            >
                <v-tab value="tab-1">Sent</v-tab>
                <v-tab value="tab-pages">Other</v-tab>

                <v-spacer></v-spacer>

                <v-btn color="primary" icon size="small" @click="isFilterDialogOpen = true">
                    <v-icon>mdi-filter-variant</v-icon>
                </v-btn>
            </v-tabs>
            
                <v-dialog v-model="isFilterDialogOpen" max-width="500px">
                <v-card>
                    <v-card-title>
                        Select Filters
                    </v-card-title>
                    <v-card-text>
                    <v-form>
                        <v-list class="ma-0">
                            <v-list-item>
                                <v-text-field
                                v-model="tempFilter.date"
                                label="Date"
                                type="date"
                                clearable
                                class="mt-3"
                                variant="outlined"
                                ></v-text-field>
                            </v-list-item>
                
                            <v-list-item>
                                <v-select
                                    v-model="tempFilter.sender"
                                    :items="sendersList"
                                    label="Sender Name"
                                    clearable
                                    class="mt-3"
                                    variant="outlined"
                                ></v-select>
                            </v-list-item>
                
                            <v-list-item>
                                <v-select
                                v-model="tempFilter.readStatus"
                                :items="[{ title: 'All', value: null }, { title: 'Read', value: true }, { title: 'Unread', value: false }]"
                                label="Read Status"
                                clearable
                                class="mt-3"
                                variant="outlined"
                                ></v-select>
                            </v-list-item>
                
                            <v-list-item>
                                <v-checkbox
                                    v-model="tempFilter.isPinned"
                                    label="Show Pinned Only"
                                    style="max-height: 60px"
                                ></v-checkbox>
                            </v-list-item>
                        </v-list>
                        <v-divider class="mb-4"></v-divider>
                        <v-row>
                        <v-col cols="12" class="text-end">
                            <v-btn @click="resetFilters" color="secondary" class="mr-2">Reset</v-btn>
                            <v-btn @click="applyFilters" color="primary">Apply</v-btn>
                        </v-col>
                        </v-row>
                    </v-form>
                    </v-card-text>
                </v-card>
                </v-dialog>

            <v-tabs-window v-model="navTab">
                <v-tabs-window-item value="tab-1" id="tab-window-1" class="mt-5">
                    <v-expansion-panels multiple v-model="expandedPanels" variant="accordion">
                        
                        <v-expansion-panel>
                            <v-expansion-panel-title color="primary">Pinned Emails</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <template v-if="pinnedEmails.length > 0">
                                    <v-list style="max-height: 600px; overflow-y: auto;" class="ma-0 pa-0">
                                        <v-list-item
                                            v-for="email in pinnedEmails"
                                            :key="email.id"
                                            :title="email.sender"
                                            :subtitle="email.subject"
                                            @click="onEmailClick(email.id)"
                                            :class="{ 'email-item--unread': !email.isRead, 'email-item--read': email.isRead }"
                                            rounded="shaped"
                                            class="my-4 mx-2"
                                        >
                                            <template v-slot:prepend>
                                                <v-avatar color="grey-lighten-1" size="small">
                                                    <v-icon :color="email.isRead ? 'grey' : 'blue'">mdi-email</v-icon>
                                                </v-avatar>
                                            </template>
                        
                                            <v-tooltip activator="parent" location="end">
                                                {{ formatDate(email.date) }}
                                            </v-tooltip>
                        
                                            <template v-slot:append>
                                                <v-btn
                                                    :color="email.isPinned ? 'primary' : 'grey-lighten-1'"
                                                    icon
                                                    variant="text"
                                                    @click.stop="togglePin(email)"
                                                >
                                                    <v-icon>{{ email.isPinned ? 'mdi-pin' : 'mdi-pin-outline' }}</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </template>
                        
                                <v-alert
                                    v-else
                                    type="info"
                                    variant="tonal"
                                    class="text-center"
                                    icon="mdi-information"
                                    border="start"
                                >
                                    There are no pinned emails.
                                </v-alert>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                                            
                        <v-expansion-panel>
                            <v-expansion-panel-title color="primary">
                                Other Emails
                                <template v-slot:actions="{ expanded }">
                                    <v-icon :color="!expanded ? 'teal' : ''" :icon="expanded ? 'mdi-pencil' : 'mdi-check'"></v-icon>
                                </template>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <template v-if="emailStore.receivedEmails.length > 0">

                                    <v-list style="max-height: 600px; overflow-y: auto; " class="ma-0 pa-0">
                                        <v-list-item
                                            v-for="email in unpinnedEmails"
                                            :key="email.id"
                                            :title="email.sender"
                                            :subtitle="email.subject"
                                            @click="onEmailClick(email.id)"
                                            :class="{'email-item--unread': !email.isRead, 'email-item--read': email.isRead}"
                                            rounded="shaped"
                                            class="my-4 mx-2"
                                        >
                                            <template v-slot:prepend>
                                                <v-avatar color="grey-lighten-1" size="small">
                                                    <v-icon :color="email.isRead ? 'grey' : 'blue'">mdi-email</v-icon>
                                                </v-avatar>
                                            </template>
                
                                            <v-tooltip activator="parent" location="end">
                                                {{ formatDate(email.date) }}
                                            </v-tooltip>
                
                                            <template v-slot:append>
                                                <v-btn
                                                    :color="email.isPinned ? 'primary' : 'grey-lighten-1'"
                                                    icon
                                                    variant="text"
                                                    @click.stop="togglePin(email)"
                                                >
                                                    <v-icon>{{ email.isPinned ? 'mdi-pin' : 'mdi-pin-outline' }}</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </template>

                                <v-alert
                                    v-else
                                    type="info"
                                    variant="tonal"
                                    class="text-center"
                                    icon="mdi-information"
                                    border="start"
                                >
                                    There are no unpinned emails.
                                </v-alert>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
        
                    </v-expansion-panels>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-list>

        <v-list v-else-if="props.activeView === 'draft'" style="height: 100%" nav rounded="lg">

            <v-tabs
                v-model="navTab"
                align-tabs="start"
                color="#FFD700"
                slider-color="#6bbcca"
            >
                <v-tab value="tab-1">Drafts</v-tab>
                <v-tab value="tab-pages">Other</v-tab>

                <v-spacer></v-spacer>

                <v-btn color="primary" icon size="small" @click="isFilterDialogOpen = true">
                    <v-icon>mdi-filter-variant</v-icon>
                </v-btn>
            </v-tabs>
            
                <v-dialog v-model="isFilterDialogOpen" max-width="500px">
                <v-card>
                    <v-card-title>
                        Select Filters
                    </v-card-title>
                    <v-card-text>
                    <v-form>
                        <v-list class="ma-0">
                            <v-list-item>
                                <v-text-field
                                v-model="tempFilter.date"
                                label="Date"
                                type="date"
                                clearable
                                class="mt-3"
                                variant="outlined"
                                ></v-text-field>
                            </v-list-item>
                
                            <v-list-item>
                                <v-select
                                    v-model="tempFilter.sender"
                                    :items="sendersList"
                                    label="Sender Name"
                                    clearable
                                    class="mt-3"
                                    variant="outlined"
                                ></v-select>
                            </v-list-item>
                
                            <v-list-item>
                                <v-select
                                v-model="tempFilter.readStatus"
                                :items="[{ title: 'All', value: null }, { title: 'Read', value: true }, { title: 'Unread', value: false }]"
                                label="Read Status"
                                clearable
                                class="mt-3"
                                variant="outlined"
                                ></v-select>
                            </v-list-item>
                
                            <v-list-item>
                                <v-checkbox
                                    v-model="tempFilter.isPinned"
                                    label="Show Pinned Only"
                                    style="max-height: 60px"
                                ></v-checkbox>
                            </v-list-item>
                        </v-list>
                        <v-divider class="mb-4"></v-divider>
                        <v-row>
                        <v-col cols="12" class="text-end">
                            <v-btn @click="resetFilters" color="secondary" class="mr-2">Reset</v-btn>
                            <v-btn @click="applyFilters" color="primary">Apply</v-btn>
                        </v-col>
                        </v-row>
                    </v-form>
                    </v-card-text>
                </v-card>
                </v-dialog>

            <v-tabs-window v-model="navTab">
                <v-tabs-window-item value="tab-1" id="tab-window-1" class="mt-5">
                    <v-expansion-panels multiple v-model="expandedPanels" variant="accordion">
                        
                        <v-expansion-panel>
                            <v-expansion-panel-title color="primary">Pinned Emails</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <template v-if="pinnedEmails.length > 0">
                                    <v-list style="max-height: 600px; overflow-y: auto;" class="ma-0 pa-0">
                                        <v-list-item
                                            v-for="email in pinnedEmails"
                                            :key="email.id"
                                            :title="email.sender"
                                            :subtitle="email.subject"
                                            @click="onEmailClick(email.id)"
                                            :class="{ 'email-item--unread': !email.isRead, 'email-item--read': email.isRead }"
                                            rounded="shaped"
                                            class="my-4 mx-2"
                                        >
                                            <template v-slot:prepend>
                                                <v-avatar color="grey-lighten-1" size="small">
                                                    <v-icon :color="email.isRead ? 'grey' : 'blue'">mdi-email</v-icon>
                                                </v-avatar>
                                            </template>
                        
                                            <v-tooltip activator="parent" location="end">
                                                {{ formatDate(email.date) }}
                                            </v-tooltip>
                        
                                            <template v-slot:append>
                                                <v-btn
                                                    :color="email.isPinned ? 'primary' : 'grey-lighten-1'"
                                                    icon
                                                    variant="text"
                                                    @click.stop="togglePin(email)"
                                                >
                                                    <v-icon>{{ email.isPinned ? 'mdi-pin' : 'mdi-pin-outline' }}</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </template>
                        
                                <v-alert
                                    v-else
                                    type="info"
                                    variant="tonal"
                                    class="text-center"
                                    icon="mdi-information"
                                    border="start"
                                >
                                    There are no pinned emails.
                                </v-alert>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                                            
                        <v-expansion-panel>
                            <v-expansion-panel-title color="primary">
                                Other Emails
                                <template v-slot:actions="{ expanded }">
                                    <v-icon :color="!expanded ? 'teal' : ''" :icon="expanded ? 'mdi-pencil' : 'mdi-check'"></v-icon>
                                </template>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <template v-if="emailStore.receivedEmails.length > 0">

                                    <v-list style="max-height: 600px; overflow-y: auto; " class="ma-0 pa-0">
                                        <v-list-item
                                            v-for="email in unpinnedEmails"
                                            :key="email.id"
                                            :title="email.sender"
                                            :subtitle="email.subject"
                                            @click="onEmailClick(email.id)"
                                            :class="{'email-item--unread': !email.isRead, 'email-item--read': email.isRead}"
                                            rounded="shaped"
                                            class="my-4 mx-2"
                                        >
                                            <template v-slot:prepend>
                                                <v-avatar color="grey-lighten-1" size="small">
                                                    <v-icon :color="email.isRead ? 'grey' : 'blue'">mdi-email</v-icon>
                                                </v-avatar>
                                            </template>
                
                                            <v-tooltip activator="parent" location="end">
                                                {{ formatDate(email.date) }}
                                            </v-tooltip>
                
                                            <template v-slot:append>
                                                <v-btn
                                                    :color="email.isPinned ? 'primary' : 'grey-lighten-1'"
                                                    icon
                                                    variant="text"
                                                    @click.stop="togglePin(email)"
                                                >
                                                    <v-icon>{{ email.isPinned ? 'mdi-pin' : 'mdi-pin-outline' }}</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </template>

                                <v-alert
                                    v-else
                                    type="info"
                                    variant="tonal"
                                    class="text-center"
                                    icon="mdi-information"
                                    border="start"
                                >
                                    There are no unpinned emails.
                                </v-alert>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
        
                    </v-expansion-panels>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-list>

        <div v-else>
            <p>{{ activeView.charAt(0).toUpperCase() + activeView.slice(1) }} view is selected.</p>
        </div>
    </v-col>

</template>

<style lang="css" scoped>

.email-list {
    border-right: 1px solid #ddd;
    max-height: 100vh;
    overflow-y: auto;
}
.email-item--unread {
    background-color: #e3f2fd;
}

.email-item--read {
    background-color: #f5f5f5;
}

.email-detail {
    padding: 16px;
    max-height: 100vh;
    overflow-y: auto;
}

</style>