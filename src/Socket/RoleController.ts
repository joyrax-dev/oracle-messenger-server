import { Socket, Server } from 'socket.io'
import { 
    InvalidRole, 
    RoleAlreadyExists
} from '../Errors'
import {
    CreateRoleCallbackData,
    CreateRoleData
} from './Types'
import Role from '../Database/Models/Role.model'
import Controller from './Controller'

export default class RoleController extends Controller {
    constructor(server: Server, socket: Socket) {
        super(server, socket)

        this.socket.on('createRole', this.createRole.bind(this))
    }

    async createRole(data: CreateRoleData, callback: (data: CreateRoleCallbackData, code: number, status: boolean) => void) {
        try {
            const role = await Role.create({ name: data.name })
            callback({ roleId: role.id, roleName: role.name }, 0, true)
        }
        catch (error) {
            // callback(null, RoleAlreadyExists.code, false)
            callback(null, -1, false)
        }
    }
}