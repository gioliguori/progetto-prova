<template>
  <q-page class="q-pa-sm full-page" :class="{ 'dark-mode': $q.dark.isActive }">
    <q-card class="q-pa-md full-height full-width">
      <q-card-section class="text-center">
        <div class="page-title">LISTA BICI DEL PARTNER</div>
      </q-card-section>
      <q-card-section>
        <q-markup-table class="q-mt-md custom-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>State</th>
              <th>Battery</th>
              <th>Rides</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bike in bikes" :key="bike.bike_id">
              <td class="center-text">{{ bike.bike_type }}</td>
              <td class="center-text">{{ bike.state }}</td>
              <td class="center-text">{{ bike.battery_level }}</td>
              <td class="center-text">{{ bike.count_run }}</td>
              <td class="center-text">
                <q-btn
                  color="negative"
                  label="Delete"
                  @click="deleteBike(bike.bike_id)"
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

export default {
  name: "DashboardPartner",
  data() {
    return {
      bikes: [],
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
        const bikesResponse = await axios.post(`${apiUrl}/partners/bikes`, {
          partnerId: this.partnerId,
        );

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
        await axios.delete(`${apiUrl}/partners/bike/${bikeId}`, {
          data: {
            partnerId: this.partnerId,
          },
        });
        this.bikes = this.bikes.filter((bike) => bike.bike_id !== bikeId);
        this.$q.notify({
          type: "positive",
          message: "Bike deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting bike:", error);
        this.$q.notify({ type: "negative", message: "An error occurred while deleting the bike" });
      }
    },
  },
};
</script>

<style scoped>
/* Impostazioni per la pagina completa */
.full-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff; /* Colore di sfondo predefinito (chiaro) */
}

.full-height {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.full-width {
  width: 100%;
}

/* Modalità scura */
.dark-mode {
  background-color: #121212; /* Sfondo scuro per la modalità scura */
}

.page-title {
  font-weight: bold;
  font-size: 1.5rem;
  color: #1b89ff; /* Colore del titolo in modalità chiara */
}

@media (min-width: 600px) {
  .page-title {
    font-size: 2rem;
  }
}

@media (min-width: 960px) {
  .page-title {
    font-size: 2.5rem;
  }
}

/* Stile per le tabelle */
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th, .custom-table td {
  padding: 8px;
  text-align: center; /* Centrare il testo nelle celle */
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
