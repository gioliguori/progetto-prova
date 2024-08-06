Ecco il codice con i commenti aggiunti alle parti più importanti: ```html
<template>
  <q-page
    class="flex flex-center q-pa-md"
    :class="{ 'dark-mode': $q.dark.isActive }"
  >
    <div class="container text-center">
      <h2 class="responsive-title q-mb-md">ISTRUZIONI PER IL NOLEGGIO</h2>
      <!-- Immagine delle istruzioni per il noleggio -->
      <img :src="imageSrc" alt="Istruzioni Noleggio" class="responsive-image" />
      <!-- Input per l'ID della bici, solo lettura -->
      <q-input
        v-model="bikeId"
        label="ID della bici"
        readonly
        class="responsive-input q-mb-md"
      />
      <!-- Input per l'ID della prenotazione, solo lettura -->
      <q-input
        v-model="reservationId"
        label="ID della prenotazione"
        readonly
        class="responsive-input q-mb-md"
      />
      <!-- Bottone per iniziare il noleggio -->
      <q-btn
        @click="handleNoleggia"
        label="Noleggia"
        color="primary"
        class="responsive-btn q-mt-md"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import imageSrc from "src/assets/istruzioni.png";

export default defineComponent({
  name: "RentalInstructions",
  setup() {
    const bikeId = ref("");
    const reservationId = ref("");
    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
      // Recupera gli ID dal local storage quando il componente viene montato
      bikeId.value = localStorage.getItem("bikeId") || "";
      reservationId.value = localStorage.getItem("reservationId") || "";

      if (!bikeId.value || !reservationId.value) {
        console.error(
          "ID della bici o ID della prenotazione non trovati nel local storage"
        );
      }
    });

    const handleNoleggia = () => {
      // Naviga alla pagina UserQrPage
      router.push({ name: "UserQrPage" });
    };

    // Watcher per monitorare i cambiamenti di route
    watch(
      () => route.name,
      (newRouteName) => {
        if (newRouteName !== "UserQrPage") {
          // Rimuove gli ID dal local storage se si naviga lontano da UserQrPage
          localStorage.removeItem("reservationId");
          localStorage.removeItem("bikeId");
        }
      }
    );

    // Rimuove gli ID dal local storage quando la pagina viene ricaricata o si naviga manualmente
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("reservationId");
      localStorage.removeItem("bikeId");
    });

    return {
      imageSrc,
      bikeId,
      reservationId,
      handleNoleggia,
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
  max-width: 90%;
  width: 100%;
  padding: 2rem;
  margin: auto;
  background-color: #fff; /* Sfondo bianco per la modalità chiara */
  color: #000; /* Colore del testo per la modalità chiara */
}

.dark-mode .container {
  background-color: #000; /* Sfondo nero per la modalità scura */
  color: #e0e0e0; /* Colore del testo per la modalità scura */
}

.responsive-title {
  font-size: 2rem;
  font-weight: bold;
  color: #000; /* Colore del titolo per la modalità chiara */
}

.dark-mode .responsive-title {
  color: #1b89ff; /* Colore del titolo per la modalità scura */
}

.responsive-image {
  max-width: 100%;
  height: auto;
  width: 100%;
}

.responsive-input {
  max-width: 100%;
}

.responsive-btn {
  width: 100%;
}

/* Media query per dispositivi più piccoli */
@media (max-width: 600px) {
  .responsive-title {
    font-size: 1.5rem;
  }
}
</style>
```
