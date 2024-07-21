<template>
    <q-page class="flex flex-center">
      <q-card class="q-mb-md" v-bind:style="$q.screen.lt.sm ? { width: '90%' } : { width: '40%' }">
        <q-card-section class="text-center">
          <q-avatar size="100px" class="q-mb-md">
            <img src="src/assets/action.jpg" style="object-fit: cover; width: 100%; height: 100%;" />
          </q-avatar>
          <div class="text-h6">Welcome, {{ username }}</div>
        </q-card-section>
        <q-card-section>
          <q-btn @click="goToEditProfile" label="MODIFICA PROFILO" color="primary" class="full-width q-mb-sm" />
          <q-btn @click="goToHelp" label="ASSISTENZA (WEBEX)" color="primary" class="full-width q-mb-sm" />
          <q-btn @click="logout" label="LOGOUT" color="negative" class="full-width" />
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'UserProfile',
    setup() {
      const router = useRouter();
      const username = localStorage.getItem('username') || 'User';
  
      const goToEditProfile = () => {
        router.push({ name: 'ModificaProfilo' }); // Modifica con il nome della tua pagina per modificare il profilo
      };
  
      const goToHelp = () => {
        router.push({ name: 'Assistenza' }); // Modifica con il nome della tua pagina di assistenza
      };
  
      const logout = () => {
        localStorage.removeItem('username');
        router.push({ name: 'LoginUtente' }); // Modifica con il nome della tua pagina di login
      };
  
      return {
        username,
        goToEditProfile,
        goToHelp,
        logout,
      };
    },
  });
  </script>
  
  <style scoped>
  .q-card {
    max-width: 400px;
  }
  
  .q-card-section {
    padding: 20px;
  }
  
  .full-width {
    width: 100%;
  }
  
  .q-mb-sm {
    margin-bottom: 10px;
  }
  
  .q-mb-md {
    margin-bottom: 20px;
  }
  </style>
  