import { Socket, Server } from 'socket.io'
import { createServer } from 'http'
import { ExtendedError } from 'socket.io/dist/namespace'
import ParticipantManager from '../Managers/ParticipantManager'
import MessageManager from '../Managers/MessageManager'
import Message from '../Database/Models/Message.model'
import ChatController from './ChatController'
import UserController from './UserController'
import Session from '../Database/Models/Session.model'
import AuthController from './AuthController'

export const config = {
    hostname: 'localhost',
    port: 9909,
    type: 'http' // in development
}

const httpServer = createServer()
export const ioServer: Server = new Server(
    httpServer, 
    {
        cors: {
            origin: "http://localhost:8081"
        }
    }
)

export function listen() {
    ioServer.use((socket: Socket, next: (err?: ExtendedError) => void) => {
        next()
    })

    ioServer.on('connection', async (socket: Socket) => {
        console.log('Client connected:', socket.id)
        await Session.create({ socketId: socket.id })

        socket.on('disconnect', async () => {
            await (await Session.findOne({ where: { socketId: socket.id } })).destroy()
        })

        const authController = new AuthController(ioServer, socket)
        const chatController = new ChatController(ioServer, socket)
        const userController = new UserController(ioServer, socket)
    })

    ioServer.of("/").adapter.on("join-room", async (room: string, id: string) => {
        try {
            const session: Session = await Session.findOne({ where: { socketId: id } })

            if (session === null) return
            if (!room.startsWith("chat:")) return
            if (!session.isLogin) return

            const userId: number = session.userId
            const chatId: number = parseInt(room.split(":")[1])

            // Проверка на присутствие участника в чате
            await ParticipantManager.getParticipantByChatIdAndUserId(chatId, userId)

            // Получение сообщений
            const messages: Message[] = await MessageManager.getMessagesByChatId(chatId, 40, 0)

            // Отправка сообщений
            ioServer.to(id).emit("chatSetMessages", chatId, messages)
        }
        catch(error) {
            throw error
        }
    });
    
    httpServer.listen(config.port, config.hostname, () => {
        console.info(`Server is running on ${config.type}://${config.hostname}:${config.port}`)
    })
}