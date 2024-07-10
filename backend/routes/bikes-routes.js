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

module.exports = router;
