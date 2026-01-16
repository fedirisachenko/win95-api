export interface CodeStorageInterface {
    set(key: string, value: string, expirationTimeMs?: number): Promise<boolean>;

    get(key: string, parse?: boolean): Promise<any | null>;

    del(key: string): Promise<boolean>;

    exists(key: string): Promise<boolean>;
}

export const CODE_STORAGE = 'CodeStorage';
