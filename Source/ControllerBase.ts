import { Socket, Server } from 'socket.io'

export default class ControllerBase {
    protected server: Server
    protected socket: Socket

    constructor(server: Server, socket: Socket) {
        this.server = server
        this.socket = socket
    }

    protected on(fn: (...args: any[]) => void) {
        this.socket.on(fn.name, fn)
    }
}