
// run the server using serveo and get the url
export const SERVER_ORIGIN = "https://7e6b0f092428a1dd7111d1f7d0bae0d4.serveo.net";
export const PATHS = [
    "get-quiz-questions",
    "save-quiz-result",
    "get-user"
] as const;
export type TResponseStatus = "SUCCESS" | "FAILURE" | "IN_PROGRESS" | "NOT_EXECUTING"
// how to make it mandatory to have all strings in the specific array
export type TPathsStr = typeof PATHS[number]
export interface IReturnObjOfAsyncFn<TData> {
    didErrorOccur?: boolean
    data: TData | null
    msg?: string
}
export function getPath(path: TPathsStr): TPathsStr{
    return PATHS.find(_path => _path === path) as TPathsStr;
}

