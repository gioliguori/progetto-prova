<template>
  <div id="map" style="height: 100vh"></div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { useRouter } from "vue-router";
import "leaflet-control-geocoder";
import axios from "axios"; // Assicurati di avere axios installato

export default defineComponent({
  name: "MapComponent",
  setup() {
    const router = useRouter(); // Usa Vue Router per la navigazione

    onMounted(() => {
      // Inizializza la mappa e imposta la vista iniziale su Napoli
      const map = L.map("map").setView([40.8522, 14.2681], 13);

      // Aggiungi il layer delle tile della mappa
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Definisci i marker e le rispettive pagine a cui devono rimandare
      const markers = [
        { position: [40.8522, 14.2681], name: "Hotel Bella Vista", page: "/page1", id: "3397a676-3b87-11ef-9df2-a4bfcecd978d" },
        { position: [40.86, 14.29], name: "Partner2", page: "/page2", id: "2" },
        { position: [40.845, 14.25], name: "Partner3", page: "/page3", id: "3" },
        { position: [40.835, 14.28], name: "Partner4", page: "/page4", id: "4" },
      ];

      // Funzione per generare il contenuto del popup con le biciclette disponibili
      const createPopupContent = async (marker) => {
        const container = document.createElement("div");
        container.style.width = "300px"; // Imposta la larghezza del popup
        container.style.height = "200px"; // Imposta l'altezza del popup

        const title = document.createElement("h3");
        title.innerText = marker.name;
        container.appendChild(title);

        const bikeList = document.createElement("ul");

        try {
          const response = await axios.get(`/api/partners/${marker.id}/bikes`);
          const bikes = response.data;
          bikes.forEach(bike => {
            const listItem = document.createElement("li");
            listItem.innerText = `ID: ${bike.id}, Tipo: ${bike.type}, Stato: ${bike.state}`;
            bikeList.appendChild(listItem);
          });
        } catch (error) {
          console.error("Errore nel recuperare le biciclette:", error);
          const errorItem = document.createElement("li");
          errorItem.innerText = "Errore nel recuperare le biciclette.";
          bikeList.appendChild(errorItem);
        }

        container.appendChild(bikeList);

        const button1 = document.createElement("button");
        button1.innerText = "Azione 1";
        button1.addEventListener("click", () => {
          router.push(marker.page); // Naviga alla pagina specificata
        });
        container.appendChild(button1);

        const button2 = document.createElement("button");
        button2.innerText = "Azione 2";
        button2.addEventListener("click", () => {
          alert(`Azione 2 per ${marker.name}`);
        });
        container.appendChild(button2);

        // Aggiungi altri bottoni come necessario

        return container;
      };

      markers.forEach((marker) => {
        L.marker(marker.position)
          .addTo(map)
          .bindTooltip(marker.name, {
            permanent: true,
            direction: "top",
            className: "marker-tooltip",
          }) // Mostra il tooltip
          .on("click", async (e) => {
            const popupContent = await createPopupContent(marker);
            const popup = L.popup()
              .setLatLng(e.latlng)
              .setContent(popupContent)
              .openOn(map);
          });
      });

      // Ottenere la posizione in tempo reale dell'utente
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = [
              position.coords.latitude,
              position.coords.longitude,
            ];

            // Aggiungi un marker per la posizione dell'utente
            L.marker(userLocation)
              .addTo(map)
              .bindPopup("TU SEI QUI!")
              .bindTooltip("TU SEI QUI!", {
                permanent: true,
                direction: "top",
                className: "marker-tooltip",
              });

            // Centra la mappa sulla posizione dell'utente
            map.setView(userLocation, 13);
          },
          (error) => {
            console.error("Errore nella geolocalizzazione:", error);
          }
        );
      } else {
        console.error("Geolocation non è supportato da questo browser.");
      }

      // Aggiungi la barra di ricerca
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

    return {};
  },
});
</script>

<style scoped>
#map {
  height: 100vh; /* Imposta l'altezza della mappa per occupare tutta la viewport */
}

.marker-tooltip {
  background: white; /* Colore di sfondo della nuvoletta */
  color: black; /* Colore del testo */
  border-radius: 4px; /* Angoli arrotondati */
  padding: 4px; /* Spaziatura interna */
  font-size: 12px; /* Dimensione del testo */
  font-weight: bold; /* Grassetto per il testo */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* Ombra per la nuvoletta */
}

button {
  display: block;
  margin: 5px 0;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
