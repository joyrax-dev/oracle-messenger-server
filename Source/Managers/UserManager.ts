import User from "../Database/Models/User.model"
import ReLoginToken from "../Database/Models/ReLoginToken.model"
import { 
    EmailIsBusy, 
    IncorrectPassword, 
    InvalidRole, 
    LoginIsBusy, 
    ReLoginTokenNotFoundById, 
    ReLoginTokenNotFoundByUserIdAndToken, 
    UserNotFoundById, 
    UserNotFoundByLogin 
} from "../Errors"
import sha256 from 'crypto-js/sha256'

export default class UserManager {
    /**
     * Creates a new user with the given login, email, password, and roleId.
     *
     * @param {string} login - The user's login.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @param {number} roleId - The user's roleId.
     * @return {Promise<User>} The created user object.
     */
    public static async createUser(login: string, email: string, password: string, roleId: number): Promise<User> {
        try {
            const user = await User.create({ login, email, password, roleId })

            return user
        } 
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError' && error.fields.login) {
                throw new LoginIsBusy('Login is occupied by another user')
            }
            else if (error.name === 'SequelizeUniqueConstraintError' && error.fields.email) {
                throw new EmailIsBusy('Email is occupied by another user')
            }
            else if (error.name === 'SequelizeForeignKeyConstraintError' && error.fields.roleId) {
                throw new InvalidRole('Invalid Role')
            }

            throw error // Пробрасываем другие ошибки дальше
        }
    }

    /**
     * Retrieves a user by their login.
     *
     * @param {string} login - The login of the user.
     * @return {Promise<User>} The user object if found.
     * @throws {UserNotFound} If the user is not found.
     */
    public static async getUserByLogin(login: string): Promise<User> {
        const user = await User.findOne({ where: { login } })

        if (!user) {
            throw new UserNotFoundByLogin('User not found by login')
        }
        
        return user
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param {number} id - The ID of the user to retrieve.
     * @return {Promise<User>} - A Promise that resolves to the user object.
     */
    public static async getUserById(id: number): Promise<User> {
        const user = await User.findByPk(id)

        if (!user) {
            throw new UserNotFoundById('User not found by id')
        }
        
        return user
    }

    /**
     * Authenticates a user by their login and password.
     *
     * @param {string} login - The user's login.
     * @param {string} password - The user's password.
     * @return {Promise<User>} A Promise that resolves to the authenticated user.
     */
    public static async authenticateUser(login: string, password: string): Promise<User> {
        try {
            const user = await UserManager.getUserByLogin(login)

            // TODO: Check confirmation email
            if (user.password !== password) {
                throw new IncorrectPassword()
            }

            return user
        }
        catch (error) {
            throw error
        }
    }

    /**
     * Creates a re-login token for the specified user.
     *
     * @param {number} userId - The ID of the user.
     * @param {string} userAgent - The user agent string.
     * @return {Promise<ReLoginToken>} A promise that resolves with the created re-login token.
     */
    public static async createReLoginToken(userId: number, userAgent: string): Promise<ReLoginToken> {
        const user = await this.getUserById(userId)

        let token_raw = '' + userId + user.login + user.password + userAgent + Date.now()
        const token = sha256(token_raw).toString()

        const loginToken = await ReLoginToken.create({ userId, token, userAgent })

        return loginToken
    }

    /**
     * Retrieves a re-login token by the user ID and token.
     *
     * @param {number} userId - The ID of the user.
     * @param {string} token - The token to retrieve.
     * @return {Promise<ReLoginToken>} The re-login token object.
     */
    public static async getReLoginTokenByUserIdAndToken(userId: number, token: string): Promise<ReLoginToken> {
        const loginToken = await ReLoginToken.findOne({ where: { userId, token } })

        if (!loginToken) {
            throw new ReLoginTokenNotFoundByUserIdAndToken()
        } 
        
        return loginToken
    }

    /**
     * Retrieves a re-login token by its ID.
     *
     * @param {number} id - The ID of the re-login token.
     * @return {Promise<ReLoginToken>} A promise that resolves to the re-login token with the specified ID.
     */
    public static async getReLoginTokenById(id: number): Promise<ReLoginToken> {
        const loginToken = await ReLoginToken.findByPk(id)

        if (!loginToken) {
            throw new ReLoginTokenNotFoundById()
        }
        
        return loginToken
    }
}
