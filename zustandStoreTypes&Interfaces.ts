export interface IIsGettingReqStoreState {
    isGettingQs: boolean
    isGettingUserInfo: boolean
}
interface IErrorStore{
    didAnErrorOccurInGettingQs: boolean,
    didAnErrorOccurInUserAuth: boolean,
}
interface IGameScrnTabStoreState {
    right: number
    wrong: number
    wasSubmitBtnPressed: boolean
}
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

export type TUpdateStoreState<TNewState, TFieldName> = {
    updateState: (newState: TNewState, fieldName: TFieldName) => void
}
type TGameScrnTabStoreActions = {
    setWasSubmitBtnPressed: (newState: boolean) => void
    setRight: (newState: number) => void
    setWrong: (newState: number) => void
}
export type TErrorStore = IErrorStore & TUpdateStoreState<boolean, keyof IErrorStore>
export type TGameScrnTabStore = IGameScrnTabStoreState & TUpdateStoreState<number | boolean, keyof IGameScrnTabStoreState> 
export type TIsGettingReqStore = IIsGettingReqStoreState & TUpdateStoreState<boolean, keyof IIsGettingReqStoreState>
export type IQuestionsForObj = IQuestionObjActions & IQuestionsStates