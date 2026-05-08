import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiSecurity } from '@libs/security';

import { SendResetPasswordActionService } from '../../../action-service/send-reset-password.action-service';
import { SendResetPasswordInput } from '../dto/input/send-reset-password.input';

@ApiTags('Auth')
@Controller('api-client/auth/send-reset-password')
export class SendResetPasswordAction {
    constructor(private readonly actionService: SendResetPasswordActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send reset password email' })
    @ApiResponse({ status: 200, description: 'Reset password email sent' })
    @ApiSecurity()
    async invoke(@Body() data: SendResetPasswordInput): Promise<boolean> {
        await this.actionService.invoke(data);
        return true;
    }
}
