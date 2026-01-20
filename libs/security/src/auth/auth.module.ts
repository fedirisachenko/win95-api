import { DynamicModule, Module, Provider } from '@nestjs/common';
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

const DEFAULT_AUTH_CONFIG: AuthConfig = {
    enabled: true,
    routePrefix: '/auth',
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        accessTokenExpiresIn: '15m',
        refreshTokenExpiresIn: '7d',
    },
    otp: {
        expiresInSeconds: 300,
        codeLength: 6,
        maxAttempts: 3,
    },
};

const notifications = [SendOtpNotification, SendResetPasswordNotification];

@Module({})
export class AuthModule {
    static forRoot(options: SecurityModuleOptions): DynamicModule {
        const authConfig: AuthConfig = {
            ...DEFAULT_AUTH_CONFIG,
            ...options.auth,
            jwt: {
                ...DEFAULT_AUTH_CONFIG.jwt,
                ...options.auth?.jwt,
            },
            otp: {
                ...DEFAULT_AUTH_CONFIG.otp,
                ...options.auth?.otp,
            },
        };

        const authEnabled = authConfig.enabled !== false;

        const codeStorageProvider: Provider = this.createCodeStorageProvider(options.codeStorage);

        const authProviders: Provider[] = authEnabled
            ? [{ provide: AUTH_CONFIG, useValue: authConfig }, codeStorageProvider, TokenService, TokenBlacklistService]
            : [codeStorageProvider];

        const imports: any[] = [
            JwtModule.register({}),
            NotificationModule.forRoot({ events: authEnabled ? notifications : [] }),
        ];

        if (authEnabled && authConfig.routePrefix) {
            imports.push(
                RouterModule.register([
                    {
                        path: authConfig.routePrefix,
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
