
// run the server using serveo and get the url
export const SERVER_ORIGIN = "https://4b0f6e20dbb3e6fd26109a83a3ae59ef.serveo.net";
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
    msg?: string
}

