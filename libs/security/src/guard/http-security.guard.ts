import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from '../constant/di-token.constant';
import { JwtConfig } from '../interface/jwt-config.interface';
import { TokenPayload } from '../token/token.service';

@Injectable()
export class HttpSecurityGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(JWT_CONFIG) private readonly config: JwtConfig,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.['authorization']?.split(' ')[1];
        if (!token) throw new UnauthorizedException();

        try {
            const payload = this.jwtService.verify<TokenPayload>(token, {
                secret: this.config.accessSecret,
            });

            if (payload.type !== 'access') throw new UnauthorizedException();

            request.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
}
