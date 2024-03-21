import { create } from 'zustand';
import {
    TApiQsFetchingStatusStore,
    IColorStore,
    IQuestionsForObj,
    TCurrentTheme,
    TGameScrnTabStore,
    TIsGettingReqStore,
    IApiQsFetchingStatus,
    IQuestionsStates,
    TMathGameInfoStore,
    IMathGameInfoStates,
} from './zustandStoreTypes&Interfaces';
import axios from 'axios';

export const useQuestionsStore = create<IQuestionsForObj>(set => ({
    task: "",
    questions: [],
    questionsForNextQuiz: [],
    questionIndex: 0,
    numberToGetForEachQuestionType: {
        diagrams: 3,
        predicate: 3,
        propositional: 3
    },
    updateState: (newState: IQuestionsForObj[keyof IQuestionsForObj], fieldName: keyof IQuestionsStates) => set(() => ({ [fieldName]: newState })),
}));
export const useErrorsStore = create(set => ({
    didAnErrorOccurInGettingQs: false,
    didAnErrorOccurInUserAuth: false,
    setDidAnErrorOccurInGettingQs: (didAnErrorOccurInGettingQs: boolean) => set(() => ({
        didAnErrorOccurInGettingQs: didAnErrorOccurInGettingQs
    }))
}));
export const useRequestStatusStore = create<TIsGettingReqStore>(set => ({
    isGettingQs: true,
    isGettingUserInfo: false,
    updateState: (newState: boolean, fieldName: keyof TIsGettingReqStore) => set(() => ({ [fieldName]: newState }))
}));
export const useMathGameStore = create<TMathGameInfoStore>(set => {
    const mathGameInfo = {
        difficulty: 'easy',
        gameType: 'addition',
        isQuizTimed: true,
        isTimerOn: false,
        mode: 'quiz',
        right: 0,
        wrong: 0,
        timer: 120,
        // min questions is 20
        // max qs is 200
        totalQs: 40,
        wasSubmitBtnPressed: false,
        updateState: (newState: IMathGameInfoStates[keyof IMathGameInfoStates], fieldName: keyof IMathGameInfoStates) => set(() => ({ [fieldName]: newState }))
    } satisfies TMathGameInfoStore;

    return mathGameInfo;
})
export const useGameScrnTabStore = create<TGameScrnTabStore>(set => {
    const gameScrnTabStore: TGameScrnTabStore = {
        right: 0,
        wrong: 0,
        timer: 120,
        willNotShowLoadingModal: false,
        wasSubmitBtnPressed: false,
        isTimerOn: true,
        isLoadingModalOn: false,
        willResetGetAdditionalQCancelTokenSource: true,
        willResetGetInitialQsTokenSource: true,
        getAddtionalQCancelTokenSource: axios.CancelToken.source(),
        getInitialQsCancelTokenSource: axios.CancelToken.source(),
        mode: "finished",
        questionTypes: [],
        updateState: (newState: TGameScrnTabStore[keyof TGameScrnTabStore], fieldName: keyof TGameScrnTabStore) => set(() => ({ [fieldName]: newState }))
    }

    return gameScrnTabStore;
})

export const useColorStore = create<IColorStore>(set => ({
    themesObj: {
        dark: {
            first: '#343541',
            second: '#6B7280',
            third: '#FFFFFF'
        },
        light: {
            first: '#343541',
            second: '#6B7280',
            third: '#FFFFFF'
        }
    },
    currentTheme: "dark",
    setCurrentTheme: (theme: TCurrentTheme) => () => set(() => ({ currentTheme: theme }))
}));
export const useApiQsFetchingStatusStore = create<TApiQsFetchingStatusStore>(set => {
    let store: TApiQsFetchingStatusStore = {
        willGetQs: true,
        gettingQsResponseStatus: "NOT_EXECUTING",
        areQsReceivedForNextQuiz: false,
        pointOfFailure: null,
        updateState: (newState: IApiQsFetchingStatus[keyof IApiQsFetchingStatus], fieldName: keyof IApiQsFetchingStatus) => set(() => ({ [fieldName]: newState }))
    }
    return store;
})
