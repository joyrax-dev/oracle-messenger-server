import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'

class Chat extends Model {
    public id!: number
    public name!: string
    public type!: 'private' | 'group' // Добавлено поле для указания типа чата
}

Chat.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('private', 'group'), // Определение возможных значений для поля type
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Chat'
    }
)

export default Chat