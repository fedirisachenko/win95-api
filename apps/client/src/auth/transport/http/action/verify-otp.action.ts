import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { VerifyOtpActionService } from '../../../action-service/verify-otp.action-service';
import { VerifyOtpInput } from '../dto/input/verify-otp.input';

@ApiTags('Auth')
@Controller('api-client/auth/verify-otp')
export class VerifyOtpAction {
    constructor(private readonly actionService: VerifyOtpActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify OTP code' })
    @ApiResponse({ status: 200, description: 'OTP verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
    async invoke(@Body() data: VerifyOtpInput): Promise<boolean> {
        await this.actionService.invoke(data);
        return true;
    }
}
