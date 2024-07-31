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
      <q-btn
        @click="handleNoleggia"
        label="Noleggia"
        color="primary"
        class="q-mt-md"
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
      bikeId.value = localStorage.getItem("bikeId") || "";
      reservationId.value = localStorage.getItem("reservationId") || "";

      if (!bikeId.value || !reservationId.value) {
        console.error(
          "ID della bici o ID della prenotazione non trovati nel local storage"
        );
      }
    });

    const handleNoleggia = () => {
      router.push({ name: "QReader" });
    };

    watch(
      () => route.name,
      (newRouteName) => {
        if (newRouteName !== "QReader") {
          console.log(
            "Navigazione verso una pagina diversa da QReader, rimuovo l'ID della prenotazione e l'ID della bici dal local storage"
          );
          localStorage.removeItem("reservationId");
          localStorage.removeItem("bikeId");
        } else {
          console.log(
            "Navigazione verso QReader, mantengo l'ID della prenotazione e l'ID della bici nel local storage"
          );
        }
      }
    );

    window.addEventListener("beforeunload", () => {
      console.log(
        "Pagina ricaricata o navigazione manuale, rimuovo l'ID della prenotazione e l'ID della bici dal local storage"
      );
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
.container {
  max-width: 800px;
  width: 100%;
  padding: 2rem;
}

.center-image {
  max-width: 100%;
  height: auto;
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

.q-input {
  max-width: 300px;
}
</style>
