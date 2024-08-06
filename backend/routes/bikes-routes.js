const express = require("express");
const router = express.Router();
const knex = require("../knexfile");

// Rotta per ottenere la lista delle bici
router.get("/", async (req, res) => {
  try {
    const results = await knex("bikes").select();
    res.json(results);
  } catch (error) {
    console.error("Errore durante l'esecuzione della query: " + error.stack);
    res.status(500).send("Errore del server");
  }
});

// Rotta per ottenere i dati combinati di bici e partner
router.get("/localization", async (req, res) => {
  try {
    const results = await knex("bikes")
      .join("partners", "bikes.partner_id", "=", "partners.partner_id")
      .select(
        "bikes.bike_id",
        "bikes.bike_type",
        "bikes.battery_level",
        "bikes.latitude",
        "bikes.longitude",
        "bikes.state",
        "bikes.bike_id_partner",
        "partners.partner_name"
      );
    res.json(results);
  } catch (error) {
    console.error("Errore durante l'esecuzione della query: " + error.stack);
    res.status(500).send("Errore del server");
  }
});

// Rotta per ottenere i conteggi delle bici
router.get("/count", async (req, res) => {
  try {
    const totalBikes = await knex("bikes").count("bike_id as count").first();
    const availableBikes = await knex("bikes")
      .where("state", "disponibile")
      .count("bike_id as count")
      .first();
    const rentedBikes = await knex("bikes")
      .where("state", "in noleggio")
      .count("bike_id as count")
      .first();
    const reservedBikes = await knex("bikes")
      .where("state", "riservata")
      .count("bike_id as count")
      .first();
    const dismissedBikes = await knex("bikes")
      .where("state", "dismessa")
      .count("bike_id as count")
      .first();

    const bikeCounts = {
      total: totalBikes.count,
      available: availableBikes.count,
      rented: rentedBikes.count,
      reserved: reservedBikes.count,
      dismissed: dismissedBikes.count,
    };

    res.json(bikeCounts);
  } catch (error) {
    console.error("Errore durante l'esecuzione della query: " + error.stack);
    res.status(500).send("Errore del server");
  }
});

// Rotta per inserire una nuova bici
router.post("/insert", async (req, res) => {
  try {
    const { bike_type, battery_level, partner_id } = req.body;

    if (!bike_type || !battery_level || !partner_id) {
      return res.status(400).send("Tutti i campi sono obbligatori.");
    }

    await knex.transaction(async (trx) => {
      // Recupera latitudine, longitudine e count_bike del partner
      const partner = await trx("partners")
        .where("partner_id", partner_id)
        .select("latitude", "longitude", "count_bike")
        .first();

      if (!partner) {
        throw new Error("Partner non trovato");
      }

      const newBikeIdPartner = partner.count_bike + 1;

      // Inserisci la nuova bici
      await trx("bikes").insert({
        bike_type,
        battery_level,
        partner_id,
        latitude: partner.latitude,
        longitude: partner.longitude,
        bike_id_partner: newBikeIdPartner,
      });

      // Incrementa count_bike del partner
      await trx("partners")
        .where("partner_id", partner_id)
        .increment("count_bike", 1);
    });

    res.status(201).json({ message: "Bici inserita con successo." });
  } catch (error) {
    console.error("Errore durante l'inserimento della bici: " + error.stack);
    res.status(500).json({ message: "Errore del server" });
  }
});

module.exports = router;
