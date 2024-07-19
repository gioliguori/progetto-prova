<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 800px">
      <q-card-section class="text-center">
        <div class="text-h5">Admin Dashboard</div>
      </q-card-section>
      <q-card-section>
        <div>Welcome, {{ username }}!</div>
        <q-table
          :rows="partners"
          :columns="columns"
          row-key="partner_id"
          class="q-mt-md"
        />
        <q-table
          :rows="revenues"
          :columns="revenueColumns"
          row-key="partner_name"
          title="Revenues"
          class="q-mt-md"
        />
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
  name: "DashboardAdmin",
  data() {
    return {
      username: localStorage.getItem("username") || "Admin",
      partners: [],
      revenues: [],
      columns: [
        {
          name: "partner_name",
          label: "Name",
          align: "left",
          field: "partner_name",
        },
        {
          name: "partner_type",
          label: "Type",
          align: "left",
          field: "partner_type",
        },
        {
          name: "latitude",
          label: "Latitude",
          align: "left",
          field: "latitude",
        },
        {
          name: "longitude",
          label: "Longitude",
          align: "left",
          field: "longitude",
        },
        {
          name: "count_bike",
          label: "Bike Count",
          align: "left",
          field: "count_bike",
        },
      ],
      revenueColumns: [
        {
          name: "partner_name",
          label: "Partner Name",
          align: "left",
          field: "partner_name",
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "weekly_revenue",
          align: "center",
          label: "Weekly Revenue",
          field: "weekly_revenue",
          sortable: true,
        },
        {
          name: "monthly_revenue",
          align: "center",
          label: "Monthly Revenue",
          field: "monthly_revenue",
          sortable: true,
        },
        {
          name: "annual_revenue",
          align: "center",
          label: "Annual Revenue",
          field: "annual_revenue",
          sortable: true,
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
        const response = await axios.get(
          "http://localhost:3000/api/admin/data",
          {
            params: { username: this.username },
          }
        );
        Loading.hide();
        if (response.data.success) {
          this.partners = response.data.partners;
          this.revenues = response.data.revenues;
        } else {
          this.$q.notify({
            type: "negative",
            message: "Failed to fetch data",
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
    logout() {
      localStorage.removeItem("username");
      localStorage.removeItem("partners");
      localStorage.removeItem("revenues");
      this.$router.push({ name: "LoginPage" });
    },
  },
};
</script>
