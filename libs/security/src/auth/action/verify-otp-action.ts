import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyOtpInput } from '../dto/input';
import { OtpVerifiedOutput } from '../dto/output';
import { VerifyOtpActionService } from '../action-service/verify-otp-action-service';

@ApiTags('Auth')
@Controller('verify-otp')
export class VerifyOtpAction {
    constructor(private readonly actionService: VerifyOtpActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify OTP code' })
    @ApiResponse({ status: 200, description: 'OTP verified successfully', type: OtpVerifiedOutput })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
    async invoke(@Body() data: VerifyOtpInput): Promise<OtpVerifiedOutput> {
        return this.actionService.invoke(data);
    }
}
