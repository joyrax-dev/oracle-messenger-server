import { Model, DataTypes } from 'sequelize'
import sequelize from '../sequelize'

class Permission extends Model {
    public id!: number
    public name!: string
    public affiliation!: string
}

Permission.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        affiliation: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        modelName: 'Permission'
    }
)

export default Permission