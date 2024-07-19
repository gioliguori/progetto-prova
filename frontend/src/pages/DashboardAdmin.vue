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
      </q-card-section>
      <q-card-section>
        <q-btn @click="logout" color="primary" label="Logout" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "DashboardAdmin",
  data() {
    return {
      username: localStorage.getItem("username") || "Admin",
      partners: JSON.parse(localStorage.getItem("partners")) || [],
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
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("username");
      localStorage.removeItem("partners");
      this.$router.push({ name: "LoginPage" });
    },
  },
};
</script>
