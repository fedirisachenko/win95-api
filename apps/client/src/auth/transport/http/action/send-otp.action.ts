import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendOtpInput } from '../dto';
import { SendOtpUseCase } from '../../../use-case/send-otp.use-case';

@ApiTags('Auth')
@Controller('send-otp')
export class SendOtpAction {
    constructor(private readonly useCase: SendOtpUseCase) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send OTP code' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully, returns expiration time in seconds' })
    async invoke(@Body() data: SendOtpInput): Promise<number> {
        return this.useCase.invoke(data);
    }
}
