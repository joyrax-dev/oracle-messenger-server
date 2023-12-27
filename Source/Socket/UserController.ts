import { Socket, Server } from 'socket.io'
import ChatManager from '../Managers/ChatManager'
import ParticipantManager from '../Managers/ParticipantManager'
import Chat from '../Database/Models/Chat.model'
import {
     AllChatsData, 
     ChatInfoData, 
     GetChatInfoData, 
     GetUserInfoCallbackData, 
     GetUserInfoData, 
     JoinChatData, 
     NewPrivateChatData, 
     SendMessageCallbackData, 
     SendMessageData} from './Types'
import { 
    ParticipantNotFoundByChatIdAndUserId, 
    TheUserHasNotJoinedTheChatRoom, 
    UserHasAlreadyJoinedTheChatRoom, 
    YouAreNotLoggedIn } from '../Errors'
import Participant from '../Database/Models/Participant.model'
import UserManager from '../Managers/UserManager';
import Message from '../Database/Models/Message.model';
import User from '../Database/Models/User.model'

export default class UserController {
    private server: Server
    private socket: Socket

    constructor(server: Server, socket: Socket) {
        this.server = server
        this.socket = socket

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