import {WithId} from "mongodb";
import {UserDBType, OutputUserItemType} from "./output";

export const userMapper = (user: WithId<UserDBType>): OutputUserItemType => {
    return {
        id: user._id.toString(),
        accountData: {
            login: user.accountData.login,
            email: user.accountData.email,
            passwordHash: user.accountData.passwordHash,
            passwordRecoveryCode: user.accountData.passwordRecoveryCode,
            recoveryCodeExpirationDate: user.accountData.recoveryCodeExpirationDate,
            createdAt: user.accountData.createdAt
        },
        emailConfirmation: {
            confirmationCode: user.emailConfirmation.confirmationCode,
            expirationDate: user.emailConfirmation.expirationDate,
            isConfirmed: user.emailConfirmation.isConfirmed
        }
    }
}

export const userMapper1 = (user: WithId<UserDBType>): OutputUserItemType => {
    return {
        id: user._id.toString(),
        accountData: {
            login: user.accountData.login,
            email: user.accountData.email,
            passwordHash: user.accountData.passwordHash,
            passwordRecoveryCode: user.accountData.passwordRecoveryCode,
            recoveryCodeExpirationDate: user.accountData.recoveryCodeExpirationDate,
            createdAt: user.accountData.createdAt
        },
        emailConfirmation: {
            confirmationCode: user.emailConfirmation.confirmationCode,
            expirationDate: user.emailConfirmation.expirationDate,
            isConfirmed: user.emailConfirmation.isConfirmed
        }
    }
}