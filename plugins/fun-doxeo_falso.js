import { createHash } from 'crypto';
import axios from 'axios';

// Definir el número del propietario del bot
const OWNER_NUMBER = '51925015528';  // Reemplaza con tu número de WhatsApp

let RoleReg = /\|?(.*)\,(.*)\,(.*)$/i;

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender];
  let name2 = conn.getName(m.sender);

  if (command === 'mirol') {
    if (!user.roleAssigned) throw '✳️ No tienes un rol asignado.';
    let txt = `
    ╭─「 \`Tu Información de Rol\` 」
    │
    │🔖 *NOMBRE:* ${user.name}
    │📝 *ROL:* ${user.role}
    │📋 *DESCRIPCIÓN:* ${user.description}
    │🔑 *SERIAL NUMBER:* 
    │    ${user.serialNumber}
    │
    │ *Gracias por usar el bot* 
    │📝 Usa .menu para ver el menú de comandos.
    │
    ╰─「──────────────」
    `.trim();
    await m.reply(txt);
    return;
  }

  if (command === 'veroles') {
    let allRoles = Object.values(global.db.data.users).filter(u => u.roleAssigned);
    if (allRoles.length === 0) throw '✳️ No hay roles asignados.';

    let rolesText = allRoles.map((u, i) => `
    ${i + 1}. 
    🔖 *NOMBRE:* ${u.name}
    📝 *ROL:* ${u.role}
    📋 *DESCRIPCIÓN:* ${u.description}
    🔑 *SERIAL NUMBER:* ${u.serialNumber}
    📱 *WHATSAPP:* ${u.jid.replace('@s.whatsapp.net', '')}
    `).join('\n\n');

    let txt = `
    ╭─「 \`Roles Registrados\` 」
    │
    ${rolesText}
    ╰─「──────────────」
    `.trim();
    await m.reply(txt);
    return;
  }

  if (m.sender !== OWNER_NUMBER) throw '✳️ Solo el propietario del bot puede asignar roles.';

  if (!RoleReg.test(text)) throw `⚠️ Formato incorrecto.\n\n✳️ Usa este comando: *${usedPrefix + command} nombre, rol, descripción*\n📌 Ejemplo: *${usedPrefix + command}* ${name2}, Moderador, Encargado de moderar las discusiones`;

  let [_, targetName, role, description] = text.match(RoleReg);
  let targetUser = Object.values(global.db.data.users).find(u => conn.getName(u.jid) === targetName.trim());

  if (!targetUser) throw '✳️ El usuario no fue encontrado.';
  if (!targetName) throw '✳️ El nombre no puede estar vacío.';
  if (!role) throw '✳️ El rol no puede estar vacío.';
  if (!description) throw '✳️ La descripción no puede estar vacía.';
  if (targetName.length >= 30) throw '✳️ El nombre es muy largo.';

  targetUser.name = targetName.trim();
  targetUser.role = role.trim();
  targetUser.description = description.trim();
  targetUser.roleTime = +new Date();
  targetUser.roleAssigned = true;
  let sn = createHash('md5').update(targetUser.jid).digest('hex');
  targetUser.serialNumber = sn;

  let txt = `
  ╭─「 \`¡Asignación de Rol Exitosa!\` 」
  │
  │🔖 *NOMBRE:* ${targetUser.name}
  │📝 *ROL:* ${targetUser.role}
  │📋 *DESCRIPCIÓN:* ${targetUser.description}
  │🔑 *SERIAL NUMBER:* 
  │    ${sn}
  │
  │ *Gracias por asignar tu rol* 
  │📝 Usa .menu para ver el menú de comandos.
  │
  ╰─「──────────────」
  `.trim();

  const url = "https://tinyurl.com/2zkjq56q";
  const responseImg = await axios.get(url, { responseType: 'arraybuffer' });
  await conn.sendFile(m.chat, responseImg.data, "thumbnail.png", txt, m); 
  await m.react("✅");
}

handler.help = ['roles', 'mirol', 'veroles'].map(v => v + ' <nombre, rol, descripción>');
handler.tags = ['roles'];
handler.command = ['turol', 'roles', 'rol', 'assignrole', 'asignarrol', 'mirol', 'veroles']; 

export default handler;
