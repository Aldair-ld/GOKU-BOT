import { createHash } from 'crypto';
import axios from 'axios';

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender];
  let name2 = conn.getName(m.sender);

  if (user.registered === true) throw `✳️ Ya estás registrado.\n\n¿Quieres volver a registrarte?\n\n📌 Utiliza este comando para eliminar tu registro:\n*${usedPrefix}unreg* <Serial number>`;

  if (!Reg.test(text)) throw `⚠️ Formato incorrecto.\n\n✳️ Usa este comando: *${usedPrefix + command} nombre.años*\n📌 Ejemplo: *${usedPrefix + command}* ${name2}.16`;

  let [_, name, splitter, age] = text.match(Reg);

  if (!name) throw '✳️ El nombre no puede estar vacío.';
  if (!age) throw '✳️ La edad no puede estar vacía.';
  if (name.length >= 30) throw '✳️ El nombre es muy largo.';
  age = parseInt(age);
  if (age > 100) throw '✳️ La edad es muy alta, ingresa una menor.';
  if (age < 5) throw '✳️ La edad es muy baja, ingresa una válida.';
  
  user.name = name.trim();
  user.age = age;
  user.regTime = +new Date();
  user.registered = true;
  user.diamonds = user.limit; // Establece los diamantes al valor de user.limit
  let sn = createHash('md5').update(m.sender).digest('hex');

  let txt = `
  ╭─「 \`¡Registro Exitoso!\` 」
  │
  │🔖 *NOMBRE:* ${name}
  │⏳ *EDAD:* ${age} \`Años\`
  │🔑 *SERIAL NUMBER:* 
  │    ${sn}
  │💎 *DIAMANTES:* ${user.diamonds}
  │
  │ *Gracias por registrarte* 
  │📝 Utiliza .menu o .menucompleto para ver el menú de comandos.
  │
  │🔒 *BOVEDA:* .banco
  ╰─「──────────────」
  `.trim();

  const url = "https://tinyurl.com/2zkjq56q";
  const responseImg = await axios.get(url, { responseType: 'arraybuffer' });
  await conn.sendFile(m.chat, responseImg.data, "thumbnail.png", txt, m);
  await m.react("✅");
}

handler.help = ['reg'].map(v => v + ' <nombre.edad>');
handler.tags = ['rg'];
handler.command = ['verify', 'reg', 'register', 'registrar'];

export default handler;
