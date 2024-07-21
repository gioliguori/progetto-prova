<template>
    <q-page class="flex flex-center q-pa-md bg-grey-1">
      <q-card class="q-pa-md" style="width: 600px; max-width: 100%">
        <q-card-section>
          <div class="text-h6 text-center">Assistenza Clienti</div>
        </q-card-section>
        <q-card-section>
          <p class="text-center">
            Benvenuto nella pagina di Assistenza Clienti. Qui puoi trovare le informazioni di contatto per ricevere supporto.
          </p>
          <p class="text-center">
            Per qualsiasi richiesta, non esitare a contattarci via email a <a href="mailto:support@example.com">support@example.com</a> o chiamare il numero <strong>123-456-7890</strong>.
          </p>
          <p class="text-center">
            In alternativa, puoi utilizzare il modulo sottostante per inviarci una richiesta. (Modulo in fase di sviluppo)
          </p>
        </q-card-section>
        <q-card-section>
          <!-- Placeholder per un futuro modulo di assistenza -->
          <div class="text-center">
            <q-btn label="Contattaci" color="primary" @click="showContactForm" />
          </div>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'AssistenzaClienti',
    methods: {
      showContactForm() {
        alert('Modulo di contatto in fase di sviluppo.');
      },
    },
  });
  </script>
  
  <style scoped>
  /* Aggiungi eventuali stili personalizzati se necessario */
  </style>
  