<template>
  <q-page class="q-pa-md">
    <div class="q-mb-lg">
      <h2>MODIFICA BICI</h2>
    </div>
    <q-table
      :rows="bikes"
      :columns="columns"
      row-key="id"
      class="q-mb-md"
    >
      <template v-slot:body-cell-state="props">
        <q-td :props="props">
          <q-select
            v-model="props.row.state"
            :options="stateOptions"
            dense
            outlined
            @update:model-value="updateBikeState(props.row)"
          ></q-select>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            icon="delete"
            color="negative"
            @click="deleteBike(props.row.id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      bikes: [],
      columns: [
        { name: 'id', required: true, label: 'ID', align: 'left', field: row => row.id, format: val => `${val}`, sortable: true },
        { name: 'type', align: 'left', label: 'Tipo', field: 'type', sortable: true },
        { name: 'battery_level', align: 'left', label: 'Livello Batteria', field: 'battery_level', sortable: true },
        { name: 'state', align: 'left', label: 'Stato', field: 'state', sortable: true },
        { name: 'actions', align: 'center', label: 'Azioni', field: 'actions' },
      ],
      stateOptions: [
        { label: 'Attivo', value: 'attivo' },
        { label: 'Noleggiato', value: 'noleggiato' },
        { label: 'Dismesso', value: 'dismesso' },
      ],
    };
  },
  methods: {
    fetchBikes() {
      // Simulazione di chiamata API
      this.bikes = [
        { id: 1, type: 'Elettrica', battery_level: 80, state: 'attivo' },
        { id: 2, type: 'Mountain Bike', battery_level: 50, state: 'noleggiato' },
        // Aggiungi altre biciclette qui
      ];
      // Sostituire la parte sopra con una chiamata API reale
      /*
      this.$axios.get('/api/bikes')
        .then(response => {
          this.bikes = response.data;
        })
        .catch(error => {
          console.error(error);
        });
      */
    },
    updateBikeState(bike) {
      // Simulazione di chiamata API per aggiornare lo stato della bici
      console.log(`Aggiornare bici ID ${bike.id} a stato ${bike.state}`);
      // Sostituire la parte sopra con una chiamata API reale
      /*
      this.$axios.put(`/api/bikes/${bike.id}`, { state: bike.state })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
      */
    },
    deleteBike(id) {
      // Simulazione di chiamata API per eliminare la bici
      console.log(`Eliminare bici ID ${id}`);
      // Rimuovi la bici dalla lista localmente
      this.bikes = this.bikes.filter(bike => bike.id !== id);
      // Sostituire la parte sopra con una chiamata API reale
      /*
      this.$axios.delete(`/api/bikes/${id}`)
        .then(response => {
          this.bikes = this.bikes.filter(bike => bike.id !== id);
        })
        .catch(error => {
          console.error(error);
        });
      */
    },
  },
  created() {
    this.fetchBikes();
  },
};
</script>

<style scoped>
/* Aggiungi qui eventuali stili personalizzati */
</style>
