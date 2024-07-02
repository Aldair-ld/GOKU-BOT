const { WAConnection, MessageType, Mimetype } = require('@adiwajshing/baileys');
const axios = require('axios');
const fs = require('fs');

const conn = new WAConnection();
let welcomeActive = true; // Variable para controlar el estado de la bienvenida

// Evento de actualización de participantes en el grupo
conn.on('group-participants-update', async (update) => {
    const { id, participants, action } = update;

    if (action === 'add' && welcomeActive) {
        for (let participant of participants) {
            const welcomeText = `
            👋 ¡Bienvenido/a al grupo!
            🔹 *Nombre:* @${participant.split('@')[0]}
            🔹 *Lea las reglas del grupo para mantener la armonía.*
            `.trim();

            const videoUrl = 'https://telegra.ph/file/bc4f2a2d2b60e97550f8f.mp4'; // URL del video de bienvenida

            // Descargar el video desde la URL
            const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(response.data);

            await conn.sendMessage(
                id, 
                videoBuffer, 
                MessageType.video, 
                { 
                    caption: welcomeText, 
                    mimetype: Mimetype.mp4, 
                    contextInfo: { mentionedJid: [participant] }
                }
            );
        }
    }
});

// Comando para activar/desactivar la bienvenida
conn.on('chat-update', async (chatUpdate) => {
    if (!chatUpdate.hasNewMessage) return;
    const m = chatUpdate.messages.all()[0];
    const messageContent = m.message.conversation || m.message.extendedTextMessage?.text;

    if (messageContent) {
        const command = messageContent.split(' ')[0];
        const args = messageContent.split(' ').slice(1);

        if (command === '.off' && args[0] === 'bienvenida') {
            welcomeActive = false;
            await conn.sendMessage(m.key.remoteJid, '🛑 El comando de bienvenida ha sido desactivado.', MessageType.text);
        } else if (command === '.on' && args[0] === 'bienvenida') {
            welcomeActive = true;
            await conn.sendMessage(m.key.remoteJid, '✅ El comando de bienvenida ha sido activado.', MessageType.text);
        }
    }
});

// Conectar a WhatsApp
async function connectToWhatsApp() {
    conn.on('open', () => {
        console.log('Conexión exitosa a WhatsApp');
        const authInfo = conn.base64EncodedAuthInfo();
        fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'));
    });

    fs.existsSync('./auth_info.json') && conn.loadAuthInfo('./auth_info.json');
    await conn.connect();
}

connectToWhatsApp().catch(console.error);
