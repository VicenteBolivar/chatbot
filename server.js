// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/webhook', (req, res) => {
  console.log("------ WEBHOOK VERIFY ------");
  console.log("QUERY:", req.query);

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log("MODE:", mode);
  console.log("TOKEN (Meta):", token);
  console.log("VERIFY_TOKEN (Server):", verifyToken);

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ WEBHOOK VERIFIED');
    return res.status(200).send(challenge);
  } else {
    console.log('❌ VERIFICATION FAILED');
    return res.sendStatus(403);
  }
});

// Route for POST requests
app.post('/webhook', (req, res) => {
  console.log("📩 EVENT RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const messages = value?.messages;

  if (messages) {
    const message = messages[0];
    const from = message.from;
    const text = message.text?.body;

    console.log("📱 From:", from);
    console.log("💬 Message:", text);
  }

  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});