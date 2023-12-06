export interface IIsGettingReqStoreState {
    isGettingQs: boolean
    isGettingUserInfo: boolean
}

export type TUpdateStoreState<TNewState, TFieldName> = {
    updateState: (newState: TNewState, fieldName: TFieldName) => void
}

interface IGameScrnTabStoreState {
    right: number
    wrong: number
}

export type TGameScrnTabStore = IGameScrnTabStoreState & TUpdateStoreState<number, keyof IGameScrnTabStoreState> 

export type TIsGettingReqStore = IIsGettingReqStoreState & TUpdateStoreState<boolean, keyof IIsGettingReqStoreState>;

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