import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import User from './User.model'
import Message from './Message.model'

class Reaction extends Model {
    public id!: number
    public reaction!: string
    public userId!: number
    public messageId!: number
}

Reaction.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        reaction: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        messageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Message,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'Reaction'
    }
)

Reaction.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Reaction.belongsTo(Message, { foreignKey: 'messageId', as: 'message' })

export default Reaction