const OTP_PREFIX = 'otp:';

export const otpKey = (email: string): string => `${OTP_PREFIX}${email}`;
