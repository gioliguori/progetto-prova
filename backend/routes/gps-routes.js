const express = require("express");
const router = express.Router();
const knex = require("../knexfile"); // Assicurati che la configurazione di Knex sia corretta

app.post("/api/update-location", async (req, res) => {
  try {
    const { bike_id, latitude, longitude } = req.body;

    // Aggiorna la posizione della bici nel database
    await knex("bikes").where({ bike_id }).update({ latitude, longitude });

    res.status(200).send("Posizione aggiornata con successo");
  } catch (error) {
    console.error("Errore durante l'aggiornamento della posizione:", error);
    res.status(500).send("Errore del server");
  }
});

module.exports = router;
