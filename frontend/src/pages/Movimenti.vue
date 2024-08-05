<template>
  <q-page
    class="flex flex-center q-pa-md"
    :class="{ 'dark-mode': $q.dark.isActive }"
  >
    <div class="container text-center">
      <h1 class="page-title q-mb-md">Noleggi e Prenotazioni</h1>

      <div class="q-mb-md">
        <h2 class="section-title">La tua Prenotazione</h2>
        <div v-if="reservation.length">
          <q-markup-table class="custom-table">
            <thead>
              <tr>
                <th>ID Bici</th>
                <th>Nome Partner</th>
                <th>Data Inizio Prenotazione</th>
                <th>Data Scadenza</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in reservation" :key="row.reservation_id">
                <td>{{ row.bike_id_partner }}</td>
                <td>{{ row.partner_name }}</td>
                <td>{{ row.reservation_date }}</td>
                <td>{{ row.expiration_date }}</td>
                <td>
                  <q-btn
                    @click="rentBike(row.bike_id, row.reservation_id)"
                    label="Avvia Noleggio"
                    color="custom-color"
                    class="custom-btn"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div v-else>
          <p>Nessuna prenotazione trovata.</p>
        </div>
      </div>

      <div>
        <h2 class="section-title">Noleggi</h2>
        <q-markup-table class="custom-table">
          <thead>
            <tr>
              <th>Tipo Bici</th>
              <th>Nome Partner</th>
              <th>Data Inizio</th>
              <th>Data Fine</th>
              <th>Importo (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rentals" :key="row.rental_id">
              <td>{{ row.bike_type }}</td>
              <td>{{ row.partner_name }}</td>
              <td>{{ row.rental_start }}</td>
              <td>{{ row.rental_end }}</td>
              <td>{{ row.amount }}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <div v-if="activeRental">
          <q-btn
            @click="showPaymentPopup"
            label="Termina Noleggio"
            color="negative"
            class="q-mt-md"
          />
        </div>
      </div>

      <q-dialog v-model="paymentDialog">
        <q-card class="custom-card">
          <q-card-section class="text-center">
            <div class="text-h6">Come vuoi pagare?</div>
          </q-card-section>

          <q-card-section class="q-pt-none text-center">
            <q-btn
              @click="() => endRental('credit_card')"
              label="Carta di Credito"
              class="custom-btn q-mt-md"
            />
            <q-btn
              @click="() => endRental('paypal')"
              label="PayPal"
              class="custom-btn q-mt-md"
            />
            <q-btn
              @click="() => endRental('bank_transfer')"
              label="Bonifico"
              class="custom-btn q-mt-md"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Annulla" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  QMarkupTable,
  QBtn,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
} from "quasar";
import axios from "axios";
import apiUrl from "src/api-config"; // Importa apiUrl

export default defineComponent({
  name: "RentalsAndReservations",
  components: {
    QMarkupTable,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
  },
  setup() {
    const router = useRouter();
    const rentals = ref([]);
    const reservation = ref([]);
    const activeRental = ref(null);
    const paymentDialog = ref(false);
    const username = localStorage.getItem("username");

    onMounted(async () => {
      try {
        console.log(`Username: ${username}`);

        const rentalsResponse = await axios.get(
          `${apiUrl}/rental/user-rentals`,
          {
            params: { username },
          }
        );
        console.log("Rentals Response:", rentalsResponse.data);
        rentals.value = rentalsResponse.data;

        const reservationResponse = await axios.get(
          `${apiUrl}/rental/user-reservations`,
          {
            params: { username },
          }
        );
        console.log("Reservation Response:", reservationResponse.data);
        reservation.value = reservationResponse.data
          ? [reservationResponse.data]
          : [];

        activeRental.value = rentals.value.find((rental) => !rental.rental_end);
        console.log("Active Rental:", activeRental.value);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    });

    const rentBike = (bikeId, reservationId) => {
      console.log(
        `Avvio noleggio per la bici con ID: ${bikeId} e prenotazione con ID: ${reservationId}`
      );
      localStorage.setItem("bikeId", bikeId);
      localStorage.setItem("reservationId", reservationId);
      router.push({ path: "/IstruzioniNoleggio" });
    };

    const showPaymentPopup = () => {
      paymentDialog.value = true;
    };

    const endRental = async (paymentMethod) => {
      if (!activeRental.value) return;

      try {
        const response = await axios.post(`${apiUrl}/rental/end-rental`, {
          username,
          rentalId: activeRental.value.rental_id,
          paymentMethod,
        });

        if (response.data.success) {
          console.log(
            "Noleggio terminato con successo. Importo: €" + response.data.amount
          );
          paymentDialog.value = false;
          router.push("/movimenti");
        } else {
          console.error(
            "Errore nel terminare il noleggio:",
            response.data.message
          );
        }
      } catch (error) {
        console.error(
          "Errore nella chiamata API per terminare il noleggio:",
          error
        );
      }
    };

    const redirectTo = (method) => {
      endRental(method);
    };

    return {
      rentals,
      reservation,
      rentBike,
      activeRental,
      paymentDialog,
      showPaymentPopup,
      endRental,
      redirectTo,
    };
  },
});
</script>

<style scoped>
/* Modalità scura */
.dark-mode {
  background-color: #121212; /* Sfondo scuro per la modalità scura */
  color: #e0e0e0; /* Colore del testo in modalità scura */
}

.container {
  max-width: 100%;
  width: 100%;
  padding: 2rem;
}

.page-title {
  font-size: 3vw;
  font-weight: bold;
  color: #1b89ff; /* Colore del titolo */
}

.section-title {
  font-size: 2.5vw;
  font-weight: bold;
  color: #1b89ff; /* Colore del titolo */
  border-bottom: 2px solid #1b89ff; /* Divisore sotto il titolo */
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

/* Margini */
.q-mb-md {
  margin-bottom: 1rem;
}

.q-mt-md {
  margin-top: 1rem;
}

/* Tabella personalizzata */
.custom-table {
  width: 100%;
}

.custom-table th {
  background-color: #1b89ff; /* Colore di default per la modalità chiara */
  color: white;
  font-weight: bold;
}

/* Modalità scura per la tabella */
.dark-mode .custom-table th {
  background-color: #333; /* Sfondo scuro per l'intestazione della tabella */
  color: #e0e0e0; /* Colore del testo dell'intestazione */
}

.dark-mode .custom-table td {
  border: 1px solid #444; /* Bordo più scuro per le celle */
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

/* Pulsanti personalizzati */
.custom-btn {
  background-color: #1b89ff !important; /* Colore di default per i pulsanti */
  color: white !important;
  width: 100%;
  margin-bottom: 1rem;
}

/* Modalità scura per i pulsanti */
.dark-mode .custom-btn {
  background-color: #1b89ff !important; /* Colore di default per i pulsanti in modalità scura */
  color: white !important;
}

/* Card personalizzata */
.custom-card {
  max-width: 400px;
  width: 100%;
}

/* Modalità scura per le card */
.dark-mode .custom-card {
  background-color: #1e1e1e; /* Sfondo scuro per le card */
  color: #e0e0e0; /* Colore del testo per le card */
}
</style>
