import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogoutInput } from '../dto/input/logout-input';
import { LogoutActionService } from '../action-service/logout-action-service';
import { ApiSecurity } from '../../decorator/api-security.decorator';

@ApiTags('Auth')
@Controller('logout')
export class LogoutAction {
    constructor(private readonly actionService: LogoutActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and invalidate refresh token' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    @ApiSecurity({ strategy: 'jwt', transport: 'http' })
    async invoke(@Body() data: LogoutInput): Promise<boolean> {
        await this.actionService.invoke(data);
        return true;
    }
}
