<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="src/assets/bici-login-admin.png" />
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
              <q-option-group
                v-model="role"
                :options="roleOptions"
                type="radio"
                inline
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

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      role: "admin", // Default role
      roleOptions: [
        { label: "Admin", value: "admin" },
        { label: "Partner", value: "partner" },
      ],
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
        const response = await axios.post(
          "http://localhost:3000/api/login/admin-partner",
          {
            username: this.username,
            password: this.password,
            role: this.role, // Include the role in the request
          }
        );
        Loading.hide();
        if (response.data.success) {
          console.log(
            "Login avvenuto con successo per l'utente:",
            this.username
          );
          if (this.role === "admin") {
            localStorage.setItem("username", response.data.user.username); // Salva il nome utente per l'admin
            this.$router.push({ name: "DashboardAdmin" });
          } else if (this.role === "partner") {
            localStorage.setItem("partner_id", response.data.user.partner_id); // Salva il partner_id per il partner
            this.$router.push({ name: "DashboardPartner" });
          }
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
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
