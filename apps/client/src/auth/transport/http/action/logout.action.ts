import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiSecurity } from '@libs/security';

import { LogoutActionService } from '../../../action-service/logout.action-service';
import { LogoutInput } from '../dto/input/logout.input';

@ApiTags('Auth')
@Controller('api-client/auth/logout')
export class LogoutAction {
    constructor(private readonly actionService: LogoutActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and invalidate refresh token' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    @ApiSecurity()
    async invoke(@Body() data: LogoutInput): Promise<boolean> {
        await this.actionService.invoke(data);
        return true;
    }
}
