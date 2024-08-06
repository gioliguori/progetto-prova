const express = require("express");
const router = express.Router();
const knex = require("../knexfile");

// Endpoint per creare una prenotazione
router.post("/create-reservation", async (req, res) => {
  const { username, bikeId } = req.body;

  // Log della richiesta di prenotazione ricevuta
  console.log(
    `Richiesta di prenotazione ricevuta: username=${username}, bikeId=${bikeId}`
  );

  try {
    // Verifica se l'utente esiste nel database
    const user = await knex("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

    // Verifica se l'utente ha già una prenotazione attiva
    const activeReservation = await knex("reservations")
      .where("user_id", user.user_id)
      .andWhere("status", "active")
      .first();

    if (activeReservation) {
      console.log(
        `Prenotazione attiva trovata per l'utente: username=${username}, reservation_id=${activeReservation.reservation_id}`
      );
      return res
        .status(400)
        .json({ success: false, message: "Hai già una prenotazione attiva." });
    }

    // Imposta la data di scadenza della prenotazione (15 minuti nel futuro)
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15);

    // Crea una nuova prenotazione
    await knex("reservations").insert({
      user_id: user.user_id,
      bike_id: bikeId,
      expiration_date: expirationDate,
    });

    // Aggiorna lo stato della bici a "riservata"
    await knex("bikes").where("bike_id", bikeId).update({ state: "riservata" });

    // Log della creazione della prenotazione
    console.log(
      `Prenotazione creata per l'utente ${username} e la bici ${bikeId}. Scadenza: ${expirationDate}`
    );

    // Risposta di successo
    res.json({ success: true, message: "Prenotazione avvenuta con successo." });
  } catch (error) {
    console.error("Errore durante la creazione della prenotazione:", error);
    res.status(500).json({ success: false, message: "Errore del server." });
  }
});

// Endpoint per creare un noleggio
router.post("/create-rental", async (req, res) => {
  const { username, bikeId, reservationId } = req.body;

  // Log della richiesta di noleggio ricevuta
  console.log(
    `Richiesta di noleggio ricevuta: username=${username}, bikeId=${bikeId}, reservationId=${reservationId}`
  );

  try {
    // Verifica se l'utente esiste nel database
    const user = await knex("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

    // Verifica se l'utente ha già un noleggio attivo
    const activeRental = await knex("rentals")
      .where("user_id", user.user_id)
      .andWhere("rental_end", null)
      .first();

    if (activeRental) {
      console.log(
        `Esiste già un noleggio attivo per l'utente: username=${username}`
      );
      return res
        .status(400)
        .json({ success: false, message: "Hai già un noleggio attivo." });
    }

    // Crea il nuovo noleggio
    const rental = {
      user_id: user.user_id,
      bike_id: bikeId,
      rental_type: "hourly",
      reservation_id: reservationId || null,
      amount: 0,
    };

    // Inserisce il nuovo noleggio nel database
    await knex("rentals").insert(rental);

    // Aggiorna lo stato della bici a "in noleggio"
    await knex("bikes")
      .where("bike_id", bikeId)
      .update({ state: "in noleggio" });

    // Se esiste una prenotazione, la imposta come scaduta
    if (reservationId) {
      await knex("reservations")
        .where("reservation_id", reservationId)
        .update({ status: "expired" });
      console.log(`Prenotazione ${reservationId} impostata come expired.`);
    }

    // Log della creazione del noleggio
    console.log(
      `Noleggio creato per l'utente ${username} e la bici ${bikeId}.`
    );

    // Risposta di successo
    res.json({ success: true, message: "Noleggio avviato con successo." });
  } catch (error) {
    console.error("Errore durante la creazione del noleggio:", error);
    res.status(500).json({ success: false, message: "Errore del server." });
  }
});

// Endpoint per terminare un noleggio
router.post("/end-rental", async (req, res) => {
  const { username, rentalId, paymentMethod } = req.body;

  // Log della richiesta di chiusura noleggio ricevuta
  console.log(
    `Richiesta di chiusura noleggio ricevuta: username=${username}, rentalId=${rentalId}, paymentMethod=${paymentMethod}`
  );

  const trx = await knex.transaction();

  try {
    // Verifica se l'utente esiste nel database
    const user = await trx("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      await trx.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

    // Verifica se esiste un noleggio attivo per l'utente
    const rental = await trx("rentals")
      .where("rental_id", rentalId)
      .andWhere("user_id", user.user_id)
      .andWhere("rental_end", null)
      .first();

    if (!rental) {
      console.log(
        `Noleggio attivo non trovato per l'utente: username=${username}`
      );
      await trx.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Noleggio attivo non trovato." });
    }

    // Calcola la durata del noleggio in minuti
    const rentalEnd = new Date();
    const rentalStart = new Date(rental.rental_start);
    const durationMinutes = Math.ceil((rentalEnd - rentalStart) / (1000 * 60));

    // Calcola l'importo da pagare per il noleggio
    const amount = 1 + 0.1 * durationMinutes;

    // Aggiorna il noleggio nel database con la data di fine e l'importo
    await trx("rentals").where("rental_id", rentalId).update({
      rental_end: rentalEnd,
      amount: amount,
    });

    // Aggiorna lo stato della bici a "disponibile" e incrementa il conteggio dei noleggi
    await trx("bikes")
      .where("bike_id", rental.bike_id)
      .update({
        state: "disponibile",
        count_run: trx.raw("count_run + 1"),
      });

    // Imposta il metodo di pagamento
    const finalPaymentMethod =
      paymentMethod === "bank_transfer" ? "other" : paymentMethod;

    // Registra il pagamento nel database
    await trx("payments").insert({
      rental_id: rentalId,
      user_id: user.user_id,
      amount: amount,
      payment_method: finalPaymentMethod,
    });

    // Commit della transazione
    await trx.commit();

    // Log della chiusura del noleggio
    console.log(
      `Noleggio terminato per l'utente ${username}. Importo: €${amount}`
    );

    // Risposta di successo
    res.json({
      success: true,
      message: "Noleggio terminato con successo.",
      amount,
    });
  } catch (error) {
    console.error("Errore durante la chiusura del noleggio:", error);
    await trx.rollback();
    res.status(500).json({ success: false, message: "Errore del server." });
  }
});

// Funzione di formattazione delle date
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

// Endpoint per ottenere i noleggi di un utente
router.get("/user-rentals", async (req, res) => {
  const { username } = req.query;

  // Log della richiesta per i noleggi dell'utente
  console.log(`Richiesta ricevuta per i noleggi dell'utente: ${username}`);

  try {
    // Verifica se l'utente esiste nel database
    const user = await knex("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

    // Recupera i noleggi dell'utente dal database
    const rentals = await knex("rentals")
      .join("bikes", "rentals.bike_id", "bikes.bike_id")
      .join("partners", "bikes.partner_id", "partners.partner_id")
      .select(
        "rentals.rental_id",
        "bikes.bike_type",
        "partners.partner_name",
        "rentals.rental_start",
        "rentals.rental_end",
        "rentals.amount"
      )
      .where("rentals.user_id", user.user_id)
      .orderBy("rentals.rental_start", "desc");

    // Format the rentals data
    const formattedRentals = rentals.map((rental) => ({
      rental_id: rental.rental_id,
      bike_type: rental.bike_type,
      partner_name: rental.partner_name,
      rental_start: formatDate(rental.rental_start),
      rental_end: rental.rental_end ? formatDate(rental.rental_end) : null,
      amount: rental.amount.toFixed(2),
    }));

    // Log dei noleggi trovati
    console.log(`Noleggi trovati: ${JSON.stringify(formattedRentals)}`);
    res.json(formattedRentals);
  } catch (error) {
    console.error("Errore nel recupero dei noleggi:", error);
    res.status(500).json({ success: false, message: "Errore del server." });
  }
});

// Endpoint per ottenere le prenotazioni di un utente
router.get("/user-reservations", async (req, res) => {
  const { username } = req.query;

  // Log della richiesta per le prenotazioni dell'utente
  console.log(
    `Richiesta ricevuta per le prenotazioni dell'utente: ${username}`
  );

  try {
    // Verifica se l'utente esiste nel database
    const user = await knex("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

    // Recupera la prenotazione attiva dell'utente dal database
    const reservation = await knex("reservations")
      .join("bikes", "reservations.bike_id", "bikes.bike_id")
      .join("partners", "bikes.partner_id", "partners.partner_id")
      .select(
        "reservations.reservation_id",
        "bikes.bike_id",
        "bikes.bike_id_partner",
        "partners.partner_name",
        "reservations.reservation_date",
        "reservations.expiration_date"
      )
      .where("reservations.user_id", user.user_id)
      .andWhere("reservations.status", "active")
      .first();

    if (reservation) {
      reservation.reservation_date = formatDate(reservation.reservation_date);
      reservation.expiration_date = formatDate(reservation.expiration_date);
    }

    // Log della prenotazione trovata
    console.log(`Prenotazione trovata: ${JSON.stringify(reservation)}`);
    res.json(reservation);
  } catch (error) {
    console.error("Errore nel recupero delle prenotazioni:", error);
    res.status(500).json({ success: false, message: "Errore del server." });
  }
});

module.exports = router;
