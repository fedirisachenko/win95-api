import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '@libs/security/auth/interface/auth-config.interface';
import { CodeStorageFactory, SecurityModuleOptions } from '@libs/security/security.module';
import { AUTH_CONFIG, CODE_STORAGE } from '@libs/security/constant/di-token.constant';

import { VerifyOtpAction } from './action/verify-otp-action';
import { SignUpAction } from './action/sign-up-action';
import { SignInAction } from './action/sign-in-action';
import { RefreshTokenAction } from './action/refresh-token-action';
import { LogoutAction } from './action/logout-action';
import { SendResetPasswordAction } from './action/send-reset-password-action';
import { ResetPasswordAction } from './action/reset-password-action';
import { SendOtpAction } from './action/send-otp-action';

import { SignUpActionService } from './action-service/sign-up-action-service';
import { SignInActionService } from './action-service/sign-in-action-service';
import { RefreshTokenActionService } from './action-service/refresh-token-action-service';
import { LogoutActionService } from './action-service/logout-action-service';
import { SendResetPasswordActionService } from './action-service/send-reset-password-action-service';
import { ResetPasswordActionService } from './action-service/reset-password-action-service';
import { SendOtpActionService } from './action-service/send-otp-action-service';
import { VerifyOtpActionService } from './action-service/verify-otp-action-service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '@libs/notification';

import { SendOtpNotification } from './notification/send-otp-notification';
import { SendResetPasswordNotification } from './notification/send-reset-password-notification';
import { RouterModule } from '@nestjs/core';

import { TokenService } from '@libs/security/token/token.service';
import { TokenBlacklistService } from '@libs/security/token/token-blacklist.service';
import { CodeStorageInterface } from '@libs/security/contract/code-storage.interface';
import { LocalStorage } from '@libs/security/service/code-storage/local-storage';

const notifications = [SendOtpNotification, SendResetPasswordNotification];

@Module({})
export class AuthModule {
    static forRoot(options: SecurityModuleOptions): DynamicModule {
        const authEnabled = options.auth?.enabled !== false;

        const codeStorageProvider: Provider = this.createCodeStorageProvider(options.codeStorage);

        const authConfigProvider: Provider = {
            provide: AUTH_CONFIG,
            useFactory: (configService: ConfigService): AuthConfig => ({
                enabled: options.auth?.enabled ?? true,
                routePrefix: options.auth?.routePrefix ?? '/auth',
                jwt: {
                    accessTokenSecret: configService.get<string>('JWT_ACCESS_SECRET'),
                    refreshTokenSecret: configService.get<string>('JWT_REFRESH_SECRET'),
                    accessTokenExpiresIn:
                        options.auth?.jwt?.accessTokenExpiresIn ??
                        configService.get<string>('JWT_ACCESS_EXPIRE', '15m'),
                    refreshTokenExpiresIn:
                        options.auth?.jwt?.refreshTokenExpiresIn ??
                        configService.get<string>('JWT_REFRESH_EXPIRE', '7d'),
                },
                otp: {
                    expiresInSeconds: options.auth?.otp?.expiresInSeconds ?? 300,
                    codeLength: options.auth?.otp?.codeLength ?? 6,
                    maxAttempts: options.auth?.otp?.maxAttempts ?? 3,
                },
            }),
            inject: [ConfigService],
        };

        const authProviders: Provider[] = authEnabled
            ? [authConfigProvider, codeStorageProvider, TokenService, TokenBlacklistService]
            : [codeStorageProvider];

        const imports: any[] = [
            JwtModule.register({}),
            NotificationModule.forRoot({ events: authEnabled ? notifications : [] }),
        ];

        const routePrefix = options.auth?.routePrefix ?? '/auth';

        if (authEnabled && routePrefix) {
            imports.push(
                RouterModule.register([
                    {
                        path: routePrefix,
                        module: AuthModule,
                    },
                ]),
            );
        }

        return {
            module: AuthModule,
            imports,
            controllers: [
                SignUpAction,
                SignInAction,
                RefreshTokenAction,
                LogoutAction,
                SendResetPasswordAction,
                ResetPasswordAction,
                SendOtpAction,
                VerifyOtpAction,
            ],
            providers: [
                SignUpActionService,
                SignInActionService,
                RefreshTokenActionService,
                LogoutActionService,
                SendResetPasswordActionService,
                ResetPasswordActionService,
                SendOtpActionService,
                VerifyOtpActionService,
                ...authProviders,
            ],
            exports: [AUTH_CONFIG],
        };
    }

    private static isCodeStorageFactory(
        storage: CodeStorageInterface | CodeStorageFactory | undefined,
    ): storage is CodeStorageFactory {
        return storage !== undefined && 'useFactory' in storage;
    }

    private static createCodeStorageProvider(storage: CodeStorageInterface | CodeStorageFactory | undefined): Provider {
        if (!storage) {
            return {
                provide: CODE_STORAGE,
                useValue: new LocalStorage(),
            };
        }

        if (this.isCodeStorageFactory(storage)) {
            return {
                provide: CODE_STORAGE,
                useFactory: storage.useFactory,
                inject: storage.inject || [],
            };
        }

        return {
            provide: CODE_STORAGE,
            useValue: storage,
        };
    }
}
