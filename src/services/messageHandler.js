const whatsappService = require('./whatsappService');

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    const messageId = message.id;

    if (processedMessages.has(messageId)) {
      console.log("⚠️ Mensaje duplicado ignorado:", messageId);
      return;
    }

    processedMessages.add(messageId);

    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, message.id);
      } else {
        const response = "No entendí tu mensaje";
        await whatsappService.sendMessage(message.from, response, message.id);
      }

      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message){
    const greetings = ["hola", "hello", "hi", "buenos dias", "buenas tardes", "buenas noches", ".", "buenas"];
    return greetings.includes(message);
  }

  async sendWelcomeMessage(to, messageId) {
    const welcomeMesagge = "Hola 👋 Bienvenido a nuestro servicio de chatbot automatico" + "¿En qué puedo ayudarte hoy?";
    await whatsappService.sendMessage(to, welcomeMesagge, messageId)
  }
}

module.exports = new MessageHandler();