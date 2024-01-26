import AsyncStorage from '@react-native-async-storage/async-storage';

// GOAL: the user can only generate 5 quizzes per day for free
// the user can generate up to 20 quizzes per day for paid tiers.

// export type TStorageKeys = "userId" | "quizzesTaken"
export type TStorageInstance = InstanceType<typeof Storage>;
export interface IStorage {
    userId: string
    isGameOn: boolean
    quizzesTaken: number
}
export type TStorageKeys = keyof IStorage

export class Storage {
    storage = AsyncStorage;

    async getItem<TData>(key: keyof IStorage): Promise<TData | null | string> {
        try {
            return await this.storage.getItem(key);
        } catch(error){
            console.error("Failed to get itme from storage. Error message: ", error);

            return null;
        }
    };

    async setItem(key: keyof IStorage, value: IStorage[keyof IStorage]) {
        try {
            await this.storage.setItem(key, JSON.stringify(value));
        } catch(error){
            console.error("Failed to set the storage. Error message: ", error);
        }
    }

    async deleteItem(key: keyof IStorage) {
        try {
            await this.storage.removeItem(key);
        } catch(error){
            console.error("Failed to delete the item from storage. Error message: ", error)
        }
    }
}
