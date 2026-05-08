import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { SetupAchievementActionService } from '../../../action-service/setup-achievement.action-service';
import { SetupAchievementInput } from '../dto/input/setup-achievement.input';

@Controller()
export class SetupAchievementAction {
    constructor(private readonly actionService: SetupAchievementActionService) {}

    @EventPattern('user:registered')
    public async invoke(@Payload() data: SetupAchievementInput): Promise<void> {
        await this.actionService.invoke(data);
    }
}
