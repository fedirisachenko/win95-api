import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEntity, UserSocialEntity } from '@libs/orm';
import { TokenService, TokenPair, SocialProviderInterface, SOCIAL_PROVIDERS } from '@libs/security';
import { SocialAuthInput } from '../dto/input/social-auth.input';

@Injectable()
export class SocialAuthUseCase {
    private readonly providersMap = new Map<number, SocialProviderInterface>();

    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
        @Inject(SOCIAL_PROVIDERS) providers: SocialProviderInterface[],
    ) {
        for (const provider of providers) {
            this.providersMap.set(provider.getProvider(), provider);
        }
    }

    async invoke(data: SocialAuthInput): Promise<TokenPair> {
        const provider = this.providersMap.get(data.provider);
        if (!provider) throw new UnauthorizedException('Unsupported provider');

        const socialData = await provider.verify(data.token);
        if (!socialData) throw new UnauthorizedException('Invalid social token');

        let user = await this.em.findOne(UserEntity, { email: socialData.email });

        if (!user) {
            const randomPassword = crypto.randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = this.em.create(UserEntity, {
                email: socialData.email,
                password: hashedPassword,
                name: socialData.name,
                emailVerified: true,
            });
        }

        const existingSocial = await this.em.findOne(UserSocialEntity, {
            user,
            provider: data.provider,
        });

        if (!existingSocial) {
            this.em.create(UserSocialEntity, {
                user,
                provider: data.provider,
                socialUserId: socialData.id,
            });
        }

        await this.em.flush();

        return this.tokenService.generateTokenPair(user.id);
    }
}
