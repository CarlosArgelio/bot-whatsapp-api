import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if(this.isGreeting(incomingMessage)){
        await this.sendWelcomeMessage(message.from, message.id, senderInfo);
        await this.sendWelcomeMenu(message.from);
      } else if (incomingMessage === 'pdf' || incomingMessage === 'audio' || incomingMessage === 'imagen' || incomingMessage === 'video') {
        await this.sendMedia(message.from, incomingMessage);
      } else {
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(message.from, response, message.id);
      }
      await whatsappService.markAsRead(message.id);
    } else if (message.type === 'interactive') {
      const option = message?.interactive?.button_reply?.title.toLowerCase().trim();
      await this.handleMenuOption(message.from, option, message.id);
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

  async handleMenuOption(to, option, messageId) {
    let response;
    switch (option) {
      case '📅 agendar cita':
        response = 'Agendar Cita'
        break;
      case '❤️ consultar':
        response = 'Consultar'
        break;
      case '📍 ubicacion':
        response = 'Esta es nuestra ubicacion'
        break;
      default:
        response = 'Lo siente, no entendi tu seleccion, Por favor, elige una opcion del menu'
    }
    await whatsappService.sendMessage(to, response, messageId);
  }
  
  async sendMedia(to, incomingMessage) {
    let dataObject;
    switch (incomingMessage) {
      case 'pdf':
        dataObject = {
          type: 'document',
          mediaUrl: 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf',
          caption: '¡Esto es un PDF!',
        }
        break;
      case 'audio':
        dataObject = {
          type: 'audio',
          mediaUrl: 'https://s3.amazonaws.com/gndx.dev/medpet-audio.aac',
          caption: 'Bienvenida',
        }
        break;
      case 'imagen':
        dataObject = {
          type: 'image',
          mediaUrl: 'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png',
          caption: '¡Esto es una Imagen!',
        }
        break;
      case 'video':
        dataObject = {
          type: 'video',
          mediaUrl: 'https://s3.amazonaws.com/gndx.dev/medpet-video.mp4',
          caption: '¡Esto es una video!',
        }
        break;
      default:
        dataObject = {
          type: 'document',
          mediaUrl: 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf',
          caption: '¡Esto es un PDF!',
        }
    }
    const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf';
    const caption = '¡Esto es un PDF!';
    const type = 'document';
    await whatsappService.sendMediaMessage(to, type, mediaUrl, caption);
  }
}

export default new MessageHandler();