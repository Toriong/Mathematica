import { useNavigation } from "@react-navigation/native";
import { TStackNavigationProp } from "../Navigation";
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from '../zustand';


export const useResetLogicQs = () => {
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const setQuestionsStore = useQuestionsStore(state => state.updateState);
    const setApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);

    function resetLogicQs(){
        setGameScrnTabStore("finished", "mode");
        setGameScrnTabStore(0, "right")
        setGameScrnTabStore(0, "wrong");
        setQuestionsStore(0, "questionIndex")

        // questionsForNextQuiz array will not be empty if the user is on the ResultsScreen, 
        // update the questions field when the user wants to go the Results screen.         
        if (questionsForNextQuiz.length) {
            setQuestionsStore(questionsForNextQuiz, "questions");
            setQuestionsStore([], "questionsForNextQuiz");
        } else {
            setQuestionsStore([], "questions");
            setApiQsFetchingStatusStore(true, "willGetQs")
        };
    };

    return resetLogicQs;
}