import Message from "../Database/Models/Message.model";


export default class MessageManager {

    public static async createMessage(chatId: number, senderId: number, text: string): Promise<Message> {
        try {
            const message = await Message.create({
                chatId,
                senderId,
                text
            });

            return message
        }
        catch(error) {
            throw error
        }
    }

    public static async getMessagesByChatId(chatId: number, limit: number, offset: number): Promise<Message[]> {
        try {
            const messages = await Message.findAll({
                where: {
                    chatId
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return messages
        }
        catch(error) {
            throw error
        }
    }

    public static async editMessage(id: number, text: string) {
        try {
            const message = await Message.update({
                text
            }, {
                where: {
                    id
                }
            });
        }
        catch(error) {
            throw error
        }
    }

    public static async deleteMessage(id: number) {
        try {
            const message = await Message.destroy({
                where: {
                    id
                }
            });
        }
        catch(error) {
            throw error
        }
    }
}