import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordInput } from '../dto/input';
import { ResetPasswordActionService } from '../action-service/reset-password-action-service';

@ApiTags('Auth')
@Controller('reset-password')
export class ResetPasswordAction {
    constructor(private readonly actionService: ResetPasswordActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async invoke(@Body() data: ResetPasswordInput): Promise<boolean> {
        await this.actionService.invoke(data);
        return true;
    }
}
