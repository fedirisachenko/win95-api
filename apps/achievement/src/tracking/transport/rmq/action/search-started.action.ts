import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { TrackDailySearchStreakActionService } from '../../../action-service/track-daily-search-streak.action-service';
import { SearchStartedInput } from '../dto/input/search-started.input';

@Controller()
export class SearchStartedAction {
    constructor(private readonly trackDailySearchStreak: TrackDailySearchStreakActionService) {}

    @EventPattern('matchmaking:search-started')
    async invoke(@Payload() data: SearchStartedInput): Promise<void> {
        await this.trackDailySearchStreak.invoke(data);
    }
}
