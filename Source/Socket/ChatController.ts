import { Socket, Server } from 'socket.io'
import ChatManager from '../Managers/ChatManager'
import ParticipantManager from '../Managers/ParticipantManager'
import Chat from '../Database/Models/Chat.model'
import {
     AllChatsData, 
     ChatInfoData, 
     ChatUsersData, 
     GetChatInfoData, 
     GetChatUsersData, 
     JoinChatData, 
     LoadMessagesCallbackData, 
     LoadMessagesData, 
     NewPrivateChatData, 
     SendMessageCallbackData, 
     SendMessageData} from './Types'
import { 
    ParticipantNotFoundByChatIdAndUserId, 
    TheUserHasNotJoinedTheChatRoom, 
    UserHasAlreadyJoinedTheChatRoom, 
    YouAreNotLoggedIn, 
    YouAreNotJoinedTheChatRoom} from '../Errors'
import Participant from '../Database/Models/Participant.model'
import MessageManager from '../Managers/MessageManager';
import Message from '../Database/Models/Message.model';

export default class ChatController {
    private server: Server
    private socket: Socket

    constructor(server: Server, socket: Socket) {
        this.server = server
        this.socket = socket

        this.socket.on('newPrivateChat', this.newPrivateChat.bind(this))
        this.socket.on('getChatsByUserId', this.getChatsByUserId.bind(this))
        this.socket.on('getChatInfo', this.getChatInfo.bind(this))
        this.socket.on('joinChat', this.joinChat.bind(this))
        this.socket.on('sendMessage', this.sendMessage.bind(this))
        this.socket.on('getChatUsers', this.getChatUsers.bind(this))
        this.socket.on('loadMessages', this.loadMessages.bind(this))
    }

    async newPrivateChat(data: NewPrivateChatData, callback: (data: ChatInfoData, code: number, status: boolean) => void) {
        try {
            if (!this.socket.data.isAuth) {
                callback(null, YouAreNotLoggedIn.code, false)
                return
            }

            const { firstUserId, secondUserId } = data

            const newChat: Chat = await ChatManager.createPrivateChat(firstUserId, secondUserId)

            const firstUserParticipant: Participant = await ParticipantManager.createParticipant(newChat.id, firstUserId)
            const secondUserParticipant: Participant  = await ParticipantManager.createParticipant(newChat.id, secondUserId)

            const chatInfo: ChatInfoData = {
                chatId: newChat.id,
                chatName: newChat.name,
                chatParticipants: [firstUserParticipant.id, secondUserParticipant.id]
            }

            callback(chatInfo, 0, true)
        }
        catch(error) {
            callback(null, -1, false)
        }
    }
    async getChatsByUserId(userId: number, callback: (data: AllChatsData, code: number, status: boolean) => void) {
        try {
            if (!this.socket.data.isAuth) {
                callback(null, YouAreNotLoggedIn.code, false)
                return
            }

            const chats: Chat[] = await ChatManager.getAllChatsByUserId(userId)

            const data = { chats: [] }
            for (const chat of chats) {
                data.chats.push(chat.id)
            }

            callback(data, 0, true)
        }
        catch (error) {
            console.log(error)
            callback(null, -1, false)
        }
    }

    async getChatInfo(data: GetChatInfoData, callback: (data: ChatInfoData, code: number, status: boolean) => void) {
        try {
            if (!this.socket.data.isAuth) {
                callback(null, YouAreNotLoggedIn.code, false)
                return
            }

            const chat: Chat = await ChatManager.getChatById(data.chatId)

            await ParticipantManager.getParticipantByChatIdAndUserId(chat.id, data.userId)
            const chatParticipants: Participant[] = await ParticipantManager.getAllParticipantsByChatId(chat.id)
            
            const chatInfo: ChatInfoData = {
                chatId: chat.id,
                chatName: chat.name,
                chatParticipants: chatParticipants.map(participant => participant.id)
            }

            callback(chatInfo, 0, true)
        }
        catch(error) {
            if (error instanceof ParticipantNotFoundByChatIdAndUserId) {
                callback(null, ParticipantNotFoundByChatIdAndUserId.code, false)
            }
            else {
                callback(null, -1, false)
            }
        }
    }

    async joinChat(data: JoinChatData, callback: (code: number, status: boolean) => void) {
        try {
            const { chatId, userId } = data

            if (!this.socket.data.isAuth || this.socket.data.user.id !== userId) {
                callback(YouAreNotLoggedIn.code, false)
                return
            }

            await ParticipantManager.getParticipantByChatIdAndUserId(chatId, userId)

            const roomName = 'chat:' + chatId

            if(this.socket.rooms.has(roomName)) {
                callback(UserHasAlreadyJoinedTheChatRoom.code, true)
            }
            else {
                this.socket.join(roomName)
                callback(0, true)
            }
        }
        catch(error) {
            if (error instanceof ParticipantNotFoundByChatIdAndUserId) {
                callback(ParticipantNotFoundByChatIdAndUserId.code, false)
            }
            else {
                callback(-1, false)
            }
        }
    }

    async sendMessage(data: SendMessageData, callback: (data: SendMessageCallbackData, code: number, status: boolean) => void) {
        try {
            const { chatId, userId, text } = data

            if (!this.socket.data.isAuth || this.socket.data.user.id !== userId) {
                callback(null, YouAreNotLoggedIn.code, false)
                return
            }

            if (!this.socket.rooms.has('chat:' + chatId)) {
                callback(null, TheUserHasNotJoinedTheChatRoom.code, false)
                return
            }

            const message: Message = await MessageManager.createMessage(chatId, userId, text)

            console.log('send to room: ' + 'chat:' + chatId)
            console.log('socket in rooms : ')
            this.socket.rooms.forEach(room => console.log(room))
            
            this.socket.to('chat:' + chatId).emit('newMessage', {
                chatId,
                message
            })
            callback({ message, chatId }, 0, true)

        }
        catch(error) {
            callback(null, -1, false)
        }
    }

    async getChatUsers(data: GetChatUsersData, callback: (data: ChatUsersData, code: number, status: boolean) => void) {
        try {
            if (!this.socket.data.isAuth) {
                callback(null, YouAreNotLoggedIn.code, false)
                return
            }

            const chat: Chat = await ChatManager.getChatById(data.chatId)

            const chatParticipants: Participant[] = await ParticipantManager.getAllParticipantsByChatId(chat.id)

            const currentUser = chatParticipants.find(participant => participant.userId === data.senderId)

            if (!currentUser) {
                callback(null, YouAreNotJoinedTheChatRoom.code, false)
            }

            const usersIds: number[] = []

            chatParticipants.forEach(participant => { //.filter(participant => participant.id === data.senderId)
                usersIds.push(participant.userId)
            })

            callback({ chatId: chat.id, usersIds }, 0, true)
        }
        catch(error) {
            callback(null, -1, false)
        }
    }

    async loadMessages(data: LoadMessagesData, callback: (data: LoadMessagesCallbackData, code: number, status: boolean) => void) {
        try {
            if (!this.socket.data.isAuth) {
                callback(null, YouAreNotLoggedIn.code, false)
                return
            }

            const { chatId, senderId, limit, offset } = data

            await ParticipantManager.getParticipantByChatIdAndUserId(chatId, senderId)

            const messages: Message[] = await MessageManager.getMessagesByChatId(chatId, limit, offset)

            callback({ chatId, messages }, 0, true)
        }
        catch(error) {
            callback(null, -1, false)
        }
    }
}