import { IsUUID } from 'class-validator';

export class ChatFinalizeInput {
    @IsUUID()
    chatId: string;
}
