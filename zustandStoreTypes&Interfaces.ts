import { TResponseStatus } from "./api_services/globalApiVars"
import { IThemeColors, TLogicalSymbols, TLowerCaseLetters, TUpperCaseLetters } from "./globalTypes&Interfaces"
import { LETTERS } from "./globalVars"

export interface IIsGettingReqStoreState {
    isGettingQs: boolean
    isGettingUserInfo: boolean
}

interface IGameScrnTabStoreState {
    right: number
    wrong: number
    timer: number
    isTimerPaused: boolean
    isGameOn: boolean
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
    choices: IChoice[]
    symbolOptions: (TUpperCaseLetters | TLogicalSymbols)[] 
}
export interface IQuestionObjActions {
    setQuestions: (questions: IQuestion[]) => void
    setTask: (task: string) => void
}
export interface IQuestionsStates {
    task: string
    questions: IQuestion[]
}

export type TUpdateStoreState<TNewState, TFieldName> = {
    updateState: (newState: TNewState, fieldName: TFieldName) => void
}

interface IErrorStore {
    didAnErrorOccurInGettingQs: boolean,
    didAnErrorOccurInUserAuth: boolean,
}

export type TCurrentTheme = "dark" | "light";

export interface IColorStore {
    themesObj: IThemeColors
    currentTheme: TCurrentTheme
    setCurrentTheme: (theme: TCurrentTheme) => () => void
}
export interface IApiQsFetchingStatus {
    willGetQs: boolean
    gettingQsResponseStatus: TResponseStatus
}

export type TApiQsFetchingStatusStore = IApiQsFetchingStatus & TUpdateStoreState<IApiQsFetchingStatus[keyof IApiQsFetchingStatus], keyof IApiQsFetchingStatus>
export type TErrorStore = IErrorStore & TUpdateStoreState<boolean, keyof IErrorStore>
export type TGameScrnTabStore = IGameScrnTabStoreState & TUpdateStoreState<number | boolean, keyof IGameScrnTabStoreState>
export type TIsGettingReqStore = IIsGettingReqStoreState & TUpdateStoreState<boolean, keyof IIsGettingReqStoreState>
export type IQuestionsForObj = IQuestionsStates & TUpdateStoreState<IQuestionsStates[keyof IQuestionsStates], keyof IQuestionsStates>