const express = require("express");
const router = express.Router();
const knex = require("../knexfile"); // Importa la configurazione di knex

// Definisci una rotta per ottenere la lista delle bici
router.get("/api/bikes", async (req, res) => {
  try {
    const results = await knex("bikes").select();
    res.json(results);
  } catch (error) {
    console.error("Errore durante l'esecuzione della query: " + error.stack);
    res.status(500).send("Errore del server");
  }
});

// Definisci una rotta per ottenere i conteggi delle bici
// Definisci una rotta per ottenere i conteggi delle bici
router.get("/api/bikes/count", async (req, res) => {
  try {
    console.log("Inizio esecuzione della rotta /api/bikes/count");

    const totalBikes = await knex("bikes").count("bike_id as count").first();
    console.log("Conteggio totale bici:", totalBikes.count);

    const availableBikes = await knex("bikes")
      .where("state", "disponibile")
      .count("bike_id as count")
      .first();
    console.log("Bici disponibili:", availableBikes.count);

    const rentedBikes = await knex("bikes")
      .where("state", "in noleggio")
      .count("bike_id as count")
      .first();
    console.log("Bici in noleggio:", rentedBikes.count);

    const reservedBikes = await knex("bikes")
      .where("state", "riservata")
      .count("bike_id as count")
      .first();
    console.log("Bici riservate:", reservedBikes.count);

    const dismissedBikes = await knex("bikes")
      .where("state", "dismessa")
      .count("bike_id as count")
      .first();
    console.log("Bici dismesse:", dismissedBikes.count);

    const bikeCounts = {
      total: totalBikes.count,
      available: availableBikes.count,
      rented: rentedBikes.count,
      reserved: reservedBikes.count,
      dismissed: dismissedBikes.count,
    };

    console.log("Risultato finale dei conteggi delle bici:", bikeCounts);

    res.json(bikeCounts);
  } catch (error) {
    console.error("Errore durante l'esecuzione della query: " + error.stack);
    res.status(500).send("Errore del server");
  }
});

module.exports = router;
