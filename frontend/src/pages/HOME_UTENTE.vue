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
import axios from "axios";

export default defineComponent({
  name: "MapComponent",
  setup() {
    const router = useRouter();

    onMounted(async () => {
      const map = L.map("map").setView([40.8522, 14.2681], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const createPopupContent = async (marker) => {
        const container = document.createElement("div");
        container.style.width = "300px";
        container.style.height = "200px";

        const title = document.createElement("h3");
        title.innerText = marker.name;
        container.appendChild(title);

        const bikeList = document.createElement("ul");

        try {
          const response = await axios.get(
            `http://localhost:3000/api/admin/partners/${marker.id}/bikes`
          );
          const bikes = response.data;
          bikes.forEach((bike) => {
            const listItem = document.createElement("li");
            listItem.innerText = `ID: ${bike.bike_id}, Tipo: ${bike.bike_type}, Stato: ${bike.state}`;
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
          router.push(marker.page);
        });
        container.appendChild(button1);

        const button2 = document.createElement("button");
        button2.innerText = "Azione 2";
        button2.addEventListener("click", () => {
          alert(`Azione 2 per ${marker.name}`);
        });
        container.appendChild(button2);

        return container;
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
            .on("click", async (e) => {
              const popupContent = await createPopupContent(marker);
              const popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(popupContent)
                .openOn(map);
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

    return {};
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
