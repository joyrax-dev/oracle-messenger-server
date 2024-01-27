import ReLoginToken from "../Database/Models/ReLoginToken.model"
import User from "../Database/Models/User.model"
import UserManager from "./UserManager"
import sha256 from 'crypto-js/sha256'
import { 
    ReLoginTokenNotFoundById, 
    ReLoginTokenNotFoundByUserIdAndToken
} from "../Errors"

export default class ReLoginTokenManager {

    /**
     * Creates a re-login token for the given user ID and user agent.
     *
     * @param {number} userId - The ID of the user.
     * @param {string} userAgent - The user agent string.
     * @return {Promise<ReLoginToken>} The created re-login token.
     */
    public static async createToken(userId: number, userAgent: string): Promise<ReLoginToken> {
        const user: User = await UserManager.getUserById(userId)

        const token_raw: string = '' + userId + user.login + user.password + userAgent + Date.now()
        const token: string = sha256(token_raw).toString()

        const loginToken: ReLoginToken = await ReLoginToken.create({ userId, token, userAgent })

        return loginToken
    }

    /**
     * Delete a token by its ID.
     *
     * @param {number} id - The ID of the token to delete.
     * @return {Promise<void>} - A promise that resolves when the token is deleted.
     * @throws {ReLoginTokenNotFoundById} Re-login token not found by id.
     */
    public static async deleteTokenById(id: number): Promise<void> {
        const status: number = await ReLoginToken.destroy({ where: { id } })

        if (status === 0) throw new ReLoginTokenNotFoundById()
    }

    /**
     * Retrieves a token by its ID.
     *
     * @param {number} id - The ID of the token to retrieve.
     * @return {Promise<ReLoginToken>} A promise that resolves to the retrieved token.
     * @throws {ReLoginTokenNotFoundById} Re-login token not found by id.
     */
    public static async getTokenById(id: number): Promise<ReLoginToken> {
        const token: ReLoginToken = await ReLoginToken.findOne({ where: { id } })

        if (!token) throw new ReLoginTokenNotFoundById()

        return token
    }

    /**
     * Retrieves a re-login token by the given user ID and token value.
     *
     * @param {number} userId - The ID of the user.
     * @param {string} token - The token value.
     * @return {Promise<ReLoginToken>} - The retrieved re-login token.
     * @throws {ReLoginTokenNotFoundByUserIdAndToken} Re-login token not found by user id and token value.
     */
    public static async getTokenByUserIdAndValue(userId: number, token: string): Promise<ReLoginToken> {
        const loginToken: ReLoginToken = await ReLoginToken.findOne({ where: { userId, token } })

        if (!loginToken) throw new ReLoginTokenNotFoundByUserIdAndToken()
        
        return loginToken
    }
}