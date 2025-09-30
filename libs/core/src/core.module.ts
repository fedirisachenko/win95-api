import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import coreConfig from '@config/config.config';

@Module({})
export class CoreModule {
    static register(): DynamicModule {
        return {
            module: CoreModule,
            imports: [ConfigModule.forRoot(coreConfig)],
            exports: [ConfigModule],
        };
    }
}
