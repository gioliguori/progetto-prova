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
      <q-input
        v-model="reservationId"
        label="ID della prenotazione"
        readonly
        class="q-mb-md"
      />
      <q-btn @click="handleNoleggia" label="Noleggia" color="primary" class="q-mt-md" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // Importa useRouter e useRoute
import imageSrc from 'src/assets/istruzioni.png'; // Importa l'immagine direttamente

export default defineComponent({
  name: 'RentalInstructions',
  setup() {
    const bikeId = ref('');
    const reservationId = ref('');
    const router = useRouter(); // Ottieni l'oggetto del router
    const route = useRoute(); // Ottieni l'oggetto del route

    onMounted(() => {
      // Recupera l'ID della bici e l'ID della prenotazione dalla query string
      bikeId.value = route.query.bikeId || '';
      reservationId.value = route.query.reservationId || '';

      if (reservationId.value) {
        console.log(`Salvo l'ID della prenotazione nel local storage: ${reservationId.value}`);
        localStorage.setItem('reservationId', reservationId.value);
      }
    });

    const handleNoleggia = () => {
      // Reindirizza alla pagina "QReader" passando l'ID della bici e l'ID della prenotazione come parametri di query
      router.push({ name: 'QReader', query: { bikeId: bikeId.value, reservationId: reservationId.value } });
    };

    // Watch for route changes to remove reservationId from local storage if navigating away from this component
    watch(() => route.name, (newRouteName) => {
      if (newRouteName !== 'QReader') {
        console.log('Navigazione verso una pagina diversa da QReader, rimuovo l\'ID della prenotazione dal local storage');
        localStorage.removeItem('reservationId');
      } else {
        console.log('Navigazione verso QReader, mantengo l\'ID della prenotazione nel local storage');
      }
    });

    return {
      imageSrc,
      bikeId,
      reservationId,
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
