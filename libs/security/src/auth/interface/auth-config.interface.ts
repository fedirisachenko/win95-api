export interface JwtConfig {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
}

export interface OtpConfig {
    expiresInSeconds: number;
    codeLength: number;
    maxAttempts: number;
}

export interface AuthConfig {
    enabled: boolean;
    routePrefix: string;
    jwt: JwtConfig;
    otp: OtpConfig;
}
