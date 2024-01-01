import { TQuestionTypes } from "./Screens/GameScrn/typesAndInterfaces"
import { TResponseStatus } from "./api_services/globalApiVars"
import { IThemeColors } from "./globalTypes&Interfaces"
import { IQuestion } from "./sharedInterfaces&TypesWithBackend"

export interface IIsGettingReqStoreState {
    isGettingQs: boolean
    isGettingUserInfo: boolean
}
export type TCurrentTheme = "dark" | "light";
interface IErrorStore {
    didAnErrorOccurInGettingQs: boolean,
    didAnErrorOccurInUserAuth: boolean,
}
interface IGameScrnTabStoreState {
    right: number
    wrong: number
    timer: number
    isTimerPaused: boolean
    isGameOn: boolean
    questionTypes: TQuestionTypes[]
    wasSubmitBtnPressed: boolean
}
export interface IChoice {
    value: string
    letter: string
}
export interface IQuestionOnClient extends IQuestion {
    symbolOptions: string[]
}
export interface IQuestionObjActions {
    setQuestions: (questions: IQuestionOnClient[]) => void
    setTask: (task: string) => void
}
export interface IQuestionsStates {
    task: string
    questions: IQuestionOnClient[]
}

export type TUpdateStoreState<TNewState, TFieldName> = {
    updateState: (newState: TNewState, fieldName: TFieldName) => void
}

export type TUpdateStoreStateDynamicType = {
    updateState: <TNewState, TFieldName>(newState: TNewState, fieldName: TFieldName) => void
}

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
export type IQuestionsForObj = IQuestionsStates & TUpdateStoreStateDynamicType
