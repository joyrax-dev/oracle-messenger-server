import { Socket, Server } from 'socket.io'
import { createServer } from 'http'
import Auth from './Auth'
import Chats from './Chats'
import { UserData } from './Types'
import { ExtendedError } from 'socket.io/dist/namespace'
import ParticipantManager from '../Managers/ParticipantManager'
import MessageManager from '../Managers/MessageManager'
import Message from '../Database/Models/Message.model'
import AuthUsersStore from './AuthUsersStore'
import ChatController from './ChatController'

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

    ioServer.on('connection', (socket: Socket) => {
        console.log('User connected')
        socket.data = {
            isAuth: false,
            user: null
        } as UserData

        socket.on('disconnect', () => {
            AuthUsersStore.delBySocketId(socket.id)
        });
    
        const authHandlers = Auth(socket, ioServer)
        socket.on('login', authHandlers.login)
        socket.on('reLogin', authHandlers.reLogin)
        socket.on('register', authHandlers.register)
        socket.on('createRole', authHandlers.createRole)

        // const chatHandlers = Chats(socket, ioServer)
        // socket.on('newPrivateChat', chatHandlers.newPrivateChat)
        // socket.on('getChatsByUserId', chatHandlers.getChatsByUserId)
        // socket.on('getChatInfo', chatHandlers.getChatInfo)
        // socket.on('joinChat', chatHandlers.joinChat)

        const chatController = new ChatController(ioServer, socket)
    })

    ioServer.of("/").adapter.on("join-room", async (room, id) => {
        try {
            if (AuthUsersStore.getBySocketId(id) === null) {
                return
            }
            const userId: number = AuthUsersStore.getBySocketId(id).userId
            const chatId: number = parseInt(room.split(":")[1])

            await ParticipantManager.getParticipantByChatIdAndUserId(chatId, userId)
            const messages: Message[] = await MessageManager.getMessagesByChatId(chatId, 30)

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