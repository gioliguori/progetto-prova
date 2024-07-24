<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Registrazione</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="register">
              <q-input
                filled
                v-model="username"
                label="Nome Utente"
                lazy-rules
                :rules="[(val) => !!val || 'Il nome utente è obbligatorio']"
              />
              <q-input
                filled
                v-model="email"
                label="Email"
                lazy-rules
                :rules="[
                  (val) => !!val || 'L\'email è obbligatoria',
                  (val) => /.+@.+\..+/.test(val) || 'Email non valida',
                ]"
              />
              <q-input
                filled
                v-model="firstName"
                label="Nome"
                lazy-rules
                :rules="[(val) => !!val || 'Il nome è obbligatorio']"
              />
              <q-input
                filled
                v-model="lastName"
                label="Cognome"
                lazy-rules
                :rules="[(val) => !!val || 'Il cognome è obbligatorio']"
              />
              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
                :rules="[
                  (val) => !!val || 'La password è obbligatoria',
                  (val) =>
                    /\d/.test(val) ||
                    'La password deve contenere almeno un numero',
                ]"
              />
              <div>
                <q-btn
                  label="Registrati"
                  type="submit"
                  color="primary"
                  :disabled="!isFormValid"
                  class="full-width"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";
import { Loading, QSpinnerGears, Notify } from "quasar";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "RegisterPage",
  setup() {
    const router = useRouter();
    const username = ref("");
    const email = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const password = ref("");

    const isFormValid = computed(() => {
      return (
        username.value &&
        email.value &&
        firstName.value &&
        lastName.value &&
        password.value
      );
    });

    const register = async () => {
      console.log("Attempting registration with:", {
        username: username.value,
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value,
      });

      if (!isFormValid.value) {
        Notify.create({
          type: "negative",
          message: "Per favore, compila tutti i campi.",
        });
        return;
      }

      Loading.show({
        spinner: QSpinnerGears,
        message: "Registrazione in corso...",
      });

      try {
        const response = await axios.post(
          "http://localhost:3000/api/user/register",
          {
            username: username.value,
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
            password: password.value,
          }
        );
        Loading.hide();

        if (response.data.success) {
          console.log("Registration successful");
          localStorage.setItem("username", username.value);
          Notify.create({
            type: "positive",
            message: "Registrazione completata con successo!",
          });
          router.push({ name: "HOME_UTENTE" }); // Naviga alla pagina HOME_UTENTE
        } else {
          console.log("Registration failed:", response.data.message);
          Notify.create({
            type: "negative",
            message: response.data.message,
          });
        }
      } catch (error) {
        Loading.hide();
        console.error("Errore durante la registrazione:", error);
        Notify.create({
          type: "negative",
          message: `Si è verificato un errore durante la registrazione: ${error.message}`,
        });
      }
    };

    return {
      username,
      email,
      firstName,
      lastName,
      password,
      isFormValid,
      register,
    };
  },
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #a2d9ff, #66b2ff);
}
</style>
