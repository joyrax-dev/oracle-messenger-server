import User from "./Database/Models/User.model"


export default class UserStore {
    private store: Map<string, UserStoreItem> = new Map()

    public set(socketId: string, data: UserStoreItem): void {
        this.store.set(socketId, data)
    }

    public get(socketId: string): UserStoreItem {
        const item = this.store.get(socketId)

        if (item) {
            return item
        }
        else {
            return null
        }
    }

    public remove(socketId: string): boolean {
        return this.store.delete(socketId)
    }

    public clear(): void {
        this.store.clear()
    }
}

export interface UserStoreItem {
    isLogin: boolean,
    user: User
}