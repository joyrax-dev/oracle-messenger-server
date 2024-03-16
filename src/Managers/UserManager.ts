import User from "../Database/Models/User.model"
import { 
    EmailIsBusy, 
    IncorrectPassword, 
    InvalidRole, 
    LoginIsBusy, 
    UserNotFoundById, 
    UserNotFoundByLogin 
} from "../Errors"

export default class UserManager {

    /**
     * Creates a new user with the given login, email, password, and roleId.
     *
     * @param {string} login - The user's login.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @param {number} roleId - The user's roleId.
     * @return {Promise<User>} The created user object.
     * @throws {LoginIsBusy} If the login is already in use.
     * @throws {EmailIsBusy} If the email is already in use.
     * @throws {InvalidRole} If the invalid role.
     */
    public static async createUser(login: string, email: string, password: string): Promise<User> {
        try {
            const user: User = await User.create({ login, email, password})

            return user
        } 
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError' && error.fields.login) {
                throw new LoginIsBusy()
            }
            else if (error.name === 'SequelizeUniqueConstraintError' && error.fields.email) {
                throw new EmailIsBusy()
            }
            else if (error.name === 'SequelizeForeignKeyConstraintError' && error.fields.roleId) {
                throw new InvalidRole()
            }

            throw error
        }
    }

    /**
     * Retrieves a user by their login.
     *
     * @param {string} login - The login of the user.
     * @return {Promise<User>} The user object if found.
     * @throws {UserNotFoundByLogin} If the user is not found by login.
     */
    public static async getUserByLogin(login: string): Promise<User> {
        const user: User = await User.findOne({ where: { login } })

        if (!user) {
            throw new UserNotFoundByLogin()
        }
        
        return user
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param {number} id - The ID of the user to retrieve.
     * @return {Promise<User>} - A Promise that resolves to the user object.
     * @throws {UserNotFoundById} If the user is not found by id.
     */
    public static async getUserById(id: number): Promise<User> {
        const user: User = await User.findOne({ where: { id } })

        if (!user) {
            throw new UserNotFoundById()
        }
        
        return user
    }

    /**
     * Authenticates a user by their login and password.
     *
     * @param {string} login - The user's login.
     * @param {string} password - The user's password.
     * @return {Promise<User>} A Promise that resolves to the authenticated user.
     * @throws {IncorrectPassword} If the incorrect password.
     */
    public static async authenticateUser(login: string, password: string): Promise<User> {
        try {
            const user: User = await UserManager.getUserByLogin(login)

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
}
