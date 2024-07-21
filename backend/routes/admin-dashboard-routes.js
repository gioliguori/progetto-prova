const express = require("express");
const router = express.Router();
const knex = require("../knexfile"); // Assicurati che la configurazione di Knex sia corretta
const { v4: uuidv4 } = require("uuid");

// Route per ottenere i partner attivi
router.get("/api/admin/partners", async (req, res) => {
  console.log("Richiesta lista partner attivi");

  try {
    const partners = await knex("partners")
      .where({ is_deleted: false })
      .select("*");

    res.json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);
    res.status(500).send("Errore del server");
  }
});

// Route per ottenere i ricavi settimanali, mensili e annuali dei partner attivi
router.get("/api/admin/revenues", async (req, res) => {
  console.log("Richiesta ricavi partner attivi");

  try {
    const revenues = await knex.raw(`
        SELECT 
            p.partner_name,
            SUM(CASE 
                WHEN r.rental_start >= NOW() - INTERVAL 1 WEEK THEN r.amount 
                ELSE 0 
            END) AS weekly_revenue,
            SUM(CASE 
                WHEN r.rental_start >= NOW() - INTERVAL 1 MONTH THEN r.amount 
                ELSE 0 
            END) AS monthly_revenue,
            SUM(CASE 
                WHEN r.rental_start >= NOW() - INTERVAL 1 YEAR THEN r.amount 
                ELSE 0 
            END) AS annual_revenue
        FROM 
            rentals r
        JOIN 
            bikes b ON r.bike_id = b.bike_id
        JOIN 
            partners p ON b.partner_id = p.partner_id
        WHERE 
            p.is_deleted = false
        GROUP BY 
            p.partner_name;
    `);

    res.json({
      success: true,
      revenues: revenues[0],
    });
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);
    res.status(500).send("Errore del server");
  }
});

// Route per eliminare un partner
router.delete("/api/admin/partner/:id", async (req, res) => {
  const partnerId = req.params.id;
  console.log("Richiesta di eliminazione del partner:", partnerId);

  try {
    await knex("partners")
      .where({ partner_id: partnerId })
      .update({ is_deleted: true });

    res.json({
      success: true,
      message: "Partner deleted successfully",
    });
  } catch (error) {
    console.error("Errore durante l'eliminazione del partner:", error);
    res.status(500).send("Errore del server");
  }
});

// Route per ottenere i dati delle bici
router.get("/api/admin/bikes", async (req, res) => {
  console.log("Richiesta dati bici");

  try {
    const bikes = await knex("bikes")
      .join("partners", "bikes.partner_id", "partners.partner_id")
      .where("bikes.is_deleted", false)
      .select(
        "bikes.bike_id",
        "bikes.bike_type",
        "partners.partner_name",
        "bikes.state",
        "bikes.battery_level",
        "bikes.count_run"
      );

    res.json({
      success: true,
      bikes,
    });
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);
    res.status(500).send("Errore del server");
  }
});

// Route per eliminare una bici
router.delete("/api/admin/bike/:id", async (req, res) => {
  const bikeId = req.params.id;
  console.log("Richiesta di eliminazione della bici:", bikeId);

  try {
    await knex("bikes")
      .where({ bike_id: bikeId })
      .update({ is_deleted: true, state: "dismessa" });

    res.json({
      success: true,
      message: "Bike deleted successfully",
    });
  } catch (error) {
    console.error("Errore durante l'eliminazione della bici:", error);
    res.status(500).send("Errore del server");
  }
});

// Route per aggiungere un nuovo partner
router.post("/api/admin/partner/insert", async (req, res) => {
  try {
    console.log("Dati ricevuti dal client:", req.body); // Log dei dati ricevuti

    const { name, type, latitude, longitude, username, password } = req.body;

    // Genera UUID per il nuovo partner
    const partnerId = uuidv4();

    // Inizia una transazione
    await knex.transaction(async (trx) => {
      // Inserisci nella tabella partners
      console.log("Inserimento dati nella tabella partners");
      await trx("partners").insert({
        partner_id: partnerId,
        partner_name: name,
        partner_type: type.value, // Utilizza il valore effettivo del tipo
        latitude: latitude,
        longitude: longitude,
      });

      // Inserisci nella tabella partner_auth
      console.log("Inserimento dati nella tabella partner_auth");
      await trx("partner_auth").insert({
        uuid: partnerId,
        username: username,
        password: password,
      });
    });

    res.status(201).json({
      success: true,
      message: "Partner added successfully",
    });
  } catch (error) {
    console.error(
      "Errore durante l'inserimento del partner:",
      error.message,
      error.stack
    );
    res.status(500).json({
      success: false,
      message: "Errore durante l'inserimento del partner",
      error: error.message,
    });
  }
});

module.exports = router;
