import { Injectable } from '@nestjs/common';
import { SendMessageInput } from '../dto/input/send-message.input';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { AchievementEntity, AchievementType } from '@libs/orm';

@Injectable()
export class SendMessageUseCase {
    constructor(private readonly orm: MikroORM) {}

    @CreateRequestContext()
    public async invoke(data: SendMessageInput): Promise<void> {
        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: {
                id: data.userId,
            },
            type: AchievementType.SEND_MESSAGES,
        });

        achievement.progress += 1;

        if (achievement.completed + 1 == achievement.metadata.goals.length) {
            await this.orm.em.persistAndFlush(achievement);
            return;
        }

        const currentGoal = achievement.metadata.goals[achievement.completed + 1];
        if (achievement.progress >= currentGoal) {
            achievement.completed += 1;
        }
        await this.orm.em.persistAndFlush(achievement);
        return;
    }
}
