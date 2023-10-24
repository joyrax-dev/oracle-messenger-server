import Chat from "../Database/Models/Chat.model"
import Participant from "../Database/Models/Participant.model"
import ChatManager from "./ChatManager"
import UserManager from "./UserManager"

export default class ParticipantManager {
    /**
     * Creates a new participant in a chat.
     *
     * @param {number} chatId - The ID of the chat.
     * @param {number} userId - The ID of the user.
     * @return {Promise<void>} A promise that resolves when the participant is created.
     */
    public static async createParticipant(chatId: number, userId: number): Promise<void> {
        const user = await UserManager.getUserById(userId)
        const chat = await ChatManager.getChatById(chatId)

        await new Participant({
            userId: user.id,
            chatId: chat.id,
            roleId: user.roleId
        })
    }

    /**
     * Creates participants for a chat.
     *
     * @param {number} chatId - The ID of the chat.
     * @param {number[]} userIds - An array of user IDs.
     * @return {Promise<void>} A promise that resolves when all participants are created.
     */
    public static async createParticipants(chatId: number, userIds: number[]): Promise<void> {
        for (const userId of userIds) {
            await this.createParticipant(chatId, userId)
        }
    }

    /**
     * Deletes all participants by chat id.
     *
     * @param {number} chatId - The chat id.
     * @return {Promise<void>} A promise that resolves when all participants are deleted.
     */
    public static async deleteAllParticipantByChatId(chatId: number): Promise<void> {
        const participants = await Participant.findAll({
            where: {
                chatId
            }
        })

        for (const participant of participants) {
            await participant.destroy()
        }
    }

    /**
     * Deletes all participants associated with a given user ID.
     *
     * @param {number} userId - The ID of the user.
     * @return {Promise<void>} A promise that resolves when all participants are deleted.
     */
    public static async deleteAllParticipantByUserId(userId: number): Promise<void> {
        const participants = await Participant.findAll({
            where: {
                userId
            }
        })

        for (const participant of participants) {
            await participant.destroy()
        }
    }

    /**
     * Retrieves a participant by chat ID and user ID.
     *
     * @param {number} chatId - The ID of the chat.
     * @param {number} userId - The ID of the user.
     * @return {Promise<Participant>} The participant object if found, otherwise undefined.
     */
    public static async getParticipantByChatIdAndUserId(chatId: number, userId: number): Promise<Participant> {
        const participant = await Participant.findOne({
            where: {
                chatId,
                userId
            }
        })

        return participant
    }
}