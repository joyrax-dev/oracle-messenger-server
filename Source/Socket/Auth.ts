import { Socket, Server } from 'socket.io'
import { IncorrectPassword, UserNotFoundByLogin } from '../Errors'
import { UserData, LoginData } from './Types'
import UserManager from '../Managers/UserManager'
import User from '../Database/Models/User.model'

export default function Auth(socket: Socket, server: Server) {
    
    async function login(data: LoginData, callback: (msg: string, status: boolean) => void) {
        const { login, password } = data
    
        if (socket.data.id) {
            callback('already logged in', false)
        }
    
        try {
            const user: User = await UserManager.authenticateUser(login, password)

            socket.data.isAuth = true
            socket.data.user = user

            callback('logged in', true)
        }
        catch (err) {
            if (err instanceof UserNotFoundByLogin) {
                callback('user not found', false)
            }
            else if (err instanceof IncorrectPassword) {
                callback('incorrect password', false)
            }
        }
    }

    return {
        login
    }
}