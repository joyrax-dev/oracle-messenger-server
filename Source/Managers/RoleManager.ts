import Role from "../Database/Models/Role.model"
import { 
    RoleNotFoundById, 
    RoleOfThatNameExists, 
    RolesNotFound 
} from "../Errors"


export default class RoleManager {
    
    /**
     * Creates a role with the given name.
     *
     * @param {string} name - The name of the role.
     * @return {Promise<Role>} The created role.
     * @throws {RoleOfThatNameExists} Role of that name exists.
     */
    public static async createRole(name: string): Promise<Role> {
        try {
            const role: Role = await Role.create({ name })
            
            return role
        } 
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new RoleOfThatNameExists()
            }

            throw error
        }
    }

    /**
     * Delete a role by its ID.
     *
     * @param {number} id - The ID of the role to be deleted.
     * @return {Promise<void>} - A promise that resolves with no value.
     * @throws {RoleNotFoundById} Role not found by id.
     */
    public static async deleteRole(id: number): Promise<void> {
        const result: number = await Role.destroy({ where: { id } })

        if (result === 0) throw new RoleNotFoundById()
    }

    /**
     * Retrieves a Role object by its ID.
     *
     * @param {number} id - The ID of the role to retrieve.
     * @return {Promise<Role>} A promise that resolves to the Role object if found.
     * @throws {RoleNotFoundById} Role not found by id.
     */
    public static async getRoleById(id: number): Promise<Role> {
        const role: Role = await Role.findOne({ where: { id } })

        if (!role) {
            throw new RoleNotFoundById()
        }

        return role
    }

    /**
     * Retrieves all roles.
     *
     * @return {Promise<Role[]>} An array of Role objects.
     * @throws {RolesNotFound} Roles not found.
     */
    public static async getAllRoles(): Promise<Role[]> {
        const roles: Role[] = await Role.findAll()

        if (roles.length === 0) {
            throw new RolesNotFound()
        }

        return roles
    }
}