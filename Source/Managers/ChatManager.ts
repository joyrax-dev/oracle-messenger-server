import User from "../Database/Models/User.model"
import Chat from "../Database/Models/Chat.model"
import Participant from "../Database/Models/Participant.model"

import UserManager from "./UserManager"

export default class ChatManager {
    public static async createPrivateChat(userId1: number, userId2: number) {
        const firstUser = await UserManager.getUserById(userId1)
        const secondUser = await UserManager.getUserById(userId2)

        const chat = await Chat.create({
            name: 'Private Chat Between ' + firstUser.login + ' and ' + secondUser.login,
            type: 'private'
        })

        await Participant.create({
            userId: firstUser.id,
            chatId: chat.id,
            roleId: firstUser.roleId
        })

        await Participant.create({
            userId: secondUser.id,
            chatId: chat.id,
            roleId: secondUser.roleId
        })

        // TODO: add error handling
        return chat
    }

    public static async createGroupChat(name: string, usersId: number[]) {
        const chat = await Chat.create({
            name,
            type: 'group'
        })

        for (const userId of usersId) {
            await Participant.create({
                userId,
                chatId: chat.id,
                roleId: 0
            })
        }

        return chat
    }

    public static async deleteChat(chatId: number) {
        const participants = await Participant.findAll({
            where: {
                chatId: chatId
            }
        })

        for (const element of participants) {
            await element.destroy()
        }

        const chat = await ChatManager.getChatById(chatId)
        chat.destroy()
    }

    public static async getChatById(chatId: number) {
        const chat = await Chat.findByPk(chatId)

        return chat
    }
}