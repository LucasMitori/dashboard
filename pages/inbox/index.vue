<script setup lang="ts">
import { useEmailStore } from "~/stores/emailStore";
import { ref, onMounted } from "vue";
import MessageSpace from "~/components/Inbox/MessageSpace.vue";
import EmailSpace from "~/components/Inbox/EmailSpace.vue";

const emailStore = useEmailStore();
const loaded = ref(false);
const api = useApi();
const activeView = ref("inbox");
const emails = ref([]);
const isArchiveActive = ref(false);
const searchQuery = ref("");
const currentView = ref("email-details");

watch(
    () => emailStore.selectedEmail(activeView.value),
    (newSelectedEmail) => {
        if (newSelectedEmail) {
            currentView.value = "selected-email";
        } else {
            currentView.value = "email-details";
        }
    }
);

const switchToDetails = () => {
    currentView.value = "email-details";
    emailStore.selectEmail(null);
};

const archiveEmails = () => {
    isArchiveActive.value = !isArchiveActive.value;
};

const loadItems = async function () {
    try {
        const response = await api({
            method: "get",
            url: `/v1/business/profile/`,
        });

        emails.value = response.data.results;
    } catch (error) {
        console.error("loadItems", error);
    }
};

// const replyMode = ref(false);
// const replyContent = ref('');

// function getIcon(action: string) {
//   switch (action) {
//     case 'received':
//       return 'mdi-email';
//     case 'read':
//       return 'mdi-email-open';
//     case 'replied':
//       return 'mdi-reply';
//     default:
//       return 'mdi-information';
//   }
// }

onMounted(async () => {
    loaded.value = true;
    await loadItems();
});
</script>

<template>
    <v-container v-if="loaded" fluid>
        <!-- <v-app-bar app>
            <v-app-bar-title>Inbox ({{ emailStore.unreadEmailsCount }})</v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>mdi-refresh</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-cog</v-icon></v-btn>
        </v-app-bar> -->

        <v-navigation-drawer
            permanent
            app
            :disable-resize-watcher="true"
            mobile-breakpoint="xs"
            variant="plain"
        >
            <v-list>
                <v-list-item
                    prepend-avatar="/img/logo.png"
                    subtitle="example@google.com"
                    title="Example User"
                    class="mb-5"
                >
                    <template #append>
                        <v-btn
                            icon="mdi-menu-down"
                            size="small"
                            variant="text"
                        />
                    </template>
                </v-list-item>

                <v-divider />

                <v-row class="pa-5">
                    <v-btn
                        color="indigo-darken-3"
                        size="large"
                        block
                        prepend-icon="mdi-email-plus-outline"
                        style="font-size: 14px; font-weight: 900"
                    >
                        New Message
                    </v-btn>
                </v-row>
            </v-list>

            <v-list nav density="compact">
                <v-list-item
                    value="inbox"
                    prepend-icon="mdi-email"
                    :active="activeView === 'inbox'"
                    @click="activeView = 'inbox'"
                >
                    <v-list-item-title>Inbox</v-list-item-title>
                </v-list-item>
                <v-list-item
                    value="sent"
                    prepend-icon="mdi-send"
                    :active="activeView === 'sent'"
                    @click="activeView = 'sent'"
                >
                    <v-list-item-title>Sent</v-list-item-title>
                </v-list-item>
                <v-list-item
                    value="drafts"
                    prepend-icon="mdi-file"
                    :active="activeView === 'draft'"
                    @click="activeView = 'draft'"
                >
                    <v-list-item-title>Drafts</v-list-item-title>
                </v-list-item>
                <v-list-item
                    value="trash"
                    prepend-icon="mdi-delete"
                    :active="activeView === 'trash'"
                    @click="activeView = 'trash'"
                >
                    <v-list-item-title>Trash</v-list-item-title>
                </v-list-item>
            </v-list>

            <template #append>
                <v-divider />
                <div class="pa-2">
                    <v-btn block>Logout</v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <v-row>
            <v-toolbar
                density="compact"
                class="mb-5 pa-3"
                rounded="lg"
                color="primary"
                style="background-color: #1e88e5; border-radius: 15px"
            >
                <v-app-bar-nav-icon class="white--text" />

                <v-toolbar-title class="white--text"
                    >Inbox ({{ emailStore.unreadEmailsCount }})</v-toolbar-title
                >

                <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    single-line
                    rounded
                    placeholder="Search"
                    dense
                    class="rounded-search pa-5"
                    color="white"
                />

                <v-spacer />

                <v-btn
                    icon
                    :disabled="currentView === 'email-details'"
                    class="rounded-circle mr-2"
                    style="background-color: #4caf50; color: white"
                    @click="switchToDetails"
                >
                    <v-icon>mdi-information-outline</v-icon>
                </v-btn>

                <v-btn
                    icon
                    :class="{ 'active-btn': isArchiveActive }"
                    style="background-color: #ffd700; color: black"
                    class="rounded-circle"
                    @click="archiveEmails"
                >
                    <v-icon>mdi-archive</v-icon>
                </v-btn>
            </v-toolbar>

            <!-- <v-col cols="4" class="ma-0 " style="min-height: 70vh; padding: 0px">
                
                <v-list v-if="activeView === 'inbox'" style="height: 100%" nav rounded="lg">

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
                                        <template v-if="emailStore.emails.length > 0">

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
            </v-col> -->

            <EmailSpace :active-view="activeView" />

            <!-- <v-divider
                class="ms-3"
                inset
                vertical
            ></v-divider> -->

            <MessageSpace
                :active-view="activeView"
                :current-view="currentView"
            />

            <!-- <v-col cols="8" style="padding: 0px 0px 0px 10px">
                <template v-if="emailStore.selectedEmail && activeView === 'inbox'">
                    <v-toolbar 
                        density="compact"
                        class="mb-5"
                        rounded="lg"
                        color="primary"
                        style="background-color: #1E88E5; border-radius: 15px;"
                    >
                        <v-toolbar-title>Subject: {{ emailStore.selectedEmail.subject }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-arrow-left"></v-btn>
                        <v-btn icon><v-icon>mdi-reply</v-icon></v-btn>
                        <v-btn icon @click="toggleReplyMode"><v-icon>mdi-email-edit-outline</v-icon></v-btn>
                        <v-btn icon><v-icon>mdi-delete</v-icon></v-btn>
                    </v-toolbar>

                    <v-card elevation="3" class="pa-3">
  
                        <v-row align="center" class="pa-4">
                            <span class="text-h6">From: {{ emailStore.selectedEmail.sender }}</span>
                            <v-spacer></v-spacer>
                        
                            <v-btn size="small" variant="text" icon class="mr-2">
                              <v-icon>mdi-reply</v-icon>
                            </v-btn>
                            <v-btn size="small" variant="text" icon class="mr-2">
                              <v-icon>mdi-forward</v-icon>
                            </v-btn>
                            <v-btn size="small" variant="text" icon>
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-row>
                          
                          <v-divider />
                                            
                        <v-card-subtitle class="grey--text text--darken-1">
                          Sent: {{ formatDate(emailStore.selectedEmail.date) }}
                        </v-card-subtitle>
                      
                        <v-row align="center" class="mt-3">
                            <v-col cols="8" style="height: 80px">
                                    <v-select 
                                        v-model="emailStore.selectedEmail.recipient"
                                        :items="emailStore.emails" 
                                        item-title="sender" 
                                        label="To:"
                                        variant="solo-filled"
                                        clearable
                                        class="ma-0"
                                    
                                    >
                                        <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props" :subtitle="item.raw.department"></v-list-item>
                                        </template>
                                    </v-select>
                            </v-col>
                        
                            <v-col cols="3" class="d-flex justify-between align-center" style="height: 80px">
                                <v-btn variant="outlined" class="mr-2" @click="toggleCcField">CC</v-btn>
                                <v-btn variant="outlined" @click="toggleBccField">BCC</v-btn>
                            </v-col>
                        </v-row>
                      
                        <v-expand-transition>
                          <v-row v-if="ccFieldVisible" class="mt-2">
                            <v-col>
                              <v-text-field
                                v-model="ccRecipient"
                                label="CC"
                                prepend-inner-icon="mdi-account-multiple"
                                dense
                                outlined
                                clearable
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-expand-transition>
                      
                        <v-expand-transition>
                          <v-row v-if="bccFieldVisible" class="mt-2">
                            <v-col>
                              <v-text-field
                                v-model="bccRecipient"
                                label="BCC"
                                prepend-inner-icon="mdi-account-off"
                                dense
                                outlined
                                clearable
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-expand-transition>
                            <v-divider class="my-3" />
                        <v-card-text>
                          <p>{{ emailStore.selectedEmail.content }}</p>
                        </v-card-text>
                      </v-card>
                      

                    <v-expand-transition>
                        <v-card v-if="replyMode" flat class="mt-3" elevation="2">
                            <v-card-title>Reply</v-card-title>
                            <v-divider inset/>
                            <v-card-text>
                                <TipTap/>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="primary" @click="sendReply">Send Reply</v-btn>
                                <v-btn variant="text" @click="toggleReplyMode">Cancel</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-expand-transition>
                </template>
                <template v-else>
                    Select an email to view.
                </template>
            </v-col> -->
        </v-row>
    </v-container>

    <v-container v-else>
        <v-progress-linear indeterminate color="primary" />
        <p>Loading...</p>
    </v-container>
</template>

<style scoped>
/* Styles here */
</style>
