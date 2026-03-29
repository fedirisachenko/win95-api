import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export interface JwtConfig {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
}

export const JWT_CONFIG = Symbol('JWT_CONFIG');

export const jwtConfigProvider: Provider = {
    provide: JWT_CONFIG,
    useFactory: (configService: ConfigService): JwtConfig => ({
        accessSecret: configService.get<string>('JWT_ACCESS_SECRET'),
        refreshSecret: configService.get<string>('JWT_REFRESH_SECRET'),
        accessExpiresIn: configService.get<string>('JWT_ACCESS_EXPIRE', '15m'),
        refreshExpiresIn: configService.get<string>('JWT_REFRESH_EXPIRE', '7d'),
    }),
    inject: [ConfigService],
};