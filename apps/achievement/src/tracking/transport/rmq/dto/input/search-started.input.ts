import { IsUUID } from 'class-validator';

export class SearchStartedInput {
    @IsUUID()
    userId: string;
}
