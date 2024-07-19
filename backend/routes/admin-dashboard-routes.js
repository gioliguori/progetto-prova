const express = require("express");
const router = express.Router();
const knex = require("../knexfile"); // Assicurati che la configurazione di Knex sia corretta

// Route per ottenere i dati della dashboard dell'admin
router.get("/api/admin/data", async (req, res) => {
  const { username } = req.query;
  console.log("Richiesta dati dashboard per l'admin:", username);

  try {
    // Recupera la lista dei partner
    const partners = await knex("partners").select("*");

    // Recupera i ricavi settimanali, mensili e annuali
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
        GROUP BY 
            p.partner_name;
    `);

    res.json({
      success: true,
      partners,
      revenues: revenues[0],
    });
  } catch (error) {
    console.error("Errore durante l'esecuzione della query:", error);
    res.status(500).send("Errore del server");
  }
});

module.exports = router;
