export interface VoterInterface<Subject = any> {
    supports(action: string | string[]): Promise<boolean>;
    vote(userId: string, action: string | string[], subject?: Subject): Promise<boolean>;
}
