//let { MessageType } = require('@adiwajshing/baileys')
let { MessageType } = (await import(global.baileys)).default
//SOLO USA SI ERES EL/LA PROPIETARIO(A) DEL BOT PARA TENER TODO ILIMITADO O USA EL COMANDO PREMIUM Jajaj
let handler = async (m, { conn: natsuki }) => {
    let user = global.db.data.users[m.sender]
        natsuki.reply(m.chat, `*EXITO USTED TIENE SUS RECURSOS ILIMITADOS*`, m)
        global.db.data.users[m.sender].money = Infinity
        global.db.data.users[m.sender].limit = Infinity
        global.db.data.users[m.sender].level = Infinity
        
}
handler.help = ['cheat']
handler.tags = ['owner']
handler.command = /^(ilimitado|infiniy|chetar)$/i
handler.rowner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
//handler.money = 0

export default handler
