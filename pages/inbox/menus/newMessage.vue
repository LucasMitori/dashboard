<script setup lang="ts">
import TipTap from "~/components/Tiptap/TipTap.vue";

const props = defineProps({
    data: {
        type: Object,
        required: false,
    },
});

const subject = ref("");
const replyMode = ref(false);
const replyContent = ref("");
const emailStore = useEmailStore();
const ccFieldVisible = ref(false);
const bccFieldVisible = ref(false);
const ccRecipient = ref("");
const bccRecipient = ref("");

const toggleReplyMode = () => {
    replyMode.value = !replyMode.value;
    if (!replyMode.value) replyContent.value = "";
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const sendReply = () => {
    //   if (replyContent.value.trim()) {
    //     alert(`Reply sent: ${replyContent.value}`);
    //     replyMode.value = false;
    //     replyContent.value = '';
    //   }
    console.log("teste");
};

const toggleBccField = () => {
    bccFieldVisible.value = !bccFieldVisible.value;
};

const toggleCcField = () => {
    ccFieldVisible.value = !ccFieldVisible.value;
};
</script>

<template>
    <v-toolbar
        density="compact"
        class="mb-5"
        rounded="lg"
        color="primary"
        style="background-color: #1e88e5; border-radius: 15px"
    >
        <v-text-field label="Subject" ;> </v-text-field>
        <v-toolbar-title>
            Subject:
            <v-text-field
                v-model="subject"
                label="Subject"
                dense
                variant="outlined"
            ></v-text-field>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-arrow-left"></v-btn>
        <v-btn icon><v-icon>mdi-reply</v-icon></v-btn>
        <v-btn icon @click="toggleReplyMode"
            ><v-icon>mdi-email-edit-outline</v-icon></v-btn
        >
        <v-btn icon><v-icon>mdi-delete</v-icon></v-btn>
    </v-toolbar>

    <v-card elevation="3" class="pa-3">
        <v-row align="center" class="pa-4">
            <span class="text-h6"
                >From: {{ emailStore.selectedEmail?.sender }}</span
            >
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
            <!-- Sent: {{ formatDate(emailStore.selectedEmail?.date) }} -->
        </v-card-subtitle>

        <v-row align="center" class="mt-3">
            <v-col cols="8" style="height: 80px">
                <!-- <v-select 
                        v-model="emailStore.selectedEmail?.recipient"
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
                    </v-select> -->
            </v-col>

            <v-col
                cols="3"
                class="d-flex justify-between align-center"
                style="height: 80px"
            >
                <v-btn variant="outlined" class="mr-2" @click="toggleCcField"
                    >CC</v-btn
                >
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
            <p>{{ emailStore.selectedEmail?.content }}</p>
        </v-card-text>
    </v-card>

    <v-expand-transition>
        <v-card v-if="replyMode" flat class="mt-3" elevation="2">
            <v-card-title>Reply</v-card-title>
            <v-divider inset />
            <v-card-text>
                <TipTap />
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary" @click="sendReply">Send Reply</v-btn>
                <v-btn variant="text" @click="toggleReplyMode">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-expand-transition>
</template>

<style lang="css" scoped></style>
