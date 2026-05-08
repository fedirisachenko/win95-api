import { Module } from '@nestjs/common';

import { SetupAchievementActionService } from './action-service/setup-achievement.action-service';
import { SetupAchievementAction } from './transport/rmq/action/setup-achievement.action';

@Module({
    controllers: [SetupAchievementAction],
    providers: [SetupAchievementActionService],
})
export class ManagementModule {}
