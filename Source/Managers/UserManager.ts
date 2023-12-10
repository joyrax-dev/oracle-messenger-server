import User from "../Database/Models/User.model"
import { 
    EmailIsBusy, 
    IncorrectPassword, 
    InvalidRole, 
    LoginIsBusy, 
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

    public static async addReauthenticationToken(userId: number, token: string) {
        try {
            const user = await this.getUserById(userId)
            let tokens
            
            if (user.reauthenticationTokens === null) {
                tokens = []
            }
            else {
                tokens = Object.assign([], user.reauthenticationTokens)
            }

            tokens.push(token)
            console.log(tokens)
            
            await user.update({ reauthenticationTokens: tokens })
        }
        catch (error) {
            console.log(error)
            throw error
        }
    }

    public static async removeReauthenticationToken(userId: number, token: string) {
        try {
            const user = await this.getUserById(userId)

            user.reauthenticationTokens = user.reauthenticationTokens.filter(t => t !== token)
            await user.update({ reauthenticationTokens: user.reauthenticationTokens })
        }
        catch (error) {
            throw error
        }
    }

    public static async checkReauthenticationToken(userId: number, token: string): Promise<boolean> {
        try {
            const user = await this.getUserById(userId)
            
            return user.reauthenticationTokens.includes(token)
        }
        catch (error) {
            throw error
        }
    }

    public static async generateReauthenticationToken(userId: number): Promise<string> {
        try {
            const user = await this.getUserById(userId)
            let token_raw = '' + userId + user.login + user.password + user.email + Date.now()

            return sha256(token_raw).toString()
        }
        catch (error) {
            throw error
        }
    }
}
