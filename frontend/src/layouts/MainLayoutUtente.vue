<template>
  <q-layout view="lHh lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- Bottone Freccia -->
        <q-btn
          flat
          dense
          round
          @click="goToHomeUser"
          icon="arrow_back"
          aria-label="Back to Home"
        />
        <q-toolbar-title class="title-font"> Schiano.GO </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <!-- Nuovo Footer Menu -->
    <q-footer class="footer-menu" elevated>
      <q-btn flat round color="primary" @click="navigateTo('page1')">
        <q-icon name="star" />
      </q-btn>
      <q-btn flat round color="primary" @click="navigateTo('page2')">
        <q-icon name="location_on" />
        <!-- Mappa o indicatore di posizione -->
      </q-btn>
      <q-btn flat round color="primary" @click="navigateTo('page3')">
        <q-icon name="account_circle" />
        <!-- Profilo utente -->
      </q-btn>
    </q-footer>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import Messages from "./Messages.vue";

import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    Messages,
  },

  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const goToHomeUser = () => {
      router.push("/HOME_UTENTE");
    };

    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    return {
      $q,
      goToHomeUser,
      navigateTo,
    };
  },
});
</script>

<style scoped>
/* Stile per il menu in basso */
.footer-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff; /* Colore di sfondo bianco */
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
}

.footer-menu q-btn {
  color: #333; /* Colore del testo (icone) scuro per contrastare con lo sfondo bianco */
}

.footer-menu q-icon {
  font-size: 24px; /* Dimensione dell'icona */
}
</style>
