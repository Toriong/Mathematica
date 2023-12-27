import uuid from "react-native-uuid"

export interface IChoice {
    letter: String
    value: String
}
export interface IQuestion {
    _id?: ReturnType<typeof uuid.v4>
    sentence: string
    answer: string[]
    choices: IChoice[]
    type: string | null
    userAnswer: string[] | null
}
export interface IQuiz {
    userId: string
    finishedQuizAtMs: number
    questions: IQuestion[]
}