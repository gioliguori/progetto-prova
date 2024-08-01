<template>
  <q-page class="flex flex-center">
    <div class="chat-container">
      <div class="chat-box">
        <div class="chat-messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
          >
            <strong>{{ message.sender }}:</strong>
            <span v-if="message.isLink"
              ><a :href="message.text" target="_blank">{{
                message.text
              }}</a></span
            >
            <span v-else>{{ message.text }}</span>
          </div>
        </div>
        <div class="chat-input">
          <q-input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Scrivi un messaggio..."
            autofocus
            dense
          />
          <q-btn @click="sendMessage" color="primary" label="Invia" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import apiUrl from "src/api-config";

export default {
  data() {
    return {
      newMessage: "",
      messages: [],
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim()) {
        this.messages.push({
          sender: "Utente",
          text: this.newMessage,
        });

        try {
          const response = await axios.post(
            `${apiUrl}/webex/messages`, // Usa apiUrl qui
            {
              text: this.newMessage,
            }
          );

          this.newMessage = "";

          // Simula una risposta automatica
          const isLink = response.data.text.startsWith(
            "https://web.webex.com/spaces/"
          );
          this.messages.push({
            sender: "Supporto",
            text: response.data.text,
            isLink,
          });
        } catch (error) {
          console.error("Errore nell'invio del messaggio:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.chat-container {
  width: 400px;
  max-width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;
}

.chat-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 8px;
  border-top: 1px solid #ccc;
  background: #fff;
}

.message {
  margin-bottom: 8px;
}

.message a {
  color: #007bff;
  text-decoration: none;
}

.message a:hover {
  text-decoration: underline;
}
</style>
