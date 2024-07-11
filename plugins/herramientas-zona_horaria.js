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
    return await conn.reply(m.chat, `ESPERA UNOS SEGUNDOS PARA USAR OTRO COMANDO NO HAGA SPAM`, fkontak, m);

  if (!text) throw `INGRESE EL NOMBRE DE UNA CIUDAD O PAIS PARA CONSULTAR EL CLIMA`;

  let city = text.trim();
  let start = `*🌤️ ¡¡Empezando búsqueda del clima del pais proporcionado!! 🌤️*`;
  await conn.sendMessage(m.chat, { text: `${start}` }, { quoted: m });

  try {
    // Llama a la API de OpenWeatherMap para obtener la información del clima
    let weatherApiKey = '579422e22c456810f1a7a2c3b9bbf1f1'; // Clave API de OpenWeatherMap
    let weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=es`);
    let weatherData = await weatherResponse.json();

    if (weatherData.cod === 200) {
      let { name, sys: { country }, weather, main: { temp, humidity }, wind: { speed }, coord: { lat, lon } } = weatherData;
      let description = weather[0].description;

      // Llama a la API de TimezoneDB para obtener la hora local
      let timezoneApiKey = 'OWWFN7FDDCQP'; // Clave API de TimezoneDB
      let timezoneResponse = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`);
      let timezoneData = await timezoneResponse.json();

      if (timezoneData.status === "OK") {
        let { formatted } = timezoneData;
        
        let weatherInfo = `*_Información del clima y hora obtenida con éxito_*\n\n*Ciudad:* ${name}\n*País:* ${country}\n*Descripción:* ${description}\n*Temperatura:* ${temp}°C\n*Humedad:* ${humidity}%\n*Viento:* ${speed} m/s\n*Hora Local:* ${formatted}`;

        await conn.sendMessage(m.chat, { text: weatherInfo }, { quoted: m });
      } else {
        throw new Error(timezoneData.message);
      }
    } else {
      throw new Error(weatherData.message);
    }
  } catch (error) {
    await conn.sendMessage(m.chat, { text: `Ocurrio un Error al obtener información: ${error.message}` }, { quoted: m });
  }

  user.prue = new Date() * 1;
};

handler.help = ['clima'];
handler.tags = ['tools'];
handler.command = /^clima|weather$/i;
handler.group = true;
// handler.register = true
export default handler;

// Función auxiliar para seleccionar un elemento aleatorio de una lista
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Función auxiliar para retrasar la ejecución
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
