<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-md responsive-card">
      <q-card-section class="text-center">
        <div class="responsive-title">LISTA BICI</div>
      </q-card-section>
      <q-card-section>
        <!-- Tabella delle Bici -->
        <q-markup-table class="q-mt-md custom-table" :class="{ 'dark-mode': $q.dark.isActive }">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.name" :style="headerStyle">
                {{ col.label }}
              </th>
              <th :style="headerStyle">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in bikes" :key="row.bike_id">
              <td v-for="col in columns" :key="col.name" class="center-text">
                {{ row[col.field] }}
              </td>
              <td class="center-text">
                <q-btn
                  color="negative"
                  label="Delete"
                  @click="deleteBike(row.bike_id)"
                  class="red-btn"
                />
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
import apiUrl from "src/api-config"; // Importa apiUrl

export default {
  name: "BikeList",
  data() {
    return {
      bikes: [],
      columns: [
        { name: "bike_type", label: "Type", align: "left", field: "bike_type" },
        { name: "partner_name", label: "Partner Name", align: "left", field: "partner_name" },
        { name: "state", label: "State", align: "left", field: "state" },
        { name: "battery_level", label: "Battery", align: "left", field: "battery_level" },
        { name: "count_run", label: "Rides", align: "left", field: "count_run" },
        { name: "actions", label: "Actions", align: "center", field: "actions", required: true, sortable: false },
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
        const bikesResponse = await axios.get(`${apiUrl}/admin/bikes`);

        Loading.hide();

        if (bikesResponse.data.success) {
          this.bikes = bikesResponse.data.bikes;
        } else {
          this.$q.notify({ type: "negative", message: "Failed to fetch bikes" });
        }
      } catch (error) {
        Loading.hide();
        console.error("Error fetching data:", error);
        this.$q.notify({ type: "negative", message: "An error occurred while fetching data" });
      }
    },
    async deleteBike(bikeId) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/bike/${bikeId}`);
        this.bikes = this.bikes.filter((bike) => bike.bike_id !== bikeId);
        this.$q.notify({ type: "positive", message: "Bike deleted successfully" });
      } catch (error) {
        console.error("Error deleting bike:", error);
        this.$q.notify({ type: "negative", message: "An error occurred while deleting the bike" });
      }
    },
  },
  computed: {
    headerStyle() {
      return {
        backgroundColor: this.$q.dark.isActive ? '#333' : '#1b89ff',
        color: this.$q.dark.isActive ? '#e0e0e0' : 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      };
    }
  }
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
.responsive-title {
  font-size: 4vw; /* Dimensione del titolo che si adatta alla larghezza della pagina */
  font-weight: bold;
  color: #1b89ff; /* Colore del titolo */
}

/* Stile per le tabelle */
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th, .custom-table td {
  padding: 8px;
  text-align: center;  /* Centrare il testo nelle celle */
}

.custom-table th {
  background-color: #1b89ff; /* Colore di default per la modalità chiara */
  color: white;
  font-weight: bold;
}

/* Modalità scura */
.dark-mode .custom-table th {
  background-color: #333;
  color: #e0e0e0;
}

.dark-mode .custom-table tr:nth-child(even) {
  background-color: #1e1e1e; /* Grigio scuro per righe pari in modalità scura */
}

.dark-mode .custom-table tr:nth-child(odd) {
  background-color: #000; /* Nero per righe dispari in modalità scura */
}

.dark-mode .custom-table tr:hover {
  background-color: #444; /* Grigio scuro al passaggio del mouse in modalità scura */
}

/* Stile per i bottoni personalizzati */
.red-btn {
  background-color: #dc0602 !important; /* Colore rosso */
  color: white !important;
  border: none;
  padding: 4px 8px; /* Aumenta lo spazio interno del bottone */
  box-shadow: none;
}
</style>
