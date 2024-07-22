<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 800px">
      <q-card-section class="text-center">
        <div class="text-h5">LISTA BICI DEL PARTNER</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="bikes"
          :columns="columns"
          row-key="bike_id"
          class="q-mt-md"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                color="negative"
                label="Delete"
                @click="deleteBike(props.row.bike_id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section>
        <q-btn @click="logout" color="primary" label="Logout" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { Loading, QSpinnerGears } from "quasar";

export default {
  name: "DashboardPartner",
  data() {
    return {
      username: localStorage.getItem("username") || "Partner",
      bikes: [],
      columns: [
        {
          name: "bike_type",
          label: "Type",
          align: "left",
          field: "bike_type",
        },
        {
          name: "state",
          label: "State",
          align: "left",
          field: "state",
        },
        {
          name: "battery_level",
          label: "Battery",
          align: "left",
          field: "battery_level",
        },
        {
          name: "count_run",
          label: "Rides",
          align: "left",
          field: "count_run",
        },
        {
          name: "actions",
          label: "Actions",
          align: "center",
          field: "actions",
          required: true,
          sortable: false,
        },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      Loading.show({
        spinner: QSpinnerGears,
        message: "Fetching data...",
      });
      try {
        const partnerId = localStorage.getItem("partner_id");
        const bikesResponse = await axios.get(
          `http://localhost:3000/api/partners/bikes?partner_id=${partnerId}`
        );

        Loading.hide();

        if (bikesResponse.data.success) {
          this.bikes = bikesResponse.data.bikes;
        } else {
          this.$q.notify({
            type: "negative",
            message: "Failed to fetch bikes",
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
    async deleteBike(bikeId) {
      try {
        const partnerId = localStorage.getItem("partner_id");
        await axios.delete(`http://localhost:3000/api/partners/bike/${bikeId}`);
        this.bikes = this.bikes.filter((bike) => bike.bike_id !== bikeId);
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
    logout() {
      localStorage.removeItem("username");
      localStorage.removeItem("partner_id");
      this.$router.push({ name: "LoginPage" });
    },
  },
};
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
