import { Model, DataTypes } from 'sequelize'
import { localStore } from '../sequelize'

class ActionAccess extends Model {
    public id!: number
    public action!: 'DeleteUser' |
                    'CreateUser' |
                    'UpdateUser' |
                    'CreatePrivateChat' |
                    'CreateGroupChat' |
                    'DeletePrivateChat' |
                    'DeleteGroupChat' |
                    'UpdatePrivateChat' |
                    'UpdateGroupChat'
    public roleId!: number
}

ActionAccess.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        action: {
            type: DataTypes.ENUM(
                'DeleteUser', 
                'CreateUser', 
                'UpdateUser', 
                'CreatePrivateChat', 
                'CreateGroupChat', 
                'DeletePrivateChat', 
                'DeleteGroupChat', 
                'UpdatePrivateChat', 
                'UpdateGroupChat'
            ),
            allowNull: false
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    },
    {
        sequelize: localStore,
        modelName: 'ActionAccess'
    }
)

export default ActionAccess