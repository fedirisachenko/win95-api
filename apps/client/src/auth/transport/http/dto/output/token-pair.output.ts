import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { MapClass, MapField, JsonOutput } from '@libs/core';

@Exclude()
@MapClass(JsonOutput)
export class TokenPairOutput {
    @Expose()
    @ApiProperty()
    @MapField()
    accessToken: string;

    @Expose()
    @ApiProperty()
    @MapField()
    refreshToken: string;
}
