import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SecurityRegistry } from '../security.registry';
import { SECURITY_METADATA } from '../constants';

export type SecurityMetadata = {
    transport: string;
    strategy: string;
};

@Injectable()
export class SecurityGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly registry: SecurityRegistry,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const metadata = this.reflector.getAllAndOverride<SecurityMetadata>(SECURITY_METADATA, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!metadata) {
            return true;
        }

        const transport = this.registry.getTransport(metadata.transport);
        const strategy = this.registry.getStrategy(metadata.strategy);

        const user = await strategy.validate(context, transport);

        if (!user) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
