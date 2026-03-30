const sendToWhatsApp = require('./httpRequest/sendToWhatsApp');

class WhatsAppService {
  async sendMessage(to, text) {
    return sendToWhatsApp({
      messaging_product: "whatsapp",
      to,
      text: { body: text }
    });
  }
}

module.exports = new WhatsAppService();