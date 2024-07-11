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

    let users = Object.entries(global.db.data.users)
        .filter(([_, user]) => user.registered) // Filtra solo los usuarios registrados
        .sort(([, a], [, b]) => b.limit - a.limit) // Ordena por diamantes en orden descendente
        .slice(0, 10); // Toma los 10 usuarios con más diamantes

    if (users.length === 0) {
        conn.reply(m.chat, 'No hay usuarios registrados.', fkontak);
        return;
    }

    let str = '*TOP DE DIAMANTES*\n\n';
    users.forEach(([jid, user], index) => {
        str += `${index + 1}) ${conn.getName(jid)} - ${user.limit} 💎 - ${PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')}\n`;
    });

    conn.reply(m.chat, str, fkontak);
};

handler.help = ['topdiamantes'];
handler.tags = ['xp'];
handler.command = /^topdiamantes$/i;

export default handler;
