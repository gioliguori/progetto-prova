<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <!-- Logo dell'applicazione -->
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img
                src="src/assets/schiano.go.png"
                style="object-fit: cover; width: 100%; height: 100%"
              />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <!-- Titolo della sezione di login -->
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Log in</div>
            </div>
          </q-card-section>
          <q-card-section>
            <!-- Form di login -->
            <q-form class="q-gutter-md">
              <q-input filled v-model="username" label="Username" lazy-rules />
              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />
              <!-- Selezione del ruolo -->
              <q-option-group
                v-model="role"
                :options="roleOptions"
                type="radio"
                inline
              />
              <!-- Bottone di login -->
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
import apiUrl from "src/api-config";

export default {
  name: "AdminLogin",
  data() {
    return {
      username: "",
      password: "",
      role: "admin",
      roleOptions: [
        { label: "Admin", value: "admin" },
        { label: "Partner", value: "partner" },
      ],
    };
  },
  methods: {
    async login() {
      Loading.show({
        spinner: QSpinnerGears,
        message: "Logging in...",
      });
      try {
        // Effettua la richiesta di login
        const response = await axios.post(`${apiUrl}/login/admin-partner`, {
          username: this.username,
          password: this.password,
          role: this.role,
        });
        Loading.hide();
        if (response.data.success) {
          // Salva i dati dell'utente e reindirizza alla dashboard appropriata
          if (this.role === "admin") {
            localStorage.setItem("username", response.data.user.username);
            this.$router.push({ name: "AdminDashboard" });
          } else if (this.role === "partner") {
            localStorage.setItem("partner_id", response.data.user.partner_id);
            localStorage.setItem("partner_name", response.data.user.username);
            this.$router.push({ name: "PartnerDashboard" });
          }
        } else {
          // Notifica in caso di credenziali non valide
          this.$q.notify({
            type: "negative",
            message: "Invalid username or password",
          });
        }
      } catch (error) {
        Loading.hide();
        // Notifica in caso di errore durante il login
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
