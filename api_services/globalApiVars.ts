
// run the server using serveo and get the url
export const SERVER_ORIGIN = "https://5ee527ec3d3f276c9038e7e8309f5ff5.serveo.net";
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

