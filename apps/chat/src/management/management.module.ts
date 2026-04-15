import { Module } from '@nestjs/common';
import { CreateChatAction } from './transport/rmq/action/create-chat.action';
import { CreateChatUseCase } from './transport/rmq/use-case/create-chat.use-case';

@Module({
    controllers: [CreateChatAction],
    providers: [CreateChatUseCase],
})
export class ManagementModule {}
