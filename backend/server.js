const express = require('express');
const bodyParser = require('body-parser');
const Webex = require('@webex/webex-core');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Inizializzazione di Webex con il token del bot
const webex = Webex.init({
  credentials: {
    access_token: 'OGFiNzlkOTgtOWQ4ZC00MGMzLTg3ZDgtZGRiNjQ3MTgxMzg3OWZlZmRhYWYtYmQz_P0A1_9db452ae-a8fa-4c45-ad97-a9c6809f2db1'
  }
});

// Endpoint per creare una stanza
app.post('/create-room', async (req, res) => {
  try {
    const { title } = req.body;
    const room = await webex.rooms.create({ title });
    res.json({ roomId: room.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
