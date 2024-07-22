const express = require("express");
const router = express.Router();

// Route per ottenere le bici di un partner specifico
router.get("/bikes", async (req, res) => {
  const partnerId = req.query.partner_id;

  if (!partnerId) {
    return res
      .status(400)
      .json({ error: "partner_id query parameter is required" });
  }

  console.log(`Richiesta dati bici per il partner ID: ${partnerId}`);

  try {
    const bikes = await req
      .db("bikes")
      .join("partners", "bikes.partner_id", "partners.partner_id")
      .where("bikes.is_deleted", false)
      .andWhere("bikes.partner_id", partnerId)
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
router.delete("/bike/:id", async (req, res) => {
  const bikeId = req.params.id;
  console.log("Richiesta di eliminazione della bici:", bikeId);

  try {
    await req
      .db("bikes")
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

// Route per aggiornare lo stato delle bici
router.put("/bikes", async (req, res) => {
  const { bikes } = req.body;

  if (!bikes || !Array.isArray(bikes)) {
    return res.status(400).json({ error: "Invalid bikes data" });
  }

  console.log("Richiesta di aggiornamento delle bici:", bikes);

  try {
    for (const bike of bikes) {
      await req
        .db("bikes")
        .where({ bike_id: bike.bike_id })
        .update({ state: bike.state });
    }

    res.json({
      success: true,
      message: "Bikes updated successfully",
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento delle bici:", error);
    res.status(500).send("Errore del server");
  }
});

module.exports = router;
