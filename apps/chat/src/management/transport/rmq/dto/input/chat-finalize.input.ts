import { IsIn, IsUUID } from 'class-validator';
import { ChatStatus } from '@libs/orm';

export class ChatFinalizeInput {
    @IsUUID()
    chatId: string;

    @IsIn([ChatStatus.EXPIRED, ChatStatus.CANCELLED])
    status: number;
}
