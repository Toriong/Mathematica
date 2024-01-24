import { CancelToken } from 'axios';
import { TQuestionTypes } from './Screens/GameScrn/typesAndInterfaces';
import { TResponseStatus } from "./api_services/globalApiVars"
import { IThemeColors } from "./globalTypes&Interfaces"
import { IQuestion } from "./sharedInterfaces&TypesWithBackend"
import axios from 'axios';

export interface IIsGetReqStoreState {
    isGettingQs: boolean
    isGettingUserInfo: boolean
}
export type TCurrentTheme = "dark" | "light";
interface IErrorStore {
    didAnErrorOccurInGettingQs: boolean,
    didAnErrorOccurInUserAuth: boolean,
}
type TMode = "quiz" | "review" | "finished";
export type TCancelTokenSource = ReturnType<typeof axios.CancelToken.source>;
interface IGameScrnTabStoreState {
    right: number
    wrong: number
    timer: number
    isTimerOn: boolean
    isLoadingModalOn: boolean
    wasSubmitBtnPressed: boolean
    willResetGetAdditionalQCancelTokenSource: boolean
    willResetGetInitialQsTokenSource: boolean
    getAddtionalQCancelTokenSource: TCancelTokenSource
    getInitialQsCancelTokenSource: TCancelTokenSource
    mode: TMode
    willNotShowLoadingModal: boolean
    questionTypes: TQuestionTypes[]
}
export interface IChoice {
    value: string
    letter: string
}
export interface IQuestionOnClient extends Omit<IQuestion, "_id"> {
    _id: string
    symbolOptions: string[]
}
export interface IQuestionObjActions {
    setQuestions: (questions: IQuestionOnClient[]) => void
    setTask: (task: string) => void
}
export type TNumberToGetForEachQuestionType = Partial<Record<TQuestionTypes, number>>;
export interface IQuestionsStates {
    task: string
    questions: IQuestionOnClient[]
    questionsForNextQuiz: IQuestionOnClient[]
    questionIndex: number
    numberToGetForEachQuestionType: TNumberToGetForEachQuestionType

}

export type TUpdateStoreState<TNewState, TFieldName> = {
    updateState: (newState: TNewState, fieldName: TFieldName) => void
}
export type TUpdateStoreStateDynamicType = {
    updateState: (newState: IQuestionsStates[keyof IQuestionsStates], fieldName: keyof IQuestionsStates) => void
}

export interface IColorStore {
    themesObj: IThemeColors
    currentTheme: TCurrentTheme
    setCurrentTheme: (theme: TCurrentTheme) => () => void
}
type TPointOfFailure = "submitBtnPress" | "gettingInitialQs" | null;
export interface IApiQsFetchingStatus {
    willGetQs: boolean
    areQsReceivedForNextQuiz: boolean
    gettingQsResponseStatus: TResponseStatus
    pointOfFailure: TPointOfFailure
}

export type TApiQsFetchingStatusStore = IApiQsFetchingStatus & TUpdateStoreState<IApiQsFetchingStatus[keyof IApiQsFetchingStatus], keyof IApiQsFetchingStatus>
export type TErrorStore = IErrorStore & TUpdateStoreState<boolean, keyof IErrorStore>
export type TGameScrnTabStore = IGameScrnTabStoreState & TUpdateStoreState<IGameScrnTabStoreState[keyof IGameScrnTabStoreState], keyof IGameScrnTabStoreState>
export type TIsGettingReqStore = IIsGetReqStoreState & TUpdateStoreState<boolean, keyof IIsGetReqStoreState>
export type IQuestionsForObj = IQuestionsStates & TUpdateStoreStateDynamicType
