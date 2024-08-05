<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img
                src="src/assets/schiano.go.png"
                style="object-fit: cover; width: 100%; height: 100%"
              />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Log in</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled v-model="username" label="Username" lazy-rules />
              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />
              <div>
                <q-btn
                  label="Login"
                  type="button"
                  color="primary"
                  @click="login"
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
import { Loading, QSpinnerGears } from "quasar";
import apiUrl from "src/api-config"; // Importa apiUrl

export default {
  name: "LoginUtente",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  created() {
    console.log("Resetting localStorage username");
    localStorage.removeItem("username");
  },
  methods: {
    async login() {
      console.log("Login button clicked"); // Log per capire se il metodo viene chiamato
      Loading.show({
        spinner: QSpinnerGears,
        message: "Logging in...",
      });
      try {
        console.log("Tentativo di login per l'utente:", this.username);
        const response = await axios.post(`${apiUrl}/login`, {
          username: this.username,
          password: this.password,
        });
        Loading.hide();
        if (response.data.success) {
          console.log(
            "Login avvenuto con successo per l'utente:",
            this.username
          );
          localStorage.setItem("username", response.data.user.username); // Salva il nome utente
          this.$router.push({ name: "HOME_UTENTE" }); // Naviga alla dashboard generica
        } else {
          console.log(
            "Username o password non validi per l'utente:",
            this.username
          );
          this.$q.notify({
            type: "negative",
            message: "Invalid username or password",
          });
        }
      } catch (error) {
        Loading.hide();
        console.error("Errore durante il login:", error);
        this.$q.notify({
          type: "negative",
          message: "An error occurred while logging in",
        });
      }
    },
  },
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #a2d9ff, #66b2ff);
}
</style>
