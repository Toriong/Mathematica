import uuid from "react-native-uuid"

const QUESTION_TYPES = ['propositional', 'predicate', 'diagrams'] as const;
export type TQuestionTypes = typeof QUESTION_TYPES[number]
export interface IChoice {
    letter: String
    value: String
}
export interface IQuestion {
    _id?: ReturnType<typeof uuid.v4>
    sentence: string
    answer: string[]
    choices: IChoice[]
    type: TQuestionTypes
    userAnswer: string[] | null
}
export interface IQuiz {
    userId: string
    finishedQuizAtMs: number
    questions: IQuestion[]
}
export type IResponse<TData> = Partial<{
    msg: string
    data: TData
}>