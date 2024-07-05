import { createHash } from 'crypto';
import axios from 'axios';

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

// Función para verificar si el usuario está registrado
function checkRegisteredUser(m) {
    let user = global.db.data.users[m.sender];
    if (!user.registered) {
        throw `✳️ Debes registrarte primero para usar este comando.\n\n📌 Usa este comando para registrarte:\n*${usedPrefix + 'reg'} nombre.edad*`;
    }
}

let handler = async(m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
    checkRegisteredUser(m); // Verificar registro antes de ejecutar el comando

    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    let pesan = args.join` `;
    let oi = `ღ ${lenguajeGB['smsAddB5']()} ${pesan}`;
    let teks = `╭━〔 *${lenguajeGB['smstagaa']()}* 〕━⬣\n\n${oi}\n\n`;
    for (let mem of participants) {
        teks += `┃⊹ @${mem.id.split('@')[0]}\n`;
    }
    teks += `┃\n`;
    teks += `┃ ${wm}\n`;
    teks += `╰━━━━━[ *𓃠 ${vs}* ]━━━━━⬣`;

    conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) });
};

handler.command = /^(tagall|invocar|invocacion|todos|invocación)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
