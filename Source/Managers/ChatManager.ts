import User from "../Database/Models/User.model"
import Chat from "../Database/Models/Chat.model"
import Participant from "../Database/Models/Participant.model"
import ParticipantManager from "./ParticipantManager"
import UserManager from "./UserManager"
import { 
    ChatNotFoundById, 
    PrivateChatAlreadyExists, 
    UserNotFoundById 
} from "../Errors"

export default class ChatManager {

    /**
     * Creates a private chat between two users.
     *
     * @param {number} userId1 - The ID of the first user.
     * @param {number} userId2 - The ID of the second user.
     * @return {Promise<Chat>} A promise that resolves to the created chat.
     * @throws {PrivateChatAlreadyExists} If the private chat already exists.
     * @throws {UserNotFoundById} If one of the users is not found.
     */
    public static async createPrivateChat(userId1: number, userId2: number): Promise<Chat> {
        let searchStatus = false
        
        const firstParticipants: Participant[] = await Participant.findAll({
            where: {
                userId: userId1
            }
        })

        for (const participant of firstParticipants) {
            const { chatId } = participant

            const chat: Chat = await ChatManager.getChatById(chatId)

            if (!chat || chat.type === 'group') continue

            const chatParticipants: Participant[] = await Participant.findAll({
                where: {
                    chatId
                }
            })

            for(const chatParticipant of chatParticipants) {
                if (chatParticipant.userId === userId2) searchStatus = true
            }
        }

        if (searchStatus) throw new PrivateChatAlreadyExists()
        
        const firstUser: User = await UserManager.getUserById(userId1)
        const secondUser: User = await UserManager.getUserById(userId2)

        if (!firstUser) throw new UserNotFoundById()
        if (!secondUser) throw new UserNotFoundById()

        const chat: Chat = await Chat.create({
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

        return chat
    }

    /**
     * Creates a group chat with the given name and list of user IDs.
     *
     * @param {string} name - The name of the group chat.
     * @param {number[]} usersId - An array of user IDs to be added to the group chat.
     * @return {Promise<Chat>} - A promise that resolves to the created group chat.
     */
    public static async createGroupChat(name: string, usersId: number[]): Promise<Chat> {
        const chat = await Chat.create({
            name,
            type: 'group'
        })

        await ParticipantManager.createParticipants(chat.id, usersId)

        return chat
    }

    /**
     * Deletes a chat and all associated participants.
     *
     * @param {number} id - The ID of the chat to be deleted.
     * @return {Promise<void>} A promise that resolves when the chat and participants are successfully deleted.
     */
    public static async deleteChat(id: number): Promise<void> {
        await ParticipantManager.deleteAllParticipantByChatId(id)

        const chat: Chat = await ChatManager.getChatById(id)
        await chat.destroy()
    }

    /**
     * Retrieves a chat by its ID.
     *
     * @param {number} id - The ID of the chat.
     * @return {Promise<Chat>} A promise that resolves to the chat object.
     * @throws {ChatNotFoundById} If the chat is not found.
     */
    public static async getChatById(id: number): Promise<Chat> {
        const chat: Chat = await Chat.findOne({ where: { id } })

        if (!chat) throw new ChatNotFoundById()

        return chat
    }

    /**
     * Retrieves all chats associated with a given user ID.
     *
     * @param {number} userId - The ID of the user.
     * @return {Promise<Chat[]>} - A promise that resolves to an array of Chat objects.
     */
    public static async getChatsByUser(userId: number): Promise<Chat[]> {
        const participants: Participant[] = await Participant.findAll({
            where: {
                userId
            }
        })

        const chats: Chat[] = []

        for (const participant of participants) {
            const chat: Chat = await ChatManager.getChatById(participant.chatId)
            chats.push(chat)
        }

        return chats
    }
}