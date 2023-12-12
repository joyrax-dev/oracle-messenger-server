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
export interface ReLoginCallbackData {
    userId: number,
    token: string,
    isNextReLogin: boolean
}

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