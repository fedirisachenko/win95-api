import { UserRole } from '@libs/orm';
import { Permissions, PermissionsList } from './permission.constant';

export const DefaultPermissionsByRole: Record<number, string[]> = {
    [UserRole.USER]: [
        Permissions.CHAT.JOIN,
        Permissions.CHAT.CREATE,
        Permissions.CHAT.VIEW,
        Permissions.MATCHMAKING.SEARCH,
    ],
    [UserRole.ADMIN]: [...PermissionsList],
};
