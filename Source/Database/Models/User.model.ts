import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import Role from './Role.model'

    class User extends Model {
    public id!: number
    public name!: string
    public email!: string
    public password!: string
    public roleId!: number // Добавляем поле для связи с Role
    public readonly role?: Role // Добавляем поле для доступа к Role модели
}

User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
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
        modelName: 'User',
    }
)

User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' }) // Устанавливаем связь "User принадлежит к Role"

export default User