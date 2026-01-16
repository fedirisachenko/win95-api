import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogoutInput } from '../dto/input';
import { SuccessOutput } from '../dto/output';
import { LogoutActionService } from '../action-service/logout-action-service';

@ApiTags('Auth')
@Controller('logout')
export class LogoutAction {
    constructor(private readonly actionService: LogoutActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and invalidate refresh token' })
    @ApiResponse({ status: 200, description: 'Logged out successfully', type: SuccessOutput })
    async invoke(@Body() data: LogoutInput): Promise<SuccessOutput> {
        return this.actionService.invoke(data);
    }
}
