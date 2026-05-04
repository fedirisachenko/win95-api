import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SearchStartedInput } from '../dto/input/search-started.input';
import { TrackDailySearchStreakUseCase } from '../use-case/track-daily-search-streak.use-case';

@Controller()
export class SearchStartedAction {
    constructor(private readonly trackDailySearchStreak: TrackDailySearchStreakUseCase) {}

    @EventPattern('matchmaking:search-started')
    async invoke(@Payload() data: SearchStartedInput): Promise<void> {
        await this.trackDailySearchStreak.invoke(data);
    }
}
