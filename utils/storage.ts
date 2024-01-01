import AsyncStorage from '@react-native-async-storage/async-storage';

export type TStorageKeys = "userId"

interface IStorage{
    userId: string
    isGameOn: boolean
}

export class Storage {
    storage = AsyncStorage;

    getItem<TData>(key: keyof IStorage): Promise<TData | null | string>{
        return this.storage.getItem(key);
    };

    setItem(key: string, value: string){
        this.storage.setItem(key, value);
    }

    deleteItem(key: string){
        this.storage.removeItem(key);
    }
}

export type TStorageInstance = InstanceType<typeof Storage>;
 