const { MessageType } = require('@adiwajshing/baileys');

// Base de datos simulada (puedes usar una base de datos real como MongoDB o SQLite)
let users = {};

// Número de teléfono del bot (debes configurar esto con el número real del bot)
const botNumber = '51973846456'; // Ejemplo, reemplaza con el número real del bot

// Función para generar un ID único (simulación)
const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9); // Genera un ID aleatorio de 9 caracteres
};

// Generador de enlaces de referidos únicos
const generateReferralLink = (userId) => {
    return `https://api.whatsapp.com/send/?phone=${botNumber}&text=.registro%20${userId}`;
};

// Comando para mostrar el enlace de referidos único y número de referidos
const handleReferCommand = async (message, conn) => {
    const userId = message.sender;

    // Verificar si el usuario existe en la base de datos
    if (!users[userId]) {
        users[userId] = {
            referrals: [], // Inicializar lista de referidos
            diamonds: 0, // Inicializar diamantes del usuario
            referralCode: generateUniqueId(), // Generar código de referido único para el usuario
        };
    }

    // Generar enlace de referido único para el usuario actual
    const referralLink = generateReferralLink(users[userId].referralCode);

    // Mostrar mensaje con el enlace de referidos único y número de referidos
    const responseMessage = `
🔗 ¡Bienvenido al sistema de referidos!

Tu enlace de referidos: ${referralLink}
Número de referidos: *${users[userId].referrals.length}*

Invita a tus amigos usando tu enlace de referidos y gana recompensas.
    `.trim();

    // Enviar mensaje al usuario
    conn.sendMessage(message.chat, responseMessage, MessageType.text);
};

// Manejador para cuando alguien se registra usando un enlace de referido
const handleReferralLink = async (message, conn) => {
    const referredUserId = message.text.split(' ')[1];
    const referrerUserId = message.sender;

    // Verificar si el código de referido es válido y si el usuario refirió existe
    if (!referredUserId || !users[referrerUserId] || !users[referredUserId]) {
        return conn.sendMessage(message.chat, 'Enlace de referido inválido.', MessageType.text);
    }

    // Verificar si el usuario ya ha sido referido previamente
    if (users[referrerUserId].referrals.includes(referredUserId)) {
        return conn.sendMessage(message.chat, 'Ya has referido a este usuario anteriormente.', MessageType.text);
    }

    // Registrar el nuevo referido y otorgar recompensa de 50 diamantes al usuario que refirió
    users[referrerUserId].referrals.push(referredUserId);
    users[referrerUserId].diamonds += 50;

    // Mostrar mensaje de confirmación al usuario que usó el enlace
    const confirmationMessage = `
🎉 ¡Te has registrado exitosamente como referido!

Has ganado *50 diamantes* como recompensa para ${users[referrerUserId].name}.
    `.trim();

    // Enviar mensaje al usuario que usó el enlace
    conn.sendMessage(message.chat, confirmationMessage, MessageType.text);
};

// Ejemplo de uso en un bot de WhatsApp (pseudocódigo)
const handleIncomingMessage = async (message, conn) => {
    const text = message.text.toLowerCase();

    if (text.startsWith('/referir')) {
        // Manejar comando para obtener enlace de referido
        handleReferCommand(message, conn);
    } else if (text.startsWith('/registro')) {
        // Manejar uso de enlace de referido
        handleReferralLink(message, conn);
    }
};

module.exports = {
    handleIncomingMessage
};
