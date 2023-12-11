import ChatModel from './Models/Chat.model'
import UserModel from './Models/User.model'
import MessageModel from './Models/Message.model'
import ParticipantModel from './Models/Participant.model'
import ReactionModel from './Models/Reaction.model'
import RoleModel from './Models/Role.model'
import ReLoginTokenModel from './Models/ReLoginToken.model'

/**
 * Checks if the necessary tables exist and creates them if they don't.
 *
 * @return {void} This function does not return anything.
 */
export default function ExistTables() { 
    // TODO: Automatic import and validation of all tables
    
    ChatModel.sync({force: false}).then(() => {
        console.log(`Table exist [table=${ChatModel.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${ChatModel.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${ChatModel.tableName}]`)

        ChatModel.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${ChatModel.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${ChatModel.tableName}] [error=${err}]`)
        })
    })

    UserModel.sync({force: false}).then(() => {
        console.log(`Table exist [table=${UserModel.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${UserModel.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${UserModel.tableName}]`)

        UserModel.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${UserModel.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${UserModel.tableName}] [error=${err}]`)
        })
    })

    MessageModel.sync({force: false}).then(() => {
        console.log(`Table exist [table=${MessageModel.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${MessageModel.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${MessageModel.tableName}]`)

        MessageModel.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${MessageModel.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${MessageModel.tableName}] [error=${err}]`)
        })
    })

    ParticipantModel.sync({force: false}).then(() => {
        console.log(`Table exist [table=${ParticipantModel.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${ParticipantModel.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${ParticipantModel.tableName}]`)

        ParticipantModel.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${ParticipantModel.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${ParticipantModel.tableName}] [error=${err}]`)
        })
    })

    ReactionModel.sync({force: false}).then(() => {
        console.log(`Table exist [table=${ReactionModel.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${ReactionModel.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${ReactionModel.tableName}]`)

        ReactionModel.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${ReactionModel.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${ReactionModel.tableName}] [error=${err}]`)
        })
    })
    
    RoleModel.sync({force: false}).then(() => {
        console.log(`Table exist [table=${RoleModel.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${RoleModel.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${RoleModel.tableName}]`)

        RoleModel.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${RoleModel.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${RoleModel.tableName}] [error=${err}]`)
        })
    })

    ReLoginTokenModel.sync({force: false}).then(() => {
        console.log(`Table exist [table=${ReLoginTokenModel.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${ReLoginTokenModel.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${ReLoginTokenModel.tableName}]`)

        ReLoginTokenModel.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${ReLoginTokenModel.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${ReLoginTokenModel.tableName}] [error=${err}]`)
        })
    })
}