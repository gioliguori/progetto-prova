<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 800px">
      <q-card-section class="text-center">
        <div class="text-h5">LISTA PARTNER</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="partners"
          :columns="columns"
          row-key="partner_id"
          class="q-mt-md"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                color="negative"
                label="Delete"
                @click="deletePartner(props.row.partner_id)"
              />
            </q-td>
          </template>
        </q-table>
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
        {
          name: "actions",
          label: "Actions",
          align: "center",
          field: "actions",
          required: true,
          sortable: false,
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
        const [partnersResponse, revenuesResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/admin/partners"),
          axios.get("http://localhost:3000/api/admin/revenues"),
        ]);

        Loading.hide();

        if (partnersResponse.data.success) {
          this.partners = partnersResponse.data.partners;
        } else {
          this.$q.notify({
            type: "negative",
            message: "Failed to fetch partners",
          });
        }

        if (revenuesResponse.data.success) {
          this.revenues = revenuesResponse.data.revenues;
        } else {
          this.$q.notify({
            type: "negative",
            message: "Failed to fetch revenues",
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
    async deletePartner(partnerId) {
      try {
        await axios.delete(
          `http://localhost:3000/api/admin/partner/${partnerId}`
        );
        this.partners = this.partners.filter(
          (partner) => partner.partner_id !== partnerId
        );
        this.$q.notify({
          type: "positive",
          message: "Partner deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting partner:", error);
        this.$q.notify({
          type: "negative",
          message: "An error occurred while deleting the partner",
        });
      }
    },
    logout() {
      localStorage.removeItem("username");
      this.$router.push({ name: "LoginPage" });
    },
  },
};
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
