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

const memory = new Storage()

export async function getUserId(): Promise<string | null> {
    return IS_TESTING ? TESTING_USER_ID : await memory.getItem("userId");
}