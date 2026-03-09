import { Injectable } from '@nestjs/common';
import { VoterInterface } from '../voter/voter.interface';

export type VotingStrategy = 'affirmative' | 'consensus' | 'unanimous';

@Injectable()
export class SecurityManager {
    constructor(private readonly voters: VoterInterface[]) {}

    async isGranted<Subject = any>(
        action: string | string[],
        userId: string,
        subject?: Subject,
        strategy: VotingStrategy = 'affirmative',
    ): Promise<boolean> {
        switch (strategy) {
            case 'affirmative':
                return this.affirmative(action, userId, subject);
            case 'consensus':
                return this.consensus(action, userId, subject);
            case 'unanimous':
                return this.unanimous(action, userId, subject);
        }
    }

    private async affirmative<S>(action: string | string[], userId: string, subject?: S): Promise<boolean> {
        for (const voter of this.voters) {
            if (!(await voter.supports(action))) continue;
            if (await voter.vote(userId, action, subject)) return true;
        }

        return false;
    }

    private async consensus<S>(action: string | string[], userId: string, subject?: S): Promise<boolean> {
        let grant = 0;
        let deny = 0;

        for (const voter of this.voters) {
            if (!(await voter.supports(action))) continue;
            if (await voter.vote(userId, action, subject)) {
                grant++;
            } else {
                deny++;
            }
        }

        return grant > deny;
    }

    private async unanimous<S>(action: string | string[], userId: string, subject?: S): Promise<boolean> {
        let voted = false;

        for (const voter of this.voters) {
            if (!(await voter.supports(action))) continue;
            voted = true;
            if (!(await voter.vote(userId, action, subject))) return false;
        }

        return voted;
    }
}
