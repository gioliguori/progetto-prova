
<template>
  <q-page
    class="flex flex-center q-pa-md"
    :class="{ 'dark-mode': $q.dark.isActive }"
  >
    <div class="container text-center">
      <h2 class="q-mb-md">Scansione QR</h2>
      <qrcode-stream @decode="onDecode" @error="onError" />
      <input type="file" @change="onFileChange" accept="image/*" class="q-mt-md" />
      <div v-if="bikeId">
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
import jsQR from "jsqr"; // Importa jsQR per decodificare i QR code dalle immagini
import axios from "axios"; // Importa axios per le chiamate API
import apiUrl from "src/api-config"; // Importa apiUrl

export default defineComponent({
  name: "UserQrPage",
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
      console.log("SCANSIONE AVVIATA");

      bikeId.value = localStorage.getItem("bikeId") || "";
      reservationId.value = localStorage.getItem("reservationId") || "";

      if (bikeId.value) {
        console.log(`ID della bici': ${bikeId.value}`);
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
      bikeId.value = result;
      console.log("QR RILEVATO, L'ID DELLA BICI E':", result);
      console.log("AAAAAAAAAAAAA");
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
          console.log(`Noleggio attivato per la bici con ID: ${bikeId.value}`);
          router.push("/UserRentals");
        } else {
          console.error(
            "Errore nell'avvio del noleggio:",
            response.data.message
          );
          errorMessage.value = response.data.message;
          setTimeout(() => {
            router.push("/UserRentals");
          }, 3000);
        }
      } catch (error) {
        console.error(
          "Errore nella chiamata API per avviare il noleggio:",
          error
        );
        errorMessage.value =
          "Errore durante l'avvio del noleggio. Esiste già un noleggio attivo!";
        setTimeout(() => {
          router.push("/UserRentals");
        }, 3000);
      }
    };

    const onFileChange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            console.log("QR RILEVATO, L'ID DELLA BICI E':", code.data);
            console.log("AAAAAAAAAAAAA");
          } else {
            console.error("Impossibile decodificare il QR code.");
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    return {
      bikeId,
      reservationId,
      errorMessage,
      onDecode,
      onError,
      startRental,
      onFileChange,
    };
  },
});
</script>

<style scoped>
/* Modalità scura */
.dark-mode {
  background-color: #000; /* Sfondo nero per la modalità scura */
  color: #e0e0e0; /* Colore del testo per la modalità scura */
}

.container {
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  background-color: #fff; /* Sfondo bianco per la modalità chiara */
  color: #000; /* Colore del testo per la modalità chiara */
}

.dark-mode .container {
  background-color: #000; /* Sfondo nero per la modalità scura */
  color: #e0e0e0; /* Colore del testo per la modalità scura */
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #000; /* Colore del titolo per la modalità chiara */
}

.dark-mode h2 {
  color: #1b89ff; /* Colore del titolo per la modalità scura */
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
