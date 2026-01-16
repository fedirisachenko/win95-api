import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendOtpInput } from '../dto/input';
import { OtpSentOutput } from '../dto/output';
import { SendOtpActionService } from '../action-service/send-otp-action-service';

@ApiTags('Auth')
@Controller('send-otp')
export class SendOtpAction {
    constructor(private readonly actionService: SendOtpActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send OTP code' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully', type: OtpSentOutput })
    async invoke(@Body() data: SendOtpInput): Promise<OtpSentOutput> {
        return this.actionService.invoke(data);
    }
}
