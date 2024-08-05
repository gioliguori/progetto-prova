<template>
  <q-page class="q-pa-md" :class="{ 'dark-mode': $q.dark.isActive }">
    <div class="q-mb-lg text-center">
      <h2 class="page-title">MODIFICA BICI</h2>
    </div>
    <div class="q-pa-md">
      <div class="table-responsive">
        <table
          class="markup-table q-table q-table--flat q-table--square no-shadow"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Livello Batteria</th>
              <th>Stato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bike in bikes" :key="bike.bike_id">
              <td>{{ bike.bike_id }}</td>
              <td>{{ bike.bike_type }}</td>
              <td>{{ bike.battery_level }}</td>
              <td>
                <q-select
                  v-model="bike.state"
                  :options="stateOptions"
                  dense
                  outlined
                  @update:model-value="updateBikeState(bike)"
                ></q-select>
              </td>
              <td>
                <q-btn
                  flat
                  icon="delete"
                  color="negative"
                  @click="deleteBike(bike.bike_id)"
                ></q-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="text-center">
      <q-btn
        label="Apporta modifiche"
        color="primary"
        class="submit-btn"
        @click="submitChanges"
      ></q-btn>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { Dialog } from "quasar";
import apiUrl from "src/api-config"; // Importa apiUrl

export default {
  data() {
    return {
      bikes: [],
      stateOptions: [
        { label: "Disponibile", value: "disponibile" },
        { label: "In noleggio", value: "in noleggio" },
        { label: "Riservata", value: "riservata" },
        { label: "Dismessa", value: "dismessa" },
      ],
      modifiedBikes: [],
    };
  },
  methods: {
    async fetchBikes() {
      try {
        const partnerId = localStorage.getItem("partner_id");
        const response = await axios.post(`${apiUrl}api/partners/bikes`, {
          partnerId: partnerId,
        });
        if (response.data.success) {
          this.bikes = response.data.bikes;
        } else {
          Dialog.create({
            title: "Errore",
            message: "Failed to fetch bikes",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Dialog.create({
          title: "Errore",
          message: "An error occurred while fetching data",
        });
      }
    },
    updateBikeState(bike) {
      const existingBikeIndex = this.modifiedBikes.findIndex(
        (b) => b.bike_id === bike.bike_id
      );
      if (existingBikeIndex !== -1) {
        this.modifiedBikes[existingBikeIndex].state = bike.state;
      } else {
        this.modifiedBikes.push({ ...bike });
      }
    },
    async deleteBike(bikeId) {
      try {
        const partnerId = localStorage.getItem("partner_id");
        await axios.delete(`${apiUrl}/partners/bike/${bikeId}`, {
          data: {
            partnerId: partnerId,
          },
        });
        this.bikes = this.bikes.filter((bike) => bike.bike_id !== bikeId);
        this.modifiedBikes = this.modifiedBikes.filter(
          (bike) => bike.bike_id !== bikeId
        );
        Dialog.create({
          title: "Successo",
          message: "Bike deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting bike:", error);
        Dialog.create({
          title: "Errore",
          message: "An error occurred while deleting the bike",
        });
      }
    },
    async submitChanges() {
      try {
        const partnerId = localStorage.getItem("partner_id");
        const modifiedBikesPayload = this.modifiedBikes.map((bike) => ({
          bike_id: bike.bike_id,
          state: bike.state.value ? bike.state.value : bike.state,
        }));
        const response = await axios.put(
          `${apiUrl}/partners/update-state/bikes`,
          { partnerId: partnerId, bikes: modifiedBikesPayload }
        );
        if (response.data.success) {
          Dialog.create({
            title: "Successo",
            message: "Cambiamenti avvenuti!",
          });
          this.modifiedBikes = [];
          this.fetchBikes();
        } else {
          Dialog.create({
            title: "Errore",
            message: "Errore!",
          });
        }
      } catch (error) {
        console.error("Error submitting changes:", error);
        Dialog.create({
          title: "Errore",
          message: "An error occurred while submitting changes",
        });
      }
    },
  },
  created() {
    this.fetchBikes();
  },
};
</script>

<style scoped>
/* Modalità scura */
.dark-mode {
  background-color: #121212; /* Sfondo scuro per la modalità scura */
  color: #e0e0e0; /* Colore del testo in modalità scura */
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

.markup-table {
  width: 100%;
  border-collapse: collapse;
}

.markup-table thead tr {
  background-color: #1b89ff; /* Colore di default per la modalità chiara */
  color: white;
}

.markup-table th,
.markup-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.table-responsive {
  overflow-x: auto;
}

.submit-btn {
  font-size: 1.2rem;
  padding: 0.75rem 1.5rem;
}

/* Modalità scura per la tabella */
.dark-mode .markup-table thead tr {
  background-color: #333; /* Sfondo scuro per l'intestazione della tabella */
  color: #e0e0e0; /* Colore del testo dell'intestazione */
}

.dark-mode .markup-table th,
.dark-mode .markup-table td {
  border: 1px solid #444; /* Bordo più scuro per le celle */
}

.dark-mode .markup-table tr:nth-child(even) {
  background-color: #1e1e1e; /* Grigio scuro per righe pari in modalità scura */
}

.dark-mode .markup-table tr:nth-child(odd) {
  background-color: #000; /* Nero per righe dispari in modalità scura */
}

.dark-mode .markup-table tr:hover {
  background-color: #444; /* Grigio scuro al passaggio del mouse in modalità scura */
}
</style>
