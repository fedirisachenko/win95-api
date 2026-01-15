import { ExecutionContext, Injectable } from '@nestjs/common';
import { Transport } from '../interface/transport.interface';
import { AuthStrategy } from '../interface/auth-strategy.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy implements AuthStrategy {
    public readonly strategy = 'jwt';

    getStrategyToken(): string {
        return this.strategy;
    }

    constructor(private readonly jwtService: JwtService) {}

    async validate(context: ExecutionContext, transport: Transport): Promise<any | null> {
        const token = transport.extractToken(context);
        if (!token) return null;

        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });

            transport.setUser(context, payload);

            return payload;
        } catch {
            return null;
        }
    }
}
