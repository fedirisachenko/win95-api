import { IsString, IsUUID } from 'class-validator';

export class MessageSentInput {
    @IsUUID()
    userId: string;

    @IsString()
    message: string;
}
