import Role from "../Database/Models/Permission.model"
import User from "../Database/Models/User.model"

export interface UserData {
    isAuth: boolean
    user: User
}

export interface LoginData {
    login: string,
    password: string,
    userAgent: string,
    isNextReLogin: boolean
}

export interface LoginCallbackData {
    userId: number,
    token: string,
    isNextReLogin: boolean
}

export interface RegisterData {
    login: string,
    email: string,
    password: string
}

export interface ReLoginData {
    userId: number,
    token: string,
    userAgent: string,
    isNextReLogin: boolean
}
// export interface ReLoginCallbackData {
//     userId: number,
//     token: string,
//     isNextReLogin: boolean
// }

export interface CreateRoleData {
    name: string
}

export interface CreateRoleCallbackData {
    roleId: number,
    roleName: string
}


export interface AllChatsData {
    chats: number[]
}

export interface GetChatInfoData {
    userId: number,
    chatId: number
}

export interface ChatInfoData {
    chatId: number,
    chatName: string,
    chatParticipants: number[]
}

export interface NewPrivateChatData {
    firstUserId: number,
    secondUserId: number
}

export interface JoinChatData {
    userId: number,
    chatId: number
}

export interface SendMessageData {
    chatId: number,
    userId: number,
    text: string
}

export interface SendMessageCallbackData {
    message: any,
    chatId: number,
}

export interface GetUserInfoData {
    senderId: number,
    targetId: number
}

export interface GetUserInfoCallbackData {
    user: User
}

export interface GetChatUsersData {
    chatId: number,
    senderId: number
}

export interface ChatUsersData {
    chatId: number,
    usersIds: number[]
}

export interface LoadMessagesData {
    senderId: number,
    chatId: number,
    limit: number,
    offset: number
}

export interface LoadMessagesCallbackData {
    chatId: number,
    messages: any[]
}

export interface RolesData {
    roles: Role[]
}

export interface DeleteRoleData {
    roleId: number
}

export interface UpdateRoleData {
    roleId: number,
    roleName: string
}
