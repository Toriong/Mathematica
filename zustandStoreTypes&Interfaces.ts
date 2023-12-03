export interface IIsGettingReqStoreState {
    isGettingQs: boolean
    isGettingUserInfo: boolean
}

export interface IIsGettingReqStoreActions {
    updateState: (newState: boolean, fieldName: keyof IIsGettingReqStoreState) => void 
}

export type TIsGettingReqStore = IIsGettingReqStoreState & IIsGettingReqStoreActions;

export interface IChoice {
    value: string
    letter: string
}

export interface IQuestion {
    _id: string
    sentence: string
    answer: string[]
    task?: string
    choices?: IChoice[]
}

export interface IQuestionObjActions {
    setQuestions: (questions: IQuestion[]) => void
    setTask: (task: string) => void
}

export interface IQuestionsStates {
    task: string,
    questions: IQuestion[],
}

export type IQuestionsForObj = IQuestionObjActions & IQuestionsStates