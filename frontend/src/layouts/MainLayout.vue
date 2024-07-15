<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-custom-blue">
      <q-toolbar>
        <q-img src="~assets/logo.png" alt="Logo" class="logo" />
        <q-toolbar-title> Schiano.GO </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style>
.logo {
  width: 50px; /* Imposta la larghezza del logo */
  height: auto; /* Mantieni le proporzioni */
  margin-left: 10px; /* Spazio tra il logo e il titolo */
}

.bg-custom-blue {
  background-color: #00008b; /* Blu del pulsante Sign in */
}
</style>
