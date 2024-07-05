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

// Función para obtener el nombre sin el ID completo
let toM = a => '@' + a.split('@')[0];

function handler(m, { groupMetadata }) {
    checkRegisteredUser(m); // Verificar registro antes de ejecutar el comando

    let ps = groupMetadata.participants.map(v => v.id);
    let a = ps.getRandom();
    let b;
    do {
        b = ps.getRandom();
    } while (b === a);

    m.reply(`*${toM(a)}, 𝙔𝙖 𝙚𝙨 𝙝𝙤𝙧𝙖 𝙙𝙚 𝙦𝙪𝙚 𝙩𝙚 💍 𝘾𝙖𝙨𝙚𝙨 𝙘𝙤𝙣 ${toM(b)}, 𝙇𝙞𝙣𝙙𝙖 𝙋𝙖𝙧𝙚𝙟𝙖 🤗💓*`, null, {
        mentions: [a, b]
    });
}

handler.help = ['formarpareja'];
handler.tags = ['main', 'fun'];
handler.command = ['formarpareja', 'formarparejas'];
handler.group = true;

export default handler;
