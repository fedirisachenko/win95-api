import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';
import { ClientRMQ, ReadPacket, WritePacket } from '@nestjs/microservices';
import { RmqOptions } from '@nestjs/microservices/interfaces';

@Injectable()
export class ClientExchangeRmq extends ClientRMQ implements BeforeApplicationShutdown {
    protected readonly exchange: string;
    protected readonly exchangeType: string;

    constructor(options: any) {
        super(options as RmqOptions['options']);

        this.exchange = this.getOptionsProp(options, 'exchange', 'win95');
        this.exchangeType = this.getOptionsProp(options, 'exchangeType', 'direct');
    }

    public async setupChannel(channel: any, resolve: () => void) {
        await channel.assertExchange(this.exchange, this.exchangeType, {});
        resolve();
    }

    protected publish(_message: ReadPacket, _callback: (packet: WritePacket) => any): () => void {
        throw new Error('Exchange does not support request-response pattern. Use emit() instead.');
    }

    protected dispatchEvent(packet: ReadPacket): Promise<any> {
        const serializedPacket = this.serializer.serialize(packet);

        return new Promise<void>((resolve) => {
            const routingKey = this.exchangeType === 'direct' || this.exchangeType === 'topic' ? packet.pattern : '';

            this.channel.publish(this.exchange, routingKey, Buffer.from(JSON.stringify(serializedPacket)));
            resolve();
        });
    }

    public beforeApplicationShutdown() {
        this.close();
    }
}
