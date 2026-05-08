import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiSecurity } from '@libs/security';

import { ResetPasswordActionService } from '../../../action-service/reset-password.action-service';
import { ResetPasswordInput } from '../dto/input/reset-password.input';

@ApiTags('Auth')
@Controller('api-client/auth/reset-password')
export class ResetPasswordAction {
    constructor(private readonly actionService: ResetPasswordActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    @ApiSecurity()
    async invoke(@Body() data: ResetPasswordInput): Promise<boolean> {
        await this.actionService.invoke(data);
        return true;
    }
}
