export type OutputUserItemType = {
    id: string,
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordRecoveryCode: string,
        recoveryCodeExpirationDate: Date | null,
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

export type OutputUsersType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputUserItemType[]
}

export type UserDBType = {
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordRecoveryCode: string,
        recoveryCodeExpirationDate: Date | null,
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

export type UserType = {
    login: string,
    email: string,
    createdAt: string
}

export type SortUserType = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string
}

export type OutputUserItemType1 = {
    id: string
}






