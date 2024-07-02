import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://tinyurl.com/2qc7epme')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]

  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = `*HOLA @user TE SALUDA 𝚄𝚁𝙰𝙱𝙴 - 𝙼𝙸𝙺𝙾𝚃𝙾 UN BOT CREADO POR EL DE LA FOTO 
    
DISFRUTA DE ESTE HERMOSO GRUPO`
    
await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal, estilo)
  }
  
  if (chat.bienvenida && m.messageStubType == 28) {
    let bye = `@user salio del mejor grupo`
await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal, estilo)
  }
  
  if (chat.bienvenida && m.messageStubType == 32) {
    let kick = `@user salio del mejor grupo`
await conn.sendAi(m.chat, botname, textbot, kick, img, img, canal, estilo)
}}
