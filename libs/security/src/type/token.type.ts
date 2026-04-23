export type TokenPair = {
    accessToken: string;
    refreshToken: string;
};

export type TokenPayload = {
    sub: string;
    type: 'access' | 'refresh';
};
