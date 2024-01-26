
// run the server using serveo and get the url
export const SERVER_ORIGIN = "https://5c1f6e33831e8e98e0ba163a38301e6d.serveo.net";
export const PATHS = [
    "get-quiz-questions",
    "save-quiz-result",
    "get-user",
    "update-quizzes-taken-num",
    "get-did-user-reach-quiz-generation-limit"
] as const;
export type TResponseStatus = "SUCCESS" | "FAILURE" | "IN_PROGRESS" | "NOT_EXECUTING"
// how to make it mandatory to have all strings in the specific array
export type TPathsStr = typeof PATHS[number]
export interface IReturnObjOfAsyncFn<TData> {
    didErrorOccur?: boolean
    data: TData | null
    msg?: string
}
export function getPath(path: TPathsStr){
    return PATHS.find(_path => _path === path) as TPathsStr;
}

