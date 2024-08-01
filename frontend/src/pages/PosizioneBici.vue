<template>
  <div>
    <div id="map" style="height: 100vh"></div>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">X</button>
        <h3>{{ modalContent.bike_id }}</h3>
        <ul>
          <li>
            Tipo: {{ modalContent.bike_type }}, Batteria:
            {{ modalContent.battery_level }}%, Stato: {{ modalContent.state }}
          </li>
        </ul>
        <button
          @click="handleBikeAction(modalContent.bike_id)"
          class="rent-button"
        >
          Noleggia
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "PosizioneBici",
  setup() {
    const router = useRouter();
    const showModal = ref(false);
    const modalContent = ref({
      bike_id: "",
      bike_type: "",
      battery_level: 0,
      state: "",
    });

    const openModal = (bike) => {
      modalContent.value = bike;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const handleBikeAction = (bikeId) => {
      localStorage.setItem("selectedBikeId", bikeId);
      router.push("/IstruzioniNoleggio");
    };

    onMounted(() => {
      const map = L.map("map").setView([40.8522, 14.2681], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const markers = L.markerClusterGroup();

      const fetchBikeLocations = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/bikes/localization"
          );
          const bikes = response.data;

          markers.clearLayers(); 

          bikes.forEach((bike) => {
            const tooltipText = `bici numero: ${bike.bike_id_partner} partner: ${bike.partner_name}`;
            const marker = L.marker([bike.latitude, bike.longitude])
              .bindTooltip(tooltipText, {
                permanent: true,
                direction: "top",
                className: "marker-tooltip",
              })
              .on("click", () => {
                openModal(bike);
              });

            markers.addLayer(marker);
          });

          map.addLayer(markers);
        } catch (error) {
          console.error("Errore nel recuperare le bici:", error);
        }
      };

      fetchBikeLocations();
      const intervalId = setInterval(fetchBikeLocations, 30000); // Esegui ogni 30 secondi

      return () => clearInterval(intervalId); // Pulisci l'intervallo quando il componente viene distrutto
    });

    return {
      showModal,
      modalContent,
      closeModal,
      handleBikeAction,
    };
  },
});
</script>

<style scoped>
#map {
  height: 100vh;
}

.marker-tooltip {
  background: white;
  color: black;
  border-radius: 4px;
  padding: 4px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  cursor: pointer;
}

.rent-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.rent-button:hover {
  background-color: #0056b3;
}
</style>
