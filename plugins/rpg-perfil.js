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

    let pp = 'https://telegra.ph/file/53f2e7e5fd7cd30d37b91.mp4'; // URL del video por defecto

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

    // Verifica si el usuario está registrado
    let user = global.db.data.users[who];
    if (!user || !user.registered) {
        // Si no está registrado, envía un mensaje y termina la ejecución
        conn.reply(m.chat, 'Debes registrarte primero usando el comando .registrar.', fkontak);
        return;
    }

    try {
        pp = await conn.getProfilePicture(who); // Obtener foto de perfil del usuario
    } catch (e) {
        // Error al obtener la foto de perfil
    } finally {
        let { name, limit, registered, regTime, age } = user;

        // Generar el enlace de referido único para el usuario
        const referralLink = generateReferralLink(who);

        let prem = global.prems.includes(who.split`@`[0]);
        let status = user.banned ? 'BANEADO' : 'LIBRE';

        let str =
`
[#URABE_MIKOTO]

*PERFIL COMPLETO DE* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}

*DATOS GENERALES*

*[🙎‍♂️] ID →* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
*[🗒] NOMBRES →*  ${conn.getName(who)}
*[💎] DIAMANTES →*  ${limit}
*[〽️] PREMIUM →*  ${prem ? '✅' : '❎'}
*[👺] ESTADO →*  ${status}
*[🔗] ENLACE DE REFERIDO →*  https://api.whatsapp.com/send/?phone=51973846456&text=.menu
`.trim();

        const mentionedJid = [who];
        const sn = createHash('md5').update(who).digest('hex');

        conn.sendFile(m.chat, pp, 'pp.gif', str, fkontak, false, { contextInfo: { mentionedJid } });
    }
};

// Función para generar el enlace de referido único
const generateReferralLink = (userId) => {
    return `https://api.whatsapp.com/send/?phone=${userId.split('@')[0]}&text=.menu`;
};

handler.help = ['perfil [@usuario]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
