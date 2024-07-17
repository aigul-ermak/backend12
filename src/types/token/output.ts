export type TokenType = {
    token: string,
}


export type RefreshedToken = {
    accessToken: string,
    refreshToken: string
}

export type SecurityTokenType = {
    id: string,
    deviceId: string,
    iatDate: Date,
    expDate: Date,
}

export type RefreshToken = {
    userId: string;
    deviceId: string;
    iatDate: string;
    expDate: string;
}

export type RefreshTokenType = {
    userId: string;
    deviceId: string;
    ip: string,
    title: string,
    iatDate: string;
    expDate: string;
}

export type RefreshTokenPayload ={
    userId: string,
    deviceId: string,
}


export type SessionDBType = {
    userId: string;
    deviceId: string;
    ip: string,
    title: string,
    iatDate: string;
    expDate: string;
}