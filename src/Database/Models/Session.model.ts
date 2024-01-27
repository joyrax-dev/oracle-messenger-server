import { Model, DataTypes } from 'sequelize'
import { memoryStore } from '../sequelize'

class Session extends Model {
    public id!: number
    public socketId!: string
    public userId!: number
    public isLogin!: boolean
}

Session.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        socketId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
            // unique: true
        },
        isLogin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: true,
            defaultValue: false
        }
    },
    {
        sequelize: memoryStore,
        modelName: 'Session'
    }
)

export default Session