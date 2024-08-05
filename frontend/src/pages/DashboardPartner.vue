<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="card-bg text-white no-shadow" bordered>
          <q-card-section class="text-h6">
            <div class="text-h6">Modifica Profilo</div>
            <div class="text-subtitle2">Completa il tuo profilo</div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section side>
                  <q-avatar size="100px">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-btn
                    label="Add Photo"
                    class="text-capitalize"
                    rounded
                    color="info"
                    style="max-width: 120px"
                  ></q-btn>
                </q-item-section>
              </q-item>

              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    dense
                    v-model="user_details.user_name"
                    label="Nome Utente"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    dense
                    v-model="user_details.email"
                    label="Indirizzo Email"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    dense
                    v-model="user_details.first_name"
                    label="Nome"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize bg-info text-white"
              @click="updateUserInfo"
              >Aggiorna Informazioni</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12"></div>

      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="card-bg text-white no-shadow" bordered>
          <q-card-section class="text-h6 q-pa-sm">
            <div class="text-h6">Modifica Password</div>
          </q-card-section>
          <q-card-section class="q-pa-sm row">
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section> Password corrente </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dark
                  dense
                  outlined
                  color="white"
                  round
                  v-model="password_dict.current_password"
                  label="Password Corrente"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section> Nuova password </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dark
                  dense
                  outlined
                  color="white"
                  round
                  v-model="password_dict.new_password"
                  label="Nuova password"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section> Conferma nuova password </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dark
                  dense
                  outlined
                  round
                  color="white"
                  v-model="password_dict.confirm_new_password"
                  label="Conferma nuova password"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize bg-info text-white"
              @click="updatePassword"
              >Cambia password</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import apiUrl from "src/api-config"; // Importa apiUrl

export default defineComponent({
  name: "DashboardPartner",
  setup() {
    const user_details = ref({
      user_name: "",
      email: "",
      first_name: "",
    });

    const password_dict = ref({
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    });

    const getPartnerDetails = async () => {
      const partnerId = localStorage.getItem("partner_id"); // Ottieni l'ID del partner dal local storage
      if (!partnerId) {
        console.error("Partner ID non trovato nel local storage");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/partners/partner-details`, {
          params: { partnerId },
        });
        Object.assign(user_details.value, response.data.partner);
      } catch (error) {
        console.error(
          "Errore durante il recupero dei dettagli del partner:",
          error
        );
      }
    };

    const updateUserInfo = async () => {
      const partnerId = localStorage.getItem("partner_id"); // Ottieni l'ID del partner dal local storage
      if (!partnerId) {
        console.error("Partner ID non trovato nel local storage");
        return;
      }

      try {
        await axios.put(`${apiUrl}/partners/update-partner`, {
          partner_id: partnerId,
          ...user_details.value,
        });
        alert("Informazioni aggiornate con successo");
      } catch (error) {
        console.error(
          "Errore durante l'aggiornamento delle informazioni:",
          error
        );
      }
    };

    const updatePassword = async () => {
      const partnerId = localStorage.getItem("partner_id"); // Ottieni l'ID del partner dal local storage
      if (!partnerId) {
        console.error("Partner ID non trovato nel local storage");
        return;
      }

      if (
        password_dict.value.new_password !==
        password_dict.value.confirm_new_password
      ) {
        alert("La nuova password e la conferma non coincidono");
        return;
      }

      try {
        await axios.put(`${apiUrl}/partners/update-password`, {
          partner_id: partnerId,
          current_password: password_dict.value.current_password,
          new_password: password_dict.value.new_password,
        });
        alert("Password aggiornata con successo");
      } catch (error) {
        console.error("Errore durante l'aggiornamento della password:", error);
      }
    };

    onMounted(() => {
      getPartnerDetails();
    });

    return {
      user_details,
      password_dict,
      updateUserInfo,
      updatePassword,
    };
  },
});
</script>

<style scoped>
.card-bg {
  background-color: #162b4d;
}
</style>
