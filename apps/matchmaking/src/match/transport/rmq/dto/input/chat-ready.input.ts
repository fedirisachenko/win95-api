import { IsArray, IsUUID } from 'class-validator';

export class ChatReadyInput {
    @IsUUID()
    chatId: string;

    @IsArray()
    @IsUUID('4', { each: true })
    userIds: string[];
}
