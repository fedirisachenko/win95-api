import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignUpInput } from '../dto/input';
import { AuthOutput } from '../dto/output';
import { SignUpActionService } from '../action-service/sign-up-action-service';

@ApiTags('Auth')
@Controller('sign-up')
export class SignUpAction {
    constructor(private readonly actionService: SignUpActionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully', type: AuthOutput })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async invoke(@Body() data: SignUpInput): Promise<AuthOutput> {
        return this.actionService.invoke(data);
    }
}
