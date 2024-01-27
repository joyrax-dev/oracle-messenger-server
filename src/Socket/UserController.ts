import { Socket, Server } from 'socket.io'
import {
    GetUserInfoCallbackData, 
    GetUserInfoData
} from './Types'
import { 
    ParticipantNotFoundByChatIdAndUserId, 
    TheUserHasNotJoinedTheChatRoom, 
    UserHasAlreadyJoinedTheChatRoom, 
    YouAreNotLoggedIn
} from '../Errors'
import UserManager from '../Managers/UserManager'
import User from '../Database/Models/User.model'
import Controller from './Controller'

export default class UserController extends Controller {
    constructor(server: Server, socket: Socket) {
        super(server, socket)

        this.socket.on('getUserInfo', this.getUserInfo.bind(this))
        this.socket.on('getUsersInfo', this.getUsersInfo.bind(this))
    }

    async getUserInfo(data: GetUserInfoData, callback: (data: GetUserInfoCallbackData, code: number, status: boolean) => void) {
        try {
            const user: User = await UserManager.getUserById(data.targetId)

            callback({ user }, 0, true)
        }
        catch(error) {
            callback(null, -1, false)
        }
    }

    async getUsersInfo(data: GetUserInfoData[], callback: (data: GetUserInfoCallbackData[], code: number, status: boolean) => void) {
        try {
            const users = []
            for(const userData of data) {
                const user: User = await UserManager.getUserById(userData.targetId)
                users.push({ user })
            }
            callback(users, 0, true)
        }
        catch(error) {
            callback(null, -1, false)
        }
    }
}