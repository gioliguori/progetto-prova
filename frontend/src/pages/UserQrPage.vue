<template>
  <q-page
    class="flex flex-center q-pa-md"
    :class="{ 'dark-mode': $q.dark.isActive }"
  >
    <div class="container text-center">
      <!-- Titolo della pagina -->
      <h2 class="q-mb-md">Scansione QR</h2>

      <div>
        <p class="error">{{ error }}</p>

        <!-- Componente per la scansione del QR code -->
        <qrcode-stream
          :constraints="selectedConstraints"
          :track="trackFunctionSelected.value"
          :formats="selectedBarcodeFormats"
          @error="onError"
          @detect="onDetect"
          @camera-on="onCameraReady"
        />
      </div>

      <!-- Visualizzazione degli ID delle bici -->
      <div v-if="bikeId || bikeIdScanned">
        <p>ID della bici da local storage: {{ bikeId }}</p>
        <p>ID della bici scansionata: {{ bikeIdScanned }}</p>
      </div>

      <!-- Messaggio di errore -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { QrcodeStream } from "vue-qrcode-reader";
import { QBtn, Notify } from "quasar";
import jsQR from "jsqr";
import axios from "axios";
import apiUrl from "src/api-config";

export default defineComponent({
  name: "UserQrPage",
  components: {
    QrcodeStream,
    QBtn,
  },
  setup() {
    const router = useRouter();
    const bikeId = ref("");
    const bikeIdScanned = ref("");
    const reservationId = ref("");
    const username = localStorage.getItem("username");
    const errorMessage = ref("");

    const result = ref("");

    const selectedConstraints = ref({ facingMode: "environment" });
    const defaultConstraintOptions = [
      { label: "rear camera", constraints: { facingMode: "environment" } },
    ];
    const constraintOptions = ref(defaultConstraintOptions);

    const trackFunctionOptions = [
      { text: "nothing (default)", value: undefined },
      { text: "outline", value: paintOutline },
    ];
    const trackFunctionSelected = ref(trackFunctionOptions[1]);

    const barcodeFormats = ref({
      qr_code: true,
    });
    const selectedBarcodeFormats = computed(() => {
      return Object.keys(barcodeFormats.value).filter(
        (format) => barcodeFormats.value[format]
      );
    });

    onMounted(() => {
      console.log("SCANSIONE AVVIATA");

      bikeId.value = localStorage.getItem("bikeId") || "";
      reservationId.value = localStorage.getItem("reservationId") || "";

      if (bikeId.value) {
        console.log(`ID della bici da local storage: ${bikeId.value}`);
      } else {
        console.log("ID della bici non trovato nel local storage.");
      }

      if (reservationId.value) {
        console.log(`ID della prenotazione: ${reservationId.value}`);
      } else {
        console.log("ID della prenotazione non trovato.");
      }
    });

    async function onCameraReady() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(({ kind }) => kind === "videoinput");

      constraintOptions.value = [
        ...defaultConstraintOptions,
        ...videoDevices.map(({ deviceId, label }) => ({
          label: `${label} (ID: ${deviceId})`,
          constraints: { deviceId },
        })),
      ];

      error.value = "";
    }

    function onDetect(detectedCodes) {
      if (detectedCodes.length === 0) return; // Non fare nulla se non ci sono codici rilevati

      // Ottieni il valore del primo codice rilevato
      const firstDetectedCode = detectedCodes[0].rawValue;

      // Pulisci il valore (rimuovi virgolette e parentesi quadre se necessario)
      bikeIdScanned.value = firstDetectedCode;

      console.log(
        "QR RILEVATO, L'ID DELLA BICI SCANSIONATA E':",
        bikeIdScanned.value
      );

      // Controlla se bikeIdScanned coincide con bikeId
      if (bikeIdScanned.value === bikeId.value) {
        // Se coincidono, avvia il noleggio
        startRental();
      } else {
        // Altrimenti, notifica un errore
        errorMessage.value =
          "L'ID della bici scansionata non corrisponde all'ID della bici memorizzato.";
      }
    }

    const onError = (error) => {
      console.error("Errore nella scansione QR:", error);
      const errorMessages = {
        NotAllowedError: "you need to grant camera access permission",
        NotFoundError: "no camera on this device",
        NotSupportedError: "secure context required (HTTPS, localhost)",
        NotReadableError: "is the camera already in use?",
        OverconstrainedError: "installed cameras are not suitable",
        StreamApiNotSupportedError:
          "Stream API is not supported in this browser",
        InsecureContextError:
          "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.",
      };

      errorMessage.value = errorMessages[error.name] || error.message;
    };

    const startRental = async () => {
      try {
        const response = await axios.post(`${apiUrl}/rental/create-rental`, {
          username,
          bikeId: bikeIdScanned.value,
          reservationId: reservationId.value,
        });

        if (response.data.success) {
          console.log(
            `Noleggio attivato per la bici con ID: ${bikeIdScanned.value}`
          );

          // Display success notification
          Notify.create({
            type: "positive",
            message: "Noleggio attivato con successo!",
            timeout: 2000,
            position: "bottom", // Modifica la posizione della notifica
          });

          setTimeout(() => {
            router.push("/UserRentals");
          }, 2000);
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
            bikeIdScanned.value = code.data;
            console.log(
              "QR RILEVATO, L'ID DELLA BICI SCANSIONATA E':",
              code.data
            );
          } else {
            console.error("Impossibile decodificare il QR code.");
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    function paintOutline(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
      }
    }

    return {
      bikeId,
      bikeIdScanned,
      reservationId,
      errorMessage,
      result,
      selectedConstraints,
      constraintOptions,
      trackFunctionOptions,
      trackFunctionSelected,
      barcodeFormats,
      selectedBarcodeFormats,
      onDetect,
      onError,
      startRental,
      onFileChange,
      onCameraReady,
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

.error {
  font-weight: bold;
  color: red;
}

.barcode-format-checkbox {
  margin-right: 10px;
  white-space: nowrap;
  display: inline-block;
}
</style>
