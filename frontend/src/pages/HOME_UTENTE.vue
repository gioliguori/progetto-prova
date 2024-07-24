<template>
  <div>
    <div id="map" style="height: 100vh"></div>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">X</button>
        <h3>{{ modalContent.name }}</h3>
        <ul>
          <li v-for="bike in modalContent.bikes" :key="bike.bike_id" class="bike-item">
            <span>Tipo: {{ bike.bike_type }}, Batteria: {{ bike.battery_level }}%</span>
            <button @click="handleBikeAction(bike.bike_id)" class="rent-button">Noleggia</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { useRouter } from "vue-router";
import "leaflet-control-geocoder";
import axios from "axios";

export default defineComponent({
  name: "MapComponent",
  setup() {
    const router = useRouter();
    const showModal = ref(false);
    const modalContent = ref({ name: "", bikes: [], page: "" });

    const openModal = (content) => {
      modalContent.value = content;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const handleBikeAction = (bikeId) => {
      localStorage.setItem("selectedBikeId", bikeId);
      router.push("/IstruzioniNoleggio");
    };

    onMounted(async () => {
      const map = L.map("map").setView([40.8522, 14.2681], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const createPopupContent = async (marker) => {
        const content = {
          name: marker.name,
          bikes: [],
          page: marker.page,
        };

        try {
          const response = await axios.post(
            "http://localhost:3000/api/user/bikes",
            { partnerId: marker.id }
          );
          content.bikes = response.data.bikes;
        } catch (error) {
          console.error("Errore nel recuperare le biciclette:", error);
        }

        return content;
      };

      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/partners"
        );
        const partners = response.data.partners;

        partners.forEach((partner) => {
          const marker = {
            position: [partner.latitude, partner.longitude],
            name: partner.partner_name,
            page: `/page${partner.partner_id}`,
            id: partner.partner_id,
          };

          L.marker(marker.position)
            .addTo(map)
            .bindTooltip(marker.name, {
              permanent: true,
              direction: "top",
              className: "marker-tooltip",
            })
            .on("click", async () => {
              const content = await createPopupContent(marker);
              openModal(content);
            });
        });
      } catch (error) {
        console.error("Errore nel recuperare i partner:", error);
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = [
              position.coords.latitude,
              position.coords.longitude,
            ];

            L.marker(userLocation)
              .addTo(map)
              .bindPopup("TU SEI QUI!")
              .bindTooltip("TU SEI QUI!", {
                permanent: true,
                direction: "top",
                className: "marker-tooltip",
              });

            map.setView(userLocation, 13);
          },
          (error) => {
            console.error("Errore nella geolocalizzazione:", error);
          }
        );
      } else {
        console.error("Geolocation non è supportato da questo browser.");
      }

      const geocoder = L.Control.Geocoder.nominatim();
      L.Control.geocoder({
        defaultMarkGeocode: false,
      })
        .on("markgeocode", function (e) {
          const bbox = e.geocode.bbox;
          const center = e.geocode.center;
          L.marker(center).addTo(map).bindPopup(e.geocode.name).openPopup();
          map.fitBounds(bbox);
        })
        .addTo(map);
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

.bike-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
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
