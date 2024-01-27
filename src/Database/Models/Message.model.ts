import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import User from './User.model'
import Chat from './Chat.model'

class Message extends Model {
    public id!: number
    public text!: string
    public senderId!: number
    public chatId!: number
}

Message.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Chat,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'Message'
    }
)

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' }) // Связь "Message принадлежит к User (отправитель)"
Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' }) // Связь "Message принадлежит к Chat"

export default Message