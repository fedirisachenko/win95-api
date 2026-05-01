export interface SocialUserData {
    id: string;
    email: string;
    name?: string;
}

export interface SocialProviderInterface {
    getProvider(): number;
    verify(token: string): Promise<SocialUserData | null>;
}
