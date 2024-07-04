const { MessageType } = require('@adiwajshing/baileys');

// Función para obtener todos los chats/grupos en los que está el bot
const getAllChats = async (conn) => {
    let chats = await conn.chats.all();
    return chats.filter(chat => chat.jid.endsWith('@g.us')); // Filtrar solo grupos
};

// Comando .anuncio
const handler = async (m, { conn }) => {
    // Verificar si el mensaje tiene un video adjunto
    let video = m.message.extendedTextMessage?.videoMessage?.url;

    if (!video) {
        conn.sendMessage(m.chat, 'Debes adjuntar un video para enviar junto con el anuncio.', MessageType.text);
        return;
    }

    // Obtener el texto del anuncio
    let mensaje = m.text.split(' ').slice(1).join(' ');

    // Obtener todos los grupos en los que está el bot
    let chats = await getAllChats(conn);

    // Enviar el anuncio y el video a todos los grupos
    for (let chat of chats) {
        try {
            await conn.sendMessage(chat.jid, mensaje, MessageType.text);
            await conn.sendMessage(chat.jid, { url: video }, MessageType.video);
        } catch (error) {
            console.error(`Error al enviar el anuncio al grupo ${chat.jid}:`, error);
        }
    }

    // Confirmar envío al usuario
    conn.sendMessage(m.chat, `Anuncio enviado a ${chats.length} grupos.`, MessageType.text);
};

handler.help = ['anuncio <texto> <video>'];
handler.tags = ['admin'];
handler.command = /^anuncio$/i;

module.exports = handler;
