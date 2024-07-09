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

  if (!text) throw `INGRESE EL NOMBRE DE UN PAÍS PARA CONSULTAR ESTADÍSTICAS ECONÓMICAS`;

  let country = text.trim();
  let start = `*🔍 ¡Empezando búsqueda de estadísticas económicas para ${country}! 🔍*`;
  await conn.sendMessage(m.chat, { text: `${start}` }, { quoted: m });

  try {
    // Llama a la API del Banco Mundial para obtener estadísticas económicas
    let gdpResponse = await fetch(`https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.MKTP.CD?format=json`);
    let gdpData = await gdpResponse.json();

    if (!gdpData[1]) throw new Error('No se encontraron datos para el país especificado');

    let latestGdpData = gdpData[1][0]; // Obtiene el dato más reciente
    let {
      country: { value: countryName },
      value: gdp,
      date: year
    } = latestGdpData;

    // Llama a la API del Banco Mundial para obtener la población
    let populationResponse = await fetch(`https://api.worldbank.org/v2/country/${country}/indicator/SP.POP.TOTL?format=json`);
    let populationData = await populationResponse.json();

    if (!populationData[1]) throw new Error('No se encontraron datos de población para el país especificado');

    let latestPopulationData = populationData[1][0]; // Obtiene el dato más reciente
    let population = latestPopulationData.value;

    // Calcula el PIB per cápita
    let gdpPerCapita = gdp / population;
    let economyStatus = gdpPerCapita < 10000 ? 'Economía en crisis' : gdpPerCapita < 40000 ? 'Economía estable' : 'Economía rica';

    let econStats = `*_Estadísticas Económicas para ${countryName} (${year})_*\n\n*PIB:* $${gdp.toLocaleString()}\n*Población:* ${population.toLocaleString()}\n*PIB per cápita:* $${gdpPerCapita.toFixed(2)}\n*Estado de la Economía:* ${economyStatus}`;

    await conn.sendMessage(m.chat, { text: econStats }, { quoted: m });
  } catch (error) {
    await conn.sendMessage(m.chat, { text: `Ocurrió un error al obtener la información: ${error.message}` }, { quoted: m });
  }

  user.prue = new Date() * 1;
};

handler.help = ['economia'];
handler.tags = ['tools'];
handler.command = /^economia|economy$/i;
handler.group = true;
// handler.register = true
export default handler;

// Función auxiliar para seleccionar un elemento aleatorio de una lista
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Función auxiliar para retrasar la ejecución
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
