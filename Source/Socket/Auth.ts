import { Socket, Server } from 'socket.io'
import { EmailIsBusy, IncorrectPassword, InvalidRole, LoginIsBusy, UserNotFoundByLogin } from '../Errors'
import { UserData, LoginData, RegisterData } from './Types'
import UserManager from '../Managers/UserManager'
import User from '../Database/Models/User.model'
import Role from '../Database/Models/Role.model'

export default function Auth(socket: Socket, server: Server) {
    
    async function login(data: LoginData, callback: (userId: number, msg: string, status: boolean) => void) {
        const { login, password } = data
    
        if (socket.data.isAuth) {
            callback(socket.data.user.id, 'already logged in', false)
        }
    
        try {
            const user: User = await UserManager.authenticateUser(login, password)

            socket.data.isAuth = true
            socket.data.user = user

            callback(user.id, 'logged in', true)
        }
        catch (err) {
            if (err instanceof UserNotFoundByLogin) {
                callback(null, 'user not found', false)
            }
            else if (err instanceof IncorrectPassword) {
                callback(null, 'incorrect password', false)
            }
        }
    }

    async function register(data: RegisterData, callback: (msg: string, status: boolean) => void) {
        const { login, email, password } = data

        if (socket.data.isAuth) {
            callback('already logged in', false)
        }

        try {
            await UserManager.createUser(login, email, password, 1)

            callback('registered successfully', true)
        }
        catch (err) {
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
            await Role.create({ name })
            callback('role successfully', true)
        }
        catch (err) {
            callback('role already exists', false)
        }
    }

    async function newReauthToken(userId: number, callback: (token: string, msg: string, status: boolean) => void) {
        try {
            const token = await UserManager.generateReauthenticationToken(userId)
            await UserManager.addReauthenticationToken(userId, token)
            callback(token, 'new token successfully', true)
        }
        catch (err) {
            callback('', err.message, false)
        }
    }

    async function removeReauthToken(userId: number, token: string, callback: (msg: string, status: boolean) => void) {
        try {
            await UserManager.removeReauthenticationToken(userId, token)
            callback('removed token successfully', true)
        }
        catch (err) {
            callback(err.message, false)
        }
    }
    async function checkReauthToken(userId: number, token: string, callback: (msg: string, status: boolean) => void) {
        try {
            const result = await UserManager.checkReauthenticationToken(userId, token)
            callback(result ? 'valid token' : 'invalid token', result)
        }
        catch (err) {
            callback(err.message, false)
        }
    }

    async function loginWithToken(userId: number, token: string, callback: (userId: number, msg: string, status: boolean) => void) {
        if (socket.data.isAuth) {
            callback(socket.data.user.id, 'already logged in', false)
        }
    
        try {
            const user: User = await UserManager.getUserById(userId)

            if (user.reauthenticationTokens.includes(token)) {
                await UserManager.removeReauthenticationToken(userId, token)

                socket.data.isAuth = true
                socket.data.user = user

                callback(user.id, 'logged in', true)
            }
            else {
                callback(null, 'invalid token', false)
            }
        }
        catch (err) {
            if (err instanceof UserNotFoundByLogin) {
                callback(null, 'user not found', false)
            }
            else if (err instanceof IncorrectPassword) {
                callback(null, 'incorrect password', false)
            }
        }
    }

    return {
        login,
        register,
        createRole,
        newReauthToken,
        removeReauthToken,
        checkReauthToken,
        loginWithToken
    }
}