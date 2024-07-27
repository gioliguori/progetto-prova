const express = require("express");
const router = express.Router();
const knex = require("../knexfile");

router.post("/create-reservation", async (req, res) => {
  const { username, bikeId } = req.body;

  console.log(
    `Richiesta di prenotazione ricevuta: username=${username}, bikeId=${bikeId}`
  );

  try {
    // Recupera l'utente dal database usando l'username
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

    // Calcola la scadenza della prenotazione (15 minuti dopo l'attuale)
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15);

    // Crea la nuova prenotazione nel database
    await knex("reservations").insert({
      user_id: user.user_id,
      bike_id: bikeId,
      expiration_date: expirationDate,
    });

    // Aggiorna lo stato della bici a 'riservata'
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

module.exports = router; // Esporta il router
