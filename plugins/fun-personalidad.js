let handler = async (m, { conn }) => {
  let fkontak = { 
    "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, 
    "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Soporte;Bot;;;\nFN:Soporte Bot\nitem1.TEL;waid=51912345678:+51 912 345 678\nitem1.X-ABLabel:Soporte\nEND:VCARD` }},
    "participant": "0@s.whatsapp.net" 
  };

  let contactInfo = `*📞 Información de Contacto del Soporte*\n\n` +
                    `*Nombre:* ALDAIR\n` +
                    `*Número:* +51 925 015 528\n` 
                    `Para cualquier consulta o soporte técnico, por favor contacta al número proporcionado.`;

  await conn.reply(m.chat, contactInfo, fkontak, m);
};

handler.help = ['contacto'];
handler.tags = ['info'];
handler.command = /^contacto$/i;

export default handler;
