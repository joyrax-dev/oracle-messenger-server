import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import Role from './Role.model'

class User extends Model {
    public id!: number
    public login!: string
    public email!: string
    public emailConfrimed!: boolean
    public password!: string
    public reauthenticationTokens!: string[]
    public roleId!: number // Добавляем поле для связи с Role
    public readonly role?: Role // Добавляем поле для доступа к Role модели
}

User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        emailConfrimed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reauthenticationTokens: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
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