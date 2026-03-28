import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyOtpInput } from '../dto';
import { VerifyOtpUseCase } from '../../../use-case/verify-otp.use-case';

@ApiTags('Auth')
@Controller('verify-otp')
export class VerifyOtpAction {
    constructor(private readonly useCase: VerifyOtpUseCase) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify OTP code' })
    @ApiResponse({ status: 200, description: 'OTP verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
    async invoke(@Body() data: VerifyOtpInput): Promise<boolean> {
        await this.useCase.invoke(data);
        return true;
    }
}
