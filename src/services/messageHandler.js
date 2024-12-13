import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if(this.isGreeting(incomingMessage)){
        await this.sendWelcomeMessage(message.from, message.id, senderInfo);
        await this.sendWelcomeMenu(message.from);
      } else {
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(message.from, response, message.id);
      }
      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message) {
    const greetings = ["hola", "hello", "hi", "buenas tardes"];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    return senderInfo.profile?.name || senderInfo.wa_id || "Usuario";
  }

  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo).split(' ')[0];
    const welcomeMessage = `Hola ${name}, Bienvenido a MEDPET, Tu tienda de mascotas en línea. ¿En qué puedo ayudarte hoy?`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }

  async sendWelcomeMenu(to) {
    const menuMessage = "Elije una opcion"
    const buttons = [
      {type: 'reply', reply: {id: 'option1', title: '📅 Agendar cita'}},
      {type: 'reply', reply: {id: 'option2', title: '❤️ Consultar'}},
      {type: 'reply', reply: {id: 'option3', title: '📍 Ubicacion'}},
    ]

    await whatsappService.sendInterativeButtons(to, menuMessage, buttons);
  }

}

export default new MessageHandler();