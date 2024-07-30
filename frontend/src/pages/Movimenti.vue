<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="container text-center">
      <h2 class="q-mb-md">Noleggi e Prenotazioni</h2>

      <div class="q-mb-md">
        <h3>Noleggi</h3>
        <q-table
          :rows="rentals"
          :columns="rentalColumns"
          row-key="rental_id"
          no-data-label="Nessun noleggio trovato"
        />
        <div v-if="activeRental">
          <q-btn
            @click="showPaymentPopup"
            label="Termina Noleggio"
            color="negative"
            class="q-mt-md"
          />
        </div>
      </div>

      <div>
        <h3>La tua Prenotazione</h3>
        <div v-if="reservation.length">
          <q-table
            :rows="reservation"
            :columns="reservationColumns"
            row-key="reservation_id"
            no-data-label="Nessuna prenotazione trovata"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  @click="rentBike(props.row.bike_id)"
                  label="Avvia Noleggio"
                  color="primary"
                />
              </q-td>
            </template>
          </q-table>
        </div>
        <div v-else>
          <p>Nessuna prenotazione trovata.</p>
        </div>
      </div>

      <q-dialog v-model="paymentDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Come vuoi pagare?</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-btn
              @click="redirectTo('creditCard')"
              label="Carta di Credito"
              color="primary"
              class="q-mt-md"
            />
            <q-btn
              @click="redirectTo('paypal')"
              label="PayPal"
              color="primary"
              class="q-mt-md"
            />
            <q-btn
              @click="redirectTo('bankTransfer')"
              label="Bonifico"
              color="primary"
              class="q-mt-md"
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
  QTable,
  QBtn,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QTd,
} from "quasar";
import axios from "axios";

export default defineComponent({
  name: "RentalsAndReservations",
  components: {
    QTable,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
    QTd,
  },
  setup() {
    const router = useRouter();
    const rentals = ref([]);
    const reservation = ref([]);
    const activeRental = ref(null);
    const paymentDialog = ref(false);
    const username = localStorage.getItem("username"); // Recupera l'username dal local storage

    const rentalColumns = [
      {
        name: "bike_type",
        align: "left",
        label: "Tipo Bici",
        field: "bike_type",
      },
      {
        name: "partner_name",
        align: "left",
        label: "Nome Partner",
        field: "partner_name",
      },
      {
        name: "rental_start",
        align: "left",
        label: "Data Inizio",
        field: "rental_start",
      },
      {
        name: "rental_end",
        align: "left",
        label: "Data Fine",
        field: "rental_end",
      },
      { name: "amount", align: "left", label: "Importo (€)", field: "amount" },
    ];

    const reservationColumns = [
      {
        name: "bike_id_partner",
        align: "left",
        label: "ID Bici",
        field: "bike_id_partner",
      },
      {
        name: "partner_name",
        align: "left",
        label: "Nome Partner",
        field: "partner_name",
      },
      {
        name: "reservation_date",
        align: "left",
        label: "Data Inizio Prenotazione",
        field: "reservation_date",
      },
      {
        name: "expiration_date",
        align: "left",
        label: "Data Scadenza",
        field: "expiration_date",
      },
      {
        name: "actions",
        align: "right",
        label: "Azioni",
        field: "actions",
        sortable: false,
        style: "padding-right: 20px;",
      },
    ];

    onMounted(async () => {
      try {
        console.log(`Username: ${username}`);

        const rentalsResponse = await axios.get(
          "http://localhost:3000/api/rental/user-rentals",
          {
            params: { username },
          }
        );
        console.log("Rentals Response:", rentalsResponse.data);
        rentals.value = rentalsResponse.data;

        const reservationResponse = await axios.get(
          "http://localhost:3000/api/rental/user-reservations",
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

    const rentBike = (bikeId) => {
      console.log(`Avvio noleggio per la bici con ID: ${bikeId}`);
      router.push({ path: "/istruzioni-noleggio", query: { bikeId } });
    };

    const showPaymentPopup = () => {
      paymentDialog.value = true;
    };

    const redirectTo = (method) => {
      let url = "";
      switch (method) {
        case "creditCard":
          url = "/pagamento/carta-di-credito";
          break;
        case "paypal":
          url = "/pagamento/paypal";
          break;
        case "bankTransfer":
          url = "/pagamento/bonifico";
          break;
      }
      console.log(`Redirecting to: ${url}`);
      router.push(url);
    };

    return {
      rentals,
      reservation,
      rentalColumns,
      reservationColumns,
      rentBike,
      activeRental,
      paymentDialog,
      showPaymentPopup,
      redirectTo,
    };
  },
});
</script>

<style scoped>
.container {
  max-width: 800px;
  width: 100%;
  padding: 2rem;
}

h2,
h3 {
  font-weight: bold;
}

.q-mb-md {
  margin-bottom: 1rem;
}

.q-mt-md {
  margin-top: 1rem;
}
</style>
