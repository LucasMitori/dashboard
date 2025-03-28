<script setup lang="ts">
import TipTap from '../Tiptap/TipTap.vue';

const props = defineProps({
  activeView: {
    type: String,
    default: '',
    required: true
  },
  currentView: {
    type: String,
    default: '',
    required: true
  },
});

const emailStore = useEmailStore();
const api = useApi();
const replyMode = ref(false);
const ForwardMode = ref(false);
const replyContent = ref('');
const forwardContent = ref('');
const ccFieldVisible = ref(false);
const bccFieldVisible = ref(false);
const ccRecipient = ref<string[]>([]);
const bccRecipient = ref<string[]>([]);
const dialogVisible = ref(false);

const selectedEmail = ref<Email | null>(null);
const emailRecipient = ref<string[]>([]);

const selectedItem = computed(() => emailStore.selectedEmail(props.activeView));

const subject = computed({
  get: () => {
    if (replyMode.value) {
      return '';
    } else if (ForwardMode.value) {
      return `Fwd: ${selectedItem.value?.subject || ''}`;
    } else {
      return selectedItem.value?.subject || '';
    }
  },
  set: (newValue: string) => {
    if (selectedItem.value) {
      selectedItem.value.subject = newValue;
    }
  },
});

const recipientSuggestions = ref(
  emailStore.receivedEmails.map((email) => ({
    label: `${email.sender} (${email.department})`,
    value: email.email,
  }))
);

const emails = computed(() => {
  return props.activeView === 'sent' ? emailStore.sentEmails : emailStore.receivedEmails;
});

const validateEmail = (value: string | { label: string; value: string }) => {
  const email = typeof value === 'string' ? value : value?.value;
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || 'Invalid email address';
};

const handleNewRecipient = (newValue: string) => {
  if (validateEmail(newValue) === true) {
    emailRecipient.value.push(newValue);
  } else {
    alert('Please enter a valid email address.');
  }
};

const handleModelUpdate = (updatedValue: string[]) => {
  console.log('Selected Recipients:', updatedValue);
};

const toggleReplyMode = () => {
  replyMode.value = !replyMode.value;
  if (replyMode.value) {
    ForwardMode.value = false;
    replyContent.value = '';
  } else {
    replyContent.value = '';
  }
};

const toggleForwardMode = () => {
  ForwardMode.value = !ForwardMode.value;
  if (ForwardMode.value) {
    replyMode.value = false;
    forwardContent.value = `\n\n--- Forwarded Message ---\n${selectedItem.value?.content || ''}`; // Pre-fill with forwarded content
  } else {
    forwardContent.value = '';
  }
};

const showEmailDetails = (email: any) => {
  selectedEmail.value = email;
  dialogVisible.value = true;
};

const toggleCcField = () => {
  if (ccFieldVisible.value) {
    ccRecipient.value = [];
  }
  ccFieldVisible.value = !ccFieldVisible.value;
};

const toggleBccField = () => {
  if (bccFieldVisible.value) {
    bccRecipient.value = [];
  }
  bccFieldVisible.value = !bccFieldVisible.value;
};

const sendReply = () => {
  if (replyContent.value.trim()) {
    const messageData = prepareMessageData();
    console.log("Reply Data: ", messageData);

    api.post('/send-reply', messageData)
      .then(response => {
        alert('Reply sent!');
        replyMode.value = false;
        replyContent.value = '';
      })
      .catch(error => {
        console.error('Error sending reply:', error);
      });
  }
};

const sendForward = () => {
  const messageData = prepareMessageData();
  console.log("Forward Data: ", messageData);

  api.post('/send-forward', messageData)
    .then(response => {
      alert('Forwarded successfully!');
      ForwardMode.value = false;
      forwardContent.value = '';
    })
    .catch(error => {
      console.error('Error sending forward:', error);
    });
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

function getDotColor(action: string) {
  switch (action) {
    case 'received':
      return 'blue';
    case 'read':
      return 'green';
    case 'replied':
      return 'orange';
    case 'sent':
      return 'red';
    default:
      return 'grey';
  }
}

const summaryCards = computed(() => [
  {
    title: 'Total Emails',
    icon: 'mdi-email-outline',
    color: 'primary',
    value: emails.value.length,
  },
  {
    title: 'Unread Emails',
    icon: 'mdi-email-alert-outline',
    color: 'error',
    value: emails.value.filter(email => !email.isRead).length,
  },
  {
    title: 'Pinned Emails',
    icon: 'mdi-pin-outline',
    color: 'warning',
    value: emails.value.filter(email => email.isPinned).length,
  },
  {
    title: 'Today’s Emails',
    icon: 'mdi-calendar-today',
    color: 'info',
    value: emails.value.filter(email => email.span === 'today').length,
  }
]);

const readPercentage = computed(() =>
  Math.round(
    (emails.value.filter(email => email.isRead).length / emails.value.length) * 100
  )
);

const recentActivities = computed(() =>
  emails.value
    .flatMap(email => email.history)
    .slice(-5)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
);

const formatEmailDate = (date: string) => new Date(date).toLocaleString();

function getIcon(action: string) {
    switch (action) {
        case 'sent': return 'mdi-email-fast';
        case 'received': return 'mdi-email';
        case 'read': return 'mdi-email-open-outline';
        case 'replied': return 'mdi-reply-outline';
        default: return 'mdi-email-outline';
    }
}

const refreshData = () => {
//   emailStore.fetchEmails();
};

function isUserAction(action: string) {
  return action === 'sent' || action === 'replied';
}

const toolbarColors: Record<string, string> = {
  inbox: '#1E88E5',
  sent: '#43A047',
  draft: '#FFB300',
  garbage: '#E53935',
};

const getToolbarColor = computed(() => {
  return toolbarColors[props.activeView] || '#9E9E9E';
});

watchEffect(() => {
    // console.log("emailStore.selectedEmail", emailStore.selectedEmail);
    // console.log("emails", emails.value); 
});

const prepareMessageData = () => {
  return {
    subject: selectedItem.value?.subject || 'No Subject', 
    recipients: emailRecipient.value || [],
    cc: ccRecipient.value || [],
    bcc: bccRecipient.value || [], 
    content: replyMode.value ? replyContent.value : forwardContent.value,
    isReply: replyMode.value,
    isForward: ForwardMode.value,
  };
};

</script>

<template>
    <template v-if="currentView === 'selected-email'">
      <v-col cols="8" style="padding: 0px 0px 0px 10px">
        <template v-if="emails?.length">
          <v-toolbar
            density="compact"
            class="mb-5"
            rounded="lg"
            :color="getToolbarColor"
            style="border-radius: 15px;"
          >
            <v-toolbar-title>
                Subject: {{ selectedItem?.subject || 'No Subject' }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
  
          <v-card elevation="3" rounded="xl" class="px-3">
            <v-row align="center" class="pa-4">
              <div class="px-4">
                <div class="text-h6">
                  From: {{ selectedItem?.sender || 'Unknown' }}
                </div>
                <div class="text-body-2 text-secondary">
                  {{ selectedItem?.email || 'No Email' }}
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-btn size="small" variant="text" icon class="me-2" @click="toggleReplyMode">
                <v-icon>mdi-reply</v-icon>
              </v-btn>
              <v-btn size="small" variant="text" icon class="me-2" @click="toggleForwardMode">
                <v-icon>mdi-forward</v-icon>
              </v-btn>
              <v-btn size="small" variant="text" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
  
            <v-divider />

            <v-row align="center" class="mt-2">
              <v-col cols="9">
                <v-combobox
                  v-model="emailRecipient"
                  :items="recipientSuggestions"
                  item-title="label"
                  item-value="value"
                  label="To:"
                  variant="solo-filled"
                  clearable
                  class="ma-0"
                  :rules="[validateEmail]"
                  chips
                  multiple
                  @update:model-value="handleModelUpdate"
                  @new-value="handleNewRecipient"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip small>{{ item }}</v-chip>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="3" class="d-flex justify-between align-center">
                <v-btn variant="outlined" class="me-2" @click="toggleCcField">CC</v-btn>
                <v-btn variant="outlined" @click="toggleBccField">BCC</v-btn>
              </v-col>
            </v-row>
  
            <v-expand-transition>
              <template v-if="ccFieldVisible">
                <v-combobox
                  v-model="ccRecipient"
                  :items="recipientSuggestions"
                  item-title="label"
                  item-value="value"
                  label="CC"
                  variant="solo-filled"
                  clearable
                  class="ma-0"
                  :rules="[validateEmail]"
                  chips
                  multiple
                  @update:model-value="handleModelUpdate"
                  @new-value="handleNewRecipient"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip small>{{ item }}</v-chip>
                  </template>
                </v-combobox>
              </template>
            </v-expand-transition>
  
            <v-expand-transition>
              <template v-if="bccFieldVisible">
                <v-combobox
                  v-model="bccRecipient"
                  :items="recipientSuggestions"
                  item-title="label"
                  item-value="value"
                  label="BCC"
                  variant="solo-filled"
                  clearable
                  class="ma-0"
                  :rules="[validateEmail]"
                  chips
                  multiple
                  @update:model-value="handleModelUpdate"
                  @new-value="handleNewRecipient"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip small>{{ item }}</v-chip>
                  </template>
                </v-combobox>
              </template>
            </v-expand-transition>
  
            <v-divider class="my-3" />
  
            <v-card-text>
              <v-sheet elevation="1" rounded="lg" class="pa-4" color="#e2f1f4">
                <div class="text-h6 mb-3">Email Content</div>
                <v-divider inset />
                <div class="text-body-1 mt-5">{{ selectedItem?.content }}</div>
              </v-sheet>
            </v-card-text>
          </v-card>
  
          <v-expand-transition>
            <v-card
              v-if="replyMode || ForwardMode"
              rounded="lg"
              class="mt-3 px-3"
              elevation="2"
              :title="replyMode ? 'Reply' : 'Forward'"
              prepend-icon="mdi-email-edit-outline"
            >
              <v-divider inset />
              <v-card-text>
                <v-text-field
                    v-model="subject"
                    label="Subject"
                    variant="outlined"
                    dense
                    :disabled="!selectedItem" 
                />
                <TipTap
                  :content="selectedItem?.content"
                  :replyMode="replyMode"
                  :ForwardMode="ForwardMode"
                />
              </v-card-text>
  
              <v-card-actions>
                <v-btn color="primary" @click="replyMode ? sendReply() : sendForward()">
                  {{ replyMode ? 'Send Reply' : 'Send Forward' }}
                </v-btn>
                <v-btn variant="text" @click="replyMode ? toggleReplyMode() : toggleForwardMode()">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
  
          <v-card class="my-3 pa-2" rounded="shaped" elevation="3">
            <v-card-title>History</v-card-title>
            <v-card-subtitle>Email history</v-card-subtitle>
            <v-card-text>
              <v-timeline align="start">
                <v-timeline-item
                  v-for="history in selectedItem?.history"
                  :key="history.id"
                  :dot-color="getDotColor(history.action)"
                  size="small"
                  :right="isUserAction(history.action)"
                  :left="!isUserAction(history.action)"
                >
                  <template v-slot:opposite>
                    <div v-if="isUserAction(history.action)" class="pt-1 headline font-weight-bold">
                      {{ formatDate(history.date) }}
                    </div>
                  </template>
                  <template v-slot:default>
                    <div v-if="!isUserAction(history.action)" class="pt-1 headline font-weight-bold">
                      {{ formatDate(history.date) }}
                    </div>
                    <v-card
                      rounded="lg"
                      elevation="10"
                      class="pa-3"
                      :color="isUserAction(history.action) ? '#126C91' : 'primary'"
                    >
                      <v-card-title>
                        <v-icon left class="mr-2" :color="getDotColor(history.action)">
                          {{ getIcon(history.action) }}
                        </v-icon>
                        {{ history.action }}
                      </v-card-title>
                      <v-card-subtitle>{{ history.description }}</v-card-subtitle>
                      <v-card-text>
                        <span class="truncate">{{ selectedItem?.content }}</span>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn variant="outlined" small @click="showEmailDetails(selectedItem)">
                          View Full Email
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>

          <v-dialog v-model="dialogVisible" persistent max-width="600px">
            <v-card>
              <v-card-title>{{ selectedEmail?.subject }}</v-card-title>
              <v-card-subtitle>
                From: {{ selectedEmail?.sender }} | To: {{ selectedEmail?.recipient }}
              </v-card-subtitle>
              <v-card-text>{{ selectedEmail?.content }}</v-card-text>
              <v-card-actions>
                <v-btn varaint="text" @click="dialogVisible = false">Close</v-btn>

              </v-card-actions>
            </v-card>
        </v-dialog>
        </template>
        <template v-else>
          Select an email to view.
        </template>
      </v-col>
    </template>

    <template v-else-if="currentView === 'email-details'">
        <v-col cols="8" style="padding: 0px 0px 0px 10px">
          <v-card elevation="3" height="100vh"  rounded="lg" class="pa-5">
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-center justify-space-between">
                  <div class="text-h5">Inbox Summary</div>
                  <v-btn icon="mdi-refresh" color="primary" @click="refreshData" />
                </div>
              </v-col>
      
              <v-col cols="3" v-for="(card, index) in summaryCards" :key="index">
                <v-card elevation="2" class="pa-4">
                  <v-icon large :color="card.color" class="mb-2">{{ card.icon }}</v-icon>
                  <div class="text-h6">{{ card.title }}</div>
                  <div class="text-subtitle-1">{{ card.value }}</div>
                </v-card>
              </v-col>
      
              <v-col cols="12" class="mt-5">
                <v-card elevation="2" class="pa-4">
                  <div class="text-h6 mb-3">Email Actions</div>
                  <v-progress-linear
                    :value="readPercentage"
                    color="success"
                    height="10"
                    striped
                    class="mb-3"
                  />
                  <div class="d-flex justify-space-between">
                    <span>Read Emails</span>
                    <span>{{ readPercentage }}%</span>
                  </div>
                </v-card>
              </v-col>
      
              <v-col cols="12" class="mt-5">
                <v-card elevation="2" class="pa-4">
                  <div class="text-h6 mb-3">Recent Activities</div>
                  <v-list>
                    <v-list-item v-for="history in recentActivities" :key="history.id">
                      <v-icon>{{ getIcon(history.action) }}</v-icon>
                      <div class="d-flex flex-column ml-2">
                        <div class="font-weight-bold">{{ history.description }}</div>
                        <small class="text-secondary">{{ formatEmailDate(history.date) }}</small>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
    </template>
      
      
</template>

<style lang="css" scoped>

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; 
    line-clamp: 2; 
    -webkit-box-orient: vertical;
  }

  .timeline-container {
    max-height: 600px;
    overflow-y: auto;
    padding-right: 10px;
  }
  
</style>