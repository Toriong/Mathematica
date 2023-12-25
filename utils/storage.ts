import AsyncStorage from '@react-native-async-storage/async-storage';

export type TStorageKeys = "userId"

export class Storage {
    storage = AsyncStorage;

    getItem<TData>(key: string): Promise<TData | null | string>{
        return this.storage.getItem(key);
    };

    setItem(key: string, value: string){
        this.storage.setItem(key, value);
    }

    deleteItem(key: string){
        this.storage.removeItem(key);
    }
}