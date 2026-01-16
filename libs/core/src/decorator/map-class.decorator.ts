import { Abstract, Type } from '@nestjs/common';
import { MAPPER_METADATA_CLASS, MAPPER_METADATA_CLASS_OPTIONS } from '../service/mapper';

export function MapClass<T = Record<string, any>, U = any>(
    className: Type<T> | Abstract<T>,
    options?: {
        includeInheritance: boolean;
    },
) {
    return function (target: U) {
        Reflect.defineMetadata(MAPPER_METADATA_CLASS, className, target);
        Reflect.defineMetadata(MAPPER_METADATA_CLASS_OPTIONS, options ?? { includeInheritance: false }, target);
    };
}