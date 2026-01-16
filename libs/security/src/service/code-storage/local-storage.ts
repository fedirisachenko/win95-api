import { CodeStorageInterface } from '../../contract/code-storage.interface';

interface StorageItem {
    value: string;
    expiresAt?: number;
}

export class LocalStorage implements CodeStorageInterface {
    protected data: Map<string, StorageItem> = new Map();

    async set(key: string, value: string, expirationTimeMs?: number): Promise<boolean> {
        const item: StorageItem = {
            value,
            expiresAt: expirationTimeMs ? Date.now() + expirationTimeMs : undefined,
        };
        this.data.set(key, item);
        return true;
    }

    async get(key: string, parse = false): Promise<any | null> {
        const item = this.data.get(key);

        if (!item) {
            return null;
        }

        if (item.expiresAt && Date.now() > item.expiresAt) {
            this.data.delete(key);
            return null;
        }

        return parse ? JSON.parse(item.value) : item.value;
    }

    async del(key: string): Promise<boolean> {
        return this.data.delete(key);
    }

    async exists(key: string): Promise<boolean> {
        const item = this.data.get(key);

        if (!item) {
            return false;
        }

        if (item.expiresAt && Date.now() > item.expiresAt) {
            this.data.delete(key);
            return false;
        }

        return true;
    }
}
