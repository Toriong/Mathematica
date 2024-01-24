import { IS_TESTING, TESTING_USER_ID } from "../globalVars";
import { Storage } from "./storage";

const getType = (val: any) => typeof val;

export type TDataTypes = ReturnType<typeof getType>;

export function getIsTValid<TData>(
    val: TData,
    expectedType: TDataTypes,
    isNotNullForObj = true
): val is TData {
    return (typeof val === expectedType) && isNotNullForObj
}

export function getRandomIndex<TData>(arr: TData[], incorrectVal: any = undefined) {
    let randomIndex = Math.floor(Math.random() * arr.length);

    while (!(arr[randomIndex] === incorrectVal)) {
        randomIndex = Math.floor(Math.random() * arr.length)
    };

    return randomIndex;
}

export function sortRandomly<TData>(arr: TData[]) {
    let arrSortedRandomly:TData[] = Array.from({ length: arr.length });

    arr.forEach(val => {
        const randomIndex = getRandomIndex(arrSortedRandomly);
        arrSortedRandomly[randomIndex] = val
    })

    return arrSortedRandomly;
};

const memory = new Storage()

export async function getUserId(): Promise<string | null> {
    return IS_TESTING ? TESTING_USER_ID : await memory.getItem("userId");
}