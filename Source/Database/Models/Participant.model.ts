import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import User from './User.model'
import Chat from './Chat.model'
import Role from './Role.model'

class Participant extends Model {
    public id!: number
    public userId!: number
    public chatId!: number
    public roleId!: number // Добавлено поле для идентификатора роли
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
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Role,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'Participant'
    }
)

Participant.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Participant.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' })
Participant.belongsTo(Role, { foreignKey: 'roleId', as: 'role' }) // Связь с моделью Role

export default Participant