import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpSecurityGuard } from './guard/http-security.guard';
import { WsSecurityGuard } from './guard/ws-security.guard';
import { HttpExceptionFilter } from './exception/http-exception-filter';
import { AuthModule, AuthModuleOptions } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PermissionAccessManager } from './rbac/service/permission-access-manager';
import { PermissionVoter } from './rbac/voter/permission.voter';
import { SecurityManager } from './rbac/service/security-manager';
import { VoterInterface } from './rbac/voter/voter.interface';

export type SecurityModuleOptions = AuthModuleOptions;

@Module({})
export class SecurityModule {
    static forRoot(options: SecurityModuleOptions = {}): DynamicModule {
        return {
            module: SecurityModule,
            global: true,
            imports: [JwtModule.register({}), AuthModule.forRoot(options)],
            providers: [
                HttpSecurityGuard,
                WsSecurityGuard,
                PermissionAccessManager,
                PermissionVoter,
                {
                    provide: SecurityManager,
                    useFactory: (...voters: VoterInterface[]) => new SecurityManager(voters),
                    inject: [PermissionVoter],
                },
                { provide: APP_FILTER, useClass: HttpExceptionFilter },
            ],
            exports: [HttpSecurityGuard, WsSecurityGuard, SecurityManager, PermissionAccessManager],
        };
    }
}
