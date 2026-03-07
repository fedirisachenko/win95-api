import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HttpSecurityGuard } from '../guard/http-security.guard';

type ApiSecurityOptions = { guards?: CanActivate[] };

export function ApiSecurity({ guards = [] }: ApiSecurityOptions) {
    return applyDecorators(
        UseGuards(HttpSecurityGuard, ...guards),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
