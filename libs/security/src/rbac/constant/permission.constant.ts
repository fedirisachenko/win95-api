export const Permissions = {
    CHAT: {
        JOIN: 'CHAT_JOIN',
        CREATE: 'CHAT_CREATE',
        VIEW: 'CHAT_VIEW',
        DELETE: 'CHAT_DELETE',
    },
    USER: {
        VIEW: 'USER_VIEW',
        BAN: 'USER_BAN',
    },
    MATCHMAKING: {
        SEARCH: 'MATCHMAKING_SEARCH',
    },
    ACHIEVEMENT: {
        CREATE: 'ACHIEVEMENT_CREATE',
        UPDATE: 'ACHIEVEMENT_UPDATE',
    },
};

function flattenPermissions(obj: Record<string, any>): string[] {
    return Object.values(obj).flatMap((value) => (typeof value === 'string' ? [value] : flattenPermissions(value)));
}

export const PermissionsList: string[] = flattenPermissions(Permissions);
