export class LoginIsBusy extends Error {
    public static code: number = 1
}
export class EmailIsBusy extends Error {
    public static code: number = 2
}
export class InvalidRole extends Error {
    public static code: number = 3
}
export class UserNotFoundByLogin extends Error {
    public static code: number = 4
}
export class UserNotFoundById extends Error {
    public static code: number = 5
}
export class IncorrectPassword extends Error {
    public static code: number = 6
}
export class ChatNotFoundById extends Error {
    public static code: number = 7
}

export class ParticipantNotFoundByChatIdAndUserId extends Error {
    public static code: number = 8
}
export class NoParticipantsWereFound extends Error {
    public static code: number = 9
}
export class ReLoginTokenNotFoundByUserIdAndToken extends Error {
    public static code: number = 10
}
export class ReLoginTokenNotFoundById extends Error {
    public static code: number = 11
}

export class AlreadyLoggedIn extends Error {
    public static code: number = 12
}

export class RoleAlreadyExists extends Error {
    public static code: number = 13
}

export class YouAreNotLoggedIn extends Error {
    public static code: number = 14
}

export class ParticipantsNotFoundByChatId extends Error {
    public static code: number = 15
}

export class UserHasAlreadyJoinedTheChatRoom extends Error {
    public static code: number = 16
}

export class TheUserHasNotJoinedTheChatRoom extends Error {
    public static code: number = 17
}

export class YouAreNotJoinedTheChatRoom extends Error {
    public static code: number = 18
}
export class PrivateChatAlreadyExists extends Error {
    public static code: number = 19
}
export class MessageNotFoundById extends Error {
    public static code: number = 20
}