require("dotenv").config();
var framework = require("webex-node-bot-framework");
var webhook = require("webex-node-bot-framework/webhook");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(express.static("images"));

const config = {
  token: process.env.BOTTOKEN,
};

// Only pass the webhook URL and port if it has been set in the environment
if (process.env.WEBHOOKURL && process.env.PORT) {
  config.webhookUrl = process.env.WEBHOOKURL;
  config.port = process.env.PORT;
}

// init framework
var framework = new framework(config);
framework.start();
console.log("Starting framework, please wait...");

framework.on("initialized", () => {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on("spawn", (bot, id, actorId) => {
  if (!actorId) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(
      `While starting up, the framework found our bot in a space called: ${bot.room.title}`
    );
  } else {
    // When actorId is present it means someone added your bot got added to a new space
    // Let's find out more about them..
    let welcomeMessage = `Hello there! I am here to assist you. You can say \`help\` to get the list of words I am able to respond to.`;
    bot.webex.people
      .get(actorId)
      .then((user) => {
        welcomeMessage = `Hello there ${user.displayName}. ${welcomeMessage}`;
      })
      .catch((e) => {
        console.error(
          `Failed to lookup user details in framework.on("spawn"): ${e.message}`
        );
        welcomeMessage = `Hello there. ${welcomeMessage}`;
      })
      .finally(() => {
        // Say hello and list available commands
        if (bot.isDirect) {
          bot.say("markdown", `${welcomeMessage}\n\nHere are the commands you can use:\n\n${framework.showHelp()}`);
        } else {
          let botName = bot.person.displayName;
          welcomeMessage += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
          bot.say("markdown", `${welcomeMessage}\n\nHere are the commands you can use:\n\n${framework.showHelp()}`);
        }
      });
  }
});

// Implementing a framework.on('log') handler allows you to capture
// events emitted from the framework.  Its a handy way to better understand
// what the framework is doing when first getting started, and a great
// way to troubleshoot issues.
// You may wish to disable this for production apps
framework.on("log", (msg) => {
  console.log(msg);
});

// Define your commands here
framework.hears(
  "pagamenti",
  (bot) => {
    console.log("pagamenti command received");
    bot.say("markdown", 
      `Ecco alcuni pagamenti di esempio che hai effettuato:\n\n` +
      `1. **Numero di pagamento**: 123456\n` +
      `   **ID del pagamento**: A1B2C3D4\n` +
      `   **Importo**: €30.00\n` +
      `   **Data e ora**: 2024-07-01 10:15:00\n\n` +
      `2. **Numero di pagamento**: 789012\n` +
      `   **ID del pagamento**: E5F6G7H8\n` +
      `   **Importo**: €40.00\n` +
      `   **Data e ora**: 2024-07-15 14:30:00\n\n` +
      `Per controllare i dettagli di un pagamento specifico, digita \`pagamento='numero del pagamento'\`. Se vuoi contattare un operatore, digita \`operatore\`.`
    );
  },
  "**pagamenti**: (ottieni informazioni sui pagamenti)",
  0
);

framework.hears(
  "modificaprofilo",
  (bot) => {
    console.log("modificaprofilo command received");
    bot.say("markdown", 
      `Per modificare il tuo profilo:\n` +
      `1. Apri l'applicazione Schianogo.\n` +
      `2. Effettua il login.\n` +
      `3. Recati nella pagina **PROFILO**.\n` +
      `4. Clicca su **Modifica Profilo**.\n` +
      `5. Effettua le modifiche desiderate.\n\n` +
      `In caso di problemi, digita \`operatore\` per ricevere assistenza.`
    );
  },
  "**modificaprofilo**: (modifica le informazioni del tuo profilo)",
  0
);

framework.hears(
  "operatore",
  (bot) => {
    console.log("operatore command received");
    bot.say("markdown", 
      `Per parlare direttamente con un operatore, clicca sul seguente link:\n` +
      `[Parla con un Operatore](https://meet1376.webex.com/meet/pr26349809433)`
    );
  },
  "**operatore**: (contatta un operatore)",
  0
);

// Update the help command to show the new commands
framework.hears(
  /help|what can i (do|say)|what (can|do) you do/i,
  (bot, trigger) => {
    console.log(`someone needs help! They asked ${trigger.text}`);
    bot
      .say(`Hello ${trigger.person.displayName}.`)
      .then(() => bot.say("markdown", `Here are the commands you can use:\n\n**pagamenti**: Ottieni informazioni sui pagamenti\n**modificaprofilo**: Modifica le informazioni del tuo profilo\n**operatore**: Contatta un operatore`))
      .catch((e) => console.error(`Problem in help handler: ${e.message}`));
  },
  "**help**: (what you are reading now)",
  0
);

/* On mention with unexpected bot command
   Its a good practice is to gracefully handle unexpected input
   Setting the priority to a higher number here ensures that other
   handlers with lower priority will be called instead if there is another match
*/
framework.hears(
  /.*/,
  (bot, trigger) => {
    // This will fire for any input so only respond if we haven't already
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot
      .say(`Sorry, I don't know how to respond to "${trigger.text}"`)
      .then(() => bot.say("markdown", framework.showHelp()))
      .catch((e) =>
        console.error(`Problem in the unexpected command handler: ${e.message}`)
      );
  },
  99999
);

//Server config & housekeeping
// Health Check
app.get("/", (req, res) => {
  res.send(`I'm alive.`);
});

app.post("/", webhook(framework));

var server = app.listen(config.port, () => {
  framework.debug("framework listening on port %s", config.port);
});

// gracefully shutdown (ctrl-c)
process.on("SIGINT", () => {
  framework.debug("stopping...");
  server.close();
  framework.stop().then(() => {
    process.exit();
  });
});
