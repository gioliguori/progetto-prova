<template>
    <q-page class="flex flex-center q-pa-md">
      <div class="container text-center">
        <h2 class="q-mb-md">ISTRUZIONI PER IL NOLEGGIO</h2>
        <img :src="imageSrc" alt="Istruzioni Noleggio" class="center-image" />
        <q-btn @click="handleNoleggia" label="Noleggia" color="primary" class="q-mt-md" />
      </div>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import imageSrc from 'src/assets/istruzioni.png'; // Importa l'immagine direttamente
  
  export default defineComponent({
    name: 'RentalInstructions',
    data() {
      return {
        imageSrc // Utilizza l'immagine importata
      };
    },
    methods: {
      handleNoleggia() {
        // Reindirizza alla pagina "scansionaqr"
        this.$router.push({ name: 'QReader' });
      }
    }
  });
  </script>
  
  
  <style scoped>
  .container {
    max-width: 800px; /* Imposta una larghezza massima per il contenitore centrale */
    width: 100%; /* Assicura che il contenitore occupi tutta la larghezza possibile fino al max-width */
    padding: 2rem; /* Aggiungi padding per dare spazio interno al contenitore */
  }
  
  .center-image {
    max-width: 100%;
    height: auto;
  }
  
  h2 {
    font-size: 2rem; /* Ingrandisce la dimensione del font del titolo */
    font-weight: bold; /* Metti il titolo in grassetto */
  }
  
  .q-mb-md {
    margin-bottom: 1rem; /* Spaziatura inferiore per l'immagine e il titolo */
  }
  
  .q-mt-md {
    margin-top: 1rem; /* Spaziatura superiore per il pulsante */
  }
  </style>
  