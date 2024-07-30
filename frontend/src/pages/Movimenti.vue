<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="container text-center">
      <h2 class="q-mb-md">Noleggi e Prenotazioni</h2>

      <div class="q-mb-md">
        <h3>Noleggi</h3>
        <q-table
          :rows="rentals"
          :columns="rentalColumns"
          row-key="id"
          no-data-label="Nessun noleggio trovato"
        />
        <div v-if="activeRental">
          <q-btn @click="showPaymentPopup" label="Termina Noleggio" color="negative" class="q-mt-md" />
        </div>
      </div>

      <div>
        <h3>La tua Prenotazione</h3>
        <div v-if="reservation">
          <q-table
            :rows="[reservation]"
            :columns="reservationColumns"
            row-key="id"
            no-data-label="Nessuna prenotazione trovata"
          />
          <q-btn @click="rentBike(reservation.bikeId)" label="Avvia Noleggio" color="primary" class="q-mt-md" />
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
            <q-btn @click="redirectTo('creditCard')" label="Carta di Credito" color="primary" class="q-mt-md" />
            <q-btn @click="redirectTo('paypal')" label="PayPal" color="primary" class="q-mt-md" />
            <q-btn @click="redirectTo('bankTransfer')" label="Bonifico" color="primary" class="q-mt-md" />
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
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { QTable, QBtn, QDialog, QCard, QCardSection, QCardActions } from 'quasar';
import axios from 'axios';

export default defineComponent({
  name: 'RentalsAndReservations',
  components: {
    QTable,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
    QCardActions
  },
  setup() {
    const router = useRouter();
    const rentals = ref([]);
    const reservation = ref(null);
    const activeRental = ref(null);
    const paymentDialog = ref(false);

    const rentalColumns = [
      { name: 'id', align: 'left', label: 'ID Noleggio', field: 'id' },
      { name: 'bikeId', align: 'left', label: 'ID Bici', field: 'bikeId' },
      { name: 'userId', align: 'left', label: 'ID Utente', field: 'userId' },
      { name: 'startDate', align: 'left', label: 'Data Inizio', field: 'startDate' },
      { name: 'endDate', align: 'left', label: 'Data Fine', field: 'endDate' }
    ];

    const reservationColumns = [
      { name: 'id', align: 'left', label: 'ID Prenotazione', field: 'id' },
      { name: 'bikeId', align: 'left', label: 'ID Bici', field: 'bikeId' },
      { name: 'userId', align: 'left', label: 'ID Utente', field: 'userId' },
      { name: 'reservationDate', align: 'left', label: 'Data Prenotazione', field: 'reservationDate' }
    ];

    onMounted(async () => {
      try {
        const rentalsResponse = await axios.get('/api/rentals');
        rentals.value = rentalsResponse.data;

        const reservationResponse = await axios.get('/api/reservation');
        reservation.value = reservationResponse.data || null;

        activeRental.value = rentals.value.find(rental => !rental.endDate);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    });

    const rentBike = (bikeId) => {
      console.log(`Avvio noleggio per la bici con ID: ${bikeId}`);
      router.push({ path: '/istruzioni-noleggio', query: { bikeId } });
    };

    const showPaymentPopup = () => {
      paymentDialog.value = true;
    };

    const redirectTo = (method) => {
      let url = '';
      switch (method) {
        case 'creditCard':
          url = '/pagamento/carta-di-credito';
          break;
        case 'paypal':
          url = '/pagamento/paypal';
          break;
        case 'bankTransfer':
          url = '/pagamento/bonifico';
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
      redirectTo
    };
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
  width: 100%;
  padding: 2rem;
}

h2, h3 {
  font-weight: bold;
}

.q-mb-md {
  margin-bottom: 1rem;
}

.q-mt-md {
  margin-top: 1rem;
}
</style>
