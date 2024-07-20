<template>
  <q-page class="q-pa-md">
    <div class="q-mb-lg">
      <h2>INSERISCI BICI</h2>
    </div>
    <q-form @submit="submitForm">
      <q-select
        v-model="type"
        label="Tipo"
        :options="typeOptions"
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
        class="q-mb-md"
      ></q-input>

      <q-select
        v-model="status"
        label="Stato"
        :options="statusOptions"
        outlined
        required
        class="q-mb-md"
      ></q-select>

      <q-btn type="submit" label="Invia" color="primary"></q-btn>
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
          Input non valido. Per favore, evita di usare parole riservate come
          "DROP TABLE".
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      type: "",
      batteryLevel: null,
      status: "",
      successDialog: false,
      errorDialog: false,
      typeOptions: [
        { label: "City bike elettrica", value: "city bike elettrica" },
        { label: "MTB elettrica", value: "mtb elettrica" },
        { label: "Pieghevole elettrica", value: "pieghevole elettrica" },
        { label: "Bici da città", value: "bici da città" },
        { label: "Bici per bambino", value: "bici per bambino" },
        { label: "Mountain bike", value: "mountain bike" },
      ],
      statusOptions: [
        { label: "In noleggio", value: "in noleggio" },
        { label: "Disponibile", value: "disponibile" },
        { label: "Riservata", value: "riservata" },
        { label: "Dismessa", value: "dismessa" },
      ],
    };
  },
  methods: {
    containsUnsafeTerms(input) {
      const blacklist = [
        "DROP TABLE",
        "SELECT *",
        "DELETE FROM",
        "INSERT INTO",
        "UPDATE",
        "--",
        ";",
        "/*",
        "*/",
      ];
      return blacklist.some((term) => input.toUpperCase().includes(term));
    },
    submitForm() {
      // Verifica se gli input contengono termini pericolosi
      const isTypeUnsafe = this.containsUnsafeTerms(this.type);
      const isBatteryLevelUnsafe = this.containsUnsafeTerms(
        this.batteryLevel.toString()
      );
      const isStatusUnsafe = this.containsUnsafeTerms(this.status);

      if (isTypeUnsafe || isBatteryLevelUnsafe || isStatusUnsafe) {
        // Mostra il dialogo di errore se l'input è non sicuro
        this.errorDialog = true;
      } else {
        // Logica per la gestione del form
        console.log("Tipo:", this.type);
        console.log("Livello batteria:", this.batteryLevel);
        console.log("Stato:", this.status);

        // Mostra il dialogo di successo
        this.successDialog = true;
      }
    },
    redirectToDashboard() {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
/* Aggiungi qui eventuali stili personalizzati */
</style>
