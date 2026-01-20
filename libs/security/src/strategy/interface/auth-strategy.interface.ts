import { ExecutionContext } from '@nestjs/common';
import { Transport } from './transport.interface';

export interface AuthStrategy {
    getStrategyToken(): string;

    validate(context: ExecutionContext, transport: Transport): Promise<any | null>;
}
