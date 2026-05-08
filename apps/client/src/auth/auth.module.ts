import { Module, Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { NotificationModule } from '@libs/notification';
import { RmqModule } from '@libs/rmq';
import { AUTH_CONFIG, AuthConfig, GoogleProvider, SOCIAL_PROVIDERS } from '@libs/security';

import { LogoutActionService } from './action-service/logout.action-service';
import { RefreshTokenActionService } from './action-service/refresh-token.action-service';
import { ResetPasswordActionService } from './action-service/reset-password.action-service';
import { SendOtpActionService } from './action-service/send-otp.action-service';
import { SendResetPasswordActionService } from './action-service/send-reset-password.action-service';
import { SignInActionService } from './action-service/sign-in.action-service';
import { SignUpActionService } from './action-service/sign-up.action-service';
import { SocialAuthActionService } from './action-service/social-auth.action-service';
import { VerifyOtpActionService } from './action-service/verify-otp.action-service';
import { SendOtpNotification } from './notification/send-otp.notification';
import { SendResetPasswordNotification } from './notification/send-reset-password.notification';
import { LogoutAction } from './transport/http/action/logout.action';
import { RefreshTokenAction } from './transport/http/action/refresh-token.action';
import { ResetPasswordAction } from './transport/http/action/reset-password.action';
import { SendOtpAction } from './transport/http/action/send-otp.action';
import { SendResetPasswordAction } from './transport/http/action/send-reset-password.action';
import { SignInAction } from './transport/http/action/sign-in.action';
import { SignUpAction } from './transport/http/action/sign-up.action';
import { SocialAuthAction } from './transport/http/action/social-auth.action';
import { VerifyOtpAction } from './transport/http/action/verify-otp.action';

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

const actionServices = [
    SignUpActionService,
    SignInActionService,
    RefreshTokenActionService,
    LogoutActionService,
    SendOtpActionService,
    VerifyOtpActionService,
    SendResetPasswordActionService,
    ResetPasswordActionService,
    SocialAuthActionService,
];

const notifications = [SendOtpNotification, SendResetPasswordNotification];

const authConfigProvider: Provider = {
    provide: AUTH_CONFIG,
    useFactory: (): AuthConfig => ({
        enabled: true,
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
        ...actionServices,
        GoogleProvider,
        {
            provide: SOCIAL_PROVIDERS,
            useFactory: (...providers) => providers,
            inject: [GoogleProvider],
        },
    ],
})
export class AuthModule {}
