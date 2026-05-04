import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiSecurity } from '@libs/security';
import { LogoutInput } from '../dto/input/logout.input';
import { LogoutUseCase } from '../use-case/logout.use-case';

@ApiTags('Auth')
@Controller('api-client/auth/logout')
export class LogoutAction {
    constructor(private readonly useCase: LogoutUseCase) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and invalidate refresh token' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    @ApiSecurity()
    async invoke(@Body() data: LogoutInput): Promise<boolean> {
        await this.useCase.invoke(data);
        return true;
    }
}
