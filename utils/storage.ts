import AsyncStorage from '@react-native-async-storage/async-storage';

export type TStorageKeys = "userId"
export type TStorageInstance = InstanceType<typeof Storage>;
export interface IStorage {
    userId: string
    isGameOn: boolean
}

export class Storage {
    storage = AsyncStorage;

    async getItem<TData>(key: keyof IStorage): Promise<TData | null | string> {
        return await this.storage.getItem(key);
    };

    async setItem(key: keyof IStorage, value: IStorage[keyof IStorage]) {
        await this.storage.setItem(key, JSON.stringify(value));
    }

    async deleteItem(key: keyof IStorage) {
        await this.storage.removeItem(key);
    }
}
