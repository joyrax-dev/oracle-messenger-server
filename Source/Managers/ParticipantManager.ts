import Chat from "../Database/Models/Chat.model"
import Participant from "../Database/Models/Participant.model"
import User from "../Database/Models/User.model"
import { NoParticipantsWereFound, ParticipantNotFoundByChatIdAndUserId, ParticipantsNotFoundByChatId } from "../Errors"
import ChatManager from "./ChatManager"
import UserManager from "./UserManager"

export default class ParticipantManager {
    /**
     * Creates a new participant in a chat.
     *
     * @param {number} chatId - The ID of the chat.
     * @param {number} userId - The ID of the user.
     * @return {Promise<Participant>} A promise that resolves when the participant is created.
     */
    public static async createParticipant(chatId: number, userId: number): Promise<Participant> {
        try {
            const user: User = await UserManager.getUserById(userId)
            const chat: Chat = await ChatManager.getChatById(chatId)

            const participant: Participant = await new Participant({
                userId: user.id,
                chatId: chat.id,
                roleId: user.roleId
            })

            return participant
        }
        catch (err) {
            throw err
        }
    }

    /**
     * Creates participants for a chat.
     *
     * @param {number} chatId - The ID of the chat.
     * @param {number[]} userIds - An array of user IDs.
     * @return {Promise<Participant[]>} A promise that resolves when all participants are created.
     */
    public static async createParticipants(chatId: number, userIds: number[]): Promise<Participant[]> {
        const participants: Participant[] = []

        for (const userId of userIds) {
            const participant: Participant = await ParticipantManager.createParticipant(chatId, userId)

            participants.push(participant)
        }

        return participants
    }

    /**
     * Deletes all participants by chat id.
     *
     * @param {number} chatId - The chat id.
     * @return {Promise<void>} A promise that resolves when all participants are deleted.
     */
    public static async deleteAllParticipantByChatId(chatId: number): Promise<void> {
        const participants: Participant[] = await Participant.findAll({
            where: {
                chatId
            }
        })

        if (participants.length === 0) {
            throw new NoParticipantsWereFound()
        }

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
        const participants: Participant[] = await Participant.findAll({
            where: {
                userId
            }
        })

        if (participants.length === 0) {
            throw new NoParticipantsWereFound()
        }

        for (const participant of participants) {
            await participant.destroy()
        }
    }

    /**
     * Deletes a participant from a chat by their chat ID and user ID.
     *
     * @param {number} chatId - The ID of the chat.
     * @param {number} userId - The ID of the user.
     * @return {Promise<void>} A promise that resolves when the participant is deleted.
     */
    public static async deleteParticipantByChatIdAndUserId(chatId: number, userId: number): Promise<void> {
        const participant = await Participant.findOne({
            where: {
                chatId,
                userId
            }
        })

        if (participant) {
            participant.destroy()
        }
        else {
            throw new ParticipantNotFoundByChatIdAndUserId()
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

        if (!participant) {
            throw new ParticipantNotFoundByChatIdAndUserId()
        }

        return participant
    }

    public static async getAllParticipantsByChatId(chatId: number): Promise<Participant[]> {
        const participants = await Participant.findAll({
            where: {
                chatId
            }
        })

        if (!participants) {
            throw new ParticipantsNotFoundByChatId()
        }

        return participants
    }
}