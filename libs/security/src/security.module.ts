import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { HttpSecurityGuard } from './guard/http-security.guard';
import { WsSecurityGuard } from './guard/ws-security.guard';
import { HttpExceptionFilter } from './exception/http-exception-filter';
import { PermissionAccessManager } from './rbac/service/permission-access-manager';
import { PermissionVoter } from './rbac/voter/permission.voter';
import { SecurityManager } from './rbac/service/security-manager';
import { VoterInterface } from './rbac/voter/voter.interface';
import { TokenService } from './token/token.service';
import { TokenBlacklistService } from './token/token-blacklist.service';
import { CodeStorageInterface } from './contract/code-storage.interface';
import { CODE_STORAGE, JWT_CONFIG } from './constant/di-token.constant';
import { JwtConfig } from './type/jwt-config.type';
import { LocalStorage } from './service/code-storage/local-storage';

export type CodeStorageFactory = {
    useFactory: (...args: any[]) => CodeStorageInterface | Promise<CodeStorageInterface>;
    inject?: any[];
};

export type SecurityModuleOptions = {
    codeStorage?: CodeStorageInterface | CodeStorageFactory;
};

@Module({})
export class SecurityModule {
    static forRoot(options: SecurityModuleOptions = {}): DynamicModule {
        const codeStorageProvider = this.createCodeStorageProvider(options.codeStorage);

        return {
            module: SecurityModule,
            global: true,
            imports: [JwtModule.register({})],
            providers: [
                {
                    provide: JWT_CONFIG,
                    useFactory: (configService: ConfigService): JwtConfig => ({
                        accessSecret: configService.get<string>('JWT_ACCESS_SECRET'),
                        refreshSecret: configService.get<string>('JWT_REFRESH_SECRET'),
                        accessExpiresIn: configService.get<string>('JWT_ACCESS_EXPIRE', '15m'),
                        refreshExpiresIn: configService.get<string>('JWT_REFRESH_EXPIRE', '7d'),
                    }),
                    inject: [ConfigService],
                },
                codeStorageProvider,
                HttpSecurityGuard,
                WsSecurityGuard,
                TokenService,
                TokenBlacklistService,
                PermissionAccessManager,
                PermissionVoter,
                {
                    provide: SecurityManager,
                    useFactory: (...voters: VoterInterface[]) => new SecurityManager(voters),
                    inject: [PermissionVoter],
                },
                { provide: APP_FILTER, useClass: HttpExceptionFilter },
            ],
            exports: [
                JwtModule,
                JWT_CONFIG,
                HttpSecurityGuard,
                WsSecurityGuard,
                SecurityManager,
                PermissionAccessManager,
                TokenService,
                TokenBlacklistService,
                CODE_STORAGE,
            ],
        };
    }

    private static isCodeStorageFactory(
        storage: CodeStorageInterface | CodeStorageFactory | undefined,
    ): storage is CodeStorageFactory {
        return storage !== undefined && 'useFactory' in storage;
    }

    private static createCodeStorageProvider(storage: CodeStorageInterface | CodeStorageFactory | undefined): Provider {
        if (!storage) {
            return { provide: CODE_STORAGE, useValue: new LocalStorage() };
        }

        if (this.isCodeStorageFactory(storage)) {
            return { provide: CODE_STORAGE, useFactory: storage.useFactory, inject: storage.inject || [] };
        }

        return { provide: CODE_STORAGE, useValue: storage };
    }
}
