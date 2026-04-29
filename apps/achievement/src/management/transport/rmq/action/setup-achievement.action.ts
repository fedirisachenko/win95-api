import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SetupAchievementInput } from '../dto/input/setup-achievement.input';
import { SetupAchievementUseCase } from '../use-case/setup-achievement.use-case';

@Controller()
export class SetupAchievementAction {
    constructor(private readonly useCase: SetupAchievementUseCase) {}

    @EventPattern('achievement:management:setup:achievement')
    public async invoke(@Payload() data: SetupAchievementInput): Promise<void> {
        await this.useCase.invoke(data);
    }
}
