import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn }) => {
    let fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    };

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

    let userNumber = PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international');
    let message = `
*Hola ¡Bienvenido!* ❰ ${userNumber} ❱

*P𝖺𝗋𝖺 𝗎𝗌𝖺𝗋 𝖾𝗌𝗍𝖾 𝖻𝗈𝗍 𝗉𝗋𝗂𝗆𝖾𝗋𝗈 𝗋𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝗍𝖾.*

*[📰] Para registrarte usa /reg nombre.edad*

*[⚒] Para ver los comando usa /menu*

*[📋] Para ver tu Perfil usa /perfil*

*[💻]  𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆 [ ALDAIR ➣ +51 925 015 528 ]*

*[📲]  Unete a Nuestro canal: https://whatsapp.com/channel/0029VafZvB6J3jv3qCnqNu3x*

*➣ 【 SE VIENEN NUEVOS COMANDOS 】*
`.trim();

    let videoUrl = 'https://telegra.ph/file/7feea2f7fb4bd646970ce.mp4'; // URL del video

    await conn.sendFile(m.chat, videoUrl, 'welcome.mp4', message, fkontak);
};

// Función para generar el enlace de referido único (no se usa en este comando, pero dejada por si es necesaria)
const generateReferralLink = (userId) => {
    return `https://api.whatsapp.com/send/?phone=${userId.split('@')[0]}&text=.menu`;
};

handler.help = ['inicio'];
handler.tags = ['general'];
handler.command = /^inicio$/i;

export default handler;
