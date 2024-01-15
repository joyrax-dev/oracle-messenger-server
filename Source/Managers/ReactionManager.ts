import Reaction from "../Database/Models/Reaction.model"
import MessageManager from "./MessageManager"
import UserManager from "./UserManager"
import { 
    ReactionNotFoundById, 
    ReactionNotFoundByUserIdAndMessageId,
    ReactionsNotFoundByMessageId
} from "../Errors"

export default class ReactionManager {

    /**
     * Creates a new reaction for a user on a message.
     *
     * @param {number} userId - The ID of the user.
     * @param {number} messageId - The ID of the message.
     * @param {string} emoji - The emoji for the reaction.
     * @return {Promise<Reaction>} The newly created reaction.
     */
    public static async createReaction(userId: number, messageId: number, emoji: string): Promise<Reaction> {
        await UserManager.getUserById(userId)
        await MessageManager.getMessageById(messageId)

        const reaction: Reaction = await Reaction.create({ 
            userId, 
            messageId, 
            reaction: emoji 
        })

        return reaction
    }

    /**
     * Deletes a reaction from the database.
     *
     * @param {number} userId - The ID of the user.
     * @param {number} messageId - The ID of the message.
     * @return {Promise<void>} - A promise that resolves with no value.
     * @throws {ReactionNotFoundByUserIdAndMessageId} Reaction not found by user id and message id.
     */
    public static async deleteReaction(userId: number, messageId: number): Promise<void> {
        const status: number = await Reaction.destroy({ where: { userId, messageId } })

        if (status === 0) throw new ReactionNotFoundByUserIdAndMessageId()
    }

    /**
     * Retrieves a reaction by its ID.
     *
     * @param {number} id - The ID of the reaction to retrieve.
     * @return {Promise<Reaction>} The retrieved reaction.
     * @throws {ReactionNotFoundById} Reaction not found by id.
     */
    public static async getReactionById(id: number): Promise<Reaction> {
        const reaction: Reaction = await Reaction.findOne({ where: { id } })

        if (!reaction) throw new ReactionNotFoundById()

        return reaction
    }

    /**
     * Retrieves a reaction by user ID and message ID.
     *
     * @param {number} userId - The ID of the user.
     * @param {number} messageId - The ID of the message.
     * @return {Promise<Reaction>} The reaction object.
     * @throws {ReactionNotFoundByUserIdAndMessageId} Reaction not found by user id and message id.
     */
    public static async getReactionsByUserIdAndMessageId(userId: number, messageId: number): Promise<Reaction> {
        const reaction: Reaction = await Reaction.findOne({ where: { userId, messageId } })

        if (!reaction) throw new ReactionNotFoundByUserIdAndMessageId()

        return reaction
    }

    /**
     * Retrieves reactions by message ID.
     *
     * @param {number} messageId - The ID of the message.
     * @return {Promise<Reaction[]>} An array of reactions.
     * @throws {ReactionsNotFoundByMessageId} Reactions not found by message id.
     */
    public static async getReactionsByMessageId(messageId: number): Promise<Reaction[]> {
        const reactions: Reaction[] = await Reaction.findAll({ where: { messageId } })

        if (reactions.length === 0) throw new ReactionsNotFoundByMessageId()

        return reactions
    }
}