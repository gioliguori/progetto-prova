<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="container text-center">
      <h2 class="q-mb-md">ISTRUZIONI PER IL NOLEGGIO</h2>
      <img :src="imageSrc" alt="Istruzioni Noleggio" class="center-image" />
      <q-input
        v-model="bikeId"
        label="ID della bici"
        readonly
        class="q-mb-md"
      />
      <q-btn @click="handleNoleggia" label="Noleggia" color="primary" class="q-mt-md" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Importa useRouter
import imageSrc from 'src/assets/istruzioni.png'; // Importa l'immagine direttamente

export default defineComponent({
  name: 'RentalInstructions',
  setup() {
    const bikeId = ref('');
    const router = useRouter(); // Ottieni l'oggetto del router

    onMounted(() => {
      bikeId.value = localStorage.getItem('selectedBikeId') || ''; // Recupera l'ID della bici dal localStorage
    });

    const handleNoleggia = () => {
      // Reindirizza alla pagina "scansionaqr" passando l'ID della bici come parametro di query
      router.push({ name: 'QReader', query: { bikeId: bikeId.value } });
    };

    return {
      imageSrc,
      bikeId,
      handleNoleggia
    };
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

.q-input {
  max-width: 300px; /* Imposta una larghezza massima per l'input */
}
</style>
