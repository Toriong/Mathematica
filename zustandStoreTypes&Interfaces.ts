export interface IChoice {
    value: string
    letter: string
}

export interface IQuestion {
    _id: string
    sentence: string,
    answer: string[]
    task?: string
    choices?: IChoice[]
}

export interface IQuestionsForObj {
    task: string,
    questions: IQuestion[],
    setQuestions: (questions: IQuestion[]) => void;
}