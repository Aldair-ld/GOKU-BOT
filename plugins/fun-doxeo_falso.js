import axios from 'axios';

let RoleReg = /\.rol\s+(.*?)\-(.*?)\-(.*)$/i;

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
    let allRoles = Object.values(global.db.data.users).filter(u => u.roleAssigned && u.jid);
    if (allRoles.length === 0) throw '✳️ No hay roles asignados.';

    let rolesText = allRoles.map((u, i) => `
    ${i + 1}. 
    🔖 *NOMBRE:* ${u.name}
    📝 *ROL:* ${u.role}
    📋 *DESCRIPCIÓN:* ${u.description}
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

  if (!RoleReg.test(text)) throw `⚠️ Formato incorrecto.\n\n✳️ Usa este comando: *${usedPrefix}rol nombre-rol-descripción*\n📌 Ejemplo: *${usedPrefix}rol* ${name2}-Moderador-Encargado de moderar las discusiones`;

  let [_, targetName, role, description] = text.match(RoleReg);

  if (!targetName) throw '✳️ El nombre no puede estar vacío.';
  if (!role) throw '✳️ El rol no puede estar vacío.';
  if (!description) throw '✳️ La descripción no puede estar vacía.';
  if (targetName.length >= 30) throw '✳️ El nombre es muy largo.';

  user.name = targetName.trim();
  user.role = role.trim(); // Actualizamos el rol aquí
  user.description = description.trim();
  user.roleTime = +new Date();
  user.roleAssigned = true;

  let txt = `
  ╭─「 \`¡Asignación de Rol Exitosa!\` 」
  │
  │🔖 *NOMBRE:* ${user.name}
  │📝 *ROL:* ${user.role}
  │📋 *DESCRIPCIÓN:* ${user.description}
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

handler.help = ['rol <nombre-rol-descripción>'];
handler.tags = ['roles'];
handler.command = ['rol', 'assignrol', 'asignarrol', 'mirol', 'veroles']; 

export default handler;
