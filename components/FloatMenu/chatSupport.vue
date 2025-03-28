<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true }
});
const emit = defineEmits(['update:modelValue']);
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

const messages = ref([
  { sender: 'agent', content: 'Hello, how can I assist you?', time: '10:00 AM' },
  { sender: 'customer', content: 'I need help with my order.', time: '10:01 AM' }
]);
const newMessage = ref('');

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    messages.value.push({
      sender: 'agent',
      content: newMessage.value,
      time: new Date().toLocaleTimeString()
    });
    newMessage.value = '';
  }
};

const close = () => {
  visible.value = false;
};
</script>

<template>
    <v-dialog v-model="visible" persistent max-width="500">
      <v-card class="chat-support-card" dark>
        <v-card-title class="headline">
          Chat Support
          <v-spacer />
          <v-btn icon color="red" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="chat-body">
          <div class="messages">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="['message', msg.sender]"
            >
              <div class="message-content">
                {{ msg.content }}
              </div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>
          <v-text-field
            v-model="newMessage"
            label="Type your message..."
            outlined
            dense
            @keyup.enter="sendMessage"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="sendMessage">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <style scoped>
  .chat-support-card {
    background-color: #1e1e1e;
    color: white;
  }
  .chat-body {
    max-height: 300px;
    overflow-y: auto;
  }
  .messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
  }
  .message {
    padding: 10px;
    border-radius: 8px;
    max-width: 80%;
  }
  .agent {
    background-color: #ffd700;
    align-self: flex-start;
    color: black;
  }
  .customer {
    background-color: #333;
    align-self: flex-end;
    color: white;
  }
  .message-time {
    font-size: 0.75rem;
    opacity: 0.7;
    text-align: right;
  }
  </style>
  