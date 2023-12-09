import { create } from 'zustand';
import { IQuestion, IQuestionsForObj, TGameScrnTabStore, TIsGettingReqStore } from './zustandStoreTypes&Interfaces';
import { IThemeColors } from '../globalTypes&Interfaces';

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

type TCurrentTheme = "dark" | "light";
interface IColorStore {
    themesObj: IThemeColors
    currentTheme: TCurrentTheme
    setCurrentTheme: (theme: TCurrentTheme) => () => void
}

// NOTES: 
// do I need to store the timer into a global state? 
// when the timer is done, end the game
// store it locally in the GameScrnTab component

// this store will have the following: 
// right: number
// wrong: number
// score: number


export const useGameScrnTabStore = create<TGameScrnTabStore>(set => ({
    right: 0,
    wrong: 0,
    updateState: (newState, fieldName) => () => set(() => ({ [fieldName]: newState }))
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
}))
