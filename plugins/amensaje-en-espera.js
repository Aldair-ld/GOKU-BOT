let handler = async (m, { conn }) => {
    if (m.action === 'add' && m.participants.includes(conn.user.jid)) {
        let pp = 'https://telegra.ph/file/53f2e7e5fd7cd30d37b91.mp4'; // URL del video de bienvenida por defecto

        // Intentar obtener la foto de perfil del nuevo miembro
        try {
            pp = await conn.getProfilePicture(m.participants[0]);
        } catch (e) {
            // Error al obtener la foto de perfil, usar la predeterminada
        }

        let participant = m.participants[0];
        let str = `¡Bienvenido/a @${participant.split('@')[0]}! 🎉

Nos alegra tenerte en nuestro grupo. Por favor, lee las reglas del grupo y disfruta de tu estancia.`;

        await conn.sendFile(m.id, pp, 'welcome.mp4', str, null, { mentions: [participant] });
    }
};

handler.group = true; // Este handler se ejecuta solo en grupos
handler.event = 'group-participants-update'; // Este handler se ejecuta cuando hay un cambio en los participantes del grupo

export default handler;
