const sendToWhatsApp = require('./httpRequest/sendToWhatsApp');

class WhatsAppService {

  // 📩 Mensaje simple
  async sendMessage(to, text) {
    return sendToWhatsApp({
      messaging_product: "whatsapp",
      to,
      text: { body: text }
    });
  }

  // 🔘 Botones interactivos
  async sendInteractiveButtons(to, bodyText, buttons) {
    return sendToWhatsApp({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: bodyText
        },
        action: {
          buttons: buttons
        }
      }
    });
  }

  // ✅ Marcar mensaje como leído
  async markAsRead(messageId) {
    return sendToWhatsApp({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId
    });
  }
}

module.exports = new WhatsAppService();