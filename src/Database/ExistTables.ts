import Chat from './Models/Chat.model'
import User from './Models/User.model'
import Message from './Models/Message.model'
import Participant from './Models/Participant.model'
import Reaction from './Models/Reaction.model'
import Permission from './Models/Permission.model'
import ReLoginToken from './Models/ReLoginToken.model'
import Session from './Models/Session.model'

/**
 * Checks if the necessary tables exist and creates them if they don't.
 *
 * @return {void} This function does not return anything.
 */
export default function ExistTables() { 
    // TODO: Automatic import and validation of all tables
    
    Chat.sync({force: false}).then(() => {
        console.log(`Table exist [table=${Chat.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${Chat.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${Chat.tableName}]`)

        Chat.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${Chat.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${Chat.tableName}] [error=${err}]`)
        })
    })

    User.sync({force: false}).then(() => {
        console.log(`Table exist [table=${User.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${User.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${User.tableName}]`)

        User.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${User.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${User.tableName}] [error=${err}]`)
        })
    })

    Message.sync({force: false}).then(() => {
        console.log(`Table exist [table=${Message.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${Message.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${Message.tableName}]`)

        Message.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${Message.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${Message.tableName}] [error=${err}]`)
        })
    })

    Participant.sync({force: false}).then(() => {
        console.log(`Table exist [table=${Participant.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${Participant.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${Participant.tableName}]`)

        Participant.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${Participant.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${Participant.tableName}] [error=${err}]`)
        })
    })

    Reaction.sync({force: false}).then(() => {
        console.log(`Table exist [table=${Reaction.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${Reaction.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${Reaction.tableName}]`)

        Reaction.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${Reaction.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${Reaction.tableName}] [error=${err}]`)
        })
    })
    
    Permission.sync({force: false}).then(() => {
        console.log(`Table exist [table=${Permission.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${Permission.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${Permission.tableName}]`)

        Permission.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${Permission.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${Permission.tableName}] [error=${err}]`)
        })
    })

    ReLoginToken.sync({force: false}).then(() => {
        console.log(`Table exist [table=${ReLoginToken.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${ReLoginToken.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${ReLoginToken.tableName}]`)

        ReLoginToken.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${ReLoginToken.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${ReLoginToken.tableName}] [error=${err}]`)
        })
    })
    
    Session.sync({force: false}).then(() => {
        console.log(`Table exist [table=${Session.tableName}]`)
    }).catch(err => {
        console.log(`Error while checking table [table=${Session.tableName}] [error=${err}]`)
        console.log(`I'm trying to recreate the table [table=${Session.tableName}]`)

        Session.sync({force: true}).then(() => {
            console.log(`Table recreated [table=${Session.tableName}]`)
        }).catch(err => {
            console.log(`Error in table re-creation [table=${Session.tableName}] [error=${err}]`)
        })
    })
}