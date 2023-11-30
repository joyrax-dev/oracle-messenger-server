import User from "../Database/Models/User.model"

export interface UserData {
    isAuth: boolean
    user: User
}

export interface LoginData {
    login: string,
    password: string
}

export interface RegisterData {
    login: string,
    email: string,
    password: string
}