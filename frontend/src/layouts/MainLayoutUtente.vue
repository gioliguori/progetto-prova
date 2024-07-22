<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="goToHome"
          icon="arrow_back"
          aria-label="Back"
        />
        <q-toolbar-title class="title-font">
          Schiano.GO
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <!-- Nuovo Footer Menu -->
    <q-footer class="footer-menu" elevated>
      <div class="footer-btn">
        <q-btn flat round color="primary" @click="navigateTo('Movimenti')">
          <q-icon name="credit_card" />
        </q-btn>
        <div class="footer-label">Noleggi</div>
      </div>
      <div class="footer-btn">
        <q-btn flat round color="primary" @click="navigateTo('HOME_UTENTE')">
          <q-icon name="map" />
        </q-btn>
        <div class="footer-label">Mappa</div>
      </div>
      <div class="footer-btn">
        <q-btn flat round color="primary" @click="navigateTo('ProfiloUtente')">
          <q-icon name="person" />
        </q-btn>
        <div class="footer-label">Profilo</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push('/HOME_UTENTE');
    };

    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    return {
      goToHome,
      navigateTo,
    };
  },
});
</script>

<style scoped>
.footer-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff; /* Cambiato a bianco */
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
}

.footer-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333; /* Colore del testo per contrastare con lo sfondo bianco */
}

.footer-label {
  font-size: 12px;
  margin-top: 4px;
}

.q-icon {
  color: #333; /* Colore delle icone per contrastare con lo sfondo bianco */
}
</style>
