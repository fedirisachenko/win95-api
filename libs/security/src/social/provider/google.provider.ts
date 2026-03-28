import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { SocialProvider } from '@libs/orm';
import { SocialProviderInterface, SocialUserData } from '../contract/social-provider.interface';

interface GoogleProfileInfo {
    id: string;
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

@Injectable()
export class GoogleProvider implements SocialProviderInterface {
    constructor(private readonly httpService: HttpService) {}

    getProvider(): number {
        return SocialProvider.GOOGLE;
    }

    async verify(token: string): Promise<SocialUserData | null> {
        try {
            const profile = await firstValueFrom(
                this.httpService
                    .get<GoogleProfileInfo>(
                        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
                    )
                    .pipe(map((response) => response.data)),
            );

            return {
                id: profile.id,
                email: profile.email,
                name: profile.name,
            };
        } catch {
            return null;
        }
    }
}
