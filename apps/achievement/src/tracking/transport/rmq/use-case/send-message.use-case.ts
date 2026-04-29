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

        achievement.metadata.goals.forEach((goal) => {
            if (achievement.progress >= goal) {
                achievement.completed += 1;
            }
        });

        await this.orm.em.persistAndFlush(achievement);
    }
}
