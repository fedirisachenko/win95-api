import { Module } from '@nestjs/common';
import { SetupAchievementAction } from './transport/rmq/action/setup-achievement.action';
import { SetupAchievementUseCase } from './transport/rmq/use-case/setup-achievement.use-case';

@Module({
    controllers: [SetupAchievementAction],
    providers: [SetupAchievementUseCase],
})
export class ManagementModule {}
