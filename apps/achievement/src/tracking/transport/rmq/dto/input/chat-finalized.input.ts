import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class ChatFinalizedInput {
    @IsUUID()
    userId: string;

    @IsInt()
    @IsPositive()
    durationMs: number;
}
