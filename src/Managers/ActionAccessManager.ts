import ActionAccess from '../Database/Models/ActionAccess.model'
import { 
    ActionAccessNotFoundByAction,
    ActionAccessNotFoundById,
    ActionAccessNotFoundByRoleId,
    ActionAccessNotFoundByRoleIdAndAction,
    ThereRoleInThisAction
} from "../Errors"

export default class ActionAccessManager {
    public static async createActionAccess(roleId: number, action: string): Promise<ActionAccess> {
        const checkAccess: ActionAccess = await ActionAccess.findOne({ where: { action, roleId } })

        if (checkAccess) throw new ThereRoleInThisAction

        const access = await ActionAccess.create({
            action, roleId
        })

        return access
    }

    public static async deleteActionAccess(id: number): Promise<void> {
        const checkAccess: ActionAccess = await ActionAccess.findOne({ where: { id } })

        if (!checkAccess) throw new ActionAccessNotFoundById

        await checkAccess.destroy()
    }

    public static async getActionAccessById(id: number): Promise<ActionAccess> {
        const checkAccess: ActionAccess = await ActionAccess.findOne({ where: { id } })

        if (!checkAccess) throw new ActionAccessNotFoundById

        return checkAccess
    }

    public static async getListActionAccessByAction(action: string): Promise<ActionAccess[]> {
        const checkAccess: ActionAccess[] = await ActionAccess.findAll({ where: { action } })

        if (checkAccess.length === 0) throw new ActionAccessNotFoundByAction

        return checkAccess
    }

    public static async getListActionAccessByRoleId(roleId: number): Promise<ActionAccess[]> {
        const checkAccess: ActionAccess[] = await ActionAccess.findAll({ where: { roleId } })

        if (checkAccess.length === 0) throw new ActionAccessNotFoundByRoleId
        
        return checkAccess
    }

    public static async getActionAccessByRoleIdAndAction(roleId: number, action: string): Promise<ActionAccess> {
        const checkAccess: ActionAccess = await ActionAccess.findOne({ where: { action, roleId } })

        if (!checkAccess) throw new ActionAccessNotFoundByRoleIdAndAction

        return checkAccess
    }
}