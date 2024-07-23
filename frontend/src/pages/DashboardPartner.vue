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
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    dark
                    color="white"
                    autogrow
                    dense
                    v-model="user_details.address"
                    label="Indirizzo"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize bg-info text-white"
              @click="updateUserInfo"
              >Update User Info</q-btn
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

export default defineComponent({
  name: "DashboardPartner",
  setup() {
    const user_details = ref({
      user_name: "",
      email: "",
      first_name: "",
      address: "",
    });

    const getPartnerDetails = async () => {
      const partnerId = localStorage.getItem("partner_id"); // Ottieni l'ID del partner dal local storage
      if (!partnerId) {
        console.error("Partner ID non trovato nel local storage");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/partners/partner-details",
          {
            params: { partnerId },
          }
        );
        Object.assign(user_details.value, response.data.partner);
      } catch (error) {
        console.error(
          "Errore durante il recupero dei dettagli del partner:",
          error
        );
      }
    };

    onMounted(() => {
      getPartnerDetails();
    });

    const updateUserInfo = async () => {
      const partnerId = localStorage.getItem("partner_id"); // Ottieni l'ID del partner dal local storage
      if (!partnerId) {
        console.error("Partner ID non trovato nel local storage");
        return;
      }

      try {
        await axios.put("http://localhost:3000/api/partners/update-partner", {
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

    return {
      user_details,
      updateUserInfo,
    };
  },
});
</script>

<style scoped>
.card-bg {
  background-color: #162b4d;
}
</style>
