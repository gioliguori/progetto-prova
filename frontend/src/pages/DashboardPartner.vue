<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section class="text-center">
        <div class="text-h5">Partner Dashboard</div>
      </q-card-section>
      <q-card-section>
        <div>Welcome, Partner with ID: {{ partnerId }}!</div>
      </q-card-section>
      <q-card-section>
        <q-btn @click="logout" color="primary" label="Logout" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "DashboardPartner",
  data() {
    return {
      partnerId: localStorage.getItem("partner_id") || "Unknown",
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("partner_id");
      this.$router.push({ name: "LoginPage" });
    },
  },
};
</script>
