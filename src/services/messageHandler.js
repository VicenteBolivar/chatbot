const whatsappService = require('./whatsappService');

class MessageHandler {
  constructor() {
    this.processedMessages = new Set();
  }

  async handleIncomingMessage(message, senderInfo) {
    const messageId = message.id;

    // 🚫 Evitar duplicados
    if (this.processedMessages.has(messageId)) {
      console.log("⚠️ Mensaje duplicado ignorado:", messageId);
      return;
    }

    this.processedMessages.add(messageId);

    // 🔘 NUEVO: manejar botones
    if (message?.type === 'interactive') {
      const option = message.interactive.button_reply.id;

      if (option === 'option_1') {
        await whatsappService.sendMessage(message.from, "📅 Vamos a agendar una cita");
      } else if (option === 'option_2') {
        await whatsappService.sendMessage(message.from, "🤖 Haz tu consulta");
      } else {
        await whatsappService.sendMessage(message.from, "No entendí la opción");
      }

      return;
    }

    // 💬 Mensajes de texto
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, senderInfo);
      } else {
        await whatsappService.sendMessage(message.from, "No entendí tu mensaje");
      }

      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message){
    const greetings = ["hola", "hello", "hi", "buenos dias", "buenas tardes", "buenas noches", "buenas"];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    return senderInfo?.profile?.name || senderInfo?.wa_id || "";
  }

  async sendWelcomeMessage(to, senderInfo) {
    const name = this.getSenderName(senderInfo);

    const welcomeMessage = `Hola 👋 ${name}, bienvenido a nuestro servicio. ¿Qué deseas hacer?`;

    const buttons = [
      {
        type: "reply",
        reply: {
          id: "option_1",
          title: "Agendar"
        }
      },
      {
        type: "reply",
        reply: {
          id: "option_2",
          title: "Consultar"
        }
      }
    ];

    // 📩 mensaje + botones
    await whatsappService.sendMessage(to, welcomeMessage);
    await whatsappService.sendInteractiveButtons(to, "Selecciona una opción:", buttons);
  }
}

module.exports = new MessageHandler();