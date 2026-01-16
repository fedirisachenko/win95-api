import { DynamicModule, Module, OnModuleInit, Provider, Type } from '@nestjs/common';
import { ModuleRef, RouterModule } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Transport } from './strategy/interface/transport.interface';
import { AuthStrategy } from './strategy/interface/auth-strategy.interface';
import { SecurityRegistry } from './security.registry';
import { SecurityGuard } from './guards/security.guard';
import { AuthConfig } from './auth/interfaces/auth-config.interface';
import { NotificationModule } from '@libs/notification';
import { TokenService } from './tokens/token.service';
import { TokenBlacklistService } from './tokens/token-blacklist.service';
import { AUTH_CONFIG } from './constants';
import {
    SignUpAction,
    SignInAction,
    RefreshTokenAction,
    LogoutAction,
    SendResetPasswordAction,
    ResetPasswordAction,
    SendOtpAction,
    VerifyOtpAction,
} from './auth/action';
import {
    SignUpActionService,
    SignInActionService,
    RefreshTokenActionService,
    LogoutActionService,
    SendResetPasswordActionService,
    ResetPasswordActionService,
    SendOtpActionService,
    VerifyOtpActionService,
} from './auth/action-service';
import { SendOtpNotification, SendResetPasswordNotification } from './auth/notification';

export type SecurityModuleOptions = {
    transports: Type<Transport>[];
    strategies: Type<AuthStrategy>[];
    auth?: Partial<AuthConfig>;
};

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

const AUTH_ACTIONS = [
    SignUpAction,
    SignInAction,
    RefreshTokenAction,
    LogoutAction,
    SendResetPasswordAction,
    ResetPasswordAction,
    SendOtpAction,
    VerifyOtpAction,
];

const AUTH_ACTION_SERVICES = [
    SignUpActionService,
    SignInActionService,
    RefreshTokenActionService,
    LogoutActionService,
    SendResetPasswordActionService,
    ResetPasswordActionService,
    SendOtpActionService,
    VerifyOtpActionService,
];

const AUTH_NOTIFICATIONS = [SendOtpNotification, SendResetPasswordNotification];

@Module({})
export class SecurityModule implements OnModuleInit {
    private static options: SecurityModuleOptions;

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly registry: SecurityRegistry,
    ) {}

    static forRoot(options: SecurityModuleOptions): DynamicModule {
        SecurityModule.options = options;

        const transportProviders: Provider[] = options.transports.map((TransportClass) => ({
            provide: TransportClass,
            useClass: TransportClass,
        }));

        const strategyProviders: Provider[] = options.strategies.map((StrategyClass) => ({
            provide: StrategyClass,
            useClass: StrategyClass,
        }));

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

        const authProviders: Provider[] = authEnabled
            ? [
                  { provide: AUTH_CONFIG, useValue: authConfig },
                  TokenService,
                  TokenBlacklistService,
                  ...AUTH_ACTION_SERVICES,
                  ...AUTH_NOTIFICATIONS,
              ]
            : [];

        const controllers = authEnabled ? AUTH_ACTIONS : [];

        const imports: any[] = [
            JwtModule.register({}),
            NotificationModule.forRoot({ events: authEnabled ? AUTH_NOTIFICATIONS : [] }),
        ];

        if (authEnabled && authConfig.routePrefix) {
            imports.push(
                RouterModule.register([
                    {
                        path: authConfig.routePrefix,
                        module: SecurityModule,
                    },
                ]),
            );
        }

        return {
            module: SecurityModule,
            global: true,
            imports,
            controllers,
            providers: [SecurityRegistry, SecurityGuard, ...transportProviders, ...strategyProviders, ...authProviders],
            exports: [
                SecurityRegistry,
                SecurityGuard,
                ...options.transports,
                ...options.strategies,
                ...(authEnabled ? [TokenService, ...AUTH_ACTION_SERVICES] : []),
            ],
        };
    }

    async onModuleInit(): Promise<void> {
        const options = SecurityModule.options;
        if (!options) return;

        for (const TransportClass of options.transports) {
            const transport = this.moduleRef.get(TransportClass, { strict: false });
            this.registry.registerTransport(transport);
        }

        for (const StrategyClass of options.strategies) {
            const strategy = this.moduleRef.get(StrategyClass, { strict: false });
            this.registry.registerStrategy(strategy);
        }
    }
}
