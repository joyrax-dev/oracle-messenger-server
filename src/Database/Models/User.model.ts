import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'
import Role from './Permission.model'

class User extends Model {
    public id!: number
    public login!: string
    public email!: string
    public emailConfrimed!: boolean
    public password!: string
    public permissions!: number[]
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
        permissions: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
            defaultValue: [0]
        }
    },
    {
        sequelize,
        modelName: 'User',
    }
)

export default User