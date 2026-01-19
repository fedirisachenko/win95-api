import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendResetPasswordInput } from '../dto/input';
import { SendResetPasswordActionService } from '../action-service/send-reset-password-action-service';
import { ApiSecurity } from '@libs/security/decorators/api-security.decorator';

@ApiTags('Auth')
@Controller('send-reset-password')
export class SendResetPasswordAction {
    constructor(private readonly actionService: SendResetPasswordActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send reset password email' })
    @ApiResponse({ status: 200, description: 'Reset password email sent' })
    @ApiSecurity({ strategy: 'jwt', transport: 'http' })
    async invoke(@Body() data: SendResetPasswordInput): Promise<boolean> {
        await this.actionService.invoke(data);
        return true;
    }
}
