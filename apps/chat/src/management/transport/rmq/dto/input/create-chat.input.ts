import { IsArray, IsNumber, IsUUID } from 'class-validator';

export class CreateChatInput {
    @IsUUID()
    searchMatchId: string;

    @IsArray()
    @IsUUID('4', { each: true })
    userIds: string[];

    @IsNumber()
    duration: number;
}
