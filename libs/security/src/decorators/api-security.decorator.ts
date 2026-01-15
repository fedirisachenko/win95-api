import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SECURITY_METADATA } from '../constants';
import { SecurityGuard, SecurityMetadata } from '../guards/security.guard';

export type ApiSecurityOptions = {
    transport: string;
    strategy: string;
};

export function ApiSecurity(options: ApiSecurityOptions) {
    const metadata: SecurityMetadata = {
        transport: options.transport,
        strategy: options.strategy,
    };

    return applyDecorators(
        SetMetadata(SECURITY_METADATA, metadata),
        UseGuards(SecurityGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
