<template>
  <q-page class="q-pa-md">
    <div class="q-mb-lg">
      <h2>INSERISCI PARTNER</h2>
    </div>
    <q-form @submit="submitForm">
      <q-input
        v-model="name"
        label="Nome"
        maxlength="100"
        outlined
        required
        class="q-mb-md"
      ></q-input>

      <q-select
        v-model="type"
        label="Tipo"
        :options="typeOptions"
        outlined
        required
        class="q-mb-md"
      ></q-select>

      <q-input
        v-model="latitude"
        label="Latitudine"
        type="number"
        outlined
        required
        class="q-mb-md"
      ></q-input>

      <q-input
        v-model="longitude"
        label="Longitudine"
        type="number"
        outlined
        required
        class="q-mb-md"
      ></q-input>

      <q-btn type="submit" label="Invia" color="primary"></q-btn>
    </q-form>
    
    <!-- Dialogo di successo -->
    <q-dialog v-model="successDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Successo</div>
        </q-card-section>

        <q-card-section>
          Il partner è stato inserito con successo.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="redirectToDashboard"></q-btn>
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
          Input non valido. Per favore, evita di usare parole riservate come "DROP TABLE".
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
      name: '',
      type: null,
      latitude: null,
      longitude: null,
      typeOptions: [
        { label: 'Hotel', value: 'hotel' },
        { label: 'Ristorante', value: 'ristorante' },
        { label: 'Altro', value: 'altro' },
      ],
      successDialog: false,
      errorDialog: false,
    };
  },
  methods: {
    containsUnsafeTerms(input) {
      const blacklist = ["DROP TABLE", "SELECT *", "DELETE FROM", "INSERT INTO", "UPDATE", "--", ";", "/*", "*/"];
      return blacklist.some(term => input.toUpperCase().includes(term));
    },
    submitForm() {
      // Verifica se gli input contengono termini pericolosi
      const isNameUnsafe = this.containsUnsafeTerms(this.name);
      const isLatitudeUnsafe = this.containsUnsafeTerms(this.latitude.toString());
      const isLongitudeUnsafe = this.containsUnsafeTerms(this.longitude.toString());

      if (isNameUnsafe || isLatitudeUnsafe || isLongitudeUnsafe) {
        // Mostra il dialogo di errore se l'input è non sicuro
        this.errorDialog = true;
      } else {
        // Logica per la gestione del form
        console.log('Nome:', this.name);
        console.log('Tipo:', this.type);
        console.log('Latitudine:', this.latitude);
        console.log('Longitudine:', this.longitude);

        // Mostra il dialogo di successo
        this.successDialog = true;
      }
    },
    redirectToDashboard() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped>
/* Aggiungi qui eventuali stili personalizzati */
</style>
