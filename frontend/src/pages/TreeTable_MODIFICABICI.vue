<template>
  <q-page class="q-pa-md">
    <div class="q-mb-lg">
      <h2>MODIFICA BICI</h2>
    </div>
    <q-table :rows="bikes" :columns="columns" row-key="bike_id" class="q-mb-md">
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
            @click="deleteBike(props.row.bike_id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
    <q-btn
      label="Apporta modifiche"
      color="primary"
      @click="submitChanges"
    ></q-btn>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bikes: [],
      columns: [
        {
          name: "bike_id",
          required: true,
          label: "ID",
          align: "left",
          field: (row) => row.bike_id,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "bike_type",
          align: "left",
          label: "Tipo",
          field: "bike_type",
          sortable: true,
        },
        {
          name: "battery_level",
          align: "left",
          label: "Livello Batteria",
          field: "battery_level",
          sortable: true,
        },
        {
          name: "state",
          align: "left",
          label: "Stato",
          field: "state",
          sortable: true,
        },
        { name: "actions", align: "center", label: "Azioni", field: "actions" },
      ],
      stateOptions: [
        { label: "Disponibile", value: "disponibile" },
        { label: "In noleggio", value: "in noleggio" },
        { label: "Riservata", value: "riservata" },
        { label: "Dismessa", value: "dismessa" },
      ],
      modifiedBikes: [],
    };
  },
  methods: {
    async fetchBikes() {
      try {
        const partnerId = localStorage.getItem("partner_id");
        const response = await axios.get(
          `http://localhost:3000/api/partners/bikes?partner_id=${partnerId}`
        );
        if (response.data.success) {
          this.bikes = response.data.bikes;
        } else {
          this.$q.notify({
            type: "negative",
            message: "Failed to fetch bikes",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        this.$q.notify({
          type: "negative",
          message: "An error occurred while fetching data",
        });
      }
    },
    updateBikeState(bike) {
      const existingBikeIndex = this.modifiedBikes.findIndex(
        (b) => b.bike_id === bike.bike_id
      );
      if (existingBikeIndex !== -1) {
        this.modifiedBikes[existingBikeIndex].state = bike.state;
      } else {
        this.modifiedBikes.push({ ...bike });
      }
    },
    async deleteBike(bikeId) {
      try {
        await axios.delete(`http://localhost:3000/api/partners/bike/${bikeId}`);
        this.bikes = this.bikes.filter((bike) => bike.bike_id !== bikeId);
        this.modifiedBikes = this.modifiedBikes.filter(
          (bike) => bike.bike_id !== bikeId
        );
        this.$q.notify({
          type: "positive",
          message: "Bike deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting bike:", error);
        this.$q.notify({
          type: "negative",
          message: "An error occurred while deleting the bike",
        });
      }
    },
    async submitChanges() {
      try {
        const response = await axios.put(
          "http://localhost:3000/api/partners/bikes",
          { bikes: this.modifiedBikes }
        );
        if (response.data.success) {
          this.$q.notify({
            type: "positive",
            message: "Changes submitted successfully",
          });
          this.modifiedBikes = [];
          this.fetchBikes();
        } else {
          this.$q.notify({
            type: "negative",
            message: "Failed to submit changes",
          });
        }
      } catch (error) {
        console.error("Error submitting changes:", error);
        this.$q.notify({
          type: "negative",
          message: "An error occurred while submitting changes",
        });
      }
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
