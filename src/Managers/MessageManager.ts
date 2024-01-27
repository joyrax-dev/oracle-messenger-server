import Message from "../Database/Models/Message.model"
import { MessageNotFoundById } from "../Errors"
import ChatManager from "./ChatManager"
import UserManager from "./UserManager"


export default class MessageManager {

    /**
     * Creates a new message and returns it.
     *
     * @param {number} chatId - The ID of the chat where the message will be created.
     * @param {number} senderId - The ID of the sender of the message.
     * @param {string} text - The text content of the message.
     * @return {Promise<Message>} The created message.
     */
    public static async createMessage(chatId: number, senderId: number, text: string): Promise<Message> {
        await UserManager.getUserById(senderId)
        await ChatManager.getChatById(chatId)

        const message: Message = await Message.create({
            chatId,
            senderId,
            text
        });

        return message
    }

    /**
     * Deletes a message by its ID.
     *
     * @param {number} id - The ID of the message to be deleted.
     * @return {Promise<void>} - A promise that resolves when the message is deleted successfully.
     * @throws {MessageNotFoundById} Message not found by id.
     */
    public static async deleteMessage(id: number): Promise<void> {
        const status: number = await Message.destroy({  where: { id } })

        if (status === 0) throw new MessageNotFoundById()
    }

    /**
     * Retrieves a message by its ID.
     *
     * @param {number} id - The ID of the message.
     * @return {Promise<Message>} A promise that resolves to the message object.
     * @throws {MessageNotFoundById} Message not found by id.
     */
    public static async getMessageById(id: number): Promise<Message> {
        const message: Message = await Message.findOne({ where: { id } })

        if (!message) {
            throw new MessageNotFoundById()
        }

        return message
    }

    /**
     * Retrieves messages by chat ID.
     *
     * @param {number} chatId - The ID of the chat.
     * @param {number} limit - The maximum number of messages to retrieve.
     * @param {number} offset - The number of messages to skip before starting to retrieve.
     * @return {Promise<Message[]>} An array of messages.
     */
    public static async getMessagesByChatId(chatId: number, limit: number, offset: number): Promise<Message[]> {
        await ChatManager.getChatById(chatId)

        const messages: Message[] = await Message.findAll({
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