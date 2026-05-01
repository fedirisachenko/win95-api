import { IsUUID } from 'class-validator';

export class SetupAchievementInput {
    @IsUUID()
    userId: string;
}
