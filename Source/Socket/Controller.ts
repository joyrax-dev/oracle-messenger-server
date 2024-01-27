import { Socket, Server } from 'socket.io'

export default class Controller {
    protected server: Server
    protected socket: Socket

    constructor(server: Server, socket: Socket) {
        this.server = server
        this.socket = socket
    }
}