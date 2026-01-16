import { Injectable, Type } from '@nestjs/common';
import { MapperException } from '../exception/mapper.exception';

export type MapFieldCallback<T> = (data: {
    e: T;
    mapper: Mapper;
    extraData: Record<string, any>;
}) => Promise<any> | any;

export type MapFieldNameOrCallback<T> =
    | keyof T
    | ((data: { e: T; mapper: Mapper; extraData: Record<string, any> }) => Promise<any> | any);

export type MapFieldMetadata<U, T> = Record<keyof U, MapFieldNameOrCallback<T> | string>;
export type MapClassMetadata<T> = Type<T>;

export const MAPPER_METADATA_FIELD = 'mapperMetadataField';
export const MAPPER_METADATA_CLASS = 'mapperMetadataClass';
export const MAPPER_METADATA_CLASS_OPTIONS = 'mapperMetadataClassOptions';

@Injectable()
export class Mapper {
    async map<R, I extends Record<string, any>>(
        resultClass: Type<R>,
        inputObject: I,
        extraData?: Record<string, any>,
    ): Promise<R>;
    async map<R, I extends Record<string, any>>(
        resultClass: Type<R>,
        inputObject: I[],
        extraData?: Record<string, any>,
    ): Promise<R[]>;
    async map<R, I extends Record<string, any>>(
        resultClass: Type<R>,
        inputObject: I | I[],
        extraData?: Record<string, any>,
    ): Promise<R | R[]> {
        return this.format(resultClass, inputObject, extraData);
    }

    public getFieldMetadata<T = any>(target: T) {
        return Reflect.getMetadata(MAPPER_METADATA_FIELD, target);
    }

    public getClassMetadata<T = any>(target: T) {
        return Reflect.getMetadata(MAPPER_METADATA_CLASS, target);
    }

    public getClassMetadataOptions<T = any>(target: T) {
        return Reflect.getMetadata(MAPPER_METADATA_CLASS_OPTIONS, target);
    }

    private validateClass(obj: any, type: Type, options?: { includeInheritance: boolean }) {
        if (options?.includeInheritance) {
            for (const proto of this.getAllPrototypes(type)) {
                if (obj instanceof proto) {
                    return true;
                }
            }
            throw new MapperException(
                `Invalid input object: instance of ${type.name} expected, ${obj.constructor.name} given`,
            );
        }

        if (!(obj instanceof type) && !(obj.constructor.name === 'model')) {
            throw new MapperException(
                `Invalid input object: instance of ${type.name} expected, ${obj.constructor.name} given`,
            );
        }
    }

    private getAllPrototypes(cls: any) {
        const prototypes = [];
        const firstClass = cls;
        let proto = Object.getPrototypeOf(cls.prototype);

        while (proto) {
            if (proto.constructor && proto.constructor !== Object) {
                prototypes.push(proto.constructor);
            }
            proto = Object.getPrototypeOf(proto);
        }

        return [firstClass, ...prototypes];
    }

    private async format<R, I extends Record<string, any>>(
        resultClass: Type<R>,
        inputObject: I,
        extraData?: Record<string, any>,
    ): Promise<R>;
    private async format<R, I extends Record<string, any>>(
        resultClass: Type<R>,
        inputObject: I[],
        extraData?: Record<string, any>,
    ): Promise<R[]>;
    private async format<R, I extends Record<string, any>>(
        resultClass: Type<R>,
        inputObject: I | I[],
        extraData?: Record<string, any>,
    ): Promise<R | R[]> {
        const classMetadata = this.getClassMetadata(resultClass) as MapClassMetadata<I>;
        const classMetadataOptions = this.getClassMetadataOptions(resultClass);

        const assign = async (obj: I) => {
            const result = Reflect.construct(resultClass, []) as R;
            const fieldMetadata = this.getFieldMetadata(result) as MapFieldMetadata<R, I>;

            for (const entry of Object.entries(fieldMetadata || {})) {
                const [resultClassKey, fieldOrCallback] = entry;
                (result as any)[resultClassKey] =
                    fieldOrCallback instanceof Function
                        ? await fieldOrCallback({ e: obj, mapper: this, extraData: extraData ?? {} })
                        : obj[fieldOrCallback as string];
            }

            return result;
        };

        if (inputObject instanceof Array) {
            inputObject.forEach((obj) => this.validateClass(obj, classMetadata, classMetadataOptions));
            return Promise.all(inputObject.map(assign));
        }

        this.validateClass(inputObject, classMetadata, classMetadataOptions);

        return assign(inputObject);
    }
}