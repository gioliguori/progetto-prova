<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="container text-center">
      <h2 class="q-mb-md">Scansione QR</h2>
      <qrcode-stream @decode="onDecode" @error="onError" />
      <q-btn @click="startRental" label="Avvia Noleggio" color="primary" class="q-mt-md" />
      <div v-if="decodedId">
        <p>Scansione completata!</p>
        <p>ID della bici: {{ decodedId }}</p>
        <q-btn @click="startRental" label="Avvia Noleggio" color="primary" class="q-mt-md" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { QrcodeStream } from 'vue-qrcode-reader'; // Importa i componenti QR
import { QBtn } from 'quasar'; // Importa il componente del pulsante

export default defineComponent({
  name: 'QReader',
  components: {
    QrcodeStream,
    QBtn
  },
  setup() {
    const router = useRouter();
    const decodedId = ref('');

    onMounted(() => {
      const bikeId = router.currentRoute.value.query.bikeId;
      if (bikeId) {
        console.log("Scansione avviata");
        console.log(`Noleggio attivato per la bici con ID: ${bikeId}`);
      } else {
        console.log("ID della bici non trovato.");
      }
    });

    const onDecode = (result) => {
      decodedId.value = result; // Associa il risultato della scansione al decodedId
      console.log(`ID della bici scansionato: ${result}`);
      // Puoi aggiungere ulteriori logiche qui per gestire l'ID scansionato
    };

    const onError = (error) => {
      console.error("Errore nella scansione QR:", error);
    };

    const startRental = () => {
      console.log("Reindirizzamento alla pagina Movimenti");
      router.push('/movimenti');
    };

    return {
      decodedId,
      onDecode,
      onError,
      startRental
    };
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
  width: 100%;
  padding: 2rem;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
}
</style>
