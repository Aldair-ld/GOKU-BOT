import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let games = {}

let handler = async (m, { conn, args, usedPrefix }) => {
    const width = 5
    const height = 5
    const mineCount = 5

    const generateBoard = (width, height, mineCount) => {
        const board = Array.from({ length: height }, () => Array(width).fill(0))
        let minesPlaced = 0

        while (minesPlaced < mineCount) {
            const x = Math.floor(Math.random() * width)
            const y = Math.floor(Math.random() * height)

            if (board[y][x] === 0) {
                board[y][x] = '💣'
                minesPlaced++

                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (x + dx >= 0 && x + dx < width && y + dy >= 0 && y + dy < height && board[y + dy][x + dx] !== '💣') {
                            board[y + dy][x + dx]++
                        }
                    }
                }
            }
        }

        return board
    }

    const boardToString = board => {
        return board.map(row => row.map(cell => (cell === 0 ? '⬜' : cell)).join(' ')).join('\n')
    }

    if (!games[m.sender]) {
        const board = generateBoard(width, height, mineCount)
        games[m.sender] = {
            board,
            discovered: Array.from({ length: height }, () => Array(width).fill(false)),
            won: false,
            lost: false,
            diamonds: 0
        }
    }

    const board = games[m.sender].board
    const boardString = boardToString(board)

    const message = {
        templateMessage: {
            hydratedTemplate: {
                hydratedContentText: `*Buscaminas*\n\n${boardString}\n\nPara jugar, selecciona una celda usando el comando:\n${usedPrefix}play x y\n\nEjemplo:\n${usedPrefix}play 1 1`,
                hydratedFooterText: 'Buena suerte!',
                hydratedButtons: [
                    {
                        quickReplyButton: {
                            displayText: 'Jugar',
                            id: `${usedPrefix}play 1 1`
                        }
                    }
                ]
            }
        }
    }

    const messageContent = generateWAMessageFromContent(m.chat, message, {})
    await conn.relayMessage(m.chat, messageContent.message, { messageId: messageContent.key.id })
}

handler.command = /^buscaminas$/i
export default handler

// Comando play para descubrir celdas
let playHandler = async (m, { conn, args, usedPrefix }) => {
    if (!games[m.sender]) return m.reply(`Primero inicia un juego usando el comando ${usedPrefix}buscaminas`)

    const x = parseInt(args[0]) - 1
    const y = parseInt(args[1]) - 1
    const game = games[m.sender]

    if (x < 0 || x >= game.board[0].length || y < 0 || y >= game.board.length) return m.reply('Coordenadas fuera del rango.')

    if (game.discovered[y][x]) return m.reply('Ya has descubierto esta celda.')

    game.discovered[y][x] = true

    if (game.board[y][x] === '💣') {
        game.lost = true
        return m.reply('¡Boom! Has perdido. Usa el comando nuevamente para iniciar un nuevo juego.')
    }

    game.diamonds += game.board[y][x] === 0 ? 1 : game.board[y][x]

    if (game.diamonds >= 5) {
        game.won = true
        global.db.data.users[m.sender].limit += game.diamonds
        return m.reply(`¡Felicidades! Has ganado el juego y has ganado ${game.diamonds} diamantes. Usa el comando nuevamente para iniciar un nuevo juego.`)
    }

    const boardToString = board => {
        return board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (game.discovered[rowIndex][colIndex] ? (cell === 0 ? '⬜' : cell) : '⬛')).join(' ')
        ).join('\n')
    }

    const boardString = boardToString(game.board)

    const message = {
        templateMessage: {
            hydratedTemplate: {
                hydratedContentText: `*Buscaminas*\n\n${boardString}\n\nDiamantes ganados: ${game.diamonds}\n\nPara jugar, selecciona una celda usando el comando:\n${usedPrefix}play x y\n\nEjemplo:\n${usedPrefix}play 1 1`,
                hydratedFooterText: 'Buena suerte!',
                hydratedButtons: [
                    {
                        quickReplyButton: {
                            displayText: 'Jugar',
                            id: `${usedPrefix}play 1 1`
                        }
                    }
                ]
            }
        }
    }

    const messageContent = generateWAMessageFromContent(m.chat, message, {})
    await conn.relayMessage(m.chat, messageContent.message, { messageId: messageContent.key.id })
}

playHandler.command = /^play$/i
export default playHandler
