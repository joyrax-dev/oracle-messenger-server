import { Sequelize } from 'sequelize'

const sequelize  = new Sequelize('oracle_messenger', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres'
})


export default sequelize

/*

=============================================================================

import Chat from './models/chat';

async function createGroupChat() {
    const chat = await Chat.create({
        name: 'Group Chat',
        type: 'group',
    });

    // Связываем пользователей с чатом
    await chat.$set('users', [userId1, userId2, userId3]); // Замените userId1, userId2, userId3 на фактические идентификаторы пользователей
    console.log(chat);
}

createGroupChat();

=======================================================================

import Chat from './models/chat';

async function createPrivateChat(userId1: number, userId2: number) {
    const chat = await Chat.create({
        name: 'Private Chat',
        type: 'private',
    });

    await chat.$set('users', [userId1, userId2]); // Связываем пользователей с чатом
    console.log(chat);
}

createPrivateChat(1, 2);

==========================================================================

import User from './models/user';

async function getUserMessages(userId: number) {
    const user = await User.findByPk(userId, { include: 'messages' });
    console.log(user?.messages);
}

getUserMessages(1);

=============================================================================

import User from './models/user';

async function getUserChats(userId: number) {
    const user = await User.findByPk(userId, { include: 'chats' });
    console.log(user?.chats);
}

getUserChats(1);

=============================================================================

import User from './models/user';

async function getUserWithRole(userId: number) {
    const user = await User.findByPk(userId, { include: 'role' });
    console.log(user?.role);
}

getUserWithRole(1);

=============================================================================
*/