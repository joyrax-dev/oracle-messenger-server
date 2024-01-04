import Message from "../Database/Models/Message.model";
import { MessageNotFoundById } from "../Errors";
import ChatManager from "./ChatManager";
import UserManager from "./UserManager";


export default class MessageManager {

    public static async createMessage(chatId: number, senderId: number, text: string): Promise<Message> {
        await UserManager.getUserById(senderId)
        await ChatManager.getChatById(chatId)

        const message = await Message.create({
            chatId,
            senderId,
            text
        });

        return message
    }

    public static async deleteMessage(msgId: number): Promise<boolean> {
        const message = await Message.destroy({  where: { id: msgId } })

        if (message === 0) return false
        else return true
    }

    public static async getMessageById(msgId: number): Promise<Message> {
        const message = await Message.findByPk(msgId)

        if (!message) {
            throw new MessageNotFoundById()
        }

        return message
    }

    public static async getMessagesByChatId(chatId: number, limit: number, offset: number): Promise<Message[]> {
        await ChatManager.getChatById(chatId)

        const messages = await Message.findAll({
            where: {
                chatId
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return messages
    }
}