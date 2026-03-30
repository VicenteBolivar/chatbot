const whatsappService = require('./whatsappService');

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    const from = message.from;
    const text = message.text?.body;

    console.log("📱 From:", from);
    console.log("💬 Message:", text);

    let reply = "No entendí tu mensaje";

    if (text.toLowerCase() === "hola") {
      reply = "Hola 👋 ¿En qué puedo ayudarte?";
    }

    await whatsappService.sendMessage(from, reply);
  }
}

module.exports = new MessageHandler();