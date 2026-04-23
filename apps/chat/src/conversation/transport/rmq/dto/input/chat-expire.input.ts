import { IsString, IsUUID } from 'class-validator';

export class ChatExpireInput {
    @IsUUID()
    chatId: string;

    @IsString()
    reason: string;
}
