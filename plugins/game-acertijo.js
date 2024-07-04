import fs from 'fs';

let timeout = 30000; // Tiempo límite en milisegundos (30 segundos)
let points = 1; // Diamantes que se otorgan al resolver el acertijo

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let chatId = m.chat;

    // Verificar si ya hay un acertijo en curso en este chat
    if (chatId in conn.tekateki) {
        conn.reply(m.chat, 'Todavía hay acertijos sin responder en este chat', conn.tekateki[chatId][0]);
        throw false;
    }

    // Lista de acertijos
    const acertijos = [
        {
            question: "¿Qué cosa se rompe siempre que se nombra?",
            response: "El silencio"
        },
        {
            question: "¿Qué tiene llaves pero no abre puertas?",
            response: "Un piano"
        },
        {
            question: "¿Qué corre todo el día sin moverse?",
            response: "El reloj"
        },
        {
            question: "¿Qué tiene dientes pero no puede morder?",
            response: "El peine"
        },
        {
            question: "¿Qué tiene ojos pero no puede ver?",
            response: "La aguja"
        },
        {
            question: "¿Qué tiene cama pero no duerme?",
            response: "El río"
        },
        {
            question: "¿Qué se puede ver pero no se puede tocar?",
            response: "El horizonte"
        },
        {
            question: "¿Qué sube y baja pero nunca se mueve?",
            response: "Las escaleras"
        },
        {
            question: "¿Qué tiene cabeza y no tiene cuerpo?",
            response: "El clavo"
        },
        {
            question: "¿Qué es más grande cuanto más lo usas?",
            response: "El agujero"
        },
        {
            question: "¿Qué va por la ciudad pero nunca sale de ella?",
            response: "La calle"
        },
        {
            question: "¿Qué palabra se escribe incorrectamente en todos los diccionarios?",
            response: "Incorrectamente"
        },
        {
            question: "¿Qué tiene ciudades pero no tiene casas, ríos pero no tiene agua, y montañas pero no tiene árboles?",
            response: "El mapa"
        },
        {
            question: "¿Qué corre pero no tiene piernas?",
            response: "El agua"
        },
        {
            question: "¿Qué tiene corazón pero no tiene vida?",
            response: "La sandía"
        }
    ];

    // Elegir un acertijo aleatorio
    let randomIndex = Math.floor(Math.random() * acertijos.length);
    let acertijo = acertijos[randomIndex];
    let respuesta = acertijo.response;
    let pista = respuesta.replace(/[A-Za-z]/g, '_'); // Convertir la respuesta en una pista (sustituir letras por _)

    let caption = `
ⷮ *${acertijo.question}*

*• Tiempo:* ${(timeout / 1000).toFixed(2)} segundos
*• Bono:* +${points} ${limit}
`.trim();

    // Enviar el acertijo al chat y guardar el estado en conn.tekateki
    conn.tekateki[chatId] = [
        await conn.reply(m.chat, caption, m),
        acertijo,
        points,
        setTimeout(async () => {
            if (conn.tekateki[chatId]) {
                await conn.reply(m.chat, `Se acabó el tiempo!\n*Respuesta:* ${respuesta}`, conn.tekateki[chatId][0]);
                delete conn.tekateki[chatId];
            }
        }, timeout)
    ];
};

// Manejador para verificar la respuesta al acertijo
handler.onMessage = async (m, { conn }) => {
    if (!conn.tekateki) return;
    let chatId = m.chat;
    if (!(chatId in conn.tekateki)) return;
    let [msg, acertijo, puntos, timeout] = conn.tekateki[chatId];

    // Convertir la respuesta a minúsculas para evitar problemas de capitalización
    let userAnswer = m.text.toLowerCase().trim();
    let respuesta = acertijo.response.toLowerCase();

    // Verificar si la respuesta del usuario es correcta
    if (userAnswer === respuesta) {
        // Respuesta correcta
        await conn.reply(m.chat, `¡Respuesta correcta!\n¡Has ganado *${points} ${limit}* como recompensa!`, msg);
        delete conn.tekateki[chatId];
    } else {
        // Respuesta incorrecta
        await conn.reply(m.chat, `Respuesta incorrecta. ¡Inténtalo de nuevo!`, msg);
    }
};

handler.help = ['acertijo'];
handler.tags = ['game'];
handler.command = /^(acertijo|acert|adivinanza|tekateki)$/i;

export default handler;
