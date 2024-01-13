import { View } from "react-native"
import Button from "../../Button"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { useGetAppColors } from "../../../custom_hooks/useGetAppColors";
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from "../../../zustand";
import { useNavigation } from "@react-navigation/native";
import { TStackNavigationProp } from "../../../Navigation";

const BackToMainScrn = ({ stopTimer }: { stopTimer?: () => void }) => {
    const currentThemeObj = useGetAppColors();
    const navigation = useNavigation<TStackNavigationProp>();
    const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const setQuestionsStore = useQuestionsStore(state => state.updateState);
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const setApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);


    function handleBtnPress() {
        setGameScrnTabStore("finished", "mode");
        setGameScrnTabStore(0, "right")
        setGameScrnTabStore(0, "wrong");

        // if questionsForNextQuiz array will not be empty if the user is on the ResultsScreen, 
        // update the questions field when the user wants to go the Results screen.         
        if (questionsForNextQuiz.length) {
            setQuestionsStore(questionsForNextQuiz, "questions");
            setQuestionsStore([], "questionsForNextQuiz");
        } else {
            setQuestionsStore([], "questions");
            setApiQsFetchingStatusStore(true, "willGetQs")
        };

        navigation.navigate("Home");

        if (stopTimer) {
            stopTimer()
        }
    }

    return (
        <Button backgroundColor='none' handleOnPress={handleBtnPress}>
            <View style={{ borderWidth: 3, borderColor: currentThemeObj.second, borderRadius: 50, padding: 8 }}>
                <FontAwesomeIcon icon={faArrowLeft} size={50} color={currentThemeObj.second} />
            </View>
        </Button>
    )
};

export default BackToMainScrn;