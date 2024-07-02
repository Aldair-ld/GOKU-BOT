const { MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');

// Base de datos simulada (puedes usar una base de datos real como MongoDB o SQLite)
let db = {
    users: {}, // Aquí se almacenarán los datos de los usuarios
};

// Número de teléfono del bot (debes configurar esto con el número real del bot)
const botNumber = '51973846456'; // Ejemplo, reemplaza con el número real del bot

// Generador de enlaces de referidos únicos
const generateReferralLink = (userId) => {
    return `https://api.whatsapp.com/send/?phone=${botNumber}&text=.menu%20${userId}`;
};

// Comando para mostrar el enlace de referidos único y número de referidos
const handler = async (m, { conn }) => {
    let user = db.users[m.sender];

    if (!user) {
        user = {
            name: conn.getName(m.sender), // Obtener nombre del usuario
            referrals: [], // Inicializar lista de referidos
            diamonds: 0, // Inicializar diamantes del usuario
        };
        db.users[m.sender] = user; // Guardar nuevo usuario en la base de datos
    }

    // Generar enlace de referido único para el usuario actual
    const referralLink = generateReferralLink(m.sender);

    // Mostrar mensaje con el enlace de referidos único y número de referidos
    const message = `
🔗 ¡Bienvenido al sistema de referidos!

Tu enlace de referidos: ${referralLink}
Número de referidos: *${user.referrals.length}*

Invita a tus amigos usando tu enlace de referidos y gana recompensas.
    `.trim();

    // Enviar mensaje al usuario
    conn.sendMessage(m.chat, message, MessageType.text);
};

// Manejador para cuando alguien use un enlace de referido generado
const handleReferralLink = async (m, { conn }) => {
    // Obtener el ID de usuario del enlace de referido
    const userId = m.text.split(' ')[1];

    if (!userId || !db.users[userId]) {
        return conn.sendMessage(m.chat, 'Enlace de referido inválido.', MessageType.text);
    }

    // Añadir el usuario actual como referido del usuario que generó el enlace
    db.users[userId].referrals.push(m.sender);

    // Otorgar recompensa de 10 diamantes al usuario que generó el enlace
    db.users[userId].diamonds += 10;

    // Mostrar mensaje de confirmación al usuario que usó el enlace
    const message = `
🎉 ¡Te has registrado exitosamente como referido!

Has ganado *10 diamantes* como recompensa.
    `.trim();

    // Enviar mensaje al usuario que usó el enlace
    conn.sendMessage(m.chat, message, MessageType.text);
};

// Ayuda para los comandos
handler.help = ['referido', 'ref', 'codigo'];
handler.tags = ['referral'];
handler.command = /^referido|ref(code)?$/i;

// Manejar mensajes que contienen un enlace de referido generado
conn.on('chat-update', async (m) => {
    if (!m.hasNewMessage) return;
    const message = m.messages.all()[0];
    if (!message.message || !message.message.extendedTextMessage) return;
    const text = message.message.extendedTextMessage.text;
    if (!text.startsWith('.menu')) return;

    // Manejar el enlace de referido
    handleReferralLink(message, { conn });
});

module.exports = handler;
