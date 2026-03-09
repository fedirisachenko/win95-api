import { Injectable } from '@nestjs/common';
import { VoterInterface } from './voter.interface';
import { PermissionAccessManager } from '../service/permission-access-manager';
import { PermissionsList } from '../constant/permission.constant';

@Injectable()
export class PermissionVoter implements VoterInterface {
    constructor(private readonly permissionAccessManager: PermissionAccessManager) {}

    async supports(action: string | string[]): Promise<boolean> {
        const actions = Array.isArray(action) ? action : [action];

        return actions.every((a) => PermissionsList.includes(a));
    }

    async vote(userId: string, action: string | string[]): Promise<boolean> {
        return this.permissionAccessManager.isGranted(userId, action);
    }
}
