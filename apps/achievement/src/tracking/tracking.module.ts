import { Module } from '@nestjs/common';
import { SendMessageAction } from './transport/rmq/action/send-message.action';
import { SendMessageUseCase } from './transport/rmq/use-case/send-message.use-case';

@Module({
    controllers: [SendMessageAction],
    providers: [SendMessageUseCase],
})
export class TrackingModule {}
