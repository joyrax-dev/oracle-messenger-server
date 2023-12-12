import { Socket, Server } from 'socket.io'
import ChatManager from '../Managers/ChatManager'
import ParticipantManager from '../Managers/ParticipantManager'
import Chat from '../Database/Models/Chat.model'
import { AllChatsData, ChatInfoData, GetChatInfoData, JoinChatData, NewPrivateChatData } from './Types'
import { ParticipantNotFoundByChatIdAndUserId, UserHasAlreadyJoinedTheChatRoom, YouAreNotLoggedIn } from '../Errors'
import Participant from '../Database/Models/Participant.model'

export default function Chats(socket: Socket, server: Server) {

    async function newPrivateChat(data: NewPrivateChatData, callback: (data: ChatInfoData, code: number, status: boolean) => void) {
        try {
            if (!socket.data.isAuth) {
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
    async function getChatsByUserId(userId: number, callback: (data: AllChatsData, code: number, status: boolean) => void) {
        try {
            if (!socket.data.isAuth) {
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
            callback(null, -1, false)
        }
    }

    async function getChatInfo(data: GetChatInfoData, callback: (data: ChatInfoData, code: number, status: boolean) => void) {
        try {
            if (!socket.data.isAuth) {
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

    async function joinChat(data: JoinChatData, callback: (code: number, status: boolean) => void) {
        try {
            const { chatId, userId } = data

            if (!socket.data.isAuth || socket.data.user.id !== userId) {
                callback(YouAreNotLoggedIn.code, false)
                return
            }

            await ParticipantManager.getParticipantByChatIdAndUserId(chatId, userId)

            const roomName = 'chat:' + chatId

            if(socket.rooms.has(roomName)) {
                callback(UserHasAlreadyJoinedTheChatRoom.code, false)
            }
            else {
                socket.join(roomName)
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

    return {
        newPrivateChat,
        getChatsByUserId,
        getChatInfo,
        joinChat
    }
}