import { ExecutionContext } from '@nestjs/common';

export interface Transport {
    getTransportToken(): string;
    extractToken(context: ExecutionContext): string | null;
    setUser(context: ExecutionContext, user: any): void;
}
