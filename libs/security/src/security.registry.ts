import { Injectable } from '@nestjs/common';
import { Transport } from './strategy/interface/transport.interface';
import { AuthStrategy } from './strategy/interface/auth-strategy.interface';

@Injectable()
export class SecurityRegistry {
    private transports = new Map<string, Transport>();
    private strategies = new Map<string, AuthStrategy>();

    registerTransport(transport: Transport): void {
        const token = transport.getTransportToken();
        this.transports.set(token, transport);
    }

    registerStrategy(strategy: AuthStrategy): void {
        const token = strategy.getStrategyToken();
        this.strategies.set(token, strategy);
    }

    getTransport(name: string): Transport {
        const transport = this.transports.get(name);
        if (!transport) {
            throw new Error(`Transport "${name}" not registered. Available: ${[...this.transports.keys()].join(', ')}`);
        }
        return transport;
    }

    getStrategy(name: string): AuthStrategy {
        const strategy = this.strategies.get(name);
        if (!strategy) {
            throw new Error(`Strategy "${name}" not registered. Available: ${[...this.strategies.keys()].join(', ')}`);
        }
        return strategy;
    }

    hasTransport(name: string): boolean {
        return this.transports.has(name);
    }

    hasStrategy(name: string): boolean {
        return this.strategies.has(name);
    }
}
