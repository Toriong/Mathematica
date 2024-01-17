import { useGameScrnTabStore, useQuestionsStore } from '../zustand';
import { IQuestionOnClient } from "../zustandStoreTypes&Interfaces";
import { structuredClone } from "../globalVars";


export const useResetLogicQs = () => {
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const questionIndex = useQuestionsStore(state => state.questionIndex);
    const questions = useQuestionsStore(state => state.questions);
    const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const setQuestionsStore = useQuestionsStore(state => state.updateState);

    function resetLogicQs() {
        let unansweredQs = (questionIndex === 0) ? questions.slice(1) : questions.filter(question => !question.userAnswer);
        unansweredQs = structuredClone(unansweredQs)
        const questionsForNextQuizUpdated = questionsForNextQuiz?.length ? [...unansweredQs, ...questionsForNextQuiz] : unansweredQs;

        if (questionsForNextQuizUpdated.length) {
            setQuestionsStore(questionsForNextQuizUpdated, "questionsForNextQuiz");
            return;
        }

        setGameScrnTabStore("finished", "mode");
        setGameScrnTabStore(0, "right")
        setGameScrnTabStore(0, "wrong")
        setQuestionsStore([], "questions");


    };

    return resetLogicQs;
}