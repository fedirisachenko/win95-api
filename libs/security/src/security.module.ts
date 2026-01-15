import { DynamicModule, Module, OnModuleInit, Provider, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Transport } from './strategy/interface/transport.interface';
import { AuthStrategy } from './strategy/interface/auth-strategy.interface';
import { SecurityRegistry } from './security.registry';
import { SecurityGuard } from './guards/security.guard';

export type SecurityModuleOptions = {
    transports: Type<Transport>[];
    strategies: Type<AuthStrategy>[];
};

@Module({})
export class SecurityModule implements OnModuleInit {
    private static options: SecurityModuleOptions;

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly registry: SecurityRegistry,
    ) {}

    static forRoot(options: SecurityModuleOptions): DynamicModule {
        SecurityModule.options = options;

        const transportProviders: Provider[] = options.transports.map((TransportClass) => ({
            provide: TransportClass,
            useClass: TransportClass,
        }));

        const strategyProviders: Provider[] = options.strategies.map((StrategyClass) => ({
            provide: StrategyClass,
            useClass: StrategyClass,
        }));

        return {
            module: SecurityModule,
            global: true,
            providers: [SecurityRegistry, SecurityGuard, ...transportProviders, ...strategyProviders],
            exports: [SecurityRegistry, SecurityGuard, ...options.transports, ...options.strategies],
        };
    }

    async onModuleInit(): Promise<void> {
        const options = SecurityModule.options;
        if (!options) return;

        for (const TransportClass of options.transports) {
            const transport = this.moduleRef.get(TransportClass, { strict: false });
            this.registry.registerTransport(transport);
        }

        for (const StrategyClass of options.strategies) {
            const strategy = this.moduleRef.get(StrategyClass, { strict: false });
            this.registry.registerStrategy(strategy);
        }
    }
}
