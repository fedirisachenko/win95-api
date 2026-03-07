import { MapFieldNameOrCallback, MapFieldMetadata } from '../service/mapper';
import { MAPPER_METADATA_FIELD } from '../constant/mapper.constant';

export function MapField<T = any, U = any>(fieldNameOrCallback?: MapFieldNameOrCallback<T>) {
    return function (target: U, propertyKey: string) {
        const prevMetadata = Reflect.getMetadata(MAPPER_METADATA_FIELD, target) as MapFieldMetadata<U, T>;

        Reflect.defineMetadata(
            MAPPER_METADATA_FIELD,
            { ...prevMetadata, [propertyKey]: fieldNameOrCallback || propertyKey },
            target,
        );
    };
}
