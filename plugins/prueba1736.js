import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, usedPrefix }) => {
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

    let pp = 'https://telegra.ph/file/ca41dab5c1698dcc4569b.mp4'; // URL del video por defecto

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

    try {
        pp = await conn.getProfilePicture(who); // Obtener foto de perfil del usuario
    } catch (e) {
        // Error al obtener la foto de perfil
    } finally {
        let user = global.db.data.users[who];
        let { name, limit, registered, regTime, age } = user;

        // Generar el enlace de referido único para el usuario
        const referralLink = generateReferralLink(who); // Debes implementar esta función

        let prem = global.prems.includes(who.split`@`[0]);
        let status = user.banned ? 'BANEADO' : 'LIBRE';

        let str =
`
El creador está enamoradooooo 

volvio con su bandida lo haran sufrir pero ya que que sea feliz por mientras

ALDAIR KCHUDO 

Qué lindo es el amor ❤️
`.trim();

        const mentionedJid = [who];
        const sn = createHash('md5').update(who).digest('hex');

        conn.reply(m.chat, str, m);
        conn.sendFile(m.chat, pp, 'pp.gif', str, fkontak, false, { contextInfo: { mentionedJid } });
    }
};

// Función para generar el enlace de referido único
const generateReferralLink = (userId) => {
    return `https://api.whatsapp.com/send/?phone=${userId.split('@')[0]}&text=.menu`;
};

handler.help = ['aldairgay'];
handler.tags = ['xp'];
handler.command = /^aldairgay$/i;

export default handler;

