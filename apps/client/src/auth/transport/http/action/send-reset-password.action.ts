import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiSecurity } from '@libs/security';
import { SendResetPasswordInput } from '../dto/input/send-reset-password.input';
import { SendResetPasswordUseCase } from '../use-case/send-reset-password.use-case';

@ApiTags('Auth')
@Controller('api-client/auth/send-reset-password')
export class SendResetPasswordAction {
    constructor(private readonly useCase: SendResetPasswordUseCase) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send reset password email' })
    @ApiResponse({ status: 200, description: 'Reset password email sent' })
    @ApiSecurity()
    async invoke(@Body() data: SendResetPasswordInput): Promise<boolean> {
        await this.useCase.invoke(data);
        return true;
    }
}
