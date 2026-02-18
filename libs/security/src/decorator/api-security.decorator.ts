import { applyDecorators, CanActivate, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SECURITY_METADATA } from '../constant/security.constant';
import { SecurityGuard, SecurityMetadata } from '../guard/security.guard';

export type ApiSecurityOptions = {
    transport: string;
    strategy: string;
    guards?: (CanActivate | ((...args: any[]) => void) | any)[];
};

export function ApiSecurity({ transport, strategy, guards = [] }: ApiSecurityOptions) {
    const metadata: SecurityMetadata = {
        transport,
        strategy,
    };

    return applyDecorators(
        SetMetadata(SECURITY_METADATA, metadata),
        UseGuards(SecurityGuard, ...guards),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
