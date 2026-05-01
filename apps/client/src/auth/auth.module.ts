import { Module, Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RouterModule } from '@nestjs/core';
import { NotificationModule } from '@libs/notification';
import { AUTH_CONFIG, SOCIAL_PROVIDERS, GoogleProvider, AuthConfig } from '@libs/security';

import { SignUpAction } from './transport/http/action/sign-up.action';
import { SignInAction } from './transport/http/action/sign-in.action';
import { RefreshTokenAction } from './transport/http/action/refresh-token.action';
import { LogoutAction } from './transport/http/action/logout.action';
import { SendOtpAction } from './transport/http/action/send-otp.action';
import { VerifyOtpAction } from './transport/http/action/verify-otp.action';
import { SendResetPasswordAction } from './transport/http/action/send-reset-password.action';
import { ResetPasswordAction } from './transport/http/action/reset-password.action';
import { SocialAuthAction } from './transport/http/action/social-auth.action';

import { SignUpUseCase } from './transport/http/use-case/sign-up.use-case';
import { SignInUseCase } from './transport/http/use-case/sign-in.use-case';
import { RefreshTokenUseCase } from './transport/http/use-case/refresh-token.use-case';
import { LogoutUseCase } from './transport/http/use-case/logout.use-case';
import { SendOtpUseCase } from './transport/http/use-case/send-otp.use-case';
import { VerifyOtpUseCase } from './transport/http/use-case/verify-otp.use-case';
import { SendResetPasswordUseCase } from './transport/http/use-case/send-reset-password.use-case';
import { ResetPasswordUseCase } from './transport/http/use-case/reset-password.use-case';
import { SocialAuthUseCase } from './transport/http/use-case/social-auth.use-case';

import { SendOtpNotification } from './notification/send-otp.notification';
import { SendResetPasswordNotification } from './notification/send-reset-password.notification';
import { RmqModule } from '@libs/rmq';
import { ConfigService } from '@nestjs/config';

const actions = [
    SignUpAction,
    SignInAction,
    RefreshTokenAction,
    LogoutAction,
    SendOtpAction,
    VerifyOtpAction,
    SendResetPasswordAction,
    ResetPasswordAction,
    SocialAuthAction,
];

const useCases = [
    SignUpUseCase,
    SignInUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    SendOtpUseCase,
    VerifyOtpUseCase,
    SendResetPasswordUseCase,
    ResetPasswordUseCase,
    SocialAuthUseCase,
];

const notifications = [SendOtpNotification, SendResetPasswordNotification];

const authConfigProvider: Provider = {
    provide: AUTH_CONFIG,
    useFactory: (): AuthConfig => ({
        enabled: true,
        routePrefix: '/auth',
        otp: {
            expiresInSeconds: 300,
            codeLength: 6,
            maxAttempts: 3,
        },
    }),
};

@Module({
    imports: [
        HttpModule,
        RouterModule.register([{ path: '/auth', module: AuthModule }]),
        NotificationModule.forRoot({ events: notifications }),
        RmqModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                urls: configService.get<string>('AMQP_URLS', 'amqp://localhost:56721').split(','),
                exchange: configService.get<string>('AMQP_EXCHANGE_NAME', 'broadcast'),
                exchangeType: 'direct',
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: actions,
    providers: [
        authConfigProvider,
        ...useCases,
        GoogleProvider,
        {
            provide: SOCIAL_PROVIDERS,
            useFactory: (...providers) => providers,
            inject: [GoogleProvider],
        },
    ],
})
export class AuthModule {}
