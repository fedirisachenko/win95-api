import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpSecurityGuard } from './guard/http-security.guard';
import { WsSecurityGuard } from './guard/ws-security.guard';
import { HttpExceptionFilter } from './exception/http-exception-filter';
import { AuthModule, AuthModuleOptions } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

export type SecurityModuleOptions = AuthModuleOptions;

@Module({})
export class SecurityModule {
    static forRoot(options: SecurityModuleOptions = {}): DynamicModule {
        return {
            module: SecurityModule,
            global: true,
            imports: [JwtModule.register({}), AuthModule.forRoot(options)],
            providers: [HttpSecurityGuard, WsSecurityGuard, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
            exports: [HttpSecurityGuard, WsSecurityGuard],
        };
    }
}
