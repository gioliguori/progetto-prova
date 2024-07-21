<template>
    <q-page class="flex flex-center">
      <q-card class="q-pa-md" style="width: 400px">
        <q-card-section>
          <div class="text-h6 text-center">Modifica Profilo</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="confirmChanges" class="q-gutter-md">
            <q-input
              v-model="username"
              label="Username"
              filled
            />
            <q-input
              v-model="email"
              label="Email"
              type="email"
              filled
            />
            <q-input
              v-model="firstName"
              label="Nome"
              filled
            />
            <q-input
              v-model="lastName"
              label="Cognome"
              filled
            />
            <q-input
              v-model="newPassword"
              type="password"
              label="Nuova Password"
              filled
            />
            <q-input
              v-model="confirmPassword"
              type="password"
              label="Conferma Nuova Password"
              filled
            />
            <q-btn
              label="Conferma"
              type="submit"
              color="primary"
              class="full-width"
              :disabled="!isAnyFieldFilled"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'ModificaProfilo',
    setup() {
      const router = useRouter();
      const username = ref('');
      const email = ref('');
      const firstName = ref('');
      const lastName = ref('');
      const newPassword = ref('');
      const confirmPassword = ref('');
  
      const isAnyFieldFilled = computed(() => {
        return username.value || email.value || firstName.value || lastName.value || newPassword.value || confirmPassword.value;
      });
  
      const confirmChanges = () => {
        // Verifica se almeno uno dei campi è compilato
        if (!isAnyFieldFilled.value) {
          alert('Per favore, compila almeno uno dei campi.');
          return;
        }
  
        // Verifica se la nuova password e la conferma sono identiche
        if (newPassword.value && newPassword.value !== confirmPassword.value) {
          alert('La nuova password e la conferma della password non corrispondono.');
          return;
        }
  
        // Se almeno un campo è compilato e, se le password sono presenti, corrispondono, naviga alla nuova pagina
        router.push('/HOME_UTENTE'); // Cambia '/pagina-successso' con il percorso della tua pagina di successo
      };
  
      return {
        username,
        email,
        firstName,
        lastName,
        newPassword,
        confirmPassword,
        confirmChanges,
        isAnyFieldFilled,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Aggiungi eventuali stili personalizzati se necessario */
  </style>
  