import { Socket, Server } from 'socket.io'
import { EmailIsBusy, IncorrectPassword, InvalidRole, LoginIsBusy, UserNotFoundByLogin } from '../Errors'
import { UserData, LoginData, RegisterData } from './Types'
import UserManager from '../Managers/UserManager'
import User from '../Database/Models/User.model'
import Role from '../Database/Models/Role.model'

export default function Auth(socket: Socket, server: Server) {
    
    async function login(data: LoginData, callback: (msg: string, status: boolean) => void) {
        const { login, password } = data
    
        if (socket.data.isAuth) {
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

    async function register(data: RegisterData, callback: (msg: string, status: boolean) => void) {
        const { login, email, password } = data

        if (socket.data.isAuth) {
            callback('already logged in', false)
        }

        try {
            console.log(data)
            const user: User = await UserManager.createUser(login, email, password, 1)

            callback('registered successfully', true)
        }
        catch (err) {
            console.log(err)
            if (err instanceof LoginIsBusy) {
                callback('login is busy', false)
            }
            else if (err instanceof EmailIsBusy) {
                callback('email is busy', false)
            }
            else if (err instanceof InvalidRole) {
                callback('invalid role', false)
            }
        }
    }

    async function createRole(name: string, callback: (msg: string, status: boolean) => void) {
        try {
            const role = await Role.create({ name })
            callback('role successfully', true)
        }
        catch (err) {
            callback('role already exists', false)
        }
    }

    async function newReauthToken(callback: (msg: string, status: boolean) => void) {
        const token = socket.data.user.reauthenticationTokens[0]
        callback(token, true)
    }

    return {
        login,
        register,
        createRole
    }
}