const { MessageType } = require('@adiwajshing/baileys');

// Comando .admingay
const handler = async (m, { conn }) => {
    // Verificar si el mensaje tiene un video o una imagen adjunta
    let mediaType = m.quotedMsg ? m.quotedMsg.type : '';
    let mediaData = m.quotedMsg ? m.quotedMsg : m;
    let mediaURL = '';
    if (mediaType === MessageType.video) {
        mediaURL = await conn.downloadAndSaveMediaMessage(mediaData, `https://telegra.ph/file/ca41dab5c1698dcc4569b.mp4`);
    } else if (mediaType === MessageType.image) {
        mediaURL = await conn.downloadAndSaveMediaMessage(mediaData, `./temp/media-${m.from}.jpeg`);
    }

    // Mensaje de respuesta personalizado
    let message = `
El creador está enamoradooooo 

volvio con su bandida lo haran sufrir pero ya que que sea feliz por mientras

ALDAIR KCHUDO 

Qué lindo es el amor ❤️
`;

    // Enviar mensaje personalizado al usuario
    await conn.sendMessage(m.chat, message, MessageType.text);

    // Enviar video o imagen adjunta si existe
    if (mediaURL !== '') {
        await conn.sendMessage(m.chat, { url: mediaURL }, mediaType);
    }
};

handler.help = ['admingay <opcional: mensaje>'];
handler.tags = ['personal'];
handler.command = /^admingay$/i;

module.exports = handler;
