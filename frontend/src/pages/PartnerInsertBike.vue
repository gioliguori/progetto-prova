<template>
  <q-page class="q-pa-md" :class="{ 'dark-mode': $q.dark.isActive }">
    <div class="q-mb-lg text-center">
      <h2 class="page-title">INSERISCI BICI</h2>
    </div>
    <q-form @submit="submitForm">
      <q-select
        v-model="type"
        label="Tipo"
        :options="bikeTypes"
        outlined
        required
        class="q-mb-md"
      ></q-select>

      <q-input
        v-model="batteryLevel"
        label="Livello batteria"
        type="number"
        outlined
        required
        :rules="[validaLivelloBatteria]"
        class="q-mb-md"
      ></q-input>

      <div class="text-center">
        <q-btn
          type="submit"
          label="Invia"
          color="primary"
          class="submit-btn"
        ></q-btn>
      </div>
    </q-form>

    <!-- Dialogo di successo -->
    <q-dialog v-model="successDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Successo</div>
        </q-card-section>

        <q-card-section>
          La bici è stata inserita con successo.
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
      <q-card>
        <q-card-section>
          <div class="text-h6">Errore</div>
        </q-card-section>

        <q-card-section>
          Si è verificato un errore durante l'inserimento della bici.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import apiUrl from "src/api-config";

export default {
  name: "PartnerInsertBike",
  data() {
    return {
      type: "",
      batteryLevel: null,
      successDialog: false,
      errorDialog: false,
      bikeTypes: [
        { label: "City Bike Elettrica", value: "City Bike Elettrica" },
        { label: "Mtb Elettrica", value: "Mtb Elettrica" },
        { label: "Pieghevole Elettrica", value: "Pieghevole Elettrica" },
        { label: "Bici Da Città", value: "Bici Da Città" },
        { label: "Bici Per Bambini", value: "Bici Per Bambini" },
        { label: "Mountain Bike", value: "Mountain Bike" },
      ],
    };
  },
  methods: {
    validaLivelloBatteria(value) {
      if (value < 0 || value > 100) {
        return "Il livello della batteria deve essere compreso tra 0 e 100.";
      }
      return true;
    },
    submitForm(event) {
      event.preventDefault();

      // Ottieni i dettagli del partner da localStorage
      const partner_id = localStorage.getItem("partner_id");

      // Verifica che i dettagli del partner siano presenti
      if (!partner_id) {
        this.$q.notify({
          type: "negative",
          message:
            "Dettagli del partner non trovati. Per favore, effettua di nuovo il login.",
        });
        return;
      }

      // Logica per la gestione del form
      const payload = {
        bike_type: this.type.value,
        battery_level: this.batteryLevel,
        partner_id,
      };

      // Effettua la chiamata al backend per inserire la bici
      fetch(`${apiUrl}/bikes/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Errore nella risposta del server");
          }
          return response.json();
        })
        .then(() => {
          // Mostra il dialogo di successo
          this.successDialog = true;
        })
        .catch((error) => {
          console.error("Errore durante l'invio della richiesta:", error);
          // Mostra il dialogo di errore
          this.errorDialog = true;
        });
    },
    redirectToDashboard() {
      this.$router.push("/PartnerDashboard");
    },
  },
};
</script>

<style scoped>
/* Modalità scura */
.dark-mode {
  background-color: #121212; /* Sfondo scuro per la modalità scura */
  color: #e0e0e0; /* Colore del testo in modalità scura */
}

.page-title {
  font-weight: bold;
  font-size: 1.5rem;
  color: #1b89ff; /* Colore del titolo in modalità chiara */
}

@media (min-width: 600px) {
  .page-title {
    font-size: 2rem;
  }
}

@media (min-width: 960px) {
  .page-title {
    font-size: 2.5rem;
  }
}

/* Stile per i pulsanti personalizzati */
.submit-btn {
  font-size: 1.2rem;
  padding: 0.75rem 1.5rem;
}

/* Modalità scura per i dialoghi */
.dark-mode .q-card {
  background-color: #333; /* Sfondo scuro per i card */
  color: #e0e0e0; /* Colore del testo nei card */
}

.dark-mode .q-card-actions q-btn {
  color: #1b89ff; /* Colore dei pulsanti nel dialogo in modalità scura */
}
</style>
