import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket, WsActionGuard } from '@libs/ws';
import { ChatStateService } from '../service/chat-state.service';

@Injectable()
export class ChatActiveGuard implements WsActionGuard {
    constructor(private readonly chatStateService: ChatStateService) {}

    async canActivate(_client: AuthenticatedSocket, payload: unknown): Promise<void> {
        const chatId = (payload as { chatId?: string })?.chatId;

        if (!chatId) {
            throw new WsException('chatId is required');
        }

        await this.chatStateService.ensureActive(chatId);
    }
}
