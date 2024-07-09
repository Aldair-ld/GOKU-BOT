import { randomBytes } from 'crypto';
import { WAConnection, MessageType } from '@adiwajshing/baileys';

let handler = async (m, { conn, command, participants, usedPrefix, text }) => {
  if (!text && !m.quoted) return m.reply('Por favor, proporciona un mensaje para enviar.');
  
  let fkontak = {
    "key": { "participants": "0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" },
    "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${conn.user.jid.split('@')[0]}:${conn.user.jid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } },
    "participant": "0@s.whatsapp.net"
  };

  let users = participants.map(u => conn.decodeJid(u.id));
  let cc2 = text ? m : m.quoted ? await m.getQuotedObj() : false || m;
  let teks2 = text ? text : cc2.text;
  let d = new Date(new Date() + 3600000);
  let locale = 'es-ES';
  let dia = d.toLocaleDateString(locale, { weekday: 'long' });
  let fecha = d.toLocaleDateString(locale, { day: 'numeric', month: 'numeric', year: 'numeric' });
  let mes = d.toLocaleDateString(locale, { month: 'long' });
  let año = d.toLocaleDateString(locale, { year: 'numeric' });
  let tiempo = d.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
  let groups = Object.keys(await conn.groupFetchAllParticipating());
  let usersTag = participants.map(u => conn.decodeJid(u.id));
  let readMS = String.fromCharCode(8206).repeat(850);
  await m.reply('Iniciando envío a los grupos...');

  for (let i = 0; i < groups.length; i++) {
    const id = groups[i];
    const infoGP = `INICIA AL BOT\n${dia}, ${mes} ${año}\n${fecha}\n${tiempo}\n${teks2}`;
    const delay = i * 4000; // 4 seg

    setTimeout(async () => {
      const buttonMessage = {
        contentText: infoGP,
        footerText: 'Estoy segura de que te va a encantar.',
        buttons: [
          {
            buttonId: 'start_bot',
            buttonText: { displayText: 'INICIO' },
            type: 1
          }
        ],
        headerType: 1,
        mentions: [m.sender],
        contextInfo: { mentionedJid: (await conn.groupMetadata(id)).participants.map(v => v.id) }
      };

      await conn.sendMessage(id, buttonMessage, MessageType.buttonsMessage, { quoted: fkontak });
    }, delay);
  }
  let totalGP = groups.length;
  await m.reply(`Mensajes enviados a ${totalGP} grupos.`);
};

handler.help = ['broadcastgroup', 'bcgc'].map(v => v + ' <teks>');
handler.tags = ['owner'];
handler.command = /^(broadcast|bc)(group|grup|gc)$/i;
handler.owner = true;
export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
const delay = time => new Promise(res => setTimeout(res, time));

// Manejo del evento del botón
conn.on('chat-update', async (chatUpdate) => {
  if (chatUpdate.messages) {
    const message = chatUpdate.messages.all()[0];
    const from = message.key.remoteJid;
    const messageType = Object.keys(message.message)[0];

    if (messageType === MessageType.buttonsResponseMessage) {
      const buttonId = message.message.buttonsResponseMessage.selectedButtonId;

      if (buttonId === 'start_bot') {
        const botNumber = '51973846456@s.whatsapp.net'; // Número del bot
        const customMessage = '.inicio'; // Mensaje personalizado

        // Enviar mensaje personalizado al número del bot
        await conn.sendMessage(botNumber, { text: customMessage }, MessageType.text);
      }
    }
  }
});
