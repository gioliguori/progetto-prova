<template>
  <div id="map" style="height: 100vh"></div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { useRouter } from "vue-router";
import 'leaflet-control-geocoder';

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
        { position: [40.8522, 14.2681], name: "Partner1", page: "/page1" },
        { position: [40.86, 14.29], name: "Partner2", page: "/page2" },
        { position: [40.845, 14.25], name: "Partner3", page: "/page3" },
        { position: [40.835, 14.28], name: "Partner4", page: "/page4" },
      ];

      markers.forEach((marker) => {
        L.marker(marker.position)
          .addTo(map)
          .bindPopup(marker.name) // Mostra il popup al clic
          .bindTooltip(marker.name, {
            permanent: true,
            direction: "top",
            className: "marker-tooltip",
          }) // Mostra il tooltip
          .on("click", () => {
            router.push(marker.page); // Naviga alla pagina specificata
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
</style>
