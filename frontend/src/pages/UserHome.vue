Ecco il codice con i commenti aggiunti alle parti più importanti: ```html
<template>
  <div>
    <!-- Mappa a schermo intero -->
    <div id="map" style="height: 100vh"></div>
    <!-- Modale per visualizzare le bici di un partner -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">X</button>
        <h3>{{ modalContent.name }}</h3>
        <ul>
          <li
            v-for="bike in modalContent.bikes"
            :key="bike.bike_id"
            class="bike-item"
          >
            <span>
              Tipo: {{ bike.bike_type }}, Batteria: {{ bike.battery_level }}%
            </span>
            <div class="buttons-container">
              <!-- Bottone per noleggiare una bici -->
              <button
                @click="handleBikeAction(bike.bike_id)"
                class="rent-button"
              >
                Noleggia
              </button>
              <!-- Bottone per prenotare una bici -->
              <button
                @click="handleBikeReservation(bike.bike_id)"
                class="reserve-button"
              >
                Prenota
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- Modale di errore -->
    <div
      v-if="showErrorModal"
      class="modal-overlay"
      @click.self="closeErrorModal"
    >
      <div class="modal-content error-modal-content">
        <button class="close-button" @click="closeErrorModal">X</button>
        <h3>Errore</h3>
        <p>{{ errorMessage }}</p>
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
import apiUrl from "src/api-config";
import partnerMarkerImage from "src/assets/red-marker-icon.png";
import currentPositionMarkerImage from "src/assets/marker-posizione-attuale.png";

export default defineComponent({
  name: "UserHome",
  setup() {
    const router = useRouter();
    const showModal = ref(false);
    const showErrorModal = ref(false);
    const modalContent = ref({ name: "", bikes: [], page: "" });
    const errorMessage = ref("");
    localStorage.removeItem("reservationId");

    // Funzione per aprire il modale
    const openModal = (content) => {
      modalContent.value = content;
      showModal.value = true;
    };

    // Funzione per chiudere il modale
    const closeModal = () => {
      showModal.value = false;
    };

    // Funzione per chiudere il modale di errore
    const closeErrorModal = () => {
      showErrorModal.value = false;
    };

    // Funzione per gestire l'azione di noleggio di una bici
    const handleBikeAction = (bikeId) => {
      localStorage.setItem("bikeId", bikeId);
      console.log("Bike ID salvato nel local storage:", bikeId);
      router.push({ path: "/RentalInstructions" });
    };

    // Funzione per gestire la prenotazione di una bici
    const handleBikeReservation = async (bikeId) => {
      const username = localStorage.getItem("username");

      try {
        const response = await axios.post(
          `${apiUrl}/rental/create-reservation`,
          {
            username,
            bikeId,
          }
        );

        if (response.data.success) {
          console.log("Prenotazione avvenuta con successo!");
          router.push("/UserRentals");
        } else {
          console.error("Errore nella prenotazione:", response.data.message);
        }
      } catch (error) {
        console.error(
          "Errore nella richiesta di prenotazione:",
          error.response.data.message
        );
        errorMessage.value = error.response.data.message;
        showErrorModal.value = true;
      }
    };

    // Funzione eseguita quando il componente viene montato
    onMounted(async () => {
      // Inizializza la mappa
      const map = L.map("map").setView([40.8522, 14.2681], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Crea il contenuto del popup per un marker
      const createPopupContent = async (marker) => {
        const content = {
          name: marker.name,
          bikes: [],
          page: marker.page,
        };

        try {
          const response = await axios.post(`${apiUrl}/user/bikes`, {
            partnerId: marker.id,
          });
          content.bikes = response.data.bikes;
        } catch (error) {
          console.error("Errore nel recuperare le biciclette:", error);
        }

        return content;
      };

      // Recupera i partner e aggiunge i marker sulla mappa
      try {
        const response = await axios.get(`${apiUrl}/admin/partners`);
        const partners = response.data.partners;

        const partnerIcon = L.icon({
          iconUrl: partnerMarkerImage,
          iconSize: [30, 30], // dimensioni personalizzate
          iconAnchor: [19, 38], // punto dell'icona che sarà posizionato sul marker
          popupAnchor: [0, -38], // punto da cui apparirà il popup rispetto all'icona
        });

        partners.forEach((partner) => {
          const marker = {
            position: [partner.latitude, partner.longitude],
            name: partner.partner_name,
            page: `/page${partner.partner_id}`,
            id: partner.partner_id,
          };

          L.marker(marker.position, { icon: partnerIcon })
            .addTo(map)
            .bindTooltip(marker.name, {
              permanent: true,
              direction: "bottom",
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

      // Geolocalizzazione dell'utente
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = [
              position.coords.latitude,
              position.coords.longitude,
            ];

            const currentPositionIcon = L.icon({
              iconUrl: currentPositionMarkerImage,
              iconSize: [25, 25], // dimensioni personalizzate
              iconAnchor: [19, 38], // punto dell'icona che sarà posizionato sul marker
              popupAnchor: [0, -38], // punto da cui apparirà il popup rispetto all'icona
            });

            L.marker(userLocation, { icon: currentPositionIcon })
              .addTo(map)
              .bindPopup("TU SEI QUI!")
              .bindTooltip("TU SEI QUI!", {
                permanent: true,
                direction: "bottom",
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

      // Aggiunge il geocoder alla mappa
      const geocoder = L.Control.Geocoder.nominatim();
      L.Control.geocoder({
        defaultMarkGeocode: false,
      })
        .on("markgeocode", function (e) {
          const bbox = e.geocode.bbox;
          const center = e.geocode.center;
          L.marker(center, { icon: partnerIcon })
            .addTo(map)
            .bindPopup(e.geocode.name)
            .openPopup();
          map.fitBounds(bbox);
        })
        .addTo(map);
    });

    return {
      showModal,
      showErrorModal,
      modalContent,
      errorMessage,
      closeModal,
      closeErrorModal,
      handleBikeAction,
      handleBikeReservation,
    };
  },
});
</script>

<style scoped>
#map {
  height: 100vh;
}

/* Tooltip del marker */
.marker-tooltip {
  background: white;
  color: black;
  border-radius: 4px;
  padding: 4px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

/* Modal content */
.modal-content {
  background: #fff;
  color: #000;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  transform: translateY(0);
}

.modal-content h3 {
  margin-top: 0;
  font-size: 24px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.modal-content ul {
  list-style: none;
  padding: 0;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff5f5f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #ff3f3f;
}

/* Item della bici */
.bike-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.bike-item span {
  flex: 1;
  font-size: 16px;
}

/* Contenitore dei bottoni */
.buttons-container {
  display: flex;
  gap: 10px; /* Spazio tra i bottoni */
}

.rent-button,
.reserve-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.rent-button:hover,
.reserve-button:hover {
  background-color: #0056b3;
}

/* Modale di errore */
.error-modal-content {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.error-modal-content h3 {
  margin-top: 0;
  font-size: 24px;
  border-bottom: 2px solid #721c24;
  padding-bottom: 10px;
}

.error-modal-content p {
  font-size: 16px;
}

/* Stili per i pop-up di Leaflet */
.leaflet-popup {
  background: #fff;
  color: #000;
  border-radius: 5px;
  padding: 10px;
}

.leaflet-popup-content-wrapper {
  background: #fff;
  color: #000;
}

.leaflet-popup-tip {
  background: #fff;
}
</style>
```
