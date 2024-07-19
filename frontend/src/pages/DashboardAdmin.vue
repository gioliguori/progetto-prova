<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section class="text-center">
        <div class="text-h5">Admin Dashboard</div>
      </q-card-section>
      <q-card-section>
        <div>Welcome, {{ username }}!</div>
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
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("username");
      this.$router.push({ name: "LoginPage" });
    },
  },
};
</script>
