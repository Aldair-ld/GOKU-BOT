import fetch from 'node-fetch';

var handler = async (m, { conn, text }) => {
  let fkontak = { 
    "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, 
    "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }},
    "participant": "0@s.whatsapp.net" 
  };

  let user = global.db.data.users[m.sender];
  if (!user || !user.registered) {
    return await conn.reply(m.chat, 'Debes registrarte primero usando el comando .inicio  para guiarte', fkontak);
  }

  let cooldown = 30 * 60 * 1000; // 30 minutos en milisegundos
  let time = user.lastJob + cooldown;

  if (new Date() - user.lastJob < cooldown) 
    return await conn.reply(m.chat, `ESPERA ${Math.ceil((time - new Date()) / 1000 / 60)} MINUTOS PARA VOLVER A USAR ESTE COMANDO`, fkontak, m);

  if (!text) throw `INGRESA UN TRABAJO DISPONIBLE:\n\nProgramador\nTécnico\nPanadero\nPolicía\nMecánico\nDoctor\nCarpintero`;

  let jobs = {
    'programador': 5,
    'tecnico': 5,
    'panadero': 4,
    'policia': 4,
    'mecanico': 3,
    'doctor': 2,
    'carpintero': 1
  };

  let job = text.toLowerCase();
  if (!jobs[job]) throw `TRABAJO NO DISPONIBLE. ELIGE UNO DE LA LISTA:\n\nProgramador\nTécnico\nPanadero\nPolicía\nMecánico\nDoctor\nCarpintero`;

  let diamonds = jobs[job];
  user.diamonds = (user.diamonds || 0) + diamonds;
  user.lastJob = new Date() * 1;

  await conn.reply(m.chat, `¡FELICIDADES! HAS TRABAJADO COMO ${job.toUpperCase()} Y HAS GANADO ${diamonds} 💎`, fkontak, m);
};

handler.help = ['trabajos'];
handler.tags = ['economy'];
handler.command = /^trabajos$/i;
handler.group = true;

export default handler;
