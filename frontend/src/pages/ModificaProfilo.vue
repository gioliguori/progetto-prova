<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Modifica Profilo</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="confirmChanges" class="q-gutter-md">
          <q-input v-model="newUsername" label="Username" filled />
          <q-input v-model="email" label="Email" type="email" filled />
          <q-input v-model="firstName" label="Nome" filled />
          <q-input v-model="lastName" label="Cognome" filled />
          <q-input
            v-model="currentPassword"
            type="password"
            label="Password Corrente"
            filled
            :rules="[(val) => !!val || 'Password corrente è obbligatoria']"
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
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "ModificaProfilo",
  setup() {
    const router = useRouter();
    const oldUsername = ref("");
    const newUsername = ref("");
    const email = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const currentPassword = ref("");

    const isAnyFieldFilled = computed(() => {
      return (
        newUsername.value || email.value || firstName.value || lastName.value
      );
    });

    onMounted(() => {
      oldUsername.value = localStorage.getItem("username"); // Recupera il vecchio username da localStorage
      console.log(
        "Old Username recuperato da localStorage:",
        oldUsername.value
      );
    });

    const confirmChanges = async () => {
      if (!isAnyFieldFilled.value) {
        alert("Per favore, compila almeno uno dei campi.");
        return;
      }

      if (!currentPassword.value) {
        alert("Per favore, inserisci la password corrente.");
        return;
      }

      console.log("Inviando richiesta di aggiornamento con i seguenti dati:", {
        oldUsername: oldUsername.value,
        newUsername: newUsername.value,
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        currentPassword: currentPassword.value,
      });

      try {
        const response = await axios.post(
          "http://localhost:3000/api/user/update",
          {
            oldUsername: oldUsername.value,
            newUsername: newUsername.value,
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
            currentPassword: currentPassword.value,
          }
        );

        if (response.data.success) {
          alert("Dati aggiornati con successo!");
          localStorage.setItem("username", newUsername.value); // Aggiorna il localStorage con il nuovo username
          router.push("/HOME_UTENTE");
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Errore durante l'aggiornamento dei dati:", error);
        if (error.response && error.response.status === 401) {
          alert("Password corrente errata.");
        } else {
          alert("Errore del server.");
        }
      }
    };

    return {
      oldUsername,
      newUsername,
      email,
      firstName,
      lastName,
      currentPassword,
      confirmChanges,
      isAnyFieldFilled,
    };
  },
});
</script>

<style scoped>
/* Aggiungi eventuali stili personalizzati se necessario */
</style>
