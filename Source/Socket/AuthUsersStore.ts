export interface AuthUser {
    socketId: string
    userId: number
}

export class AuthUsersStore {
    private authUsers: AuthUser[] = []

    public set(data: AuthUser) {
        const exists = this.authUsers.some(obj => obj.socketId === data.socketId);

        if (!exists) {
            this.authUsers.push(data)
        }
    }

    public getBySocketId(socketId: string) {
        const exists = this.authUsers.some(obj => obj.socketId === socketId);

        if (exists) {
            return this.authUsers.find(obj => obj.socketId === socketId)
        }
        else {
            return null
        }
    }

    public getByUserId(userId: number) {
        const exists = this.authUsers.some(obj => obj.userId === userId);

        if (exists) {
            return this.authUsers.find(obj => obj.userId === userId)
        }
        else {
            return null
        }
    }

    public delBySocketId(socketId: string) {
        const exists = this.authUsers.some(obj => obj.socketId === socketId);

        if (exists) {
            this.authUsers = this.authUsers.filter(obj => obj.socketId !== socketId)
        }
    }
    public delByUserId(userId: number) {
        const exists = this.authUsers.some(obj => obj.userId === userId);

        if (exists) {
            this.authUsers = this.authUsers.filter(obj => obj.userId !== userId)
        }
    }
}

const instance = new AuthUsersStore()
export default instance