import fetch from 'node-fetch';

var handler = async (m, { conn, text }) => {
  let fkontak = { 
    "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, 
    "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }},
    "participant": "0@s.whatsapp.net" 
  };

  let user = global.db.data.users[m.sender];
  let time = user.prue + 10000; // 10 segundos

  if (new Date() - user.prue < 10000) 
    return await conn.reply(m.chat, `ESPERA 10 SEGUNDOS PARA USAR OTRO COMANDO NO HAGA SPAM`, fkontak, m);

  if (!text) throw `INGRESE UN NÚMERO DE RUC PARA CONSULTAR\n\n EJEMPLO: .ruc 20225116459`;

  let ruc = text.trim();
  let start = `*🔍 ¡Empezando búsqueda del RUC proporcionado! 🔍*`;
  await conn.sendMessage(m.chat, { text: `${start}` }, { quoted: m });

  try {
    // Llama a la API de APIPeru para obtener la información del RUC
    let apiUrl = `https://apiperu.dev/api/ruc/${ruc}`;
    let apiKey = '4b946aea587a05a9b5d834bccda52a0c075f088224a5f8399ae82c7440194174';
    let response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    let data = await response.json();

    if (response.status === 200) {
      let {
        razon_social,
        condicion,
        nombre_comercial,
        tipo,
        fecha_inscripcion,
        estado,
        direccion,
        sistema_emision,
        actividad_exterior,
        sistema_contabilidad,
        fecha_emision_electronica,
        fecha_ple,
        departamento,
        provincia,
        distrito,
        representante_legal
      } = data.data;

      let representanteInfo = representante_legal ? `
*Representante Legal*\n*Tipo de Documento:* ${representante_legal.tipo_documento || 'N/A'}\n*Número de Documento:* ${representante_legal.numero_documento || 'N/A'}\n*Nombres:* ${representante_legal.nombres || 'N/A'}\n*Cargo:* ${representante_legal.cargo || 'N/A'}\n*Desde:* ${representante_legal.desde || 'N/A'}
      ` : '*No hay información del representante legal.*';

      let rucInfo = `*_Información del RUC obtenida con éxito_*\n\n*RUC:* ${ruc}\n*Razón Social:* ${razon_social}\n*Condición:* ${condicion}\n*Nombre Comercial:* ${nombre_comercial}\n*Tipo:* ${tipo}\n*Fecha de Inscripción:* ${fecha_inscripcion}\n*Estado:* ${estado}\n*Dirección:* ${direccion}\n*Sistema de Emisión:* ${sistema_emision}\n*Actividad Exterior:* ${actividad_exterior}\n*Sistema de Contabilidad:* ${sistema_contabilidad}\n*Fecha de Emisión Electrónica:* ${fecha_emision_electronica}\n*Fecha PLE:* ${fecha_ple}\n*Departamento:* ${departamento}\n*Provincia:* ${provincia}\n*Distrito:* ${distrito}\n\n${representanteInfo}`;

      await conn.sendMessage(m.chat, { text: rucInfo }, { quoted: m });
    } else {
      throw new Error(data.message || 'Error desconocido');
    }
  } catch (error) {
    await conn.sendMessage(m.chat, { text: `Ocurrió un error al obtener la información: ${error.message}` }, { quoted: m });
  }

  user.prue = new Date() * 1;
};

handler.help = ['ruc'];
handler.tags = ['tools'];
handler.command = /^ruc$/i;
handler.group = true;
// handler.register = true
export default handler;

// Función auxiliar para seleccionar un elemento aleatorio de una lista
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Función auxiliar para retrasar la ejecución
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


