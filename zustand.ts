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

// NOTES: 
// create a axios cancel token for the game screen tab store 
// when the user goes from the Game screen to the Main screen, cancel the request  

export const useGameScrnTabStore = create<TGameScrnTabStore>(set => {    
    const gameScrnTabStore: TGameScrnTabStore = {
        right: 0,
        wrong: 0,
        timer: 120,
        willNotShowLoadingModal: false,
        wasSubmitBtnPressed: false,
        isTimerPaused: false,
        isLoadingModalOn: false,
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
        updateState: (newState: IApiQsFetchingStatus[keyof IApiQsFetchingStatus], fieldName: keyof IApiQsFetchingStatus) => set(() => ({ [fieldName]: newState }))
    }
    return store;
})
