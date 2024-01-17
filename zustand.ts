import { create } from 'zustand';
import {
    TApiQsFetchingStatusStore,
    IColorStore,
    IQuestionsForObj,
    TCurrentTheme,
    TGameScrnTabStore,
    TIsGettingReqStore,
    TUpdateStoreState,
    IApiQsFetchingStatus,
    IQuestionsStates
} from './zustandStoreTypes&Interfaces';


export const useQuestionsStore = create<IQuestionsForObj>(set => ({
    task: "",
    questions: [],
    questionsForNextQuiz: [],
    questionIndex: 0,
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



export const useGameScrnTabStore = create<TGameScrnTabStore>(set => {
    const gameScrnTabStore: TGameScrnTabStore = {
        right: 0,
        wrong: 0,
        // timer: 120_000,
        timer: 10,
        wasSubmitBtnPressed: false,
        isTimerPaused: false,
        isLoadingModalOn: false,
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
        updateState: (newState: IApiQsFetchingStatus[keyof IApiQsFetchingStatus], fieldName: keyof IApiQsFetchingStatus) => set(() => ({ [fieldName]: newState }))
    }
    return store;
})
