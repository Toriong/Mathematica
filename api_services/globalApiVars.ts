
// run the server using serveo and get the url
export const SERVER_ORIGIN = "https://faf19a1ffb6e4b187beb8d394c896774.serveo.net"
export const PATHS = [
    "/get-quiz-questions"
] as TPaths;

export type TResponseStatus = "SUCCESS" | "FAILURE" | "IN_PROGRESS" | "NOT_EXECUTING"
export type TPaths = ["/get-quiz-questions"]
export type TPathsStr = typeof PATHS[number]