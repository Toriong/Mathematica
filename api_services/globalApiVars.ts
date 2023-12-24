import { IQuestion } from "../zustandStoreTypes&Interfaces";

// run the server using serveo and get the url
export const SERVER_ORIGIN = "https://831b66997769aae20a6a179fe71f4ac7.serveo.net"
export const PATHS = [
    "get-quiz-questions"
] as TPaths;

export type TResponseStatus = "SUCCESS" | "FAILURE" | "IN_PROGRESS" | "NOT_EXECUTING"
// how to make it mandatory to have all strings in the specific array
export type TPaths = ["get-quiz-questions" | "get-user"]
export type TPathsStr = typeof PATHS[number]
export interface IReturnObjOfAsyncFn<TData> {
    didErrorOccur?: boolean,
    data: TData | null, 
    msg ?: string 
}

export function getApiPath(index: number): TPathsStr {
    return PATHS[index];
}