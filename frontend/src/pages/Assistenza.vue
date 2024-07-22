<template>
  <div>
    <h1>Webex Chat</h1>
    <div>
      <input v-model="messageInput" placeholder="Scrivi un messaggio" />
      <button @click="sendMessage">Invia</button>
    </div>
    <div v-if="messages.length">
      <h2>Messaggi</h2>
      <ul>
        <li v-for="message in messages" :key="message.id">
          {{ message.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Webex from '@webex/webex-core';

export default {
  data() {
    return {
      webex: null,
      messageInput: '',
      messages: [],
      roomId: null // L'ID della stanza sarà impostato dinamicamente
    };
  },
  async created() {
    await this.initializeWebex();
    await this.createRoom(); // Crea una stanza al caricamento
  },
  methods: {
    async initializeWebex() {
      this.webex = Webex.init({
        credentials: {
          access_token: 'OGFiNzlkOTgtOWQ4ZC00MGMzLTg3ZDgtZGRiNjQ3MTgxMzg3OWZlZmRhYWYtYmQz_P0A1_9db452ae-a8fa-4c45-ad97-a9c6809f2db1'
        }
      });

      try {
        await this.webex.ready();
        console.log('Webex is ready');
        this.listenForMessages();
      } catch (error) {
        console.error('Error initializing Webex:', error);
      }
    },
    async createRoom() {
      try {
        const response = await axios.post('http://localhost:3000/create-room', {
          title: 'Chat con il Bot'
        });
        this.roomId = response.data.roomId;
        console.log('Room created with ID:', this.roomId);
      } catch (error) {
        console.error('Error creating room:', error);
      }
    },
    async sendMessage() {
      if (this.messageInput.trim() === '') return;
      if (!this.roomId) {
        console.error('Room ID is not set');
        return;
      }

      try {
        const message = await this.webex.messages.create({
          roomId: this.roomId,
          text: this.messageInput
        });
        console.log('Message sent:', message);
        this.messageInput = ''; // Clear the input field
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    async listenForMessages() {
      if (!this.roomId) {
        console.error('Room ID is not set');
        return;
      }

      try {
        await this.webex.messages.listen();
        this.webex.messages.on('created', (event) => {
          this.messages.push(event.data);
        });
      } catch (error) {
        console.error('Error listening for messages:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Aggiungi il tuo CSS personalizzato qui */
</style>
