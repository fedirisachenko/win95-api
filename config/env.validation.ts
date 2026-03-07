import { IsString, IsNumber, IsOptional, validateSync } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';

export class EnvironmentVariables {
    @IsString()
    DATABASE_URL_DEFAULT: string;

    @IsString()
    @IsOptional()
    DB_SSL?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    DB_POOL_MIN: number = 2;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    DB_POOL_MAX: number = 10;

    @IsString()
    @IsOptional()
    REDIS_URL: string = 'redis://localhost:6379';

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    CLIENT_APP_PORT: number = 3031;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    DATABASE_APP_PORT: number = 3030;

    @IsString()
    JWT_ACCESS_SECRET: string;

    @IsString()
    JWT_REFRESH_SECRET: string;

    @IsString()
    @IsOptional()
    JWT_ACCESS_EXPIRE: string = '15m';

    @IsString()
    @IsOptional()
    JWT_REFRESH_EXPIRE: string = '7d';
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
    const validated = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validated, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        const messages = errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('\n');
        throw new Error(`Environment validation failed:\n${messages}`);
    }

    return validated;
}
