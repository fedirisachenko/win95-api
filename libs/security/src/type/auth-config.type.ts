export type OtpConfig = {
    expiresInSeconds: number;
    codeLength: number;
    maxAttempts: number;
};

export type AuthConfig = {
    enabled: boolean;
    otp: OtpConfig;
};
