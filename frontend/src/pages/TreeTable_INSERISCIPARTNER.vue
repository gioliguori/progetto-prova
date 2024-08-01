<template>
  <q-page :class="pageClass" class="q-pa-md">
    <div class="q-mb-lg">
      <h2 :class="titleClass">INSERISCI PARTNER</h2>
    </div>
    <q-form @submit="submitForm">
      <q-input
        v-model="name"
        label="Nome"
        maxlength="100"
        outlined
        required
        class="q-mb-md"
        :class="inputClass"
      ></q-input>

      <q-select
        v-model="type"
        label="Tipo"
        :options="typeOptions"
        outlined
        required
        class="q-mb-md"
        :class="inputClass"
      ></q-select>

      <q-input
        v-model="email"
        label="Email"
        type="email"
        outlined
        required
        class="q-mb-md"
        :class="inputClass"
      ></q-input>

      <!-- Mappa per selezionare latitudine e longitudine -->
      <div id="map" style="height: 400px" class="q-mb-md"></div>

      <q-input
        v-model="formattedLatitude"
        label="Latitudine"
        type="text"
        outlined
        readonly
        class="q-mb-md"
        :class="inputClass"
      ></q-input>

      <q-input
        v-model="formattedLongitude"
        label="Longitudine"
        type="text"
        outlined
        readonly
        class="q-mb-md"
        :class="inputClass"
      ></q-input>

      <q-input
        v-model="address"
        label="Indirizzo"
        type="text"
        outlined
        readonly
        class="q-mb-md"
        :class="inputClass"
      ></q-input>

      <!-- Titolo per le credenziali del partner -->
      <div class="q-mb-md">
        <h3 :class="titleClass">CREDENZIALI PARTNER</h3>
      </div>

      <q-input
        v-model="username"
        label="Username"
        maxlength="50"
        outlined
        required
        class="q-mb-md"
        :class="inputClass"
      ></q-input>

      <q-input
        v-model="password"
        label="Password"
        type="password"
        maxlength="50"
        outlined
        required
        class="q-mb-md"
        :class="inputClass"
      ></q-input>

      <q-btn type="submit" label="Invia" color="primary"></q-btn>
    </q-form>

    <!-- Dialogo di successo -->
    <q-dialog v-model="successDialog" persistent>
      <q-card :class="dialogClass">
        <q-card-section>
          <div :class="dialogTitleClass">Successo</div>
        </q-card-section>

        <q-card-section>
          Il partner è stato inserito con successo.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
            @click="redirectToDashboard"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo di errore -->
    <q-dialog v-model="errorDialog" persistent>
      <q-card :class="dialogClass">
        <q-card-section>
          <div :class="dialogTitleClass">Errore</div>
        </q-card-section>

        <q-card-section>
          {{ errorMessage }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo di errore per password -->
    <q-dialog v-model="passwordErrorDialog" persistent>
      <q-card :class="dialogClass">
        <q-card-section>
          <div :class="dialogTitleClass">Errore Password</div>
        </q-card-section>

        <q-card-section>
          La password deve contenere almeno un numero.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import axios from "axios";

export default defineComponent({
  name: "PartnerForm",
  data() {
    return {
      name: "",
      type: null,
      email: "",
      latitude: 40.8522,
      longitude: 14.2681,
      formattedLatitude: "40.852200",
      formattedLongitude: "14.268100",
      address: "",
      username: "",
      password: "",
      typeOptions: [
        { label: "Hotel", value: "hotel" },
        { label: "Ristorante", value: "ristorante" },
        { label: "Altro", value: "altro" },
      ],
      successDialog: false,
      errorDialog: false,
      passwordErrorDialog: false,
      errorMessage: "",
    };
  },
  methods: {
    isPasswordValid(password) {
      return /\d/.test(password);
    },
    async fetchAddress(latitude, longitude) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        this.address = response.data.display_name || "Indirizzo non trovato";
      } catch (error) {
        this.address = "Errore nel recupero dell'indirizzo";
      }
    },
    async submitForm() {
      if (!this.isPasswordValid(this.password)) {
        this.passwordErrorDialog = true;
      } else {
        try {
          const response = await axios.post(`${apiUrl}/admin/insert/partner`, {
            name: this.name,
            type: this.type.value, // Utilizza il valore effettivo del tipo
            email: this.email, // Include l'email nella richiesta
            latitude: this.latitude,
            longitude: this.longitude,
            address: this.address, // Include l'indirizzo
            username: this.username,
            password: this.password,
          });
          if (response.status === 201) {
            this.successDialog = true;
          }
        } catch (error) {
          this.errorMessage =
            error.response.data.message ||
            "Errore durante l'inserimento del partner.";
          this.errorDialog = true;
        }
      }
    },
    redirectToDashboard() {
      this.$router.push("/TreeTable_INSERISCIPARTNER");
    },
    updateLatLong(event) {
      this.latitude = event.latlng.lat;
      this.longitude = event.latlng.lng;
      this.formattedLatitude = this.latitude.toFixed(6);
      this.formattedLongitude = this.longitude.toFixed(6);
      this.fetchAddress(this.latitude, this.longitude);
    },
  },
  mounted() {
    const map = L.map("map").setView([this.latitude, this.longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker([this.latitude, this.longitude]).addTo(map);

    map.on("click", (event) => {
      this.updateLatLong(event);
      marker.setLatLng([this.latitude, this.longitude]);
    });

    const geocoder = L.Control.Geocoder.nominatim();
    L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder: geocoder,
    })
      .on("markgeocode", (e) => {
        const bbox = e.geocode.bbox;
        const center = e.geocode.center;
        this.latitude = center.lat;
        this.longitude = center.lng;
        this.formattedLatitude = this.latitude.toFixed(6);
        this.formattedLongitude = this.longitude.toFixed(6);
        marker.setLatLng([this.latitude, this.longitude]);
        map.fitBounds(bbox);
        this.fetchAddress(this.latitude, this.longitude);
      })
      .addTo(map);

    this.fetchAddress(this.latitude, this.longitude);
  },
  computed: {
    pageClass() {
      return {
        'bg-dark text-light': this.$q.dark.isActive,
        'bg-light text-dark': !this.$q.dark.isActive,
      };
    },
    titleClass() {
      return {
        'text-primary': !this.$q.dark.isActive,
        'text-white': this.$q.dark.isActive,
      };
    },
    inputClass() {
      return {
        'bg-white text-black': !this.$q.dark.isActive,
        'bg-dark text-light': this.$q.dark.isActive,
      };
    },
    dialogClass() {
      return {
        'bg-white text-black': !this.$q.dark.isActive,
        'bg-dark text-light': this.$q.dark.isActive,
      };
    },
    dialogTitleClass() {
      return {
        'text-primary': !this.$q.dark.isActive,
        'text-white': this.$q.dark.isActive,
      };
    },
  },
});
</script>

<style scoped>
/* Stili per la pagina in dark mode e light mode */
.bg-dark {
  background-color: #333 !important;
}

.text-light {
  color: #e0e0e0 !important;
}

.bg-light {
  background-color: #f9f9f9 !important;
}

.text-dark {
  color: #333 !important;
}
</style>
