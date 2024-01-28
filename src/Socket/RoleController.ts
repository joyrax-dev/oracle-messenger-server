import { Socket, Server } from 'socket.io'
import { 
    InsufficientPermissions,
    InvalidRole, 
    RoleAlreadyExists,
    YouAreNotLoggedIn
} from '../Errors'
import {
    CreateRoleCallbackData,
    CreateRoleData,
    DeleteRoleData,
    RolesData,
    UpdateRoleData
} from './Types'
import Role from '../Database/Models/Role.model'
import Controller from './Controller'
import Session from '../Database/Models/Session.model'
import UserManager from '../Managers/UserManager'
import RoleManager from '../Managers/RoleManager'
import User from '../Database/Models/User.model'

export default class RoleController extends Controller {
    constructor(server: Server, socket: Socket) {
        super(server, socket)

        this.socket.on('createRole', this.createRole.bind(this))
        this.socket.on('getRoles', this.getRoles.bind(this))
        this.socket.on('deleteRole', this.deleteRole.bind(this))
        this.socket.on('updateRole', this.updateRole.bind(this))
    }

    async createRole(data: CreateRoleData, callback: (data: CreateRoleCallbackData, code: number, status: boolean) => void) {
        try {
            const session: Session = await Session.findOne({ where: { socketId: this.socket.id } })

            if (!session.isLogin) {
                callback(null, YouAreNotLoggedIn.code, false)
                return
            }

            const user: User = await UserManager.getUserById(session.userId)

            if (user.roleId !== 1) {
                callback(null, InsufficientPermissions.code, false)
                return
            }

            const role = await Role.create({ name: data.name })
            callback({ roleId: role.id, roleName: role.name }, 0, true)
        }
        catch (error) {
            // callback(null, RoleAlreadyExists.code, false)
            callback(null, -1, false)
        }
    }

    async getRoles(callback: (data: RolesData, code: number, status: boolean) => void) {
        try {
            const session: Session = await Session.findOne({ where: { socketId: this.socket.id } })

            if (!session.isLogin) {
                callback(null, YouAreNotLoggedIn.code, false)
                return
            }

            const user: User = await UserManager.getUserById(session.userId)

            if (user.roleId !== 1) {
                callback(null, InsufficientPermissions.code, false)
                return
            }

            const roles: Role[] = await RoleManager.getAllRoles()

            callback({ roles }, 0, true)
        }
        catch (error) {
            callback(null, -1, false)
        }
    }

    async deleteRole(data: DeleteRoleData, callback: (code: number, status: boolean) => void) {
        try {
            const session: Session = await Session.findOne({ where: { socketId: this.socket.id } })

            if (!session.isLogin) {
                callback(YouAreNotLoggedIn.code, false)
                return
            }

            const user: User = await UserManager.getUserById(session.userId)

            if (user.roleId !== 1) {
                callback(InsufficientPermissions.code, false)
                return
            }

            const role: Role = await RoleManager.getRoleById(data.roleId)

            role.destroy()

            callback(0, true)
        }
        catch (error) {
            callback(-1, false)
        }
    }

    async updateRole(data: UpdateRoleData, callback: (code: number, status: boolean) => void) {
        try {
            const session: Session = await Session.findOne({ where: { socketId: this.socket.id } })

            if (!session.isLogin) {
                callback(YouAreNotLoggedIn.code, false)
                return
            }

            const user: User = await UserManager.getUserById(session.userId)

            if (user.roleId !== 1) {
                callback(InsufficientPermissions.code, false)
                return
            }

            const role: Role = await RoleManager.getRoleById(data.roleId)

            role.name = data.roleName
            await role.save()

            callback(0, true)
        }
        catch (error) {
            callback(-1, false)
        }
    }
}