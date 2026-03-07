import { PipeTransform } from '@nestjs/common';

export abstract class AbstractTransformPipe<TInput = any, TOutput = any> implements PipeTransform {
    async transform(value: TInput): Promise<TOutput> {
        return this.apply(value);
    }

    protected abstract apply(value: TInput): Promise<TOutput>;
}
