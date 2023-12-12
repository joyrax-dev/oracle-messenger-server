import { Socket, Server } from 'socket.io'
import { 
    AlreadyLoggedIn, 
    EmailIsBusy, 
    IncorrectPassword, 
    InvalidRole, 
    LoginIsBusy, 
    ReLoginTokenNotFoundByUserIdAndToken, 
    RoleAlreadyExists, 
    UserNotFoundById, 
    UserNotFoundByLogin } from '../Errors'
import {
    LoginData, 
    RegisterData, 
    ReLoginData, 
    ReLoginCallbackData, 
    LoginCallbackData, 
    CreateRoleCallbackData,
    CreateRoleData} from './Types'
import UserManager from '../Managers/UserManager'
import User from '../Database/Models/User.model'
import Role from '../Database/Models/Role.model'
import AuthUsersStore from './AuthUsersStore'

export default function Auth(socket: Socket, server: Server) {
    
    async function login(data: LoginData, callback: (data: LoginCallbackData, code: number, status: boolean) => void) {
        const { login, password, userAgent, isNextReLogin } = data  
    
        if (socket.data.isAuth) {
            callback({ userId: socket.data.user.id, token: null, isNextReLogin: false }, AlreadyLoggedIn.code, false)
        }
    
        try {
            const user: User = await UserManager.authenticateUser(login, password)

            socket.data.isAuth = true
            socket.data.user = user

            if (isNextReLogin) {
                const newToken = await UserManager.createReLoginToken(user.id, userAgent)

                AuthUsersStore.set({
                    socketId: socket.id,
                    userId: user.id
                })
                callback({ userId: user.id, token: newToken.token, isNextReLogin: true }, 0, true)
            }
            else {
                AuthUsersStore.set({
                    socketId: socket.id,
                    userId: user.id
                })
                callback({ userId: user.id, token: null, isNextReLogin: false }, 0, true)
            }
        }
        catch (err) {
            if (err instanceof UserNotFoundByLogin) {
                callback(null, UserNotFoundByLogin.code, false)
            }
            else if (err instanceof IncorrectPassword) {
                callback(null, IncorrectPassword.code, false)
            }
        }
    }

    async function reLogin(data: ReLoginData, callback: (data: ReLoginCallbackData, code: number, status: boolean) => void) {
        try {
            const { userId, token, userAgent, isNextReLogin } = data
        
            const currentToken = await UserManager.getReLoginTokenByUserIdAndToken(userId, token)

            if (currentToken.userAgent === userAgent) {
                socket.data.isAuth = true
                socket.data.user = await UserManager.getUserById(userId)

                await currentToken.destroy()
                
                if (isNextReLogin) {
                    const newToken = await UserManager.createReLoginToken(userId, userAgent)

                    AuthUsersStore.set({
                        socketId: socket.id,
                        userId: userId
                    })
                    callback({ userId: userId, token: newToken.token, isNextReLogin: true }, 0, true)
                }
                else {
                    AuthUsersStore.set({
                        socketId: socket.id,
                        userId: userId
                    })
                    callback({ userId: userId, token: null, isNextReLogin: false }, 0, true)
                }
            }
        }
        catch (error) {
            if (error instanceof ReLoginTokenNotFoundByUserIdAndToken) {
                callback(null, ReLoginTokenNotFoundByUserIdAndToken.code, false)
            }
            else if (error instanceof UserNotFoundById) {
                callback(null, UserNotFoundById.code, false)
            }
        }
    }

    async function register(data: RegisterData, callback: (code: number, status: boolean) => void) {
        const { login, email, password } = data

        if (socket.data.isAuth) {
            callback(AlreadyLoggedIn.code, false)
        }

        try {
            await UserManager.createUser(login, email, password, 1)

            callback(0, true)
        }
        catch (err) {
            if (err instanceof LoginIsBusy) {
                callback(LoginIsBusy.code, false)
            }
            else if (err instanceof EmailIsBusy) {
                callback(EmailIsBusy.code, false)
            }
            else if (err instanceof InvalidRole) {
                callback(InvalidRole.code, false)
            }
        }
    }

    async function createRole(data: CreateRoleData, callback: (data: CreateRoleCallbackData, code: number, status: boolean) => void) {
        try {
            const role = await Role.create({ name: data.name })
            callback({ roleId: role.id, roleName: role.name }, 0, true)
        }
        catch (err) {
            callback(null, RoleAlreadyExists.code, false)
        }
    }

    return {
        login,
        reLogin,
        register,
        createRole,
    }
}