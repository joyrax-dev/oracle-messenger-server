import { Socket, Server } from 'socket.io'
import Controller from './Controller'
import {
     LoginCallbackData, 
     LoginData, 
     ReLoginData, 
     RegisterData
} from './Types'
import {
    AlreadyLoggedIn,
    UserNotFoundByLogin,
    IncorrectPassword,
    ReLoginTokenNotFoundByUserIdAndToken,
    UserNotFoundById,
    LoginIsBusy,
    EmailIsBusy,
    InvalidRole
} from '../Errors'
import Session from '../Database/Models/Session.model'
import User from '../Database/Models/User.model'
import UserManager from '../Managers/UserManager'
import ReLoginTokenManager from '../Managers/ReLoginTokenManager'

export default class AuthController extends Controller {
    constructor(server: Server, socket: Socket) {
        super(server, socket)

        this.socket.on('login', this.login.bind(this))
        this.socket.on('reLogin', this.reLogin.bind(this))
        this.socket.on('register', this.register.bind(this))
    }

    async login(data: LoginData, callback: (data: LoginCallbackData, code: number, status: boolean) => void): Promise<void> {
        try {
            const { login, password, userAgent, isNextReLogin } = data
            const session: Session = await Session.findOne({ where: { socketId: this.socket.id } })

            if (session.isLogin) {
                callback({ userId: session.userId, token: null, isNextReLogin: false }, AlreadyLoggedIn.code, false)
                return
            }

            const user: User = await UserManager.authenticateUser(login, password)

            session.isLogin = true
            session.userId = user.id
            session.save()

            if (isNextReLogin) {
                const newToken = await ReLoginTokenManager.createToken(user.id, userAgent)

                callback({ userId: user.id, token: newToken.token, isNextReLogin: true }, 0, true)
            }
            else {
                callback({ userId: user.id, token: null, isNextReLogin: false }, 0, true)
            }
        }
        catch (error) {
            if (error instanceof UserNotFoundByLogin) {
                callback(null, UserNotFoundByLogin.code, false)
            }
            else if (error instanceof IncorrectPassword) {
                callback(null, IncorrectPassword.code, false)
            }
            else {
                // TODO: Добавить логирование не известных ошибок
                callback(null, -1, false)
            }
        }
    }

    async reLogin(data: ReLoginData, callback: (data: LoginCallbackData, code: number, status: boolean) => void): Promise<void> {
        try {
            // TODO: Добавить проверку времени создания токена, что бы понять он действителен или нет
            const { userId, token, userAgent, isNextReLogin } = data
            const session: Session = await Session.findOne({ where: { socketId: this.socket.id } })

            if (session.isLogin) {
                callback({ userId: session.userId, token: null, isNextReLogin: false }, AlreadyLoggedIn.code, false)
                return
            }

            const currentToken = await ReLoginTokenManager.getTokenByUserIdAndValue(userId, token)

            if (currentToken.userAgent === userAgent) {
                session.isLogin = true
                session.userId = userId
                session.save()

                await currentToken.destroy()
                
                if (isNextReLogin) {
                    const newToken = await ReLoginTokenManager.createToken(userId, userAgent)

                    callback({ userId, token: newToken.token, isNextReLogin: true }, 0, true)
                }
                else {
                    callback({ userId, token: null, isNextReLogin: false }, 0, true)
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
            else {
                // TODO: Добавить логирование не известных ошибок
                callback(null, -1, false)
            }
        }
    }

    async register(data: RegisterData, callback: (code: number, status: boolean) => void): Promise<void> {
        try {
            const { login, email, password } = data
            const session: Session = await Session.findOne({ where: { socketId: this.socket.id } })

            if (session.isLogin) {
                callback(AlreadyLoggedIn.code, false)
                return
            }

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
            else {
                // TODO: Добавить логирование не известных ошибок
                callback(-1, false)
            }
        }
    }
}