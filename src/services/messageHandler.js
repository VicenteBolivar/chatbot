const whatsappService = require('./whatsappService');

class MessageHandler {
  constructor() {
    this.processedMessages = new Set();
    this.appointmentState = {}; // 👈 estado por usuario
  }

  async handleIncomingMessage(message, senderInfo) {
    const messageId = message.id;
    const from = message.from;

    // 🚫 Evitar duplicados
    if (this.processedMessages.has(messageId)) {
      console.log("⚠️ Mensaje duplicado ignorado:", messageId);
      return;
    }

    this.processedMessages.add(messageId);

    // 🔘 BOTONES
    if (message?.type === 'interactive') {
      const option = message.interactive.button_reply.id;

      if (option === 'option_1') {
        this.appointmentState[from] = { step: 'name' };
        await whatsappService.sendMessage(from, "📅 Vamos a agendar una cita.\n¿Cuál es tu nombre?");
      } 
      else if (option === 'option_2') {
        await whatsappService.sendMessage(from, "🤖 Haz tu consulta");
      } 
      else {
        await whatsappService.sendMessage(from, "No entendí la opción");
      }

      return;
    }

    // 💬 TEXTO
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      // 🔥 SI ESTÁ EN FLUJO DE CITA
      if (this.appointmentState[from]) {
        await this.handleAppointmentFlow(from, incomingMessage);
        return;
      }

      // 👋 SALUDO
      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(from, senderInfo);
      } else {
        await whatsappService.sendMessage(from, "No entendí tu mensaje");
      }

      await whatsappService.markAsRead(message.id);
    }
  }

  // =========================
  // 🧠 FLUJO DE AGENDAMIENTO
  // =========================
  async handleAppointmentFlow(user, message) {
    const state = this.appointmentState[user];
    let response = "";

    switch (state.step) {
      case 'name':
        state.name = message;
        state.step = 'service';
        response = "Perfecto 👍 ¿Qué servicio deseas?";
        break;

      case 'service':
        state.service = message;
        state.step = 'date';
        response = "📅 ¿Qué día deseas la cita?";
        break;

      case 'date':
        state.date = message;
        response = `✅ Cita agendada:\n\n👤 Nombre: ${state.name}\n💇 Servicio: ${state.service}\n📅 Fecha: ${state.date}`;
        
        // 🔥 eliminar estado (IMPORTANTE)
        delete this.appointmentState[user];
        break;
    }

    await whatsappService.sendMessage(user, response);
  }

  // =========================
  // 👋 SALUDO
  // =========================
  isGreeting(message){
    const greetings = ["hola", "hello", "hi", "buenos dias", "buenas tardes", "buenas noches", "buenas"];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    return senderInfo?.profile?.name || senderInfo?.wa_id || "";
  }

  async sendWelcomeMessage(to, senderInfo) {
    const name = this.getSenderName(senderInfo);

    const welcomeMessage = `Hola 👋 ${name}, bienvenido. ¿Qué deseas hacer?`;

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

    await whatsappService.sendMessage(to, welcomeMessage);
    await whatsappService.sendInteractiveButtons(to, "Selecciona una opción:", buttons);
  }
}

module.exports = new MessageHandler();