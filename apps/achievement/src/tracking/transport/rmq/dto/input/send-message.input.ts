import { IsUUID } from 'class-validator';

export class SendMessageInput {
    @IsUUID()
    userId: string;
}
