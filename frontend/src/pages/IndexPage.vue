<template>
  <q-page class="flex flex-center bg-grey-2" style="background-color: #f0f0f0">
    <q-card
      class="q-pa-md shadow-2 my_card"
      bordered
      style="
        background-color: #ffffff;
        border: 1px solid #000000;
        border-radius: 10px;
      "
    >
      <q-card-section class="text-center">
        <div class="text-black text-h5 text-weight-bold">Sign in</div>
        <div class="text-grey-8">Sign in below to access your account</div>
      </q-card-section>
      <q-card-section>
        <q-input
          dense
          outlined
          v-model="username"
          label="Username"
          class="centered-input"
        ></q-input>
        <q-input
          dense
          outlined
          class="q-mt-md centered-input"
          v-model="password"
          type="password"
          label="Password"
        ></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn
          style="border-radius: 8px; background-color: #00008b; color: #ffffff"
          rounded
          size="md"
          label="Sign in"
          no-caps
          class="full-width"
          @click="login"
        ></q-btn>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Don't have an account yet?
          <a
            href="#"
            class="text-blue text-weight-bold"
            style="text-decoration: none; color: #00008b"
          >
            Sign up.
          </a>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { Loading, QSpinnerGears } from "quasar";

export default {
  name: "IndexPage",
  data() {
    return {
      username: "",
      password: "",
    };
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
        const response = await axios.post("http://localhost:3000/api/login", {
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
          this.$router.push({ name: "loggedInPage" });
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

