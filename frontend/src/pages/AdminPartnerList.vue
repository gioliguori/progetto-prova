<template>
  <q-page :class="pageClass" class="flex flex-center q-pa-md">
    <q-card class="q-pa-md responsive-card" :class="cardClass">
      <q-card-section class="text-center">
        <div :class="titleClass">LISTA PARTNER</div>
      </q-card-section>
      <q-card-section>
        <!-- Tabella dei Partner -->
        <q-markup-table class="q-mt-md custom-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.name" :style="headerStyle">
                {{ col.label }}
              </th>
              <th :style="headerStyle">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in partners" :key="row.partner_id">
              <td v-for="col in columns" :key="col.name" class="center-text">
                {{ row[col.field] }}
              </td>
              <td class="center-text">
                <q-btn
                  color="negative"
                  label="Delete"
                  @click="deletePartner(row.partner_id)"
                  class="red-btn"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <!-- Tabella dei Ricavi -->
        <q-markup-table class="q-mt-md custom-table">
          <thead>
            <tr>
              <th
                v-for="col in revenueColumns"
                :key="col.name"
                :style="headerStyle"
              >
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in revenues" :key="row.partner_name">
              <td
                v-for="col in revenueColumns"
                :key="col.name"
                class="center-text"
              >
                {{ row[col.field] }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { Loading, QSpinnerGears } from "quasar";
import apiUrl from "src/api-config";

export default {
  name: "AdminPartnerList",
  data() {
    return {
      username: localStorage.getItem("username") || "Admin",
      partners: [],
      revenues: [],
      columns: [
        {
          name: "partner_name",
          label: "Name",
          align: "center",
          field: "partner_name",
        },
        {
          name: "partner_type",
          label: "Type",
          align: "center",
          field: "partner_type",
        },
        {
          name: "latitude",
          label: "Latitude",
          align: "center",
          field: "latitude",
        },
        {
          name: "longitude",
          label: "Longitude",
          align: "center",
          field: "longitude",
        },
        {
          name: "count_bike",
          label: "Bike Count",
          align: "center",
          field: "count_bike",
        },
      ],
      revenueColumns: [
        {
          name: "partner_name",
          label: "Partner Name",
          align: "center",
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
          axios.get(`${apiUrl}/admin/partners`),
          axios.get(`${apiUrl}/admin/revenues`),
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
        await axios.delete(`${apiUrl}/admin/partner/${partnerId}`);
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
  },
  computed: {
    headerStyle() {
      return {
        backgroundColor: this.$q.dark.isActive ? "#333" : "#1b89ff",
        color: this.$q.dark.isActive ? "#e0e0e0" : "white",
        fontWeight: "bold",
        textAlign: "center",
      };
    },
    pageClass() {
      return {
        "bg-dark text-light": this.$q.dark.isActive,
        "bg-light text-dark": !this.$q.dark.isActive,
      };
    },
    cardClass() {
      return {
        "bg-dark text-light": this.$q.dark.isActive,
        "bg-light text-dark": !this.$q.dark.isActive,
      };
    },
    titleClass() {
      return {
        "text-primary": !this.$q.dark.isActive,
        "text-white": this.$q.dark.isActive,
        "title-large": true, // Class to increase title size
      };
    },
  },
};
</script>

<style scoped>
/* Card responsiva */
.responsive-card {
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

/* Titoli responsivi */
.title-large {
  font-size: 4rem; /* Imposta una dimensione fissa per il titolo molto grande */
  font-weight: bold;
}

/* Stile per le tabelle */
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: center;
}

.custom-table tr:nth-child(even) {
  background-color: var(
    --q-dark-bg-secondary
  ); /* Alternanza righe in modalità scura */
}

.custom-table tr:hover {
  background-color: var(
    --q-dark-hover
  ); /* Evidenziazione riga in modalità scura */
}

/* Stile per i bottoni personalizzati */
.red-btn {
  background-color: #dc0602 !important;
  color: white !important;
  border: none;
  padding: 4px 8px;
  box-shadow: none;
}
</style>
