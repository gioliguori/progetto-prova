<template>
    <q-btn
      :icon="isDarkMode ? 'brightness_7' : 'brightness_4'"
      @click="toggleDarkMode"
      flat
      round
    />
  </template>
  
  <script>
  export default {
    data() {
      return {
        isDarkMode: JSON.parse(localStorage.getItem('darkMode')) || this.$q.dark.isActive
      };
    },
    methods: {
      toggleDarkMode() {
        this.$q.dark.toggle();
        this.isDarkMode = this.$q.dark.isActive;
        localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
      }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  