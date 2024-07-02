import { createHash } from 'crypto';
import axios from 'axios';

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender];
  let name2 = conn.getName(m.sender);

  if (user.registered === true) throw `✳️ 𝚈𝚊 𝚎𝚜𝚝á𝚜 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚊𝚍𝚘.\n\n¿𝚀𝚞𝚒𝚎𝚛𝚎𝚜 𝚟𝚘𝚕𝚟𝚎𝚛 𝚊 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚊𝚛𝚝𝚎?\n\n📌 𝚄𝚝𝚒𝚕𝚒𝚣𝚊 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚙𝚊𝚛𝚊 𝚎𝚕𝚒𝚖𝚒𝚗𝚊𝚛 𝚝𝚞 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚘:\n*${usedPrefix}unreg* <𝚂𝚎𝚛𝚒𝚊𝚕 𝚗𝚞𝚖𝚋𝚎𝚛>`;

  if (!Reg.test(text)) throw `⚠️ 𝙵𝚘𝚛𝚖𝚊𝚝𝚘 𝚒𝚗𝚌𝚘𝚛𝚛𝚎𝚌𝚝𝚘.\n\n✳️ 𝚄𝚜𝚊 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘: *${usedPrefix + command} 𝚗𝚘𝚖𝚋𝚛𝚎.𝚊ñ𝚘𝚜*\n📌 𝙴𝚓𝚎𝚖𝚙𝚕𝚘: *${usedPrefix + command}* ${name2}.16`;

  let [_, name, splitter, age] = text.match(Reg);

  if (!name) throw '✳️ 𝙴𝚕 𝚗𝚘𝚖𝚋𝚛𝚎 𝚗𝚘 𝚙𝚞𝚎𝚍𝚎 𝚎𝚜𝚝á𝚛 𝚟𝚊𝚌í𝚘.';
  if (!age) throw '✳️ 𝙻𝚊 𝚎𝚍𝚊𝚍 𝚗𝚘 𝚙𝚞𝚎𝚍𝚎 𝚎𝚜𝚝á𝚛 𝚟𝚊𝚌í𝚊.';
  if (name.length >= 30) throw '✳️ El nombre es muy largo.'; 
  age = parseInt(age);
  if (age > 100) throw 'SU EDAD ES MUY LARGA INGRESE UNA MAS CORTA ';
  if (age < 5) throw 'JAAAA QUE CHISTRIS INGRESE UNA EDAD VALIDAD ';
  
  user.name = name.trim();
  user.age = age;
  user.regTime = +new Date();
  user.registered = true;
  user.diamonds = user.diamonds || 0; // Si no tiene diamantes, inicializar a 0.
  let sn = createHash('md5').update(m.sender).digest('hex');

  let txt = `
  ╭─「 \`¡𝚁𝚎𝚐𝚒𝚜𝚝𝚛𝚘 𝙴𝚡𝚒𝚝𝚘𝚜𝚘!\` 」
  │
  │🔖 *𝙽𝙾𝙼𝙱𝚁𝙴:* ${name}
  │⏳ *𝙴𝙳𝙰𝙳:* ${age} \`Años\`
  │🔑 *𝚂𝙴𝚁𝙸𝙰𝙻 𝙽𝚄𝙼𝙱𝙴𝚁:* 
  │    ${sn}
  │💎 *𝙳𝙸𝙰𝙼𝙰𝙽𝚃𝙴𝚂:* ${user.diamonds}
  │
  │ *𝙶𝚛𝚊𝚌𝚒𝚊𝚜 𝚙𝚘𝚛 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚊𝚛𝚝𝚎* 
  │📝 𝚄𝚝𝚒𝚕𝚒𝚣𝚊 .menu  o  .menucompleto 𝚙𝚊𝚛𝚊 𝚟𝚎𝚛 𝚎𝚕 𝚖𝚎𝚗ú 𝚍𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘𝚜.
  │
  │🔒 *𝙱𝙾𝚅𝙴𝙳𝙰:* .banco
  │⚠️ *𝙰𝙳𝚅𝙴𝚁𝚃𝙴𝙽𝙲𝙸𝙰𝚂:* ${user.warn}
  │
  │
  ╰─「──────────────」
  `.trim();

  const url = "https://tinyurl.com/2zkjq56q";
  const responseImg = await axios.get(url, { responseType: 'arraybuffer' });
  await conn.sendFile(m.chat, responseImg.data, "thumbnail.png", txt, m); 
  await m.react("✅");
}

handler.help = ['reg'].map(v => v + ' <name.age>');
handler.tags = ['rg'];
handler.command = ['verify', 'reg', 'register', 'registrar']; 

export default handler;
