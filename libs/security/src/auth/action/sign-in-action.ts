import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInInput } from '../dto/input';
import { AuthOutput } from '../dto/output';
import { SignInActionService } from '../action-service/sign-in-action-service';

@ApiTags('Auth')
@Controller('sign-in')
export class SignInAction {
    constructor(private readonly actionService: SignInActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in with email and password' })
    @ApiResponse({ status: 200, description: 'Signed in successfully', type: AuthOutput })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async invoke(@Body() data: SignInInput): Promise<AuthOutput> {
        return this.actionService.invoke(data);
    }
}
