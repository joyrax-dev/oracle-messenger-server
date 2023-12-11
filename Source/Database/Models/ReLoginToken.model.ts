import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import User from './User.model'

class ReLoginToken extends Model {
    public id!: number
    public userId!: number
    public token!: string
    public userAgent!: string
}

ReLoginToken.init({
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
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'ReLoginToken'
    }
)

ReLoginToken.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export default ReLoginToken