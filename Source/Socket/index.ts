import { Socket, Server } from 'socket.io'
import { createServer } from 'http'
import Auth from './Auth'
import { UserData } from './Types'
import { ExtendedError } from 'socket.io/dist/namespace'

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
    
        const authHandlers = Auth(socket, ioServer)
        socket.on('login', authHandlers.login)
        socket.on('register', authHandlers.register)
        socket.on('createRole', authHandlers.createRole)
    })
    
    httpServer.listen(config.port, config.hostname, () => {
        console.info(`Server is running on ${config.type}://${config.hostname}:${config.port}`)
    })
}