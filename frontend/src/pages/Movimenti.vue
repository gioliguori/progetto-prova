<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 800px">
      <q-card-section class="text-center">
        <div class="text-h5">LISTA NOLEGGI</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="rentals"
          :columns="columns"
          row-key="rental_id"
          class="q-mt-md"
        >
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { Loading, QSpinnerGears } from "quasar";

export default {
  name: "DashboardAdmin",
  data() {
    return {
      username: localStorage.getItem("username") || "Admin",
      rentals: [],
      columns: [
        {
          name: "bike_type",
          label: "Bike Type",
          align: "left",
          field: "bike_type",
        },
        {
          name: "rental_type",
          label: "Rental Type",
          align: "left",
          field: "rental_type",
        },
        {
          name: "rental_start",
          label: "Start Date",
          align: "left",
          field: "rental_start",
          format: (val) => new Date(val).toLocaleString(),
        },
        {
          name: "rental_end",
          label: "End Date",
          align: "left",
          field: "rental_end",
          format: (val) => (val ? new Date(val).toLocaleString() : "N/A"),
        },
        {
          name: "amount",
          label: "Amount",
          align: "left",
          field: "amount",
        },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const userId = "USER_ID"; // Sostituisci con l'ID dell'utente desiderato
      Loading.show({
        spinner: QSpinnerGears,
        message: "Fetching data...",
      });
      try {
        const rentalsResponse = await axios.get(
          `http://localhost:3000/api/admin/user-rentals/${userId}`
        );

        Loading.hide();

        if (rentalsResponse.data.success) {
          this.rentals = rentalsResponse.data.rentals;
        } else {
          this.$q.notify({
            type: "negative",
            message: "Failed to fetch rentals",
          });
        }
      } catch (error) {
        Loading.hide();
        console.error("Error fetching data:", error);
        this.$q.notify({
          type: "negative",
          message: "An error occurred while fetching data",
        });
      }
    },
  },
};
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
