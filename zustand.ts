import { create } from 'zustand';
import { TApiQsFetchingStatusStore, IColorStore, IQuestion, IQuestionsForObj, TCurrentTheme, TGameScrnTabStore, TIsGettingReqStore, TUpdateStoreState, IApiQsFetchingStatus } from './zustandStoreTypes&Interfaces';
import { IThemeColors } from './globalTypes&Interfaces';

export const useQuestionsStore = create<IQuestionsForObj>(set => ({
    task: "",
    questions: [],
    setQuestions: (questions: IQuestion[]) => set(() => ({ questions: questions })),
    setTask: (task: string) => set(() => ({ task: task }))
}));

export const useErrorsStore = create(set => ({
    didAnErrorOccurInGettingQs: false,
    didAnErrorOccurInUserAuth: false,
    setDidAnErrorOccurInGettingQs: (didAnErrorOccurInGettingQs: boolean) => set(() => ({
        didAnErrorOccurInGettingQs: didAnErrorOccurInGettingQs
    }))
}));

export const useIsGettingReqStore = create<TIsGettingReqStore>(set => ({
    isGettingQs: true,
    isGettingUserInfo: false,
    updateState: (newState: boolean, fieldName: keyof TIsGettingReqStore) => set(() => ({ [fieldName]: newState }))
}));

export const useGameScrnTabStore = create<TGameScrnTabStore>(set => ({
    right: 0,
    wrong: 0,
    wasSubmitBtnPressed: false,
    isTimerPaused: false,
    timer: 120_000,
    isGameOn: true,
    updateState: (newState: boolean | number, fieldName: keyof TGameScrnTabStore) => set(() => ({ [fieldName]: newState }))
}))

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
        updateState: (newState: IApiQsFetchingStatus[keyof IApiQsFetchingStatus], fieldName: keyof IApiQsFetchingStatus) => set(() => ({ [fieldName]: newState }))
    }
    return store;
})
