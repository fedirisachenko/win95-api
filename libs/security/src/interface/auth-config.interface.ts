export interface OtpConfig {
    expiresInSeconds: number;
    codeLength: number;
    maxAttempts: number;
}

export interface AuthConfig {
    enabled: boolean;
    routePrefix: string;
    otp: OtpConfig;
}
