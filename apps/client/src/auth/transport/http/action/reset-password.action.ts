import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiSecurity } from '@libs/security';
import { ResetPasswordInput } from '../dto/input/reset-password.input';
import { ResetPasswordUseCase } from '../use-case/reset-password.use-case';

@ApiTags('Auth')
@Controller('api-client/auth/reset-password')
export class ResetPasswordAction {
    constructor(private readonly useCase: ResetPasswordUseCase) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    @ApiSecurity()
    async invoke(@Body() data: ResetPasswordInput): Promise<boolean> {
        await this.useCase.invoke(data);
        return true;
    }
}
