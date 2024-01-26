import Layout from "../../global_components/Layout";
import { View } from 'react-native'
import { PTxt } from "../../global_components/text";
import { useNavigation } from '@react-navigation/native';
import { TScreenNames, TStackNavigation } from "../../Navigation";
import { useColorStore, useGameScrnTabStore, useQuestionsStore } from "../../zustand";
import Button from "../../global_components/Button";
import { Storage } from "../../utils/storage";
import { getUserId, sortRandomly } from "../../utils/generalFns";
import { IQuestionOnClient } from "../../zustandStoreTypes&Interfaces";
import { getHasUserReachedQuizGenerationLimit } from "../../api_services/users/getHasUserReachedQuizGenerationLimit";
import { CustomError } from "../../utils/errors";

const HomeScrnPresentation = () => {
    const navigation = useNavigation<TStackNavigation>();
    const updateGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const updateQuestionStore = useQuestionsStore(state => state.updateState);
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const setQuestionsStore = useQuestionsStore(state => state.updateState);
    const appColors = useColorStore();
    const memory = new Storage();
    const currentAppColors = appColors.themesObj[appColors.currentTheme];

    async function handleOnBtnPress(
        scrnName: TScreenNames,
        types: Exclude<Parameters<typeof updateGameScrnTabStore>[0], number | boolean>,
        gameType?: "logic" | "math"
    ) {
        if ((scrnName === "GameScreen") && questionsForNextQuiz.length && (gameType === "logic")) {
            try {
                await memory.setItem("isGameOn", true);
                const userId = await getUserId() as string;
                const hasUserReachedTheirQuizGenerationLimit = await getHasUserReachedQuizGenerationLimit(userId);
                
                if(hasUserReachedTheirQuizGenerationLimit){
                    throw new CustomError("The user has reached daily limit of quiz generation.", 429);
                }

                updateGameScrnTabStore(types, "questionTypes");
                updateGameScrnTabStore("quiz", "mode");
                updateQuestionStore(0, "questionIndex");
                setQuestionsStore(sortRandomly(questionsForNextQuiz), "questions");
                navigation.navigate(scrnName);
            } catch (error) {
                console.error("An error has occurred: ", error);
            }
            return;
        }

        if ((scrnName === "GameScreen") && (gameType === "logic")) {
            await memory.setItem("isGameOn", true);
            updateGameScrnTabStore(types, "questionTypes");
            updateGameScrnTabStore("quiz", "mode");
            updateQuestionStore(0, "questionIndex");
            navigation.navigate(scrnName);
            return;
        }
    }

    return (
        <Layout>
            <View style={{ display: "flex", flexDirection: 'column', flex: 1 }}>
                <View style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={async _ => { await handleOnBtnPress("GameScreen", ["propositional", "predicate"], "logic") }}
                    >

                        <PTxt>PROPOSITIONAL</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={async _ => { await handleOnBtnPress("GameScreen", ["predicate"]) }}
                    >
                        <PTxt>PREDICATE</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second} handleOnPress={async _ => { await handleOnBtnPress("GameScreen", ["diagrams"]) }}
                    >
                        <PTxt>DIAGRAMS</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second} handleOnPress={async _ => { await handleOnBtnPress("GameScreen", ["diagrams", "predicate", "propositional"]) }}
                    >
                        <PTxt>ALL</PTxt>
                    </Button>
                </View>
            </View>
        </Layout>
    );
};

export default HomeScrnPresentation;