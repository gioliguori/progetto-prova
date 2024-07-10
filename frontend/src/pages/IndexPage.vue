<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card class="q-pa-md" style="max-width: 400px">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="username"
            filled
            label="Username"
            @keyup.enter="login"
          />
          <q-input
            v-model="password"
            filled
            type="password"
            label="Password"
            @keyup.enter="login"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Login" color="primary" @click="login" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { Loading, QSpinnerGears } from "quasar";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      Loading.show({
        spinner: QSpinnerGears,
        message: "Logging in...",
      });
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          username: this.username,
          password: this.password,
        });
        Loading.hide();
        if (response.data.success) {
          localStorage.setItem("username", response.data.user.username); // Salva il nome utente
          this.$router.push({ name: "loggedInPage" });
        } else {
          this.$q.notify({
            type: "negative",
            message: "Invalid username or password",
          });
        }
      } catch (error) {
        Loading.hide();
        console.error("Error logging in:", error);
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
.row {
  margin-top: 20px;
}
</style>
