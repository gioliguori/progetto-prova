const express = require('express');
const router = express.Router();

// Endpoint per ottenere le biciclette di un partner specifico
router.get('/:id/bikes', (req, res) => {
  const partnerId = req.params.id;

  req.db.all('SELECT * FROM bikes WHERE partner_id = ?', [partnerId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});

module.exports = router;
