const express = require("express");
const router = express.Router();
const knex = require("../knexfile");

// Route per ottenere le bici di un partner specifico
router.post("/bikes", async (req, res) => {
  const { partnerId } = req.body;
  console.log("Richiesta dati bici per partner:", partnerId);

  try {
    const bikes = await knex("bikes")
      .where("bikes.partner_id", partnerId)
      .andWhere("bikes.is_deleted", false)
      .select(
        "bikes.bike_id",
        "bikes.bike_type",
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

// Route per eliminare una bici per un partner specifico
router.delete("/bike/:id", async (req, res) => {
  const bikeId = req.params.id;
  const { partnerId } = req.body;
  console.log(
    "Richiesta di eliminazione della bici:",
    bikeId,
    "per il partner:",
    partnerId
  );

  try {
    const bike = await knex("bikes")
      .where({ bike_id: bikeId, partner_id: partnerId })
      .first();

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found or does not belong to the partner",
      });
    }

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

// Route per aggiornare gli stati delle bici di un partner
router.put("/update-state/bikes", async (req, res) => {
  const { partnerId, bikes } = req.body;
  console.log("Richiesta di aggiornamento stato bici per partner:", partnerId);
  console.log("Bikes da aggiornare:", bikes);

  try {
    for (const bike of bikes) {
      await knex("bikes")
        .where({ bike_id: bike.bike_id, partner_id: partnerId })
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
