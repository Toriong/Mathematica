import { create } from 'zustand';
import { IQuestion, IQuestionsForObj } from './zustandStoreTypes&Interfaces';

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
export const useIsGettingReqStore = create(set => ({
    isGettingQs: false,
    updateState: (isGettingsQs: boolean, stateNameStr: string) => set(() => ({
        [stateNameStr]: isGettingsQs
    })) 
})) 
