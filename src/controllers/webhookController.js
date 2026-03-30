const config = require('../config/env');
const messageHandler = require('../services/messageHandler');

class WebhookController {
  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.VERIFY_TOKEN) {
      console.log('✅ WEBHOOK VERIFIED');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  async handleIncoming(req, res) {
    console.log("📩 EVENT RECEIVED:");
    console.log(JSON.stringify(req.body, null, 2));

    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const senderInfo = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (message) {
      await messageHandler.handleIncomingMessage(message, senderInfo);
    }

    res.sendStatus(200);
  }
}

module.exports = new WebhookController();