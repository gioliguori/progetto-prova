<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 800px">
      <q-card-section class="text-center">
        <div class="text-h5">Admin Dashboard</div>
      </q-card-section>
      <q-card-section>
        <div>Welcome, {{ username }}!</div>
        <div class="q-gutter-md q-mt-md text-center">
          <q-btn
            class="q-mb-md"
            color="primary"
            label="Lista Partner"
            @click="goToPage('TreeTable_LISTAPARTNER')"
          />
          <q-btn
            class="q-mb-md"
            color="primary"
            label="Inserisci Partner"
            @click="goToPage('TreeTable_INSERISCIPARTNER')"
          />
          <q-btn
            class="q-mb-md"
            color="primary"
            label="Lista Bici"
            @click="goToPage('TreeTable_LISTABICI')"
          />
          <q-btn
            class="q-mb-md"
            color="primary"
            label="Posizioni Bici"
            @click="goToPage('PosizioneBici')"
          />
          <q-btn
            class="q-mb-md"
            color="primary"
            label="Webex"
            @click="goToPage('Webex')"
          />
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn
          @click="logout"
          color="negative"
          label="Logout"
          class="q-mx-auto"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { QSpinnerGears, Loading } from "quasar";

export default {
  name: "DashboardAdmin",
  data() {
    return {
      username: localStorage.getItem("username") || "Admin",
      clickedButton: null,
    };
  },
  methods: {
    goToPage(pageName) {
      this.clickedButton = pageName;
      setTimeout(() => {
        this.$router.push({ name: pageName });
      }, 200);
    },
    logout() {
      localStorage.removeItem("username");
      this.$router.push({ name: "LoginAdmin" });
    },
  },
};
</script>

<style>
/* Add any additional styling if needed */
</style>
