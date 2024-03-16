import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import User from './User.model'
import Chat from './Chat.model'

class Participant extends Model {
    public id!: number
    public userId!: number
    public chatId!: number
    public permissions!: number[]
}

Participant.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
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
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
            defaultValue: [0]
        }
    },
    {
        sequelize,
        modelName: 'Participant'
    }
)

Participant.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Participant.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' })

export default Participant