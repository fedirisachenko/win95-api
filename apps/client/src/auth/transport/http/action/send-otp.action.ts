import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SendOtpActionService } from '../../../action-service/send-otp.action-service';
import { SendOtpInput } from '../dto/input/send-otp.input';

@ApiTags('Auth')
@Controller('api-client/auth/send-otp')
export class SendOtpAction {
    constructor(private readonly actionService: SendOtpActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send OTP code' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully, returns expiration time in seconds' })
    async invoke(@Body() data: SendOtpInput): Promise<number> {
        return this.actionService.invoke(data);
    }
}
