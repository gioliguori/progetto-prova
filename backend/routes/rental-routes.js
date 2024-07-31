const express = require("express");
const router = express.Router();
const knex = require("../knexfile");

router.post("/create-reservation", async (req, res) => {
  const { username, bikeId } = req.body;

  console.log(
    `Richiesta di prenotazione ricevuta: username=${username}, bikeId=${bikeId}`
  );

  try {
    const user = await knex("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

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

    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15);

    await knex("reservations").insert({
      user_id: user.user_id,
      bike_id: bikeId,
      expiration_date: expirationDate,
    });

    await knex("bikes").where("bike_id", bikeId).update({ state: "riservata" });

    console.log(
      `Prenotazione creata per l'utente ${username} e la bici ${bikeId}. Scadenza: ${expirationDate}`
    );

    res.json({ success: true, message: "Prenotazione avvenuta con successo." });
  } catch (error) {
    console.error("Errore durante la creazione della prenotazione:", error);
    res.status(500).json({ success: false, message: "Errore del server." });
  }
});

router.post("/start-rental", async (req, res) => {
  const { username, bikeId, rentalType } = req.body;

  console.log(
    `Richiesta di noleggio ricevuta: username=${username}, bikeId=${bikeId}, rentalType=${rentalType}`
  );

  try {
    const user = await knex("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

    const activeRental = await knex("rentals")
      .where("user_id", user.user_id)
      .andWhereNull("rental_end")
      .first();

    if (activeRental) {
      console.log(
        `Noleggio attivo trovato per l'utente: username=${username}, rental_id=${activeRental.rental_id}`
      );
      return res
        .status(400)
        .json({ success: false, message: "Hai già un noleggio attivo." });
    }

    const bike = await knex("bikes").where("bike_id", bikeId).first();
    if (!bike || bike.state !== "disponibile") {
      console.log(`Bici non disponibile: bikeId=${bikeId}`);
      return res
        .status(400)
        .json({ success: false, message: "Bici non disponibile." });
    }

    await knex("rentals").insert({
      user_id: user.user_id,
      bike_id: bikeId,
      rental_type: rentalType,
    });

    await knex("bikes")
      .where("bike_id", bikeId)
      .update({ state: "in noleggio" });

    console.log(
      `Noleggio creato per l'utente ${username} e la bici ${bikeId}.`
    );

    res.json({ success: true, message: "Noleggio avvenuto con successo." });
  } catch (error) {
    console.error("Errore durante la creazione del noleggio:", error);
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
router.get("/user-rentals", async (req, res) => {
  const { username } = req.query;

  console.log(`Richiesta ricevuta per i noleggi dell'utente: ${username}`);

  try {
    const user = await knex("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

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

    // Formatta le date e i dati di output
    const formattedRentals = rentals.map((rental) => ({
      rental_id: rental.rental_id,
      bike_type: rental.bike_type,
      partner_name: rental.partner_name,
      rental_start: formatDate(rental.rental_start),
      rental_end: rental.rental_end ? formatDate(rental.rental_end) : null,
      amount: rental.amount.toFixed(2), // Format amount to 2 decimal places
    }));

    console.log(`Noleggi trovati: ${JSON.stringify(formattedRentals)}`);
    res.json(formattedRentals);
  } catch (error) {
    console.error("Errore nel recupero dei noleggi:", error);
    res.status(500).json({ success: false, message: "Errore del server." });
  }
});

router.get("/user-reservations", async (req, res) => {
  const { username } = req.query;

  console.log(
    `Richiesta ricevuta per le prenotazioni dell'utente: ${username}`
  );

  try {
    const user = await knex("users").where("username", username).first();
    if (!user) {
      console.log(`Utente non trovato: username=${username}`);
      return res
        .status(404)
        .json({ success: false, message: "Utente non trovato." });
    }

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

    console.log(`Prenotazione trovata: ${JSON.stringify(reservation)}`);
    res.json(reservation);
  } catch (error) {
    console.error("Errore nel recupero delle prenotazioni:", error);
    res.status(500).json({ success: false, message: "Errore del server." });
  }
});

module.exports = router;
