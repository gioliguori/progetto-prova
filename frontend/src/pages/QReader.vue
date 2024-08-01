<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="container text-center">
      <h2 class="q-mb-md">Scansione QR</h2>
      <qrcode-stream @decode="onDecode" @error="onError" />
      <div v-if="bikeId">
        <p>Scansione completata!</p>
        <p>ID della bici: {{ bikeId }}</p>
        <q-btn
          @click="startRental"
          label="Avvia Noleggio"
          color="primary"
          class="q-mt-md"
        />
      </div>
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { QrcodeStream } from "vue-qrcode-reader"; // Importa i componenti QR
import { QBtn } from "quasar"; // Importa il componente del pulsante
import axios from "axios"; // Importa axios per le chiamate API
import apiUrl from "src/api-config"; // Importa apiUrl

export default defineComponent({
  name: "QReader",
  components: {
    QrcodeStream,
    QBtn,
  },
  setup() {
    const router = useRouter();
    const bikeId = ref("");
    const reservationId = ref("");
    const username = localStorage.getItem("username");
    const errorMessage = ref("");

    onMounted(() => {
      bikeId.value = localStorage.getItem("bikeId") || "";
      reservationId.value = localStorage.getItem("reservationId") || "";

      if (bikeId.value) {
        console.log(`Noleggio attivato per la bici con ID: ${bikeId.value}`);
      } else {
        console.log("ID della bici non trovato.");
      }

      if (reservationId.value) {
        console.log(`ID della prenotazione: ${reservationId.value}`);
      } else {
        console.log("ID della prenotazione non trovato.");
      }
    });

    const onDecode = (result) => {
      bikeId.value = result; // Associa il risultato della scansione al bikeId
      console.log(`ID della bici scansionato: ${result}`);
      // Puoi aggiungere ulteriori logiche qui per gestire l'ID scansionato
    };

    const onError = (error) => {
      console.error("Errore nella scansione QR:", error);
    };

    const startRental = async () => {
      try {
        const response = await axios.post(`${apiUrl}/rental/create-rental`, {
          username,
          bikeId: bikeId.value,
          reservationId: reservationId.value,
        });

        if (response.data.success) {
          console.log("Noleggio avviato con successo.");
          router.push("/movimenti");
        } else {
          console.error(
            "Errore nell'avvio del noleggio:",
            response.data.message
          );
          errorMessage.value = response.data.message;
          setTimeout(() => {
            router.push("/movimenti");
          }, 3000); // Redirect dopo 3 secondi
        }
      } catch (error) {
        console.error(
          "Errore nella chiamata API per avviare il noleggio:",
          error
        );
        errorMessage.value =
          "Errore durante l'avvio del noleggio. Esiste già un noleggio attivo!";
        setTimeout(() => {
          router.push("/movimenti");
        }, 3000); // Redirect dopo 3 secondi
      }
    };

    return {
      bikeId,
      reservationId,
      errorMessage,
      onDecode,
      onError,
      startRental,
    };
  },
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

.q-mb-md {
  margin-bottom: 1rem;
}

.q-mt-md {
  margin-top: 1rem;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}
</style>
